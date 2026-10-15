// 文章輸入驗證（伺服器端）
import { BlogPost } from './blogData';
import { validateText } from './security';
import { findUnsafeContent } from './content';

const STATUSES = ['已發布', '草稿'];

// 回傳錯誤訊息；通過則回傳 null。partial = true 時只驗證有傳入的欄位
export function validatePostInput(data: Partial<BlogPost>, partial: boolean): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return '請提供有效的文章資料';
  const required = !partial;

  if (!validateText(data.title, 200, required)) return '文章標題為必填且最多 200 字';
  if (!validateText(data.content, 50000, required)) return '文章內容為必填且最多 50000 字';
  if (!validateText(data.category, 50, required)) return '請選擇文章分類';
  if (!validateText(data.excerpt, 1000, false)) return '摘要最多 1000 字';
  if (!validateText(data.author, 100, false)) return '作者最多 100 字';
  if (!validateText(data.readTime, 50, false)) return '閱讀時間格式不正確';
  if (!validateText(data.coverImage, 2000, false)) return '封面圖片網址格式不正確';
  if (data.coverImage && !/^(https:\/\/|\/)/.test(data.coverImage)) return '封面圖片網址必須是 https:// 或站內路徑';
  if (data.status !== undefined && !STATUSES.includes(data.status)) return '文章狀態不正確';
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some(t => typeof t !== 'string' || t.length > 50))) {
    return '標籤格式不正確';
  }
  if (data.views !== undefined && (!Number.isInteger(data.views) || data.views < 0)) return '瀏覽數格式不正確';

  if (typeof data.content === 'string') {
    const unsafe = findUnsafeContent(data.content);
    if (unsafe) return unsafe;
  }
  return null;
}
