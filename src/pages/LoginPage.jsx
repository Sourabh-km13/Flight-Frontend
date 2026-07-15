import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import useAuthStore from '../contexts/authStore'
import { loginUser } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginUser({ email: form.email, password: form.password })
      const token = response.token || response.accessToken || response.jwt || response.data
      if (!token || typeof token !== 'string') {
        throw new Error('Login succeeded but no auth token was returned')
      }

      const user = response.user || { email: form.email }
      setAuth(user, token)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle=""
      footerText="New here?"
      footerLink="Create an account"
      footerHref="/signup"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </PrimaryButton>
      </form>
    </AuthCard>
  )
}

export default LoginPage
