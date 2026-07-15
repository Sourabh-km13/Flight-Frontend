import { Link } from 'react-router-dom'
import useAuthStore from '../contexts/authStore'

function Navbar() {
  const token = useAuthStore((state) => state.token)

  return (
    <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg text-white shadow-xl shadow-sky-900/20">
          FS
        </span>
        <span>
          <span className="block text-lg font-black tracking-tight text-slate-950">FlySmart</span>
          <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Travel desk</span>
        </span>
      </Link>
      <div className="hidden items-center gap-7 md:flex">
        <Link to="/" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
          Home
        </Link>
        {token ? (
          <Link to="/dashboard" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
            Dashboard
          </Link>
        ) : (
          <Link to="/login" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
            Sign in
          </Link>
        )}
        <Link
          to={token ? '/dashboard' : '/signup'}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          {token ? 'Open dashboard' : 'Create account'}
        </Link>
      </div>
      <div className="flex items-center gap-3 md:hidden">
        <Link
          to={token ? '/dashboard' : '/signup'}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
        >
          {token ? 'Dashboard' : 'Sign up'}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
