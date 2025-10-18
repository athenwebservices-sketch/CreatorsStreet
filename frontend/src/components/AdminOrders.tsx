// components/AdminOrders.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import QRCode from 'react-qr-code';

interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  status: string;
  paymentStatus: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  orderDate: string;
}

interface OrdersData {
  page: number;
  limit: number;
  total: number;
  orders: Order[];
}

const AdminOrders = () => {
  const { token } = useAuth();
  const [ordersData, setOrdersData] = useState<OrdersData>({
    page: 1,
    limit: 20,
    total: 0,
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders function
  const fetchOrders = async (page: number = 1, filters: { status?: string; search?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      console.log('Fetching orders with params:', params.toString());
      console.log('Current page:', page);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders?${params}`,
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('API Response:', response.data);

      // Check if response has the expected structure
      if (!response.data || !Array.isArray(response.data.orders)) {
        throw new Error('Invalid API response structure');
      }

      setOrdersData(response.data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
      setOrdersData({ page: 1, limit: 20, total: 0, orders: [] });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders(1, { status: statusFilter, search: searchTerm });
  }, []); // Only run once on mount

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchOrders(newPage, { status: statusFilter, search: searchTerm });
    }
  };

  // Handle filter change
  const handleFilterChange = () => {
    fetchOrders(1, { status: statusFilter, search: searchTerm });
  };

  // Update orders when filters change
  useEffect(() => {
    handleFilterChange();
  }, [statusFilter, searchTerm]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh current page
      fetchOrders(currentPage, { status: statusFilter, search: searchTerm });
      setShowDetails(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const totalPages = Math.ceil(ordersData.total / ordersData.limit);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      paid: 'bg-green-500/20 text-green-300',
      shipped: 'bg-blue-500/20 text-blue-300',
      delivered: 'bg-purple-500/20 text-purple-300',
      cancelled: 'bg-red-500/20 text-red-300',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-500/20 text-gray-300'}`}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      paid: 'bg-green-500/20 text-green-300',
      failed: 'bg-red-500/20 text-red-300',
      refunded: 'bg-gray-500/20 text-gray-300',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-500/20 text-gray-300'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Manage Orders</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order number or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr className="text-white">
                <th className="text-left py-3 px-4">Order Number</th>
                <th className="text-left py-3 px-4">Customer Email</th>
                
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : ordersData.orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                ordersData.orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-mono text-sm">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-white">
                      {order.userId.email}
                    </td>
                    {/* <td className="py-3 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{order.items.length} item(s)</span>
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.productImage}
                              alt={item.productName}
                              className="w-8 h-8 rounded-full border-2 border-[#3c0052]"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#3c0052] flex items-center justify-center text-xs">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </td> */}
                    <td className="py-3 px-4 text-white font-semibold">
                      {order.totalAmount}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    {/* <td className="py-3 px-4">
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </td> */}
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium rounded transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center p-4 bg-black/20">
            <div className="text-white text-sm">
              Showing {((currentPage - 1) * ordersData.limit) + 1} to {Math.min(currentPage * ordersData.limit, ordersData.total)} of {ordersData.total} orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-yellow-400 text-black'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#3c0052] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Order Number</p>
                    <p className="text-white font-mono">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Order Date</p>
                    <p className="text-white">{new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Customer Email</p>
                    <p className="text-white">{selectedOrder.userId.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Order Status</p>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>

                {/* QR Code Section - Only show when status is "paid" */}
                {selectedOrder.status === 'paid' && (
                  <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center">
                    <p className="text-gray-400 text-sm mb-2">Order QR Code</p>
                    <div className="bg-white p-4 rounded-lg">
                      <QRCode 
                        value={selectedOrder._id} 
                        size={150}
                        level="H"
                      />
                    </div>
                    <p className="text-white text-xs mt-2">Order ID: {selectedOrder._id}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-400 text-sm mb-2">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.productName}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity} × {item.price}</p>
                        </div>
                        <p className="text-white font-semibold">{item.quantity * item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span>{selectedOrder.taxAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>{selectedOrder.shippingCost}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span>{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Update Status</p>
                  <div className="flex gap-2">
                    {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        disabled={selectedOrder.status === status}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-yellow-400 hover:bg-yellow-300 text-black'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;