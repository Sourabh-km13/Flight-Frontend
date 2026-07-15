import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function HomePage() {
  return (
    <div className="app-shell relative">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,_rgba(255,255,255,0.65),_transparent_42%)]" />
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10">
        <section className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-8">
            <span className="eyebrow">Premium flight booking</span>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-black tracking-[-0.05em] text-slate-950 sm:text-7xl">
                Find the flight that fits your trip, not just your calendar.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A cleaner FlySmart experience for browsing routes, comparing prices, and getting into your travel dashboard quickly.
              </p>
            </div>

            <div className="glass-panel grid max-w-4xl gap-4 rounded-[2rem] p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              {[
                { label: 'From', value: 'Mumbai', code: 'BOM' },
                { label: 'To', value: 'Delhi', code: 'DEL' },
                { label: 'Departure', value: 'Fri, 18 Oct', code: '1 traveller' },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] bg-white px-5 py-4 shadow-sm shadow-slate-200/70">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-black text-slate-950">{item.value}</p>
                  <p className="text-sm font-semibold text-sky-700">{item.code}</p>
                </div>
              ))}
              <Link to="/signup" className="gradient-button min-h-16 px-6 text-sm font-black md:self-stretch">
                Search
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {['Free cancellation', 'Live routes', 'Secure account', 'Fast dashboard'].map((item) => (
                <span key={item} className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-300/30 blur-3xl" />
            <div className="glass-panel relative rounded-[2.5rem] p-5 sm:p-7">
              <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/25">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Featured fare</p>
                    <h2 className="mt-4 text-4xl font-black tracking-tight">Mumbai to Delhi</h2>
                    <p className="mt-2 text-sm text-slate-400">Non-stop · Economy · 2h 10m</p>
                  </div>
                  <span className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-950">₹11,000</span>
                </div>

                <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div>
                    <p className="text-5xl font-black">BOM</p>
                    <p className="mt-2 text-sm text-slate-400">20:40</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-sky-300" />
                    <span className="h-20 w-px bg-gradient-to-b from-sky-300 via-white/30 to-orange-200 sm:h-px sm:w-28" />
                    <span className="h-3 w-3 rounded-full bg-orange-200" />
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black">DEL</p>
                    <p className="mt-2 text-sm text-slate-400">23:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  { value: '120+', label: 'Routes' },
                  { value: '24/7', label: 'Access' },
                  { value: 'JWT', label: 'Session' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] bg-white p-5 text-center shadow-sm shadow-slate-200/70">
                    <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
