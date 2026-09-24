import { useState } from 'react';
import { Link } from 'react-router-dom';

const STATIC_PACKAGES = [
  { id: 1, name: 'Manali Winter Escape', destination: 'Manali, Himachal Pradesh', duration: '5D / 4N',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=75',
    highlights: ['Solang Valley', 'Rohtang Pass', 'Old Manali', 'River Rafting'],
    description: 'Experience the snow-capped peaks and adventurous trails of Manali with comfortable vehicle travel.',
  },
  { id: 2, name: 'Shimla Heritage Tour', destination: 'Shimla, Himachal Pradesh', duration: '4D / 3N',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=75',
    highlights: ['Mall Road', 'Jakhu Temple', 'Kufri', 'Toy Train View'],
    description: 'Explore the Queen of Hills with its colonial charm, scenic mountain roads and cool weather.',
  },
  { id: 3, name: 'Rishikesh Spiritual Retreat', destination: 'Rishikesh, Uttarakhand', duration: '3D / 2N',
    image: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=600&q=75',
    highlights: ['Ganga Aarti', 'Laxman Jhula', 'White Water Rafting', 'Yoga Sessions'],
    description: 'A divine journey to the yoga capital of the world — river views, temples and adventure sports.',
  },
  { id: 4, name: 'Golden Triangle Tour', destination: 'Delhi • Agra • Jaipur', duration: '6D / 5N',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=75',
    highlights: ['Taj Mahal', 'Amber Fort', 'Qutub Minar', 'City Palace'],
    description: "India's most iconic circuit covering three historic cities with a dedicated vehicle and experienced driver.",
  },
  { id: 5, name: 'Kashmir Valley Tour', destination: 'Kashmir, J&K', duration: '7D / 6N',
    image: 'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=600&q=75',
    highlights: ['Dal Lake Shikara', 'Gulmarg Gondola', 'Pahalgam Meadows', 'Mughal Gardens'],
    description: 'Discover paradise on earth — shikara rides, snow-covered mountain passes and lush green valleys.',
  },
  { id: 6, name: 'Mussoorie Weekend Getaway', destination: 'Mussoorie, Uttarakhand', duration: '2D / 1N',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',
    highlights: ['Kempty Falls', 'Gun Hill', 'Mall Road', 'Camel Back Road'],
    description: 'A quick escape to the Queen of Hills — perfect for families and weekend travellers from Delhi/NCR.',
  },
  { id: 7, name: 'Nainital Lake Tour', destination: 'Nainital, Uttarakhand', duration: '3D / 2N',
    image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=600&q=75',
    highlights: ['Naini Lake Boating', 'Snow View Point', 'Bhimtal', 'Jim Corbett'],
    description: 'A serene retreat to the beautiful lake city of Uttarakhand — great for families and couples.',
  },
  { id: 8, name: 'Varanasi Spiritual Journey', destination: 'Varanasi, Uttar Pradesh', duration: '3D / 2N',
    image: 'https://images.unsplash.com/photo-1561361058-c24e022a5f6d?w=600&q=75',
    highlights: ['Ganga Aarti', 'Kashi Vishwanath', 'Morning Boat Ride', 'Sarnath'],
    description: 'Experience the spiritual soul of India — ancient ghats, sacred rituals and timeless traditions.',
  },
  { id: 9, name: 'Jaipur Royal Tour', destination: 'Jaipur, Rajasthan', duration: '3D / 2N',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=75',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    description: 'Explore the Pink City with its magnificent forts, palaces and vibrant bazaars in royal Rajasthan.',
  },
];

export default function Packages() {
  const [q, setQ] = useState('');

  const filtered = q
    ? STATIC_PACKAGES.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.destination.toLowerCase().includes(q.toLowerCase())
      )
    : STATIC_PACKAGES;

  return (
    <div style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>
      {/* Header */}
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
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{filtered.length} package(s) found</p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
            <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>No packages found</p>
            <button onClick={() => setQ('')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear search</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=60'; }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.65),rgba(0,0,0,0.05) 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                    <p style={{ color: '#fbbf24', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📍 {p.destination}</p>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Poppins,sans-serif', marginTop: 3 }}>{p.name}</h3>
                    <span style={{ display: 'inline-block', marginTop: 5, background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.72rem', padding: '3px 10px', borderRadius: 999 }}>
                      {p.duration}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1rem 1.1rem' }}>
                  <p className="line-clamp-2" style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 10 }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                    {p.highlights.map(h => (
                      <span key={h} style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.68rem', fontWeight: 600, padding: '3px 9px', borderRadius: 999 }}>✓ {h}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{p.duration}</span>
                    <Link to={`/packages/${p.id}`}
                      style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '7px 16px', borderRadius: 9, display: 'inline-block' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
