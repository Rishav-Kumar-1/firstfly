import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { packageAPI } from '../services/api';
import type { TourPackage } from '../types';

const IMGS: Record<string, string> = {
  Manali:    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=75',
  Shimla:    'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=500&q=75',
  Rishikesh: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=500&q=75',
  Jaipur:    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=75',
  Agra:      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=75',
  Kashmir:   'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=500&q=75',
  Mussoorie: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=75',
  Nainital:  'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=500&q=75',
};
const getImg = (p: TourPackage) =>
  (p.image_url && !p.image_url.includes('placehold.co')) ? p.image_url : (IMGS[p.destination_name || ''] || Object.values(IMGS)[0]);

export default function Packages() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    packageAPI.getAll()
      .then(r => setPackages(r.data.data || []))
      .catch(() => setError('Failed to load packages.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = q ? packages.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    (p.destination_name || '').toLowerCase().includes(q.toLowerCase())
  ) : packages;

  return (
    <div style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link> / Tour Packages
          </p>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, marginBottom: 10 }}>Tour Packages</h1>
          <p style={{ color: 'rgba(219,234,254,0.85)', marginBottom: 20 }}>Handpicked itineraries for India's most loved destinations.</p>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search packages or destinations..."
            style={{ width: '100%', maxWidth: 460, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '12px 18px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {loading ? <Loading message="Loading packages..." /> :
         error ? <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div> :
         filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
            <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>No packages found</p>
            <button onClick={() => setQ('')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear search</button>
          </div>
        ) : (
          <>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{filtered.length} package(s) found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '1.5rem' }}>
              {filtered.map(p => (
                <div key={p.id} className="card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                    <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = Object.values(IMGS)[0]; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.62),rgba(0,0,0,0.05) 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                      <p style={{ color: '#fbbf24', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📍 {p.destination_name}</p>
                      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Poppins,sans-serif', marginTop: 3 }}>{p.name}</h3>
                      <span style={{ display: 'inline-block', marginTop: 5, background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: '0.7rem', padding: '3px 10px', borderRadius: 999 }}>
                        {p.duration_days}D / {p.duration_nights}N
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1rem 1.1rem' }}>
                    <p className="line-clamp-2" style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 10 }}>{p.description}</p>
                    {p.highlights?.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                        {p.highlights.slice(0, 3).map(h => (
                          <span key={h} style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.68rem', fontWeight: 600, padding: '3px 9px', borderRadius: 999 }}>✓ {h}</span>
                        ))}
                      </div>
                    ) : null}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                      <div>
                        <p style={{ color: '#9ca3af', fontSize: '0.7rem' }}>Starting from</p>
                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb', fontFamily: 'Poppins,sans-serif' }}>₹{p.starting_price.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/packages/${p.id}`} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 11px', borderRadius: 9, background: '#fff' }}>View</Link>
                        <Link to={`/booking?package=${p.id}`} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '6px 12px', borderRadius: 9 }}>Book</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
