import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnboardingStore } from '../../stores/onboardingStore.js'
import { useToast } from '../../context/ToastContext.jsx'
import {
  careContextSchema,
  elderSchema,
  getFieldErrors,
} from '../../schemas/elderSchemas.js'
import { createElder } from '../../services/eldersService.js'

/*
 * Step 3: care context + FINAL SUBMIT.
 *
 * This step validates twice:
 * 1. its own fields with careContextSchema (like the other steps)
 * 2. the WHOLE wizard with the composed elderSchema — belt and
 *    braces in case earlier data was tampered with or lost
 * Then it POSTs to /elders (answered by MSW in development).
 *
 * Props:
 *   onDone(createdElder) — called after a successful save so the
 *   parent page can show the success screen.
 */
function CareContextStep({ onDone }) {
  const store = useOnboardingStore()
  const { careContext, updateSection, setStep, step, reset } = store
  const { t } = useTranslation()
  const addToast = useToast()

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    updateSection('careContext', { [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // 1. This step's own fields
    const found = getFieldErrors(careContextSchema(t), careContext)
    if (found) {
      setErrors(found)
      return
    }

    // 2. Everything, with the composed schema
    const fullData = {
      identity: store.identity,
      preferences: store.preferences,
      careContext: store.careContext,
    }
    const fullResult = elderSchema(t).safeParse(fullData)
    if (!fullResult.success) {
      // An earlier step is invalid — send the user back to fix it
      setServerError(t('elderForm.errors.reviewEarlier'))
      setStep(0)
      return
    }

    // 3. POST to the API. Note we submit fullResult.data (the
    //    parsed output) — zod has already coerced age to a number.
    setSubmitting(true)
    setServerError('')
    try {
      const created = await createElder(fullResult.data)
      addToast(t('elderForm.toastAdded', { name: created.identity.name }))
      reset() // clear the wizard so it starts fresh next time
      onDone(created)
    } catch (error) {
      setServerError(error.message)
      addToast(t('elderForm.toastError'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="onboarding-form" onSubmit={handleSubmit} noValidate>
      <h2 className="onboarding-step-title" tabIndex={-1}>
        {t('elderForm.care.title')}
      </h2>

      {serverError && (
        <p className="auth-server-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="conditions">
          {t('elderForm.care.conditions')}{' '}
          <span className="optional-tag">{t('elderForm.care.optional')}</span>
        </label>
        <textarea
          id="conditions"
          name="conditions"
          rows="3"
          value={careContext.conditions}
          onChange={handleChange}
          placeholder={t('elderForm.care.conditionsPlaceholder')}
        />
      </div>

      <div className="form-field">
        <label htmlFor="topics">
          {t('elderForm.care.topics')}{' '}
          <span className="optional-tag">{t('elderForm.care.optional')}</span>
        </label>
        <textarea
          id="topics"
          name="topics"
          rows="3"
          value={careContext.topics}
          onChange={handleChange}
          placeholder={t('elderForm.care.topicsPlaceholder')}
        />
      </div>

      <div className="form-field">
        <label htmlFor="emergencyName">{t('elderForm.care.emergencyName')}</label>
        <input
          type="text"
          id="emergencyName"
          name="emergencyName"
          value={careContext.emergencyName}
          onChange={handleChange}
          placeholder={t('elderForm.care.emergencyNamePlaceholder')}
          aria-invalid={Boolean(errors.emergencyName)}
          aria-describedby={errors.emergencyName ? 'emergencyName-error' : undefined}
        />
        {errors.emergencyName && (
          <p className="field-error" id="emergencyName-error">
            {errors.emergencyName}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="emergencyPhone">
          {t('elderForm.care.emergencyPhone')}
        </label>
        <input
          type="tel"
          id="emergencyPhone"
          name="emergencyPhone"
          value={careContext.emergencyPhone}
          onChange={handleChange}
          placeholder={t('elderForm.care.emergencyPhonePlaceholder')}
          aria-invalid={Boolean(errors.emergencyPhone)}
          aria-describedby={errors.emergencyPhone ? 'emergencyPhone-error' : undefined}
        />
        {errors.emergencyPhone && (
          <p className="field-error" id="emergencyPhone-error">
            {errors.emergencyPhone}
          </p>
        )}
      </div>

      <div className="onboarding-nav">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setStep(step - 1)}
        >
          {t('common.back')}
        </button>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? t('common.saving') : t('common.finish')}
        </button>
      </div>
    </form>
  )
}

export default CareContextStep
