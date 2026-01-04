'use client';

import { useState, useEffect } from 'react';
import { getImagesByCategory, SiteImage } from '../lib/imageManager';
import PageHero from '../components/PageHero';

export default function Equipment() {
  const [equipmentImages, setEquipmentImages] = useState<SiteImage[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getImagesByCategory('equipment');
        console.log('Loaded equipment images:', images.length);
        setEquipmentImages(images);
      } catch (error) {
        console.error('Error loading equipment images:', error);
        setEquipmentImages([]);
      }
    };

    loadImages();
  }, []);

  // 取得特定用途的圖片
  const getImageByName = (name: string) => {
    return equipmentImages.find(img => img.name.toLowerCase().includes(name.toLowerCase()));
  };
  
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <PageHero
        title="滑板裝備"
        subtitle="了解滑板的各個組件，選擇最適合你的裝備"
        category="hero-equipment"
        defaultGradient="from-orange-500 to-red-600"
      />

      {/* Skateboard Anatomy */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">滑板構造</h2>
          
          <div className="flex flex-col gap-8">
            {/* 上方：寬度 100% 的構造圖 */}
            <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {getImageByName('構造') || getImageByName('滑板') || equipmentImages[0] ? (
                <img
                  src={(getImageByName('構造') || getImageByName('滑板') || equipmentImages[0])!.url}
                  alt="滑板構造圖"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500 text-lg">滑板構造圖</span>
              )}
            </div>
            
            {/* 下方：分為左右兩欄的規格文字 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 左側第一欄：板面與輪子 */}
              <div className="space-y-6">
                {/* 板面 (Deck) */}
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h3 className="font-semibold text-blue-800 mb-2">板面 (Deck)</h3>
                  <p className="mb-1 text-sm md:text-base">
                    <span className="text-blue-700">滑板的主體，通常由7層楓木製成</span>
                    <span className="font-medium text-red-800"> 寬度(大宗 8.0")</span>
                  </p>
                  <div className="text-blue-600 text-sm md:text-sm">
                    <p>7.5" - 7.75"(小孩)</p>
                    <p>8.0" - 8.25"(一般成人)</p>
                    <p>8.5" - 9.0"(較適合巡航/穩定)</p>
                  </div>
                </div>

                {/* 輪子 (Wheels) */}
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <h3 className="font-semibold text-orange-800 mb-2">輪子 (Wheels)</h3>
                  <p className="mb-1 text-sm md:text-sm">
                    <span className="text-orange-700">提供滑行動力，有不同硬度和尺寸</span>
                    <span className="font-medium text-red-800">(大宗 99a/54mm")</span>
                  </p>
                  <div className="space-y-1 text-sm md:text-sm">
                    <p className="text-orange-600">小輪(50-54mm) 適合技巧、翻板</p>
                    <p className="text-orange-600">中輪(55-58mm) 平衡技巧與穩定性</p>
                    <p className="text-orange-600">大輪(59mm以上) 速度快、續航力好</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-orange-200 border-dashed text-xs md:text-sm">
                    <p className="text-blue-700">軟輪 (78A-87A) 適合街滑代步</p>
                    <p className="text-green-700">中等輪 90A-97A 全能型選擇</p>
                    <p className="text-purple-700">硬輪 (99A以上) 適合公園、練招</p>
                  </div>
                </div>
              </div>

              {/* 右側第二欄：支架與砂紙 */}
              <div className="space-y-6">
                {/* 支架 (Trucks) */}
                <div className="p-4 border-l-4 border-purple-500 bg-purple-50 h-fit">
                  <h3 className="font-semibold text-purple-800 mb-2">支架 (Trucks)</h3>
                  <p className="text-purple-700 mb-2 text-sm md:text-base">連接板面和輪子的部件 (規格:高度)</p>
                  <div className="space-y-1 text-sm md:text-base text-purple-600">
                    <p>矮：約 46-49mm，重心低，翻板快</p>
                    <p>中：約 50-53mm，平衡型，全能</p>
                    <p>高：約 53.5-58mm，弧度大，適合碗池</p>
                  </div>
                </div>

                {/* 砂紙 (Grip Tape) */}
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-2">砂紙 (Grip Tape)</h3>
                  <p className="text-green-700 text-sm md:text-base">貼在板面上，提供摩擦力</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Maintenance */}
      <section className="px-6 py-24 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">保養維護</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">日常保養</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  <span>定期清潔板面和砂紙</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  <span>檢查螺絲是否鬆動</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  <span>清潔軸承，必要時更換</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                  <span>檢查輪子磨損情況</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">存放建議</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span>避免陽光直射</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span>保持乾燥環境</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span>避免極端溫度</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span>定期轉動輪子</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}