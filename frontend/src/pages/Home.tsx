// Home.tsx — TravelGo Homepage — Professional redesign

import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { Vehicle, TourPackage } from '../types';

// ─────────────────────────────────────────────
// Real Unsplash vehicle images (free, no auth needed)
// ─────────────────────────────────────────────
const DEMO_VEHICLES: Vehicle[] = [
  {
    id: 1, name: '9 Seater Traveller', vehicle_type: 'Traveller',
    registration_number: 'DL01AB1234', seating_capacity: 9,
    price_per_km: 18, driver_charge: 2000, ac: true,
    pushback_seats: false, music_system: true, luggage_capacity: 'Medium',
    description: 'Perfect for small family trips and group outings.',
    image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 2, name: '12 Seater Traveller', vehicle_type: 'Traveller',
    registration_number: 'DL02CD5678', seating_capacity: 12,
    price_per_km: 22, driver_charge: 2200, ac: true,
    pushback_seats: true, music_system: true, luggage_capacity: 'Large',
    description: 'Comfortable traveller with pushback seats for long journeys.',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 3, name: '16 Seater Traveller', vehicle_type: 'Traveller',
    registration_number: 'DL03EF9012', seating_capacity: 16,
    price_per_km: 26, driver_charge: 2500, ac: true,
    pushback_seats: true, music_system: true, luggage_capacity: 'Large',
    description: 'Ideal for medium-sized groups and corporate events.',
    image_url: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=600&q=80',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 4, name: 'Toyota Innova Crysta', vehicle_type: 'SUV',
    registration_number: 'DL04GH3456', seating_capacity: 7,
    price_per_km: 16, driver_charge: 1800, ac: true,
    pushback_seats: false, music_system: true, luggage_capacity: 'Medium',
    description: 'Premium SUV — perfect for family and business travel.',
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 5, name: 'Luxury Tempo Traveller', vehicle_type: 'Tempo',
    registration_number: 'DL05IJ7890', seating_capacity: 14,
    price_per_km: 28, driver_charge: 2600, ac: true,
    pushback_seats: true, music_system: true, luggage_capacity: 'Extra Large',
    description: 'Premium tempo with reclining seats, LED lights & charging ports.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 6, name: 'Sedan (Swift Dzire)', vehicle_type: 'Sedan',
    registration_number: 'DL06KL1234', seating_capacity: 4,
    price_per_km: 12, driver_charge: 1500, ac: true,
    pushback_seats: false, music_system: true, luggage_capacity: 'Small',
    description: 'Comfortable sedan for solo or couple travel.',
    image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80',
    status: 'AVAILABLE', created_at: '',
  },
];

const DEMO_PACKAGES: TourPackage[] = [
  {
    id: 1, destination_id: 1, destination_name: 'Himachal Pradesh',
    name: 'Manali Adventure Tour', duration_days: 5, duration_nights: 4,
    starting_price: 12000,
    description: 'Snow-capped mountains, Rohtang Pass and Solang Valley.',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    status: 'ACTIVE', highlights: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple'],
  },
  {
    id: 2, destination_id: 2, destination_name: 'Himachal Pradesh',
    name: 'Shimla Heritage Tour', duration_days: 4, duration_nights: 3,
    starting_price: 9500,
    description: 'Colonial charm, Mall Road and panoramic mountain views.',
    image_url: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=80',
    status: 'ACTIVE', highlights: ['Mall Road', 'Christ Church', 'Jakhu Temple'],
  },
  {
    id: 3, destination_id: 3, destination_name: 'Uttarakhand',
    name: 'Rishikesh Spiritual Tour', duration_days: 3, duration_nights: 2,
    starting_price: 6500,
    description: 'Yoga capital of the world — Ganga aarti and river rafting.',
    image_url: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=600&q=80',
    status: 'ACTIVE', highlights: ['River Rafting', 'Ganga Aarti', 'Laxman Jhula'],
  },
  {
    id: 4, destination_id: 4, destination_name: 'Rajasthan',
    name: 'Jaipur Royal Tour', duration_days: 3, duration_nights: 2,
    starting_price: 7500,
    description: 'The Pink City — palaces, forts and Rajasthani culture.',
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    status: 'ACTIVE', highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace'],
  },
];

const FAQ_ITEMS = [
  { q: 'How can I book a vehicle?', a: 'Use the search form to enter your trip details, browse available vehicles, click "Book Now", fill in your details and confirm. You\'ll receive a confirmation with your booking reference.' },
  { q: 'Is a driver included in the booking?', a: 'Yes! All our vehicles come with experienced, verified drivers. A driver charge is included in your fare. No need to arrange a driver separately.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, net banking, credit/debit cards and cash. Online payment options are available during checkout.' },
  { q: 'Can I cancel my booking?', a: 'Yes. Cancellations made 24 hours before the trip are eligible for a full refund. Cancellations within 24 hours may attract a small cancellation fee.' },
  { q: 'Are toll charges and parking included?', a: 'Toll and parking charges are estimated based on the route and added to your fare. Any difference in actual tolls will be settled directly with the driver.' },
  { q: 'Can I book for multiple days?', a: 'Absolutely. Select "Multi Day" or "Round Trip" as trip type, enter your travel and return dates and our system calculates the fare accordingly.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-base pr-4">{q}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-blue-50/30 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Vehicle Card (inline for homepage) ──
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group card-hover">
      <div className="relative overflow-hidden h-52">
        <img
          src={vehicle.image_url}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {vehicle.ac && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">❄️ AC</span>
        )}
        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Available</span>
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-bold text-lg leading-tight drop-shadow">{vehicle.name}</p>
          <p className="text-white/80 text-xs">👥 {vehicle.seating_capacity} Seats</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {vehicle.ac && <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">AC</span>}
          {vehicle.pushback_seats && <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-semibold">Pushback</span>}
          {vehicle.music_system && <span className="bg-pink-50 text-pink-700 text-xs px-2.5 py-1 rounded-full font-semibold">🎵 Music</span>}
          <span className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-full font-semibold">🧳 {vehicle.luggage_capacity}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-extrabold text-blue-600">₹{vehicle.price_per_km}</span>
            <span className="text-gray-400 text-xs ml-1">/km</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/vehicles/${vehicle.id}`} className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors">Details</Link>
            <Link to={`/booking?vehicle=${vehicle.id}`} className="text-xs font-bold bg-orange-500 text-white px-3 py-2 rounded-xl hover:bg-orange-600 transition-colors shadow-sm">Book Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Package Card (inline for homepage) ──
function PackageCard({ pkg }: { pkg: TourPackage }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group card-hover">
      <div className="relative overflow-hidden h-56">
        <img
          src={pkg.image_url}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-1">📍 {pkg.destination_name}</p>
          <h3 className="font-bold text-lg leading-tight">{pkg.name}</h3>
          <span className="inline-block mt-1 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">{pkg.duration_days}D / {pkg.duration_nights}N</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>
        {pkg.highlights && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pkg.highlights.slice(0, 3).map((h, i) => (
              <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium">✓ {h}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
            <span className="text-xl font-extrabold text-blue-600">₹{pkg.starting_price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/packages/${pkg.id}`} className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors">View</Link>
            <Link to={`/booking?package=${pkg.id}`} className="text-xs font-bold bg-orange-500 text-white px-3 py-2 rounded-xl hover:bg-orange-600 transition-colors shadow-sm">Book</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Travel background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-blue-900/60 to-indigo-900/80" />
        </div>

        {/* Decorative blurs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-5 py-2 rounded-full mb-7 shadow-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              India's Trusted Travel Vehicle Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05]" style={{fontFamily:'Poppins,sans-serif'}}>
              Travel Together.{' '}
              <span className="gradient-text">Travel Better.</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              Book verified vehicles for family trips, corporate travel, weddings and group tours.
              Transparent pricing. Experienced drivers. 24/7 support.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { value: '5,000+', label: 'Happy Customers' },
                { value: '150+',   label: 'Verified Vehicles' },
                { value: '50+',    label: 'Destinations' },
                { value: '4.8★',   label: 'Average Rating' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold text-yellow-400" style={{fontFamily:'Poppins,sans-serif'}}>{s.value}</p>
                  <p className="text-blue-300 text-xs mt-0.5 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {[
              { icon: '🛡️', text: 'Verified & Insured Vehicles' },
              { icon: '👨‍✈️', text: 'Background-Checked Drivers' },
              { icon: '💰', text: 'No Hidden Charges' },
              { icon: '🕐', text: '24/7 Customer Support' },
              { icon: '✅', text: 'Free Cancellation (24hrs)' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          POPULAR VEHICLES
      ══════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">Our Fleet</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Popular Vehicles</h2>
            <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">
              Choose from our wide range of well-maintained, air-conditioned vehicles for every group size.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {DEMO_VEHICLES.map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>

          <div className="text-center mt-12">
            <Link to="/vehicles" className="btn btn-primary text-base px-10 py-4 rounded-2xl shadow-xl">
              View All Vehicles →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TOUR PACKAGES
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">Curated Packages</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Popular Tour Packages</h2>
            <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">
              Handpicked itineraries for the most loved destinations across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>

          <div className="text-center mt-12">
            <Link to="/packages" className="btn btn-primary text-base px-10 py-4 rounded-2xl shadow-xl">
              View All Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Why TravelGo</span>
            <h2 className="text-4xl font-extrabold">The Smarter Way to Travel</h2>
            <p className="text-blue-200 mt-3 text-lg max-w-xl mx-auto">
              We go beyond just providing a vehicle — we deliver a complete travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚌', title: 'Verified Vehicles', desc: 'Every vehicle is inspected, insured and maintained to the highest standard before every trip.' },
              { icon: '👨‍✈️', title: 'Expert Drivers', desc: 'All drivers are background-verified with years of experience on intercity and mountain routes.' },
              { icon: '💰', title: 'Zero Hidden Costs', desc: 'See the complete fare breakdown — base, driver, tolls — before confirming. No surprises.' },
              { icon: '🕐', title: '24/7 Support', desc: 'Our customer support team is available round the clock via phone and WhatsApp.' },
            ].map(item => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:bg-white/20 transition-all duration-300">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-5">{item.icon}</div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-blue-100/80 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-label">Simple & Fast</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Book in 5 Easy Steps</h2>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-blue-100 mx-16" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { step: '1', icon: '🔍', title: 'Search',    desc: 'Enter your trip details' },
                { step: '2', icon: '🚌', title: 'Select',    desc: 'Compare and choose vehicle' },
                { step: '3', icon: '📝', title: 'Fill Info', desc: 'Enter passenger details' },
                { step: '4', icon: '✅', title: 'Confirm',   desc: 'Review price and pay' },
                { step: '5', icon: '🎉', title: 'Enjoy',     desc: 'Sit back and travel' },
              ].map(item => (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-lg shadow-blue-200 relative z-10">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-extrabold mb-3 border-2 border-blue-100">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
                  <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DESTINATIONS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">Top Picks</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Popular Destinations</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Manali',    state: 'Himachal Pradesh', emoji: '🏔️', color: 'from-blue-600 to-indigo-700',    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80' },
              { name: 'Shimla',    state: 'Himachal Pradesh', emoji: '🌲', color: 'from-green-600 to-teal-700',     img: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&q=80' },
              { name: 'Rishikesh', state: 'Uttarakhand',      emoji: '🕉️', color: 'from-orange-500 to-amber-600', img: 'https://images.unsplash.com/photo-1600100591316-fd4e5b5d2bf4?w=400&q=80' },
              { name: 'Jaipur',    state: 'Rajasthan',        emoji: '🏯', color: 'from-pink-600 to-rose-700',     img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
              { name: 'Agra',      state: 'Uttar Pradesh',    emoji: '🕌', color: 'from-purple-600 to-violet-700', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80' },
              { name: 'Kashmir',   state: 'J&K',              emoji: '❄️', color: 'from-cyan-600 to-blue-700',     img: 'https://images.unsplash.com/photo-1579531403068-8d9f8ffcc0c3?w=400&q=80' },
              { name: 'Mussoorie', state: 'Uttarakhand',      emoji: '🌫️', color: 'from-slate-600 to-gray-700',   img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
              { name: 'Varanasi',  state: 'Uttar Pradesh',    emoji: '🛕', color: 'from-yellow-500 to-orange-600', img: 'https://images.unsplash.com/photo-1561361058-c24e022a5f6d?w=400&q=80' },
            ].map((dest) => (
              <Link
                key={dest.name}
                to="/destinations"
                className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group block aspect-square sm:aspect-auto sm:h-44"
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=400&q=80'; }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-70 group-hover:opacity-60 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <span className="text-2xl mb-1">{dest.emoji}</span>
                  <h3 className="font-bold text-lg leading-tight">{dest.name}</h3>
                  <p className="text-white/80 text-xs">{dest.state}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/destinations" className="btn btn-primary px-8 py-3.5 rounded-2xl">
              Explore All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">Customer Stories</span>
            <h2 className="text-4xl font-extrabold text-gray-900">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              { name: 'Rahul Sharma', trip: 'Delhi → Manali', rating: 5, avatar: 'RS', color: 'bg-blue-600',
                review: 'Excellent service! The 12 seater traveller was spotless and the driver was very professional. Our Manali trip was absolutely amazing. Highly recommend TravelGo!' },
              { name: 'Priya Patel', trip: 'Jaipur → Agra', rating: 5, avatar: 'PP', color: 'bg-pink-600',
                review: 'Booked an Innova Crysta for a family trip. Very smooth booking process. The vehicle was well-maintained and driver knew all the routes perfectly.' },
              { name: 'Amit Singh', trip: 'Delhi → Rishikesh', rating: 5, avatar: 'AS', color: 'bg-indigo-600',
                review: 'Great experience overall. Pricing was completely transparent — no hidden charges at all. Will definitely use TravelGo again for our next group trip.' },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-base leading-relaxed mb-6 italic">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 ${t.color} text-white rounded-full flex items-center justify-center font-bold text-sm`}>{t.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-gray-400 text-xs">📍 {t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">Got Questions?</span>
            <h2 className="text-4xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80"
            alt="CTA background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">Ready to Plan Your Trip?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of happy travellers. Book your vehicle in minutes — no paperwork, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vehicles" className="btn btn-accent text-base px-10 py-4 rounded-2xl shadow-xl shadow-orange-500/30">
              Browse Vehicles
            </Link>
            <Link to="/contact" className="btn btn-outline text-white border-white text-base px-10 py-4 rounded-2xl hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
