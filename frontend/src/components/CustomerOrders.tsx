// components/CustomerOrders.tsx (Updated)
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';

interface Order {
  _id: string;
  total: number;
  totalAmount?: number;
  status: string;
  createdAt: string;
  items?: any[];
  paymentStatus?: string;
  shippingAddress?: any;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Updated to use the correct endpoint - backend will handle user-specific orders
      const response = await apiService.get(`/api/orders?page=${page}`);
      
      // Handle different response formats
      const ordersData = response.orders || response.data || response;
      const newOrders = Array.isArray(ordersData) ? ordersData : [];
      
      setOrders(newOrders);
      setPagination({
        page: response.page || page,
        limit: response.limit || 10,
        total: response.total || newOrders.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      // Use mock data as fallback
      const mockOrders: Order[] = [
        { 
          _id: 'ORD001', 
          total: 1299, 
          status: 'completed', 
          createdAt: '2023-11-15T10:00:00Z',
          items: [
            { name: 'Creators Street T-Shirt', quantity: 2, price: 599 },
            { name: 'Creators Street Cap', quantity: 1, price: 399 }
          ],
          paymentStatus: 'paid',
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001'
          }
        },
        { 
          _id: 'ORD002', 
          total: 999, 
          status: 'processing', 
          createdAt: '2023-11-14T15:30:00Z',
          items: [
            { name: 'Event Pass - General', quantity: 1, price: 999 }
          ],
          paymentStatus: 'paid',
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001'
          }
        },
        { 
          _id: 'ORD003', 
          total: 2499, 
          status: 'pending', 
          createdAt: '2023-11-13T09:15:00Z',
          items: [
            { name: 'Event Pass - VIP', quantity: 1, price: 2499 }
          ],
          paymentStatus: 'paid',
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001'
          }
        },
      ];
      setOrders(mockOrders);
      setPagination({ page: 1, limit: 10, total: mockOrders.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) fetchOrders(1);
  }, [token, user]);

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
      case 'processing':
        return 'bg-blue-500/20 text-blue-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-500/20 text-green-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'failed':
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
          <h1 className="text-3xl font-bold text-white mb-6">My Orders</h1>
          
          {orders.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Items</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Total</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Payment</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">#{order._id}</td>
                        <td className="py-3 px-4 text-white">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-white">
                          {order.items ? order.items.length : 1} item{order.items && order.items.length > 1 ? 's' : ''}
                        </td>
                        <td className="py-3 px-4 text-white">
                          ₹{(order.total || order.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
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
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-300 text-xl mb-4">No orders found</div>
              <p className="text-gray-400 mb-6">You haven't placed any orders yet</p>
              <a
                href="/customer-dashboard/products"
                className="inline-block px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                Browse Products
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;