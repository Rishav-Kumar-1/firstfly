// Booking.tsx — 3-step booking flow that saves to database
// Step 1: Trip Details → Step 2: Review → Step 3: Confirmed

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Step Indicator ──────────────────────────────────────────
function Steps({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Trip Details', icon: '📝' },
    { n: 2, label: 'Review',       icon: '📋' },
    { n: 3, label: 'Confirmed',    icon: '🎉' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', gap: 0 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.9rem', transition: 'all .3s',
              background: s.n < current ? '#16a34a' : s.n === current ? '#2563eb' : '#f3f4f6',
              color: s.n <= current ? '#fff' : '#9ca3af',
              boxShadow: s.n === current ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
            }}>
              {s.n < current ? '✓' : s.icon}
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: s.n === current ? '#2563eb' : s.n < current ? '#16a34a' : '#9ca3af' }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 60, height: 2, marginBottom: 20, marginLeft: 4, marginRight: 4, background: s.n < current ? '#16a34a' : '#e5e7eb', transition: 'background .3s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    {children}
  </div>
);

const LBL: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600,
  color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
};
const INPUT = (err?: string): React.CSSProperties => ({
  width: '100%', border: `1.5px solid ${err ? '#fca5a5' : '#e5e7eb'}`,
  borderRadius: 10, padding: '10px 14px', fontSize: '0.9rem',
  color: '#111827', background: err ? '#fef2f2' : '#fff', outline: 'none',
  fontFamily: 'Inter,system-ui,sans-serif',
});
const ERR: React.CSSProperties = { color: '#dc2626', fontSize: '0.72rem', marginTop: 4 };

// Fallback vehicles if API is offline
const FALLBACK_VEHICLES = [
  { id: 1,  name: 'Urbania Traveller',    seating_capacity: 17 },
  { id: 2,  name: 'Force Traveller',      seating_capacity: 12 },
  { id: 6,  name: 'Toyota Innova Crysta', seating_capacity: 7  },
  { id: 7,  name: 'Maruti Suzuki Ertiga', seating_capacity: 7  },
  { id: 8,  name: 'Toyota Etios Sedan',   seating_capacity: 5  },
  { id: 9,  name: 'Maruti Suzuki Dzire',  seating_capacity: 5  },
];

export default function Booking() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const [step, setStep]       = useState(1);
  const [vehicles, setVehicles] = useState(FALLBACK_VEHICLES);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking] = useState<any>(null);

  const [form, setForm] = useState({
    vehicle_id:    '',
    from_location: '',
    to_location:   '',
    travel_date:   '',
    return_date:   '',
    passengers:    '1',
    trip_type:     'ONE_WAY',
    distance_km:   '100',  // default estimate
    notes:         '',
  });
  const [ferr, setFerr] = useState<Record<string, string>>({});

  // Load vehicles from API (with fallback)
  useEffect(() => {
    vehicleAPI.getAll({ status: 'AVAILABLE' })
      .then(r => {
        const data = r.data.data || [];
        if (data.length > 0) setVehicles(data);
      })
      .catch(() => {}); // keep fallback
  }, []);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (ferr[e.target.name]) setFerr(p => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.vehicle_id)            e.vehicle_id    = 'Please select a vehicle';
    if (!form.from_location.trim())  e.from_location = 'Pickup location required';
    if (!form.to_location.trim())    e.to_location   = 'Destination required';
    if (!form.travel_date)           e.travel_date   = 'Travel date required';
    if (Number(form.passengers) < 1) e.passengers    = 'At least 1 passenger';
    if (form.trip_type === 'ROUND_TRIP' && !form.return_date) e.return_date = 'Return date required for round trip';
    if (form.return_date && form.return_date < form.travel_date) e.return_date = 'Return date must be after travel date';
    setFerr(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep(2);
  };

  // ── Submit booking to backend ────────────────────────────
  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const r = await bookingAPI.create({
        vehicle_id:    Number(form.vehicle_id),
        from_location: form.from_location,
        to_location:   form.to_location,
        travel_date:   form.travel_date,
        return_date:   form.return_date || undefined,
        passengers:    Number(form.passengers),
        trip_type:     form.trip_type,
        distance_km:   Number(form.distance_km) || 100,
        notes:         form.notes,
      });
      setBooking(r.data.data);
      setStep(3);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setSubmitError(e.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicle = vehicles.find(v => String(v.id) === form.vehicle_id);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter,system-ui,sans-serif', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>Book Your Vehicle</h1>
          <p style={{ color: '#6b7280', marginTop: 6, fontSize: '0.9rem' }}>Fill in your trip details and confirm</p>
        </div>

        <Steps current={step} />

        {/* ══ STEP 1: Trip Details ══ */}
        {step === 1 && (
          <Card>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 20 }}>Enter Trip Details</h2>

            {/* Vehicle Select */}
            <div style={{ marginBottom: 18 }}>
              <label style={LBL}>Select Vehicle</label>
              <select name="vehicle_id" value={form.vehicle_id} onChange={ch} style={INPUT(ferr.vehicle_id)}>
                <option value="">— Choose a vehicle —</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.seating_capacity} Seats
                  </option>
                ))}
              </select>
              {ferr.vehicle_id && <p style={ERR}>{ferr.vehicle_id}</p>}
            </div>

            {/* Trip Type */}
            <div style={{ marginBottom: 18 }}>
              <label style={LBL}>Trip Type</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['ONE_WAY','→ One Way'],['ROUND_TRIP','⇄ Round Trip'],['LOCAL','🏙 Local'],['MULTI_DAY','📅 Multi Day']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setForm(p => ({ ...p, trip_type: v }))}
                    style={{ padding: '8px 14px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid', transition: 'all .2s',
                      background: form.trip_type === v ? '#2563eb' : '#fff',
                      color:      form.trip_type === v ? '#fff' : '#374151',
                      borderColor: form.trip_type === v ? '#2563eb' : '#e5e7eb' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* From / To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={LBL}>From (Pickup)</label>
                <input name="from_location" value={form.from_location} onChange={ch} placeholder="e.g. New Delhi" style={INPUT(ferr.from_location)} />
                {ferr.from_location && <p style={ERR}>{ferr.from_location}</p>}
              </div>
              <div>
                <label style={LBL}>To (Destination)</label>
                <input name="to_location" value={form.to_location} onChange={ch} placeholder="e.g. Manali" style={INPUT(ferr.to_location)} />
                {ferr.to_location && <p style={ERR}>{ferr.to_location}</p>}
              </div>
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={LBL}>Travel Date</label>
                <input type="date" name="travel_date" value={form.travel_date} min={today} onChange={ch} style={INPUT(ferr.travel_date)} />
                {ferr.travel_date && <p style={ERR}>{ferr.travel_date}</p>}
              </div>
              {(form.trip_type === 'ROUND_TRIP' || form.trip_type === 'MULTI_DAY') && (
                <div>
                  <label style={LBL}>Return Date</label>
                  <input type="date" name="return_date" value={form.return_date} min={form.travel_date || today} onChange={ch} style={INPUT(ferr.return_date)} />
                  {ferr.return_date && <p style={ERR}>{ferr.return_date}</p>}
                </div>
              )}
            </div>

            {/* Passengers + Distance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={LBL}>Passengers</label>
                <select name="passengers" value={form.passengers} onChange={ch} style={INPUT()}>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LBL}>Est. Distance (km)</label>
                <input type="number" name="distance_km" value={form.distance_km} onChange={ch}
                  placeholder="e.g. 300" min="1" style={INPUT(ferr.distance_km)} />
                {ferr.distance_km && <p style={ERR}>{ferr.distance_km}</p>}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 22 }}>
              <label style={LBL}>Special Requests (optional)</label>
              <textarea name="notes" value={form.notes} onChange={ch} rows={2}
                placeholder="Any special requirements..."
                style={{ ...INPUT(), resize: 'none', fontFamily: 'inherit' } as React.CSSProperties} />
            </div>

            <button onClick={handleNext}
              style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', fontFamily: 'inherit' }}>
              Review Trip Details →
            </button>
          </Card>
        )}

        {/* ══ STEP 2: Review & Submit ══ */}
        {step === 2 && (
          <Card>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 20 }}>Review Your Trip</h2>

            <div style={{ background: '#f9fafb', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
              {[
                ['Vehicle',       selectedVehicle?.name || form.vehicle_id],
                ['From',          form.from_location],
                ['To',            form.to_location],
                ['Travel Date',   new Date(form.travel_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })],
                ...(form.return_date ? [['Return Date', new Date(form.return_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })]] : []),
                ['Trip Type',     form.trip_type.replace('_', ' ')],
                ['Passengers',    form.passengers],
                ['Est. Distance', `${form.distance_km} km`],
                ...(form.notes ? [['Notes', form.notes]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280', flexShrink: 0, marginRight: 12 }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#111827', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', marginBottom: 4 }}>📋 What happens next?</p>
              <p style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.6 }}>
                Your booking will be saved and our admin team will review it. We'll call you at <strong>+91 98771 24650</strong> within 2 hours to confirm.
              </p>
            </div>

            {submitError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.875rem' }}>
                ⚠️ {submitError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} disabled={submitting}
                style={{ flex: 1, background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 14, padding: '12px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Edit
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                style={{ flex: 2, background: submitting ? '#9ca3af' : '#16a34a', color: '#fff', border: 'none', borderRadius: 14, padding: '12px', fontSize: '0.95rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(22,163,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {submitting ? (
                  <><span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style> Submitting...</>
                ) : '✅ Confirm Booking'}
              </button>
            </div>
          </Card>
        )}

        {/* ══ STEP 3: Confirmed ══ */}
        {step === 3 && booking && (
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.25rem' }}>🎉</div>
              <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Booking Confirmed!</h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: '0.9rem' }}>Your booking has been saved. Our team will contact you soon.</p>

              {/* Booking reference */}
              <div style={{ background: '#eff6ff', borderRadius: 16, padding: '18px', marginBottom: 24 }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>Booking Reference</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563eb', letterSpacing: '0.08em', fontFamily: 'Poppins,sans-serif' }}>
                  {booking.booking_reference}
                </p>
              </div>

              {/* Details */}
              <div style={{ background: '#f8fafc', borderRadius: 16, padding: '18px', marginBottom: 24, textAlign: 'left' }}>
                {[
                  ['Vehicle',    booking.vehicle_name || selectedVehicle?.name],
                  ['Route',      `${booking.from_location} → ${booking.to_location}`],
                  ['Date',       new Date(booking.travel_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })],
                  ['Passengers', booking.passengers],
                  ['Status',     '⏳ Pending Confirmation'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6b7280' }}>{k}</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
                <a href="tel:+919877124650"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', padding: '11px 22px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                  📞 Call Us
                </a>
                <Link to="/dashboard"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f97316', color: '#fff', padding: '11px 22px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem' }}>
                  📋 My Bookings
                </Link>
              </div>

              <Link to="/" style={{ color: '#6b7280', fontSize: '0.875rem', display: 'block' }}>← Back to Home</Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
