/*
 * Runs before every test file (see vitest.config.js).
 */
import { afterAll, afterEach, beforeAll } from 'vitest'
// Adds matchers like expect(...).toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { server } from './server.js'

// jsdom doesn't implement scrolling; stub it so RouteFocus's
// window.scrollTo(0, 0) doesn't print warnings in every test
window.scrollTo = () => {}

// Start the MSW mock server before any test runs.
// onUnhandledRequest: 'error' → a test fails loudly if the app
// fetches an endpoint we haven't mocked, instead of hanging.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup() // unmount React trees between tests
  server.resetHandlers() // undo any per-test handler overrides
  localStorage.clear() // fresh "database" and session for every test
})

afterAll(() => server.close())
