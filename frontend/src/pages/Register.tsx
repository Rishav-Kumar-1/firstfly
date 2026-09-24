// Register.tsx — Register as Admin or Client

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<'CLIENT' | 'ADMIN'>('CLIENT');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await authAPI.register({
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      });
      login(response.data.data);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrors({ general: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inp = (hasErr?: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${hasErr ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#312e81)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl" style={{ fontFamily: 'Poppins,sans-serif' }}>F</span>
          </div>
          <span className="text-white font-black text-xl" style={{ fontFamily: 'Poppins,sans-serif' }}>FIRSTFLY</span>
        </Link>

        <div>
          <h2 className="text-white font-black text-3xl mb-4" style={{ fontFamily: 'Poppins,sans-serif', lineHeight: 1.2 }}>
            Join India's Trusted<br />Travel Platform
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            Register as a client to book verified vehicles, or as an admin to manage the fleet and operations.
          </p>
          <div className="space-y-3">
            {[
              { icon: '🚌', text: 'Access to 6+ verified vehicles' },
              { icon: '📍', text: '50+ destinations across India' },
              { icon: '👨‍✈️', text: 'Experienced, background-checked drivers' },
              { icon: '🕐', text: '24/7 customer support' },
            ].map(i => (
              <div key={i.text} className="flex items-center gap-3">
                <span className="text-xl">{i.icon}</span>
                <span className="text-blue-100 text-sm">{i.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300 text-xs">© 2026 FIRSTFLY. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">FIRSTFLY</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Choose your account type to get started</p>

          {/* ── Role selector ── */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button type="button" onClick={() => { setRole('CLIENT'); setErrors({}); }}
              className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: role === 'CLIENT' ? '#2563eb' : '#e5e7eb',
                background:  role === 'CLIENT' ? '#eff6ff' : '#fff',
              }}>
              {role === 'CLIENT' && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              )}
              <span className="text-3xl">🧑‍💼</span>
              <span className="font-bold text-gray-900 text-sm">Client</span>
              <span className="text-xs text-gray-500 text-center">Book vehicles &<br/>manage trips</span>
            </button>

            <button type="button" onClick={() => { setRole('ADMIN'); setErrors({}); }}
              className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor: role === 'ADMIN' ? '#7c3aed' : '#e5e7eb',
                background:  role === 'ADMIN' ? '#f5f3ff' : '#fff',
              }}>
              {role === 'ADMIN' && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              )}
              <span className="text-3xl">🛡️</span>
              <span className="font-bold text-gray-900 text-sm">Admin</span>
              <span className="text-xs text-gray-500 text-center">Manage fleet &<br/>operations</span>
            </button>
          </div>

          {/* Selected role badge */}
          <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl text-sm font-medium"
            style={{
              background: role === 'ADMIN' ? '#f5f3ff' : '#eff6ff',
              color:      role === 'ADMIN' ? '#6d28d9' : '#1d4ed8',
            }}>
            <span>{role === 'ADMIN' ? '🛡️' : '🧑‍💼'}</span>
            Registering as <strong>{role === 'ADMIN' ? 'Administrator' : 'Client'}</strong>
          </div>

          {/* ── Form card ── */}
          {role === 'ADMIN' ? (
            /* Admin — no self-registration, contact super admin */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins,sans-serif' }}>
                Admin Access Required
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Admin accounts are created by the super administrator. Self-registration is not available for admin accounts.
              </p>
              <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left space-y-3">
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Contact Super Admin</p>
                <a href="tel:+919877124650"
                  className="flex items-center gap-3 text-sm font-semibold text-purple-800 hover:text-purple-600">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-base">📞</span>
                  +91 98771 24650
                </a>
                <a href="mailto:hsingh67243@gmail.com"
                  className="flex items-center gap-3 text-sm font-semibold text-purple-800 hover:text-purple-600">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-base">✉️</span>
                  hsingh67243@gmail.com
                </a>
              </div>
              <Link to="/login"
                className="block w-full py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                Already have an admin account? Sign in →
              </Link>
            </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
                <span>⚠️</span> {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Rahul Sharma" autoComplete="name" className={inp(errors.name)} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" autoComplete="email" className={inp(errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="9876543210" autoComplete="tel" className={inp(errors.phone)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" autoComplete="new-password" className={inp(errors.password)} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange}
                  placeholder="Repeat your password" autoComplete="new-password" className={inp(errors.confirm_password)} />
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating account...
                  </span>
                ) : 'Create Client Account →'}
              </button>
            </form>
          </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
