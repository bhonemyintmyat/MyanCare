import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/Header.css'

function Header() {
  // The header changes depending on whether someone is logged in
  const { user, logout } = useAuth()

  return (
    <header className="header">
      {/* <Link> navigates without reloading the page (unlike <a>) */}
      <Link to="/" className="header-logo">
        MyanCare
      </Link>

      <nav className="header-nav">
        {/* Plain <a href="/#..."> so these work from any page:
            they load the home page and jump to the section */}
        <a href="/#how-it-works">How it works</a>
        <a href="/#pricing">Pricing</a>

        {user ? (
          // Logged in: greet by first name, offer log out
          <>
            <span className="header-user">Hi, {user.fullName.split(' ')[0]}</span>
            <button type="button" className="header-logout" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          // Logged out: show the two auth pages
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="header-cta">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
