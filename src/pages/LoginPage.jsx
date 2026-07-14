import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import useAuthStore from '../contexts/authStore'
import { loginUser } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      const user = response.user || { email: form.email }
      localStorage.setItem('token', token)
      setAuth(user, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Secure access to your flight dashboard with fast token-based login."
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
