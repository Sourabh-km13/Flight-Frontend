import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import InputField from '../components/InputField'
import PrimaryButton from '../components/PrimaryButton'
import { signupUser } from '../services/authService'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await signupUser({ name: form.name, email: form.email, password: form.password })
      const message = 'Signup successful. Proceed with sign in.'
      setSuccess(message)
      navigate('/login', {
        replace: true,
        state: { signupSuccess: message, email: form.email },
      })
    } catch (err) {
      setError(err.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle=""
      footerText="Already have one?"
      footerLink="Sign in"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ava Carter"
        />
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
          placeholder="Create a password"
        />
        {error ? <p className="text-sm font-semibold text-red-400">{error}</p> : null}
        {success ? <p className="text-sm font-semibold text-emerald-500">{success}</p> : null}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </PrimaryButton>
      </form>
    </AuthCard>
  )
}

export default SignupPage
