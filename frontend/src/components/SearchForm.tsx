// SearchForm.tsx — Main search form on the homepage hero section

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchFormData } from '../types';

export default function SearchForm() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<SearchFormData>({
    from: '',
    to: '',
    travel_date: '',
    return_date: '',
    passengers: 1,
    trip_type: 'ONE_WAY',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SearchFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SearchFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof SearchFormData, string>> = {};
    if (!form.from.trim())    errs.from         = 'Please enter pickup location';
    if (!form.to.trim())      errs.to           = 'Please enter destination';
    if (!form.travel_date)    errs.travel_date  = 'Please select travel date';
    if (Number(form.passengers) < 1) errs.passengers = 'At least 1 passenger required';
    if (form.trip_type === 'ROUND_TRIP' && !form.return_date) {
      errs.return_date = 'Return date required for round trip';
    }
    if (form.return_date && form.return_date < form.travel_date) {
      errs.return_date = 'Return date cannot be before travel date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const params = new URLSearchParams({
      from:       form.from,
      to:         form.to,
      date:       form.travel_date,
      passengers: String(form.passengers),
      trip_type:  form.trip_type,
      ...(form.return_date && { return_date: form.return_date }),
    });
    navigate(`/vehicles?${params.toString()}`);
  };

  const tripTypes = [
    { value: 'ONE_WAY',    label: '→ One Way'     },
    { value: 'ROUND_TRIP', label: '⇄ Round Trip'  },
    { value: 'LOCAL',      label: '🏙 Local'       },
    { value: 'MULTI_DAY',  label: '📅 Multi Day'   },
  ];

  // Shared input class — explicit text-gray-900 so parent text-white doesn't bleed in
  const inputCls = (hasError?: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white
     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition
     ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

  const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 w-full">

      {/* Trip Type Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tripTypes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setForm(prev => ({ ...prev, trip_type: t.value as SearchFormData['trip_type'] }))}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              form.trip_type === t.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* FROM */}
        <div>
          <label className={labelCls}>From</label>
          <input
            type="text" name="from" value={form.from}
            onChange={handleChange}
            placeholder="e.g. New Delhi"
            className={inputCls(errors.from)}
          />
          {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
        </div>

        {/* TO */}
        <div>
          <label className={labelCls}>To</label>
          <input
            type="text" name="to" value={form.to}
            onChange={handleChange}
            placeholder="e.g. Manali"
            className={inputCls(errors.to)}
          />
          {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
        </div>

        {/* PASSENGERS */}
        <div>
          <label className={labelCls}>Passengers</label>
          <select
            name="passengers" value={form.passengers}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
            ))}
          </select>
        </div>

        {/* TRAVEL DATE */}
        <div>
          <label className={labelCls}>Travel Date</label>
          <input
            type="date" name="travel_date" value={form.travel_date}
            min={today} onChange={handleChange}
            className={inputCls(errors.travel_date)}
          />
          {errors.travel_date && <p className="text-red-500 text-xs mt-1">{errors.travel_date}</p>}
        </div>

        {/* RETURN DATE — only for round trip / multi day */}
        {(form.trip_type === 'ROUND_TRIP' || form.trip_type === 'MULTI_DAY') && (
          <div>
            <label className={labelCls}>Return Date</label>
            <input
              type="date" name="return_date" value={form.return_date}
              min={form.travel_date || today} onChange={handleChange}
              className={inputCls(errors.return_date)}
            />
            {errors.return_date && <p className="text-red-500 text-xs mt-1">{errors.return_date}</p>}
          </div>
        )}

        {/* SEARCH BUTTON */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200"
          >
            <span>🔍</span> Search Vehicles
          </button>
        </div>
      </div>
    </form>
  );
}
