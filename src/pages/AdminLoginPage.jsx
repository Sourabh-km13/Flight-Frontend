import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import useAuthStore from '../contexts/authStore'
import { adminLogin } from '../services/adminService'
import { isAdminToken } from '../utils/authToken'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const redirectTo = location.state?.from?.pathname || '/admin'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await adminLogin({ email: form.email, password: form.password })
      const token = response.token || response.accessToken || response.jwt || response.data
      if (!token || typeof token !== 'string') {
        throw new Error('Login succeeded but no auth token was returned')
      }
      if (!isAdminToken(token)) {
        throw new Error('Not authorized as admin')
      }

      const user = response.user || { email: form.email, role: 'admin' }
      setAuth(user, token)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in as admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),_transparent_40%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-14">
        <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">Admin sign in</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Manage cities, airports, airplanes, and flights. Admins are provisioned in the database only.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@flysmart.com"
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter admin password"
            />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in as admin'}
            </PrimaryButton>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Traveler account?{' '}
            <Link to="/login" className="font-bold text-sky-700 transition hover:text-sky-900">
              Customer sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
