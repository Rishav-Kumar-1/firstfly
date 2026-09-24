import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); nav('/'); setOpen(false); };

  const links = [
    { to: '/',             label: 'Home',          end: true  },
    { to: '/vehicles',     label: 'Vehicles',       end: false },
    { to: '/packages',     label: 'Tour Packages',  end: false },
    { to: '/destinations', label: 'Destinations',   end: false },
    { to: '/about',        label: 'About',          end: false },
    { to: '/contact',      label: 'Contact',        end: false },
  ];

  return (
    <nav style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'} border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xl"
            style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)', fontFamily: 'Poppins,sans-serif' }}>F</div>
          <span className="font-black text-xl" style={{ fontFamily: 'Poppins,sans-serif' }}>
            <span style={{ color: '#2563eb' }}>FIRST</span><span style={{ color: '#111827' }}>FLY</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin" className="text-sm font-semibold text-purple-600 hover:text-purple-800">Admin Panel</Link>
                </>
              )}
              <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600">
                Hi, {user?.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout}
                className="text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 px-3 py-2">Login</Link>
              <Link to="/register" className="text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">Register</Link>
            </>
          )}
          <Link to="/vehicles"
            className="text-sm font-bold text-white px-5 py-2.5 rounded-lg transition-colors"
            style={{ background: '#f97316' }}
            onMouseOver={e => (e.currentTarget.style.background = '#ea6c0a')}
            onMouseOut={e => (e.currentTarget.style.background = '#f97316')}>
            Book Now
          </Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="menu">
          <svg width="22" height="22" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <><line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/></>
            ) : (
              <><line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="16" x2="19" y2="16"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-xl">🛡️ Admin Panel</Link>
                )}
                <Link to="/dashboard"   onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">My Dashboard</Link>
                <Link to="/my-bookings" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">My Bookings</Link>
                <Link to="/profile"     onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">My Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl">Register</Link>
              </>
            )}
            <Link to="/vehicles" onClick={() => setOpen(false)}
              className="block text-center px-4 py-3 text-sm font-bold text-white rounded-xl"
              style={{ background: '#f97316' }}>Book Now</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
