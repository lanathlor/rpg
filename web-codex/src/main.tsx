import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// GitHub Pages SPA redirect fix - restore the path after 404 redirect
const redirect = sessionStorage.getItem('ghpages-redirect')
if (redirect) {
  sessionStorage.removeItem('ghpages-redirect')
  history.replaceState(null, '', redirect)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
