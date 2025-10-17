// components/CustomerDashboard.tsx (Updated with API calls)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CustomerProducts from './CustomerProducts';
import CustomerOrders from './CustomerOrders';

// Define a type for orders
interface Order {
  _id?: string;
  id?: string;
  orderNumber?: string;
  orderDate?: string;
  createdAt?: string;
  date?: string;
  totalAmount?: number;
  total?: number;
  status?: string;
  paymentStatus?: string;
  userId?: string;
  user?: {
    id?: string;
    _id?: string;
  };
  customerId?: string;
}

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
  // FIXED: Properly typed the recentOrders state
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // FIXED: Add effect to set isMounted to true when component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // In CustomerDashboard.tsx, add this to the existing useEffect hooks
  useEffect(() => {
    // Check for tab parameter in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['dashboard', 'products', 'orders'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    // FIXED: Only run this effect on the client side
    if (!isMounted) return;

    // Check if user is logged in
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel for performance
        const [productsRes, ordersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { 
            headers: { 
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
              Authorization: `Bearer ${token}` 
            } 
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { 
            headers: { 
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
              Authorization: `Bearer ${token}` 
            } 
          }),
        ]);

        // Check if responses are ok
        if (!productsRes.ok || !ordersRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        // Extract arrays safely
        const products = productsData?.products || productsData || [];
        
        // FIXED: Extract orders from the correct property in the API response
        const orders = ordersData?.orders || ordersData || [];

        // Get the user ID using multiple possible property names
        // Using type assertion to bypass TypeScript error
        const userId = (user as any).id || (user as any)._id || (user as any).sub || (user as any).userId;

        // FIXED: Filter orders for the current user using the correct field name
        const userOrders = Array.isArray(orders)
          ? orders.filter(order => 
              order.userId === userId ||
              order.user?.id === userId || 
              order.user === userId || 
              order.customerId === userId ||
              (typeof order.user === 'object' && order.user !== null && (order.user as any)._id === userId)
            )
          : [];

        // Calculate total spent from user's orders
        const totalSpent = userOrders.reduce((sum, order) => {
          const total = Number(order.totalAmount) || Number(order.total) || 0;
          return sum + total;
        }, 0);

        // FIXED: Count pending and completed orders based on the API response structure
        const pendingOrders = userOrders.filter(order => 
          order.status === 'pending' || 
          order.paymentStatus === 'pending' ||
          !order.status
        ).length;
        
        const completedOrders = userOrders.filter(order => 
          order.status === 'completed' || 
          order.status === 'delivered' ||
          order.status === 'paid' ||
          order.paymentStatus === 'paid'
        ).length;

        // Get 5 most recent orders for the user
        // FIXED: Using orderDate from the API response
        const recent = userOrders
          .sort((a, b) => new Date(b.orderDate || b.createdAt || b.date || '').getTime() - new Date(a.orderDate || a.createdAt || a.date || '').getTime())
          .slice(0, 5);

        setStats({
          totalOrders: userOrders.length,
          totalSpent,
          pendingOrders,
          completedOrders,
        });

        setRecentOrders(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, token, router, isMounted]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // FIXED: Show loading state until component is mounted on client
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

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

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-white">{error}</p>
              </div>
            )}

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

            {/* Recent Orders */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-2">Order ID</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Total</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => {
                        // FIXED: Extract date value and check it explicitly
                        const orderDate = order.orderDate || order.createdAt || order.date;
                        return (
                          <tr key={order._id || order.id} className="border-b border-white/10">
                            <td className="py-3 px-2">#{order.orderNumber || order._id || order.id}</td>
                            <td className="py-3 px-2">
                              {orderDate ? new Date(orderDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-3 px-2">₹{(order.totalAmount || order.total || 0).toLocaleString()}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'completed' || 
                                order.status === 'delivered' || 
                                order.status === 'paid' ||
                                order.paymentStatus === 'paid'
                                  ? 'bg-green-500/20 text-green-300' 
                                  : order.status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {order.status || order.paymentStatus || 'pending'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-300 text-center py-4">No recent orders found.</p>
              )}
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