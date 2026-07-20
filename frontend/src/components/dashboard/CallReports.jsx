import { callReports } from '../../data/mockDashboard.js'
import '../../styles/Dashboard.css'

/*
 * Everything the UI needs to know about each mood lives in one map:
 * the label text and the CSS class that colors the badge.
 * Adding a new mood later = one new entry here + one CSS rule.
 */
const MOODS = {
  good: { label: 'Good', className: 'mood-good' },
  okay: { label: 'Okay', className: 'mood-okay' },
  concerning: { label: 'Concerning', className: 'mood-concerning' },
}

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
 */
function CallReports() {
  return (
    <section className="dash-card reports-card">
      <h2 className="dash-card-title">Recent call reports</h2>

      <ul className="report-list">
        {callReports.map((report) => {
          const mood = MOODS[report.mood]
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
              <p className="report-caller">— {report.caller}, your caller</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default CallReports
