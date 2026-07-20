import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService.js'

/*
 * AuthContext: shares "who is logged in" with the WHOLE app.
 *
 * Why context? Without it, the user object would have to be passed
 * down as props through every component (App → Header → ...), even
 * ones that don't care. Context is React's built-in way to make a
 * value available anywhere in the tree.
 *
 * How the pieces fit:
 * - <AuthProvider> wraps the app (see main.jsx) and owns the state.
 * - useAuth() is a small custom hook any component can call to get
 *   { user, signup, login, logout }.
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialize from localStorage so refreshing the page keeps you logged in.
  // Passing a function to useState makes it run only once, on first render.
  const [user, setUser] = useState(() => authService.getCurrentUser())

  // These wrap the service so components never talk to it directly —
  // they just call these and the context keeps `user` in sync.
  async function signup(details) {
    const newUser = await authService.signup(details)
    setUser(newUser)
    return newUser
  }

  async function login(email, password) {
    const loggedIn = await authService.login(email, password)
    setUser(loggedIn)
    return loggedIn
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  const value = { user, signup, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/*
 * Custom hook — components write:
 *   const { user, logout } = useAuth()
 * instead of importing useContext + AuthContext everywhere.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    // Helpful error if someone forgets to wrap the app in <AuthProvider>
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
