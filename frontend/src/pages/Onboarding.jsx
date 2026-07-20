import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOnboardingStore } from '../stores/onboardingStore.js'
import Stepper from '../components/Stepper.jsx'
import IdentityStep from '../components/onboarding/IdentityStep.jsx'
import PreferencesStep from '../components/onboarding/PreferencesStep.jsx'
import CareContextStep from '../components/onboarding/CareContextStep.jsx'
import '../styles/Onboarding.css'

const STEP_LABELS = ['Identity', 'Call preferences', 'Care context']

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

  // Set once the mock POST /elders succeeds; switches to the success view
  const [createdElder, setCreatedElder] = useState(null)

  if (createdElder) {
    return (
      <main className="onboarding">
        <div className="onboarding-card onboarding-success">
          <h1 className="onboarding-title">All set! 💚</h1>
          <p>
            <strong>{createdElder.identity.name}</strong> has been added.
            Our team will call to introduce ourselves before the first
            scheduled call.
          </p>
          <Link to="/dashboard" className="btn">
            Back to dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="onboarding">
      <h1 className="onboarding-title">Set up calls for your parent</h1>

      <div className="onboarding-card">
        <Stepper steps={STEP_LABELS} currentStep={step} />

        {step === 0 && <IdentityStep />}
        {step === 1 && <PreferencesStep />}
        {step === 2 && <CareContextStep onDone={setCreatedElder} />}
      </div>
    </main>
  )
}

export default Onboarding
