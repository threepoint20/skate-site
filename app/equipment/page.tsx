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
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {getImageByName('構造') || getImageByName('滑板') || equipmentImages[0] ? (
                  <img
                    src={(getImageByName('構造') || getImageByName('滑板') || equipmentImages[0])!.url}
                    alt="滑板構造圖"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-lg">滑板構造圖</span>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h3 className="font-semibold text-blue-800 mb-2">板面 (Deck)</h3>
                <p className="text-blue-700">滑板的主體，通常由7層楓木製成</p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h3 className="font-semibold text-green-800 mb-2">砂紙 (Grip Tape)</h3>
                <p className="text-green-700">貼在板面上，提供摩擦力</p>
              </div>
              <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                <h3 className="font-semibold text-purple-800 mb-2">支架 (Trucks)</h3>
                <p className="text-purple-700">連接板面和輪子的金屬部件</p>
              </div>
              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h3 className="font-semibold text-orange-800 mb-2">輪子 (Wheels)</h3>
                <p className="text-orange-700">提供滑行動力，有不同硬度和尺寸</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deck Guide */}
      <section className="px-6 py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">板面選擇指南</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">寬度</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="font-medium text-blue-800">7.5" - 7.75"</p>
                  <p className="text-sm text-blue-600">適合街頭滑板、技巧練習</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="font-medium text-green-800">8.0" - 8.25"</p>
                  <p className="text-sm text-green-600">平衡性好，適合初學者</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="font-medium text-purple-800">8.5" - 9.0"</p>
                  <p className="text-sm text-purple-600">適合碗池、U型池滑行</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">長度</h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded">
                  <p className="font-medium text-yellow-800">28" - 30"</p>
                  <p className="text-sm text-yellow-600">短板，適合技巧練習</p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <p className="font-medium text-red-800">31" - 32"</p>
                  <p className="text-sm text-red-600">標準長度，最常見</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded">
                  <p className="font-medium text-indigo-800">33" - 35"</p>
                  <p className="text-sm text-indigo-600">長板，適合巡航</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black">形狀</h3>
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 rounded">
                  <p className="font-medium text-teal-800">Popsicle</p>
                  <p className="text-sm text-teal-600">經典街頭滑板形狀</p>
                </div>
                <div className="p-3 bg-pink-50 rounded">
                  <p className="font-medium text-pink-800">Cruiser</p>
                  <p className="text-sm text-pink-600">適合代步和巡航</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">Old School</p>
                  <p className="text-sm text-gray-600">復古造型，寬板頭</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wheels Guide */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">輪子選擇</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">硬度 (Durometer)</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">78A - 87A (軟輪)</p>
                    <p className="text-sm text-gray-600">適合粗糙路面，舒適度高</p>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">88A - 95A (中等)</p>
                    <p className="text-sm text-gray-600">平衡性能，適合街頭滑行</p>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-red-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">96A - 101A (硬輪)</p>
                    <p className="text-sm text-gray-600">適合技巧練習，滑行速度快</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6">尺寸</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">50mm - 53mm</h4>
                  <p className="text-sm text-gray-600">
                    小輪子，適合街頭滑板和技巧練習
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">54mm - 59mm</h4>
                  <p className="text-sm text-gray-600">
                    中等尺寸，平衡速度和靈活性
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">60mm+</h4>
                  <p className="text-sm text-gray-600">
                    大輪子，適合長距離滑行和巡航
                  </p>
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