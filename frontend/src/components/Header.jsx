import '../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <span className="header-logo">MyanCare</span>
      {/* These links scroll to the sections with matching id="" attributes */}
      <nav className="header-nav">
        <a href="#how-it-works">How it works</a>
        <a href="#pricing">Pricing</a>
      </nav>
    </header>
  )
}

export default Header
