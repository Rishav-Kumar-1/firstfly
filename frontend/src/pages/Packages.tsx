// Packages.tsx — Tour packages listing page

import { useState, useEffect } from 'react';
import PackageCard from '../components/PackageCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { packageAPI } from '../services/api';
import type { TourPackage } from '../types';

export default function Packages() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    packageAPI.getAll()
      .then(r => setPackages(r.data.data || []))
      .catch(() => setError('Failed to load packages.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? packages.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        (p.destination_name || '').toLowerCase().includes(filter.toLowerCase())
      )
    : packages;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Tour Packages</h1>
          <p className="text-blue-100 max-w-xl mx-auto">
            Handpicked itineraries for India's most loved destinations.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text" value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Search packages or destinations..."
              className="w-full bg-white/20 border border-white/30 text-white placeholder-blue-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Loading message="Loading packages..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No packages found</h3>
              <button onClick={() => setFilter('')} className="text-blue-600 hover:underline">Clear search</button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">{filtered.length} package(s) found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
