// NotFound.tsx — 404 page
// Navbar/Footer provided by App.tsx routing
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter,system-ui,sans-serif', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '6rem', fontWeight: 900, color: '#e5e7eb', lineHeight: 1 }}>404</p>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 10, marginTop: 8 }}>Page Not Found</h1>
        <p style={{ color: '#6b7280', marginBottom: 28, fontSize: '0.95rem' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/"
          style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 32px', borderRadius: 14, fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
