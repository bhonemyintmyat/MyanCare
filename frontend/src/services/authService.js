/*
 * authService: a FAKE backend for now.
 *
 * Every function here pretends to be a real API call:
 * - setTimeout simulates network delay
 * - localStorage plays the role of the server's database
 *
 * When you build a real backend, you only need to change THIS file —
 * the rest of the app (pages, context) won't know the difference,
 * because they just call these functions and await the result.
 * That separation is the whole point of a "service" file.
 *
 * ⚠ SECURITY NOTE: we store passwords in plain text in localStorage.
 * That is fine for a demo with fake data, but a real backend must
 * NEVER do this — passwords get hashed on the server (e.g. bcrypt),
 * and the browser never stores them at all.
 */

// Keys used in localStorage, kept in one place so they're easy to change
const USERS_KEY = 'myancare_users'
const CURRENT_USER_KEY = 'myancare_current_user'

// Simulates network latency: await fakeDelay() pauses for ~600ms
function fakeDelay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helpers for our pretend "database"
function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || []
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/*
 * Create an account.
 * Resolves with the new user (minus the password) on success,
 * or throws an Error with a friendly message on failure.
 */
export async function signup({ fullName, email, phone, country, password }) {
  // TODO(real API): replace everything below with something like:
  //   const res = await fetch('/api/signup', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ fullName, email, phone, country, password }),
  //   })
  //   if (!res.ok) throw new Error(await res.text())
  //   return res.json()
  await fakeDelay()

  const users = loadUsers()
  const alreadyExists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  )
  if (alreadyExists) {
    throw new Error(
      'An account with this email already exists. Try logging in instead.',
    )
  }

  const newUser = { fullName, email, phone, country, password }
  saveUsers([...users, newUser])

  // The "session": remember who is logged in (never store the password here)
  const publicUser = { fullName, email, phone, country }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser))
  return publicUser
}

/*
 * Log in with email + password.
 */
export async function login(email, password) {
  // TODO(real API): POST /api/login with { email, password },
  // store the returned session token, and return the user.
  await fakeDelay()

  const users = loadUsers()
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  )

  // One vague message for both "no such user" and "wrong password" —
  // this is standard practice so attackers can't probe which emails exist.
  if (!user || user.password !== password) {
    throw new Error("Email or password doesn't match. Please try again.")
  }

  const publicUser = {
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    country: user.country,
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser))
  return publicUser
}

/*
 * Log out: just forget the current session.
 */
export function logout() {
  // TODO(real API): also tell the server to invalidate the session token.
  localStorage.removeItem(CURRENT_USER_KEY)
}

/*
 * Who is logged in right now? (Used on page load so a refresh
 * doesn't log the user out.) Returns the user object or null.
 */
export function getCurrentUser() {
  // TODO(real API): validate the stored session token with the server.
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
}
