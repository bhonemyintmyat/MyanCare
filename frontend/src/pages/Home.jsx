import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Pricing from '../components/Pricing.jsx'
import SignupForm from '../components/SignupForm.jsx'

/*
 * Home is a "page": it doesn't have much of its own markup,
 * it just stacks the landing page sections in order.
 * Each section lives in its own component so it's easy to
 * find, edit, or reorder.
 */
function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Pricing />
      <SignupForm />
    </main>
  )
}

export default Home
