import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function AuthCard({ title, subtitle, children, footerText, footerLink, footerHref }) {
  return (
    <div className="app-shell relative">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,_rgba(255,255,255,0.55),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%)]" />
      <Navbar />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-14 sm:px-8">
        <div className="glass-panel w-full overflow-hidden rounded-[2.25rem] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white sm:p-12 lg:block">
            <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />
            <div className="relative max-w-lg">
              <p className="eyebrow border-white/10 bg-white/10 text-sky-100">FlySmart</p>
              <h2 className="mt-7 text-5xl font-black tracking-tight text-white">Book flights faster.</h2>
              <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Popular route</p>
                    <p className="mt-3 text-2xl font-black">Mumbai to Delhi</p>
                  </div>
                  <span className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-950">2h 10m</span>
                </div>
                <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div>
                    <p className="text-3xl font-black">BOM</p>
                    <p className="text-sm text-slate-400">Departure</p>
                  </div>
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
                  <div className="text-right">
                    <p className="text-3xl font-black">DEL</p>
                    <p className="text-sm text-slate-400">Arrival</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <main className="w-full p-7 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="eyebrow">{title}</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">{title}</h1>
              {subtitle ? <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p> : null}
            </div>
            {children}
            <p className="mt-8 text-center text-sm text-slate-500">
              {footerText}{' '}
              <Link to={footerHref} className="font-bold text-sky-700 transition hover:text-sky-900">
                {footerLink}
              </Link>
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AuthCard
