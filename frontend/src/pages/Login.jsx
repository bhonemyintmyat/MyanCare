import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import '../styles/AuthForm.css'

/*
 * Login is a simpler sibling of Signup — same patterns, fewer fields.
 * Compare the two files: once you understand one, you understand both.
 */
function Login() {
  const { login } = useAuth()
  const { t } = useTranslation()
  const addToast = useToast()
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
      found.email = t('auth.errors.loginEmail')
    }
    if (!values.password) {
      found.password = t('auth.errors.loginPassword')
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
      const user = await login(values.email.trim(), values.password)
      addToast(t('auth.loginToast', { name: user.fullName.split(' ')[0] }))
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
        <h1 className="auth-title">{t('auth.loginTitle')}</h1>
        <p className="auth-intro">{t('auth.loginIntro')}</p>

        {serverError && (
          <p className="auth-server-error" role="alert">
            {serverError}
          </p>
        )}

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
          <label htmlFor="password">{t('auth.labels.password')}</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder={t('auth.placeholders.loginPassword')}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p className="field-error" id="password-error">
              {errors.password}
            </p>
          )}
        </div>

        <button type="submit" className="btn auth-submit" disabled={submitting}>
          {submitting ? t('auth.loginSubmitting') : t('auth.loginSubmit')}
        </button>

        <p className="auth-switch">
          {t('auth.newHere')} <Link to="/signup">{t('auth.signupLink')}</Link>
        </p>
      </form>
    </main>
  )
}

export default Login
