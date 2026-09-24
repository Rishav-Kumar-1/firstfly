import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: '#0f172a', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xl"
                style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)', fontFamily: 'Poppins,sans-serif' }}>F</div>
              <span className="font-black text-xl text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>
                <span style={{ color: '#60a5fa' }}>FIRST</span><span style={{ color: '#fff' }}>FLY</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.875rem' }} className="mb-5">
              India's trusted platform for booking comfortable travel vehicles. Verified drivers.
              Transparent pricing. Memorable journeys.
            </p>
            <div className="flex gap-2">
              {['FB','IG','TW','YT'].map(s => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                  style={{ background: '#1e293b', color: '#94a3b8' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/vehicles', 'Vehicles'], ['/packages', 'Tour Packages'],
                ['/destinations', 'Destinations'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                    className="hover:text-white transition-colors flex items-center gap-2">
                    <span style={{ color: '#3b82f6' }}>›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fleet */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Our Fleet</h4>
            <ul className="space-y-2.5">
              {['9 Seater Traveller','12 Seater Traveller','16 Seater Traveller',
                '20 Seater Traveller','Luxury Tempo','Innova Crysta','Sedan / SUV'].map(v => (
                <li key={v}>
                  <Link to="/vehicles" style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                    className="hover:text-white transition-colors flex items-center gap-2">
                    <span style={{ color: '#3b82f6' }}>›</span> {v}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Contact Us</h4>
            <div className="space-y-4">
              {[
                { icon: '📞', title: 'Phone / WhatsApp', lines: ['+91 98771 24650'] },
                { icon: '✉️', title: 'Email', lines: ['hsingh67243@gmail.com'] },
                { icon: '🕐', title: 'Support', lines: ['24 × 7, All Days'] },
              ].map(c => (
                <div key={c.title} className="flex items-start gap-3">
                  <span className="text-lg">{c.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-xs">{c.title}</p>
                    {c.lines.map(l => <p key={l} style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ color: '#64748b', fontSize: '0.8rem' }}>
          <p>© {year} FIRSTFLY. All rights reserved. Made with ❤️ in India</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms', 'Cancellation'].map(t => (
              <a key={t} href="#" className="hover:text-gray-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
