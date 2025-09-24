"use client";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        "https://caps-backend-production-c8c5.up.railway.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // session + local storage
        sessionStorage.setItem("isLoggedIn", "1");
        localStorage.setItem("isLoggedIn", Date.now().toString());

        setMessage(data.message || "Login successful ✅");

        // redirect to /pos
        setTimeout(() => {
          window.location.replace("/pos");
        }, 350);
      } else {
        setMessage(data.error || "Login failed ❌");
      }
    } catch (err) {
      console.error("Login error", err);
      setMessage("Server error. Check console.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-7 rounded-xl shadow-lg w-96">
        <h2 className="text-center text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        {message && (
          <p
            className={`text-center mt-3 ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
