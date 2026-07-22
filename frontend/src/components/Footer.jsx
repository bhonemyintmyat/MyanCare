import { useTranslation } from 'react-i18next'
import '../styles/Footer.css'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <p className="footer-logo">MyanCare</p>
      <p className="footer-tagline">{t('common.footerTagline')}</p>
      <nav className="footer-links">
        {/* "/#..." (not just "#...") so these also work from /signup and /login */}
        <a href="/#how-it-works">{t('nav.howItWorks')}</a>
        <a href="/#pricing">{t('nav.pricing')}</a>
        <a href="mailto:hello@myancare.example">{t('common.contact')}</a>
      </nav>
      <p className="footer-copyright">
        © {new Date().getFullYear()} MyanCare. {t('common.rights')}
      </p>
    </footer>
  )
}

export default Footer
