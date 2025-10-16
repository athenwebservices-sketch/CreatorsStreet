// components/CustomerDashboard.tsx (Updated)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CustomerProducts from './CustomerProducts';
import CustomerOrders from './CustomerOrders';

const CustomerDashboard = () => {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push('/login');
      return;
    }

    // Simulate API call for stats
    const fetchStats = async () => {
      setLoading(true);
      try {
        // In a real app, you would make authenticated API calls here
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalOrders: 5,
          totalSpent: 5296.00,
          pendingOrders: 2,
          completedOrders: 3,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user, router]);

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
      case 'products':
        return <CustomerProducts />;
      case 'orders':
        return <CustomerOrders />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.email}!</h2>
              <p className="text-gray-300">Here's a summary of your recent activity.</p>
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
                <div className="text-3xl font-bold text-white mb-1">₹{stats.totalSpent.toLocaleString()}</div>
                <div className="text-gray-300">Total Spent</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">⏳</div>
                <div className="text-3xl font-bold text-white mb-1">{stats.pendingOrders}</div>
                <div className="text-gray-300">Pending Orders</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-3xl font-bold text-white mb-1">{stats.completedOrders}</div>
                <div className="text-gray-300">Completed Orders</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className="p-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
                >
                  Browse Products
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors"
                >
                  View Orders
                </button>
              </div>
            </div>
  
            {/* Featured Products */}
            {/* <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Featured Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Creators Street T-Shirt', price: 599, image: '/products/tshirt.jpg' },
                  { name: 'Event Pass - VIP', price: 2499, image: '/products/vip-pass.jpg' },
                  { name: 'Gaming Mouse Pad', price: 299, image: '/products/mousepad.jpg' },
                ].map((product, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="aspect-square w-full overflow-hidden bg-white/10 rounded-lg mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-white font-medium mb-1">{product.name}</h4>
                    <div className="text-yellow-400 font-bold">₹{product.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div> */}
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
              <h1 className="text-2xl font-bold text-white">Customer Dashboard</h1>
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
              { id: 'products', label: 'Products', icon: '🛍️' },
              { id: 'orders', label: 'My Orders', icon: '📦' },
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

export default CustomerDashboard;