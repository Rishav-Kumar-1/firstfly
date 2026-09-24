import { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Static fleet — uses exact images from "images and videos" folder ───────
interface StaticVehicle {
  id: number;
  name: string;
  type: string;
  seats: number;
  ac: boolean;
  features: string[];
  images: string[];
}

const STATIC_FLEET: StaticVehicle[] = [
  {
    id: 1,
    name: 'Urbania Traveller',
    type: 'Luxury Traveller',
    seats: 17,
    ac: true,
    features: ['Pushback Seats', 'Music System', 'Reading Lights'],
    images: [
      '/vehicles/urbania-0.jpeg',
      '/vehicles/urbania-new-1.jpeg',
      '/vehicles/urbania-new-2.jpeg',
      '/vehicles/urbania-new-3.jpeg',
      '/vehicles/urbania-new-4.jpeg',
      '/vehicles/urbania-new-5.jpeg',
      '/vehicles/urbania-new-6.jpeg',
      '/vehicles/urbania-new-7.jpeg',
    ],
  },
  {
    id: 2,
    name: 'Force Traveller',
    type: 'Traveller',
    seats: 12,
    ac: true,
    features: ['Group Travel', 'Luggage Space'],
    images: [
      '/vehicles/ft-0.jpeg',
      '/vehicles/ft-1.jpeg',
      '/vehicles/ft-2.jpeg',
      '/vehicles/ft-3.jpeg',
      '/vehicles/ft-4.jpeg',
      '/vehicles/ft-5.jpeg',
      '/vehicles/ft-6.jpeg',
      '/vehicles/ft-7.jpeg',
      '/vehicles/ft-8.jpeg',
      '/vehicles/ft-9.jpeg',
      '/vehicles/ft-10.jpeg',
    ],
  },
  {
    id: 3,
    name: 'Toyota Innova Crysta',
    type: 'SUV',
    seats: 7,
    ac: true,
    features: ['Comfortable', 'Spacious', 'Premium'],
    images: [
      '/vehicles/innova-0.jpeg',
      '/vehicles/innova-new-1.jpeg',
      '/vehicles/innova-new-2.jpeg',
      '/vehicles/innova-new-3.jpeg',
      '/vehicles/innova-new-4.jpeg',
      '/vehicles/innova-new-5.jpeg',
      '/vehicles/innova-new-6.jpeg',
      '/vehicles/innova-new-7.jpeg',
      '/vehicles/innova-new-8.jpeg',
      '/vehicles/innova-new-9.jpeg',
      '/vehicles/innova-new-10.jpeg',
      '/vehicles/innova-new-11.jpeg',
    ],
  },
  {
    id: 4,
    name: 'Maruti Suzuki Ertiga',
    type: 'MUV',
    seats: 7,
    ac: true,
    features: ['Family Friendly', 'Economical'],
    images: [
      '/vehicles/ertiga-0.jpeg',
      '/vehicles/ertiga-new-1.jpeg',
      '/vehicles/ertiga-new-2.jpeg',
      '/vehicles/ertiga-new-3.jpeg',
      '/vehicles/ertiga-new-4.jpeg',
    ],
  },
  {
    id: 5,
    name: 'Toyota Etios Sedan',
    type: 'Sedan',
    seats: 5,
    ac: true,
    features: ['Fuel Efficient', 'Comfortable'],
    images: [
      '/vehicles/etios-0.jpeg',
      '/vehicles/etios-new-1.jpeg',
      '/vehicles/etios-new-2.jpeg',
      '/vehicles/etios-new-3.jpeg',
      '/vehicles/etios-new-4.jpeg',
    ],
  },
  {
    id: 6,
    name: 'Maruti Suzuki Dzire',
    type: 'Sedan',
    seats: 5,
    ac: true,
    features: ['Economical', 'City & Highway'],
    images: [
      '/vehicles/dzire-0.jpeg',
      '/vehicles/dzire-new-1.jpeg',
      '/vehicles/dzire-new-2.jpeg',
      '/vehicles/dzire-new-3.jpeg',
    ],
  },
];

function VehicleCard({ v }: { v: StaticVehicle }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const prev = () => setIdx(i => (i - 1 + v.images.length) % v.images.length);
  const next = () => setIdx(i => (i + 1) % v.images.length);

  return (
    <>
      <div className="card" style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
          {/* Clickable image → opens lightbox */}
          <img src={v.images[idx]} alt={v.name}
            onClick={() => setLightbox(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              const nxt = idx + 1;
              if (nxt < v.images.length) setIdx(nxt);
              else el.src = '/vehicles/ft-1.jpeg';
            }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.5),transparent 55%)', pointerEvents: 'none' }} />

          {/* Zoom hint */}
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: 999, pointerEvents: 'none' }}>
            🔍 Click to expand
          </div>

          <span style={{ position: 'absolute', top: 10, right: 10, background: '#16a34a', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>✓ Available</span>
          <span style={{ position: 'absolute', top: 36, right: 10, background: '#2563eb', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>❄️ AC</span>

          {/* Arrows */}
          {v.images.length > 1 && (
            <>
              <button onClick={prev} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>‹</button>
              <button onClick={next} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>›</button>
            </>
          )}

          <div style={{ position: 'absolute', bottom: 10, left: 12, right: 56, pointerEvents: 'none' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Poppins,sans-serif' }}>{v.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', marginTop: 2 }}>👥 {v.seats} Seats • {v.type}</p>
          </div>

          <div style={{ position: 'absolute', bottom: 14, right: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', borderRadius: 999 }}>
            {idx + 1}/{v.images.length}
          </div>
        </div>

        <div style={{ padding: '0.9rem 1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.68rem', fontWeight: 600, padding: '2px 9px', borderRadius: 999 }}>AC</span>
            {v.features.map(f => (
              <span key={f} style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '0.68rem', fontWeight: 600, padding: '2px 9px', borderRadius: 999 }}>{f}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{v.seats} Seats • {v.type}</span>
            <Link to="/contact"
              style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '7px 14px', borderRadius: 9, display: 'inline-block' }}>
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Close */}
          <button onClick={() => setLightbox(false)}
            style={{ position: 'absolute', top: 18, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 42, height: 42, borderRadius: '50%', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

          {/* Counter */}
          <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>
            {v.name} — {idx + 1} / {v.images.length}
          </div>

          {/* Prev arrow */}
          <button onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>

          {/* Image */}
          <img src={v.images[idx]} alt={v.name}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '88vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />

          {/* Next arrow */}
          <button onClick={e => { e.stopPropagation(); next(); }}
            style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>

          {/* Thumbnail strip */}
          <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, maxWidth: '90vw', overflowX: 'auto', padding: '4px 8px' }}>
            {v.images.map((src, i) => (
              <img key={i} src={src} alt="" onClick={e => { e.stopPropagation(); setIdx(i); }}
                style={{ width: 54, height: 38, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: i === idx ? '2.5px solid #f97316' : '2.5px solid transparent', opacity: i === idx ? 1 : 0.55, flexShrink: 0, transition: 'all .2s' }} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function Vehicles() {
  const [typeFilter, setTypeFilter] = useState('');
  const [seatsFilter, setSeatsFilter] = useState('');

  const types = ['All', 'Luxury Traveller', 'Traveller', 'SUV', 'MUV', 'Sedan'];

  const filtered = STATIC_FLEET.filter(v => {
    if (typeFilter && typeFilter !== 'All' && v.type !== typeFilter) return false;
    if (seatsFilter && v.seats < Number(seatsFilter)) return false;
    return true;
  });

  return (
    <div style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', padding: '3.5rem 1.5rem', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link> / Vehicles
          </p>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800 }}>Our Vehicles</h1>
          <p style={{ color: 'rgba(219,234,254,0.85)', marginTop: 6 }}>Choose from our fleet of verified, well-maintained vehicles.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '1.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Filter:</span>
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t === 'All' ? '' : t)}
              style={{
                padding: '7px 16px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                background: (typeFilter === t || (t === 'All' && !typeFilter)) ? '#2563eb' : '#fff',
                color:      (typeFilter === t || (t === 'All' && !typeFilter)) ? '#fff' : '#374151',
                borderColor:(typeFilter === t || (t === 'All' && !typeFilter)) ? '#2563eb' : '#e5e7eb',
              }}>
              {t}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Min Seats:</span>
            <select value={seatsFilter} onChange={e => setSeatsFilter(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: 9, padding: '6px 10px', fontSize: '0.82rem', color: '#111827', background: '#fff' }}>
              <option value="">Any</option>
              {[5, 7, 12, 17].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
        </div>

        {/* Count */}
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{filtered.length} vehicle(s) found</p>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
          {filtered.map(v => <VehicleCard key={v.id} v={v} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚗</div>
            <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>No vehicles match your filter</p>
            <button onClick={() => { setTypeFilter(''); setSeatsFilter(''); }}
              style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              Clear filters
            </button>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: '3rem', background: 'linear-gradient(135deg,#eff6ff,#e0f2fe)', borderRadius: 20, padding: '2rem', textAlign: 'center', border: '1px solid #bfdbfe' }}>
          <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#1e3a8a', marginBottom: 8 }}>Need a Custom Vehicle?</p>
          <p style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: 16 }}>Contact us and we'll arrange the perfect vehicle for your trip.</p>
          <Link to="/contact"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: 12, fontSize: '0.9rem' }}>
            📞 Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
