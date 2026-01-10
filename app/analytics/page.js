"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, TrendingUp, ShoppingCart, Sparkles, AlertCircle, Trophy, Package } from 'lucide-react';


// API Configuration
const API_BASE_URL = 'https://caps-backend-production-6879.up.railway.app';

// Sidebar Component with Icons and Logo (Updated with company logo)
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
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-01-31');
  const [error, setError] = useState(null);
  const [insightsError, setInsightsError] = useState(null);
  const [bestProducts, setBestProducts] = useState([]);
  const [bestServices, setBestServices] = useState([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(false);
  const [bestSellersError, setBestSellersError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);
  
  // Appointment analytics state
  const [appointmentData, setAppointmentData] = useState(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState(null);

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
      // Fetch summary data
      const summaryResponse = await fetch(`${API_BASE_URL}/sales?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!summaryResponse.ok) {
        throw new Error(`HTTP error! status: ${summaryResponse.status}`);
      }
      
      const summaryData = await summaryResponse.json();
      console.log('Summary API Response:', summaryData);
      setSalesData(summaryData);
      
      // Fetch daily breakdown data
      const dailyResponse = await fetch(`${API_BASE_URL}/sales/daily?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        console.log('Daily API Response:', dailyData);
        
        if (dailyData.data && Array.isArray(dailyData.data) && dailyData.data.length > 0) {
          // Process real daily data from backend
          const processedData = dailyData.data.map(item => {
            // Handle different date formats from backend
            let dateStr = item.date;
            
            // If date includes time, extract just the date part
            if (dateStr.includes('T')) {
              dateStr = dateStr.split('T')[0];
            }
            
            // Ensure date is in YYYY-MM-DD format
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toISOString().split('T')[0];
            
            return {
              date: formattedDate,
              sales: parseFloat(item.total_sales) || 0,
              orders: parseInt(item.total_orders) || 0,
              avgOrder: item.total_orders > 0 ? parseFloat(item.total_sales) / parseInt(item.total_orders) : 0,
              forecast: null
            };
          });
          
          // Sort by date to ensure correct order
          processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          console.log('Processed daily data:', processedData);
          setDailySalesData(processedData);
        } else {
          // Fallback to generated data if daily endpoint doesn't return expected format
          console.warn('Daily data is empty or has unexpected format:', dailyData);
          generateDailyData(summaryData.totalSales, summaryData.count);
        }
      } else {
        // Fallback to generated data if daily endpoint fails
        console.warn('Daily sales endpoint failed, using generated data');
        generateDailyData(summaryData.totalSales, summaryData.count);
      }
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

    const fetchBestSellers = async () => {
    setBestSellersLoading(true);
    setBestSellersError(null);
    try {
      const [productsRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bestproduct?start=${startDate}&end=${endDate}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
        }),
        fetch(`${API_BASE_URL}/bestservice?start=${startDate}&end=${endDate}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
        })
      ]);

      if (!productsRes.ok || !servicesRes.ok) {
        throw new Error('Failed to fetch best sellers data');
      }

      const productsData = await productsRes.json();
      const servicesData = await servicesRes.json();

      setBestProducts(productsData.data?.slice(0, 10) || []);
      setBestServices(servicesData.data?.slice(0, 10) || []);
    } catch (err) {
      console.error('Best Sellers Error:', err);
      setBestSellersError(err.message);
    } finally {
      setBestSellersLoading(false);
    }
  };
const fetchAppointmentAnalytics = async () => {
    setAppointmentLoading(true);
    setAppointmentError(null);
    try {
      const response = await fetch(`https://caps-backend-production-6879.up.railway.app/appointmentsales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Appointment Analytics Response:', data);
      setAppointmentData(data);
    } catch (err) {
      console.error('Appointment Analytics Error:', err);
      setAppointmentError(err.message);
      // Mock data for fallback
      setAppointmentData({
        summary: {
          totalAppointments: 45,
          totalRevenue: 12500
        },
        trends: {
          dailyTrends: {},
          carSizeTrends: { Small: 15, Medium: 20, Large: 10 },
          serviceTrends: { "Basic Wash": 20, "Premium Detailing": 15, "Full Service": 10 },
          timeSlotTrends: { "09:00 AM": 12, "01:00 PM": 18, "04:00 PM": 15 }
        }
      });
    } finally {
      setAppointmentLoading(false);
    }
  };
     

  const fetchAIInsights = async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/forecastinsight?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('AI Insights Response:', data);
      setAiInsights(data);
    } catch (err) {
      console.error('AI Insights Error:', err);
      setInsightsError(err.message);
      // Mock insights for fallback
      setAiInsights({
        insights: [
          "Top-selling products show consistent demand throughout the period",
          "Weekend sales are 23% higher than weekday averages",
          "Consider bundling complementary services to increase average order value",
          "Peak sales hours are between 2-5 PM - optimize staffing accordingly"
        ],
        aiStatus: "failed"
      });
    } finally {
      setInsightsLoading(false);
    }
  };

  const generateDailyData = (totalSales, totalOrders) => {
  const days = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  let remainingSales = totalSales;
  let remainingOrders = totalOrders;
  
  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (i === daysDiff) {
      days.push({
        date: dateStr,
        sales: Math.round(remainingSales * 100) / 100,
        orders: remainingOrders,
        avgOrder: remainingOrders > 0 ? Math.round((remainingSales / remainingOrders) * 100) / 100 : 0,
        forecast: null
      });
    } else {
      const variation = 0.5 + Math.random();
      const avgDailySales = totalSales / (daysDiff + 1);
      const avgDailyOrders = totalOrders / (daysDiff + 1);
      
      const dailySales = Math.min(remainingSales, Math.round(avgDailySales * variation * 100) / 100);
      const dailyOrders = Math.min(remainingOrders, Math.max(1, Math.floor(avgDailyOrders * variation)));
      
      days.push({
        date: dateStr,
        sales: dailySales,
        orders: dailyOrders,
        avgOrder: dailyOrders > 0 ? Math.round((dailySales / dailyOrders) * 100) / 100 : 0,
        forecast: null
      });
      
      remainingSales -= dailySales;
      remainingOrders -= dailyOrders;
    }
  }
  
  // Add forecast data if available
  if (forecastData?.forecast) {
    const allForecasts = Object.values(forecastData.forecast).flat();
    const forecastByDate = {};
    
    allForecasts.forEach(item => {
      const date = item.date;
      if (!forecastByDate[date]) forecastByDate[date] = 0;
      forecastByDate[date] += item.predicted_revenue || 0;
    });
    
    // Add 7 days of forecast
    for (let i = 1; i <= 7; i++) {
      const forecastDate = new Date(end);
      forecastDate.setDate(end.getDate() + i);
      const dateStr = forecastDate.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        sales: null,
        orders: null,
        avgOrder: null,
        forecast: forecastByDate[dateStr] || 0
      });
    }
  }
  
  setDailySalesData(days);
};

 useEffect(() => {
  fetchSalesData();
  fetchBestSellers();

  fetchAppointmentAnalytics();
}, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with logo and logout functionality */}
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
            <p className="text-gray-600">Track your sales performance and trends with AI-powered insights</p>
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
                onClick={() => {
                  fetchSalesData();
                  fetchBestSellers();
                 
                  fetchAppointmentAnalytics();
                }}
                disabled={loading || bestSellersLoading}
                className="mt-6 px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors disabled:opacity-50"
              >
                {loading || bestSellersLoading ? 'Loading...' : 'Update'}
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
              {/* Daily Sales with Forecast */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Daily Sales</h3>
                  {forecastLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-800"></div>
                      <span>Loading forecast...</span>
                    </div>
                  )}
                </div>
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
                      formatter={(value, name) => [
                        `₱${value.toFixed(2)}`, 
                        name === 'sales' ? 'Actual Sales' : 'Forecasted Sales'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      dot={{ fill: '#dc2626' }}
                      name="sales"
                    />
                    {forecastData && (
                      <Line 
                        type="monotone" 
                        dataKey="forecast" 
                        stroke="#fb923c" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#fb923c' }}
                        name="forecast"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
                {forecastError && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Forecast unavailable
                  </p>
                )}
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

          {/* Best Selling Products & Services Table */}
<div className="bg-white rounded-lg shadow-md p-6 mb-8">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">

      Top Selling Items
    </h3>
    {bestSellersError && (
      <span className="text-sm text-amber-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        Showing demo data
      </span>
    )}
  </div>

  {bestSellersLoading ? (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800"></div>
      <span className="ml-3 text-gray-600">Loading best sellers...</span>
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Products Column */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-red-800">
          <Package className="w-5 h-5 text-red-800" />
          <h4 className="text-lg font-semibold text-gray-800">Products</h4>
        </div>
        <div className="space-y-2">
          {bestProducts.length > 0 ? (
            bestProducts.map((product, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-700' : 
                    'bg-red-800'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium">{product.service_name}</span>
                </div>
                <span className="text-red-800 font-bold">{product.total_orders} sold</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No product data available</p>
          )}
        </div>
      </div>

      {/* Services Column */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-red-800">
          <Sparkles className="w-5 h-5 text-red-800" />
          <h4 className="text-lg font-semibold text-gray-800">Services</h4>
        </div>
        <div className="space-y-2">
          {bestServices.length > 0 ? (
            bestServices.map((service, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-700' : 
                    'bg-red-800'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium">{service.service_name}</span>
                </div>
                <span className="text-red-800 font-bold">{service.total_orders} sold</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No service data available</p>
          )}
        </div>
      </div>
    </div>
  )}
</div>

          {/* Forecasting Insights & Appointment Reports - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Forecasting Insights Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Forecasting & Predictive Insights</h3>
                <button
                  onClick={fetchAIInsights}
                  disabled={insightsLoading}
                  className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {insightsLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
              
              {!aiInsights && !insightsLoading && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Click the button above to generate AI-powered forecasting insights</p>
                </div>
              )}

              {insightsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800"></div>
                  <span className="ml-3 text-gray-600">Analyzing data and generating insights...</span>
                </div>
              )}

              {aiInsights && !insightsLoading && (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {aiInsights.insights && aiInsights.insights.map((insight, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">{insight}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {insightsError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <p className="text-amber-700 text-sm">Note: AI service temporarily unavailable. Showing demo insights.</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500 italic flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Powered by Gemini 2.5 AI
                    </p>
                    <p className="text-xs text-gray-400">
                      Generated: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Reports Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Appointment Reports</h3>
                <button
                  onClick={fetchAppointmentAnalytics}
                  disabled={appointmentLoading}
                  className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {appointmentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Refresh</span>
                    </>
                  )}
                </button>
              </div>

              {appointmentLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800"></div>
                  <span className="ml-3 text-gray-600">Loading appointment data...</span>
                </div>
              )}

              {appointmentData && !appointmentLoading && (
                <div className="space-y-6 max-h-[500px] overflow-y-auto">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-medium text-blue-900">Total Appointments</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{appointmentData.summary.totalAppointments}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-green-900">Total Revenue</p>
                      </div>
                      <p className="text-2xl font-bold text-green-900">{formatCurrency(appointmentData.summary.totalRevenue)}</p>
                    </div>
                  </div>

                  {/* Car Size Trends */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Vehicle Size Distribution
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(appointmentData.trends.carSizeTrends).map(([size, count]) => (
                        <div key={size} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{size}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-600 rounded-full"
                                style={{ width: `${(count / appointmentData.summary.totalAppointments) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Services */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gray-600" />
                      Popular Services
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(appointmentData.trends.serviceTrends)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([service, count], index) => (
                        <div key={service} className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-amber-700' : 
                            'bg-red-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm text-gray-700">{service}</span>
                            <span className="text-sm font-semibold text-red-800">{count} bookings</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Peak Time Slots */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Peak Time Slots
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(appointmentData.trends.timeSlotTrends)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([time, count]) => (
                        <div key={time} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{time}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${(count / appointmentData.summary.totalAppointments) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {appointmentError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <p className="text-amber-700 text-sm">Note: Showing demo data. API connection failed.</p>
                    </div>
                  )}
                </div>
              )}

              {!appointmentData && !appointmentLoading && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Click refresh to load appointment reports</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
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