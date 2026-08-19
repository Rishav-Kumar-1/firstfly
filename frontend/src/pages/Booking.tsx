// Booking.tsx — 4-step booking flow with Razorpay payment
// Step 1: Trip Details → Step 2: Price Summary → Step 3: Payment → Step 4: Confirmed

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { vehicleAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useRazorpay } from '../hooks/useRazorpay';
import Loading from '../components/Loading';
import type { Vehicle } from '../types';

// ─── Step Indicator ─────────────────────────────────────────
function Steps({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Trip Details',   icon: '📝' },
    { n: 2, label: 'Price Summary',  icon: '💰' },
    { n: 3, label: 'Payment',        icon: '💳' },
    { n: 4, label: 'Confirmed',      icon: '✅' },
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
              boxShadow: s.n === current ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none'
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

// ─── Fare Row ────────────────────────────────────────────────
function FareRow({ label, value, detail, highlight }: { label: string; value: number; detail?: string; highlight?: boolean }) {
  const isDiscount = value < 0;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div>
        <span style={{ fontSize: '0.875rem', fontWeight: highlight ? 700 : 500, color: '#374151' }}>{label}</span>
        {detail && <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>{detail}</p>}
      </div>
      <span style={{ fontSize: highlight ? '1.1rem' : '0.9rem', fontWeight: highlight ? 800 : 600, color: isDiscount ? '#16a34a' : highlight ? '#2563eb' : '#111827', fontFamily: 'Poppins,sans-serif' }}>
        {isDiscount ? `-₹${Math.abs(value).toLocaleString('en-IN')}` : `₹${value.toLocaleString('en-IN')}`}
      </span>
    </div>
  );
}

// ─── Card wrapper ────────────────────────────────────────────
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
    {children}
  </div>
);

// ─── Main Component ──────────────────────────────────────────
export default function Booking() {
  const [sp] = useSearchParams();
  const { user } = useAuth();
  const { openPayment, processing: payProcessing } = useRazorpay();

  const today = new Date().toISOString().split('T')[0];
  const vehicleIdParam = sp.get('vehicle');

  const [step, setStep]           = useState(1);
  const [vehicle, setVehicle]     = useState<Vehicle | null>(null);
  const [loadingV, setLoadingV]   = useState(true);
  const [loadingP, setLoadingP]   = useState(false);
  const [loadingB, setLoadingB]   = useState(false);
  const [error, setError]         = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fareData, setFareData]   = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking]     = useState<any>(null);
  const [payError, setPayError]   = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const [form, setForm] = useState({
    vehicle_id:    vehicleIdParam || '',
    from_location: sp.get('from') || '',
    to_location:   sp.get('to')   || '',
    travel_date:   sp.get('date') || '',
    return_date:   '',
    passengers:    Number(sp.get('passengers')) || 1,
    trip_type:     sp.get('trip_type') || 'ONE_WAY',
    distance_km:   '',
    notes:         '',
  });
  const [ferr, setFerr] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!vehicleIdParam) { setLoadingV(false); return; }
    vehicleAPI.getById(Number(vehicleIdParam))
      .then(r => setVehicle(r.data.data))
      .catch(() => setError('Vehicle not found.'))
      .finally(() => setLoadingV(false));
  }, [vehicleIdParam]);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (ferr[e.target.name]) setFerr(p => ({ ...p, [e.target.name]: '' }));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.from_location.trim()) e.from_location = 'Pickup location required';
    if (!form.to_location.trim())   e.to_location   = 'Destination required';
    if (!form.travel_date)          e.travel_date   = 'Travel date required';
    if (!form.distance_km || Number(form.distance_km) <= 0) e.distance_km = 'Enter estimated distance (km)';
    if (form.passengers < 1)        e.passengers    = 'At least 1 passenger';
    if (vehicle && form.passengers > vehicle.seating_capacity)
      e.passengers = `Max ${vehicle.seating_capacity} passengers`;
    if (form.trip_type === 'ROUND_TRIP' && !form.return_date) e.return_date = 'Return date required';
    if (form.return_date && form.return_date < form.travel_date) e.return_date = 'Return date must be after travel date';
    setFerr(e);
    return Object.keys(e).length === 0;
  };

  // Step 1 → Step 2: get price
  const handleGetPrice = async () => {
    if (!validateStep1()) return;
    setLoadingP(true); setError('');
    try {
      const r = await bookingAPI.calculatePrice({
        vehicle_id:  form.vehicle_id,
        distance_km: form.distance_km,
        trip_type:   form.trip_type,
        travel_date: form.travel_date,
        return_date: form.return_date || undefined,
      });
      setFareData(r.data.data);
      setStep(2);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to calculate price.');
    } finally { setLoadingP(false); }
  };

  // Step 2 → Step 3: create booking (status=PENDING, payment=PENDING)
  const handleCreateBooking = async () => {
    setLoadingB(true); setError('');
    try {
      const r = await bookingAPI.create({
        vehicle_id:    Number(form.vehicle_id),
        from_location: form.from_location,
        to_location:   form.to_location,
        travel_date:   form.travel_date,
        return_date:   form.return_date || undefined,
        passengers:    Number(form.passengers),
        trip_type:     form.trip_type,
        distance_km:   Number(form.distance_km),
        notes:         form.notes,
      });
      setBooking(r.data.data);
      setStep(3);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to create booking.');
    } finally { setLoadingB(false); }
  };

  // Step 3: open Razorpay payment popup
  const handlePay = () => {
    if (!booking || !user) return;
    setPayError('');
    openPayment({
      bookingId: booking.id,
      userName:  user.name,
      userEmail: user.email,
      onSuccess: (result) => {
        setBooking((prev: object) => ({ ...prev, ...result.booking }));
        setPaySuccess(true);
        setStep(4);
      },
      onFailure: (msg) => {
        // "Payment cancelled by user" is not really an error — just ignore
        if (msg.includes('cancelled')) { setPayError(''); return; }
        setPayError(msg);
      },
    });
  };

  if (loadingV) return <Loading fullScreen message="Loading vehicle..." />;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter,system-ui,sans-serif', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>
            Book Your Vehicle
          </h1>
          <p style={{ color: '#6b7280', marginTop: 6, fontSize: '0.9rem' }}>Complete in 4 simple steps</p>
        </div>

        <Steps current={step} />

        {/* Error banner */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem', display: 'flex', gap: 8 }}>
            <span>⚠️</span> {error}
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 700 }}>✕</button>
          </div>
        )}

        {/* ═══ STEP 1: Trip Details ═══ */}
        {step === 1 && (
          <Card>
            {vehicle && (
              <div style={{ background: '#eff6ff', borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24 }}>
                <img src={vehicle.image_url} alt={vehicle.name}
                  style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&q=60'; }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{vehicle.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: 2 }}>
                    {vehicle.seating_capacity} Seats • {vehicle.ac ? 'AC' : 'Non-AC'} • ₹{vehicle.price_per_km}/km
                  </p>
                </div>
              </div>
            )}

            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 20 }}>Enter Trip Details</h2>

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

            {/* Passengers & Distance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={LBL}>Passengers</label>
                <select name="passengers" value={form.passengers} onChange={ch} style={INPUT()}>
                  {Array.from({ length: vehicle?.seating_capacity || 50 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LBL}>Distance (km, one way)</label>
                <input type="number" name="distance_km" value={form.distance_km} onChange={ch} placeholder="e.g. 540" min="1" style={INPUT(ferr.distance_km)} />
                {ferr.distance_km && <p style={ERR}>{ferr.distance_km}</p>}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 22 }}>
              <label style={LBL}>Special Requests (optional)</label>
              <textarea name="notes" value={form.notes} onChange={ch} rows={2} placeholder="Any special requirements..."
                style={{ ...INPUT(), resize: 'none', fontFamily: 'inherit' } as React.CSSProperties} />
            </div>

            <button onClick={handleGetPrice} disabled={loadingP}
              style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: loadingP ? 'not-allowed' : 'pointer', opacity: loadingP ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(37,99,235,0.3)', fontFamily: 'inherit' }}>
              {loadingP ? <><Spinner /> Calculating price...</> : 'Calculate Price & Continue →'}
            </button>
          </Card>
        )}

        {/* ═══ STEP 2: Price Summary ═══ */}
        {step === 2 && fareData && (
          <Card>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 20 }}>Price Summary</h2>

            {/* Trip Summary */}
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: '0.875rem' }}>
              {[
                ['Route',       `${form.from_location} → ${form.to_location}`],
                ['Travel Date', new Date(form.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                ...(form.return_date ? [['Return Date', new Date(form.return_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })]] : []),
                ['Trip Type',   form.trip_type.replace('_', ' ')],
                ['Passengers',  `${form.passengers}`],
                ...(vehicle ? [['Vehicle', vehicle.name]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Fare Breakdown */}
            <div style={{ background: '#eff6ff', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
              <p style={{ fontWeight: 700, color: '#111827', marginBottom: 12, fontSize: '0.9rem' }}>Fare Breakdown</p>
              {fareData.breakdown?.map((row: { label: string; value: number; detail: string }) => (
                <FareRow key={row.label} label={row.label} value={row.value} detail={row.detail} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '2px solid #bfdbfe' }}>
                <span style={{ fontWeight: 800, color: '#111827', fontSize: '1rem' }}>Total Amount</span>
                <span style={{ fontWeight: 900, color: '#2563eb', fontSize: '1.5rem', fontFamily: 'Poppins,sans-serif' }}>
                  ₹{fareData.total_amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: 20, lineHeight: 1.6 }}>
              * Toll and parking are estimates. Actual amounts may vary slightly and will be settled with the driver.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 14, padding: '12px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
              <button onClick={handleCreateBooking} disabled={loadingB}
                style={{ flex: 2, background: '#f97316', color: '#fff', border: 'none', borderRadius: 14, padding: '12px', fontSize: '0.95rem', fontWeight: 700, cursor: loadingB ? 'not-allowed' : 'pointer', opacity: loadingB ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                {loadingB ? <><Spinner /> Creating booking...</> : 'Proceed to Payment →'}
              </button>
            </div>
          </Card>
        )}

        {/* ═══ STEP 3: Payment ═══ */}
        {step === 3 && booking && (
          <Card>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 20 }}>Complete Payment</h2>

            {/* Booking reference */}
            <div style={{ background: '#eff6ff', borderRadius: 14, padding: '16px 18px', marginBottom: 20, textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4 }}>Booking Reference</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb', letterSpacing: '0.06em', fontFamily: 'Poppins,sans-serif' }}>
                {booking.booking_reference}
              </p>
              <p style={{ marginTop: 6, color: '#374151', fontSize: '0.9rem' }}>
                Route: <strong>{booking.from_location} → {booking.to_location}</strong>
              </p>
            </div>

            {/* Amount to pay */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total Amount to Pay</p>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a', fontFamily: 'Poppins,sans-serif' }}>
                  ₹{Number(booking.total_amount).toLocaleString('en-IN')}
                </p>
              </div>
              <div style={{ fontSize: '2.5rem' }}>💰</div>
            </div>

            {/* Payment methods */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 12 }}>Accepted Payment Methods</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { icon: '📱', label: 'UPI' },
                  { icon: '💳', label: 'Cards' },
                  { icon: '🏦', label: 'Net Banking' },
                  { icon: '👛', label: 'Wallets' },
                  { icon: '💵', label: 'EMI' },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                    <span>{m.icon}</span> {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Razorpay badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
              <span style={{ fontSize: '1.1rem' }}>🔒</span>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Secured by <strong style={{ color: '#111827' }}>Razorpay</strong>. Your payment info is encrypted and never stored on our servers.
              </p>
            </div>

            {/* Payment error */}
            {payError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem' }}>
                ⚠️ {payError}
              </div>
            )}

            <button onClick={handlePay} disabled={payProcessing}
              style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: '1.05rem', fontWeight: 700, cursor: payProcessing ? 'not-allowed' : 'pointer', opacity: payProcessing ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 18px rgba(37,99,235,0.35)', fontFamily: 'inherit', transition: 'all .2s' }}>
              {payProcessing ? <><Spinner /> Processing payment...</> : <>💳 Pay ₹{Number(booking.total_amount).toLocaleString('en-IN')} Now</>}
            </button>

            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Back to Price Summary
              </button>
            </div>
          </Card>
        )}

        {/* ═══ STEP 4: Confirmed ═══ */}
        {step === 4 && booking && (
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.25rem' }}>
                {paySuccess ? '🎉' : '⏳'}
              </div>

              <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                {paySuccess ? 'Booking Confirmed & Paid!' : 'Booking Created!'}
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: '0.9rem' }}>
                {paySuccess
                  ? 'Your payment was successful. Your trip is confirmed!'
                  : 'Your booking is placed. Complete payment to confirm.'}
              </p>

              {/* Booking Details */}
              <div style={{ background: '#f8fafc', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4 }}>Booking Reference</p>
                  <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563eb', letterSpacing: '0.08em', fontFamily: 'Poppins,sans-serif' }}>
                    {booking.booking_reference}
                  </p>
                </div>
                {[
                  ['Route',       `${booking.from_location} → ${booking.to_location}`],
                  ['Travel Date', new Date(booking.travel_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })],
                  ['Total Paid',  `₹${Number(booking.total_amount).toLocaleString('en-IN')}`],
                  ['Status',      paySuccess ? '✅ Confirmed & Paid' : '⏳ Pending Payment'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6b7280' }}>{k}</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400e', marginBottom: 4 }}>⏳ What happens next?</p>
                <p style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.6 }}>
                  {paySuccess
                    ? 'Our team will assign a driver and send you the driver details within 2 hours. Check your dashboard for updates.'
                    : 'Complete your payment to confirm the booking. You can pay from My Bookings in your dashboard.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link to="/dashboard"
                  style={{ flex: 1, background: '#2563eb', color: '#fff', borderRadius: 14, padding: '12px', fontWeight: 700, textAlign: 'center', fontSize: '0.9rem', display: 'block', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                  View My Bookings
                </Link>
                <Link to="/"
                  style={{ flex: 1, background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 14, padding: '12px', fontWeight: 600, textAlign: 'center', fontSize: '0.9rem', display: 'block' }}>
                  Back to Home
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Style helpers ──────────────────────────────────────────
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

const ERR: React.CSSProperties = {
  color: '#dc2626', fontSize: '0.72rem', marginTop: 4,
};

function Spinner() {
  return (
    <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </span>
  );
}
