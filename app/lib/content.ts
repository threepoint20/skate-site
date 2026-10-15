// 文章內容處理：Markdown 轉 HTML + DOMPurify 白名單清理
// 前端顯示與後端儲存驗證共用同一套規則。
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

// 只允許 YouTube 嵌入影片
const ALLOWED_IFRAME_SRC = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\/[\w-]+(\?[\w=&%.-]*)?$/i;

export function isAllowedIframeSrc(src: string | null | undefined): boolean {
  return !!src && ALLOWED_IFRAME_SRC.test(src.trim());
}

const SANITIZE_CONFIG = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'referrerpolicy', 'loading', 'target'],
  FORBID_TAGS: ['form', 'input', 'button', 'textarea', 'select', 'option', 'style', 'meta', 'base', 'link', 'object', 'embed', 'svg', 'math'],
  FORBID_ATTR: ['style', 'srcdoc'],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/|#)/i,
};

let blockedIframes = 0;
let hooksInstalled = false;

function ensureHooks() {
  if (hooksInstalled) return;
  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
      const el = node as Element;
      if (!isAllowedIframeSrc(el.getAttribute('src'))) {
        blockedIframes++;
        el.parentNode?.removeChild(el);
      }
    }
  });
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    const el = node as Element;
    if (el.tagName === 'A' && el.getAttribute('target') === '_blank') {
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });
  hooksInstalled = true;
}

function markdownToHtml(content: string): string {
  return marked.parse(content || '', { async: false, gfm: true, breaks: true }) as string;
}

// 將 Markdown（可含少量 HTML 與 YouTube iframe）轉為安全的 HTML
export function renderMarkdown(content: string): string {
  ensureHooks();
  return DOMPurify.sanitize(markdownToHtml(content), SANITIZE_CONFIG) as string;
}

// 後端儲存前驗證：若清理過程中有任何元素/屬性被移除，視為不合法內容
export function findUnsafeContent(content: string): string | null {
  ensureHooks();
  blockedIframes = 0;
  DOMPurify.sanitize(markdownToHtml(content), SANITIZE_CONFIG);
  if (blockedIframes > 0) {
    return '內容包含不允許的 iframe（僅允許 YouTube 嵌入影片 https://www.youtube.com/embed/...）';
  }
  const removed = DOMPurify.removed || [];
  if (removed.length > 0) {
    const first = removed[0] as { element?: Element; attribute?: Attr };
    const what = first.attribute
      ? `屬性「${first.attribute.name}」`
      : first.element
        ? `標籤 <${(first.element.nodeName || '').toLowerCase()}>`
        : '不安全的內容';
    return `內容包含不允許的 HTML：${what}`;
  }
  return null;
}
