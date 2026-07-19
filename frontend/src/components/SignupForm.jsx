import { useState } from 'react'
import '../styles/SignupForm.css'

/*
 * SignupForm: a "controlled form" — React state is the single
 * source of truth for every input.
 *
 * How it works:
 * 1. formData holds one property per field.
 * 2. Each input's value comes FROM state (value={formData.x}),
 *    and typing updates state (onChange={handleChange}).
 * 3. On submit we stop the browser's default page reload and
 *    show a thank-you message instead.
 *
 * There is no backend yet, so the data currently stays in the
 * browser. When you have a server, send formData to it inside
 * handleSubmit (e.g. with fetch()).
 */
function SignupForm() {
  const [formData, setFormData] = useState({
    yourName: '',
    email: '',
    parentPhone: '',
    callDay: 'saturday',
  })

  // One submitted flag decides whether to show the form or the thank-you note
  const [submitted, setSubmitted] = useState(false)

  // A single handler works for every field: the input's "name"
  // attribute tells us which property of formData to update.
  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault() // stop the browser from reloading the page
    setSubmitted(true)
  }

  // After submitting, replace the form with a confirmation message
  if (submitted) {
    return (
      <section className="signup" id="signup">
        <div className="signup-card">
          <h2 className="section-title">Thank you! 💚</h2>
          <p className="signup-thanks">
            We received your details, {formData.yourName}. We&apos;ll email you
            at {formData.email} to set up your first call.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="signup" id="signup">
      <h2 className="section-title">Sign up</h2>

      <form className="signup-card" onSubmit={handleSubmit}>
        {/* htmlFor + id link each label to its input (helps screen readers,
            and tapping the label focuses the field on phones) */}
        <div className="form-field">
          <label htmlFor="yourName">Your name</label>
          <input
            type="text"
            id="yourName"
            name="yourName"
            value={formData.yourName}
            onChange={handleChange}
            placeholder="e.g. Aung Ko"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="parentPhone">Your parent&apos;s phone number</label>
          <input
            type="tel"
            id="parentPhone"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleChange}
            placeholder="09 xxx xxx xxx"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="callDay">Preferred call day</label>
          <select
            id="callDay"
            name="callDay"
            value={formData.callDay}
            onChange={handleChange}
          >
            <option value="monday">Monday</option>
            <option value="wednesday">Wednesday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>

        <button type="submit" className="btn signup-submit">
          Start caring calls
        </button>
        <p className="signup-note">
          We&apos;ll contact you within 1 business day to record your voice
          note and schedule the first call.
        </p>
      </form>
    </section>
  )
}

export default SignupForm
