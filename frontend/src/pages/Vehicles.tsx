import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { vehicleAPI } from '../services/api';
import type { Vehicle } from '../types';

const IMGS: Record<string, string> = {
  Traveller: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=75',
  Bus:       'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=75',
  SUV:       'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=75',
  Sedan:     'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=75',
  Tempo:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75',
};
const getImg = (v: Vehicle) => (v.image_url && !v.image_url.includes('placehold.co')) ? v.image_url : (IMGS[v.vehicle_type] || IMGS.Traveller);

export default function Vehicles() {
  const [sp] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('id-ASC');
  const [filters, setFilters] = useState({ vehicle_type: '', min_seats: sp.get('passengers') || '', max_price: '', ac: '' });

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [s, o] = sort.split('-');
      const params: Record<string, string> = { sort: s, order: o, status: 'AVAILABLE' };
      if (filters.vehicle_type) params.vehicle_type = filters.vehicle_type;
      if (filters.min_seats) params.min_seats = filters.min_seats;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.ac) params.ac = filters.ac;
      const r = await vehicleAPI.getAll(params);
      setVehicles(r.data.data || []);
    } catch { setError('Failed to load vehicles. Please check your connection and try again.'); }
    finally { setLoading(false); }
  }, [filters, sort]);

  useEffect(() => { fetch(); }, [fetch]);

  const clear = () => setFilters({ vehicle_type: '', min_seats: '', max_price: '', ac: '' });

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
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 80 }} className="hidden lg:block">
            <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>Filters</span>
                <button onClick={clear} style={{ fontSize: '0.78rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Vehicle Type</label>
                <select value={filters.vehicle_type} onChange={e => setFilters(p => ({ ...p, vehicle_type: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: '0.875rem', color: '#111827', background: '#fff' }}>
                  <option value="">All Types</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Traveller">Traveller</option>
                  <option value="Bus">Bus</option>
                  <option value="Tempo">Tempo</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Min Seats: <span style={{ color: '#2563eb' }}>{filters.min_seats || 'Any'}</span>
                </label>
                <input type="range" min="1" max="30" value={filters.min_seats || 1}
                  onChange={e => setFilters(p => ({ ...p, min_seats: e.target.value }))}
                  style={{ width: '100%', accentColor: '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9ca3af' }}><span>1</span><span>30</span></div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>AC</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[['', 'Any'], ['true', 'AC'], ['false', 'Non-AC']].map(([v, l]) => (
                    <button key={v} onClick={() => setFilters(p => ({ ...p, ac: v }))}
                      style={{ flex: 1, padding: '6px 0', fontSize: '0.75rem', fontWeight: 600, borderRadius: 8, border: '1px solid', cursor: 'pointer',
                        background: filters.ac === v ? '#2563eb' : '#fff', color: filters.ac === v ? '#fff' : '#374151', borderColor: filters.ac === v ? '#2563eb' : '#e5e7eb' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{loading ? 'Loading...' : `${vehicles.length} vehicle(s) found`}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sort:</span>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '7px 12px', fontSize: '0.875rem', color: '#111827', background: '#fff' }}>
                  <option value="id-ASC">Default</option>
                  <option value="price_per_km-ASC">Price: Low → High</option>
                  <option value="price_per_km-DESC">Price: High → Low</option>
                  <option value="seating_capacity-ASC">Seats: Low → High</option>
                  <option value="seating_capacity-DESC">Seats: High → Low</option>
                </select>
              </div>
            </div>

            {loading ? <Loading message="Loading vehicles..." /> :
             error ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
                <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 16 }}>{error}</p>
                <button onClick={fetch} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
              </div>
            ) : vehicles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚫</div>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>No vehicles found</p>
                <button onClick={clear} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '1.25rem' }}>
                {vehicles.map(v => (
                  <div key={v.id} className="card" style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                      <img src={getImg(v)} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = IMGS.Traveller; }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.4),transparent 55%)' }} />
                      {v.ac && <span style={{ position: 'absolute', top: 10, left: 10, background: '#2563eb', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>❄️ AC</span>}
                      <span style={{ position: 'absolute', top: 10, right: 10, background: '#16a34a', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>✓ Available</span>
                      <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Poppins,sans-serif' }}>{v.name}</p>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>👥 {v.seating_capacity} Seats</p>
                      </div>
                    </div>
                    <div style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                        {v.ac && <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.68rem', fontWeight: 600, padding: '2px 9px', borderRadius: 999 }}>AC</span>}
                        {v.pushback_seats && <span style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '0.68rem', fontWeight: 600, padding: '2px 9px', borderRadius: 999 }}>Pushback</span>}
                        {v.music_system && <span style={{ background: '#fdf4ff', color: '#a21caf', fontSize: '0.68rem', fontWeight: 600, padding: '2px 9px', borderRadius: 999 }}>🎵 Music</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
                        <div>
                          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', fontFamily: 'Poppins,sans-serif' }}>₹{v.price_per_km}</span>
                          <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>/km</span>
                        </div>
                        <div style={{ display: 'flex', gap: 7 }}>
                          <Link to={`/vehicles/${v.id}`} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 11px', borderRadius: 9, background: '#fff' }}>Details</Link>
                          <Link to={`/booking?vehicle=${v.id}`} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: '#f97316', padding: '6px 12px', borderRadius: 9 }}>Book</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
