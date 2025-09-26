"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_URL = "https://caps-backend-production-f8d8.up.railway.app/api/orders";

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

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
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
      case "delete":
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

// Helper function to format payment method display
const formatPaymentMethod = (method) => {
  if (!method) return 'N/A';
  const lowerMethod = method.toLowerCase();
  if (lowerMethod === 'gcash') return 'GCash';
  if (lowerMethod === 'paymaya') return 'PayMaya';
  if (lowerMethod === 'cash') return 'Cash';
  return method;
};

// Receipt format function extracted from POS system
function prepareReceiptHtml(order) {
  const items = order?.items ? order.items.split(", ") : [];
  
  // Parse items to extract quantity, name, and price
  const parsedItems = items.map((itemStr, index) => {
    let qty = 1, name = itemStr;
    
    // Pattern 1: "1x Product Name (₱100.00)"
    const fullMatch = itemStr.match(/^(\d+)x\s(.+?)\s\(₱([\d,]+\.?\d*)\)$/);
    if (fullMatch) {
      const [, quantity, itemName, totalPrice] = fullMatch;
      const unitPrice = parseFloat(totalPrice.replace(/,/g, '')) / parseInt(quantity);
      return {
        qty: parseInt(quantity),
        name: itemName,
        unitPrice: unitPrice,
        totalPrice: parseFloat(totalPrice.replace(/,/g, ''))
      };
    }
    
    // Pattern 2: "1x Product Name"
    const qtyMatch = itemStr.match(/^(\d+)x\s(.+)$/);
    if (qtyMatch) {
      qty = parseInt(qtyMatch[1]);
      name = qtyMatch[2];
    }
    
    // Pattern 3: "Product Name" (no quantity)
    if (!qtyMatch) {
      const nameOnly = itemStr.trim();
      if (nameOnly) name = nameOnly;
    }
    
    // Calculate price from total order amount divided by number of items
    const totalOrderAmount = parseFloat(order.total_amount || 0);
    const totalItemsCount = items.length;
    const estimatedUnitPrice = totalItemsCount > 0 ? (totalOrderAmount / totalItemsCount) / qty : 0;
    const estimatedTotalPrice = estimatedUnitPrice * qty;
    
    return {
      qty: qty,
      name: name,
      unitPrice: estimatedUnitPrice,
      totalPrice: estimatedTotalPrice
    };
  });

  // Generate items table rows
  const itemsHtml = parsedItems
    .map(item => 
      `<tr>
        <td style="text-align: center; padding: 2px 4px; border-bottom: 1px dotted #ccc;">${item.qty}</td>
        <td style="padding: 2px 4px; border-bottom: 1px dotted #ccc;">${item.name}</td>
        <td style="text-align: right; padding: 2px 4px; border-bottom: 1px dotted #ccc;">₱${item.unitPrice.toFixed(2)}</td>
        <td style="text-align: right; padding: 2px 4px; border-bottom: 1px dotted #ccc;">₱${item.totalPrice.toFixed(2)}</td>
      </tr>`
    ).join("");

  const date = new Date(order.order_date || Date.now()).toLocaleString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric"
  });

  const currentYear = new Date().getFullYear();
  const orNumber = `OR-${currentYear}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  const ptuNumber = `PTU-${currentYear}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  const atpNumber = `ATP No. ${currentYear}-ATP-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

  const paymentMethodText = (formatPaymentMethod(order.payment_method)).toUpperCase();
  const isCashPayment = order.payment_method && order.payment_method.toLowerCase() === 'cash';

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
        <div style="font-size: 11px; margin-bottom: 2px;">Customer Name: ${order.name || "Walk-in Customer"}</div>
        <div style="font-size: 11px; margin-bottom: 2px;">Order ID: ${order.order_id || "N/A"}</div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 15px;">
        <div style="border-top: 2px solid #000; border-bottom: 1px solid #000; padding: 5px 0;">
          <table style="width: 100%; font-size: 10px;">
            <thead>
              <tr style="font-weight: bold;">
                <th style="text-align: center; width: 15%; padding: 2px;">Qty</th>
                <th style="text-align: left; width: 45%; padding: 2px;">Particulars</th>
                <th style="text-align: right; width: 20%; padding: 2px;">Unit Price</th>
                <th style="text-align: right; width: 20%; padding: 2px;">Amount</th>
              </tr>
            </thead>
          </table>
        </div>
        
        <table style="width: 100%; font-size: 10px;">
          <tbody>
            ${itemsHtml || '<tr><td colspan="4" style="text-align: center; padding: 10px;">No items</td></tr>'}
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
          <span style="font-weight: bold;">${paymentMethodText}</span>
        </div>
        ${order.payment_proof ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <span>Reference No:</span>
          <span>${order.payment_proof}</span>
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="text-align: center; font-size: 9px; color: #666; border-top: 1px solid #ccc; padding-top: 8px;">
        <div style="margin-bottom: 3px;">Thank you for your business!</div>
        <div style="margin-bottom: 3px;">Please keep this receipt for your records.</div>
        <div>For inquiries, please contact us at the above number.</div>
      </div>

      ${order.payment_proof ? `
      <div style="margin-top: 15px; text-align: center; border-top: 1px dashed #ccc; padding-top: 10px;">
        <div style="font-size: 10px; margin-bottom: 5px; font-weight: bold;">Payment Proof:</div>
        <img src="${order.payment_proof}" style="max-width: 200px; max-height: 150px; border: 1px solid #ddd; border-radius: 4px;"/>
      </div>
      ` : ''}
    </div>`;
}

// Enhanced Orders Component
export default function TransactionsPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("order_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);

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

  const printReceipt = (order) => {
  try {
    const receiptHtml = prepareReceiptHtml(order);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for this site to print receipts.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - Order #${order.order_id}</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Courier New', monospace;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              @page { margin: 0; }
              body { margin: 0.5cm; }
            }
          </style>
        </head>
        <body>
          ${receiptHtml}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();

  } catch (error) {
    console.error('Error printing receipt:', error);
    setMessageModal({
      isOpen: true,
      title: 'Print Error',
      message: 'Failed to print receipt. Please try again.',
      type: 'error'
    });
  }
};

  // Fetch orders
  const fetchOrders = async (showLoadingSpinner = true, showSuccessMessage = false) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setOrders(data);
      if (showSuccessMessage) {
        setMessageModal({
          isOpen: true,
          title: 'Success',
          message: 'Orders loaded successfully!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setMessageModal({
        isOpen: true,
        title: 'Error',
        message: 'Error fetching orders. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Show payment proof modal
  const showPaymentProof = (proofUrl) => {
    setSelectedProof(proofUrl);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProof(null);
  };

  const removeOrder = (id) => {
    setAlertModal({
      isOpen: true,
      title: 'Remove Order',
      message: 'Are you sure you want to remove this order? This action cannot be undone.',
      type: 'delete',
      confirmText: 'Remove Order',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setAlertModal(prev => ({ ...prev, isOpen: false }));
        try {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          fetchOrders(false);
          setMessageModal({
            isOpen: true,
            title: 'Success',
            message: 'Order removed successfully!',
            type: 'success'
          });
        } catch (err) {
          console.error("Error removing order:", err);
          setMessageModal({
            isOpen: true,
            title: 'Error',
            message: 'Error removing order. Please try again.',
            type: 'error'
          });
        }
      }
    });
  };

  // Sort orders
  const sortOrders = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => 
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id?.toString().includes(searchTerm) ||
      order.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === "order_date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Calculate totals
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
  const totalQuantity = orders.reduce((sum, order) => sum + (parseInt(order.total_quantity) || 0), 0);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(false), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
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
      
      {/* Main Content */}
      <div className="ml-64 flex-1 transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-gray-600 mt-1">Manage and track all your orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p suppressHydrationWarning className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₱{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Items Sold</p>
                  <p className="text-2xl font-bold text-gray-900">{totalQuantity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by customer name, order ID, or payment method..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => fetchOrders(true, true)}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh Orders'}
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {[
                        { key: 'order_id', label: 'Order #' },
                        { key: 'order_date', label: 'Date' },
                        { key: 'name', label: 'Customer' },
                        { key: 'total_quantity', label: 'Quantity' },
                        { key: 'total_amount', label: 'Total' },
                        { key: 'payment_method', label: 'Payment Method' },
                        { key: 'payment_proof', label: 'Status' },
                        { key: 'actions', label: 'Actions' }
                      ].map(({ key, label }) => (
                        <th
                          key={key}
                          className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                            key !== 'payment_proof' && key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
                          }`}
                          onClick={key !== 'payment_proof' && key !== 'actions' ? () => sortOrders(key) : undefined}
                        >
                          <div className="flex items-center">
                            {label}
                            {key !== 'payment_proof' && key !== 'actions' && sortField === key && (
                              <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSortedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-lg font-medium text-gray-500 mb-1">No orders found</p>
                            <p className="text-gray-400">
                              {searchTerm ? 'Try adjusting your search criteria' : 'Orders will appear here once created'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedOrders.map((order, index) => (
                        <tr key={order.order_id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.order_id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(order.order_date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.order_date).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-gray-600">
                                  {(order.name || 'N/A').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.name || 'Guest Customer'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {order.total_quantity || 0} items
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              ₱{parseFloat(order.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.payment_method?.toLowerCase() === 'cash' 
                                ? 'bg-green-100 text-green-800' 
                                : order.payment_method?.toLowerCase() === 'gcash'
                                ? 'bg-blue-100 text-blue-800'
                                : order.payment_method?.toLowerCase() === 'paymaya'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {formatPaymentMethod(order.payment_method)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              const paymentMethod = order.payment_method?.toLowerCase();
                              // Convert numeric reference to string safely
                              const refNum = order.reference_number !== undefined && order.reference_number !== null 
                              ? String(order.reference_number) 
                              : null;

                              if (paymentMethod === 'cash') {
                                return (
                                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-green-600 bg-green-50">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Paid
                                  </span>
                                );
                              }

                              if (paymentMethod === 'gcash' || paymentMethod === 'paymaya') {
                                return (
                                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {refNum ? `Ref: ${refNum}` : 'No Reference'}
                                  </span>
                                );
                              }

                              return (
                                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-600 bg-gray-50">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Unknown
                                </span>
                              );
                            })()}
                          </td>


                          <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => printReceipt(order)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print
                                  </button>
                                  <button
                                    onClick={() => removeOrder(order.order_id)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove
                                  </button>
                                </div>
                              </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Results info */}
          {!loading && filteredAndSortedOrders.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredAndSortedOrders.length} of {totalOrders} orders
              {searchTerm && (
                <span> matching "{searchTerm}"</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Proof Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Payment Reference</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto">
              <div className="flex justify-center">
                <img
                  src={selectedProof}
                  alt="Payment Reference"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 mb-2">Unable to load image</p>
                  <a
                    href={selectedProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={selectedProof}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Open in New Tab
              </a>
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
  );
}