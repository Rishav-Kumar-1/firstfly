// PackageCard.tsx
// Displays a single tour package as a card.

import { Link } from 'react-router-dom';
import type { TourPackage } from '../types';

interface PackageCardProps {
  pkg: TourPackage;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const imageSrc = pkg.image_url || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Tour+Package';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Package Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imageSrc}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Tour';
          }}
        />
        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
          {pkg.duration_days}D / {pkg.duration_nights}N
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {pkg.destination_name && (
          <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide mb-1">
            📍 {pkg.destination_name}
          </p>
        )}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{pkg.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>

        {/* Highlights */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pkg.highlights.slice(0, 3).map((h, i) => (
              <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                ✓ {h}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-medium text-gray-500">
            {pkg.duration_days}D / {pkg.duration_nights}N
          </span>
          <div className="flex gap-2">
            <Link
              to={`/packages/${pkg.id}`}
              className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              View
            </Link>
            <Link
              to={`/booking?package=${pkg.id}`}
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
