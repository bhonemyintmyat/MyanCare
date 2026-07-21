import { useState } from 'react'
import { useOnboardingStore } from '../../stores/onboardingStore.js'
import { identitySchema, getFieldErrors } from '../../schemas/elderSchemas.js'

/*
 * Step 1: who are we calling?
 *
 * Pattern shared by all three steps:
 * - values live in the Zustand store (so refresh keeps them)
 * - errors live in local useState (a refresh clearing errors is fine)
 * - "Next" validates with this step's zod schema before advancing
 * - aria-invalid + aria-describedby connect each field to its error
 *   so screen readers read the message when the field is focused
 */
function IdentityStep() {
  const { identity, updateSection, setStep, step } = useOnboardingStore()
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    // Writing into the store persists it to localStorage automatically
    updateSection('identity', { [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  function handleNext(event) {
    event.preventDefault()
    const found = getFieldErrors(identitySchema, identity)
    if (found) {
      setErrors(found)
      return
    }
    setStep(step + 1)
  }

  return (
    <form className="onboarding-form" onSubmit={handleNext} noValidate>
      <h2 className="onboarding-step-title" tabIndex={-1}>
        About your parent
      </h2>

      <div className="form-field">
        <label htmlFor="name">Full name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={identity.name}
          onChange={handleChange}
          placeholder="e.g. Daw Khin Myint"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p className="field-error" id="name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={identity.age}
          onChange={handleChange}
          placeholder="e.g. 72"
          aria-invalid={Boolean(errors.age)}
          aria-describedby={errors.age ? 'age-error' : undefined}
        />
        {errors.age && (
          <p className="field-error" id="age-error">
            {errors.age}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="phone">GSM phone number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={identity.phone}
          onChange={handleChange}
          placeholder="09 xxx xxx xxx"
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
        <label htmlFor="city">City or township</label>
        <input
          type="text"
          id="city"
          name="city"
          value={identity.city}
          onChange={handleChange}
          placeholder="e.g. Mandalay"
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? 'city-error' : undefined}
        />
        {errors.city && (
          <p className="field-error" id="city-error">
            {errors.city}
          </p>
        )}
      </div>

      <div className="onboarding-nav">
        {/* No Back button on the first step */}
        <span />
        <button type="submit" className="btn">
          Next
        </button>
      </div>
    </form>
  )
}

export default IdentityStep
