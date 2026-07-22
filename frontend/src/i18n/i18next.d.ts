/*
 * Type augmentation: teaches TypeScript the exact shape of our
 * translation keys, with en.json as the source of truth.
 *
 * In any TypeScript file (and in .tsx components as the codebase
 * migrates), t('nav.login') autocompletes and t('nav.typo') is a
 * COMPILE ERROR — `npm run typecheck` (part of the build) fails.
 */
import 'i18next'
import type en from './locales/en.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
