/*
 * i18next configuration — imported ONCE, in main.jsx, before the
 * app renders. Everything else just calls useTranslation().
 *
 * The chain:
 *   LanguageDetector — figures out which language to start in
 *   initReactI18next — connects i18next to React hooks
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import my from './locales/my.json'

export const supportedLanguages = ['en', 'my'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Translations are bundled inline (no network fetch needed)
    resources: {
      en: { translation: en },
      my: { translation: my },
    },
    // Any key missing from the active language falls back to English
    fallbackLng: 'en',
    supportedLngs: supportedLanguages as unknown as string[],
    // navigator gives "en-US" — treat it as "en"
    load: 'languageOnly',
    detection: {
      // Where to look, in order: a previously saved choice first,
      // then the browser's language. The choice is cached back to
      // localStorage so it sticks across visits.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'myancare_language',
    },
    interpolation: {
      // React already escapes rendered text; double-escaping would
      // show "&amp;" style artifacts
      escapeValue: false,
    },
  })

/*
 * Keep the <html> element in sync with the active language:
 * - lang: screen readers pick the right voice/pronunciation
 * - data-lang: a CSS hook, e.g. html[data-lang='my'] { ... }
 */
function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language
  document.documentElement.dataset.lang = language
}

// Apply on initial hydration (the detector has already resolved)…
syncDocumentLanguage(i18n.resolvedLanguage ?? 'en')
// …and again on every toggle
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
