import { useState } from 'react'
import { useOnboardingStore } from '../../stores/onboardingStore.js'
import { preferencesSchema, getFieldErrors } from '../../schemas/elderSchemas.js'

// Defined as data so adding a window later is a one-line change
const TIME_WINDOWS = [
  { value: 'morning', label: 'Morning (8–11 AM)' },
  { value: 'afternoon', label: 'Afternoon (12–4 PM)' },
  { value: 'evening', label: 'Evening (5–8 PM)' },
]

const LANGUAGES = [
  { value: 'burmese', label: 'Burmese' },
  { value: 'rakhine', label: 'Rakhine' },
  { value: 'shan', label: 'Shan' },
  { value: 'karen', label: 'Karen' },
  { value: 'mon', label: 'Mon' },
  { value: 'other', label: 'Other' },
]

/*
 * Step 2: when should we call, and in which language?
 */
function PreferencesStep() {
  const { preferences, updateSection, setStep, step } = useOnboardingStore()
  const [errors, setErrors] = useState({})

  /*
   * Checkboxes hold an ARRAY of picked values: ticking adds the
   * value to the array, unticking filters it out.
   */
  function toggleWindow(value) {
    const current = preferences.timeWindows
    const next = current.includes(value)
      ? current.filter((w) => w !== value) // was ticked → remove
      : [...current, value] // wasn't → add
    updateSection('preferences', { timeWindows: next })
    if (errors.timeWindows) setErrors({ ...errors, timeWindows: undefined })
  }

  function handleLanguage(event) {
    updateSection('preferences', { language: event.target.value })
    if (errors.language) setErrors({ ...errors, language: undefined })
  }

  function handleNext(event) {
    event.preventDefault()
    const found = getFieldErrors(preferencesSchema, preferences)
    if (found) {
      setErrors(found)
      return
    }
    setStep(step + 1)
  }

  return (
    <form className="onboarding-form" onSubmit={handleNext} noValidate>
      <h2 className="onboarding-step-title" tabIndex={-1}>
        Call preferences
      </h2>

      {/* A fieldset+legend groups related checkboxes accessibly;
          aria-describedby ties the group error to the whole group */}
      <fieldset
        className="form-field"
        aria-describedby={errors.timeWindows ? 'timeWindows-error' : undefined}
      >
        <legend className="checkbox-legend">
          Which time windows suit them? (pick any)
        </legend>
        {TIME_WINDOWS.map((window) => (
          <label className="checkbox-row" key={window.value}>
            <input
              type="checkbox"
              checked={preferences.timeWindows.includes(window.value)}
              onChange={() => toggleWindow(window.value)}
            />
            {window.label}
          </label>
        ))}
        {errors.timeWindows && (
          <p className="field-error" id="timeWindows-error">
            {errors.timeWindows}
          </p>
        )}
      </fieldset>

      <div className="form-field">
        <label htmlFor="language">Language or dialect</label>
        <select
          id="language"
          value={preferences.language}
          onChange={handleLanguage}
          aria-invalid={Boolean(errors.language)}
          aria-describedby={errors.language ? 'language-error' : undefined}
        >
          <option value="">Choose a language…</option>
          {LANGUAGES.map((lang) => (
            <option value={lang.value} key={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="field-error" id="language-error">
            {errors.language}
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
        <button type="submit" className="btn">
          Next
        </button>
      </div>
    </form>
  )
}

export default PreferencesStep
