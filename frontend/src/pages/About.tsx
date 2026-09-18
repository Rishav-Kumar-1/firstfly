// About.tsx — About TravelGo page
// NOTE: Navbar and Footer are provided by PublicLayout in App.tsx — do NOT add them here
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', color: '#fff', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: 16 }}>About TravelGo</h1>
          <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            We are passionate about making group travel comfortable, affordable and stress-free for everyone.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#111827', marginBottom: 24 }}>Our Story</h2>
          <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: 16 }}>
            TravelGo was founded with a simple mission — to make group travel in India as easy as booking a flight ticket.
            We noticed that finding reliable, comfortable and fairly priced vehicles for family trips,
            corporate travel and group tours was a frustrating experience.
          </p>
          <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1.05rem' }}>
            So we built a platform where customers get verified vehicles, experienced drivers,
            transparent pricing and round-the-clock support — all in one place.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '5rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: 40 }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🤝', title: 'Trust',          desc: 'Every vehicle and driver on our platform is verified and background-checked before joining our fleet.' },
              { icon: '💡', title: 'Transparency',    desc: 'We believe in honest pricing. What you see is what you pay — no hidden charges, ever.' },
              { icon: '❤️', title: 'Customer First',  desc: 'Your safety and comfort is our highest priority on every journey, every time.' },
              { icon: '🚌', title: 'Quality Fleet',   desc: 'We maintain our vehicles to the highest standards so every trip is smooth and comfortable.' },
            ].map(v => (
              <div key={v.title} style={{ background: '#fff', borderRadius: 20, padding: '2rem', textAlign: 'center', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 1.5rem', background: '#2563eb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { value: '5,000+', label: 'Happy Customers' },
            { value: '150+',   label: 'Verified Vehicles' },
            { value: '50+',    label: 'Destinations' },
            { value: '8+',     label: 'Years Experience' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '2rem', fontWeight: 900, color: '#fbbf24' }}>{s.value}</p>
              <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '0.875rem', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Contact */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Get In Touch</h2>
          <p style={{ color: '#6b7280', marginBottom: 30, fontSize: '1rem', lineHeight: 1.7 }}>
            Have questions? We're always here to help you plan your perfect trip.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: 30 }}>
            <a href="tel:+919877124650" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#eff6ff', color: '#2563eb', padding: '12px 22px', borderRadius: 14, fontWeight: 700, fontSize: '0.95rem', border: '1px solid #bfdbfe' }}>
              📞 +91 98771 24650
            </a>
            <a href="mailto:hsingh67243@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#eff6ff', color: '#2563eb', padding: '12px 22px', borderRadius: 14, fontWeight: 700, fontSize: '0.95rem', border: '1px solid #bfdbfe' }}>
              ✉️ hsingh67243@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: 20 }}>Ready to travel with us?</h2>
        <Link to="/vehicles"
          style={{ display: 'inline-block', background: '#f97316', color: '#fff', padding: '14px 36px', borderRadius: 14, fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}>
          Browse Vehicles
        </Link>
      </section>
    </main>
  );
}
