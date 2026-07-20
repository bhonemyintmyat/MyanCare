import { subscription } from '../../data/mockDashboard.js'
import '../../styles/Dashboard.css'

// "2026-08-01" → "1 Aug 2026"
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/*
 * Section 4: current plan and when the next payment is due.
 */
function SubscriptionCard() {
  return (
    <section className="dash-card subscription-card">
      <h2 className="dash-card-title">Subscription</h2>

      <div className="sub-row">
        <span className="sub-label">Plan</span>
        <span>{subscription.plan}</span>
      </div>
      <div className="sub-row">
        <span className="sub-label">Price</span>
        <span>{subscription.price}</span>
      </div>
      <div className="sub-row">
        <span className="sub-label">Status</span>
        {/* Reuses the green "good" badge style from the call reports */}
        <span className="mood-badge mood-good">{subscription.status}</span>
      </div>
      <div className="sub-row">
        <span className="sub-label">Next payment</span>
        <span>{formatDate(subscription.nextPaymentDate)}</span>
      </div>
    </section>
  )
}

export default SubscriptionCard
