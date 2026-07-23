import { createContext, useContext, useEffect, useState } from 'react'

/*
 * ThemeContext: light / dark mode for the whole app.
 *
 * Same provider + hook shape as AuthContext and ToastContext:
 *   const { theme, toggleTheme } = useTheme()
 *
 * How the theme reaches the CSS: we stamp data-theme="dark" on the
 * <html> element, and global.css has a :root[data-theme='dark']
 * block that overrides the color tokens. Light mode is the default
 * and needs no attribute.
 *
 * Default is light. The choice persists in localStorage, and an
 * inline script in index.html applies a saved "dark" BEFORE first
 * paint so returning dark-mode users never see a light flash.
 */

const THEME_KEY = 'myancare_theme'

const ThemeContext = createContext(null)

// Read the starting theme: whatever the pre-paint script already set
// on <html> wins; otherwise fall back to storage, then to light.
function getInitialTheme() {
  const fromDom = document.documentElement.dataset.theme
  if (fromDom === 'dark' || fromDom === 'light') return fromDom
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Whenever the theme changes: persist it and update <html> so the
  // CSS overrides switch. Light removes the attribute (it's default).
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark'
    } else {
      delete document.documentElement.dataset.theme
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return context
}
