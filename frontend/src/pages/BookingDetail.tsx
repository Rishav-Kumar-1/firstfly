// BookingDetail.tsx — Shows full details of a single booking

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const statusColors: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  ASSIGNED:  'bg-indigo-100 text-indigo-700 border-indigo-200',
  ONGOING:   'bg-purple-100 text-purple-700 border-purple-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const paymentColors: Record<string, string> = {
  PENDING:  'bg-orange-100 text-orange-700',
  PAID:     'bg-green-100 text-green-700',
  FAILED:   'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    bookingAPI.getById(Number(id))
      .then(r => setBooking(r.data.data))
      .catch(() => setError('Booking not found or access denied.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await bookingAPI.cancel(Number(id));
      setBooking((prev: typeof booking) => ({ ...prev, booking_status: 'CANCELLED' }));
    } catch {
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading booking details..." />;

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,system-ui,sans-serif', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>❌</div>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 16 }}>{error}</p>
          <Link to="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: 12, fontWeight: 700 }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.booking_status);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter,system-ui,sans-serif', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 4 }}>
              Booking Details
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Reference: <strong style={{ color: '#2563eb' }}>{booking.booking_reference}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '6px 14px', borderRadius: 20, border: '1.5px solid', ...Object.fromEntries(Object.entries(statusColors[booking.booking_status] || 'bg-gray-100 text-gray-600').map(() => [])) }}
              className={`text-sm font-semibold px-3 py-1 rounded-full border ${statusColors[booking.booking_status] || 'bg-gray-100 text-gray-600'}`}>
              {booking.booking_status}
            </span>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${paymentColors[booking.payment_status] || 'bg-gray-100 text-gray-600'}`}>
              {booking.payment_status === 'PAID' ? '💳 PAID' : booking.payment_status}
            </span>
          </div>
        </div>

        {/* Route card */}
        <div style={{ background: '#eff6ff', borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: 2 }}>FROM</p>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#1e40af' }}>{booking.from_location}</p>
          </div>
          <div style={{ fontSize: '1.5rem', color: '#93c5fd' }}>✈</div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: 2 }}>TO</p>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#1e40af' }}>{booking.to_location}</p>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trip Details</h3>
          {[
            ['Travel Date',   new Date(booking.travel_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
            ...(booking.return_date ? [['Return Date', new Date(booking.return_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })]] : []),
            ['Trip Type',     booking.trip_type?.replace('_', ' ')],
            ['Passengers',    booking.passengers],
            ['Distance',      `${booking.distance_km} km`],
            ['Vehicle',       booking.vehicle_name],
            ...(booking.driver_name ? [['Driver', booking.driver_name], ['Driver Phone', booking.driver_phone]] : []),
            ...(booking.notes ? [['Notes', booking.notes]] : []),
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
              <span style={{ color: '#6b7280' }}>{k}</span>
              <span style={{ fontWeight: 600, color: '#111827', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Fare breakdown */}
        {booking.total_amount > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fare Breakdown</h3>
            {[
              ['Base Fare',     `₹${Number(booking.base_fare || 0).toLocaleString('en-IN')}`],
              ['Driver Charge', `₹${Number(booking.driver_charge || 0).toLocaleString('en-IN')}`],
              ...(booking.toll_charge > 0    ? [['Toll Charge',    `₹${Number(booking.toll_charge).toLocaleString('en-IN')}`]] : []),
              ...(booking.parking_charge > 0 ? [['Parking Charge', `₹${Number(booking.parking_charge).toLocaleString('en-IN')}`]] : []),
              ...(booking.night_charge > 0   ? [['Night Charge',   `₹${Number(booking.night_charge).toLocaleString('en-IN')}`]] : []),
              ...(booking.discount > 0       ? [['Discount',       `-₹${Number(booking.discount).toLocaleString('en-IN')}`]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>{k}</span>
                <span style={{ color: k === 'Discount' ? '#16a34a' : '#374151' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 4px', fontSize: '1rem' }}>
              <span style={{ fontWeight: 800, color: '#111827' }}>Total Amount</span>
              <span style={{ fontWeight: 900, color: '#2563eb', fontSize: '1.1rem' }}>₹{Number(booking.total_amount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Admin-only: customer info */}
        {isAdmin && booking.customer_name && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Customer</h3>
            {[
              ['Name',  booking.customer_name],
              ['Email', booking.customer_email],
              ['Phone', booking.customer_phone],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* What happens next (pending bookings) */}
        {booking.booking_status === 'PENDING' && booking.payment_status !== 'PAID' && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', marginBottom: 4 }}>📋 What happens next?</p>
            <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.6 }}>
              Our team will review your booking and call you at <strong>+91 98771 24650</strong> within 2 hours to confirm.
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="tel:+919877124650"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', padding: '11px 22px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
            📞 Call Us
          </a>
          {canCancel && !isAdmin && (
            <button onClick={handleCancel} disabled={cancelling}
              style={{ background: cancelling ? '#9ca3af' : '#ef4444', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 22px', fontWeight: 700, fontSize: '0.875rem', cursor: cancelling ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {cancelling ? 'Cancelling...' : '✕ Cancel Booking'}
            </button>
          )}
          <Link to="/dashboard"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f3f4f6', color: '#374151', padding: '11px 22px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem' }}>
            ← My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
