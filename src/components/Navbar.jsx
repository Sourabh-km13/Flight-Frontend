import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
      <Link to="/" className="text-lg font-semibold tracking-[0.28em] text-white">
        FlySmart
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        <Link to="/" className="text-sm font-medium text-slate-300 transition hover:text-white">
          Home
        </Link>
        <Link to="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">
          Sign in
        </Link>
        <Link
          to="/signup"
          className="rounded-full border border-slate-700 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm shadow-slate-950/10 transition hover:bg-slate-200"
        >
          Create account
        </Link>
      </div>
      <div className="flex items-center gap-3 md:hidden">
        <Link
          to="/signup"
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Sign up
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
