'use client';

import { useState, useEffect } from 'react';
import { getImagesByCategory, SiteImage } from '../lib/imageManager';
import { getSiteContent, DEFAULT_CONTENT } from '../lib/siteContent';
import PageHero from '../components/PageHero';
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbs } from '../lib/breadcrumbs';

export default function About() {
  const [aboutImages, setAboutImages] = useState<SiteImage[]>([]);
  const [content, setContent] = useState<Record<string, string>>(DEFAULT_CONTENT);
  const breadcrumbs = generateBreadcrumbs('/about');
  const t = (key: string) => content[key] ?? '';

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getImagesByCategory('about');
        setAboutImages(images);
      } catch (error) {
        console.error('Error loading about images:', error);
        setAboutImages([]);
      }
    };

    loadImages();
    getSiteContent().then(setContent);
  }, []);

  // 取得特定用途的圖片
  const getImageByName = (name: string) => {
    return aboutImages.find(img => img.name.toLowerCase().includes(name.toLowerCase()));
  };
  
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <PageHero
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        category="hero-about"
        defaultGradient="from-gray-900 to-gray-700"
      />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Story Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{t('about.story.title')}</h2>
          <div className="prose prose-lg mx-auto text-gray-700">
            <p>{t('about.story.p1')}</p>
            <p>{t('about.story.p2')}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">{t('about.values.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">{t('about.values.1.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.1.desc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🛹</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">{t('about.values.2.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.2.desc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">{t('about.values.3.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{t('about.team.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                {getImageByName('alex') || getImageByName('創辦人') || getImageByName('主教練') ? (
                  <img
                    src={(getImageByName('alex') || getImageByName('創辦人') || getImageByName('主教練'))!.url}
                    alt="Alex Chen"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Alex</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold">{t('about.team.1.name')}</h3>
              <p className="text-gray-600">{t('about.team.1.role')}</p>
              <p className="mt-2 text-sm text-gray-500">
                {t('about.team.1.bio')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                {getImageByName('sarah') || getImageByName('活動策劃') ? (
                  <img
                    src={(getImageByName('sarah') || getImageByName('活動策劃'))!.url}
                    alt="Sarah Lin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Sarah</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold">{t('about.team.2.name')}</h3>
              <p className="text-gray-600">{t('about.team.2.role')}</p>
              <p className="mt-2 text-sm text-gray-500">
                {t('about.team.2.bio')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                {getImageByName('mike') || getImageByName('技術指導') ? (
                  <img
                    src={(getImageByName('mike') || getImageByName('技術指導'))!.url}
                    alt="Mike Wang"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Mike</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold">{t('about.team.3.name')}</h3>
              <p className="text-gray-600">{t('about.team.3.role')}</p>
              <p className="mt-2 text-sm text-gray-500">
                {t('about.team.3.bio')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}