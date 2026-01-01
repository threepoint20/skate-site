// 安全工具函數
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

// JWT 相關
export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

// 生成 JWT token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  } as jwt.SignOptions);
}

// 驗證 JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// 密碼雜湊
export async function hashPassword(password: string): Promise<string> {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  return bcrypt.hash(password, rounds);
}

// 驗證密碼
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 從請求中提取 token
export function extractTokenFromRequest(request: NextRequest): string | null {
  // 檢查 Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 檢查 cookie
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

// 驗證請求中的認證
export function verifyRequestAuth(request: NextRequest): JWTPayload | null {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

// Rate limiting (簡單實作)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 100, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// 清理過期的 rate limit 記錄
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// 獲取客戶端 IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// 安全標頭
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  };
}

// 輸入驗證 - 允許安全的 HTML 內容
export function validateInput(input: string, maxLength = 1000): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  if (input.length > maxLength) {
    console.log('Input validation failed: content too long', {
      length: input.length,
      maxLength
    });
    return false;
  }
  
  // 檢查是否包含惡意腳本（但允許安全的 iframe）
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<object/i,
    /<embed/i,
  ];
  
  // 檢查惡意模式
  const matchedDangerousPattern = dangerousPatterns.find(pattern => pattern.test(input));
  if (matchedDangerousPattern) {
    console.log('Input validation failed: dangerous pattern detected', {
      pattern: matchedDangerousPattern.toString(),
      input: input.substring(0, 200) + '...'
    });
    return false;
  }
  
  // 如果包含 iframe，檢查是否為安全來源
  if (/<iframe/i.test(input)) {
    const isValidIframe = validateIframe(input);
    if (!isValidIframe) {
      console.log('Input validation failed: invalid iframe');
    }
    return isValidIframe;
  }
  
  return true;
}

// 驗證 iframe 是否來自安全來源
function validateIframe(input: string): boolean {
  // 允許的安全來源
  const safeSources = [
    // YouTube
    /src="https:\/\/www\.youtube\.com\/embed\//i,
    /src="https:\/\/www\.youtube-nocookie\.com\/embed\//i,
    // Vimeo
    /src="https:\/\/player\.vimeo\.com\/video\//i,
    // Dailymotion
    /src="https:\/\/www\.dailymotion\.com\/embed\//i,
    // Google Maps
    /src="https:\/\/www\.google\.com\/maps\/embed/i,
    /src="https:\/\/maps\.google\.com\/maps/i,
    // Google My Maps
    /src="https:\/\/www\.google\.com\/maps\/d\/embed/i,
  ];
  
  // 檢查是否包含安全來源
  const hasSafeSource = safeSources.some(pattern => pattern.test(input));
  
  if (!hasSafeSource) {
    console.log('Iframe validation failed: unsafe source detected', {
      input: input.substring(0, 200) + '...',
      matchedPatterns: safeSources.map(pattern => pattern.test(input))
    });
    return false;
  }
  
  // 檢查 iframe 是否包含危險屬性
  const dangerousIframePatterns = [
    /on\w+\s*=/i,
    /javascript:/i,
    /data:/i,
    /srcdoc=/i,
  ];
  
  const hasDangerousPattern = dangerousIframePatterns.some(pattern => pattern.test(input));
  
  if (hasDangerousPattern) {
    console.log('Iframe validation failed: dangerous pattern detected', {
      input: input.substring(0, 200) + '...',
      dangerousPatterns: dangerousIframePatterns.map(pattern => pattern.test(input))
    });
    return false;
  }
  
  return true;
}

// 清理 HTML 輸入
export function sanitizeHTML(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}