import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import useAuthStore from '../contexts/authStore'
import LogoutButton from '../components/LogoutButton'
function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  const stats = useMemo(
    () => [
      { label: 'Traveler', value: user?.name || user?.email || 'Guest' },
      { label: 'Date', value: new Date().toLocaleDateString('en-GB') },
      { label: 'Access', value: 'Signed in' },
    ],
    [user],
  )

  return (
    <div className="app-shell relative">
      <Navbar />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_32%)]" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="glass-panel overflow-hidden rounded-[2.5rem] p-7 sm:p-9">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Dashboard</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Welcome back</h1>
            </div>
            <LogoutButton className="px-5 py-3 text-sm" />
          </div>
        
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="soft-card rounded-[1.75rem] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                <p className="mt-3 truncate text-2xl font-black text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Link
              to="/searchflights"
              className="group relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-left text-white shadow-2xl shadow-sky-950/20 transition duration-300 hover:-translate-y-1"
            >
              <span className="absolute -right-10 -top-10 h-40 w-40 animate-pulse rounded-full bg-sky-400/30 blur-2xl" />
              <span className="absolute bottom-0 left-8 h-24 w-48 animate-pulse rounded-full bg-orange-300/20 blur-2xl" />
              <span className="relative block text-xs font-bold uppercase tracking-[0.28em] text-sky-200">Search flights</span>
              <span className="relative mt-5 block text-3xl font-black tracking-tight">Find your next route</span>
              <span className="relative mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition group-hover:scale-105">
                Search flights
              </span>
            </Link>

            <Link
              to="/bookings"
              className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-400 via-rose-400 to-sky-500 p-7 text-white shadow-2xl shadow-orange-900/20 transition duration-300 hover:-translate-y-1"
            >
              <span className="absolute -left-12 -top-12 h-44 w-44 animate-pulse rounded-full bg-white/25 blur-2xl" />
              <span className="absolute bottom-4 right-6 h-28 w-28 animate-pulse rounded-full bg-slate-950/20 blur-xl" />
              <span className="relative block text-xs font-bold uppercase tracking-[0.28em] text-white/80">Booked tickets</span>
              <span className="relative mt-5 block text-3xl font-black tracking-tight">View upcoming journeys</span>
              <span className="relative mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition group-hover:scale-105">
                Open tickets
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
