import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'

/*
 * App is the root component.
 * Header and Footer stay on every page; <Routes> swaps the middle
 * part depending on the URL:
 *   /        → Home (the landing page)
 *   /signup  → Signup form
 *   /login   → Login form
 */
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
