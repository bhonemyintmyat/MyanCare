import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import LanguageToggle from './LanguageToggle.jsx'
import '../styles/Header.css'

function Header() {
  // The header changes depending on whether someone is logged in
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <header className="header">
      {/* <Link> navigates without reloading the page (unlike <a>) */}
      <Link to="/" className="header-logo">
        MyanCare
      </Link>

      <nav className="header-nav">
        {/* Plain <a href="/#..."> so these work from any page:
            they load the home page and jump to the section */}
        <a href="/#how-it-works">{t('nav.howItWorks')}</a>
        <a href="/#pricing">{t('nav.pricing')}</a>

        {user ? (
          // Logged in: link to their dashboard, greet, offer log out
          <>
            <Link to="/dashboard">{t('nav.dashboard')}</Link>
            <span className="header-user">
              {t('nav.greeting', { name: user.fullName.split(' ')[0] })}
            </span>
            <button type="button" className="header-logout" onClick={logout}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          // Logged out: show the two auth pages
          <>
            <Link to="/login">{t('nav.login')}</Link>
            <Link to="/signup" className="header-cta">
              {t('nav.signup')}
            </Link>
          </>
        )}

        <LanguageToggle />
      </nav>
    </header>
  )
}

export default Header
