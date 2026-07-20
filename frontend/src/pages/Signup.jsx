import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/AuthForm.css'

/*
 * Checks every field and returns an object of error messages,
 * e.g. { email: "That email doesn't look right." }.
 * An empty object means the form is valid.
 */
function validate(values) {
  const errors = {}

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Please tell us your full name.'
  }

  // Simple email check: something @ something . something
  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "That email doesn't look right — please double-check it."
  }

  // Allows digits, spaces, + and -, at least 7 characters total
  if (!/^[0-9+\-\s]{7,}$/.test(values.phone)) {
    errors.phone = 'Please enter a valid phone number (digits, +, - only).'
  }

  if (!values.country) {
    errors.country = 'Please choose the country you work in.'
  }

  if (values.password.length < 8) {
    errors.password = 'Your password needs at least 8 characters.'
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "These passwords don't match yet."
  }

  return errors
}

function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate() // lets us redirect after success

  const [values, setValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({}) // per-field validation messages
  const [serverError, setServerError] = useState('') // errors from the (mock) API
  const [submitting, setSubmitting] = useState(false) // true while "API call" runs

  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    // Clear this field's error as soon as the user starts fixing it
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // 1. Validate locally first — no point calling the API with bad data
    const foundErrors = validate(values)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    // 2. Call the (mock) API. try/catch handles rejected promises,
    //    like "email already exists".
    setSubmitting(true)
    setServerError('')
    try {
      await signup({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        country: values.country,
        password: values.password,
      })
      navigate('/') // success → back to the home page, now logged in
    } catch (error) {
      setServerError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-intro">
          A few details and you&apos;re ready to set up caring calls.
        </p>

        {/* Error coming back from the "server", e.g. duplicate email */}
        {serverError && <p className="auth-server-error">{serverError}</p>}

        <div className="form-field">
          <label htmlFor="fullName">Full name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            placeholder="e.g. Aung Ko Min"
          />
          {errors.fullName && <p className="field-error">{errors.fullName}</p>}
        </div>

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
          <label htmlFor="phone">Phone number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="+81 90 1234 5678"
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="country">Country you work in</label>
          <select
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
          >
            {/* Empty value forces a real choice; validate() rejects "" */}
            <option value="">Choose a country…</option>
            <option value="japan">Japan</option>
            <option value="singapore">Singapore</option>
            <option value="thailand">Thailand</option>
            <option value="other">Other</option>
          </select>
          {errors.country && <p className="field-error">{errors.country}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="Same password again"
          />
          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Disabled while the fake API call runs, so it can't be double-clicked */}
        <button type="submit" className="btn auth-submit" disabled={submitting}>
          {submitting ? 'Creating your account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  )
}

export default Signup
