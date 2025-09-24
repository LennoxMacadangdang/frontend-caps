"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://caps-backend-production-a67c.up.railway.app";

export default function Appointments() {
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
      const resUpcoming = await axios.get(`${API}/getAllUpcomingAppointments`);
      const resHistory = await axios.get(`${API}/getAllHistoryAppointments`);
      setUpcoming(resUpcoming.data.upcoming_appointments || []);
      setHistory(resHistory.data.history_appointments || []);
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
      await axios.put(`${API}/updateAppointmentStatus/${id}`);
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
      await axios.put(`${API}/cancelAppointment/${id}`);
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
    <div style={{ padding: "20px" }}>
      <h1>📅 Appointments Dashboard</h1>

      <button onClick={fetchAppointments} style={{ marginBottom: "15px" }}>
        🔄 Refresh
      </button>

      {loading && <p>Loading...</p>}

      {/* Upcoming Appointments */}
      <h2>Upcoming Appointments</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "30px" }}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Vehicle</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {upcoming.length === 0 ? (
            <tr>
              <td colSpan="6">No upcoming appointments</td>
            </tr>
          ) : (
            upcoming.map((appt) => (
              <tr key={appt.appointment_id}>
                <td>{appt.service_name}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  {appt.vehicleBrand} {appt.vehicleModel} ({appt.vehicleColor})
                </td>
                <td>₱{appt.price || "N/A"}</td>
                <td>
                  <button onClick={() => completeAppointment(appt.appointment_id)}>✅ Complete</button>
                  <button onClick={() => cancelAppointment(appt.appointment_id)}>❌ Cancel</button>
                  <button onClick={() => openReceipt(appt)}>🧾 Receipt</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* History Appointments */}
      <h2>History</h2>
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Vehicle</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="5">No appointment history</td>
            </tr>
          ) : (
            history.map((appt) => (
              <tr key={appt.appointment_id}>
                <td>{appt.service_name}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  {appt.vehicleBrand} {appt.vehicleModel} ({appt.vehicleColor})
                </td>
                <td>₱{appt.price || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Receipt Modal */}
      {showModal && selectedAppt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeReceipt}
        >
          <div
            style={{ background: "white", padding: "20px", width: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>🧾 Generate Receipt</h2>
            <p>Service: {selectedAppt.service_name}</p>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={printReceipt}>Print</button>
              <button onClick={closeReceipt}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
