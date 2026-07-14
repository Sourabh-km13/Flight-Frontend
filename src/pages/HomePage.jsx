import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_24%)]" />
        <Navbar />

        <main className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
          <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-sky-300 ring-1 ring-sky-400/20">
                premium flight experience
              </span>
              <div className="space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  Travel planning that feels effortless.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  FlySmart brings clean, modern flight search and booking into a dashboard designed like a premium travel app.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="inline-flex rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                >
                  Create account
                </Link>
                <Link
                  to="/login"
                  className="inline-flex rounded-full border border-slate-700 bg-slate-900/90 px-6 py-4 text-sm font-semibold text-slate-100 transition hover:border-sky-400"
                >
                  Sign in
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: 'Streamlined journeys', subtitle: 'Organize bookings and flights in one polished place.' },
                  { title: 'Secure sessions', subtitle: 'JWT-based auth keeps access safe and reliable.' },
                  { title: 'Beautiful cards', subtitle: 'Flight results are shown in clean, modern panels.' },
                ].map((feature) => (
                  <div key={feature.title} className="rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">{feature.title}</p>
                    <p className="mt-4 text-sm leading-6 text-slate-300">{feature.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
              <div className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/10">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Your next trip</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Mumbai → Delhi</h2>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                  ✈️
                </div>
              </div>
              <div className="mt-8 space-y-5">
                <div className="rounded-[1.75rem] bg-slate-950/80 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Departure</p>
                  <p className="mt-3 text-lg font-semibold text-white">MUM</p>
                  <p className="text-sm text-slate-400">16 Oct 2025 · 20:40</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-950/80 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Arrival</p>
                  <p className="mt-3 text-lg font-semibold text-white">DEL</p>
                  <p className="text-sm text-slate-400">16 Oct 2025 · 20:03</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Price</p>
                    <p className="mt-3 text-lg font-semibold text-white">₹11,000</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Boarding gate</p>
                    <p className="mt-3 text-lg font-semibold text-white">TBD</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default HomePage
