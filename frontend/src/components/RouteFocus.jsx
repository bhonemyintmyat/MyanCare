import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/*
 * RouteFocus: accessibility helper for client-side navigation.
 *
 * In a normal website, following a link loads a new page and screen
 * readers start reading from the top. React Router swaps content
 * WITHOUT a page load, so without help, keyboard and screen-reader
 * users are left focused on the link they just clicked, with no
 * announcement that anything changed.
 *
 * Fix: whenever the URL path changes, move focus to the main
 * content container (which has tabIndex={-1} in App.jsx) and
 * scroll back to the top.
 */
function RouteFocus() {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Don't steal focus on the very first page load —
    // only on navigations after that
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const main = document.getElementById('main-content')
    if (main) {
      main.focus()
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null // renders nothing — it exists only for the side effect
}

export default RouteFocus
