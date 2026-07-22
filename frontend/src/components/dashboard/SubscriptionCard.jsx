import { useTranslation } from 'react-i18next'
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
 * Row labels are translated; plan name/price/status come from the
 * API data.
 */
function SubscriptionCard() {
  const { t } = useTranslation()

  return (
    <section className="dash-card subscription-card">
      <h2 className="dash-card-title">{t('dashboard.subscription.title')}</h2>

      <div className="sub-row">
        <span className="sub-label">{t('dashboard.subscription.plan')}</span>
        <span>{subscription.plan}</span>
      </div>
      <div className="sub-row">
        <span className="sub-label">{t('dashboard.subscription.price')}</span>
        <span>{subscription.price}</span>
      </div>
      <div className="sub-row">
        <span className="sub-label">{t('dashboard.subscription.status')}</span>
        {/* Reuses the green "good" badge style from the call reports */}
        <span className="mood-badge mood-good">{subscription.status}</span>
      </div>
      <div className="sub-row">
        <span className="sub-label">
          {t('dashboard.subscription.nextPayment')}
        </span>
        <span>{formatDate(subscription.nextPaymentDate)}</span>
      </div>
    </section>
  )
}

export default SubscriptionCard
