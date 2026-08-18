// About.tsx — About TravelGo page
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">About TravelGo</h1>
            <p className="text-blue-100 text-lg">
              We are passionate about making group travel comfortable, affordable and stress-free for everyone.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              TravelGo was founded with a simple mission — to make group travel in India as easy as booking a flight ticket. 
              We noticed that finding reliable, comfortable and fairly priced vehicles for family trips, 
              corporate travel and group tours was a frustrating experience.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              So we built a platform where customers get verified vehicles, experienced drivers, 
              transparent pricing and round-the-clock support — all in one place.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: '🤝', title: 'Trust', desc: 'Every vehicle and driver on our platform is verified and background-checked.' },
                { icon: '💡', title: 'Transparency', desc: 'We believe in honest pricing. What you see is what you pay — no surprises.' },
                { icon: '❤️', title: 'Customer First', desc: 'Your safety and comfort is our highest priority on every journey.' },
              ].map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="text-4xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-blue-600 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to travel with us?</h2>
          <Link to="/vehicles" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
            Browse Vehicles
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
