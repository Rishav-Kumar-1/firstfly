// Navbar.tsx
// The top navigation bar shown on every page.
// - Shows the TravelGo logo and navigation links
// - Collapses into a hamburger menu on mobile
// - Shows login/logout based on auth state

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  // NavLink applies an "active" class automatically when its href matches the current URL
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 font-medium ${
      isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div className="leading-tight">
              <span className="text-blue-600 font-bold text-xl">Travel</span>
              <span className="text-gray-800 font-bold text-xl">Go</span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>
            <NavLink to="/packages" className={linkClass}>Tour Packages</NavLink>
            <NavLink to="/destinations" className={linkClass}>Destinations</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </div>

          {/* ── Desktop Auth Buttons ── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Hi, {user?.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
            <Link
              to="/vehicles"
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Book Now
            </Link>
          </div>

          {/* ── Mobile Hamburger Button ── */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/vehicles" className={linkClass} onClick={() => setMenuOpen(false)}>Vehicles</NavLink>
          <NavLink to="/packages" className={linkClass} onClick={() => setMenuOpen(false)}>Tour Packages</NavLink>
          <NavLink to="/destinations" className={linkClass} onClick={() => setMenuOpen(false)}>Destinations</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>Contact</NavLink>

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-purple-600 font-medium" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left text-red-500 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="bg-blue-600 text-white text-center px-4 py-2 rounded-lg font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
            <Link
              to="/vehicles"
              className="bg-orange-500 text-white text-center px-4 py-2 rounded-lg font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
