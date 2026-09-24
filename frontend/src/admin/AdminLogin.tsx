// AdminLogin.tsx — Real admin login page

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in as admin → go straight to dashboard
  if (isAuthenticated && isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login({ email: form.email, password: form.password });
      const userData = res.data.data;
      if (userData.role !== 'ADMIN') {
        setError('Access denied. This portal is for admins only.');
        setLoading(false);
        return;
      }
      login(userData);
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg,#1e1b4b,#4c1d95,#6d28d9)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl" style={{ fontFamily: 'Poppins,sans-serif' }}>F</span>
          </div>
          <span className="text-white font-black text-xl" style={{ fontFamily: 'Poppins,sans-serif' }}>FIRSTFLY</span>
        </Link>
        <div>
          <div className="text-6xl mb-6">🛡️</div>
          <h2 className="text-white font-black text-3xl mb-4" style={{ fontFamily: 'Poppins,sans-serif', lineHeight: 1.2 }}>
            Admin Portal
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            Manage vehicles, bookings, customers and fleet operations from one place.
          </p>
        </div>
        <p className="text-purple-300 text-xs">© 2026 FIRSTFLY. Admin access only.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-600">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">FIRSTFLY</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl font-bold text-gray-900">Admin Sign In</h1>
          </div>
          <p className="text-gray-500 text-sm mb-6">Enter your admin credentials to continue</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="admin@firstfly.in" autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(124,58,237,0.35)',
                }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : '🛡️ Sign in as Admin'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Not an admin?{' '}
            <Link to="/login" className="text-purple-600 font-medium hover:underline">
              Go to customer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
