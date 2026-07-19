import '../styles/Hero.css'

/*
 * Hero: the first thing visitors see.
 * Its job is to explain the service in one warm sentence
 * and point people to the "Get Started" button.
 */
function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-title">
        Be there for your parents,
        <br />
        even from far away.
      </h1>
      <p className="hero-subtitle">
        MyanCare makes warm, scheduled phone calls to your elderly parents in
        Myanmar — no smartphone, no internet, just a friendly voice on the
        phone they already have.
      </p>
      {/* The button is a link that scrolls down to the pricing section */}
      <a href="#pricing" className="btn">
        Get Started
      </a>
      <p className="hero-note">
        For families working in Japan, Singapore, Thailand and beyond
      </p>
    </section>
  )
}

export default Hero
