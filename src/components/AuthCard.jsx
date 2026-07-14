import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function AuthCard({ title, subtitle, children, footerText, footerLink, footerHref }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_22%)]" />
      <Navbar />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-14 sm:px-8">
        <div className="w-full overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 shadow-2xl shadow-slate-950/50 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_30%)] p-10 sm:p-12 lg:block">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">FlySmart</p>
              <h2 className="mt-6 text-4xl font-semibold text-white">Your travel workspace, reimagined.</h2>
              <p className="mt-5 text-base leading-7 text-slate-300">
                Log in securely, manage your tokens, and discover flights inside a modern dashboard built for curated travel planning.
              </p>
              <div className="mt-10 space-y-4">
                <div className="rounded-[1.75rem] bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Secure login</p>
                  <p className="mt-2 text-sm text-slate-300">JWT authentication for every session.</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Easy access</p>
                  <p className="mt-2 text-sm text-slate-300">Sign in and dive straight into flights.</p>
                </div>
              </div>
            </div>
          </section>

          <main className="w-full p-8 sm:p-10 lg:p-12">
            <div className="mb-8 rounded-[1.75rem] bg-slate-950/90 p-8 shadow-xl shadow-slate-950/20">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">{title}</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">{title}</h1>
              <p className="mt-3 text-base leading-7 text-slate-400">{subtitle}</p>
            </div>
            {children}
            <p className="mt-8 text-center text-sm text-slate-400">
              {footerText}{' '}
              <Link to={footerHref} className="font-semibold text-sky-400 transition hover:text-sky-300">
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
