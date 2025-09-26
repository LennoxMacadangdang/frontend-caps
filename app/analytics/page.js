"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, TrendingUp, ShoppingCart, LogOut, CreditCard, Users, BarChart3 } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'https://caps-backend-production-10f9.up.railway.app';

// Sidebar Component with Icons (Updated with logout functionality)
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

// Custom Alert Modal Component (Matching POS style)
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

// Main Analytics Component
export default function SalesAnalytics() {
  const router = useRouter();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [error, setError] = useState(null);

  // Daily sales data for charts
  const [dailySalesData, setDailySalesData] = useState([]);

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

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use your Railway backend API endpoint
      const response = await fetch(`${API_BASE_URL}/sales?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
          // 'Authorization': `Bearer ${token}`
        },
        mode: 'cors', // Explicitly set CORS mode
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // For debugging
      setSalesData(data);
      
      // Generate mock daily data for visualization
      generateDailyData(data.totalSales, data.count);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      // Mock data for demo/fallback
      const mockData = {
        totalSales: 15420.50,
        count: 87,
        filtered: true,
        range: { start: startDate, end: endDate }
      };
      setSalesData(mockData);
      generateDailyData(mockData.totalSales, mockData.count);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyData = (totalSales, totalOrders) => {
    const days = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Create more realistic daily distribution
    let remainingSales = totalSales;
    let remainingOrders = totalOrders;
    
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      
      // For the last day, use remaining amounts to ensure totals match
      if (i === daysDiff) {
        days.push({
          date: date.toISOString().split('T')[0],
          sales: Math.round(remainingSales * 100) / 100,
          orders: remainingOrders,
          avgOrder: remainingOrders > 0 ? Math.round((remainingSales / remainingOrders) * 100) / 100 : 0
        });
      } else {
        // Generate realistic daily variations (0.5x to 1.5x of average)
        const variation = 0.5 + Math.random();
        const avgDailySales = totalSales / (daysDiff + 1);
        const avgDailyOrders = totalOrders / (daysDiff + 1);
        
        const dailySales = Math.min(remainingSales, Math.round(avgDailySales * variation * 100) / 100);
        const dailyOrders = Math.min(remainingOrders, Math.max(1, Math.floor(avgDailyOrders * variation)));
        
        days.push({
          date: date.toISOString().split('T')[0],
          sales: dailySales,
          orders: dailyOrders,
          avgOrder: dailyOrders > 0 ? Math.round((dailySales / dailyOrders) * 100) / 100 : 0
        });
        
        remainingSales -= dailySales;
        remainingOrders -= dailyOrders;
      }
    }
    setDailySalesData(days);
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

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
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Analytics</h1>
            <p className="text-gray-600">Track your sales performance and trends</p>
          </div>

          {/* Date Range Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Date Range</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                onClick={fetchSalesData}
                disabled={loading}
                className="mt-6 px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Update'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Error: {error} (Showing demo data)
            </div>
          )}

          {/* Key Metrics Cards */}
          {salesData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.totalSales)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{salesData.count}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Order</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(salesData.count > 0 ? salesData.totalSales / salesData.count : 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Daily Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dailySalesData.length > 0 ? salesData.totalSales / dailySalesData.length : 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {dailySalesData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Daily Sales Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tickFormatter={(value) => `${value}`} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [`${value}`, 'Sales']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      dot={{ fill: '#dc2626' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Orders Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Orders</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tickFormatter={(value) => Math.round(value)} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [Math.round(value), 'Orders']}
                    />
                    <Bar dataKey="orders" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Summary Table */}
          {salesData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Date Range
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salesData.range ? `${salesData.range.start} to ${salesData.range.end}` : `${startDate} to ${endDate}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total Sales
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(salesData.totalSales)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total Orders
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salesData.count}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Average Order Value
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(salesData.count > 0 ? salesData.totalSales / salesData.count : 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
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
    </div>
  );
}