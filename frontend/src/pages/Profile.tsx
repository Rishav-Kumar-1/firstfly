// Profile.tsx — View and update customer profile

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Profile() {
  const { user, login } = useAuth();

  const [form, setForm]         = useState({ name: '', phone: '' });
  const [pwForm, setPwForm]     = useState({ current_password: '', new_password: '', confirm: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving]     = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [msg, setMsg]           = useState('');
  const [pwMsg, setPwMsg]       = useState('');
  const [pwErr, setPwErr]       = useState<Record<string, string>>({});

  // Fetch real profile from backend on mount
  useEffect(() => {
    authAPI.getProfile()
      .then(r => {
        const p = r.data.data;
        setForm({ name: p.name || '', phone: p.phone || '' });
        // Sync auth context with latest name from DB
        if (user) login({ ...user, name: p.name });
      })
      .catch(() => {
        // Fallback to whatever is in auth context
        setForm({ name: user?.name || '', phone: '' });
      })
      .finally(() => setLoadingProfile(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setMsg('Name is required.'); return; }
    setSaving(true);
    setMsg('');
    try {
      await authAPI.updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      if (user) login({ ...user, name: form.name.trim() });
      setMsg('✅ Profile updated successfully!');
    } catch {
      setMsg('❌ Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!pwForm.current_password)              errs.current_password = 'Current password required';
    if (!pwForm.new_password)                  errs.new_password     = 'New password required';
    else if (pwForm.new_password.length < 6)   errs.new_password     = 'Minimum 6 characters';
    if (pwForm.new_password !== pwForm.confirm) errs.confirm          = 'Passwords do not match';
    setPwErr(errs);
    if (Object.keys(errs).length > 0) return;

    setChangingPw(true);
    setPwMsg('');
    try {
      await authAPI.changePassword({
        current_password: pwForm.current_password,
        new_password:     pwForm.new_password,
      });
      setPwMsg('✅ Password changed successfully!');
      setPwForm({ current_password: '', new_password: '', confirm: '' });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setPwMsg(e.response?.data?.message || '❌ Failed to change password.');
    } finally {
      setChangingPw(false);
      setTimeout(() => setPwMsg(''), 4000);
    }
  };

  const inp = (hasErr?: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
      hasErr ? 'border-red-400 bg-red-50' : 'border-gray-200'
    }`;

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {form.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xl">{form.name || user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full mt-1.5 inline-block">
                {user?.role === 'ADMIN' ? '🛡️ Admin' : '🧑‍💼 Customer'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                className={inp()}
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email" value={user?.email || ''} disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="e.g. 9876543210"
                className={inp()}
              />
            </div>

            {msg && (
              <p className={`text-sm font-medium ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {msg}
              </p>
            )}

            <button type="submit" disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: 'current_password', label: 'Current Password',      ph: '••••••••' },
              { key: 'new_password',     label: 'New Password',          ph: 'Min. 6 characters' },
              { key: 'confirm',          label: 'Confirm New Password',  ph: 'Repeat new password' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type="password"
                  value={pwForm[key as keyof typeof pwForm]}
                  onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={ph}
                  className={inp(pwErr[key])}
                />
                {pwErr[key] && <p className="text-red-500 text-xs mt-1">{pwErr[key]}</p>}
              </div>
            ))}

            {pwMsg && (
              <p className={`text-sm font-medium ${pwMsg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {pwMsg}
              </p>
            )}

            <button type="submit" disabled={changingPw}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 text-sm">
              {changingPw ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
