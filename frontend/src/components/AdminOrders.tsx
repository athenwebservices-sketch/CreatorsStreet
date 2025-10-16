// components/AdminOrders.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';

interface Order {
  _id: string;
  user: string;
  total: number;
  status: string;
  createdAt: string;
  customer?: string;
  totalAmount?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get(`/api/orders?page=${page}`);
      
      // Handle different response formats
      const ordersData = response.orders || response.data || response;
      const newOrders = Array.isArray(ordersData) ? ordersData : [];
      
      setOrders(newOrders);
      setPagination({
        page: response.page || page,
        limit: response.limit || 20,
        total: response.total || newOrders.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      // Use mock data as fallback
      const mockOrders: Order[] = [
        { _id: 'ORD001', user: 'user1@example.com', total: 129.99, status: 'completed', createdAt: '2023-11-15T10:00:00Z' },
        { _id: 'ORD002', user: 'user2@example.com', total: 89.99, status: 'pending', createdAt: '2023-11-14T15:30:00Z' },
        { _id: 'ORD003', user: 'user3@example.com', total: 199.99, status: 'processing', createdAt: '2023-11-13T09:15:00Z' },
        { _id: 'ORD004', user: 'user4@example.com', total: 49.99, status: 'cancelled', createdAt: '2023-11-12T14:20:00Z' },
        { _id: 'ORD005', user: 'user5@example.com', total: 159.99, status: 'completed', createdAt: '2023-11-11T11:45:00Z' },
      ];
      setOrders(mockOrders);
      setPagination({ page: 1, limit: 20, total: mockOrders.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders(1);
  }, [token]);

  const handleNextPage = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (pagination.page < totalPages) fetchOrders(pagination.page + 1);
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) fetchOrders(pagination.page - 1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="text-white text-2xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3c0052] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Manage Orders</h1>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Total</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">#{order._id}</td>
                    <td className="py-3 px-4 text-white">{order.user}</td>
                    <td className="py-3 px-4 text-white">
                      ${(order.total || order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span className="text-white">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;