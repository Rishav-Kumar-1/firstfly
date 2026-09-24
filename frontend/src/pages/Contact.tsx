// Contact.tsx — Contact & Enquiry page — saves to database
import { useState } from 'react';
import { enquiryAPI } from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await enquiryAPI.submit(form);
      setSubmitted(true);
    } catch {
      setError('Failed to send message. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'Inter,system-ui,sans-serif' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', color: '#fff', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, marginBottom: 10 }}>Contact Us</h1>
        <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '1.05rem' }}>We're here to help. Reach out anytime.</p>
      </section>

      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '2.5rem' }}>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#111827', marginBottom: 24 }}>Get In Touch</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: '📞', title: 'Phone / WhatsApp', lines: ['+91 98771 24650'] },
                { icon: '✉️', title: 'Email',            lines: ['hsingh67243@gmail.com'] },
                { icon: '🕐', title: 'Support Hours',    lines: ['24 × 7 — All Days', 'Including holidays'] },
                { icon: '📍', title: 'Location',         lines: ['India'] },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, background: '#eff6ff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{item.title}</p>
                    {item.lines.map((l, i) => l && (
                      <p key={i} style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 2 }}>{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <a href="tel:+919877124650"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', padding: '11px 20px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                📞 Call Now
              </a>
              <a href="https://wa.me/919877124650"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#16a34a', color: '#fff', padding: '11px 20px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem' }}>
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#111827', marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: '#6b7280', marginBottom: 20 }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  style={{ color: '#2563eb', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#111827', marginBottom: 22 }}>Send us a Message</h2>
                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: '0.85rem' }}>
                    ⚠️ {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={LBL}>Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" style={INP} />
                    </div>
                    <div>
                      <label style={LBL}>Phone *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98771 24650" style={INP} />
                    </div>
                  </div>
                  <div>
                    <label style={LBL}>Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" style={INP} />
                  </div>
                  <div>
                    <label style={LBL}>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} style={INP}>
                      <option value="">Select subject</option>
                      <option value="booking">Booking Enquiry</option>
                      <option value="vehicle">Vehicle Query</option>
                      <option value="package">Package Query</option>
                      <option value="cancellation">Cancellation / Refund</option>
                      <option value="complaint">Complaint</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={LBL}>Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                      placeholder="Tell us how we can help you..."
                      style={{ ...INP, resize: 'none' } as React.CSSProperties} />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ background: loading ? '#9ca3af' : '#2563eb', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {loading ? (
                      <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style> Sending...</>
                    ) : 'Send Message →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const LBL: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 };
const INP: React.CSSProperties = { width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: '0.9rem', color: '#111827', background: '#fff', outline: 'none', fontFamily: 'Inter,system-ui,sans-serif' };
