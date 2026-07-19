import '../styles/Pricing.css'

/*
 * Pricing: one simple plan, shown as a single card.
 * If you add more plans later, you can turn this into an array
 * and .map() over it like HowItWorks does.
 */
function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <h2 className="section-title">Simple pricing</h2>

      <div className="price-card">
        <p className="price-plan">Monthly Care Plan</p>
        <p className="price-amount">
          25,000 MMK
          <span className="price-period"> / month</span>
        </p>

        <ul className="price-features">
          <li>Scheduled calls to your parent — you pick the days</li>
          <li>Your recorded voice note, delivered with care</li>
          <li>A wellness update after every call</li>
          <li>Works on any GSM phone — no apps, no internet</li>
        </ul>

        <a href="#" className="btn">
          Get Started
        </a>
        <p className="price-note">Cancel anytime.</p>
      </div>
    </section>
  )
}

export default Pricing
