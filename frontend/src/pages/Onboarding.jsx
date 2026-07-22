import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { useOnboardingStore } from '../stores/onboardingStore.js'
import Stepper from '../components/Stepper.jsx'
import IdentityStep from '../components/onboarding/IdentityStep.jsx'
import PreferencesStep from '../components/onboarding/PreferencesStep.jsx'
import CareContextStep from '../components/onboarding/CareContextStep.jsx'
import '../styles/Onboarding.css'

/*
 * Onboarding: the multi-step wizard for adding an elder.
 *
 * The page itself is thin: the Stepper shows progress, and the
 * current step component (picked by the store's `step` value)
 * does the actual work. Because `step` lives in the persisted
 * Zustand store, refreshing the browser reopens the same step.
 */
function Onboarding() {
  const step = useOnboardingStore((state) => state.step)
  const { t } = useTranslation()

  // Translated fresh on every render, so the labels follow the language
  const stepLabels = [
    t('elderForm.steps.identity'),
    t('elderForm.steps.preferences'),
    t('elderForm.steps.care'),
  ]

  // Set once the POST /elders succeeds; switches to the success view
  const [createdElder, setCreatedElder] = useState(null)

  /*
   * A11y: the URL doesn't change between steps, so RouteFocus can't
   * help here. Instead, when the step number changes, move focus to
   * the new step's heading (each h2 has tabIndex={-1}) so screen
   * readers announce where the user landed.
   */
  const cardRef = useRef(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return // don't steal focus when the page first opens
    }
    cardRef.current?.querySelector('.onboarding-step-title')?.focus()
  }, [step])

  if (createdElder) {
    return (
      <main className="onboarding">
        <div className="onboarding-card onboarding-success">
          <h1 className="onboarding-title">{t('elderForm.success.title')}</h1>
          <p>
            {/* Trans: the string has <strong> markup around the
                interpolated name */}
            <Trans
              i18nKey="elderForm.success.text"
              values={{ name: createdElder.identity.name }}
              components={{ strong: <strong /> }}
            />
          </p>
          <Link to="/dashboard" className="btn">
            {t('elderForm.success.backToDashboard')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="onboarding">
      <h1 className="onboarding-title">{t('elderForm.pageTitle')}</h1>

      <div className="onboarding-card" ref={cardRef}>
        <Stepper steps={stepLabels} currentStep={step} />

        {step === 0 && <IdentityStep />}
        {step === 1 && <PreferencesStep />}
        {step === 2 && <CareContextStep onDone={setCreatedElder} />}
      </div>
    </main>
  )
}

export default Onboarding
