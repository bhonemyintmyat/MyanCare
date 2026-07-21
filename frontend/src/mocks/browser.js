/*
 * MSW browser setup: registers a Service Worker that intercepts
 * the app's fetch() calls and routes them to our handlers.
 *
 * Only imported (dynamically) from main.jsx when VITE_USE_MOCKS is
 * "true" — production builds with mocks off never load this code.
 */
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

export const worker = setupWorker(...handlers)
