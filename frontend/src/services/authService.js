/*
 * authService: talks to the auth API over real fetch() calls.
 *
 * There is no fake logic in this file anymore — requests genuinely
 * leave the app. In development, Mock Service Worker (see src/mocks/)
 * intercepts them at the network level and answers like a server
 * would. When VITE_USE_MOCKS is off, the same requests hit the real
 * backend at VITE_API_URL. This file never knows the difference.
 */
import { API_URL, parseResponse } from './apiConfig.js'

// The "session": which user is logged in on this device
const CURRENT_USER_KEY = 'myancare_current_user'

/*
 * Create an account. Resolves with the new user (minus password),
 * or throws an Error with a friendly message (e.g. duplicate email).
 */
export async function signup(details) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  })
  const user = await parseResponse(response)

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  return user
}

/*
 * Log in with email + password.
 */
export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const user = await parseResponse(response)

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  return user
}

/*
 * Log out: forget the current session.
 */
export function logout() {
  // TODO(real API): also tell the server to invalidate the session token.
  localStorage.removeItem(CURRENT_USER_KEY)
}

/*
 * Who is logged in right now? Used on page load so a refresh
 * doesn't log the user out. Returns the user object or null.
 */
export function getCurrentUser() {
  // TODO(real API): validate the stored session token with the server.
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
}
