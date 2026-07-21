import { useState } from 'react'
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
    const found = getFieldErrors(careContextSchema, careContext)
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
    const fullResult = elderSchema.safeParse(fullData)
    if (!fullResult.success) {
      // An earlier step is invalid — send the user back to fix it
      setServerError(
        'Something in an earlier step needs attention — please review.',
      )
      setStep(0)
      return
    }

    // 3. POST to the API. Note we submit fullResult.data (the
    //    parsed output) — zod has already coerced age to a number.
    setSubmitting(true)
    setServerError('')
    try {
      const created = await createElder(fullResult.data)
      addToast(`${created.identity.name} has been added.`)
      reset() // clear the wizard so it starts fresh next time
      onDone(created)
    } catch (error) {
      setServerError(error.message)
      addToast('Could not save the profile. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="onboarding-form" onSubmit={handleSubmit} noValidate>
      <h2 className="onboarding-step-title" tabIndex={-1}>
        Care context
      </h2>

      {serverError && (
        <p className="auth-server-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="conditions">
          Health conditions to keep an eye on{' '}
          <span className="optional-tag">(optional)</span>
        </label>
        <textarea
          id="conditions"
          name="conditions"
          rows="3"
          value={careContext.conditions}
          onChange={handleChange}
          placeholder="e.g. High blood pressure — takes medicine every morning"
        />
      </div>

      <div className="form-field">
        <label htmlFor="topics">
          Conversation topics they enjoy{' '}
          <span className="optional-tag">(optional)</span>
        </label>
        <textarea
          id="topics"
          name="topics"
          rows="3"
          value={careContext.topics}
          onChange={handleChange}
          placeholder="e.g. Cooking, the monastery, football, grandchildren"
        />
      </div>

      <div className="form-field">
        <label htmlFor="emergencyName">Emergency contact name</label>
        <input
          type="text"
          id="emergencyName"
          name="emergencyName"
          value={careContext.emergencyName}
          onChange={handleChange}
          placeholder="Someone nearby we can call if we're worried"
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
        <label htmlFor="emergencyPhone">Emergency contact phone</label>
        <input
          type="tel"
          id="emergencyPhone"
          name="emergencyPhone"
          value={careContext.emergencyPhone}
          onChange={handleChange}
          placeholder="09 xxx xxx xxx"
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
          Back
        </button>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Saving…' : 'Finish'}
        </button>
      </div>
    </form>
  )
}

export default CareContextStep
