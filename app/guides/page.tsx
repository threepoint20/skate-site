'use client';

import { useState, useEffect } from 'react';
import { getImagesByCategory, SiteImage } from '../lib/imageManager';
import PageHero from '../components/PageHero';
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbs } from '../lib/breadcrumbs';

export default function Guides() {
  const [generalImages, setGeneralImages] = useState<SiteImage[]>([]);
  const breadcrumbs = generateBreadcrumbs('/guides');

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getImagesByCategory('general');
        setGeneralImages(images);
      } catch (error) {
        console.error('Error loading general images:', error);
        setGeneralImages([]);
      }
    };

    loadImages();
  }, []);

  // 取得特定用途的圖片
  const getImageByName = (name: string) => {
    return generalImages.find(img => img.name.toLowerCase().includes(name.toLowerCase()));
  };
  
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <PageHero
        title="滑板指南"
        subtitle="從基礎到進階，完整的滑板學習資源"
        category="hero-guides"
        defaultGradient="from-blue-600 to-purple-600"
      />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Beginner Guide */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">初學者指南</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-6">選擇你的第一塊滑板</h3>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-800">板面 (Deck)</h4>
                  <p className="text-blue-700">寬度：7.5" - 8.5" 適合初學者</p>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-800">輪子 (Wheels)</h4>
                  <p className="text-green-700">硬度：78A-87A 適合街頭滑行</p>
                </div>
                <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-semibold text-purple-800">軸承 (Bearings)</h4>
                  <p className="text-purple-700">ABEC-7 或 ABEC-9 提供順暢滑行</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6">基本安全裝備</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  頭盔 - 保護頭部最重要
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  護膝 - 防止膝蓋受傷
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  護肘 - 保護手肘關節
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  護腕 - 避免手腕扭傷
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Tricks */}
      <section className="px-6 py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">基本技巧</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">1. 站立與平衡</h3>
              <p className="text-gray-600 mb-4">
                學會在靜止的滑板上保持平衡是所有技巧的基礎
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 找到舒適的站姿</li>
                <li>• 練習重心轉移</li>
                <li>• 保持膝蓋微彎</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">2. 推進 (Push)</h3>
              <p className="text-gray-600 mb-4">
                用後腳推地面來獲得前進動力
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 前腳放在板面前端</li>
                <li>• 後腳輕推地面</li>
                <li>• 保持身體平衡</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">3. 轉彎</h3>
              <p className="text-gray-600 mb-4">
                通過身體重心和腳部壓力來控制方向
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 腳趾側轉彎</li>
                <li>• 腳跟側轉彎</li>
                <li>• 練習S型滑行</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Tricks */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">進階技巧</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Ollie</h3>
              <p className="text-gray-600 mb-4">
                滑板最基本的跳躍技巧，是學習其他技巧的基礎
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>步驟 1:</strong> 後腳放在板尾</p>
                <p><strong>步驟 2:</strong> 用力踩下板尾</p>
                <p><strong>步驟 3:</strong> 前腳向前滑動</p>
                <p><strong>步驟 4:</strong> 雙腳同時落地</p>
              </div>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Kickflip</h3>
              <p className="text-gray-600 mb-4">
                板面翻轉360度的經典技巧
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>前置條件:</strong> 熟練掌握Ollie</p>
                <p><strong>關鍵:</strong> 前腳的側向滑動</p>
                <p><strong>練習:</strong> 先在草地上練習</p>
                <p><strong>注意:</strong> 保持身體平衡</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="px-6 py-24 bg-red-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-red-800">安全提醒</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-red-700">練習環境</h3>
              <p className="text-gray-600">
                選擇平坦、乾燥、無障礙物的地面練習
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-red-700">循序漸進</h3>
              <p className="text-gray-600">
                不要急於學習高難度技巧，打好基礎最重要
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}