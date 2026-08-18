// main.tsx — This is the ENTRY POINT of the React frontend
// React reads this file first and "mounts" (attaches) your app into index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// StrictMode helps catch bugs during development — it runs some checks twice
// BrowserRouter enables URL-based navigation (routing) in React
// createRoot attaches the React app to the <div id="root"> in index.html

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
