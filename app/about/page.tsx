'use client';

import { useState, useEffect } from 'react';
import { getImagesByCategory, SiteImage } from '../lib/imageManager';
import PageHero from '../components/PageHero';
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbs } from '../lib/breadcrumbs';

export default function About() {
  const [aboutImages, setAboutImages] = useState<SiteImage[]>([]);
  const breadcrumbs = generateBreadcrumbs('/about');

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
  }, []);

  // 取得特定用途的圖片
  const getImageByName = (name: string) => {
    return aboutImages.find(img => img.name.toLowerCase().includes(name.toLowerCase()));
  };
  
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <PageHero
        title="關於我們"
        subtitle="我們致力於推廣滑板文化，建立一個包容、友善的滑板社群"
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
          <h2 className="text-4xl font-bold text-center mb-12">我們的故事</h2>
          <div className="prose prose-lg mx-auto text-gray-700">
            <p>
              滑板不僅僅是一項運動，它是一種生活方式，一種表達自我的方式。
              我們的團隊由一群熱愛滑板的人組成，從初學者到專業選手，
              我們都有一個共同的目標：讓更多人體驗滑板的魅力。
            </p>
            <p>
              成立於2020年，我們從一個小小的滑板聚會開始，
              逐漸發展成為一個活躍的社群。我們舉辦各種活動，
              從基礎教學到進階技巧分享，從街頭滑板到競技比賽。
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">我們的價值觀</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">包容性</h3>
              <p className="text-gray-600">
                歡迎所有人加入，不論年齡、性別、技能水平
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🛹</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">技能發展</h3>
              <p className="text-gray-600">
                提供專業指導，幫助每個人提升滑板技能
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">社群精神</h3>
              <p className="text-gray-600">
                建立緊密的社群關係，互相支持與鼓勵
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">核心團隊</h2>
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
              <h3 className="text-xl font-semibold">Alex Chen</h3>
              <p className="text-gray-600">創辦人 & 主教練</p>
              <p className="mt-2 text-sm text-gray-500">
                15年滑板經驗，專精街頭滑板與教學
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
              <h3 className="text-xl font-semibold">Sarah Lin</h3>
              <p className="text-gray-600">活動策劃</p>
              <p className="mt-2 text-sm text-gray-500">
                負責社群活動規劃與執行
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
              <h3 className="text-xl font-semibold">Mike Wang</h3>
              <p className="text-gray-600">技術指導</p>
              <p className="mt-2 text-sm text-gray-500">
                專業滑板選手，競技滑板專家
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}