// SearchForm.tsx
// The main search/booking form used on the hero section.
// Collects: from, to, travel date, return date, passengers, trip type.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchFormData } from '../types';

export default function SearchForm() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" format

  const [form, setForm] = useState<SearchFormData>({
    from: '',
    to: '',
    travel_date: '',
    return_date: '',
    passengers: 1,
    trip_type: 'ONE_WAY',
  });

  const [errors, setErrors] = useState<Partial<SearchFormData>>({});

  // Generic change handler — updates whichever field the user typed in
  // e.target.name tells us which field, e.target.value gives the new value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SearchFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SearchFormData, string>> = {};
    if (!form.from.trim()) newErrors.from = 'Please enter pickup location';
    if (!form.to.trim()) newErrors.to = 'Please enter destination';
    if (!form.travel_date) newErrors.travel_date = 'Please select travel date';
    if (form.passengers < 1) newErrors.passengers = 'At least 1 passenger required' as never;
    if (form.trip_type === 'ROUND_TRIP' && !form.return_date) {
      newErrors.return_date = 'Return date required for round trip';
    }
    if (form.return_date && form.return_date < form.travel_date) {
      newErrors.return_date = 'Return date cannot be before travel date';
    }
    setErrors(newErrors as Partial<SearchFormData>);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Navigate to vehicles page with search params in the URL
    // URLSearchParams turns our object into a query string like ?from=Delhi&to=Manali
    const params = new URLSearchParams({
      from: form.from,
      to: form.to,
      date: form.travel_date,
      passengers: String(form.passengers),
      trip_type: form.trip_type,
      ...(form.return_date && { return_date: form.return_date }),
    });
    navigate(`/vehicles?${params.toString()}`);
  };

  const tripTypes = [
    { value: 'ONE_WAY', label: '→ One Way' },
    { value: 'ROUND_TRIP', label: '⇄ Round Trip' },
    { value: 'LOCAL', label: '🏙 Local' },
    { value: 'MULTI_DAY', label: '📅 Multi Day' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 w-full">
      {/* Trip Type Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tripTypes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setForm(prev => ({ ...prev, trip_type: t.value as SearchFormData['trip_type'] }))}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              form.trip_type === t.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* From */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            From
          </label>
          <input
            type="text"
            name="from"
            value={form.from}
            onChange={handleChange}
            placeholder="Pickup city / address"
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.from ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
        </div>

        {/* To */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            To
          </label>
          <input
            type="text"
            name="to"
            value={form.to}
            onChange={handleChange}
            placeholder="Destination city"
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.to ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Passengers
          </label>
          <select
            name="passengers"
            value={form.passengers}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
            ))}
          </select>
        </div>

        {/* Travel Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Travel Date
          </label>
          <input
            type="date"
            name="travel_date"
            value={form.travel_date}
            min={today}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.travel_date ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.travel_date && <p className="text-red-500 text-xs mt-1">{errors.travel_date}</p>}
        </div>

        {/* Return Date — only for Round Trip */}
        {(form.trip_type === 'ROUND_TRIP' || form.trip_type === 'MULTI_DAY') && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Return Date
            </label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              min={form.travel_date || today}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.return_date ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.return_date && <p className="text-red-500 text-xs mt-1">{errors.return_date}</p>}
          </div>
        )}

        {/* Submit Button */}
        <div className={`flex items-end ${form.trip_type !== 'ONE_WAY' && form.trip_type !== 'LOCAL' ? '' : 'sm:col-start-2 lg:col-start-3'}`}>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200"
          >
            <span>🔍</span> Search Vehicles
          </button>
        </div>
      </div>
    </form>
  );
}
