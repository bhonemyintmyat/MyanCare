import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import '../styles/AuthForm.css'

/*
 * Checks every field and returns an object of error messages.
 * t is passed in so the messages come out in the active language.
 * An empty object means the form is valid.
 */
function validate(values, t) {
  const errors = {}

  if (values.fullName.trim().length < 2) {
    errors.fullName = t('auth.errors.fullName')
  }

  // Simple email check: something @ something . something
  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = t('auth.errors.email')
  }

  // Allows digits, spaces, + and -, at least 7 characters total
  if (!/^[0-9+\-\s]{7,}$/.test(values.phone)) {
    errors.phone = t('auth.errors.phone')
  }

  if (!values.country) {
    errors.country = t('auth.errors.country')
  }

  if (values.password.length < 8) {
    errors.password = t('auth.errors.password')
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = t('auth.errors.confirmPassword')
  }

  return errors
}

const COUNTRY_OPTIONS = ['japan', 'singapore', 'thailand', 'other']

/*
 * Accessibility notes on this form:
 * - every input is linked to its <label> via htmlFor/id
 * - aria-invalid tells screen readers a field failed validation
 * - aria-describedby points at the error message's id, so the
 *   message is read aloud when the field is focused
 */
function Signup() {
  const { signup } = useAuth()
  const { t } = useTranslation()
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
    const foundErrors = validate(values, t)
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
      addToast(t('auth.signupToast'))
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
        <h1 className="auth-title">{t('auth.signupTitle')}</h1>
        <p className="auth-intro">{t('auth.signupIntro')}</p>

        {/* role="alert" makes screen readers announce this immediately */}
        {serverError && (
          <p className="auth-server-error" role="alert">
            {serverError}
          </p>
        )}

        <div className="form-field">
          <label htmlFor="fullName">{t('auth.labels.fullName')}</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            placeholder={t('auth.placeholders.fullName')}
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
          <label htmlFor="email">{t('auth.labels.email')}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder={t('auth.placeholders.email')}
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
          <label htmlFor="phone">{t('auth.labels.phone')}</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder={t('auth.placeholders.phone')}
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
          <label htmlFor="country">{t('auth.labels.country')}</label>
          <select
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? 'country-error' : undefined}
          >
            {/* Empty value forces a real choice; validate() rejects "" */}
            <option value="">{t('auth.countries.choose')}</option>
            {COUNTRY_OPTIONS.map((country) => (
              <option value={country} key={country}>
                {t(`auth.countries.${country}`)}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="field-error" id="country-error">
              {errors.country}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">{t('auth.labels.password')}</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder={t('auth.placeholders.password')}
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
          <label htmlFor="confirmPassword">
            {t('auth.labels.confirmPassword')}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder={t('auth.placeholders.confirmPassword')}
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
          {submitting ? t('auth.signupSubmitting') : t('auth.signupSubmit')}
        </button>

        <p className="auth-switch">
          {t('auth.haveAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
        </p>
      </form>
    </main>
  )
}

export default Signup
