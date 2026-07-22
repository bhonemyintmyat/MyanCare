import { useTranslation } from 'react-i18next'
import '../styles/Hero.css'

/*
 * Hero: the first thing visitors see.
 * All text comes from t() — see src/i18n/locales/ for the strings.
 */
function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <h1 className="hero-title">
        {t('hero.title1')}
        <br />
        {t('hero.title2')}
      </h1>
      <p className="hero-subtitle">{t('hero.subtitle')}</p>
      {/* The button is a link that scrolls down to the pricing section */}
      <a href="#pricing" className="btn">
        {t('hero.cta')}
      </a>
      <p className="hero-note">{t('hero.note')}</p>
    </section>
  )
}

export default Hero
