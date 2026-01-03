'use client';

import { useState, useEffect } from 'react';
import { getImagesByCategory, SiteImage } from '../lib/imageManager';

interface PageHeroProps {
  title: string;
  subtitle: string;
  category: string; // hero-about, hero-guides, hero-equipment, etc.
  defaultGradient?: string;
  textColor?: string;
  children?: React.ReactNode;
}

export default function PageHero({ 
  title, 
  subtitle, 
  category, 
  defaultGradient = 'from-gray-900 to-gray-700',
  textColor = 'text-white',
  children
}: PageHeroProps) {
  const [heroImage, setHeroImage] = useState<SiteImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        console.log(`Loading hero image for category: ${category}`);
        const images = await getImagesByCategory(category);
        console.log(`Found ${images.length} images for ${category}`);
        
        if (images.length > 0) {
          setHeroImage(images[0]); // 使用第一張圖片
        }
      } catch (error) {
        console.error(`Error loading hero image for ${category}:`, error);
        setHeroImage(null);
      } finally {
        setLoading(false);
      }
    };

    loadHeroImage();
  }, [category]);

  return (
    <section 
      className={`px-6 py-24 text-center relative ${textColor}`}
      style={heroImage ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {/* 如果沒有圖片，使用漸層背景 */}
      {!heroImage && (
        <div className={`absolute inset-0 bg-gradient-to-r ${defaultGradient}`}></div>
      )}
      
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto opacity-90">
          {subtitle}
        </p>
        
        {/* 額外內容 */}
        {children}
        
        {/* 載入狀態指示器 */}
        {loading && (
          <div className="mt-4">
            <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin opacity-50"></div>
          </div>
        )}
      </div>
    </section>
  );
}