"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const API = "https://caps-backend-production-a67c.up.railway.app";

// Sidebar Component (unchanged as requested)
function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      router.replace('/login');
    }
  };

  const navButtonClass = (path) =>
    `flex items-center w-full px-5 py-4 mb-3 rounded-lg text-base font-medium transition-all duration-300 cursor-pointer ${
      pathname === `/${path}`
        ? 'text-white bg-red-800 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white before:rounded-r'
        : 'text-gray-700 hover:bg-red-800 hover:text-white hover:translate-x-1 active:translate-x-1 active:scale-98'
    }`;

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-100 border-r-4 border-red-800 shadow-lg z-50 flex flex-col py-5 transition-transform duration-300 ease-in-out">
      <div className="px-5 pb-8 border-b-2 border-gray-300 mb-5">
        <h1 className="text-2xl font-bold text-red-800 text-center">
          Otto Bright POS
        </h1>
      </div>
      <nav className="flex-1 flex flex-col px-3">
        <button onClick={() => router.push('/pos')} className={navButtonClass('pos')}>
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          Checkout
        </button>
        <button onClick={() => router.push('/appointments')} className={navButtonClass('appointments')}>
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V8a2 2 0 00-2-2H6a2 2 0 00-2 2v1m16 0v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9m16 0H4" />
          </svg>
          Appointments
        </button>
        <button onClick={() => router.push('/transactions')} className={navButtonClass('transactions')}>
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Transactions
        </button>
        <button onClick={() => router.push('/analytics')} className={navButtonClass('analytics')}>
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </button>
      </nav>
      <div className="mt-auto px-3 pt-5 border-t-2 border-gray-300">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-5 py-4 rounded-lg text-base font-semibold text-white bg-red-800 hover:bg-red-900 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [upcoming, setUpcoming] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [showModal, setShowModal] = useState(false);

  // fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const resUpcoming = await fetch(`${API}/getAllUpcomingAppointments`);
      const resHistory = await fetch(`${API}/getAllHistoryAppointments`);
      const upcomingData = await resUpcoming.json();
      const historyData = await resHistory.json();
      setUpcoming(upcomingData.upcoming_appointments || []);
      setHistory(historyData.history_appointments || []);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const completeAppointment = async (id) => {
    if (!confirm("Mark this appointment as completed?")) return;
    try {
      await fetch(`${API}/updateAppointmentStatus/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchAppointments();
      alert("✅ Appointment completed");
    } catch (err) {
      console.error("Error completing appointment", err);
      alert("❌ Failed to complete appointment");
    }
  };

  const cancelAppointment = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await fetch(`${API}/cancelAppointment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchAppointments();
      alert("❌ Appointment cancelled");
    } catch (err) {
      console.error("Error cancelling appointment", err);
      alert("❌ Failed to cancel appointment");
    }
  };

  const openReceipt = (appt) => {
    setSelectedAppt(appt);
    setShowModal(true);
  };

  const closeReceipt = () => {
    setSelectedAppt(null);
    setCustomerName("");
    setShowModal(false);
  };

  const printReceipt = () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    if (!selectedAppt) return;

    const receiptHtml = `
      <div style="font-family: Arial; padding: 20px; max-width: 400px;">
        <h2 style="text-align:center; color:#dc3545;">OTTO <span style="color:#ffc107;">BRIGHT</span></h2>
        <h3 style="text-align:center;">Service Receipt</h3>
        <p><b>Customer:</b> ${customerName}</p>
        <p><b>Service:</b> ${selectedAppt.service_name}</p>
        <p><b>Date:</b> ${selectedAppt.date}</p>
        <p><b>Time:</b> ${selectedAppt.time}</p>
        <p><b>Vehicle:</b> ${selectedAppt.vehicleBrand || ""} ${selectedAppt.vehicleModel || ""} (${selectedAppt.vehicleColor || ""})</p>
        <p><b>Total:</b> ₱${selectedAppt.price || "N/A"}</p>
        <hr/>
        <p style="text-align:center; color:#dc3545;">Thank you for your business!</p>
      </div>
    `;

    const w = window.open("", "_blank", "width=500,height=600");
    w.document.write(receiptHtml);
    w.document.close();
    w.focus();
    w.print();
    w.close();
    closeReceipt();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content with enhanced layout */}
      <div className="ml-64 flex-1 p-8 transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V8a2 2 0 00-2-2H6a2 2 0 00-2 2v1m16 0v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9m16 0H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Appointments Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your upcoming and completed appointments</p>
              </div>
            </div>
            <button 
              onClick={fetchAppointments} 
              disabled={loading}
              className="px-6 py-3 bg-red-800 text-white rounded-xl hover:bg-red-900 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{upcoming.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Services</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{history.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {upcoming.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V8a2 2 0 00-2-2H6a2 2 0 00-2 2v1m16 0v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9m16 0H4" />
                        </svg>
                        <p className="text-gray-500 text-lg">No upcoming appointments</p>
                        <p className="text-gray-400 text-sm">New appointments will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  upcoming.map((appt) => (
                    <tr key={appt.appointment_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appt.service_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appt.date}</div>
                        <div className="text-sm text-gray-500">{appt.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appt.vehicleBrand} {appt.vehicleModel}
                        </div>
                        <div className="text-sm text-gray-500">({appt.vehicleColor})</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₱{appt.price || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => completeAppointment(appt.appointment_id)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Complete
                          </button>
                          <button 
                            onClick={() => cancelAppointment(appt.appointment_id)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                          <button 
                            onClick={() => openReceipt(appt)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Appointment History</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500 text-lg">No appointment history</p>
                        <p className="text-gray-400 text-sm">Completed appointments will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((appt) => (
                    <tr key={appt.appointment_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-1 rounded-full mr-3">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{appt.service_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appt.date}</div>
                        <div className="text-sm text-gray-500">{appt.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appt.vehicleBrand} {appt.vehicleModel}
                        </div>
                        <div className="text-sm text-gray-500">({appt.vehicleColor})</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₱{appt.price || "N/A"}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Receipt Modal */}
        {showModal && selectedAppt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Generate Receipt</h2>
                  </div>
                  <button
                    onClick={closeReceipt}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                {/* Service Details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Service Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-gray-900">{selectedAppt.service_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">{selectedAppt.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-900">{selectedAppt.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-gray-900">₱{selectedAppt.price || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    autoFocus
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={printReceipt}
                    className="flex-1 px-6 py-3 bg-red-800 text-white rounded-xl hover:bg-red-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Receipt
                  </button>
                  <button 
                    onClick={closeReceipt}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}