"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_BASE = "https://caps-backend-production-4086.up.railway.app";

// Sidebar Component with Icons (Unchanged as requested)
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

// Floating Cart Button Component
function FloatingCartButton({ totalItems, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-red-800 hover:bg-red-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center gap-3 hover:scale-110"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
      {totalItems > 0 && (
        <span className="bg-white text-red-800 px-2 py-1 rounded-full text-sm font-bold min-w-[24px] text-center animate-pulse">
          {totalItems}
        </span>
      )}
    </button>
  );
}

// Cart Modal Component (Enhanced with quantity controls)
function CartModal({ isOpen, onClose, cart, grandTotal, onAddItem, onRemoveItem, onRemoveAllOfItem, onCheckout, isProcessing, paymentMethod, setPaymentMethod, cashAmount, setCashAmount, referenceNumber, setReferenceNumber, paymentProofFile, setPaymentProofFile, lastOrder, onPrintReceipt }) {
    if (!isOpen) return null;

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-red-800 to-red-900 text-white">
                    <h2 className="text-xl font-bold">Shopping Cart</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {groupCartItems(cart).length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                             <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                             </svg>
                             <p className="text-lg font-medium">Your cart is empty</p>
                             <p className="text-sm mt-1">Add some items to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {groupCartItems(cart).map((item) => (
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
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                                            <button onClick={() => onRemoveItem(item.id, item.type, item.size || null)} className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 font-bold transition-colors hover:scale-110">-</button>
                                            <span className="w-8 text-center font-semibold text-gray-700">{item.quantity}</span>
                                            <button onClick={() => onAddItem(item.id, item.type, item.size || null, item.name, item.price)} className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 font-bold transition-colors hover:scale-110">+</button>
                                        </div>

                                        {/* Remove All Button */}
                                        <button onClick={() => onRemoveAllOfItem(item.id, item.type, item.size || null)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors" title="Remove all from cart">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Checkout Section */}
                {groupCartItems(cart).length > 0 && (
                    <div className="border-t p-6 bg-white">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-700">Total:</span>
                                <span className="text-3xl font-bold text-red-800">₱{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
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
                                    className="w-full p-4 pl-14 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm"
                                />
                            </div>

                            {/* Payment Method */}
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm">
                                <option value="cash"> 💵  Cash</option>
                                <option value="gcash"> 📱  GCash</option>
                                <option value="paymaya"> 💳  PayMaya</option>
                                <option value="card"> 💳  Card (upload proof)</option>
                            </select>

                            {paymentMethod === "cash" && (
                                <input type="number" step="0.01" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} placeholder="Cash received" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm" />
                            )}

                            {(paymentMethod === "gcash" || paymentMethod === "paymaya") && (
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                    </div>
                                    <input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="Reference number" className="w-full p-4 pl-10 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-white shadow-sm" />
                                </div>
                            )}

                            {paymentMethod === "card" && (
                                <input type="file" accept="image/*" onChange={(e) => setPaymentProofFile(e.target.files[0] || null)} className="w-full p-4 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all duration-200 bg-white shadow-sm" />
                            )}
                           
                            <div className="flex gap-3">
                                <button disabled={isProcessing} onClick={onCheckout} className={`flex-1 py-4 rounded-xl text-white font-semibold transition-all duration-300 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"}`}>
                                    {isProcessing ? "Processing..." : "Complete Order"}
                                </button>
                                {lastOrder && (
                                    <button onClick={onPrintReceipt} className="py-4 px-6 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" title="Print Last Receipt">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
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
    const receiptRef = useRef(null);

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
            const res = await fetch(`${API_BASE}/products`);
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
            setServices(data || []);
            // initialize default selected sizes
            const map = {};
            (data || []).forEach((s) => {
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
        } catch (err) {
            console.error("loadServices", err);
            showMessage("Failed to load services", "error");
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
            const body = { id, type, quantity: 1, size: size || null };
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
            const res = await fetch(`${API_BASE}/cart/remove-one`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, type, size: size || null }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await loadCart();
            showMessage("Item quantity updated", "success");
        } catch (err) {
            console.error("removeFromCart", err);
            showMessage("Failed to update item quantity", "error");
        }
    }
   
    // NEW: Function to remove all units of a specific item
    async function removeAllOfItemFromCart(id, type, size = null) {
        if (!confirm(`Are you sure you want to remove all units of this item?`)) return;
        try {
            const res = await fetch(`${API_BASE}/cart/remove-item`, {
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

    async function clearCart() {
        if (!confirm("Are you sure you want to clear the cart?")) return;
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
            await loadCart();
            await loadProducts();

            // reset inputs
            const cInput = document.getElementById("customerName");
            if (cInput) cInput.value = "";
            setPaymentProofFile(null);
            setReferenceNumber("");
            setPaymentMethod("cash");
            setCashAmount("");
            setIsCartModalOpen(false);
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
        const itemsHtml = items
            .map(
                (it) =>
                `<li style="margin:5px 0;padding:5px 0;border-bottom:1px dotted #ccc;">${it}</li>`
            )
            .join("");

        const date = new Date(order.order_date || Date.now()).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        return `
            <div style="font-family:Segoe UI, Tahoma, Verdana, sans-serif; color:#333; padding:20px;">
                <h2 style="text-align:center;">Otto Bright - Receipt</h2>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Order ID:</strong> ${order.order_id || "N/A"}</p>
                <p><strong>Customer:</strong> ${order.customer_name || "Walk-in Customer"}</p>
                <p><strong>Items:</strong></p>
                <ul style="padding-left:18px;">${itemsHtml || "<li>No items</li>"}</ul>
                <p><strong>Qty:</strong> ${order.total_quantity || 0}</p>
                <p><strong>Amount:</strong> ₱${parseFloat(order.total_amount || 0).toFixed(2)}</p>
                <p><strong>Payment:</strong> ${order.payment_method_display || ""}</p>
                <p><strong>Cash Received:</strong> ₱${(order.cash_received || 0).toFixed(2)}</p>
                <p><strong>Change:</strong> ₱${(order.change_amount || 0).toFixed(2)}</p>
                ${order.reference_number ? `<p><strong>Ref:</strong> ${order.reference_number}</p>` : ""}
                ${order.payment_proof ? `<div style="margin-top:10px;"><img src="${order.payment_proof}" style="max-width:200px;border:2px solid #e31e24;border-radius:8px;"/></div>` : ""}
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
        setTimeout(() => {
            setMessage(null);
        }, 4000);
    }

    // ---- RENDER ----
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-64 flex-1 transition-all duration-300 ease-in-out">
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

        {/* Right side - Total and Clear Cart */}
        <div className="flex items-center gap-6">
            <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-red-100">
                <div className="text-lg font-semibold text-gray-700">
                    Total: <span className="font-bold text-red-700 text-2xl ml-2">₱{grandTotal.toFixed(2)}</span>
                </div>
            </div>
            <button onClick={clearCart} disabled={cart.length === 0}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    cart.length === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1"
                }`}>
                Clear Cart
            </button>
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
                                                const stockBadge = p.stock <= 0 ? "Out" : p.stock <= 5 ? "Low" : p.stock;
                                                const stockColor = p.stock <= 0 ? "text-red-600" : p.stock <= 5 ? "text-yellow-600" : "text-green-600";
                                                return (
                                                    <div key={`product-${p.product_id}`} className={`bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col transition-all duration-200 ${outOfStock ? "opacity-60" : "hover:shadow-lg hover:border-red-300 hover:-translate-y-1"}`}>
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
                                                        <div className="p-2">
                                                            <button onClick={() => addToCart(p.product_id, "product", null, p.name, p.price)} disabled={outOfStock} className="w-full py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed">Add to Cart</button>
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
                                                return (
                                                    <div key={`service-${s.service_id}`} className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col transition-all duration-200 hover:shadow-lg hover:border-red-300 hover:-translate-y-1">
                                                        <div className="p-4 flex-grow">
                                                            <div className="text-center mb-3">
                                                                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                                                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{s.service_name}</h3>
                                                            <div className="text-lg font-bold text-red-600 mb-3">₱{Number(defaultPrice).toFixed(2)}</div>
                                                            <div className="mb-3 flex gap-1 flex-wrap justify-center">
                                                                {sizes.map((sz) => {
                                                                    const display = sz === "xlarge" ? "XL" : sz === "xxlarge" ? "XXL" : sz.charAt(0).toUpperCase();
                                                                    return <button key={sz} className={`px-2 py-1 text-xs border rounded transition-colors ${selectedServiceSizes[s.service_id]?.size === sz ? "bg-red-800 text-white border-red-800" : "bg-white border-gray-300 hover:bg-gray-50"}`} onClick={(e) => { e.stopPropagation(); selectServiceSize(s.service_id, sz, s[sz]); }} title={`${sz.charAt(0).toUpperCase() + sz.slice(1)} - ₱${parseFloat(s[sz]).toFixed(2)}`}>{display}</button>;
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="p-2">
                                                            <button onClick={() => addToCart(s.service_id, "service", selectedServiceSizes[s.service_id]?.size || null, s.service_name, selectedServiceSizes[s.service_id]?.price || null)} className="w-full py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors text-sm font-medium">Add Service</button>
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
                                            const stockBadge = p.stock <= 0 ? "Out" : p.stock <= 5 ? "Low" : p.stock;
                                            const stockColor = p.stock <= 0 ? "text-red-600" : p.stock <= 5 ? "text-yellow-600" : "text-green-600";
                                            return (
                                                <div key={`product-${p.product_id}`}
                                                  className={`group relative bg-white border-2 border-gray-100 rounded-2xl shadow-md flex flex-col transition-all duration-300 overflow-hidden ${
                                                      outOfStock
                                                      ? "opacity-50"
                                                      : "hover:shadow-2xl hover:border-red-200 hover:-translate-y-3 hover:scale-105"
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
                                                    <div className="p-2">
                                                        <button 
                                                            onClick={() => addToCart(p.product_id, "product", null, p.name, p.price)} 
                                                            disabled={outOfStock} 
                                                            className={`w-full py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                                                                outOfStock 
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                                                : "bg-gradient-to-r from-red-800 to-red-900 text-white hover:from-red-900 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                                            }`}>
                                                            {outOfStock ? "Out of Stock" : "Add to Cart"}
                                                        </button>
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
                                            
                                            return (
                                                <div key={`service-${s.service_id}`} 
                                                    className="group relative bg-white border-2 border-gray-100 rounded-2xl shadow-md flex flex-col transition-all duration-300 overflow-hidden hover:shadow-2xl hover:border-red-200 hover:-translate-y-3 hover:scale-105">
                                                    <div className="p-4 flex-grow">
                                                        <div className="text-center mb-3">
                                                            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{s.service_name}</h3>
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
                                                    <div className="p-2">
                                                        <button 
                                                            onClick={() => addToCart(s.service_id, "service", selectedServiceSizes[s.service_id]?.size || null, s.service_name, selectedServiceSizes[s.service_id]?.price || null)} 
                                                            className="w-full py-2 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-lg hover:from-red-900 hover:to-red-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                                            Add Service
                                                        </button>
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

            {/* Floating Cart Button */}
            <FloatingCartButton 
                totalItems={totalItems} 
                onClick={() => setIsCartModalOpen(true)} 
            />

            {/* Cart Modal */}
            <CartModal 
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
                cart={cart}
                grandTotal={grandTotal}
                onAddItem={addToCart}
                onRemoveItem={removeFromCart}
                onRemoveAllOfItem={removeAllOfItemFromCart}
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
            />

            {/* Hidden Receipt Template */}
            <div ref={receiptRef} className="hidden">
                {lastOrder && (
                    <div dangerouslySetInnerHTML={{ __html: prepareReceiptHtml(lastOrder) }} />
                )}
            </div>
        </div>
    );
}
