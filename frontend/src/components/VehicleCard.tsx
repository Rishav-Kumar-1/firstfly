// VehicleCard.tsx
// Displays a single vehicle as a card — used in the Vehicles listing page
// and the "Popular Vehicles" section on the homepage.

import { Link } from 'react-router-dom';
import type { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  // Vehicle images mapped to your real fleet
  const VEHICLE_NAME_IMGS: Record<string, string> = {
    'Force Traveller':      '/vehicles/force-traveller.jpg',
    'Force Urbania':        '/vehicles/urbania.jpg',
    'Toyota Innova Crysta': '/vehicles/innova-crysta.jpg',
    'Toyota Etios':         '/vehicles/etios.jpg',
    'Maruti Suzuki Ertiga': '/vehicles/ertiga.jpg',
    'Maruti Suzuki Dzire':  '/vehicles/dzire.jpg',
  };
  const TYPE_FALLBACKS: Record<string, string> = {
    Traveller: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=75',
    Bus:       'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=75',
    SUV:       'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=75',
    Sedan:     'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=75',
    Tempo:     'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=75',
  };
  const getImageSrc = () => {
    if (vehicle.image_url && !vehicle.image_url.includes('placehold.co') && !vehicle.image_url.includes('unsplash')) {
      return vehicle.image_url;
    }
    const nameKey = Object.keys(VEHICLE_NAME_IMGS).find(k =>
      vehicle.name.toLowerCase().includes(k.toLowerCase())
    );
    return nameKey ? VEHICLE_NAME_IMGS[nameKey] : (TYPE_FALLBACKS[vehicle.vehicle_type] || TYPE_FALLBACKS.Traveller);
  };
  const imageSrc = getImageSrc();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Vehicle Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={imageSrc}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80';
          }}
        />
        {/* Status Badge */}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
          vehicle.status === 'AVAILABLE'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {vehicle.status === 'AVAILABLE' ? '✓ Available' : 'Unavailable'}
        </span>
        {/* AC Badge */}
        {vehicle.ac && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            AC
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{vehicle.name}</h3>

        {/* Seats */}
        <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
          <span>👥</span> {vehicle.seating_capacity} Seats
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {vehicle.ac && (
            <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">AC</span>
          )}
          {vehicle.pushback_seats && (
            <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">Pushback</span>
          )}
          {vehicle.music_system && (
            <span className="bg-pink-50 text-pink-700 text-xs px-2.5 py-1 rounded-full font-medium">Music</span>
          )}
          {vehicle.luggage_capacity && (
            <span className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-full font-medium">
              Luggage: {vehicle.luggage_capacity}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <span>🚌</span> {vehicle.vehicle_type}
          </p>
          <div className="flex gap-2">
            <Link
              to={`/vehicles/${vehicle.id}`}
              className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Details
            </Link>
            <Link
              to={`/booking?vehicle=${vehicle.id}`}
              className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
