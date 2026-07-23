import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext.jsx'
import '../styles/ThemeToggle.css'

/*
 * ThemeToggle: the fixed sun/moon button in the top-right corner.
 *
 * It shows the icon of the mode you'd switch TO (a moon while in
 * light mode, a sun while in dark), and its aria-label states the
 * action. It's a plain <button>, so keyboard users get Enter/Space
 * for free. The icons are aria-hidden — the label carries meaning.
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? t('common.themeToLight') : t('common.themeToDark')}
    >
      {isDark ? (
        // Sun — click to go back to light
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <path
            strokeWidth="2"
            strokeLinecap="round"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      ) : (
        // Moon — click to go to dark
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
