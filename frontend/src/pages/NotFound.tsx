import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-8xl font-extrabold text-blue-100 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
