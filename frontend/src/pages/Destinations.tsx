import { useState } from 'react';
import { Link } from 'react-router-dom';

const DESTINATIONS = [
  { id: 1,  name: 'Manali',    state: 'Himachal Pradesh', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=75',  desc: 'Snow-capped peaks, Rohtang Pass, adventure sports and the beautiful Beas River valley.' },
  { id: 2,  name: 'Shimla',    state: 'Himachal Pradesh', img: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=75',  desc: 'The Queen of Hills — colonial architecture, Mall Road and toy train views.' },
  { id: 3,  name: 'Rishikesh', state: 'Uttarakhand',      img: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=600&q=75',  desc: 'Yoga capital of the world — Ganga Aarti, river rafting and spiritual retreats.' },
  { id: 4,  name: 'Jaipur',    state: 'Rajasthan',        img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=75',  desc: 'The Pink City — Amber Fort, Hawa Mahal, City Palace and vibrant bazaars.' },
  { id: 5,  name: 'Agra',      state: 'Uttar Pradesh',    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=75',  desc: 'Home to the Taj Mahal — one of the Seven Wonders of the World.' },
  { id: 6,  name: 'Kashmir',   state: 'Jammu & Kashmir',  img: 'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=600&q=75',  desc: 'Paradise on Earth — Dal Lake, Gulmarg, Pahalgam and snow-covered mountain passes.' },
  { id: 7,  name: 'Mussoorie', state: 'Uttarakhand',      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',  desc: 'Queen of Hill Stations — Kempty Falls, Gun Hill and scenic valley views.' },
  { id: 8,  name: 'Nainital',  state: 'Uttarakhand',      img: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=600&q=75',  desc: 'A charming lake city surrounded by mountains, forests and colonial heritage.' },
  { id: 9,  name: 'Varanasi',  state: 'Uttar Pradesh',    img: 'https://images.unsplash.com/photo-1561361058-c24e022a5f6d?w=600&q=75',  desc: 'One of the world\'s oldest cities — ghats, Ganga Aarti and spiritual energy.' },
  { id: 10, name: 'Haridwar',  state: 'Uttarakhand',      img: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=600&q=75',  desc: 'Gateway to the gods — Har Ki Pauri, Ganga Aarti and ancient temples.' },
  { id: 11, name: 'Chandigarh',state: 'Punjab',            img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=75',  desc: 'The City Beautiful — Rock Garden, Sukhna Lake and modern urban design.' },
  { id: 12, name: 'Amritsar',  state: 'Punjab',            img: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600&q=75',  desc: 'Home of the Golden Temple — a sacred Sikh shrine and the Wagah Border ceremony.' },
];

export default function Destinations() {
  const [q, setQ] = useState('');

  const filtered = q
    ? DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.state.toLowerCase().includes(q.toLowerCase())
      )
    : DESTINATIONS;

  return (
    <div style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link> / Destinations
          </p>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, marginBottom: 10 }}>Destinations</h1>
          <p style={{ color: 'rgba(219,234,254,0.85)', marginBottom: 20 }}>Discover amazing places across India</p>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search destinations or states..."
            style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '12px 18px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{filtered.length} destination(s)</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1.25rem' }}>
          {filtered.map(dest => (
            <Link key={dest.id} to={`/destinations/${dest.id}`} className="card"
              style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', height: 220, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'block' }}>
              <img src={dest.img} alt={dest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=75'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.65),rgba(0,0,0,0.05) 55%)' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 14, color: '#fff' }}>
                <p style={{ fontWeight: 700, fontSize: '1.15rem', fontFamily: 'Poppins,sans-serif' }}>{dest.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', marginTop: 2 }}>{dest.state}</p>
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
      </div>
    </div>
  );
}
