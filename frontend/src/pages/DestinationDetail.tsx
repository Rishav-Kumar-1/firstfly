// DestinationDetail.tsx — Detail page for a single destination

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { destinationAPI } from '../services/api';
import type { Destination, TourPackage } from '../types';

type DestinationFull = Destination & { packages?: TourPackage[] };

const BG_COLORS = [
  'from-blue-600 to-indigo-700', 'from-green-600 to-teal-700',
  'from-orange-500 to-amber-600', 'from-pink-600 to-rose-700',
  'from-purple-600 to-violet-700', 'from-cyan-600 to-blue-700',
  'from-slate-600 to-gray-700', 'from-yellow-500 to-orange-600',
  'from-red-500 to-pink-600', 'from-emerald-600 to-green-700',
];

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<DestinationFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    destinationAPI.getById(Number(id))
      .then(r => setDestination(r.data.data))
      .catch(() => setError('Destination not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading fullScreen message="Loading destination..." />;
  if (error || !destination) return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorMessage message={error || 'Destination not found'} />
    </div>
  );

  const colorClass = BG_COLORS[Number(id) % BG_COLORS.length];

  return (
    <>
      {/* Hero Banner */}
      <section className={`bg-gradient-to-br ${colorClass} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <p className="text-white/70 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            {' / '}
            <Link to="/destinations" className="hover:text-white">Destinations</Link>
            {' / '}
            <span>{destination.name}</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">{destination.name}</h1>
          <p className="text-white/80 text-lg">{destination.state}</p>
          {destination.description && (
            <p className="text-white/70 mt-4 max-w-2xl leading-relaxed">{destination.description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/vehicles?to=${encodeURIComponent(destination.name)}`}
              className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              🚌 Book a Vehicle
            </Link>
            <Link
              to="/packages"
              className="bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              🗺️ View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Tour Packages for this destination */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {destination.packages && destination.packages.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tour Packages to {destination.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.packages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={{ ...pkg, destination_name: destination.name }} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No packages yet for {destination.name}</h3>
              <p className="text-gray-500 mb-6">You can still book a vehicle directly to this destination.</p>
              <Link
                to={`/vehicles?to=${encodeURIComponent(destination.name)}`}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Book a Vehicle to {destination.name}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Visit */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Visit {destination.name}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🏞️', title: 'Scenic Beauty',    desc: 'Breathtaking landscapes and natural wonders.' },
              { icon: '🍽️', title: 'Local Cuisine',    desc: 'Authentic flavours and unique regional food.' },
              { icon: '🎭', title: 'Rich Culture',      desc: 'History, traditions and vibrant local culture.' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
