import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/*
 * 404 page — rendered by the catch-all route (path="*") when no
 * other route matches the URL.
 */
function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="error-page">
      <h1 className="error-title">{t('common.notFoundTitle')}</h1>
      <p className="error-text">{t('common.notFoundText')}</p>
      <Link to="/" className="btn">
        {t('common.notFoundCta')}
      </Link>
    </main>
  )
}

export default NotFound
