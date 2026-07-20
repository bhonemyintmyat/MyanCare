import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/AuthForm.css'

/*
 * Login is a simpler sibling of Signup — same patterns, fewer fields.
 * Compare the two files: once you understand one, you understand both.
 */
function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  function validate() {
    const found = {}
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      found.email = 'Please enter the email you signed up with.'
    }
    if (!values.password) {
      found.password = 'Please enter your password.'
    }
    return found
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const foundErrors = validate()
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    setSubmitting(true)
    setServerError('')
    try {
      await login(values.email.trim(), values.password)
      navigate('/dashboard')
    } catch (error) {
      // e.g. "Email or password doesn't match."
      setServerError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-intro">Log in to manage your caring calls.</p>

        {serverError && <p className="auth-server-error">{serverError}</p>}

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Your password"
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn auth-submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-switch">
          New to MyanCare? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  )
}

export default Login
