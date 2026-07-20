import { parent } from '../../data/mockDashboard.js'
import '../../styles/Dashboard.css'

// Turns "2026-07-22T10:00:00" into "Wednesday, 22 July at 10:00 AM"
function formatCallTime(isoString) {
  const date = new Date(isoString)
  const day = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${day} at ${time}`
}

/*
 * Section 1: who we call, and when the next call happens.
 */
function ParentCard() {
  return (
    <section className="dash-card parent-card">
      <h2 className="dash-card-title">Your parent</h2>

      <p className="parent-name">{parent.name}</p>
      <p className="parent-detail">
        {parent.age} years old · {parent.township}
      </p>
      <p className="parent-detail">GSM phone: {parent.phone}</p>

      {/* The next call is the most important info — give it a highlight box */}
      <div className="next-call">
        <span className="next-call-label">Next scheduled call</span>
        <span className="next-call-time">{formatCallTime(parent.nextCall)}</span>
      </div>
    </section>
  )
}

export default ParentCard
