"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_BASE = "https://caps-backend-production-59fe.up.railway.app";

// Side Panel Component for Selected Items
function SidePanel({ cart, grandTotal, onAddItem, onRemoveItem, onRemoveAllOfItem, onCheckout, isProcessing, paymentMethod, setPaymentMethod, cashAmount, setCashAmount, referenceNumber, setReferenceNumber, paymentProofFile, setPaymentProofFile, lastOrder, onPrintReceipt, showReceiptInModal, setShowReceiptInModal, prepareReceiptHtml, orderCompleted, setOrderCompleted, onClearCart, products }) {
    function groupCartItems(arr) {
        const grouped = {};
        arr.forEach((item) => {
            const key = `${item.type}_${item.id}${item.size ? `_${item.size}` : ""}`;
            if (grouped[key]) grouped[key].quantity += item.quantity;
            else grouped[key] = { ...item };
        });
        return Object.values(grouped);
    }
   
    return (
        <div className="fixed right-0 top-0 w-96 h-screen bg-white border-l-4 border-red-800 shadow-2xl z-40 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-800 to-red-900 text-white p-6 border-b">
                <h2 className="text-xl font-bold">Current Order</h2>
                <p className="text-sm text-red-100 mt-1">Select items to add to order</p>
            </div>

{/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {groupCartItems(cart).length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                         <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                         </svg>
                         <p className="text-lg font-medium">No items selected</p>
                         <p className="text-sm mt-1">Click on items to add them</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {groupCartItems(cart).map((item) => {
                            // Get stock info for products
                            let maxStock = null;
                            let atMaxStock = false;
                            if (item.type === "product") {
                                const product = products.find(p => p.product_id === item.id);
                                maxStock = product?.stock;
                                atMaxStock = maxStock !== null && item.quantity >= maxStock;
                            }
                            
                            return (
                            <div key={`${item.type}_${item.id}_${item.size}`} className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm">
                                <div className="flex-1 pr-4">
                                    <div className="font-semibold text-gray-800">{item.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {item.type.toUpperCase()}
                                        {item.size ? ` (${item.size.toUpperCase()})` : ""}
                                    </div>
                                    <div className="text-sm font-medium text-red-600 mt-1">
                                        ₱{parseFloat(item.price || 0).toFixed(2)} each
                                    </div>
                                    {atMaxStock && (
                                        <div className="text-xs text-amber-600 font-medium mt-1">
                                            ⚠️ Max stock reached
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                                        <button onClick={() => onRemoveItem(item.id, item.type, item.size || null)} className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 font-bold transition-colors hover:scale-110">-</button>
                                        <span className="w-8 text-center font-semibold text-gray-700">{item.quantity}</span>
                                        <button 
                                            onClick={() => onAddItem(item.id, item.type, item.size || null, item.name, item.price)} 
                                            disabled={atMaxStock}
                                            className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold transition-colors ${
                                                atMaxStock 
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                                : "bg-green-100 text-green-800 hover:bg-green-200 hover:scale-110"
                                            }`}
                                            title={atMaxStock ? "Maximum stock reached" : "Add one more"}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove All Button */}
                                    <button onClick={() => onRemoveAllOfItem(item.id, item.type, item.size || null)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors" title="Remove all from cart">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>

            {/* Checkout Section */}
            {groupCartItems(cart).length > 0 && (
                <div className="border-t p-4 bg-white">
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-gray-700">Total:</span>
                            <span className="text-3xl font-bold text-red-800">₱{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Customer Name Input */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <div className="w-5 h-5 bg-red-100 rounded-md flex items-center justify-center">
                                    <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                            </div>
                            <input id="customerName"
                                placeholder="Customer name (optional)"
                                className="w-full p-3 pl-14 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm text-sm"
                            />
                        </div>

                        {/* Payment Method */}
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm text-sm">
                            <option value="cash"> 💵  Cash</option>
                            <option value="gcash"> 📱  GCash</option>
                            <option value="paymaya"> 💳  PayMaya</option>
                        </select>

                        {paymentMethod === "cash" && (
                            <input type="number" step="0.01" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} placeholder="Cash received" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm text-sm" />
                        )}

                        {(paymentMethod === "gcash" || paymentMethod === "paymaya") && (
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                </div>
                                <input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="Reference number" className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm text-sm" />
                            </div>
                        )}
                       
                        <div className="flex gap-2">
                            <button disabled={isProcessing} onClick={onCheckout} className={`flex-1 py-3 rounded-xl text-white font-semibold transition-all duration-300 text-sm ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"}`}>
                                {isProcessing ? "Processing..." : "Complete Order"}
                            </button>
                            <button onClick={onClearCart} className="px-4 py-3 rounded-xl text-red-800 bg-red-100 hover:bg-red-200 font-semibold transition-all duration-300 text-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Receipt Display */}
                    {showReceiptInModal && lastOrder && (
                        <div className="border-t p-4 bg-gray-50 mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-800">Order Receipt</h3>
                            <button  
                                  onClick={() => {
                                    setShowReceiptInModal(false);
                                    if (orderCompleted) {
                                        window.location.reload();
                                    }
                                    setOrderCompleted(false);
                                  }}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="bg-white p-3 rounded-lg border max-h-40 overflow-y-auto text-xs">
                            <div dangerouslySetInnerHTML={{ __html: prepareReceiptHtml(lastOrder) }} />
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <button 
                                  onClick={onPrintReceipt}
                                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                                >
                                  Print Receipt
                                </button>
                            <button 
                                onClick={() => {
                                  setShowReceiptInModal(false);
                                  if (orderCompleted) {
                                      window.location.reload();
                                  }
                                  setOrderCompleted(false);
                                }}
                                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold text-sm"
                            >
                                Close
                            </button>
                          </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Sidebar Component with Icons
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
        <div className="px-1 pb-1 border-b-2 border-gray-300 mb-5">
            {/* Company Logo Section */}
            <div className="flex flex-col items-center ">
            {/* Logo image above sidebar content */}
            <div className="w-full h-30 bg-grey flex items-center rounded-lg justify-center m-0 p-0 border-b-0 border-gray-300">
    <img
        src="https://i.ibb.co/Jwq72QFQ/download.png"
        alt="Otto Bright Logo"
        className="w-full h-full object-contain m-0 p--5"
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
// Custom Alert Modal Component
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
export default function PosPage() {
    const router = useRouter();
    
    // Data sources
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    // Cart structure: [{ id, type, name, price, size (optional), quantity }]
    const [cart, setCart] = useState([]);
    // Service selected sizes mapping: { serviceId: { size, price } }
    const [selectedServiceSizes, setSelectedServiceSizes] = useState({});
    
    // UI state
    const [currentSection, setCurrentSection] = useState("checkout");
    
    // Order summary
    const [subtotal, setSubtotal] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    
    // Payment
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [cashAmount, setCashAmount] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [paymentProofFile, setPaymentProofFile] = useState(null);
    
    // Checkout / messages
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Last order & receipt
   const [lastOrder, setLastOrder] = useState(null);
    const [showReceiptInModal, setShowReceiptInModal] = useState(false);
    const [orderCompleted, setOrderCompleted] = useState(false);
    const receiptRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");  // ADD THIS LINE
    
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

    // Initialize and load data automatically
    useEffect(() => {
        const fallback = localStorage.getItem("isLoggedIn");
        if (!sessionStorage.getItem("isLoggedIn")) {
            if (fallback) {
                sessionStorage.setItem("isLoggedIn", "1");
            } else {
                router.replace("/login");
                return;
            }
        }
        initializeApp();
    }, []);

    // Recompute summary when cart changes
    useEffect(() => {
        const grouped = groupCartItems(cart);
        const sub = grouped.reduce(
            (acc, it) => acc + it.quantity * parseFloat(it.price || 0),
            0
        );
        const totalQty = grouped.reduce((acc, it) => acc + it.quantity, 0);
        setSubtotal(sub);
        setTotalItems(totalQty);
        setGrandTotal(sub);
    }, [cart]);

    // Helper: grouping cart items by id/type/size
    function createCartItemKey(id, type, size = null) {
        return `${type}_${id}${size ? `_${size}` : ""}`;
    }

    function groupCartItems(arr) {
        const grouped = {};
        arr.forEach((item) => {
            const key = createCartItemKey(item.id, item.type, item.size || null);
            if (grouped[key]) grouped[key].quantity += item.quantity;
            else grouped[key] = { ...item };
        });
        return Object.values(grouped);
    }

    // Search filtering
    function filterItems(items, type) {
        if (!searchQuery.trim()) return items;
        
        const query = searchQuery.toLowerCase();
        return items.filter(item => {
            const name = type === 'product' ? item.name : item.service_name;
            return name.toLowerCase().includes(query);
        });
    }

    // ---- API LOADERS ----
    async function loadProducts() {
        try {
            const res = await fetch(`https://caps-backend-production-59fe.up.railway.app/products`);
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();
            setProducts(data || []);
        } catch (err) {
            console.error("loadProducts", err);
            showMessage("Failed to load products", "error");
        }
    }

async function loadServices() {
    try {
        const res = await fetch(`${API_BASE}/services`);
        if (!res.ok) throw new Error(`${res.status}`);
        
        const data = await res.json();
        console.log("📦 Full response object:", data);
        console.log("📦 Object keys:", Object.keys(data));
        
        // Check different possible structures
        let servicesArray = [];
        
        if (Array.isArray(data)) {
            servicesArray = data;
        } else if (data.services && Array.isArray(data.services)) {
            servicesArray = data.services;
        } else if (data.data && Array.isArray(data.data)) {
            servicesArray = data.data;
        } else if (data.items && Array.isArray(data.items)) {
            servicesArray = data.items;
        }
        
        // Don't filter out inactive services - keep them all
        console.log("✅ Total services length:", servicesArray.length);
        console.log("✅ First service:", servicesArray[0]);
        
        setServices(servicesArray);
        
        // initialize default selected sizes ONLY for active services
        const map = {};
        servicesArray.forEach((s) => {
            if (!s || !s.service_id) return;
            
            // Skip initializing selection for inactive services
            if (s.active === false) return;
            
            const sizes = ["small", "medium", "large", "xlarge", "xxlarge"].filter(
                (size) => s[size] !== null && s[size] !== undefined
            );
            
            if (sizes.length > 0) {
                map[s.service_id] = {
                    size: sizes[0],
                    price: parseFloat(s[sizes[0]]),
                };
            }
        });
        
        setSelectedServiceSizes(map);
        console.log("✅ Total services loaded:", servicesArray.length);
        console.log("✅ Active services with selections:", Object.keys(map).length);
    } catch (err) {
        console.error("❌ loadServices error:", err);
        showMessage("Failed to load services", "error");
        setServices([]);
    }
}
    async function loadCart() {
        try {
            const res = await fetch(`${API_BASE}/cart`);
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();
            setCart(data.items || []);
        } catch (err) {
            console.error("loadCart", err);
            showMessage("Failed to load cart", "error");
        }
    }

    async function initializeApp() {
        showMessage("Welcome to Otto Bright POS System!", "success");
        try {
            await Promise.all([loadProducts(), loadServices(), loadCart()]);
        } catch (err) {
            console.error("initializeApp", err);
            showMessage("Initialization failed", "error");
        }
    }

    // ---- CART OPERATIONS ----
async function addToCart(id, type, size = null, name = null, price = null) {
    try {
        // ✅ Stock validation for products BEFORE adding to cart
        if (type === "product") {
            // Find the product to check stock
            const product = products.find(p => p.product_id === id);
            if (!product) {
                showMessage("Product not found", "error");
                return;
            }

            // Check current quantity in cart
            const currentCartQty = cart
                .filter(item => item.id === id && item.type === "product")
                .reduce((sum, item) => sum + item.quantity, 0);

            // Check if adding 1 more would exceed stock
            if (currentCartQty >= product.stock) {
                showMessage(`Cannot add more! Only ${product.stock} ${product.unit || "pcs"} available in stock.`, "error");
                return;
            }

            if (product.stock <= 0) {
                showMessage("This product is out of stock!", "error");
                return;
            }
        }

        const body = { 
            id, 
            type, 
            quantity: 1, 
            size: size || null,
            name: name || null,
            price: price || null
        };

        console.log("📦 Sending body to /cart/addtocart:", body);

        const res = await fetch(`${API_BASE}/cart/addtocart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (result.error) throw new Error(result.error);

        await loadCart();
        showMessage("Item added to cart!", "success");
    } catch (err) {
        console.error("addToCart", err);
        showMessage("Failed to add to cart: " + err.message, "error");
    }
}

    async function removeFromCart(id, type, size = null) {
    try {
        // Find the item in the cart to check its current quantity
        const cartKey = createCartItemKey(id, type, size);
        const groupedCart = groupCartItems(cart);
        const currentItem = groupedCart.find(item => 
            createCartItemKey(item.id, item.type, item.size || null) === cartKey
        );

        // If quantity is 1, remove the item completely
        if (currentItem && currentItem.quantity === 1) {
            const res = await fetch(`${API_BASE}/cart/remove-one`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, type, size: size || null }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await loadCart();
            showMessage("Item removed from cart", "success");
            return;
        }

        // Otherwise, decrement by 1
        const body = { 
            id, 
            type, 
            quantity: -1,
            size: size || null
        };

        const res = await fetch(`${API_BASE}/cart/addtocart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (result.error) throw new Error(result.error);
        
        await loadCart();
        showMessage("Item quantity updated", "success");
    } catch (err) {
        console.error("removeFromCart", err);
        showMessage("Failed to update item quantity", "error");
    }
}
   
    // NEW: Function to remove all units of a specific item
    function showRemoveItemConfirm(id, type, size = null) {
    setAlertModal({
        isOpen: true,
        title: 'Remove Item',
        message: 'Are you sure you want to remove all units of this item from the cart?',
        type: 'delete',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        onConfirm: async () => {
            setAlertModal(prev => ({ ...prev, isOpen: false }));
            try {
                const res = await fetch(`${API_BASE}/cart/remove-one`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, type, size: size || null }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                await loadCart();
                showMessage("Item removed from cart", "success");
            } catch (err) {
                console.error("removeAllOfItemFromCart", err);
                showMessage("Failed to remove item: " + err.message, "error");
            }
        }
    });
}

   function showClearCartConfirm() {
    setAlertModal({
        isOpen: true,
        title: 'Clear Cart',
        message: 'Are you sure you want to clear the cart? This action cannot be undone.',
        type: 'delete',
        confirmText: 'Clear Cart',
        cancelText: 'Cancel',
        onConfirm: async () => {
            setAlertModal(prev => ({ ...prev, isOpen: false }));
            try {
                const res = await fetch(`${API_BASE}/cart/clear`, { method: "POST" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                await loadCart();
                setLastOrder(null);
                showMessage("Cart cleared", "success");
            } catch (err) {
                console.error("clearCart", err);
                showMessage("Failed to clear cart", "error");
            }
        }
    });
}

    function selectServiceSize(serviceId, size, price) {
        setSelectedServiceSizes((prev) => ({
            ...prev,
            [serviceId]: { size, price: parseFloat(price) },
        }));
    }

    // ---- CHECKOUT LOGIC ----
    function paymentMethodDisplay(method) {
        const methods = {
            cash: "Cash Payment",
            gcash: "GCash",
            paymaya: "PayMaya",
            card: "Credit/Debit Card",
        };
        return methods[method] || method;
    }

    function validateCheckoutForm() {
        if (cart.length === 0) {
            showMessage("Cart is empty! Add items before checkout.", "error");
            return false;
        }
        const cash = parseFloat(cashAmount || 0);
        if (paymentMethod === "cash") {
            if (cash < grandTotal) {
                showMessage("Insufficient cash amount!", "error");
                return false;
            }
        } else if (paymentMethod === "gcash" || paymentMethod === "paymaya") {
            if (!referenceNumber.trim()) {
                showMessage("Please enter the reference number!", "error");
                return false;
            }
        } else if (paymentMethod === "card") {
            if (!paymentProofFile) {
                showMessage("Please upload payment proof for card payments!", "error");
                return false;
            }
        }
        return true;
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) return resolve(null);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });
    }

    async function checkout() {
        if (!validateCheckoutForm()) return;
        setIsProcessing(true);
        try {
            const nameInput = document.getElementById("customerName")?.value?.trim() || "";
            const customerName = nameInput !== "" ? nameInput : "Walk-in Customer";
            const method = paymentMethod;
            let proofBase64 = null;

            if (method === "card" && paymentProofFile) {
                try {
                    proofBase64 = await fileToBase64(paymentProofFile);
                } catch (err) {
                    showMessage("Failed to process payment image", "error");
                    setIsProcessing(false);
                    return;
                }
            }

            const orderId = "OB-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5).toUpperCase();
            const payload = {
                order_id: orderId,
                name: customerName,
                payment_method: method,
                payment_proof: proofBase64,
                reference_number: referenceNumber || null,
                cash_received: parseFloat(cashAmount || grandTotal),
                change_amount: (parseFloat(cashAmount || grandTotal) - grandTotal) || 0,
            };

            const res = await fetch(`${API_BASE}/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const order = data.order || {};
            order.customer_name = customerName;
            order.payment_method_display = paymentMethodDisplay(method);
            order.cash_received = payload.cash_received;
            order.change_amount = payload.change_amount;
            order.reference_number = payload.reference_number;
            setLastOrder(order);

           showMessage("Order completed successfully!", "success");

                  // Show receipt immediately and mark order as completed
                  setShowReceiptInModal(true);
                  setOrderCompleted(true);

                // reset inputs but DON'T reload cart yet
                const cInput = document.getElementById("customerName");
                if (cInput) cInput.value = "";
                setPaymentProofFile(null);
                setReferenceNumber("");
                setPaymentMethod("cash");
                setCashAmount("");

// DON'T call loadCart() here - let the cart stay until modal closes   
        } catch (err) {
            console.error("checkout error", err);
            showMessage("Checkout failed: " + err.message, "error");
        } finally {
            setIsProcessing(false);
        }
    }

    // ---- RECEIPT & PRINT ----
    function prepareReceiptHtml(order) {
    const items = order?.items ? order.items.split(", ") : [];
    
    // Parse items to extract quantity, name, and price
// Since backend doesn't include prices in items string, we'll calculate from cart data
const parsedItems = items.map((itemStr, index) => {
    // Try multiple parsing patterns
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
    // This is a fallback when individual prices aren't available
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

    // Determine payment method display
    const paymentMethodText = (order.payment_method_display || "CASH").toUpperCase();
    const isCashPayment = order.payment_method_display && order.payment_method_display.toLowerCase().includes('cash');

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
                <div style="font-size: 11px; margin-bottom: 2px;">Customer Name: ${order.customer_name || "Walk-in Customer"}</div>
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
                ${isCashPayment ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Amount Received:</span>
                    <span>₱${(order.cash_received || 0).toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Change Given:</span>
                    <span>₱${(order.change_amount || 0).toFixed(2)}</span>
                </div>
                ` : ''}
                ${order.reference_number ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Reference No:</span>
                    <span>${order.reference_number}</span>
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

    function printReceipt() {
        if (!lastOrder) {
            showMessage("No order to print!", "error");
            return;
        }

        try {
            const printWindow = window.open("", "PrintReceipt", "width=800,height=600");
            if (!printWindow) {
                showMessage("Unable to open print window. Check popup blocker.", "error");
                return;
            }

            const html = `
                <!doctype html>
                <html>
                <head>
                    <title>Otto Bright - Receipt</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; margin:20px; color:#333;}
                        h2 { text-align:center; }
                        @media print { .no-print { display:none; } }
                    </style>
                </head>
                <body>
                    ${prepareReceiptHtml(lastOrder)}
                    <div class="no-print" style="text-align:center; margin-top:20px;">
                        <button onclick="window.print()" style="padding:10px 16px; background:#e31e24; color:white; border:none; border-radius:6px;">Print</button>
                        <button onclick="window.close()" style="padding:10px 16px; background:#bbb; color:black; border:none; border-radius:6px; margin-left:8px;">Close</button>
                    </div>
                </body>
                </html>
                `;

            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
            showMessage("Receipt opened in print window!", "success");
        } catch (err) {
            console.error("printReceipt", err);
            showMessage("Failed to print receipt: " + err.message, "error");
        }
    }

    // ---- UI MESSAGING ----
    function showMessage(text, type = "success") {
        setMessage(text);
        setMessageType(type);
        const timer = setTimeout(() => {
    setMessage(null);
}, 4000);

return () => clearTimeout(timer);
    }

    // ---- RENDER ----
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
            {/* Sidebar */}
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
            <div className="ml-64 mr-96 flex-1 transition-all duration-300 ease-in-out">
                {/* Top Navigation Bar */}
               {/* Filter buttons with icons - FIXED ICON ISSUE */}
{/* Top Navigation Bar - PROPERLY STRUCTURED */}
<div className="bg-white p-6 border-b border-gray-200 sticky top-0 z-30 shadow-sm">
    <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
            {/* Filter buttons with icons */}
            <div className="flex gap-2 bg-white p-2 rounded-xl shadow-md border border-gray-200">
                <button onClick={() => setCurrentSection("checkout")}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        currentSection === "checkout"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-red-700 hover:bg-red-50 hover:shadow-md"
                    }`}>
                    <div className={`p-1 rounded-md flex-shrink-0 ${currentSection === "checkout" ? "bg-red-800" : "bg-red-100"}`}>
                        <svg className={`w-4 h-4 ${currentSection === "checkout" ? "text-white" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                    </div>
                    All Items
                </button>
                <button onClick={() => setCurrentSection("products")}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        currentSection === "products"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-red-700 hover:bg-red-50 hover:shadow-md"
                    }`}>
                    <div className={`p-1 rounded-md flex-shrink-0 ${currentSection === "products" ? "bg-red-800" : "bg-red-100"}`}>
                        <svg className={`w-4 h-4 ${currentSection === "products" ? "text-white" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    Products
                </button>
                <button onClick={() => setCurrentSection("services")}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        currentSection === "services"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-red-700 hover:bg-red-50 hover:shadow-md"
                    }`}>
                    <div className={`p-1 rounded-md flex-shrink-0 ${currentSection === "services" ? "bg-red-800" : "bg-red-100"}`}>
                        <svg className={`w-4 h-4 ${currentSection === "services" ? "text-white" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    Services
                </button>
            </div>

          {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-80 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    </div>
</div>                
                <main className="p-6">
                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg border-l-4 ${ messageType === "success" ? "bg-green-50 text-green-800 border-green-400" : "bg-red-50 text-red-800 border-red-400"}`}>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    {messageType === "success" ? (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    )}
                                </svg>
                                {message}
                            </div>
                        </div>
                    )}

                    {/* ---- Products & Services Grid ---- */}
                    {currentSection === "checkout" && (
                        <section className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 m-6 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-700 rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {searchQuery ? `Search Results for "${searchQuery}"` : "Products & Services"}
                                    </h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filterItems(products, 'product').length === 0 && filterItems(services, 'service').length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-lg font-medium">
                                                {searchQuery ? "No items found" : "No items available"}
                                            </p>
                                            <p className="text-sm">
                                                {searchQuery ? `Try searching for something else` : "Products and services will appear here"}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Render filtered products */}
                                            {filterItems(products, 'product').map((p) => {
                                                const outOfStock = p.stock <= 0;
                                                const stockBadge = p.stock <= 0 ? "Out" :  p.stock;
                                                const stockColor = p.stock <= 0 ? "text-red-600" : p.stock <= 5 ? "text-yellow-600" : "text-green-600";
                                                return (
                                                    <div 
    key={`product-${p.product_id}`} 
    onClick={() => !outOfStock && addToCart(p.product_id, "product", null, p.name, p.price)}
    className={`bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col transition-all duration-200 ${outOfStock ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg hover:border-red-300 hover:-translate-y-1 cursor-pointer"}`}>
    <div className="p-4 flex-grow">
        <div className="text-center mb-3">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            </div>
        </div>
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{p.name}</h3>
        <div className="text-lg font-bold text-red-600 mb-2">₱{parseFloat(p.price).toFixed(2)}</div>
        <div className={`text-xs font-medium ${stockColor}`}>Stock: {stockBadge} {p.unit || "pcs"}</div>
    </div>
</div>
                                                );
                                            })}

                                            {/* Render filtered services */}
                                            {filterItems(services, 'service').map((s) => {
                                                const sizes = ["small", "medium", "large", "xlarge", "xxlarge"].filter((sz) => s[sz] !== null && s[sz] !== undefined);
                                                if (sizes.length === 0) return null;
                                                const defaultSize = selectedServiceSizes[s.service_id]?.size || sizes[0];
                                                const defaultPrice = selectedServiceSizes[s.service_id]?.price ?? parseFloat(s[defaultSize]);
                                                const isInactive = s.active === false;
                                                return (
                                                   <div 
    key={`service-${s.service_id}`}
    onClick={isInactive ? undefined : () => addToCart(s.service_id, "service", selectedServiceSizes[s.service_id]?.size || null, s.service_name, selectedServiceSizes[s.service_id]?.price || null)}
    className={`group relative bg-white border-2 border-gray-100 rounded-2xl shadow-md flex flex-col transition-all duration-300 overflow-hidden ${
        isInactive 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:shadow-2xl hover:border-red-200 hover:-translate-y-3 hover:scale-105 cursor-pointer'
    }`}>
    <div className="p-4 flex-grow">
        <div className="text-center mb-3">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
        </div>
       <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{s.service_name}</h3>
{isInactive && <div className="text-xs text-red-600 font-medium mb-2 text-center">No Stocks</div>}
<div className="text-lg font-bold text-red-600 mb-3">₱{Number(defaultPrice).toFixed(2)}</div>
        <div className="mb-3 flex gap-1 flex-wrap justify-center">
            {sizes.map((sz) => {
                const display = sz === "xlarge" ? "XL" : sz === "xxlarge" ? "XXL" : sz.charAt(0).toUpperCase();
                return <button key={sz} className={`px-2 py-1 text-xs border rounded transition-colors ${isInactive ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : selectedServiceSizes[s.service_id]?.size === sz ? "bg-red-800 text-white border-red-800" : "bg-white border-gray-300 hover:bg-gray-50"}`} onClick={(e) => { if (isInactive) return; e.stopPropagation(); selectServiceSize(s.service_id, sz, s[sz]); }} title={isInactive ? 'Currently Unavailable' : `${sz.charAt(0).toUpperCase() + sz.slice(1)} - ₱${parseFloat(s[sz]).toFixed(2)}`} disabled={isInactive}>{display}</button>;
            })}
        </div>
    </div>
</div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ---- Products Only ---- */}
                    {currentSection === "products" && (
                        <section>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">
                                    {searchQuery ? `Product Search Results for "${searchQuery}"` : "Products"}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filterItems(products, 'product').length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-lg font-medium">
                                                {searchQuery ? "No products found" : "No products available"}
                                            </p>
                                        </div>
                                    ) : (
                                        filterItems(products, 'product').map((p) => {
                                            const outOfStock = p.stock <= 0;
                                            const stockBadge = p.stock <= 0 ? "Out" : p.stock;
                                            const stockColor = p.stock <= 0 ? "text-red-600" : p.stock <= 5 ? "text-yellow-600" : "text-green-600";
                                            return (
                                                <div 
                                                    key={`product-${p.product_id}`}
                                                    onClick={() => !outOfStock && addToCart(p.product_id, "product", null, p.name, p.price)}
                                                    className={`group relative bg-white border-2 border-gray-100 rounded-2xl shadow-md flex flex-col transition-all duration-300 overflow-hidden ${
                                                        outOfStock
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "hover:shadow-2xl hover:border-red-200 hover:-translate-y-3 hover:scale-105 cursor-pointer"
                                                    }`}>
                                                    <div className="p-4 flex-grow">
                                                        <div className="text-center mb-3">
                                                            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{p.name}</h3>
                                                        <div className="text-lg font-bold text-red-600 mb-2">₱{parseFloat(p.price).toFixed(2)}</div>
                                                        <div className={`text-xs font-medium ${stockColor}`}>Stock: {stockBadge} {p.unit || "pcs"}</div>
                                                    </div>

                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ---- Services Only ---- */}
                    {currentSection === "services" && (
                        <section>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">
                                    {searchQuery ? `Service Search Results for "${searchQuery}"` : "Services"}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filterItems(services, 'service').length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-gray-500">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <p className="text-lg font-medium">
                                                {searchQuery ? "No services found" : "No services available"}
                                            </p>
                                        </div>
                                   ) : (
    filterItems(services, 'service').map((s) => {
        const sizes = ["small", "medium", "large", "xlarge", "xxlarge"].filter((sz) => s[sz] !== null && s[sz] !== undefined);
        if (sizes.length === 0) return null;
        const defaultSize = selectedServiceSizes[s.service_id]?.size || sizes[0];
        const defaultPrice = selectedServiceSizes[s.service_id]?.price ?? parseFloat(s[defaultSize]);
        const isInactive = s.active === false;
        
        return (
           <div 
            key={`service-${s.service_id}`}
            onClick={isInactive ? undefined : () => addToCart(s.service_id, "service", selectedServiceSizes[s.service_id]?.size || null, s.service_name, selectedServiceSizes[s.service_id]?.price || null)}
            className={`group relative bg-white border-2 border-gray-100 rounded-2xl shadow-md flex flex-col transition-all duration-300 overflow-hidden ${
                isInactive 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-2xl hover:border-red-200 hover:-translate-y-3 hover:scale-105 cursor-pointer'
            }`}>
                                                    <div className="p-4 flex-grow">
                                                        <div className="text-center mb-3">
                                                            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                      <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{s.service_name}</h3>
{isInactive && <div className="text-xs text-red-600 font-medium mb-2 text-center">No Stocks</div>}
<div className="text-lg font-bold text-red-600 mb-3">₱{Number(defaultPrice).toFixed(2)}</div>
                                                        
                                                        {/* Size Selection */}
                                                        <div className="mb-3 flex gap-1 flex-wrap justify-center">
                                                            {sizes.map((sz) => {
                                                                const display = sz === "xlarge" ? "XL" : sz === "xxlarge" ? "XXL" : sz.charAt(0).toUpperCase();
                                                                const isSelected = selectedServiceSizes[s.service_id]?.size === sz;
                                                                return (
                                                                    <button 
                                                                        key={sz} 
                                                                        className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
                                                                            isSelected 
                                                                            ? "bg-red-800 text-white border-red-800 shadow-md" 
                                                                            : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                                                        }`} 
                                                                        onClick={(e) => { 
                                                                            e.stopPropagation(); 
                                                                            selectServiceSize(s.service_id, sz, s[sz]); 
                                                                        }} 
                                                                        title={`${sz.charAt(0).toUpperCase() + sz.slice(1)} - ₱${parseFloat(s[sz]).toFixed(2)}`}>
                                                                        {display}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* Hidden Receipt Template */}
            <div ref={receiptRef} className="hidden">
                {lastOrder && (
                    <div dangerouslySetInnerHTML={{ __html: prepareReceiptHtml(lastOrder) }} />
                )}
            </div>

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

            {/* Side Panel - ORDER SUMMARY */}
<SidePanel 
    cart={cart}
    grandTotal={grandTotal}
    onAddItem={addToCart}
    onRemoveItem={removeFromCart}
    onRemoveAllOfItem={showRemoveItemConfirm}
    onCheckout={checkout}
    isProcessing={isProcessing}
    paymentMethod={paymentMethod}
    setPaymentMethod={setPaymentMethod}
    cashAmount={cashAmount}
    setCashAmount={setCashAmount}
    referenceNumber={referenceNumber}
    setReferenceNumber={setReferenceNumber}
    paymentProofFile={paymentProofFile}
    setPaymentProofFile={setPaymentProofFile}
    lastOrder={lastOrder}
    onPrintReceipt={printReceipt}
    showReceiptInModal={showReceiptInModal}
    setShowReceiptInModal={setShowReceiptInModal}
    prepareReceiptHtml={prepareReceiptHtml}
    orderCompleted={orderCompleted}
    setOrderCompleted={setOrderCompleted}
    onClearCart={showClearCartConfirm}
    products={products}
/>
        </div>
 );
}