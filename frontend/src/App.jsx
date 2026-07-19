import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'

/*
 * App is the root component.
 * Header and Footer appear on every page, with the current
 * page's content sandwiched in between.
 */
function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  )
}

export default App
