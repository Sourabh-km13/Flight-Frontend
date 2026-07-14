import { useState } from 'react'
import Button from './Button'

function AuthForm({ mode = 'login' }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const isSignUp = mode === 'signup'

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(`${isSignUp ? 'Signup' : 'Login'} submitted`, formData)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
      <p className="auth-subtitle">
        {isSignUp
          ? 'Start planning your next flight in minutes.'
          : 'Sign in to continue booking your journey.'}
      </p>

      {isSignUp && (
        <label className="field">
          <span>Full name</span>
          <input
            name="name"
            type="text"
            placeholder="Ava Carter"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
      )}

      <label className="field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>

      <Button type="submit" variant={isSignUp ? 'primary' : 'secondary'}>
        {isSignUp ? 'Create account' : 'Log in'}
      </Button>
    </form>
  )
}

export default AuthForm
