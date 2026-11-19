'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, BlogPost } from './lib/blogData';
import { getImagesByCategory, SiteImage } from './lib/imageManager';
import { getSiteContent, DEFAULT_CONTENT } from './lib/siteContent';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [activityImages, setActivityImages] = useState<SiteImage[]>([]);
  const [heroImages, setHeroImages] = useState<SiteImage[]>([]);
  const [content, setContent] = useState<Record<string, string>>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const t = (key: string) => content[key] ?? '';

  useEffect(() => {
    const loadContent = async () => {
      try {
        const posts = await getAllPosts();

        // 取得最新的 3 篇已發布文章
        const publishedPosts = posts
          .filter(post => post.status === '已發布')
          .slice(0, 3);

        setLatestPosts(publishedPosts);

        // 載入活動照片
        const images = await getImagesByCategory('activity');
        setActivityImages(images.slice(0, 3)); // 只取前 3 張

        // 載入首頁橫幅圖片
        const heroImgs = await getImagesByCategory('hero');
        setHeroImages(heroImgs.slice(0, 1)); // 只取第一張作為背景

        // 載入可編輯的頁面文字
        setContent(await getSiteContent());
      } catch (error) {
        console.error('Error loading content:', error);
        // 如果載入失敗，顯示錯誤狀態
        setLatestPosts([]);
        setActivityImages([]);
        setHeroImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section 
        className="px-6 py-32 text-center relative"
        style={heroImages.length > 0 ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImages[0].url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        <div className={heroImages.length > 0 ? 'relative z-10' : ''}>
          <h1 className={`text-5xl md:text-7xl font-bold tracking-tight ${heroImages.length > 0 ? 'text-white' : ''}`}>
            {t('home.hero.title')}
          </h1>
          <p className={`mt-6 text-lg md:text-xl max-w-2xl mx-auto ${heroImages.length > 0 ? 'text-gray-200' : 'text-gray-500'}`}>
            {t('home.hero.subtitle')}
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/about"
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition ${
                heroImages.length > 0 
                  ? 'bg-white text-black hover:bg-gray-100' 
                  : 'bg-black text-white hover:opacity-80'
              }`}
            >
              認識我們
            </a>
            <a
              href="/guides"
              className={`px-6 py-3 border rounded-lg text-lg font-semibold transition ${
                heroImages.length > 0
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-black hover:bg-black hover:text-white'
              }`}
            >
              滑板指南
            </a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-24 bg-gray-100 text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold">{t('home.mission.title')}</h2>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            {t('home.mission.text')}
          </p>
        </div>
      </section>

      {/* Activity Photos Section */}
      <section className="px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-10">{t('home.activity.title')}</h2>

        {activityImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {activityImages.map((image) => (
              <div key={image.id} className="relative h-64 w-full rounded-xl shadow-md overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { src: '/activity1.png', alt: '滑板活動照片 1' },
              { src: '/activity2.png', alt: '滑板活動照片 2' },
              { src: '/activity3.png', alt: '滑板活動照片 3' },
            ].map((img) => (
              <div key={img.src} className="relative h-64 w-full rounded-xl shadow-md overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Blog Preview Section */}
      <section className="px-6 py-24 bg-gray-50 text-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center">{t('home.blog.title')}</h2>

          {loading ? (
            <div className="mt-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-2 text-gray-600">載入中...</p>
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="p-6 border rounded-xl hover:shadow-lg transition cursor-pointer bg-white">
                    {post.coverImage && (
                      <div className="relative w-full h-40 rounded-lg mb-4 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center">
              <p className="text-gray-600">目前還沒有文章，敬請期待！</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="px-6 py-3 border border-black rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition"
            >
              查看全部文章
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}