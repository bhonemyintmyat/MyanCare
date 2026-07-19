import '../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <span className="header-logo">MyanCare</span>
      <nav className="header-nav">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">About</a>
      </nav>
    </header>
  )
}

export default Header
