/*
 * Shared test helpers.
 */
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { ThemeProvider } from '../context/ThemeContext.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ToastProvider } from '../context/ToastContext.jsx'
// Side-effect import: initializes the i18next singleton for tests
// (main.jsx does this for the real app)
import '../i18n/config'

/*
 * Renders the real App with all its providers, starting at `route`.
 * MemoryRouter is BrowserRouter's test-friendly sibling: it keeps
 * the URL in memory instead of the address bar.
 */
export function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  )
}

/*
 * Seeds the mock "database" with a user account, as if they had
 * signed up earlier. Useful for login and logged-in-page tests.
 */
export function seedUser(overrides = {}) {
  const user = {
    fullName: 'Aye Chan',
    email: 'ayechan@example.com',
    phone: '+65 9123 4567',
    country: 'singapore',
    password: 'testpass123',
    ...overrides,
  }
  localStorage.setItem('myancare_users', JSON.stringify([user]))
  return user
}

/*
 * Seeds a logged-in session BEFORE rendering, so AuthProvider
 * initializes with this user already logged in.
 */
export function seedSession(user) {
  const { password, ...publicUser } = user
  localStorage.setItem('myancare_current_user', JSON.stringify(publicUser))
  return publicUser
}
