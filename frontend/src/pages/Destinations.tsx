// Destinations.tsx — All travel destinations listing

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { destinationAPI } from '../services/api';
import type { Destination } from '../types';

const BG_COLORS = [
  'from-blue-500 to-indigo-600', 'from-green-500 to-teal-600',
  'from-orange-500 to-amber-600', 'from-pink-500 to-rose-600',
  'from-purple-500 to-violet-600', 'from-cyan-500 to-blue-600',
  'from-slate-500 to-gray-600', 'from-yellow-500 to-orange-600',
  'from-red-500 to-pink-600', 'from-emerald-500 to-green-600',
];

const EMOJIS = ['🏔️','🌲','🕉️','🏯','🕌','❄️','🌫️','🐪','🛕','🌊'];

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    destinationAPI.getAll()
      .then(r => setDestinations(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? destinations.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.state.toLowerCase().includes(search.toLowerCase())
      )
    : destinations;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Destinations</h1>
          <p className="text-blue-100 mb-6">Discover amazing places across India</p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full bg-white/20 border border-white/30 text-white placeholder-blue-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Loading message="Loading destinations..." />
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">{filtered.length} destination(s)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((dest, i) => (
                  // Each card links to /destinations/:id — the detail page
                  <Link
                    key={dest.id}
                    to={`/destinations/${dest.id}`}
                    className={`bg-gradient-to-br ${BG_COLORS[i % BG_COLORS.length]} rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 shadow-md block`}
                  >
                    <div className="text-4xl mb-3">{EMOJIS[i % EMOJIS.length]}</div>
                    <h3 className="font-bold text-xl mb-1">{dest.name}</h3>
                    <p className="text-white/80 text-sm mb-3">{dest.state}</p>
                    {dest.description && (
                      <p className="text-white/70 text-xs line-clamp-2">{dest.description}</p>
                    )}
                    <div className="mt-4 text-xs font-semibold text-white/90">
                      Explore →
                    </div>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No destinations found</h3>
                  <button
                    onClick={() => setSearch('')}
                    className="text-blue-600 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
