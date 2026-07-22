import { useTranslation } from 'react-i18next'
import { callReports } from '../../data/mockDashboard.js'
import '../../styles/Dashboard.css'

// "2026-07-18" → "18 Jul 2026"
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/*
 * Section 2: the list of wellness updates from recent calls.
 *
 * Each mood maps to a translated label + a CSS class for its color.
 * The map lives inside the component because t() must run on every
 * render — labels change when the language does.
 */
function CallReports() {
  const { t } = useTranslation()

  const moods = {
    good: { label: t('dashboard.reports.moodGood'), className: 'mood-good' },
    okay: { label: t('dashboard.reports.moodOkay'), className: 'mood-okay' },
    concerning: {
      label: t('dashboard.reports.moodConcerning'),
      className: 'mood-concerning',
    },
  }

  return (
    <section className="dash-card reports-card">
      <h2 className="dash-card-title">{t('dashboard.reports.title')}</h2>

      <ul className="report-list">
        {callReports.map((report) => {
          const mood = moods[report.mood]
          return (
            <li className="report" key={report.id}>
              <div className="report-header">
                <span className="report-date">{formatDate(report.date)}</span>
                {/* Colored badge: green / amber / red depending on mood */}
                <span className={`mood-badge ${mood.className}`}>
                  {mood.label}
                </span>
              </div>
              <p className="report-summary">{report.summary}</p>
              <p className="report-caller">
                {t('dashboard.reports.caller', { name: report.caller })}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default CallReports
