import { SiteImage, imageCategories } from './imageManager';
import { validateText } from './security';

// 驗證圖片欄位，partial = true 時只檢查有傳入的欄位
export function validateImageInput(data: Partial<SiteImage>, partial: boolean): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return '請提供有效的圖片資料';
  const required = !partial;
  if (!validateText(data.name, 200, required)) return '圖片名稱為必填且最多 200 字';
  if (!validateText(data.alt, 300, required)) return '替代文字為必填且最多 300 字';
  if (!validateText(data.url, 2000, required)) return '圖片網址為必填';
  if (data.url && !/^(https:\/\/|\/)[^\s"'()<>]*$/.test(data.url)) return '圖片網址必須是 https:// 或站內路徑，且不可包含空白或括號';
  if (!validateText(data.description, 1000, false)) return '描述最多 1000 字';
  if (data.category !== undefined && !(data.category in imageCategories)) return '圖片分類不正確';
  if (required && data.category === undefined) return '請選擇圖片分類';
  if (data.order !== undefined && !Number.isInteger(data.order)) return '順序必須是整數';
  return null;
}
