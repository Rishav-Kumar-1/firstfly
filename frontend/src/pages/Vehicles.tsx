// Vehicles.tsx — Full vehicle listing page (built in Phase 4)
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Vehicles() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚌</div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicles Page</h1>
          <p className="text-gray-500 mt-2">Coming in Phase 4 — Vehicle Module</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
