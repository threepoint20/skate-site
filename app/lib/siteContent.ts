// 網站文字內容管理系統
// 讓管理員在 /admin/content 編輯各頁面文字，無需修改程式碼。
// 未編輯過的欄位一律回傳 CONTENT_FIELDS 中的預設值（即原本寫死的文字）。

export interface ContentField {
  key: string;        // 例如 'about.story.p1'
  page: string;       // 後台分組顯示名稱
  label: string;      // 欄位顯示名稱
  default: string;    // 預設文字
  multiline?: boolean;
}

// 可編輯欄位清單。新增欄位：加一筆到這裡 + 在對應頁面用 t('key') 取代寫死的文字
export const CONTENT_FIELDS: ContentField[] = [
  // ===== 首頁 =====
  { key: 'home.hero.title', page: '首頁', label: '主標題', default: 'Skate like a Fairy/Superman' },
  { key: 'home.hero.subtitle', page: '首頁', label: '副標題', default: '推廣滑板文化、社群活動與教育，打造更友善、更包容的滑板環境。' },
  { key: 'home.mission.title', page: '首頁', label: '使命區塊標題', default: '我們的使命' },
  { key: 'home.mission.text', page: '首頁', label: '使命內容', multiline: true, default: '我們相信滑板不只是運動，更是一種文化、一種力量。透過課程、活動與社群，我們希望讓更多人能安全、自在地接觸滑板，並在其中找到自信與歸屬感。' },
  { key: 'home.activity.title', page: '首頁', label: '活動照片區塊標題', default: '活動照片' },
  { key: 'home.blog.title', page: '首頁', label: '最新文章區塊標題', default: '最新文章' },

  // ===== 關於我們 =====
  { key: 'about.hero.title', page: '關於我們', label: '主標題', default: '關於我們' },
  { key: 'about.hero.subtitle', page: '關於我們', label: '副標題', default: '我們致力於推廣滑板文化，建立一個包容、友善的滑板社群' },
  { key: 'about.story.title', page: '關於我們', label: '故事區塊標題', default: '我們的故事' },
  { key: 'about.story.p1', page: '關於我們', label: '故事第一段', multiline: true, default: '滑板不僅僅是一項運動，它是一種生活方式，一種表達自我的方式。我們的團隊由一群熱愛滑板的人組成，從初學者到專業選手，我們都有一個共同的目標：讓更多人體驗滑板的魅力。' },
  { key: 'about.story.p2', page: '關於我們', label: '故事第二段', multiline: true, default: '成立於2020年，我們從一個小小的滑板聚會開始，逐漸發展成為一個活躍的社群。我們舉辦各種活動，從基礎教學到進階技巧分享，從街頭滑板到競技比賽。' },
  { key: 'about.values.title', page: '關於我們', label: '價值觀區塊標題', default: '我們的價值觀' },
  { key: 'about.values.1.title', page: '關於我們', label: '價值觀 1 標題', default: '包容性' },
  { key: 'about.values.1.desc', page: '關於我們', label: '價值觀 1 說明', multiline: true, default: '歡迎所有人加入，不論年齡、性別、技能水平' },
  { key: 'about.values.2.title', page: '關於我們', label: '價值觀 2 標題', default: '技能發展' },
  { key: 'about.values.2.desc', page: '關於我們', label: '價值觀 2 說明', multiline: true, default: '提供專業指導，幫助每個人提升滑板技能' },
  { key: 'about.values.3.title', page: '關於我們', label: '價值觀 3 標題', default: '社群精神' },
  { key: 'about.values.3.desc', page: '關於我們', label: '價值觀 3 說明', multiline: true, default: '建立緊密的社群關係，互相支持與鼓勵' },
  { key: 'about.team.title', page: '關於我們', label: '團隊區塊標題', default: '核心團隊' },
  { key: 'about.team.1.name', page: '關於我們', label: '成員 1 姓名', default: 'Alex Chen' },
  { key: 'about.team.1.role', page: '關於我們', label: '成員 1 職稱', default: '創辦人 & 主教練' },
  { key: 'about.team.1.bio', page: '關於我們', label: '成員 1 簡介', multiline: true, default: '15年滑板經驗，專精街頭滑板與教學' },
  { key: 'about.team.2.name', page: '關於我們', label: '成員 2 姓名', default: 'Sarah Lin' },
  { key: 'about.team.2.role', page: '關於我們', label: '成員 2 職稱', default: '活動策劃' },
  { key: 'about.team.2.bio', page: '關於我們', label: '成員 2 簡介', multiline: true, default: '負責社群活動規劃與執行' },
  { key: 'about.team.3.name', page: '關於我們', label: '成員 3 姓名', default: 'Mike Wang' },
  { key: 'about.team.3.role', page: '關於我們', label: '成員 3 職稱', default: '技術指導' },
  { key: 'about.team.3.bio', page: '關於我們', label: '成員 3 簡介', multiline: true, default: '專業滑板選手，競技滑板專家' },

  // ===== 滑板指南 =====
  { key: 'guides.hero.title', page: '滑板指南', label: '主標題', default: '滑板指南' },
  { key: 'guides.hero.subtitle', page: '滑板指南', label: '副標題', default: '從基礎到進階，完整的滑板學習資源' },

  // ===== 滑板裝備 =====
  { key: 'equipment.hero.title', page: '滑板裝備', label: '主標題', default: '滑板裝備' },
  { key: 'equipment.hero.subtitle', page: '滑板裝備', label: '副標題', default: '了解滑板的各個組件，選擇最適合你的裝備' },

  // ===== 聯絡我們 =====
  { key: 'contact.hero.title', page: '聯絡我們', label: '主標題', default: '聯絡我們' },
  { key: 'contact.hero.subtitle', page: '聯絡我們', label: '副標題', default: '有任何問題或建議？我們很樂意聽到您的聲音' },
];

// 允許寫入的 key（API 驗證用，防止任意 key 注入）
export const CONTENT_KEYS = new Set(CONTENT_FIELDS.map(f => f.key));

// 預設值對照表（頁面初始渲染直接使用，與原本寫死的文字一致）
export const DEFAULT_CONTENT: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map(f => [f.key, f.default])
);

// 快取（與 imageManager 相同的模式）
const CONTENT_CACHE_TTL = 60 * 1000;
let contentPromise: Promise<Record<string, string>> | null = null;
let contentFetchedAt = 0;

export function invalidateContentCache() {
  contentPromise = null;
  contentFetchedAt = 0;
}

// 讀取所有內容（預設值 + 資料庫覆寫）
export async function getSiteContent(options: { fresh?: boolean } = {}): Promise<Record<string, string>> {
  const expired = Date.now() - contentFetchedAt > CONTENT_CACHE_TTL;
  if (options.fresh || !contentPromise || expired) {
    contentFetchedAt = Date.now();
    contentPromise = (async () => {
      try {
        const response = await fetch('/api/content', {
          cache: 'no-store',
          credentials: 'include',
        });
        if (!response.ok) return { ...DEFAULT_CONTENT };
        const stored: Record<string, string> = await response.json();
        return { ...DEFAULT_CONTENT, ...stored };
      } catch (error) {
        console.error('Error fetching site content:', error);
        invalidateContentCache();
        return { ...DEFAULT_CONTENT };
      }
    })();
  }
  return contentPromise;
}

// 批次更新內容（需要管理員權限）
export async function updateSiteContent(updates: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ updates }),
    });
    invalidateContentCache();
    return response.ok;
  } catch (error) {
    console.error('Error updating site content:', error);
    return false;
  }
}
