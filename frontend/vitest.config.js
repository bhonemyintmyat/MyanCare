import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/*
 * Vitest configuration (kept separate from vite.config.js so the
 * app build and the test runner stay independent).
 *
 * - environment jsdom: simulates a browser DOM in Node so React
 *   components can render inside tests
 * - globals: lets tests use describe/test/expect without imports
 * - setupFiles: runs before every test file (jest-dom matchers +
 *   the MSW mock server lifecycle)
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
