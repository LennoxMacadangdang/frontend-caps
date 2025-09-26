"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const API = "https://caps-backend-production-a67c.up.railway.app";

// Sidebar Component
function Sidebar({ onLogout }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    }
  };

  const navButtonClass = (path) =>
    `flex items-center w-full px-5 py-4 mb-3 rounded-lg text-base font-medium transition-all duration-300 cursor-pointer ${
      pathname === `/${path}`
        ? 'text-white bg-red-800 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white before:rounded-r'
        : 'text-gray-700 hover:bg-red-800 hover:text-white hover:translate-x-1 active:translate-x-1 active:scale-98'
    }`;

  return (
        <div className="fixed top-0 left-0 w-64 h-screen bg-gray-100 border-r-4 border-red-800 shadow-lg z-50 flex flex-col py-2 transition-transform duration-300 ease-in-out">
        {/* Company Logo Section */}
        <div className="px-2 pb-2 border-b-1 border-gray-300 mb-5">
            {/* Company Logo Section */}
            <div className="flex flex-col items-center ">
            {/* Logo image above sidebar content */}
            <div className="w-full h-20 bg-black flex items-center rounded-lg justify-center m-0 p-0 border-b-0 border-gray-300">
    <img
        src="https://url-shortener.me/5SGQ"
        alt="Otto Bright Logo"
        className="w-full h-full object-contain m-0 p-1"
    />
    </div>

        </div>
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

// Custom Alert Modal Component (Updated to match POS style)
function AlertModal({ isOpen, onClose, onConfirm, title, message, type = "confirm", confirmText = "Confirm", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "logout":
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      case "complete":
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "cancel":
      case "delete":
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 transform transition-all">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 rounded-lg transition-all duration-200"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success/Error Message Modal Component
function MessageModal({ isOpen, onClose, title, message, type = "success" }) {
  if (!isOpen) return null;

  const getIcon = () => {
    if (type === "success") {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  const getBgColor = () => {
    return type === "success" ? "bg-green-50" : "bg-red-50";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 transform transition-all">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getBgColor()} flex items-center justify-center`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 rounded-lg transition-all duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Professional receipt format for appointments
function prepareAppointmentReceiptHtml(order, appointment) {
  const date = new Date(order.order_date).toLocaleString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric"
  });

  const currentYear = new Date().getFullYear();
  const orNumber = `OR-${currentYear}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  const ptuNumber = `PTU-${currentYear}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  const atpNumber = `ATP No. ${currentYear}-ATP-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

  return `
    <div style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.3; color: #000; max-width: 350px; margin: 0 auto; padding: 10px; background: white;">
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">OTTO BRIGHT POS SYSTEM</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Business Name: OTTO BRIGHT CARWASH SERVICES</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Trade Name: Otto Bright Auto Care</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Business Addr: Metro Manila, Philippines</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Tel. No.: (02) 8123-4567</div>
        <div style="font-size: 11px; margin-bottom: 2px;">TIN: 123-456-789-000</div>
        <div style="font-size: 11px; margin-bottom: 2px;">VAT Status: NON-VAT Registered</div>
      </div>

      <!-- Transaction Details -->
      <div style="margin-bottom: 10px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
          <span>OR No.:</span>
          <span>${orNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
          <span>Date Issued:</span>
          <span>${date}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
          <span>Permit to Use:</span>
          <span>${ptuNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>ATP / Printer:</span>
          <span>${atpNumber}</span>
        </div>
      </div>

      <!-- Customer Information -->
      <div style="margin-bottom: 15px; padding: 8px; background: #f9f9f9; border: 1px solid #ddd;">
        <div style="font-size: 11px; font-weight: bold; margin-bottom: 3px;">Sold to:</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Customer Name: ${order.name}</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Appointment ID: ${order.order_id}</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Vehicle: ${appointment.vehicleBrand || ''} ${appointment.vehicleModel || ''} (${appointment.vehicleColor || ''})</div>
      </div>

      <!-- Services Table -->
      <div style="margin-bottom: 15px;">
        <div style="border-top: 2px solid #000; border-bottom: 1px solid #000; padding: 5px 0;">
          <table style="width: 100%; font-size: 10px;">
            <thead>
              <tr style="font-weight: bold;">
                <th style="text-align: center; width: 15%; padding: 2px;">Qty</th>
                <th style="text-align: left; width: 45%; padding: 2px;">Service</th>
                <th style="text-align: right; width: 20%; padding: 2px;">Unit Price</th>
                <th style="text-align: right; width: 20%; padding: 2px;">Amount</th>
              </tr>
            </thead>
          </table>
        </div>
        
        <table style="width: 100%; font-size: 10px;">
          <tbody>
            <tr>
              <td style="text-align: center; padding: 2px 4px; border-bottom: 1px dotted #ccc;">1</td>
              <td style="padding: 2px 4px; border-bottom: 1px dotted #ccc;">${appointment.service_name}</td>
              <td style="text-align: right; padding: 2px 4px; border-bottom: 1px dotted #ccc;">₱${parseFloat(order.total_amount || 0).toFixed(2)}</td>
              <td style="text-align: right; padding: 2px 4px; border-bottom: 1px dotted #ccc;">₱${parseFloat(order.total_amount || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div style="border-top: 2px solid #000; padding-top: 10px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: bold;">
          <span>Total Amount Due:</span>
          <span>₱${parseFloat(order.total_amount || 0).toFixed(2)}</span>
        </div>
      </div>

      <!-- Payment Details -->
      <div style="margin-bottom: 15px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>Payment Mode:</span>
          <span style="font-weight: bold;">APPOINTMENT BOOKING</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>Service Date:</span>
          <span>${appointment.date} at ${appointment.time}</span>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; font-size: 9px; color: #666; border-top: 1px solid #ccc; padding-top: 8px;">
        <div style="margin-bottom: 3px;">Thank you for choosing Otto Bright!</div>
        <div style="margin-bottom: 3px;">Please arrive 15 minutes before your appointment.</div>
        <div>For inquiries, please contact us at the above number.</div>
      </div>
    </div>`;
}


export default function AppointmentsPage() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Alert modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {}
  });

  // Success/Error message modal state
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  // fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const resUpcoming = await fetch(`https://online-appointment-backend-ottobright-8eer.onrender.com/getAllUpcomingAppointments/pos`);
      const resHistory = await fetch(`https://online-appointment-backend-ottobright-8eer.onrender.com/getAllHistoryAppointments/pos`);
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

  const completeAppointment = (id) => {
    setAlertModal({
      isOpen: true,
      title: 'Complete Appointment',
      message: 'Are you sure you want to mark this appointment as completed?',
      type: 'complete',
      confirmText: 'Complete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        try {
          await fetch(`${API}/updateAppointmentStatus/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          fetchAppointments();
          setMessageModal({
            isOpen: true,
            title: 'Success',
            message: 'Appointment has been marked as completed successfully.',
            type: 'success'
          });
        } catch (err) {
          console.error("Error completing appointment", err);
          setMessageModal({
            isOpen: true,
            title: 'Error',
            message: 'Failed to complete appointment. Please try again.',
            type: 'error'
          });
        }
      }
    });
  };

  const cancelAppointment = (id) => {
    setAlertModal({
      isOpen: true,
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
      type: 'cancel',
      confirmText: 'Cancel Appointment',
      cancelText: 'Keep Appointment',
      onConfirm: async () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        try {
          await fetch(`${API}/cancelAppointment/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          fetchAppointments();
          setMessageModal({
            isOpen: true,
            title: 'Cancelled',
            message: 'Appointment has been cancelled successfully.',
            type: 'success'
          });
        } catch (err) {
          console.error("Error cancelling appointment", err);
          setMessageModal({
            isOpen: true,
            title: 'Error',
            message: 'Failed to cancel appointment. Please try again.',
            type: 'error'
          });
        }
      }
    });
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
    setMessageModal({
      isOpen: true,
      title: 'Missing Information',
      message: 'Please enter customer name before printing the receipt.',
      type: 'error'
    });
    return;
  }
  if (!selectedAppt) return;

  // Create appointment order object compatible with receipt format
  const appointmentOrder = {
    order_id: `APPT-${selectedAppt.appointment_id}`,
    name: customerName,
    order_date: `${selectedAppt.date}T${selectedAppt.time}:00`,
    total_amount: selectedAppt.price || 0,
    payment_method: 'cash',
    items: `1x ${selectedAppt.service_name}`
  };

  const receiptContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Appointment Receipt - ${appointmentOrder.order_id}</title>
        <style>
            body { margin: 0; padding: 20px; }
            @media print { 
                .no-print { display: none; } 
                body { margin: 0; padding: 10px; }
            }
        </style>
    </head>
    <body>
        ${prepareAppointmentReceiptHtml(appointmentOrder, selectedAppt)}
        <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #991b1b; color: white; border: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">Print Receipt</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: bold;">Close</button>
        </div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(receiptContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
  closeReceipt();
};

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar with logout functionality */}
      <Sidebar onLogout={() => {
        setAlertModal({
          isOpen: true,
          title: 'Confirm Logout',
          message: 'Are you sure you want to logout? You will be redirected to the login page.',
          type: 'logout',
          confirmText: 'Logout',
          cancelText: 'Cancel',
          onConfirm: () => {
            setAlertModal(prev => ({ ...prev, isOpen: false }));
            router.replace('/login');
          }
        });
      }} />
      
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

        {/* Custom Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={alertModal.onConfirm}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          confirmText={alertModal.confirmText}
          cancelText={alertModal.cancelText}
        />

        {/* Success/Error Message Modal */}
        <MessageModal
          isOpen={messageModal.isOpen}
          onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
          title={messageModal.title}
          message={messageModal.message}
          type={messageModal.type}
        />
      </div>
    </div>
  );
}