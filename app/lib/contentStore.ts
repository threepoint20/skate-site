// 網站文字內容儲存層 - 支援本地檔案系統與 Neon PostgreSQL
import fs from 'fs';
import path from 'path';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { siteContent } from './schema';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'site-content.json');

const hasNeonDb = () => !!process.env.DATABASE_URL;

// Vercel 的檔案系統是唯讀的，正式環境不能用檔案模式寫入
function assertWritableFileStore() {
  if (process.env.VERCEL) {
    throw new Error('正式環境未設定 DATABASE_URL：Vercel 檔案系統為唯讀，無法寫入資料。請設定 Neon DATABASE_URL。');
  }
}

let neonDb: NeonHttpDatabase | null = null;
let tableReady: Promise<void> | null = null;

async function getNeon(): Promise<NeonHttpDatabase> {
  if (!neonDb) {
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    neonDb = drizzle(neon(process.env.DATABASE_URL!));
  }
  // 首次使用時自動建表（idempotent），省去手動 migration
  if (!tableReady) {
    tableReady = (async () => {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL!);
      await sql`CREATE TABLE IF NOT EXISTS "site_content" (
        "key" text PRIMARY KEY NOT NULL,
        "value" text NOT NULL,
        "updated_at" timestamp DEFAULT now()
      )`;
    })();
    tableReady.catch(() => { tableReady = null; });
  }
  await tableReady;
  return neonDb;
}

function ensureDataDirectory() {
  const dataDir = path.dirname(CONTENT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readContentFile(): Record<string, string> {
  ensureDataDirectory();
  if (!fs.existsSync(CONTENT_FILE)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    return typeof data === 'object' && data !== null && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

// 讀取所有已覆寫的內容（不含預設值）
export async function getAllContentFromDB(): Promise<Record<string, string>> {
  try {
    if (hasNeonDb()) {
      const db = await getNeon();
      const rows = await db.select().from(siteContent);
      return Object.fromEntries(rows.map(r => [r.key, r.value]));
    }
    return readContentFile();
  } catch (error) {
    console.error('Error reading site content:', error);
    return {};
  }
}

// 批次寫入內容覆寫（upsert）
export async function upsertContentInDB(updates: Record<string, string>): Promise<boolean> {
  const entries = Object.entries(updates);
  if (entries.length === 0) return true;
  try {
    if (hasNeonDb()) {
      const db = await getNeon();
      for (const [key, value] of entries) {
        await db.insert(siteContent)
          .values({ key, value })
          .onConflictDoUpdate({
            target: siteContent.key,
            set: { value, updatedAt: new Date() },
          });
      }
      return true;
    }
    assertWritableFileStore();
    ensureDataDirectory();
    const content = { ...readContentFile(), ...updates };
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving site content:', error);
    return false;
  }
}
