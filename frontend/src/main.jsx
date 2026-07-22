import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
// Side-effect import: initializes i18next ONCE for the whole app.
// No provider needed — react-i18next hooks find the instance globally.
import './i18n/config'
import './styles/global.css'

/*
 * Start Mock Service Worker — but ONLY when the env var asks for it.
 * The dynamic import() means production builds with mocks disabled
 * never even download the mock code.
 */
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return

  const { worker } = await import('./mocks/browser.js')
  // bypass: requests our handlers don't cover (images etc.) pass through
  return worker.start({ onUnhandledRequest: 'bypass' })
}

/*
 * The app waits for MSW to be ready before rendering, so the very
 * first fetch is already interceptable. Providers, outermost first:
 * - BrowserRouter: enables client-side navigation
 * - AuthProvider:  shares the logged-in user
 * - ToastProvider: lets any component pop up feedback messages
 */
enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  )
})
