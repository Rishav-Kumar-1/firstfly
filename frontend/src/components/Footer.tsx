// Footer.tsx — Professional footer

import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl" style={{fontFamily:'Poppins,sans-serif'}}>T</span>
              </div>
              <span className="text-white font-black text-2xl" style={{fontFamily:'Poppins,sans-serif'}}>TravelGo</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              India's trusted platform for booking comfortable group travel vehicles.
              Verified drivers. Transparent pricing. Memorable journeys.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: 'f', title: 'Facebook' },
                { label: 'in', title: 'Instagram' },
                { label: '▶', title: 'YouTube' },
                { label: 'tw', title: 'Twitter' },
              ].map(s => (
                <a key={s.title} href="#" title={s.title}
                  className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white transition-all duration-200">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home',           to: '/' },
                { label: 'Our Vehicles',   to: '/vehicles' },
                { label: 'Tour Packages',  to: '/packages' },
                { label: 'Destinations',   to: '/destinations' },
                { label: 'About Us',       to: '/about' },
                { label: 'Contact',        to: '/contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <span className="text-blue-500 text-xs">▸</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicles */}
          <div>
            <h3 className="text-white font-bold text-base mb-5">Our Fleet</h3>
            <ul className="space-y-3">
              {[
                '9 Seater Traveller',
                '12 Seater Traveller',
                '16 Seater Traveller',
                '20 Seater Traveller',
                'Luxury Tempo Traveller',
                'Innova Crysta',
                'Sedan / Dzire',
              ].map(v => (
                <li key={v}>
                  <Link to="/vehicles" className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <span className="text-blue-500 text-xs">▸</span> {v}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-5">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg mt-0.5">📞</span>
                <div>
                  <p className="text-white font-semibold text-sm">Phone / WhatsApp</p>
                  <p className="text-gray-500 mt-0.5">+91 98765 43210</p>
                  <p className="text-gray-500">+91 98765 43211</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg mt-0.5">✉️</span>
                <div>
                  <p className="text-white font-semibold text-sm">Email</p>
                  <p className="text-gray-500 mt-0.5">info@travelgo.in</p>
                  <p className="text-gray-500">support@travelgo.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg mt-0.5">🕐</span>
                <div>
                  <p className="text-white font-semibold text-sm">Support Hours</p>
                  <p className="text-gray-500 mt-0.5">24 × 7, All Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {year} TravelGo. All rights reserved. Made with ❤️ in India</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map(item => (
              <a key={item} href="#" className="hover:text-gray-400 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
