/*
 * Runs before every test file (see vitest.config.js).
 */
import { afterAll, afterEach, beforeAll } from 'vitest'
// Adds matchers like expect(...).toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { server } from './server.js'

// findBy* queries wait 1s by default; lazy-loaded routes can take
// longer on a slow machine, so give them more room before failing
configure({ asyncUtilTimeout: 4000 })

// jsdom doesn't implement scrolling; stub it so RouteFocus's
// window.scrollTo(0, 0) doesn't print warnings in every test
window.scrollTo = () => {}

// Start the MSW mock server before any test runs.
// onUnhandledRequest: 'error' → a test fails loudly if the app
// fetches an endpoint we haven't mocked, instead of hanging.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(async () => {
  cleanup() // unmount React trees between tests
  server.resetHandlers() // undo any per-test handler overrides
  localStorage.clear() // fresh "database" and session for every test

  // The i18next instance is a singleton — put it back in English so
  // a language-toggle test can't leak Burmese into the next test
  const { default: i18n } = await import('../i18n/config')
  if (i18n.resolvedLanguage !== 'en') await i18n.changeLanguage('en')
})

afterAll(() => server.close())
