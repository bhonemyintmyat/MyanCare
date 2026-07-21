/*
 * MSW for tests: the SAME handlers the browser uses, but attached
 * to Node's networking instead of a Service Worker. This means
 * tests exercise the app's real fetch() calls end to end —
 * component → service → (intercepted) network → handler.
 */
import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers.js'

export const server = setupServer(...handlers)
