"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * app/pos/page.js
 * Full React rewrite of your Otto Bright POS logic with test buttons.
 *
 * Notes:
 * - Replace API_BASE if needed.
 * - Keep Tailwind in your project for styling or replace classes with your CSS.
 */

const API_BASE = "https://caps-backend-production-4086.up.railway.app";

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
  const [currentSection, setCurrentSection] = useState("checkout"); // "checkout" | "products" | "services" | "orders"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  const [messageType, setMessageType] = useState("success"); // success | error
  const [isProcessing, setIsProcessing] = useState(false);

  // Last order & receipt
  const [lastOrder, setLastOrder] = useState(null);
  const receiptRef = useRef(null);
  const printButtonRef = useRef(null);

  // Keyboard shortcuts and interval
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        if (!isProcessing && cart.length > 0) checkout();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "delete") {
        e.preventDefault();
        clearCart();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        if (printButtonRef.current && !printButtonRef.current.disabled) {
          e.preventDefault();
          printReceipt();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, isProcessing, lastOrder]);

  // Session guard - redirect to /login if not logged in (uses fallback localStorage)
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
    // initialize
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setGrandTotal(sub); // for now no extra fees
    // disable checkout button if empty handled in UI
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

  // ---- API LOADERS ----
  async function loadProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setProducts(data || []);
      showMessage("Products loaded", "success");
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

      showMessage("Services loaded", "success");
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
      // data.items expected shape: { id, type, name, price, size, quantity }
      setCart(data.items || []);
    } catch (err) {
      console.error("loadCart", err);
      showMessage("Failed to load cart", "error");
    }
  }

  // Initialize main checkout data
  async function initializeApp() {
    showMessage("Welcome to Otto Bright POS System! 🚗", "success");
    try {
      await Promise.all([loadProducts(), loadServices(), loadCart()]);
    } catch (err) {
      console.error("initializeApp", err);
      showMessage("Initialization failed", "error");
    }
  }

  // ---- CART OPERATIONS ----
  async function addToCart(id, type, size = null, name = null, price = null) {
    // visual: temporarily disable repeated clicks via minimal guard is omitted here
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

      // reload cart (server source of truth)
      await loadCart();
      showMessage("Item added to cart! 🎉", "success");
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
      showMessage("Item removed from cart 🗑️", "success");
    } catch (err) {
      console.error("removeFromCart", err);
      showMessage("Failed to remove item", "error");
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

  // select service size (UI-based)
  function selectServiceSize(serviceId, size, price) {
    setSelectedServiceSizes((prev) => ({
      ...prev,
      [serviceId]: { size, price: parseFloat(price) },
    }));
  }

  // ---- CHECKOUT LOGIC ----
  function paymentMethodDisplay(method) {
    const methods = {
      cash: "💵 Cash Payment",
      gcash: "📱 GCash",
      paymaya: "💳 PayMaya",
      card: "💳 Credit/Debit Card",
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
    const btnText = "Processing...";
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

      const orderId =
        "OB-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5).toUpperCase();

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
      showMessage("🎉 Order completed successfully!", "success");

      // prepare receipt content (we will render it below)
      // enable print
      if (printButtonRef.current) printButtonRef.current.disabled = false;

      // reload
      await loadCart();
      await loadProducts();

      // reset inputs
      const cInput = document.getElementById("customerName");
      if (cInput) cInput.value = "";
      setPaymentProofFile(null);
      setReferenceNumber("");
      setPaymentMethod("cash");
      setCashAmount("");

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
              <button onclick="window.print()" style="padding:10px 16px; background:#e31e24; color:white; border:none; border-radius:6px;">🖨️ Print</button>
              <button onclick="window.close()" style="padding:10px 16px; background:#bbb; color:black; border:none; border-radius:6px; margin-left:8px;">Close</button>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
      showMessage("Receipt opened in print window! 🖨️", "success");
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

  // ---- TEST HELPERS ----
  // Add a random product/service for quick testing
  function testAddRandom() {
    if (products && products.length > 0) {
      const p = products[Math.floor(Math.random() * products.length)];
      addToCart(p.product_id, "product", null);
    } else {
      showMessage("No products loaded. Click 'Load Products' first.", "error");
    }
  }
  function testAddRandomService() {
    if (services && services.length > 0) {
      const s = services[Math.floor(Math.random() * services.length)];
      const sizes = ["small", "medium", "large", "xlarge", "xxlarge"].filter(
        (size) => s[size] !== null && s[size] !== undefined
      );
      const chosen = sizes[0] || null;
      addToCart(s.service_id, "service", chosen);
    } else {
      showMessage("No services loaded. Click 'Load Services' first.", "error");
    }
  }

  // ---- RENDER ----
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 bg-white shadow">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen((s) => !s)}
            className="py-1 px-3 bg-blue-600 text-white rounded"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Otto Bright POS</h1>
          <div className="ml-4 flex gap-2">
            <button
              onClick={loadProducts}
              className="py-1 px-3 bg-slate-200 rounded"
            >
              Load Products
            </button>
            <button
              onClick={loadServices}
              className="py-1 px-3 bg-slate-200 rounded"
            >
              Load Services
            </button>
            <button
              onClick={loadCart}
              className="py-1 px-3 bg-slate-200 rounded"
            >
              Load Cart
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm">Items: {totalItems}</div>
          <div className="text-sm">Subtotal: ₱{subtotal.toFixed(2)}</div>
          <button
            onClick={() => {
              sessionStorage.removeItem("isLoggedIn");
              localStorage.removeItem("isLoggedIn");
              router.replace("/login");
            }}
            className="py-1 px-3 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`bg-white w-64 p-4 border-r transition-transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-0"
          }`}
        >
          <nav className="flex flex-col gap-2">
            <button
              className={`nav-item text-left py-2 px-3 rounded ${
                currentSection === "checkout" ? "bg-blue-100" : ""
              }`}
              onClick={() => {
                setCurrentSection("checkout");
                setIsSidebarOpen(false);
              }}
            >
              Checkout
            </button>
            <button
              className={`nav-item text-left py-2 px-3 rounded ${
                currentSection === "products" ? "bg-blue-100" : ""
              }`}
              onClick={() => {
                setCurrentSection("products");
                setIsSidebarOpen(false);
              }}
            >
              Products
            </button>
            <button
              className={`nav-item text-left py-2 px-3 rounded ${
                currentSection === "services" ? "bg-blue-100" : ""
              }`}
              onClick={() => {
                setCurrentSection("services");
                setIsSidebarOpen(false);
              }}
            >
              Services
            </button>

            <div className="mt-4">
              <button
                className="w-full py-2 bg-yellow-400 rounded"
                onClick={testAddRandom}
              >
                Test Add Product
              </button>
              <button
                className="w-full py-2 mt-2 bg-yellow-400 rounded"
                onClick={testAddRandomService}
              >
                Test Add Service
              </button>
              <button
                className="w-full py-2 mt-2 bg-red-400 rounded"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                messageType === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* --- Checkout Section --- */}
          {currentSection === "checkout" && (
            <section id="checkout-section" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Left: product/service grid */}
                <div className="col-span-2 bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold">Products & Services</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentSection("products");
                        }}
                        className="px-3 py-1 bg-slate-100 rounded"
                      >
                        View Products
                      </button>
                      <button
                        onClick={() => {
                          setCurrentSection("services");
                        }}
                        className="px-3 py-1 bg-slate-100 rounded"
                      >
                        View Services
                      </button>
                    </div>
                  </div>

                  <div id="productsGrid" className="grid grid-cols-3 gap-3">
                    {products.length === 0 && services.length === 0 && (
                      <div className="col-span-3 text-center p-10 text-gray-500">
                        No products or services loaded. Use the Load buttons.
                      </div>
                    )}

                    {/* Render products first */}
                    {products.map((p) => {
                      const outOfStock = p.stock <= 0;
                      const stockBadge =
                        p.stock <= 0 ? "Out" : p.stock <= 5 ? "Low" : p.stock;
                      return (
                        <div
                          key={`product-${p.product_id}`}
                          className={`product-card bg-white p-3 rounded shadow-sm cursor-pointer ${
                            outOfStock ? "opacity-60" : ""
                          }`}
                          onClick={() =>
                            !outOfStock &&
                            addToCart(p.product_id, "product", null, p.name, p.price)
                          }
                        >
                          <div className="text-sm text-gray-400">🧴</div>
                          <div className="font-semibold mt-2">{p.name}</div>
                          <div className="mt-1">₱{parseFloat(p.price).toFixed(2)}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            Stock: {stockBadge} {p.unit || "pcs"}
                          </div>
                        </div>
                      );
                    })}

                    {/* Render services */}
                    {services.map((s) => {
                      const sizes = ["small", "medium", "large", "xlarge", "xxlarge"].filter(
                        (sz) => s[sz] !== null && s[sz] !== undefined
                      );
                      if (sizes.length === 0) return null;
                      const defaultSize = selectedServiceSizes[s.service_id]?.size || sizes[0];
                      const defaultPrice =
                        selectedServiceSizes[s.service_id]?.price ?? parseFloat(s[defaultSize]);
                      return (
                        <div
                          key={`service-${s.service_id}`}
                          className="product-card bg-white p-3 rounded shadow-sm"
                        >
                          <div className="text-sm">🚗</div>
                          <div className="font-semibold mt-2">{s.service_name}</div>
                          <div className="mt-1" id={`price-${s.service_id}`}>
                            ₱{Number(defaultPrice).toFixed(2)}
                          </div>

                          <div className="mt-2 flex gap-2 flex-wrap">
                            {sizes.map((sz) => {
                              const display =
                                sz === "xlarge"
                                  ? "X-Large"
                                  : sz === "xxlarge"
                                  ? "XX-Large"
                                  : sz.charAt(0).toUpperCase() + sz.slice(1);
                              return (
                                <button
                                  key={sz}
                                  className={`px-2 py-1 text-xs border rounded ${
                                    selectedServiceSizes[s.service_id]?.size === sz
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-50"
                                  }`}
                                  onClick={() =>
                                    selectServiceSize(s.service_id, sz, s[sz])
                                  }
                                >
                                  {display} - ₱{parseFloat(s[sz]).toFixed(2)}
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-2">
                            <button
                              onClick={() =>
                                addToCart(
                                  s.service_id,
                                  "service",
                                  selectedServiceSizes[s.service_id]?.size || null,
                                  s.service_name,
                                  selectedServiceSizes[s.service_id]?.price || null
                                )
                              }
                              className="w-full py-2 bg-green-500 text-white rounded"
                            >
                              Add Service
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: order summary */}
                <aside className="bg-white p-4 rounded shadow space-y-3 h-fit">
                  <h3 className="font-bold">Order Summary</h3>
                  <div className="text-sm">Items: {totalItems}</div>
                  <div className="text-lg font-semibold">₱{grandTotal.toFixed(2)}</div>

                  <div className="mt-2">
                    <div className="max-h-48 overflow-y-auto">
                      <table className="w-full text-sm">
                        <tbody id="orderTableBody">
                          {groupCartItems(cart).length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-6 text-gray-400">
                                No items in cart
                              </td>
                            </tr>
                          )}
                          {groupCartItems(cart).map((item) => (
                            <tr key={createCartItemKey(item.id, item.type, item.size)}>
                              <td className="py-2">
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  {item.type.toUpperCase()}
                                  {item.size ? ` (${item.size.toUpperCase()})` : ""}
                                </div>
                              </td>
                              <td className="py-2 text-center">{item.quantity}</td>
                              <td className="py-2">₱{parseFloat(item.price).toFixed(2)}</td>
                              <td className="py-2">
                                ₱{(item.quantity * parseFloat(item.price)).toFixed(2)}
                              </td>
                              <td className="py-2">
                                <button
                                  className="text-xs text-red-600"
                                  onClick={() =>
                                    removeFromCart(item.id, item.type, item.size || null)
                                  }
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <input
                      id="customerName"
                      placeholder="Customer name (optional)"
                      className="w-full p-2 border rounded"
                    />
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="cash">Cash</option>
                      <option value="gcash">GCash</option>
                      <option value="paymaya">PayMaya</option>
                      <option value="card">Card (upload proof)</option>
                    </select>

                    {paymentMethod === "cash" && (
                      <input
                        id="cashAmount"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="Cash received"
                        className="w-full p-2 border rounded"
                      />
                    )}

                    {(paymentMethod === "gcash" || paymentMethod === "paymaya") && (
                      <input
                        id="referenceNumber"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Reference number"
                        className="w-full p-2 border rounded"
                      />
                    )}

                    {paymentMethod === "card" && (
                      <input
                        id="paymentProof"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPaymentProofFile(e.target.files[0] || null)}
                        className="w-full"
                      />
                    )}

                    <div className="flex gap-2">
                      <button
                        id="checkoutBtn"
                        disabled={cart.length === 0 || isProcessing}
                        onClick={checkout}
                        className={`flex-1 py-2 rounded text-white font-semibold ${
                          cart.length === 0 || isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isProcessing ? "⏳ Processing..." : "Checkout"}
                      </button>
                      <button
                        id="printBtn"
                        ref={printButtonRef}
                        disabled={!lastOrder}
                        onClick={printReceipt}
                        className="py-2 px-3 bg-amber-400 rounded"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* --- Products List --- */}
          {currentSection === "products" && (
            <section>
              <h2 className="font-bold mb-3">Products</h2>
              <div className="grid grid-cols-4 gap-3">
                {products.map((p) => (
                  <div
                    key={p.product_id}
                    className="bg-white p-3 rounded shadow cursor-pointer"
                    onClick={() => addToCart(p.product_id, "product", null, p.name, p.price)}
                  >
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm">₱{parseFloat(p.price).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- Services List --- */}
          {currentSection === "services" && (
            <section>
              <h2 className="font-bold mb-3">Services</h2>
              <div className="grid grid-cols-3 gap-3">
                {services.map((s) => (
                  <div key={s.service_id} className="bg-white p-3 rounded shadow">
                    <div className="font-semibold">{s.service_name}</div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {["small", "medium", "large", "xlarge", "xxlarge"]
                        .filter((sz) => s[sz] !== null && s[sz] !== undefined)
                        .map((sz) => (
                          <button
                            key={sz}
                            className={`px-2 py-1 text-xs border rounded ${
                              selectedServiceSizes[s.service_id]?.size === sz
                                ? "bg-blue-500 text-white"
                                : "bg-slate-50"
                            }`}
                            onClick={() => selectServiceSize(s.service_id, sz, s[sz])}
                          >
                            {sz.toUpperCase()} - ₱{parseFloat(s[sz]).toFixed(2)}
                          </button>
                        ))}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() =>
                          addToCart(
                            s.service_id,
                            "service",
                            selectedServiceSizes[s.service_id]?.size || null,
                            s.service_name,
                            selectedServiceSizes[s.service_id]?.price || null
                          )
                        }
                        className="w-full py-2 bg-green-500 rounded text-white"
                      >
                        Add Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Hidden receipt area for reference (also used for printing fallback) */}
      <div style={{ display: "none" }}>
        <div id="receipt" ref={receiptRef}>
          {lastOrder ? (
            <div dangerouslySetInnerHTML={{ __html: prepareReceiptHtml(lastOrder) }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
