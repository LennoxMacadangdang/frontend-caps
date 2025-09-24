"use client";
import { useEffect, useState } from "react";

const API_URL = "https://caps-backend-production-f8d8.up.railway.app/api/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Success message handler
  const showSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  // Error message handler
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setOrders(data);
      showSuccess("Orders refreshed successfully!");
    } catch (err) {
      console.error("Error fetching orders:", err);
      showError("Error fetching orders.");
    }
  };

  // Remove order
  const removeOrder = async (id) => {
    if (!confirm("Are you sure you want to remove this order?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchOrders();
      showSuccess("Order removed successfully!");
    } catch (err) {
      console.error("Error removing order:", err);
      showError("Error removing order.");
    }
  };

  useEffect(() => {
    fetchOrders();
    showSuccess("Welcome to Otto Bright POS Orders Management!");

    const interval = setInterval(fetchOrders, 30000); // auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Orders Management</h1>

      {/* Success/Error messages */}
      {message && (
        <div className="p-3 mb-3 rounded bg-green-500 text-white">{message}</div>
      )}
      {error && (
        <div className="p-3 mb-3 rounded bg-red-500 text-white">{error}</div>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchOrders}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Refresh Orders
      </button>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Payment Method</th>
              <th className="p-2 border">Proof</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.order_id} className="border-b">
                  <td className="p-2 border">{order.order_id}</td>
                  <td className="p-2 border">
                    {new Date(order.order_date).toLocaleString()}
                  </td>
                  <td className="p-2 border">{order.name || "N/A"}</td>
                  <td className="p-2 border">{order.total_quantity || 0}</td>
                  <td className="p-2 border">₱{order.total_amount || 0}</td>
                  <td className="p-2 border">{order.payment_method || "N/A"}</td>
                  <td className="p-2 border">
                    {order.payment_proof ? (
                      <a
                        href={order.payment_proof}
                        target="_blank"
                        className="text-yellow-500 font-bold"
                      >
                        View Proof
                      </a>
                    ) : (
                      <span className="text-gray-400">No Proof</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => removeOrder(order.order_id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
