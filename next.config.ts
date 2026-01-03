import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 外部套件配置
  serverExternalPackages: ['@neondatabase/serverless'],
  // 圖片最佳化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
