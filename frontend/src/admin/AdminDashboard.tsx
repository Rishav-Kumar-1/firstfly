// AdminDashboard.tsx — Full admin panel

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, vehicleAPI, enquiryAPI } from '../services/api';
import Loading from '../components/Loading';

// ─────────────────────────────────────────────
// SIDEBAR NAV
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Dashboard',   icon: '📊' },
  { key: 'bookings',   label: 'Bookings',    icon: '📋' },
  { key: 'vehicles',   label: 'Vehicles',    icon: '🚌' },
  { key: 'customers',  label: 'Customers',   icon: '👥' },
  { key: 'enquiries',  label: 'Enquiries',   icon: '📩' },
];

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ label, value, icon, color, sub }: {
  label: string; value: string | number; icon: string; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-lg mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
const statusColors: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  ASSIGNED:  'bg-indigo-100 text-indigo-700',
  ONGOING:   'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  AVAILABLE: 'bg-green-100 text-green-700',
  UNAVAILABLE:'bg-red-100 text-red-700',
  MAINTENANCE:'bg-orange-100 text-orange-700',
  NEW:       'bg-blue-100 text-blue-700',
  READ:      'bg-gray-100 text-gray-600',
};

// ─────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────
export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vehicles, setVehicles] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customers, setCustomers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load data when tab changes
  useEffect(() => {
    setLoading(true);
    const loaders: Record<string, () => Promise<void>> = {
      dashboard: async () => {
        const r = await adminAPI.getDashboard();
        setStats(r.data.data);
      },
      bookings: async () => {
        const r = await adminAPI.getAllBookings();
        setBookings(r.data.data || []);
      },
      vehicles: async () => {
        const r = await vehicleAPI.getAll();
        setVehicles(r.data.data || []);
      },
      customers: async () => {
        const r = await adminAPI.getAllCustomers();
        setCustomers(r.data.data || []);
      },
      enquiries: async () => {
        const r = await (enquiryAPI.getAll ? enquiryAPI.getAll() : adminAPI.getAllEnquiries());
        setEnquiries(r.data.data || []);
      },
    };
    (loaders[activeTab] || loaders.dashboard)()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, booking_status: status } : b));
    } catch { alert('Failed to update status.'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Sidebar ──
  const Sidebar = () => (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
      transform transition-transform duration-300
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:relative lg:translate-x-0 lg:flex
    `}>
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">F</div>
          <div>
            <p className="font-bold text-white text-sm">FIRSTFLY</p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <button key={item.key}
            onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
            className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === item.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 mb-1">Logged in as</p>
        <p className="text-sm font-medium text-white">{user?.name}</p>
        <button onClick={handleLogout}
          className="mt-3 w-full text-left text-xs text-red-400 hover:text-red-300 flex items-center gap-2">
          🚪 Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-5 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-800">
            <span className="text-xl">☰</span>
          </button>
          <h1 className="font-bold text-gray-900 text-lg capitalize flex-1">
            {NAV_ITEMS.find(n => n.key === activeTab)?.icon} {' '}
            {NAV_ITEMS.find(n => n.key === activeTab)?.label || 'Dashboard'}
          </h1>
          <Link to="/" className="text-xs text-blue-600 hover:underline">View Site →</Link>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <Loading message="Loading..." />
          ) : (

            <>
              {/* ── DASHBOARD TAB ── */}
              {activeTab === 'dashboard' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard label="Total Bookings"    value={stats.stats.total_bookings}     icon="📋" color="bg-blue-500" />
                    <StatCard label="Today's Bookings"  value={stats.stats.today_bookings}     icon="📅" color="bg-indigo-500" />
                    <StatCard label="Pending"           value={stats.stats.pending_bookings}   icon="⏳" color="bg-yellow-500" />
                    <StatCard label="Confirmed"         value={stats.stats.confirmed_bookings} icon="✅" color="bg-green-500" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard label="Total Customers"   value={stats.stats.total_customers}    icon="👥" color="bg-purple-500" />
                    <StatCard label="Total Vehicles"    value={stats.stats.total_vehicles}     icon="🚌" color="bg-cyan-500" />
                    <StatCard label="New Enquiries"     value={stats.stats.new_enquiries}      icon="📩" color="bg-red-500" />
                    <StatCard label="Completed Trips"   value={stats.stats.completed_bookings || 0} icon="✅" color="bg-green-500" />
                  </div>

                  {/* Popular Vehicles */}
                  {stats.popular_vehicles?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-900 mb-4">Most Booked Vehicles</h3>
                      <div className="space-y-3">
                        {stats.popular_vehicles.map((v: { name: string; booking_count: number }, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{v.name}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(v.booking_count / (stats.popular_vehicles[0]?.booking_count || 1)) * 100}%` }} />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-6 text-right">{v.booking_count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── BOOKINGS TAB ── */}
              {activeTab === 'bookings' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">{bookings.length} booking(s)</p>
                    <button onClick={() => { setLoading(true); adminAPI.getAllBookings().then(r => setBookings(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); }}
                      className="text-xs text-blue-600 hover:underline">↻ Refresh</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Reference','Customer','Phone','Route','Date','Vehicle','Passengers','Status','Action'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {bookings.length === 0 ? (
                          <tr><td colSpan={9} className="text-center py-12 text-gray-400">No bookings yet</td></tr>
                        ) : bookings.map(b => (
                          <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-blue-600 whitespace-nowrap">{b.booking_reference}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{b.customer_name}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.customer_phone}</td>
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{b.from_location} → {b.to_location}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                              {new Date(b.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{b.vehicle_name}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{b.passengers}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[b.booking_status]}`}>
                                {b.booking_status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <select value={b.booking_status} onChange={e => handleBookingStatus(b.id, e.target.value)}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                                {['PENDING','CONFIRMED','ASSIGNED','ONGOING','COMPLETED','CANCELLED'].map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── VEHICLES TAB ── */}
              {activeTab === 'vehicles' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{vehicles.length} vehicle(s)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Vehicle','Type','Seats','AC','Status'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {vehicles.map(v => (
                          <tr key={v.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                            <td className="px-4 py-3 text-gray-500">{v.vehicle_type}</td>
                            <td className="px-4 py-3 text-gray-700">{v.seating_capacity}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium ${v.ac ? 'text-blue-600' : 'text-gray-400'}`}>
                                {v.ac ? '❄️ AC' : 'Non-AC'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[v.status]}`}>
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── CUSTOMERS TAB ── */}
              {activeTab === 'customers' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{customers.length} customer(s)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Name','Email','Phone','Bookings','Joined','Status'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {customers.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                            <td className="px-4 py-3 text-gray-500">{c.email}</td>
                            <td className="px-4 py-3 text-gray-700">{c.phone}</td>
                            <td className="px-4 py-3 text-center font-semibold text-gray-900">{c.total_bookings}</td>
                            <td className="px-4 py-3 text-gray-500">
                              {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {c.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── ENQUIRIES TAB ── */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{enquiries.length} enquiry(s)</p>
                    <button onClick={async () => { setLoading(true); try { const r = await (enquiryAPI.getAll ? enquiryAPI.getAll() : adminAPI.getAllEnquiries()); setEnquiries(r.data.data || []); } catch{} finally { setLoading(false); } }}
                      className="text-xs text-blue-600 hover:underline">↻ Refresh</button>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
                      <div className="text-5xl mb-3">📩</div>
                      <p className="font-semibold text-gray-700 mb-1">No enquiries yet</p>
                      <p className="text-sm text-gray-400">Customer messages from the Contact page will appear here.</p>
                    </div>
                  ) : enquiries.map(e => (
                    <div key={e.id} className={`bg-white rounded-2xl border p-5 ${e.status === 'NEW' ? 'border-blue-200 shadow-sm' : 'border-gray-100'}`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          {/* Header row */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {(e.name || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{e.name}</p>
                              <p className="text-xs text-gray-400">{e.email} • {e.phone}</p>
                            </div>
                            <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${e.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                              {e.status === 'NEW' ? '🔵 New' : '✓ Read'}
                            </span>
                          </div>

                          {/* Subject */}
                          {e.subject && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Subject:</span>
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">{e.subject}</span>
                            </div>
                          )}

                          {/* Message */}
                          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{e.message}</p>

                          {/* Quick reply links */}
                          <div className="flex gap-3 mt-3 flex-wrap">
                            <a href={`tel:${e.phone}`}
                              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700">
                              📞 Call
                            </a>
                            <a href={`mailto:${e.email}?subject=Re: ${e.subject || 'Your Enquiry'}&body=Hi ${e.name},%0A%0AThank you for contacting FIRSTFLY.%0A%0A`}
                              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800">
                              ✉️ Reply Email
                            </a>
                            {e.phone && (
                              <a href={`https://wa.me/91${e.phone.replace(/\D/g,'')}?text=Hi ${e.name}, thank you for contacting FIRSTFLY. `}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700">
                                💬 WhatsApp
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Date + time */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">
                            {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(e.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
