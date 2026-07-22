import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import RouteFocus from './components/RouteFocus.jsx'

/*
 * Route-level code splitting: lazy() turns each page into its own
 * JS file that the browser downloads only when the route is first
 * visited. Someone landing on the homepage no longer downloads the
 * dashboard, the wizard, zod, etc. — check the dist/ folder after
 * `npm run build` to see the separate chunks.
 */
const Home = lazy(() => import('./pages/Home.jsx'))
const Signup = lazy(() => import('./pages/Signup.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/*
 * App is the root component.
 * Header and Footer stay on every page; <Routes> swaps the middle:
 *   /           → Home (the landing page)
 *   /signup     → Signup form
 *   /login      → Login form
 *   /dashboard  → Dashboard (logged-in only)
 *   /onboarding → Elder onboarding wizard (logged-in only)
 *   anything else → 404 page
 */
function App() {
  const { t } = useTranslation()

  return (
    <>
      {/* Lets keyboard users jump past the nav straight to content */}
      <a className="skip-link" href="#main-content">
        {t('common.skipToContent')}
      </a>

      {/* Moves focus into the content when the route changes */}
      <RouteFocus />

      <Header />

      {/* tabIndex={-1} makes the div focusable from code (RouteFocus)
          without adding it to the keyboard Tab order */}
      <div id="main-content" tabIndex={-1}>
        {/* ErrorBoundary: a crash inside a page shows a friendly
            recovery screen instead of a blank white page */}
        <ErrorBoundary>
          {/* Suspense shows the fallback while a lazy page's JS loads */}
          <Suspense
            fallback={<div className="route-loading">{t('common.loading')}</div>}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              {/* "*" matches anything the routes above didn't */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>

      <Footer />
    </>
  )
}

export default App
