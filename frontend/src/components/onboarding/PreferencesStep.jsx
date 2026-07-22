import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnboardingStore } from '../../stores/onboardingStore.js'
import { preferencesSchema, getFieldErrors } from '../../schemas/elderSchemas.js'

// Values are stable identifiers (stored, sent to the API);
// the labels shown next to them are translated at render time
const TIME_WINDOW_VALUES = ['morning', 'afternoon', 'evening']
const LANGUAGE_VALUES = ['burmese', 'rakhine', 'shan', 'karen', 'mon', 'other']

/*
 * Step 2: when should we call, and in which language?
 */
function PreferencesStep() {
  const { preferences, updateSection, setStep, step } = useOnboardingStore()
  const { t } = useTranslation()
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
    const found = getFieldErrors(preferencesSchema(t), preferences)
    if (found) {
      setErrors(found)
      return
    }
    setStep(step + 1)
  }

  return (
    <form className="onboarding-form" onSubmit={handleNext} noValidate>
      <h2 className="onboarding-step-title" tabIndex={-1}>
        {t('elderForm.preferences.title')}
      </h2>

      {/* A fieldset+legend groups related checkboxes accessibly;
          aria-describedby ties the group error to the whole group */}
      <fieldset
        className="form-field"
        aria-describedby={errors.timeWindows ? 'timeWindows-error' : undefined}
      >
        <legend className="checkbox-legend">
          {t('elderForm.preferences.legend')}
        </legend>
        {TIME_WINDOW_VALUES.map((value) => (
          <label className="checkbox-row" key={value}>
            <input
              type="checkbox"
              checked={preferences.timeWindows.includes(value)}
              onChange={() => toggleWindow(value)}
            />
            {t(`elderForm.preferences.${value}`)}
          </label>
        ))}
        {errors.timeWindows && (
          <p className="field-error" id="timeWindows-error">
            {errors.timeWindows}
          </p>
        )}
      </fieldset>

      <div className="form-field">
        <label htmlFor="language">{t('elderForm.preferences.language')}</label>
        <select
          id="language"
          value={preferences.language}
          onChange={handleLanguage}
          aria-invalid={Boolean(errors.language)}
          aria-describedby={errors.language ? 'language-error' : undefined}
        >
          <option value="">{t('elderForm.preferences.chooseLanguage')}</option>
          {LANGUAGE_VALUES.map((value) => (
            <option value={value} key={value}>
              {t(`elderForm.preferences.${value}`)}
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
          {t('common.back')}
        </button>
        <button type="submit" className="btn">
          {t('common.next')}
        </button>
      </div>
    </form>
  )
}

export default PreferencesStep
