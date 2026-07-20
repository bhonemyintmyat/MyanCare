import '../styles/Stepper.css'

/*
 * Stepper: a reusable progress indicator for multi-step flows.
 *
 * Props:
 *   steps       — array of labels, e.g. ['Identity', 'Preferences', 'Care']
 *   currentStep — index of the active step (0-based)
 *
 * It's purely visual — it doesn't own any state, so any wizard
 * (onboarding today, checkout tomorrow) can drop it in.
 */
function Stepper({ steps, currentStep }) {
  return (
    <ol className="stepper">
      {steps.map((label, index) => {
        // Each step is either done (before current), active, or upcoming
        let status = 'upcoming'
        if (index < currentStep) status = 'done'
        if (index === currentStep) status = 'active'

        return (
          <li className={`stepper-step stepper-${status}`} key={label}>
            <span className="stepper-circle">
              {/* Completed steps show a check instead of their number */}
              {status === 'done' ? '✓' : index + 1}
            </span>
            <span className="stepper-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default Stepper
