// App.tsx — Root component defining all routes for TravelGo

import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Vehicles from './pages/Vehicles'
import VehicleDetails from './pages/VehicleDetails'
import Packages from './pages/Packages'
import PackageDetails from './pages/PackageDetails'
import Destinations from './pages/Destinations'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Layout wrapper: Navbar + page content + Footer
// Used for all public-facing pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    // AuthProvider wraps the entire app so every component can access auth state
    <AuthProvider>
      <Routes>

        {/* ── Public Routes ── */}
        {/* Home has its own Navbar/Footer built-in for the special hero layout */}
        <Route path="/" element={<Home />} />

        <Route path="/vehicles" element={
          <PublicLayout><Vehicles /></PublicLayout>
        } />
        <Route path="/vehicles/:id" element={
          <PublicLayout><VehicleDetails /></PublicLayout>
        } />

        <Route path="/packages" element={
          <PublicLayout><Packages /></PublicLayout>
        } />
        <Route path="/packages/:id" element={
          <PublicLayout><PackageDetails /></PublicLayout>
        } />

        <Route path="/destinations" element={
          <PublicLayout><Destinations /></PublicLayout>
        } />
        <Route path="/about" element={
          <PublicLayout><About /></PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout><Contact /></PublicLayout>
        } />

        {/* ── Auth Routes ── */}
        <Route path="/login" element={
          <PublicLayout><Login /></PublicLayout>
        } />
        <Route path="/register" element={
          <PublicLayout><Register /></PublicLayout>
        } />

        {/* ── Protected Customer Routes ── */}
        {/* ProtectedRoute checks if the user is logged in */}
        {/* If not, it redirects to /login automatically */}
        <Route path="/booking" element={
          <ProtectedRoute>
            <PublicLayout><Booking /></PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PublicLayout><Dashboard /></PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <PublicLayout><MyBookings /></PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PublicLayout><Profile /></PublicLayout>
          </ProtectedRoute>
        } />

        {/* ── Admin Routes ── */}
        {/* adminOnly={true} means only ADMIN role can access */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* ── 404 Catch-all ── */}
        {/* The * matches any URL that didn't match above */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </AuthProvider>
  )
}

export default App
