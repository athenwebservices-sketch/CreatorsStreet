// components/CustomerOrders.tsx (Enhanced)
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';
import QRCode from 'react-qr-code';

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  paymentStatus: string;
  shippingCost: number;
  status: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  userId: string;
  items?: any[];
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
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user, token } = useAuth();

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Updated to use the correct endpoint - backend will handle user-specific orders
      const response = await apiService.get(`/api/orders?page=${page}`);
      console.log(response)
      // Handle different response formats
      const ordersData = response.orders || response.data || response;
      const newOrders = Array.isArray(ordersData) ? ordersData : [];
      console.log(ordersData)
      setOrders(newOrders);
      setPagination({
        page: response.page || page,
        limit: response.limit || 10,
        total: response.total || newOrders.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      // Use mock data as fallback with updated structure
      const mockOrders: Order[] = [
        { 
          _id: '68f1f7975e48f039d902b5b2',
          orderNumber: 'ORD-1760691171458-G352', 
          orderDate: '2025-10-17T08:52:51.459Z',
          paymentStatus: 'pending',
          shippingCost: 0,
          status: 'paid',
          subtotal: 899,
          taxAmount: 0,
          totalAmount: 899,
          userId: '68f1f7975e48f039d902b5b2',
          items: [
            { 
              productId: 'prod1',
              name: 'Creators Street T-Shirt', 
              quantity: 2, 
              price: 599,
              image: '/images/tshirt.jpg'
            },
            { 
              productId: 'prod2',
              name: 'Creators Street Cap', 
              quantity: 1, 
              price: 399,
              image: '/images/cap.jpg'
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
            phone: '9876543210'
          }
        },
        { 
          _id: '68f1f7975e48f039d902b5b3',
          orderNumber: 'ORD-1760691171459-G353', 
          orderDate: '2025-09-15T14:30:21.123Z',
          paymentStatus: 'paid',
          shippingCost: 50,
          status: 'delivered',
          subtotal: 1299,
          taxAmount: 130,
          totalAmount: 1479,
          userId: '68f1f7975e48f039d902b5b2',
          items: [
            { 
              productId: 'prod3',
              name: 'Creators Hoodie', 
              quantity: 1, 
              price: 1299,
              image: '/images/hoodie.jpg'
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
            phone: '9876543210'
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

  const openQrModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setQrModalOpen(true);
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
    setSelectedOrderId(null);
  };

  const openDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const downloadQRCode = () => {
    if (!selectedOrderId) return;
    
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `order-${selectedOrderId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500/20 text-green-300';
      case 'processing':
      case 'shipped':
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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                      <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">#{order.orderNumber}</td>
                        <td className="py-3 px-4 text-white">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="py-3 px-4 text-white">
                          {order.items ? order.items.length : 1} item{order.items && order.items.length > 1 ? 's' : ''}
                        </td>
                        <td className="py-3 px-4 text-white">
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDetailsModal(order)}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                            >
                              Details
                            </button>
                            {order.status.toLowerCase() === 'paid' && (
                              <button
                                onClick={() => openQrModal(order._id)}
                                className="px-3 py-1 bg-yellow-400 text-black rounded text-sm font-medium hover:bg-yellow-300 transition-colors"
                              >
                                QR
                              </button>
                            )}
                          </div>
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

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Order QR Code</h2>
              <button
                onClick={closeQrModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCode
                  id="qr-code-svg"
                  value={selectedOrderId || ''}
                  size={200}
                  level="H"
                />
              </div>
              
              <p className="text-gray-600 mb-4">Order ID: {selectedOrderId}</p>
              
              <button
                onClick={downloadQRCode}
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium"
              >
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {detailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#3c0052] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={closeDetailsModal}
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
                    <p className="text-white">{formatDate(selectedOrder.orderDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Status</p>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Order Status</p>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Shipping Address</p>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-white font-medium">{selectedOrder.shippingAddress.name}</p>
                      <p className="text-gray-300 text-sm">{selectedOrder.shippingAddress.street}</p>
                      <p className="text-gray-300 text-sm">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                      </p>
                      <p className="text-gray-300 text-sm">Phone: {selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        {/* <img
                          src={item.image || '/images/placeholder.jpg'}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        /> */}
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="text-white font-semibold">₹{item.quantity * item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-white/10 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span>₹{selectedOrder.taxAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>₹{selectedOrder.shippingCost}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  {selectedOrder.status.toLowerCase() === 'paid' && (
                    <button
                      onClick={() => {
                        closeDetailsModal();
                        openQrModal(selectedOrder._id);
                      }}
                      className="w-full px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                    >
                      View QR Code
                    </button>
                  )}
                  {selectedOrder.status.toLowerCase() === 'delivered' && (
                    <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                      Request Return
                    </button>
                  )}
                  {selectedOrder.status.toLowerCase() === 'cancelled' && (
                    <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg opacity-50 cursor-not-allowed font-medium">
                      Order Cancelled
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;