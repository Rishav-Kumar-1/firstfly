// PackageDetails.tsx — Full detail page for a tour package

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { packageAPI } from '../services/api';
import type { TourPackage, PackageItinerary } from '../types';

type PackageWithFull = TourPackage & {
  itinerary?: PackageItinerary[];
  dest_description?: string;
  state?: string;
};

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageWithFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    packageAPI.getById(Number(id))
      .then(r => setPkg(r.data.data))
      .catch(() => setError('Package not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading fullScreen message="Loading package..." />;
  if (error || !pkg) return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorMessage message={error || 'Package not found'} />
    </div>
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">Home</Link> /{' '}
          <Link to="/packages" className="hover:text-blue-600">Packages</Link> /{' '}
          <span className="text-gray-800">{pkg.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden h-72">
              <img src={pkg.image_url} alt={pkg.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Package'; }} />
            </div>

            <div>
              {pkg.destination_name && (
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-1">
                  📍 {pkg.destination_name}{pkg.state ? `, ${pkg.state}` : ''}
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{pkg.name}</h1>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                  {pkg.duration_days} Days / {pkg.duration_nights} Nights
                </span>
              </div>
            </div>

            {pkg.description && (
              <div className="bg-blue-50 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">About this Package</h3>
                <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
              </div>
            )}

            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2.5">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="text-gray-700 text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4">Day-by-Day Itinerary</h3>
                <div className="space-y-3">
                  {pkg.itinerary.map(day => (
                    <div key={day.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          D{day.day_number}
                        </div>
                        {day.day_number < (pkg.itinerary?.length || 0) && (
                          <div className="w-0.5 h-full bg-blue-100 mx-auto mt-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <h4 className="font-semibold text-gray-900">{day.title}</h4>
                        {day.description && <p className="text-gray-500 text-sm mt-1">{day.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Package Price</h3>
              <div className="text-center bg-blue-50 rounded-xl p-4 mb-5">
                <p className="text-xs text-gray-400 mb-1">Starting from</p>
                <p className="text-3xl font-extrabold text-blue-600">
                  ₹{pkg.starting_price.toLocaleString('en-IN')}
                </p>
                <p className="text-gray-400 text-xs">per person</p>
              </div>

              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{pkg.duration_days}D / {pkg.duration_nights}N</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-medium">{pkg.destination_name}</span></div>
              </div>

              <Link to={`/booking?package=${pkg.id}`}
                className="block w-full text-center bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
                Book This Package
              </Link>

              <Link to="/contact"
                className="block w-full text-center mt-3 text-blue-600 border border-blue-200 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
                📞 Customise Package
              </Link>

              <div className="mt-5 space-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Vehicle + Driver Included</p>
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Flexible Itinerary</p>
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Free Cancellation (48hrs)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
