import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Pricing from '../components/Pricing.jsx'

/*
 * Home is a "page": it doesn't have much of its own markup,
 * it just stacks the landing page sections in order.
 * Signing up now happens on its own page (/signup) — the
 * pricing section's button navigates there.
 */
function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Pricing />
    </main>
  )
}

export default Home
