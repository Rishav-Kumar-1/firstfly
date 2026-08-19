import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchForm from '../components/SearchForm';
import Loading from '../components/Loading';
import { vehicleAPI, packageAPI } from '../services/api';
import type { Vehicle, TourPackage } from '../types';

// Real vehicle photos from Unsplash (free, no key needed)
const VEHICLE_IMGS: Record<string, string> = {
  Traveller: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=75',
  Bus:       'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=75',
  SUV:       'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=75',
  Sedan:     'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=75',
  Tempo:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75',
};

const DEST_IMGS: Record<string, string> = {
  Manali:    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=75',
  Shimla:    'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=500&q=75',
  Rishikesh: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=500&q=75',
  Jaipur:    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=75',
  Agra:      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=75',
  Kashmir:   'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=500&q=75',
  Mussoorie: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=75',
  Varanasi:  'https://images.unsplash.com/photo-1561361058-c24e022a5f6d?w=500&q=75',
};

const PKG_IMGS: Record<string, string> = {
  Manali:    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=75',
  Shimla:    'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=500&q=75',
  Rishikesh: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=500&q=75',
  Jaipur:    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=75',
};

function getVehicleImg(v: Vehicle) {
  if (v.image_url && !v.image_url.includes('placehold.co')) return v.image_url;
  return VEHICLE_IMGS[v.vehicle_type] || VEHICLE_IMGS.Traveller;
}

function getPkgImg(p: TourPackage) {
  if (p.image_url && !p.image_url.includes('placehold.co')) return p.image_url;
  return PKG_IMGS[p.destination_name || ''] || VEHICLE_IMGS.Traveller;
}

// ─── FAQ ───────────────────────────────────────────
const FAQ = [
  { q: 'How do I book a vehicle?', a: 'Use the search form, browse vehicles, click Book Now, fill your details and confirm. Receive a booking reference instantly.' },
  { q: 'Is the driver included?', a: 'Yes. All bookings include an experienced, verified driver. Driver charges are shown transparently in the fare breakdown.' },
  { q: 'Are there any hidden charges?', a: 'No. You see the full breakdown — base fare, driver charge, toll estimate and parking — before confirming.' },
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

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loadingV, setLoadingV] = useState(true);
  const [loadingP, setLoadingP] = useState(true);

  useEffect(() => {
    vehicleAPI.getAll({ status: 'AVAILABLE' })
      .then(r => setVehicles((r.data.data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoadingV(false));
    packageAPI.getAll()
      .then(r => setPackages((r.data.data || []).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingP(false));
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #312e81 100%)',
        position: 'relative', overflow: 'hidden', paddingTop: '5rem', paddingBottom: '4rem'
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=60"
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
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
              Popular Vehicles
            </h2>
            <p style={{ color: '#6b7280', marginTop: 10, fontSize: '1rem', maxWidth: 500, margin: '10px auto 0' }}>
              Well-maintained, air-conditioned vehicles for every group size and budget.
            </p>
          </div>

          {loadingV ? <Loading message="Loading vehicles..." /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
              {vehicles.map(v => (
                <div key={v.id} className="card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img src={getVehicleImg(v)} alt={v.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = VEHICLE_IMGS.Traveller; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
                    {v.ac && <span style={{ position: 'absolute', top: 12, left: 12, background: '#2563eb', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>❄️ AC</span>}
                    <span style={{ position: 'absolute', top: 12, right: 12, background: '#16a34a', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>✓ Available</span>
                    <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Poppins,sans-serif' }}>{v.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem' }}>👥 {v.seating_capacity} Seats</p>
                    </div>
                  </div>
                  <div style={{ padding: '1rem 1.1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {v.ac && <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>AC</span>}
                      {v.pushback_seats && <span style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>Pushback</span>}
                      {v.music_system && <span style={{ background: '#fdf4ff', color: '#a21caf', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>🎵 Music</span>}
                      {v.luggage_capacity && <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>🧳 {v.luggage_capacity}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                      <div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', fontFamily: 'Poppins,sans-serif' }}>₹{v.price_per_km}</span>
                        <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>/km</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/vehicles/${v.id}`}
                          style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: 10, background: '#fff' }}>
                          Details
                        </Link>
                        <Link to={`/booking?vehicle=${v.id}`}
                          style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '6px 14px', borderRadius: 10 }}>
                          Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

          {loadingP ? <Loading message="Loading packages..." /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {packages.map(p => (
                <div key={p.id} className="card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                    <img src={getPkgImg(p)} alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = VEHICLE_IMGS.Traveller; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                      <p style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📍 {p.destination_name}</p>
                      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Poppins,sans-serif', marginTop: 3 }}>{p.name}</h3>
                      <span style={{ display: 'inline-block', marginTop: 5, background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.72rem', padding: '3px 10px', borderRadius: 999 }}>
                        {p.duration_days}D / {p.duration_nights}N
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1rem 1.1rem' }}>
                    <p className="line-clamp-2" style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 10 }}>{p.description}</p>
                    {p.highlights && p.highlights.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                        {p.highlights.slice(0, 3).map(h => (
                          <span key={h} style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>✓ {h}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                      <div>
                        <p style={{ color: '#9ca3af', fontSize: '0.72rem' }}>Starting from</p>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb', fontFamily: 'Poppins,sans-serif' }}>₹{p.starting_price.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/packages/${p.id}`}
                          style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: 10, background: '#fff' }}>View</Link>
                        <Link to={`/booking?package=${p.id}`}
                          style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '6px 14px', borderRadius: 10 }}>Book</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <span className="label">Why TravelGo</span>
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
            {[['🔍','1','Search','Enter trip details'],['🚌','2','Select','Choose vehicle'],['📝','3','Fill Info','Passenger details'],['✅','4','Confirm','Review & pay'],['🎉','5','Enjoy','Sit back & travel']].map(([ic, st, ti, de]) => (
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
            {Object.entries(DEST_IMGS).map(([name, img]) => (
              <Link key={name} to="/destinations" className="card"
                style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', display: 'block', height: 180 }}>
                <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = VEHICLE_IMGS.Traveller; }} />
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
              { name: 'Amit Singh', trip: 'Delhi → Rishikesh', av: 'AS', c: '#7c3aed', rating: 5, review: 'Great experience. Pricing was completely transparent — no hidden charges. Will definitely use TravelGo again for our next group trip.' },
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
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=50"
            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />
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
