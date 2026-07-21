import { createContext, useCallback, useContext, useState } from 'react'
import '../styles/Toast.css'

/*
 * Toast system: brief popup messages confirming that something
 * happened ("Saved!", "Something went wrong").
 *
 * Usage anywhere in the app:
 *   const addToast = useToast()
 *   addToast('Profile saved.')                 // success (default)
 *   addToast('Could not save.', 'error')       // error styling
 *
 * Accessibility: the container is an aria-live region, so screen
 * readers announce new toasts without focus moving anywhere.
 */

const ToastContext = createContext(null)

// Module-level counter gives each toast a unique key
let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (message, type = 'success') => {
      const id = ++nextId
      setToasts((current) => [...current, { id, message, type }])
      // Toasts dismiss themselves after 4.5 seconds
      setTimeout(() => removeToast(id), 4500)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* aria-live="polite" = announce when the screen reader is idle */}
      <div className="toast-region" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.type}`} role="status" key={toast.id}>
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast-dismiss"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>')
  }
  return context
}
