import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { destinationAPI } from '../services/api';
import type { Destination } from '../types';

const IMGS: Record<string, string> = {
  Manali:    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=75',
  Shimla:    'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=500&q=75',
  Rishikesh: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=500&q=75',
  Jaipur:    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=75',
  Agra:      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=75',
  Kashmir:   'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=500&q=75',
  Mussoorie: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=75',
  Nainital:  'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=500&q=75',
  Varanasi:  'https://images.unsplash.com/photo-1561361058-c24e022a5f6d?w=500&q=75',
  Haridwar:  'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=500&q=75',
};
const FB = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=75';

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    destinationAPI.getAll()
      .then(r => setDestinations(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = q
    ? destinations.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.state.toLowerCase().includes(q.toLowerCase()))
    : destinations;

  return (
    <div style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link> / Destinations
          </p>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, marginBottom: 10 }}>Destinations</h1>
          <p style={{ color: 'rgba(219,234,254,0.85)', marginBottom: 20 }}>Discover amazing places across India</p>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search destinations..."
            style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '12px 18px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {loading ? <Loading message="Loading destinations..." /> : (
          <>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{filtered.length} destination(s)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
              {filtered.map(dest => (
                <Link key={dest.id} to={`/destinations/${dest.id}`} className="card"
                  style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', display: 'block', height: 200, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <img
                    src={IMGS[dest.name] || (dest.image_url && !dest.image_url.includes('placehold.co') ? dest.image_url : FB)}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = FB; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6),rgba(0,0,0,0.05) 55%)' }} />
                  <div style={{ position: 'absolute', bottom: 14, left: 14, color: '#fff' }}>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Poppins,sans-serif' }}>{dest.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', marginTop: 2 }}>{dest.state}</p>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>
                    Explore →
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📍</div>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>No destinations found</p>
                <button onClick={() => setQ('')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear search</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
