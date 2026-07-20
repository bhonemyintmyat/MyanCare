import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/*
 * ProtectedRoute: a gatekeeper for pages that need a login.
 *
 * Usage (in App.jsx):
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute><Dashboard /></ProtectedRoute>
 *   } />
 *
 * If someone is logged in, it renders whatever it wraps (children).
 * If not, <Navigate> redirects them to the login page instead —
 * so typing /dashboard in the URL bar can't skip the login.
 */
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    // "replace" removes /dashboard from history, so pressing the
    // browser Back button after logging in doesn't bounce them out
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
