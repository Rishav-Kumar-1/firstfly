// Payment.tsx — Pay for an existing booking from the dashboard

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { paymentAPI } from '../services/api';
import Loading from '../components/Loading';

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { openPayment, processing } = useRazorpay();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    paymentAPI.getStatus(Number(id))
      .then(r => setBooking(r.data.data))
      .catch(() => setError('Booking not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePay = () => {
    if (!booking || !user) return;
    setPayError('');
    openPayment({
      bookingId: booking.id,
      userName:  user.name,
      userEmail: user.email,
      onSuccess: () => {
        setSuccess(true);
        setBooking((p: object) => ({ ...p, payment_status: 'PAID', booking_status: 'CONFIRMED' }));
      },
      onFailure: (msg) => {
        if (!msg.includes('cancelled')) setPayError(msg);
      },
    });
  };

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
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Payment Successful!</h2>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>Your booking <strong>{booking?.booking_reference}</strong> is now confirmed.</p>
            <Link to="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 14, fontWeight: 700, display: 'inline-block', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>View My Bookings</Link>
          </div>
        ) : booking?.payment_status === 'PAID' ? (
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 20, padding: '2.5rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#16a34a', marginBottom: 8 }}>Already Paid</h2>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>This booking is already paid and confirmed.</p>
            <Link to="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 14, fontWeight: 700, display: 'inline-block' }}>Go to Dashboard</Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>Complete Payment</h1>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 4 }}>Booking: {booking?.booking_reference}</p>
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '1.25rem', textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>Amount to Pay</p>
              <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a', fontFamily: 'Poppins,sans-serif' }}>
                ₹{Number(booking?.total_amount || 0).toLocaleString('en-IN')}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>{booking?.from_location} → {booking?.to_location}</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {[['📱','UPI'],['💳','Cards'],['🏦','Net Banking'],['👛','Wallets']].map(([ic, lb]) => (
                <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                  <span>{ic}</span> {lb}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
              <span>🔒</span>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Secured by <strong>Razorpay</strong>. 256-bit SSL encrypted.</p>
            </div>

            {payError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: '0.85rem' }}>
                ⚠️ {payError}
              </div>
            )}

            <button onClick={handlePay} disabled={processing}
              style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: '1rem', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.8 : 1, boxShadow: '0 4px 18px rgba(37,99,235,0.3)', fontFamily: 'inherit' }}>
              {processing ? 'Processing...' : `💳 Pay ₹${Number(booking?.total_amount || 0).toLocaleString('en-IN')}`}
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
