// App.tsx — The root component of our React application
// This is where we define all the "pages" and which URL shows which page
// Think of it as the "table of contents" for the entire app

import { Routes, Route } from 'react-router-dom'

// We'll create these pages in Phase 3 onwards
// For now, we create simple placeholder pages to confirm routing works

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">🚌 TravelGo</h1>
        <p className="text-xl mb-2">Travel Vehicle & Tour Booking Platform</p>
        <p className="text-blue-200 mb-8">Travel Together. Travel Better.</p>
        <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-green-300 font-semibold text-lg">✅ Phase 1 Complete!</p>
          <p className="text-white/80 mt-2">Frontend is running on React + Vite + Tailwind</p>
          <p className="text-white/80">Backend will be connected in Phase 6</p>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page not found</p>
        <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Go Home
        </a>
      </div>
    </div>
  )
}

// Routes tell React: "when the URL is /xxx, show this component"
// The * at the end means "anything that didn't match above"
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
