// Login.tsx — STATIC VERSION (no API calls)

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: string })?.from || '/dashboard';

  const [role, setRole]   = useState<'CLIENT' | 'ADMIN'>('CLIENT');
  const [form, setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof typeof errors])
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    
    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // STATIC LOGIN: Check hardcoded admin credentials
    if (form.email === 'admin@travelgo.in' && form.password === 'password123') {
      const userData = {
        id: 1,
        name: 'Admin',
        email: 'admin@travelgo.in',
        role: 'ADMIN' as const,
        token: 'static-admin-token',
      };
      login(userData);
      navigate('/admin', { replace: true });
    } 
    // Any other email+password (min 6 chars) → CUSTOMER
    else if (form.password.length >= 6) {
      const userData = {
        id: Date.now(),
        name: form.email.split('@')[0],
        email: form.email,
        role: 'CUSTOMER' as const,
        token: 'static-customer-token',
      };
      login(userData);
      navigate(from, { replace: true });
    } else {
      setErrors({ general: 'Invalid credentials' });
    }
    
    setLoading(false);
  };

  const inp = (hasErr?: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
      hasErr ? 'border-red-400 bg-red-50 focus:ring-red-300' : role === 'ADMIN' ? 'border-gray-200 focus:ring-purple-400' : 'border-gray-200 focus:ring-blue-500'
    }`;

  const accent = role === 'ADMIN' ? '#7c3aed' : '#2563eb';

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12"
        style={{ background: role === 'ADMIN'
          ? 'linear-gradient(135deg,#4c1d95,#7c3aed,#6d28d9)'
          : 'linear-gradient(135deg,#1e3a8a,#2563eb,#312e81)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl" style={{ fontFamily: 'Poppins,sans-serif' }}>F</span>
          </div>
          <span className="text-white font-black text-xl" style={{ fontFamily: 'Poppins,sans-serif' }}>FIRSTFLY</span>
        </Link>

        <div>
          <div className="text-6xl mb-6">{role === 'ADMIN' ? '🛡️' : '🧑‍💼'}</div>
          <h2 className="text-white font-black text-3xl mb-4" style={{ fontFamily: 'Poppins,sans-serif', lineHeight: 1.2 }}>
            {role === 'ADMIN' ? 'Admin Portal' : 'Welcome Back!'}
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            {role === 'ADMIN'
              ? 'Sign in to manage vehicles, bookings, customers and fleet operations.'
              : 'Sign in to view your bookings, manage trips and explore our fleet.'}
          </p>
        </div>

        <p className="text-blue-300 text-xs">© 2026 FIRSTFLY. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent }}>
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">FIRSTFLY</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-6">Choose your account type and sign in</p>

          {/* Role tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button type="button" onClick={() => { setRole('CLIENT'); setErrors({}); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: role === 'CLIENT' ? '#fff' : 'transparent',
                color:      role === 'CLIENT' ? '#2563eb' : '#6b7280',
                boxShadow:  role === 'CLIENT' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>
              🧑‍💼 Client
            </button>
            <button type="button" onClick={() => { setRole('ADMIN'); setErrors({}); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: role === 'ADMIN' ? '#fff' : 'transparent',
                color:      role === 'ADMIN' ? '#7c3aed' : '#6b7280',
                boxShadow:  role === 'ADMIN' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>
              🛡️ Admin
            </button>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
                <span>⚠️</span> {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder={role === 'ADMIN' ? 'admin@firstfly.in' : 'you@example.com'}
                  autoComplete="email" className={inp(errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs hover:underline" style={{ color: accent }}>Forgot password?</a>
                </div>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="current-password" className={inp(errors.password)} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#9ca3af' : `linear-gradient(135deg,${accent},${role === 'ADMIN' ? '#6d28d9' : '#1d4ed8'})`,
                  boxShadow: `0 4px 14px ${role === 'ADMIN' ? 'rgba(124,58,237,0.3)' : 'rgba(37,99,235,0.3)'}`,
                }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : `Sign in as ${role === 'ADMIN' ? 'Admin' : 'Client'} →`}
              </button>
            </form>

          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium hover:underline" style={{ color: accent }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
