export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO / HOME */}
      <main id="home">
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Kuch — Birlikda. <span className="text-indigo-600">Yuqoriga birga.</span></h1>
                <p className="mt-6 text-lg text-gray-700 max-w-xl">Biz birlashgan holda katta maqsadlarga erishamiz. Loyihalardan jamoaviy tashabbusgacha — siz bilan birga har qadamda.</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#signup" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">Ro'yxatdan o'tish</a>
                  <a href="#signin" className="inline-block px-5 py-3 border border-indigo-600 rounded-md hover:bg-indigo-50">Kirish</a>
                </div>

                <div className="mt-8 text-sm text-gray-600">
                  <strong>Tez boshlash:</strong> Loyihanizni tashkil qilish uchun "KuchBirlikda" jamoasiga qo'shiling.
                </div>
              </div>

              <div className="relative">
                {/* Placeholder illustration box */}
                <div className="w-full h-64 sm:h-80 rounded-xl bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center border border-dashed border-gray-200">
                  <div className="text-gray-400">Illustration / screenshot joyi</div>
                </div>

                <div className="mt-4 text-xs text-gray-500">Rasm yoki dashboard screenshoti shu yerga qo'yilishi mumkin.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT or FEATURES section example */}
        <section id="about" className="bg-white/60 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold">Nega KuchBirlikda?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl">Bizning platforma jamoaviy ishlashni osonlashtiradi: vazifalarni taqsimlash, taraqqiyot monitoringi va resurslarni birlashtirish.</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold">Jamoaviy boshqaruv</h3>
                <p className="mt-2 text-sm text-gray-600">Oddiy interfeys va kuchli funksiyalar bilan jamoani boshqaring.</p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold">Resurslar markazi</h3>
                <p className="mt-2 text-sm text-gray-600">Bir joyda barcha hujjatlar va kontaktlar.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600">© {new Date().getFullYear()} KuchBirlikda — Barcha huquqlar himoyalangan.</div>
      </footer>
    </div>
  );
}
