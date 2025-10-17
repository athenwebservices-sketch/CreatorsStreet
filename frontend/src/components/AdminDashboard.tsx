// components/AdminDashboard.tsx (Updated)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
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
  const [ordersData, setOrdersData] = useState<any>(null); // Store orders data

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    // Check if token exists
    if (!token) return;
    setLoading(true);
    
    // Fetch all data in parallel for performance
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { 
            headers: { 
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
              Authorization: `Bearer ${token}` 
            } 
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { 
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '', 
              Authorization: `Bearer ${token}` 
            } 
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { 
            headers: { 
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
              Authorization: `Bearer ${token}` 
            } 
          }),
        ]);
        
        // Store orders data for potential use
        setOrdersData(ordersRes.data);
        
        // Extract arrays safely
        const products = productsRes.data?.products || productsRes.data || [];
        const users = usersRes.data?.users || usersRes.data || [];
        const orders = ordersRes.data?.orders || ordersRes.data || [];
        
        // Get total orders from the response
        const totalOrders = ordersRes.data?.total || orders.length || 0;
        
        // Calculate total revenue from orders
        const totalRevenue = Array.isArray(orders)
          ? orders.reduce((sum, order) => {
              const total = Number(order.totalAmount) || 0;
              return sum + total;
            }, 0)
          : 0;

        setStats({
          totalOrders,
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
        return <AdminOrders ordersData={ordersData} />;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</div>
                <div className="text-gray-300">Total Orders</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold text-white mb-1">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-gray-300">Total Revenue</div>
              </div>
              
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

            {/* Recent Orders Table */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Order Number</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Payment Status</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersData?.orders?.slice(0, 5).map((order: any) => (
                      <tr key={order._id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">{order.orderNumber}</td>
                        <td className="py-3 px-4">
                          {order.userId?.firstName && order.userId?.lastName 
                            ? `${order.userId.firstName} ${order.userId.lastName}`
                            : order.userId?.email || 'Unknown'
                          }
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'paid' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">${order.totalAmount}</td>
                        <td className="py-3 px-4">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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