// Footer.tsx
// The bottom section shown on every page.

import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Column 1: About ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-white font-bold text-xl">TravelGo</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for comfortable group travel. We connect you with 
              verified vehicles and experienced drivers for memorable journeys across India.
            </p>
            {/* Social Placeholders */}
            <div className="flex gap-3">
              {['FB', 'TW', 'IG', 'YT'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Vehicles', to: '/vehicles' },
                { label: 'Tour Packages', to: '/packages' },
                { label: 'Destinations', to: '/destinations' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="text-blue-500">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Vehicles ── */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Our Vehicles</h3>
            <ul className="space-y-2.5">
              {[
                '9 Seater Traveller',
                '12 Seater Traveller',
                '16 Seater Traveller',
                '20 Seater Traveller',
                'Sedan',
                'SUV / Innova',
              ].map((v) => (
                <li key={v}>
                  <Link
                    to="/vehicles"
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="text-blue-500">›</span> {v}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ── */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg">📞</span>
                <div>
                  <p className="text-white font-medium">Phone / WhatsApp</p>
                  <p>+91 98765 43210</p>
                  <p>+91 98765 43211</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg">✉️</span>
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p>info@travelgo.in</p>
                  <p>support@travelgo.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg">🕐</span>
                <div>
                  <p className="text-white font-medium">Support Hours</p>
                  <p>24 × 7 — All Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {currentYear} TravelGo. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
