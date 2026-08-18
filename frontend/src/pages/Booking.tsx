// Booking.tsx — Multi-step booking flow
// Step 1: Trip Details → Step 2: Price Summary → Step 3: Confirm

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { vehicleAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import type { Vehicle } from '../types';

// ─────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────
function Steps({ current }: { current: number }) {
  const steps = ['Trip Details', 'Price Summary', 'Confirmation'];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {done ? '✓' : step}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mb-4 mx-1 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// FARE BREAKDOWN DISPLAY
// ─────────────────────────────────────────────
interface BreakdownItem { label: string; value: number; detail: string }

function FareBreakdown({ items, total }: { items: BreakdownItem[]; total: number }) {
  return (
    <div className="bg-blue-50 rounded-2xl p-5 space-y-3">
      <h3 className="font-bold text-gray-900 mb-3">Fare Breakdown</h3>
      {items.map((item) => (
        <div key={item.label} className="flex justify-between text-sm">
          <div>
            <span className="text-gray-700 font-medium">{item.label}</span>
            {item.detail && <p className="text-gray-400 text-xs">{item.detail}</p>}
          </div>
          <span className={`font-semibold ${item.value < 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {item.value < 0 ? `-₹${Math.abs(item.value).toLocaleString('en-IN')}` : `₹${item.value.toLocaleString('en-IN')}`}
          </span>
        </div>
      ))}
      <div className="border-t border-blue-200 pt-3 flex justify-between">
        <span className="font-bold text-gray-900">Total Amount</span>
        <span className="font-extrabold text-blue-600 text-xl">₹{total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN BOOKING COMPONENT
// ─────────────────────────────────────────────
export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const vehicleIdParam = searchParams.get('vehicle');
  const today = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [fareData, setFareData] = useState<{ total_amount: number; breakdown: BreakdownItem[] } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{ booking_reference: string; total_amount: number } | null>(null);

  const [form, setForm] = useState({
    vehicle_id: vehicleIdParam || '',
    from_location: searchParams.get('from') || '',
    to_location: searchParams.get('to') || '',
    travel_date: searchParams.get('date') || '',
    return_date: '',
    passengers: Number(searchParams.get('passengers')) || 1,
    trip_type: searchParams.get('trip_type') || 'ONE_WAY',
    distance_km: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch vehicle details
  useEffect(() => {
    if (!vehicleIdParam) { setLoadingVehicle(false); return; }
    vehicleAPI.getById(Number(vehicleIdParam))
      .then(r => setVehicle(r.data.data))
      .catch(() => setError('Vehicle not found.'))
      .finally(() => setLoadingVehicle(false));
  }, [vehicleIdParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.from_location.trim()) errs.from_location = 'Pickup location required';
    if (!form.to_location.trim())   errs.to_location   = 'Destination required';
    if (!form.travel_date)          errs.travel_date   = 'Travel date required';
    if (!form.distance_km || Number(form.distance_km) <= 0) errs.distance_km = 'Estimated distance required (in km)';
    if (form.passengers < 1)        errs.passengers    = 'At least 1 passenger';
    if (vehicle && form.passengers > vehicle.seating_capacity) {
      errs.passengers = `Max ${vehicle.seating_capacity} passengers for this vehicle`;
    }
    if (form.trip_type === 'ROUND_TRIP' && !form.return_date) errs.return_date = 'Return date required';
    if (form.return_date && form.return_date < form.travel_date) errs.return_date = 'Return date must be after travel date';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1 → Step 2: Calculate price
  const handleCalculatePrice = async () => {
    if (!validateStep1()) return;
    setLoadingPrice(true);
    setError('');
    try {
      const response = await bookingAPI.calculatePrice({
        vehicle_id: form.vehicle_id,
        distance_km: form.distance_km,
        trip_type: form.trip_type,
        travel_date: form.travel_date,
        return_date: form.return_date || undefined,
      });
      setFareData(response.data.data);
      setStep(2);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Price calculation failed. Please try again.');
    } finally {
      setLoadingPrice(false);
    }
  };

  // Step 2 → Step 3: Create booking
  const handleConfirmBooking = async () => {
    setLoadingSubmit(true);
    setError('');
    try {
      const response = await bookingAPI.create({
        vehicle_id: Number(form.vehicle_id),
        from_location: form.from_location,
        to_location: form.to_location,
        travel_date: form.travel_date,
        return_date: form.return_date || undefined,
        passengers: Number(form.passengers),
        trip_type: form.trip_type,
        distance_km: Number(form.distance_km),
        notes: form.notes,
      });
      setConfirmedBooking(response.data.data);
      setStep(3);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingVehicle) return <Loading fullScreen message="Loading vehicle..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Vehicle</h1>
          <p className="text-gray-500 mt-2">Complete in 3 simple steps</p>
        </div>

        <Steps current={step} />

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ─────────────────── STEP 1: Trip Details ─────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Selected Vehicle Banner */}
            {vehicle && (
              <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4 mb-6">
                <img src={vehicle.image_url} alt={vehicle.name}
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x56/e2e8f0/94a3b8?text=V'; }} />
                <div>
                  <p className="font-bold text-gray-900">{vehicle.name}</p>
                  <p className="text-sm text-gray-500">{vehicle.seating_capacity} Seats • {vehicle.ac ? 'AC' : 'Non-AC'} • ₹{vehicle.price_per_km}/km</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Trip Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[['ONE_WAY','→ One Way'],['ROUND_TRIP','⇄ Round Trip'],['LOCAL','🏙 Local'],['MULTI_DAY','📅 Multi Day']].map(([val, label]) => (
                    <button key={val} type="button"
                      onClick={() => setForm(prev => ({ ...prev, trip_type: val }))}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        form.trip_type === val ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* From / To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">From (Pickup)</label>
                  <input type="text" name="from_location" value={form.from_location} onChange={handleChange}
                    placeholder="e.g. New Delhi"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.from_location ? 'border-red-400' : 'border-gray-200'}`} />
                  {formErrors.from_location && <p className="text-red-500 text-xs mt-1">{formErrors.from_location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">To (Destination)</label>
                  <input type="text" name="to_location" value={form.to_location} onChange={handleChange}
                    placeholder="e.g. Manali"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.to_location ? 'border-red-400' : 'border-gray-200'}`} />
                  {formErrors.to_location && <p className="text-red-500 text-xs mt-1">{formErrors.to_location}</p>}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Travel Date</label>
                  <input type="date" name="travel_date" value={form.travel_date} min={today} onChange={handleChange}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.travel_date ? 'border-red-400' : 'border-gray-200'}`} />
                  {formErrors.travel_date && <p className="text-red-500 text-xs mt-1">{formErrors.travel_date}</p>}
                </div>
                {(form.trip_type === 'ROUND_TRIP' || form.trip_type === 'MULTI_DAY') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Return Date</label>
                    <input type="date" name="return_date" value={form.return_date} min={form.travel_date || today} onChange={handleChange}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.return_date ? 'border-red-400' : 'border-gray-200'}`} />
                    {formErrors.return_date && <p className="text-red-500 text-xs mt-1">{formErrors.return_date}</p>}
                  </div>
                )}
              </div>

              {/* Passengers + Distance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Passengers</label>
                  <select name="passengers" value={form.passengers} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {Array.from({ length: vehicle?.seating_capacity || 50 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                  {formErrors.passengers && <p className="text-red-500 text-xs mt-1">{formErrors.passengers}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Estimated Distance (km)
                    <span className="text-gray-400 font-normal"> — one way</span>
                  </label>
                  <input type="number" name="distance_km" value={form.distance_km} onChange={handleChange}
                    placeholder="e.g. 540" min="1"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.distance_km ? 'border-red-400' : 'border-gray-200'}`} />
                  {formErrors.distance_km && <p className="text-red-500 text-xs mt-1">{formErrors.distance_km}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                  placeholder="Any special requirements..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <button onClick={handleCalculatePrice} disabled={loadingPrice}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-md shadow-blue-200 text-base">
                {loadingPrice ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Calculating price...
                  </span>
                ) : 'Calculate Price & Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────── STEP 2: Price Summary ─────────────────── */}
        {step === 2 && fareData && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Price Summary</h2>

            {/* Trip Summary */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Route</span><span className="font-medium">{form.from_location} → {form.to_location}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Travel Date</span><span className="font-medium">{new Date(form.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              {form.return_date && <div className="flex justify-between"><span className="text-gray-500">Return Date</span><span className="font-medium">{new Date(form.return_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Passengers</span><span className="font-medium">{form.passengers}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Trip Type</span><span className="font-medium">{form.trip_type.replace('_', ' ')}</span></div>
              {vehicle && <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-medium">{vehicle.name}</span></div>}
            </div>

            {/* Fare Breakdown */}
            <FareBreakdown items={fareData.breakdown} total={fareData.total_amount} />

            {/* Booked by */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="text-gray-500 mb-1">Booking for</p>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>

            <p className="text-xs text-gray-400">
              * Toll and parking charges are estimates. Actuals may vary slightly. 
              Payment will be collected before the trip.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleConfirmBooking} disabled={loadingSubmit}
                className="flex-2 flex-grow-[2] bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-60 shadow-md shadow-orange-200">
                {loadingSubmit ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Confirming...
                  </span>
                ) : 'Confirm Booking ✓'}
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────── STEP 3: Confirmed ─────────────────── */}
        {step === 3 && confirmedBooking && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your booking has been placed successfully.</p>

            <div className="bg-blue-50 rounded-2xl p-5 mb-6">
              <p className="text-gray-500 text-sm mb-1">Booking Reference</p>
              <p className="text-2xl font-extrabold text-blue-600 tracking-widest">
                {confirmedBooking.booking_reference}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Total Amount: <span className="font-bold text-gray-900">₹{confirmedBooking.total_amount?.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="text-sm text-gray-500 bg-yellow-50 rounded-xl p-4 mb-6">
              <p className="font-medium text-yellow-800 mb-1">⏳ What happens next?</p>
              <p>Our team will review and confirm your booking within 2 hours. You'll receive updates in your dashboard.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/dashboard" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center">
                View My Bookings
              </a>
              <a href="/" className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center">
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
