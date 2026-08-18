// Home.tsx — The main homepage
// Contains: Hero, Popular Vehicles, Tour Packages, Why Choose Us,
//           How It Works, Testimonials, FAQ, Stats

import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import VehicleCard from '../components/VehicleCard';
import PackageCard from '../components/PackageCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { Vehicle, TourPackage } from '../types';

// ─────────────────────────────────────────────
// DEMO DATA — Will be replaced with real API data in Phase 9
// ─────────────────────────────────────────────
const DEMO_VEHICLES: Vehicle[] = [
  {
    id: 1, name: '9 Seater Traveller', vehicle_type: 'Traveller',
    registration_number: 'DL01AB1234', seating_capacity: 9,
    price_per_km: 18, driver_charge: 2000, ac: true,
    pushback_seats: false, music_system: true, luggage_capacity: 'Medium',
    description: 'Perfect for small family trips and group outings.',
    image_url: 'https://placehold.co/400x250/dbeafe/1e40af?text=9+Seater',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 2, name: '12 Seater Traveller', vehicle_type: 'Traveller',
    registration_number: 'DL02CD5678', seating_capacity: 12,
    price_per_km: 22, driver_charge: 2200, ac: true,
    pushback_seats: true, music_system: true, luggage_capacity: 'Large',
    description: 'Comfortable traveller with pushback seats for long journeys.',
    image_url: 'https://placehold.co/400x250/dbeafe/1e40af?text=12+Seater',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 3, name: '16 Seater Traveller', vehicle_type: 'Traveller',
    registration_number: 'DL03EF9012', seating_capacity: 16,
    price_per_km: 26, driver_charge: 2500, ac: true,
    pushback_seats: true, music_system: true, luggage_capacity: 'Large',
    description: 'Ideal for medium-sized groups and corporate events.',
    image_url: 'https://placehold.co/400x250/dbeafe/1e40af?text=16+Seater',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 4, name: 'Toyota Innova Crysta', vehicle_type: 'SUV',
    registration_number: 'DL04GH3456', seating_capacity: 7,
    price_per_km: 16, driver_charge: 1800, ac: true,
    pushback_seats: false, music_system: true, luggage_capacity: 'Medium',
    description: 'Premium SUV — perfect for family and business travel.',
    image_url: 'https://placehold.co/400x250/dcfce7/166534?text=Innova+Crysta',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 5, name: '20 Seater Traveller', vehicle_type: 'Traveller',
    registration_number: 'DL05IJ7890', seating_capacity: 20,
    price_per_km: 30, driver_charge: 2800, ac: true,
    pushback_seats: true, music_system: true, luggage_capacity: 'Extra Large',
    description: 'Spacious traveller for large group tours and pilgrimages.',
    image_url: 'https://placehold.co/400x250/dbeafe/1e40af?text=20+Seater',
    status: 'AVAILABLE', created_at: '',
  },
  {
    id: 6, name: 'Sedan (Dzire / Etios)', vehicle_type: 'Sedan',
    registration_number: 'DL06KL1234', seating_capacity: 4,
    price_per_km: 12, driver_charge: 1500, ac: true,
    pushback_seats: false, music_system: true, luggage_capacity: 'Small',
    description: 'Comfortable sedan for solo or couple travel.',
    image_url: 'https://placehold.co/400x250/fef9c3/854d0e?text=Sedan',
    status: 'AVAILABLE', created_at: '',
  },
];

const DEMO_PACKAGES: TourPackage[] = [
  {
    id: 1, destination_id: 1, destination_name: 'Himachal Pradesh',
    name: 'Manali Adventure Tour', duration_days: 5, duration_nights: 4,
    starting_price: 12000, description: 'Experience the magic of snow-capped mountains, Rohtang Pass and Solang Valley.',
    image_url: 'https://placehold.co/400x250/dbeafe/1e40af?text=Manali',
    status: 'ACTIVE', highlights: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple'],
  },
  {
    id: 2, destination_id: 2, destination_name: 'Himachal Pradesh',
    name: 'Shimla Heritage Tour', duration_days: 4, duration_nights: 3,
    starting_price: 9500, description: 'Explore the colonial charm of Shimla — the Queen of Hills.',
    image_url: 'https://placehold.co/400x250/dcfce7/166534?text=Shimla',
    status: 'ACTIVE', highlights: ['Mall Road', 'Christ Church', 'Jakhu Temple'],
  },
  {
    id: 3, destination_id: 3, destination_name: 'Uttarakhand',
    name: 'Rishikesh Spiritual Tour', duration_days: 3, duration_nights: 2,
    starting_price: 6500, description: 'Discover the yoga capital of the world — Ganga aarti and river rafting awaits.',
    image_url: 'https://placehold.co/400x250/fef9c3/854d0e?text=Rishikesh',
    status: 'ACTIVE', highlights: ['River Rafting', 'Ganga Aarti', 'Laxman Jhula'],
  },
  {
    id: 4, destination_id: 4, destination_name: 'Rajasthan',
    name: 'Jaipur Royal Tour', duration_days: 3, duration_nights: 2,
    starting_price: 7500, description: 'Walk through the Pink City — palaces, forts and Rajasthani culture.',
    image_url: 'https://placehold.co/400x250/fce7f3/9d174d?text=Jaipur',
    status: 'ACTIVE', highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace'],
  },
];

// ─────────────────────────────────────────────
// FAQ DATA
// ─────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'How can I book a vehicle?',
    a: 'Use the search form above to enter your trip details. Browse available vehicles, click "Book Now", fill in your details and confirm your booking. You will receive a confirmation with your booking reference.',
  },
  {
    q: 'Is a driver included in the booking?',
    a: 'Yes! All our vehicles come with experienced, verified drivers. A driver charge is included in your fare calculation. You do not need to arrange a driver separately.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI, net banking, credit/debit cards and cash. Online payment options will be available soon. For now, you can confirm the booking and pay on arrival.',
  },
  {
    q: 'Can I cancel my booking?',
    a: 'Yes. You can cancel from your dashboard. Cancellations made 24 hours before the trip are eligible for a full refund. Cancellations within 24 hours may attract a cancellation fee.',
  },
  {
    q: 'Are toll charges and parking included?',
    a: 'Toll and parking charges are estimated based on the route and are added to your fare. Any difference in actual tolls will be settled directly with the driver.',
  },
  {
    q: 'Can I book for multiple days?',
    a: 'Absolutely. Select "Multi Day" or "Round Trip" in the trip type. Enter your travel and return dates and our system will calculate the fare accordingly.',
  },
];

// ─────────────────────────────────────────────
// FAQ ITEM — collapsible
// ─────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-800">{q}</span>
        <span className={`text-blue-600 text-xl transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN HOME COMPONENT
// ─────────────────────────────────────────────
export default function Home() {
  return (
    <>
    <Navbar />
    <main>
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="text-center mb-10">
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              🚌 India's Trusted Travel Vehicle Booking Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
              Travel Together.{' '}
              <span className="text-yellow-400">Travel Better.</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Book comfortable vehicles for family trips, corporate travel, weddings and group tours.
              Verified drivers. Transparent pricing. 24/7 support.
            </p>
            {/* Stats strip */}
            <div className="flex flex-wrap justify-center gap-8 mb-10 text-center">
              {[
                { value: '5,000+', label: 'Happy Customers' },
                { value: '150+', label: 'Verified Vehicles' },
                { value: '50+', label: 'Destinations' },
                { value: '4.8★', label: 'Average Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-yellow-400">{s.value}</p>
                  <p className="text-blue-200 text-sm">{s.label}</p>
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
          POPULAR VEHICLES
      ══════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Fleet</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Popular Vehicles</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Choose from our wide range of well-maintained, air-conditioned vehicles for every group size.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_VEHICLES.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/vehicles"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              View All Vehicles →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TOUR PACKAGES
      ══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Curated Packages</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Popular Tour Packages</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Handpicked itineraries for the most loved destinations across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/packages"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              View All Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Why Choose TravelGo?</h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              We go beyond just providing a vehicle — we deliver a complete travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🚌',
                title: 'Verified Vehicles',
                desc: 'Every vehicle is inspected, insured and maintained to the highest standards before every trip.',
              },
              {
                icon: '👨‍✈️',
                title: 'Experienced Drivers',
                desc: 'All our drivers are background-verified with years of experience on intercity and mountain routes.',
              },
              {
                icon: '💰',
                title: 'Transparent Pricing',
                desc: 'No hidden charges. See the complete fare breakdown — base fare, driver charge, tolls — before you book.',
              },
              {
                icon: '🕐',
                title: '24/7 Support',
                desc: 'Our customer support team is available round the clock via phone and WhatsApp for any assistance.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Simple & Fast</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">How It Works</h2>
            <p className="text-gray-500 mt-3">Book your vehicle in 5 easy steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
            {[
              { step: '1', icon: '🔍', title: 'Search Vehicle', desc: 'Enter your trip details' },
              { step: '→', icon: '', title: '', desc: '' },
              { step: '2', icon: '🚌', title: 'Select Vehicle', desc: 'Compare and choose' },
              { step: '→', icon: '', title: '', desc: '' },
              { step: '3', icon: '📝', title: 'Enter Details', desc: 'Fill trip information' },
            ].map((item, i) =>
              item.icon ? (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl mx-auto mb-3 shadow-lg shadow-blue-200">
                    {item.icon}
                  </div>
                  <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              ) : (
                <div key={i} className="hidden sm:flex justify-center text-gray-300 text-3xl">→</div>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center mt-6">
            {[
              { step: '4', icon: '✅', title: 'Confirm Booking', desc: 'Review and pay' },
              { step: '→', icon: '', title: '', desc: '' },
              { step: '5', icon: '🎉', title: 'Enjoy Journey', desc: 'We handle the rest' },
              { step: '', icon: '', title: '', desc: '' },
              { step: '', icon: '', title: '', desc: '' },
            ].map((item, i) =>
              item.icon ? (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl mx-auto mb-3 shadow-lg shadow-blue-200">
                    {item.icon}
                  </div>
                  <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              ) : item.step === '→' ? (
                <div key={i} className="hidden sm:flex justify-center text-gray-300 text-3xl">→</div>
              ) : (
                <div key={i}></div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          POPULAR DESTINATIONS
      ══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Top Picks</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Popular Destinations</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Manali', state: 'Himachal Pradesh', emoji: '🏔️', color: 'from-blue-500 to-indigo-600' },
              { name: 'Shimla', state: 'Himachal Pradesh', emoji: '🌲', color: 'from-green-500 to-teal-600' },
              { name: 'Rishikesh', state: 'Uttarakhand', emoji: '🕉️', color: 'from-orange-500 to-amber-600' },
              { name: 'Jaipur', state: 'Rajasthan', emoji: '🏯', color: 'from-pink-500 to-rose-600' },
              { name: 'Agra', state: 'Uttar Pradesh', emoji: '🕌', color: 'from-purple-500 to-violet-600' },
              { name: 'Kashmir', state: 'J&K', emoji: '❄️', color: 'from-cyan-500 to-blue-600' },
              { name: 'Mussoorie', state: 'Uttarakhand', emoji: '🌫️', color: 'from-slate-500 to-gray-600' },
              { name: 'Rajasthan', state: 'Desert Tour', emoji: '🐪', color: 'from-yellow-500 to-orange-600' },
            ].map((dest) => (
              <Link
                key={dest.name}
                to={`/destinations`}
                className={`relative bg-gradient-to-br ${dest.color} rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md`}
              >
                <div className="text-3xl mb-2">{dest.emoji}</div>
                <h3 className="font-bold text-lg">{dest.name}</h3>
                <p className="text-white/80 text-xs">{dest.state}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Customer Stories</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rahul Sharma',
                trip: 'Delhi → Manali',
                rating: 5,
                review: 'Excellent service! The 12 seater traveller was spotless and the driver was very professional. Our Manali trip was absolutely amazing. Highly recommend TravelGo!',
                avatar: 'RS',
              },
              {
                name: 'Priya Patel',
                trip: 'Jaipur → Agra',
                rating: 5,
                review: 'Booked an Innova Crysta for a family trip. Very smooth booking process. The vehicle was well-maintained and the driver knew all the routes perfectly.',
                avatar: 'PP',
              },
              {
                name: 'Amit Singh',
                trip: 'Delhi → Rishikesh',
                rating: 4,
                review: 'Great experience overall. Pricing was very transparent — no hidden charges. Will definitely use TravelGo again for our next group trip.',
                avatar: 'AS',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-gray-400 text-xs">📍 {t.trip}</p>
                  </div>
                  <div className="ml-auto text-yellow-400">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Plan Your Trip?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of happy travellers. Book your vehicle in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vehicles"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse Vehicles
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
