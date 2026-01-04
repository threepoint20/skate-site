'use client';

import PageHero from '../components/PageHero';
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbs } from '../lib/breadcrumbs';

export default function Contact() {
  const breadcrumbs = generateBreadcrumbs('/contact');

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <PageHero
        title="聯絡我們"
        subtitle="有任何問題或建議？我們很樂意聽到您的聲音"
        category="hero-contact"
        defaultGradient="from-purple-600 to-pink-600"
      />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Contact Form & Info */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-black">發送訊息</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="請輸入您的姓名"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    電子郵件 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="請輸入您的電子郵件"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    電話號碼
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="請輸入您的電話號碼"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    主題 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">請選擇主題</option>
                    <option value="general">一般詢問</option>
                    <option value="course">課程相關</option>
                    <option value="equipment">裝備諮詢</option>
                    <option value="event">活動報名</option>
                    <option value="partnership">合作提案</option>
                    <option value="feedback">意見回饋</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    訊息內容 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="請詳細描述您的問題或需求..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  發送訊息
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">聯絡資訊</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">地址</h3>
                      <p className="text-gray-600">台北市信義區滑板街123號</p>
                      <p className="text-gray-600">SkateInfo 滑板資訊中心</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">電話</h3>
                      <p className="text-gray-600">+886-912-345-678</p>
                      <p className="text-sm text-gray-500">週一至週五 9:00-18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">電子郵件</h3>
                      <p className="text-gray-600">info@skateinfo.com</p>
                      <p className="text-sm text-gray-500">24小時內回覆</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 text-xl">⏰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">營業時間</h3>
                      <p className="text-gray-600">週一至週五：9:00 - 21:00</p>
                      <p className="text-gray-600">週六至週日：10:00 - 22:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold mb-4">追蹤我們</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <span className="text-xl">f</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                    <span className="text-xl">📷</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                    <span className="text-xl">▶</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                    <span className="text-xl">💬</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">找到我們</h2>
          <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-600 text-lg">地圖位置 (Google Maps 整合)</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">常見問題</h2>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">如何報名滑板課程？</h3>
              <p className="text-gray-600">
                您可以透過電話、電子郵件或填寫上方聯絡表單來報名課程。我們會在收到您的訊息後24小時內回覆。
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">需要自備滑板嗎？</h3>
              <p className="text-gray-600">
                初學者課程我們提供滑板租借服務，但建議有一定基礎後購買自己的滑板。我們也提供裝備選購諮詢服務。
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">課程適合什麼年齡？</h3>
              <p className="text-gray-600">
                我們的課程適合6歲以上的所有年齡層。我們有專門的兒童班、青少年班和成人班，確保每個人都能得到適合的指導。
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">如果天氣不好怎麼辦？</h3>
              <p className="text-gray-600">
                我們有室內練習場地，雨天或天氣不佳時課程會轉移到室內進行。如需取消課程，我們會提前通知並安排補課。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}