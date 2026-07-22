import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import ParentCard from '../components/dashboard/ParentCard.jsx'
import CallReports from '../components/dashboard/CallReports.jsx'
import VoiceNote from '../components/dashboard/VoiceNote.jsx'
import SubscriptionCard from '../components/dashboard/SubscriptionCard.jsx'
import '../styles/Dashboard.css'

/*
 * Dashboard: the home base for a logged-in subscriber.
 * Like Home.jsx, this page mostly composes smaller pieces —
 * the four sections live in components/dashboard/.
 */
function Dashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <main className="dashboard">
      <h1 className="dashboard-greeting">
        {t('dashboard.greeting', { name: user.fullName.split(' ')[0] })}
      </h1>
      <p className="dashboard-subtitle">
        {t('dashboard.subtitle')}{' '}
        <Link to="/onboarding">{t('dashboard.addAnother')}</Link>
      </p>

      {/* CSS grid arranges these four cards (see Dashboard.css) */}
      <div className="dashboard-grid">
        <ParentCard />
        <CallReports />
        <VoiceNote />
        <SubscriptionCard />
      </div>
    </main>
  )
}

export default Dashboard
