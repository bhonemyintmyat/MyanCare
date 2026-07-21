/*
 * MSW request handlers: the "pretend backend".
 *
 * Mock Service Worker intercepts real fetch() requests at the
 * network level and lets these handlers answer them. The app's
 * service files genuinely call fetch('/api/...') — they have no
 * idea the response came from here instead of a server.
 *
 * localStorage plays the role of the server's database, so signups
 * survive a refresh just like before.
 *
 * ⚠ Demo-only: passwords are stored in plain text here. A real
 * backend must hash passwords (e.g. bcrypt) and never return them.
 */
import { delay, http, HttpResponse } from 'msw'
import { API_URL } from '../services/apiConfig.js'

const USERS_KEY = 'myancare_users'
const ELDERS_KEY = 'myancare_elders'

// Simulate network latency in the browser, but keep tests fast
async function networkDelay() {
  if (import.meta.env.MODE !== 'test') await delay(600)
}

function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || []
}

export const handlers = [
  // POST /auth/signup — create an account
  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    await networkDelay()
    const details = await request.json()

    const users = loadUsers()
    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === details.email.toLowerCase(),
    )
    if (alreadyExists) {
      // 409 Conflict is the conventional status for "already exists"
      return HttpResponse.json(
        { message: 'An account with this email already exists. Try logging in instead.' },
        { status: 409 },
      )
    }

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, details]))

    // Return the user without the password, like a real API would
    const { password, ...publicUser } = details
    return HttpResponse.json(publicUser, { status: 201 })
  }),

  // POST /auth/login — check credentials
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    await networkDelay()
    const { email, password } = await request.json()

    const user = loadUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    )

    // One vague message for both "no such user" and "wrong password" —
    // standard practice so attackers can't probe which emails exist.
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: "Email or password doesn't match. Please try again." },
        { status: 401 },
      )
    }

    const { password: _pw, ...publicUser } = user
    return HttpResponse.json(publicUser)
  }),

  // POST /elders — save an elder profile from onboarding
  http.post(`${API_URL}/elders`, async ({ request }) => {
    await networkDelay()
    const elderData = await request.json()

    const elders = JSON.parse(localStorage.getItem(ELDERS_KEY)) || []
    const created = {
      id: Date.now(), // a real server would generate this
      ...elderData,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(ELDERS_KEY, JSON.stringify([...elders, created]))

    return HttpResponse.json(created, { status: 201 })
  }),
]
