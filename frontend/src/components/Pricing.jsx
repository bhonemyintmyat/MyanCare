import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import '../styles/Pricing.css'

/*
 * Pricing: one simple plan, shown as a single card.
 *
 * The price line uses <Trans> instead of t(): the translation
 * string contains BOTH an interpolated value ({{amount}}) and
 * inner markup (<small>…</small> → the styled period span), so a
 * translator can reorder everything freely without touching JSX.
 */
function Pricing() {
  const { t } = useTranslation()

  return (
    <section className="pricing" id="pricing">
      <h2 className="section-title">{t('pricing.title')}</h2>

      <div className="price-card">
        <p className="price-plan">{t('pricing.plan')}</p>
        <p className="price-amount">
          <Trans
            i18nKey="pricing.perMonth"
            values={{ amount: '25,000' }}
            components={{ small: <span className="price-period" /> }}
          />
        </p>

        <ul className="price-features">
          <li>{t('pricing.feature1')}</li>
          <li>{t('pricing.feature2')}</li>
          <li>{t('pricing.feature3')}</li>
          <li>{t('pricing.feature4')}</li>
        </ul>

        {/* Navigates to the signup page (no reload, thanks to React Router) */}
        <Link to="/signup" className="btn">
          {t('pricing.cta')}
        </Link>
        <p className="price-note">{t('pricing.note')}</p>
      </div>
    </section>
  )
}

export default Pricing
