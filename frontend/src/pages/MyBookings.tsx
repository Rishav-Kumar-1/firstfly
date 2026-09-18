// MyBookings.tsx — redirects to Dashboard which has all bookings
import { Link } from 'react-router-dom';

export default function MyBookings() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>My Bookings</h1>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>View all your bookings in your dashboard.</p>
        <Link to="/dashboard"
          style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 700 }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
