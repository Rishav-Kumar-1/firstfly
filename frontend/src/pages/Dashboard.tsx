// Dashboard.tsx — Customer dashboard showing all bookings

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import Loading from '../components/Loading';
import type { Booking } from '../types';

// Status badge colors
const statusColors: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  ASSIGNED:  'bg-indigo-100 text-indigo-700',
  ONGOING:   'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

// Payment status badge colors
const paymentColors: Record<string, string> = {
  PENDING:  'bg-orange-100 text-orange-700',
  PAID:     'bg-green-100 text-green-700',
  FAILED:   'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    bookingAPI.getMyBookings()
      .then(r => setBookings(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await bookingAPI.cancel(id);
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, booking_status: 'CANCELLED' } : b
      ));
    } catch { alert('Failed to cancel booking.'); }
    finally { setCancelling(null); }
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming')  return ['PENDING','CONFIRMED','ASSIGNED','ONGOING'].includes(b.booking_status) && b.travel_date >= today;
    if (activeTab === 'completed') return b.booking_status === 'COMPLETED';
    if (activeTab === 'cancelled') return b.booking_status === 'CANCELLED';
    return true;
  });

  // Stats
  const stats = {
    total:     bookings.length,
    upcoming:  bookings.filter(b => ['PENDING','CONFIRMED','ASSIGNED'].includes(b.booking_status)).length,
    completed: bookings.filter(b => b.booking_status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.booking_status === 'CANCELLED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
          <Link to="/vehicles"
            className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm">
            + New Booking
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Trips',       value: stats.total,     color: 'bg-blue-600',   icon: '🚌' },
            { label: 'Upcoming',          value: stats.upcoming,  color: 'bg-indigo-500', icon: '📅' },
            { label: 'Completed',         value: stats.completed, color: 'bg-green-500',  icon: '✅' },
            { label: 'Cancelled',         value: stats.cancelled, color: 'bg-red-500',    icon: '❌' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-lg mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Profile Quick Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex items-center gap-5 flex-wrap">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          <Link to="/profile"
            className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Edit Profile
          </Link>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-bold text-gray-900 text-lg">My Bookings</h2>
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map(tab => (
                <button key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Loading message="Loading your bookings..." />
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' ? "You haven't made any bookings yet." : `No ${activeTab} bookings.`}
              </p>
              <Link to="/vehicles" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Book a Vehicle
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Reference + Status */}
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-bold text-blue-600 text-sm">{booking.booking_reference}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[booking.booking_status]}`}>
                          {booking.booking_status}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentColors[booking.payment_status]}`}>
                          {booking.payment_status}
                        </span>
                      </div>

                      {/* Route */}
                      <p className="font-semibold text-gray-900 mb-1">
                        {booking.from_location} → {booking.to_location}
                      </p>

                      {/* Details row */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>📅 {new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {booking.vehicle_name && <span>🚌 {booking.vehicle_name}</span>}
                        {booking.driver_name && <span>👨‍✈️ {booking.driver_name}</span>}
                        <span>👥 {booking.passengers} passengers</span>
                        <span>🛣 {booking.trip_type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Amount + Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-extrabold text-gray-900 text-lg">
                        ₹{Number(booking.total_amount).toLocaleString('en-IN')}
                      </p>

                      <div className="flex gap-2">
                        <Link to={`/booking/${booking.id}`}
                          className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                          View
                        </Link>
                        {booking.payment_status === 'PENDING' && booking.booking_status !== 'CANCELLED' && (
                          <Link to={`/payment/${booking.id}`}
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                            Pay Now
                          </Link>
                        )}
                        {['PENDING', 'CONFIRMED'].includes(booking.booking_status) && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancelling === booking.id}
                            className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
                            {cancelling === booking.id ? '...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
