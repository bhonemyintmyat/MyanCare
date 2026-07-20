import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/global.css'

/*
 * The app is wrapped in two "providers":
 * - BrowserRouter enables page navigation without full reloads
 * - AuthProvider shares the logged-in user with every component
 * Anything inside these tags can use routing and useAuth().
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
