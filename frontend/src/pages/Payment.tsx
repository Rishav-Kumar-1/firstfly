// Payment.tsx — Booking confirmation page

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import Loading from '../components/Loading';

export default function Payment() {
  const { id } = useParams<{ id: string }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    paymentAPI.getStatus(Number(id))
      .then(r => setBooking(r.data.data))
      .catch(() => setError('Booking not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading fullScreen message="Loading booking..." />;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter,system-ui,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {error ? (
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, padding: '2.5rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>❌</div>
            <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 16 }}>{error}</p>
            <Link to="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: 12, fontWeight: 700, display: 'inline-block' }}>Back to Dashboard</Link>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, padding: '2.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.25rem' }}>🎉</div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Booking Confirmed!</h2>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>Your booking <strong>{booking?.booking_reference}</strong> is confirmed. Our team will contact you shortly.</p>
            <Link to="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 14, fontWeight: 700, display: 'inline-block', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>View My Bookings</Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>Booking Details</h1>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 4 }}>Reference: {booking?.booking_reference}</p>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '1.25rem', textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>Route</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{booking?.from_location} → {booking?.to_location}</p>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 6 }}>
                {booking?.travel_date ? new Date(booking.travel_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e', marginBottom: 4 }}>📞 Contact Us to Confirm</p>
              <p style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.6 }}>
                Call or WhatsApp us at <strong>+91 98771 24650</strong> to confirm your booking and arrange payment.
              </p>
            </div>

            <a href="tel:+919877124650"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 18px rgba(37,99,235,0.3)', marginBottom: 12 }}>
              📞 Call Now
            </a>

            <button onClick={() => { setSuccess(true); }}
              style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✅ Mark as Confirmed
            </button>

            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <Link to="/dashboard" style={{ color: '#6b7280', fontSize: '0.85rem' }}>← Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
