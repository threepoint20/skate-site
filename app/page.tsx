export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="px-6 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Skate like a Fairy/Superman
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-500">
          推廣滑板文化、社群活動與教育，打造更友善、更包容的滑板環境。
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/about"
            className="px-6 py-3 bg-black text-white rounded-lg text-lg font-semibold hover:opacity-80 transition"
          >
            認識我們
          </a>
          <a
            href="/guides"
            className="px-6 py-3 border border-black rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition"
          >
            滑板指南
          </a>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-24 bg-gray-100 text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold">我們的使命</h2>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            我們相信滑板不只是運動，更是一種文化、一種力量。
            透過課程、活動與社群，我們希望讓更多人能安全、自在地接觸滑板，
            並在其中找到自信與歸屬感。
          </p>
        </div>
      </section>

      {/* Activity Photos Section */}
      <section className="px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-10">活動照片</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <img
            src="/activity1.png"
            alt="活動照片 1"
            className="h-64 w-full object-cover rounded-xl shadow-md"
          />
          <img
            src="/activity2.png"
            alt="活動照片 2"
            className="h-64 w-full object-cover rounded-xl shadow-md"
          />
          <img
            src="/activity3.png"
            alt="活動照片 3"
            className="h-64 w-full object-cover rounded-xl shadow-md"
          />
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="px-6 py-24 bg-gray-50 text-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center">最新文章</h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">文章標題 1</h3>
              <p className="mt-2 text-gray-600">文章摘要內容…</p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">文章標題 2</h3>
              <p className="mt-2 text-gray-600">文章摘要內容…</p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">文章標題 3</h3>
              <p className="mt-2 text-gray-600">文章摘要內容…</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="/blog"
              className="px-6 py-3 border border-black rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition"
            >
              查看全部文章
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}