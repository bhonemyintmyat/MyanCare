import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-logo">MyanCare</p>
      <p className="footer-tagline">
        Caring calls home, wherever you work.
      </p>
      <nav className="footer-links">
        <a href="#how-it-works">How it works</a>
        <a href="#pricing">Pricing</a>
        <a href="mailto:hello@myancare.example">Contact</a>
      </nav>
      <p className="footer-copyright">
        © {new Date().getFullYear()} MyanCare. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
