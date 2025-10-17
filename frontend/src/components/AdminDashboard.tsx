// components/AdminDashboard.tsx (Updated)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios'; // Added this import
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    // Check if token exists
    if (!token) return;
    setLoading(true);
    console.log(token)
    // Fetch all data in parallel for performance
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers: {'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '', Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',Authorization: `Bearer ${token}` } }),
        ]);

        // Extract arrays safely
        const products = productsRes.data?.products || productsRes.data || [];
        const users = usersRes.data?.users || usersRes.data || [];
        const orders = ordersRes.data?.orders || ordersRes.data || [];
         const totalOrders = ordersRes.data?.total || 0;

console.log('Total Orders:', totalOrders);
        // Calculate total revenue from orders
        const totalRevenue = Array.isArray(orders)
          ? orders.reduce((sum, order) => {
              const total =
                Number(order.totalAmount) ||
                Number(order.total) ||
                0;
              return sum + total;
            }, 0)
          : 0;

        // // Get 5 most recent orders
        // const recent = Array.isArray(orders)
        //   ? orders
        //       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        //       .slice(0, 5)
        //   : [];

        setStats({
          totalOrders: totalOrders,
          totalRevenue,
          totalUsers: users.length,
          totalProducts: products.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="text-white text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'users':
        return <AdminUsers />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.email}!</h2>
              <p className="text-gray-300">Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</div>
                <div className="text-gray-300">Total Orders</div>
              </div>
              
               {/* <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-gray-300">Total Revenue</div>
              </div> */}
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</div>
                <div className="text-gray-300">Total Users</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🛍️</div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalProducts}</div>
                <div className="text-gray-300">Total Products</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
                >
                  View Orders
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="p-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
                >
                  Manage Products
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#3c0052]">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'orders', label: 'Orders', icon: '📦' },
              { id: 'products', label: 'Products', icon: '🛍️' },
              { id: 'users', label: 'Users', icon: '👥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-yellow-400 border-yellow-400'
                    : 'text-gray-300 border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;