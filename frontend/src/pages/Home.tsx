import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchForm from '../components/SearchForm';

const DEST_IMGS_MAP: Record<string, { img: string; id: number }> = {
  Manali:    { img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=75', id: 1 },
  Shimla:    { img: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=500&q=75', id: 2 },
  Rishikesh: { img: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=500&q=75', id: 3 },
  Jaipur:    { img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=75', id: 4 },
  Agra:      { img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=75', id: 5 },
  Kashmir:   { img: 'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=500&q=75', id: 6 },
  Mussoorie: { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=75', id: 7 },
  Varanasi:  { img: 'https://images.unsplash.com/photo-1561361058-c24e022a5f6d?w=500&q=75', id: 9 },
};

// ─── FAQ ───────────────────────────────────────────
const FAQ = [
  { q: 'How do I book a vehicle?', a: 'Use the search form, browse vehicles, click Book Now, fill your details and confirm. Receive a booking reference instantly.' },
  { q: 'Is the driver included?', a: 'Yes. All bookings include an experienced, verified driver. Driver charges are shown transparently in the fare breakdown.' },
  { q: 'Are there any hidden charges?', a: 'No hidden charges. Our team provides a full and transparent quote before you confirm your booking.' },
  { q: 'Can I cancel my booking?', a: 'Yes. Free cancellation up to 24 hours before travel. Cancellations within 24 hours may have a small fee.' },
  { q: 'Can I book for multiple days?', a: 'Yes. Select Round Trip or Multi Day, set your return date, and the fare is calculated automatically.' },
];

function FAQ_Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left', padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', cursor: 'pointer', border: 'none' }}>
        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>{q}</span>
        <span style={{
          width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', color: '#2563eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem',
          flexShrink: 0, transition: 'transform .3s', transform: open ? 'rotate(45deg)' : 'none'
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 1.5rem 1.1rem', color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.7, borderTop: '1px solid #f3f4f6', paddingTop: '1rem', background: '#f9fafb' }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Fleet data & card ───────────────────────────────────────
interface FleetVehicle {
  name: string;
  type: string;
  seats: number;
  images: string[];
  features?: string[];
}

// Images distributed by vehicle type — ONLY same-type images per section
const FLEET: FleetVehicle[] = [
  {
    name: 'Urbania Traveller',
    type: 'Luxury Traveller',
    seats: 17,
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
    features: ['AC', 'Pushback Seats', 'Music System', '17 Seater'],
  },
  {
    name: 'Force Traveller',
    type: 'Traveller',
    seats: 12,
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
    features: ['AC', 'Group Travel', '12 Seater'],
  },
  {
    name: 'Toyota Innova Crysta',
    type: 'SUV',
    seats: 7,
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
    features: ['AC', 'Comfortable', 'Spacious', '7 Seater'],
  },
  {
    name: 'Maruti Suzuki Ertiga',
    type: 'MUV',
    seats: 7,
    images: [
      '/vehicles/ertiga-0.jpeg',
      '/vehicles/ertiga-new-1.jpeg',
      '/vehicles/ertiga-new-2.jpeg',
      '/vehicles/ertiga-new-3.jpeg',
      '/vehicles/ertiga-new-4.jpeg',
    ],
    features: ['AC', 'Family Friendly', '7 Seater'],
  },
  {
    name: 'Toyota Etios Sedan',
    type: 'Sedan',
    seats: 5,
    images: [
      '/vehicles/etios-0.jpeg',
      '/vehicles/etios-new-1.jpeg',
      '/vehicles/etios-new-2.jpeg',
      '/vehicles/etios-new-3.jpeg',
      '/vehicles/etios-new-4.jpeg',
    ],
    features: ['AC', 'Fuel Efficient', '5 Seater'],
  },
  {
    name: 'Maruti Suzuki Dzire',
    type: 'Sedan',
    seats: 5,
    images: [
      '/vehicles/dzire-0.jpeg',
      '/vehicles/dzire-new-1.jpeg',
      '/vehicles/dzire-new-2.jpeg',
      '/vehicles/dzire-new-3.jpeg',
    ],
    features: ['AC', 'Economical', '5 Seater'],
  },
];

// ─── Static popular packages (no prices) ───────────────────
const STATIC_PACKAGES = [
  {
    id: 1,
    name: 'Manali Winter Escape',
    destination: 'Manali, Himachal Pradesh',
    duration: '5D / 4N',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=75',
    highlights: ['Solang Valley', 'Rohtang Pass', 'Old Manali'],
    description: 'Experience the snow-capped peaks and adventurous trails of Manali with comfortable vehicle travel.',
  },
  {
    id: 2,
    name: 'Shimla Heritage Tour',
    destination: 'Shimla, Himachal Pradesh',
    duration: '4D / 3N',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=75',
    highlights: ['Mall Road', 'Jakhu Temple', 'Kufri'],
    description: 'Explore the Queen of Hills with its colonial charm, toy train views and scenic mountain roads.',
  },
  {
    id: 3,
    name: 'Rishikesh Spiritual Retreat',
    destination: 'Rishikesh, Uttarakhand',
    duration: '3D / 2N',
    image: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=600&q=75',
    highlights: ['Ganga Aarti', 'Laxman Jhula', 'Rafting'],
    description: 'A divine journey to the yoga capital of the world — with river views, temples and adventure.',
  },
  {
    id: 4,
    name: 'Golden Triangle Tour',
    destination: 'Delhi • Agra • Jaipur',
    duration: '6D / 5N',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=75',
    highlights: ['Taj Mahal', 'Amber Fort', 'Qutub Minar'],
    description: 'India\'s most iconic circuit covering three historic cities with a dedicated vehicle and driver.',
  },
  {
    id: 5,
    name: 'Kashmir Valley Tour',
    destination: 'Kashmir, J&K',
    duration: '7D / 6N',
    image: 'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=600&q=75',
    highlights: ['Dal Lake', 'Gulmarg', 'Pahalgam'],
    description: 'Discover the paradise on earth — shikara rides, meadows and snow-covered mountain passes.',
  },
  {
    id: 6,
    name: 'Mussoorie Weekend Getaway',
    destination: 'Mussoorie, Uttarakhand',
    duration: '2D / 1N',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',
    highlights: ['Kempty Falls', 'Gun Hill', 'Mall Road'],
    description: 'A quick escape to the Queen of Hills — perfect for families and weekend travellers.',
  },
];

function FleetCard({ vehicle }: { vehicle: FleetVehicle }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const nextImg = () => setImgIdx(i => (i + 1) % vehicle.images.length);
  const prevImg = () => setImgIdx(i => (i - 1 + vehicle.images.length) % vehicle.images.length);

  return (
    <>
      <div className="card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img
            src={vehicle.images[imgIdx]}
            alt={vehicle.name}
            onClick={() => setLightbox(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s', cursor: 'zoom-in' }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              const next = imgIdx + 1;
              if (next < vehicle.images.length) setImgIdx(next);
              else el.src = '/vehicles/force-traveller-1.jpeg';
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#2563eb', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>❄️ AC</span>
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#16a34a', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>✓ Available</span>

          {/* Click hint */}
          <div style={{ position: 'absolute', top: 38, left: 12, background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.62rem', padding: '2px 8px', borderRadius: 999, pointerEvents: 'none' }}>🔍 Click to expand</div>

          {vehicle.images.length > 1 && (
            <>
              <button onClick={prevImg} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>‹</button>
              <button onClick={nextImg} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>›</button>
            </>
          )}

          <div style={{ position: 'absolute', bottom: 12, left: 14, right: 60, pointerEvents: 'none' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Poppins,sans-serif' }}>{vehicle.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginTop: 2 }}>👥 {vehicle.seats} Seats • {vehicle.type}</p>
          </div>
          <div style={{ position: 'absolute', bottom: 14, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>
            {imgIdx + 1}/{vehicle.images.length}
          </div>
        </div>

        <div style={{ padding: '1rem 1.1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {(vehicle.features || []).map(f => (
              <span key={f} style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.68rem', fontWeight: 600, padding: '3px 9px', borderRadius: 999 }}>{f}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{vehicle.seats} Seats • {vehicle.type}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/vehicles" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: 10, background: '#fff' }}>Details</Link>
              <Link to="/booking" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '6px 12px', borderRadius: 10 }}>Book</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setLightbox(false)}
            style={{ position: 'absolute', top: 18, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 42, height: 42, borderRadius: '50%', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {vehicle.name} — {imgIdx + 1} / {vehicle.images.length}
          </div>
          <button onClick={e => { e.stopPropagation(); prevImg(); }}
            style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <img src={vehicle.images[imgIdx]} alt={vehicle.name}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '88vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
          <button onClick={e => { e.stopPropagation(); nextImg(); }}
            style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, maxWidth: '90vw', overflowX: 'auto', padding: '4px 8px' }}>
            {vehicle.images.map((src, i) => (
              <img key={i} src={src} alt="" onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                style={{ width: 54, height: 38, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: i === imgIdx ? '2.5px solid #f97316' : '2.5px solid transparent', opacity: i === imgIdx ? 1 : 0.55, flexShrink: 0, transition: 'all .2s' }} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #312e81 100%)',
        position: 'relative', overflow: 'hidden', paddingTop: '5rem', paddingBottom: '4rem'
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/hero/hero-bg.jpeg"
            alt="Travel background"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=60';
            }}
          />
        </div>
        {/* soft glow circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          {/* badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '6px 18px', marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 600 }}>India's Trusted Travel Vehicle Platform</span>
          </div>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Travel Together.{' '}
            <span style={{ background: 'linear-gradient(90deg,#fbbf24,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Travel Better.
            </span>
          </h1>

          <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Book verified vehicles for family trips, corporate travel, weddings and group tours.
            Transparent pricing. Experienced drivers. 24/7 support.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem', marginBottom: '3rem' }}>
            {[['5,000+','Happy Customers'],['150+','Verified Vehicles'],['50+','Destinations'],['4.8★','Avg Rating']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'Poppins,sans-serif' }}>{v}</p>
                <p style={{ color: 'rgba(191,219,254,0.8)', fontSize: '0.78rem', fontWeight: 500, marginTop: 2 }}>{l}</p>
              </div>
            ))}
          </div>

          {/* Search box */}
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <SearchForm />
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '1rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem 3rem' }}>
          {[['🛡️','Verified & Insured'],['👨‍✈️','Background-Checked Drivers'],['💰','Zero Hidden Charges'],['🕐','24/7 Support'],['✅','Free Cancellation']].map(([ic, tx]) => (
            <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#374151', fontSize: '0.875rem', fontWeight: 500 }}>
              <span style={{ fontSize: '1.1rem' }}>{ic}</span> {tx}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ VEHICLES ═══ */}
      <section style={{ background: '#f8fafc', padding: '5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="label">Our Fleet</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827' }}>
              Our Vehicles
            </h2>
            <p style={{ color: '#6b7280', marginTop: 10, fontSize: '1rem', maxWidth: 500, margin: '10px auto 0' }}>
              Well-maintained, air-conditioned vehicles for every group size and travel need.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {FLEET.map((v) => (
              <FleetCard key={v.name} vehicle={v} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/vehicles"
              style={{ display: 'inline-block', background: '#2563eb', color: '#fff', fontWeight: 700, padding: '0.9rem 2.5rem', borderRadius: 14, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
              View All Vehicles →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TOUR PACKAGES ═══ */}
      <section style={{ background: '#fff', padding: '5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="label">Curated Trips</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827' }}>
              Popular Tour Packages
            </h2>
            <p style={{ color: '#6b7280', marginTop: 10, maxWidth: 500, margin: '10px auto 0' }}>
              Handpicked itineraries for India's most loved destinations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {STATIC_PACKAGES.map(p => (
              <div key={p.id} className="card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/vehicles/innova-1.jpeg'; }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                    <p style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📍 {p.destination}</p>
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
                      style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '6px 14px', borderRadius: 10 }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/packages"
              style={{ display: 'inline-block', background: '#2563eb', color: '#fff', fontWeight: 700, padding: '0.9rem 2.5rem', borderRadius: 14, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
              View All Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section style={{ background: '#eff6ff', padding: '5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="label">Why FIRSTFLY</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827' }}>
              The Smarter Way to Travel
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🚌', title: 'Verified Vehicles', desc: 'Every vehicle is inspected, insured and maintained before every trip.' },
              { icon: '👨‍✈️', title: 'Expert Drivers', desc: 'Background-verified drivers with years of intercity and mountain route experience.' },
              { icon: '💰', title: 'Zero Hidden Costs', desc: 'Complete fare breakdown — base, driver, tolls — before you confirm.' },
              { icon: '🕐', title: '24/7 Support', desc: 'Round-the-clock support via phone and WhatsApp for every journey.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', border: '1px solid #dbeafe' }}>
                <div style={{ width: 52, height: 52, background: '#eff6ff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: 16 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#111827', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ background: '#fff', padding: '5rem 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <span className="label">Simple & Fast</span>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827', marginBottom: '3rem' }}>Book in 5 Easy Steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {[['🔍','1','Search','Enter trip details'],['🚌','2','Select','Choose vehicle'],['📝','3','Fill Info','Passenger details'],['✅','4','Confirm','Review & confirm'],['🎉','5','Enjoy','Sit back & travel']].map(([ic, st, ti, de]) => (
              <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 60, height: 60, background: '#eff6ff', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', border: '2px solid #dbeafe' }}>{ic}</div>
                <div style={{ width: 28, height: 28, background: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{st}</div>
                <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{ti}</p>
                <p style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{de}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DESTINATIONS ═══ */}
      <section style={{ background: '#f8fafc', padding: '5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="label">Top Picks</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827' }}>Popular Destinations</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(DEST_IMGS_MAP).map(([name, { img, id }]) => (
              <Link key={name} to={`/destinations/${id}`} className="card"
                style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', display: 'block', height: 180 }}>
                <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/vehicles/force-traveller-1.jpeg'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.55),rgba(0,0,0,0.05))' }} />
                <div style={{ position: 'absolute', bottom: 14, left: 14, color: '#fff' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Poppins,sans-serif' }}>{name}</p>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/destinations"
              style={{ display: 'inline-block', background: '#2563eb', color: '#fff', fontWeight: 700, padding: '0.85rem 2.2rem', borderRadius: 14, fontSize: '0.95rem' }}>
              Explore All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ VIDEO SECTION ═══ */}
      <section style={{ background: '#0f172a', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background subtle pattern */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #1e3a8a22 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: 8 }}>See Us In Action</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#fff' }}>
              Experience the FIRSTFLY Journey
            </h2>
            <p style={{ color: '#94a3b8', marginTop: 10, maxWidth: 500, margin: '10px auto 0' }}>
              Watch how we make every trip comfortable, safe and memorable.
            </p>
          </div>

          {/* Video player — contained, never full-screen background */}
          <div style={{
            maxWidth: 860, margin: '0 auto',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            background: '#000',
            position: 'relative',   /* keeps video inside this box */
            zIndex: 1,
          }}>
            <video
              controls
              preload="none"
              poster="/hero/hero-bg.jpeg"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '500px',
                objectFit: 'contain',
                background: '#000',
              }}
            >
              <source src="/promo.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>

          {/* Features strip below video */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🚌', text: 'Luxury Interiors' },
              { icon: '👨‍✈️', text: 'Professional Drivers' },
              { icon: '❄️', text: 'Full AC Comfort' },
              { icon: '🎵', text: 'Entertainment System' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHOTO GALLERY ═══ */}
      <section style={{ background: '#f8fafc', padding: '5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 8 }}>Our Fleet Gallery</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827' }}>
              Real Vehicles. Real Comfort.
            </h2>
            <p style={{ color: '#6b7280', marginTop: 10, maxWidth: 500, margin: '10px auto 0' }}>
              Every vehicle in our fleet is well-maintained, verified and ready for your journey.
            </p>
          </div>

          {/* Gallery Grid — your actual photos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {[
              '/vehicles/force-traveller-1.jpeg',
              '/vehicles/urbania-1.jpeg',
              '/vehicles/innova-1.jpeg',
              '/vehicles/etios-1.jpeg',
              '/vehicles/ertiga-1.jpeg',
              '/vehicles/dzire-1.jpeg',
              '/vehicles/force-traveller-2.jpeg',
              '/vehicles/urbania-2.jpeg',
              '/vehicles/innova-2.jpeg',
              '/vehicles/force-traveller-3.jpeg',
              '/vehicles/img-40.jpeg',
              '/vehicles/img-41.jpeg',
            ].map((src, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}
                className="card">
                <img
                  src={src}
                  alt={`TravelGo Vehicle ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.src = `https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=60`;
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/vehicles"
              style={{ display: 'inline-block', background: '#2563eb', color: '#fff', fontWeight: 700, padding: '0.875rem 2.5rem', borderRadius: 14, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
              View All Vehicles →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ background: '#fff', padding: '5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="label">Customer Stories</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827' }}>What Our Customers Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Rahul Sharma', trip: 'Delhi → Manali', av: 'RS', c: '#2563eb', rating: 5, review: 'Excellent service! The 12 seater traveller was spotless and the driver was very professional. Our Manali trip was absolutely amazing!' },
              { name: 'Priya Patel', trip: 'Jaipur → Agra', av: 'PP', c: '#db2777', rating: 5, review: 'Booked an Innova Crysta for a family trip. Very smooth booking process. Vehicle was well-maintained and driver knew all the routes perfectly.' },
              { name: 'Amit Singh', trip: 'Delhi → Rishikesh', av: 'AS', c: '#7c3aed', rating: 5, review: 'Great experience. Pricing was completely transparent — no hidden charges. Will definitely use FIRSTFLY again for our next group trip.' },
            ].map(t => (
              <div key={t.name} style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: 14 }}>{'★'.repeat(t.rating)}</div>
                <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.25rem', fontStyle: 'italic' }}>"{t.review}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: t.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>{t.av}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{t.name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.78rem' }}>📍 {t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ background: '#f8fafc', padding: '5rem 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="label">Got Questions?</span>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: '#111827' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map(f => <FAQ_Item key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', padding: '5rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/hero/hero-bg2.jpeg"
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1 }}
            onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div style={{ position: 'relative', maxWidth: 650, margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.75rem)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
            Ready to Plan Your Trip?
          </h2>
          <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Join thousands of happy travellers. Book your vehicle in minutes — no paperwork, no hassle.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/vehicles"
              style={{ background: '#f97316', color: '#fff', fontWeight: 700, padding: '0.9rem 2.5rem', borderRadius: 14, fontSize: '1rem', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
              Browse Vehicles
            </Link>
            <Link to="/contact"
              style={{ background: 'transparent', color: '#fff', fontWeight: 700, padding: '0.9rem 2.5rem', borderRadius: 14, fontSize: '1rem', border: '2px solid rgba(255,255,255,0.4)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
