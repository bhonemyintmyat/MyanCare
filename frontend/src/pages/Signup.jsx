import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
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

/*
 * Accessibility notes on this form:
 * - every input is linked to its <label> via htmlFor/id
 * - aria-invalid tells screen readers a field failed validation
 * - aria-describedby points at the error message's id, so the
 *   message is read aloud when the field is focused
 */
function Signup() {
  const { signup } = useAuth()
  const addToast = useToast()
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
  const [serverError, setServerError] = useState('') // errors from the API
  const [submitting, setSubmitting] = useState(false) // true while the API call runs

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

    // 2. Call the API. try/catch handles rejected promises,
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
      addToast('Welcome to MyanCare! Your account is ready.')
      navigate('/dashboard') // success → straight to their dashboard
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

        {/* role="alert" makes screen readers announce this immediately */}
        {serverError && (
          <p className="auth-server-error" role="alert">
            {serverError}
          </p>
        )}

        <div className="form-field">
          <label htmlFor="fullName">Full name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            placeholder="e.g. Aung Ko Min"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
            <p className="field-error" id="fullName-error">
              {errors.fullName}
            </p>
          )}
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
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p className="field-error" id="email-error">
              {errors.email}
            </p>
          )}
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
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p className="field-error" id="phone-error">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="country">Country you work in</label>
          <select
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? 'country-error' : undefined}
          >
            {/* Empty value forces a real choice; validate() rejects "" */}
            <option value="">Choose a country…</option>
            <option value="japan">Japan</option>
            <option value="singapore">Singapore</option>
            <option value="thailand">Thailand</option>
            <option value="other">Other</option>
          </select>
          {errors.country && (
            <p className="field-error" id="country-error">
              {errors.country}
            </p>
          )}
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
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p className="field-error" id="password-error">
              {errors.password}
            </p>
          )}
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
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? 'confirmPassword-error' : undefined
            }
          />
          {errors.confirmPassword && (
            <p className="field-error" id="confirmPassword-error">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Disabled while the API call runs, so it can't be double-clicked */}
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
