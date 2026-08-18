// VehicleDetails.tsx — Full detail page for a single vehicle

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { vehicleAPI } from '../services/api';
import type { Vehicle, Review } from '../types';

// Star rating display component
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  // useParams reads the :id from the URL — e.g. /vehicles/3 → id = "3"

  const [vehicle, setVehicle] = useState<Vehicle & { reviews?: Review[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const response = await vehicleAPI.getById(Number(id));
        setVehicle(response.data.data);
      } catch {
        setError('Vehicle not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVehicle();
  }, [id]);

  if (loading) return <Loading fullScreen message="Loading vehicle details..." />;
  if (error || !vehicle) return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorMessage message={error || 'Vehicle not found'} />
    </div>
  );

  const features = [
    { label: 'Seating Capacity', value: `${vehicle.seating_capacity} Seats`, icon: '👥' },
    { label: 'Vehicle Type',     value: vehicle.vehicle_type,                 icon: '🚌' },
    { label: 'AC',               value: vehicle.ac ? 'Air Conditioned' : 'Non-AC', icon: '❄️' },
    { label: 'Pushback Seats',   value: vehicle.pushback_seats ? 'Yes' : 'No',     icon: '💺' },
    { label: 'Music System',     value: vehicle.music_system ? 'Yes' : 'No',       icon: '🎵' },
    { label: 'Luggage Space',    value: vehicle.luggage_capacity || 'Standard',    icon: '🧳' },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          {' / '}
          <Link to="/vehicles" className="hover:text-blue-600">Vehicles</Link>
          {' / '}
          <span className="text-gray-800">{vehicle.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column: Image + Features ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Image */}
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-72 sm:h-96">
              <img
                src={vehicle.image_url || 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Vehicle'}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/e2e8f0/94a3b8?text=Vehicle';
                }}
              />
            </div>

            {/* Title + Status */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{vehicle.name}</h1>
                <p className="text-gray-500 mt-1">{vehicle.vehicle_type} • {vehicle.seating_capacity} Seats</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {vehicle.status === 'AVAILABLE' ? '✓ Available' : vehicle.status}
              </span>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-blue-50 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">About this Vehicle</h3>
                <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Features Grid */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">Features & Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.map((f) => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <p className="text-xs text-gray-400 font-medium">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            {vehicle.reviews && vehicle.reviews.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4">
                  Customer Reviews ({vehicle.reviews.length})
                </h3>
                <div className="space-y-4">
                  {vehicle.reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {(review.user_name || 'U')[0]}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {review.user_name || 'Verified Customer'}
                          </span>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Booking Card ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-5">Fare Details</h3>

              {/* Price Per KM */}
              <div className="text-center bg-blue-50 rounded-xl p-4 mb-5">
                <p className="text-3xl font-extrabold text-blue-600">₹{vehicle.price_per_km}</p>
                <p className="text-gray-500 text-sm">per kilometre</p>
              </div>

              {/* Charges Breakdown */}
              <div className="space-y-3 mb-5">
                {[
                  { label: 'Price per KM',   value: `₹${vehicle.price_per_km}/km` },
                  { label: 'Driver Charge',  value: `₹${vehicle.driver_charge}/day` },
                  { label: 'Toll Charges',   value: 'At actuals' },
                  { label: 'GST',            value: 'Included' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <p className="text-xs text-gray-400">
                  Final price depends on distance, trip type, and duration. 
                  Get exact price during booking.
                </p>
              </div>

              {/* Book Now Button */}
              {vehicle.status === 'AVAILABLE' ? (
                <Link
                  to={`/booking?vehicle=${vehicle.id}`}
                  className="block w-full text-center bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200 text-lg"
                >
                  Book Now
                </Link>
              ) : (
                <button disabled
                  className="block w-full text-center bg-gray-300 text-gray-500 py-3.5 rounded-xl font-bold cursor-not-allowed">
                  Not Available
                </button>
              )}

              <Link
                to="/contact"
                className="block w-full text-center mt-3 text-blue-600 border border-blue-200 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                📞 Enquire Now
              </Link>

              {/* Trust Badges */}
              <div className="mt-5 space-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Verified & Insured Vehicle</p>
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Experienced Driver Included</p>
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> 24/7 Customer Support</p>
                <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Free Cancellation (24hrs)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
