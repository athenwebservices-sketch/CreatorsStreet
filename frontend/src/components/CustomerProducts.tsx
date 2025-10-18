// components/CustomerProducts.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';
import { debounce } from 'lodash';
import QRModal from './QRModal';
import RazorpayPayment from './RazorpayPayment';
import { FaTicketAlt, FaStar, FaClock, FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  image?: string;
  createdAt: string;
}

interface CartItem extends Product {
  quantity: number;
}

const CustomerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showLoadingAfterPayment, setShowLoadingAfterPayment] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  
  // Refs to prevent duplicate calls
  const paymentInitiated = useRef(false);
  const qrModalShown = useRef(false);
  
  // Memoize categories
  const categories = useMemo(() => 
    ['all', 'Apparel', 'Accessories', 'Tickets', 'Electronics', 'Collectibles'], 
    []
  );

  // Calculate cart totals
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Check product cart info
  const getProductCartInfo = useCallback((productId: string) => {
    const cartItem = cart.find(item => item._id === productId);
    return {
      isInCart: !!cartItem,
      quantity: cartItem?.quantity || 0
    };
  }, [cart]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/products?limit=20`;
      
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await apiService.get(`${url}&Authorization=Bearer ${token}`);
      
      const productsData = response.products || response.data || response;
      const newProducts = Array.isArray(productsData) ? productsData : [];
      
      setProducts(newProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      // Mock data fallback
      const mockProducts: Product[] = [
        { 
          _id: 'PRD001', 
          name: 'Creators Street T-Shirt', 
          price: 599, 
          category: 'Apparel', 
          description: 'Premium quality t-shirt with exclusive design',
          image: '/products/tshirt.jpg',
          createdAt: '2023-11-15T10:00:00Z' 
        },
        { 
          _id: 'PRD002', 
          name: 'Gaming Mouse Pad', 
          price: 299, 
          category: 'Accessories', 
          description: 'Large gaming mouse pad with smooth surface',
          image: '/products/mousepad.jpg',
          createdAt: '2023-11-14T15:30:00Z' 
        },
        { 
          _id: 'PRD003', 
          name: 'Creators Hoodie', 
          price: 999, 
          category: 'Apparel', 
          description: 'Comfortable hoodie with embroidered logo',
          image: '/products/hoodie.jpg',
          createdAt: '2023-11-13T09:15:00Z' 
        },
        { 
          _id: 'PRD004', 
          name: 'Wireless Earbuds', 
          price: 1499, 
          category: 'Electronics', 
          description: 'High-quality wireless earbuds with noise cancellation',
          image: '/products/earbuds.jpg',
          createdAt: '2023-11-12T14:20:00Z' 
        },
        { 
          _id: 'PRD005', 
          name: 'Collectible Figure', 
          price: 799, 
          category: 'Collectibles', 
          description: 'Limited edition collectible figure',
          image: '/products/figure.jpg',
          createdAt: '2023-11-11T11:45:00Z' 
        },
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, token]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Cart functions
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Checkout
  const handleCheckout = useCallback(() => {
    if (cart.length === 0 || paymentInitiated.current) return;
    
    paymentInitiated.current = true;
    setShowPayment(true);
  }, [cart.length]);

  // Payment success handler
  const handlePaymentSuccess = useCallback((response: any) => {
    console.log('CustomerProducts: Payment success', response);
    
    // Prevent multiple calls
    if (qrModalShown.current) return;
    qrModalShown.current = true;
    
    setOrderId(response.orderId);
    setPaymentError(response.postPaymentError?.message || null);
    clearCart();
    setShowPayment(false);
    setShowCart(false);
    // Show loading state instead of QR modal immediately
    setShowLoadingAfterPayment(true);
    
    // Reset flags after a delay
    setTimeout(() => {
      paymentInitiated.current = false;
    }, 1000);
  }, [clearCart]);

  // Show QR modal after loading
  useEffect(() => {
    if (showLoadingAfterPayment) {
      const timer = setTimeout(() => {
        setShowLoadingAfterPayment(false);
        setShowQRModal(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showLoadingAfterPayment]);

  // Payment failure handler
  const handlePaymentFailure = useCallback((error: any) => {
    console.error('CustomerProducts: Payment failed', error);
    setShowPayment(false);
    paymentInitiated.current = false;
  }, []);

  // Payment dismiss handler
  const handlePaymentDismiss = useCallback(() => {
    setShowPayment(false);
    paymentInitiated.current = false;
  }, []);

  // Close QR modal
  const handleCloseQRModal = useCallback(() => {
    setShowQRModal(false);
    setOrderId('');
    setPaymentError(null);
    qrModalShown.current = false;
    window.location.href = '/customer-dashboard';
  }, []);

  // Category and search handlers
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  // Function to determine badge based on category or creation date
  const getBadge = (product: Product) => {
    if (new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) return 'New';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="text-white text-2xl">Loading products...</div>
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
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Shop Tickets</h1>
          
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium"
          >
            <span className="flex items-center">
              <FaShoppingCart className="w-5 h-5 mr-2" />
              Cart ({cartItemsCount})
            </span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed right-0 top-0 h-full w-80 bg-black/95 backdrop-blur-md z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-white hover:text-yellow-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-300 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item._id} className="bg-white/10 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="text-white hover:text-yellow-400 mr-2"
                            >
                              <FaMinus className="w-4 h-4" />
                            </button>
                            <span className="text-white mx-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="text-white hover:text-yellow-400 ml-2"
                            >
                              <FaPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-white font-medium">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white text-lg">Total:</span>
                      <span className="text-yellow-400 text-xl font-bold">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={paymentInitiated.current}
                      className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {paymentInitiated.current ? 'Processing...' : 'Checkout'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => {
            const { isInCart, quantity } = getProductCartInfo(product._id);
            return (
              <div key={product._id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105">
                {/* Card Header with Icon and Badge */}
                <div className="relative p-6 bg-gradient-to-br from-purple-900/30 to-yellow-900/30">
                  <div className="flex justify-between items-start">
                    <div className="bg-yellow-400/20 p-3 rounded-lg">
                      <FaTicketAlt className="text-yellow-400 text-2xl" />
                    </div>
                    {getBadge(product) && (
                      <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                        {getBadge(product)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                  <p className="text-gray-300 mb-5 text-sm">{product.description}</p>
                  
                  {/* Additional Info */}
                  <div className="flex items-center mb-4 text-sm text-gray-300">
                    <FaClock className="mr-2 text-yellow-400" />
                    <span>Category: {product.category}</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-2xl font-bold text-yellow-400">₹{product.price}</div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  {isInCart ? (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                      >
                        <FaMinus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-medium">{quantity} in cart</span>
                      <button
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-xl mb-4">No products found</div>
            <p className="text-gray-400">Please try again later</p>
          </div>
        )}
      </div>

      {/* Razorpay Payment Component */}
      {showPayment && (
        <RazorpayPayment
          cartItems={cart}
          totalAmount={cartTotal}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onDismiss={handlePaymentDismiss}
        />
      )}

      {/* Loading State After Payment */}
      {showLoadingAfterPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#3c0052] rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Processing Your Order</h2>
            <p className="text-gray-300">Please wait while we confirm your payment and generate your ticket...</p>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <QRModal 
          orderId={orderId} 
          onClose={handleCloseQRModal} 
          error={paymentError}
        />
      )}
    </div>
  );
};

export default CustomerProducts;