// Vehicles.tsx — Full vehicle listing page with filters and sorting

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { vehicleAPI } from '../services/api';
import type { Vehicle } from '../types';

// ─────────────────────────────────────────────
// FILTERS STATE
// ─────────────────────────────────────────────
interface Filters {
  vehicle_type: string;
  min_seats: string;
  max_price: string;
  ac: string;
  status: string;
}

export default function Vehicles() {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('ASC');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    vehicle_type: '',
    min_seats: searchParams.get('passengers') || '',
    max_price: '',
    ac: '',
    status: 'AVAILABLE',
  });

  // fetchVehicles calls our backend API with the current filters
  // useCallback ensures this function isn't recreated on every render
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Build query params from filters state
      const params: Record<string, string> = { sort, order };
      if (filters.vehicle_type) params.vehicle_type = filters.vehicle_type;
      if (filters.min_seats)    params.min_seats    = filters.min_seats;
      if (filters.max_price)    params.max_price    = filters.max_price;
      if (filters.ac)           params.ac           = filters.ac;
      if (filters.status)       params.status       = filters.status;

      const response = await vehicleAPI.getAll(params);
      setVehicles(response.data.data || []);
    } catch {
      setError('Failed to load vehicles. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, order]);

  // useEffect runs fetchVehicles whenever filters or sort changes
  // The [] dependency array means "run when these values change"
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ vehicle_type: '', min_seats: '', max_price: '', ac: '', status: 'AVAILABLE' });
    setSort('id');
    setOrder('ASC');
  };

  // Sidebar filter panel
  const FilterPanel = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Filters</h3>
        <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">Clear all</button>
      </div>

      {/* Vehicle Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
        <select name="vehicle_type" value={filters.vehicle_type} onChange={handleFilterChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Types</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Traveller">Traveller</option>
          <option value="Bus">Bus</option>
          <option value="Tempo">Tempo</option>
        </select>
      </div>

      {/* Min Seats */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Seats: {filters.min_seats || 'Any'}
        </label>
        <input type="range" name="min_seats" min="1" max="30"
          value={filters.min_seats || 1}
          onChange={handleFilterChange}
          className="w-full accent-blue-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span><span>30</span>
        </div>
      </div>

      {/* Max Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Price/km: {filters.max_price ? `₹${filters.max_price}` : 'Any'}
        </label>
        <input type="range" name="max_price" min="10" max="50"
          value={filters.max_price || 50}
          onChange={handleFilterChange}
          className="w-full accent-blue-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>₹10</span><span>₹50</span>
        </div>
      </div>

      {/* AC */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">AC</label>
        <div className="flex gap-2">
          {[{ label: 'Any', value: '' }, { label: 'AC Only', value: 'true' }, { label: 'Non-AC', value: 'false' }].map(opt => (
            <button key={opt.value}
              onClick={() => setFilters(prev => ({ ...prev, ac: opt.value }))}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                filters.ac === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
        <select name="status" value={filters.status} onChange={handleFilterChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All</option>
          <option value="AVAILABLE">Available</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Our Vehicles</h1>
          <p className="text-blue-100">
            Choose from our fleet of {vehicles.length}+ verified, well-maintained vehicles.
          </p>
          {/* Breadcrumb */}
          <p className="text-blue-200 text-sm mt-3">
            <a href="/" className="hover:text-white">Home</a> / Vehicles
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ⚙️ Filters
                </button>
                <p className="text-gray-500 text-sm">
                  {loading ? 'Loading...' : `${vehicles.length} vehicle(s) found`}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={`${sort}-${order}`}
                  onChange={(e) => {
                    const [s, o] = e.target.value.split('-');
                    setSort(s);
                    setOrder(o);
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="id-ASC">Default</option>
                  <option value="price_per_km-ASC">Price: Low → High</option>
                  <option value="price_per_km-DESC">Price: High → Low</option>
                  <option value="seating_capacity-ASC">Seats: Low → High</option>
                  <option value="seating_capacity-DESC">Seats: High → Low</option>
                  <option value="name-ASC">Name: A → Z</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Panel */}
            {sidebarOpen && (
              <div className="lg:hidden mb-6">
                <FilterPanel />
              </div>
            )}

            {/* Vehicle Grid */}
            {loading ? (
              <Loading message="Loading vehicles..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchVehicles} />
            ) : vehicles.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No vehicles found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
                <button onClick={clearFilters} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {vehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
