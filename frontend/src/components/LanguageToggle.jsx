import { useTranslation } from 'react-i18next'
import '../styles/Header.css'

/*
 * LanguageToggle: switches between English and Burmese.
 *
 * The button always shows the language you'd switch TO, written in
 * that language's own script — "မြန်မာ" while in English, "English"
 * while in Burmese — so it's readable to the person who needs it.
 *
 * Language names are deliberately NOT in the translation files:
 * they never change with the UI language.
 */
const TARGET = { en: 'my', my: 'en' }
const NAMES = { en: 'English', my: 'မြန်မာ' }

function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const current = i18n.resolvedLanguage ?? 'en'
  const target = TARGET[current] ?? 'en'

  return (
    /* lang tells screen readers which language the label itself is
       in, so "မြန်မာ" is pronounced as Burmese, not spelled out */
    <button
      type="button"
      className="header-lang"
      onClick={() => i18n.changeLanguage(target)}
      lang={target}
      aria-label={t('nav.changeLanguage')}
    >
      {NAMES[target]}
    </button>
  )
}

export default LanguageToggle
