// Navbar.tsx — Professional sticky navigation bar

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  // Add shadow when scrolled past the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/',            label: 'Home',         end: true  },
    { to: '/vehicles',    label: 'Vehicles',     end: false },
    { to: '/packages',    label: 'Tour Packages',end: false },
    { to: '/destinations',label: 'Destinations', end: false },
    { to: '/about',       label: 'About',        end: false },
    { to: '/contact',     label: 'Contact',      end: false },
  ];

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'
    } border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <span className="text-white font-black text-lg" style={{fontFamily:'Poppins,sans-serif'}}>T</span>
            </div>
            <div className="leading-none">
              <span className="text-blue-600 font-black text-xl" style={{fontFamily:'Poppins,sans-serif'}}>Travel</span>
              <span className="text-gray-900 font-black text-xl" style={{fontFamily:'Poppins,sans-serif'}}>Go</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkCls}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* ── Desktop Auth + CTA ── */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                  👤 {user?.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout}
                  className="text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-2">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                  Register
                </Link>
              </>
            )}
            <Link to="/vehicles"
              className="text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md shadow-orange-200">
              Book Now
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-5 flex flex-col gap-1 shadow-xl">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) =>
                `py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}

          <div className="border-t border-gray-100 mt-3 pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  👤 My Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl text-sm font-semibold text-purple-600 hover:bg-purple-50">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left py-3 px-4 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50">
                  Register
                </Link>
              </>
            )}
            <Link to="/vehicles" onClick={() => setMenuOpen(false)}
              className="mt-1 text-center py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
