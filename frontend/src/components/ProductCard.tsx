// components/ProductCard.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  description?: string;
  image?: string;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  isInCart: boolean;
  cartQuantity: number;
}

const ProductCard = ({ product, onAddToCart, isInCart, cartQuantity }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

  // Show notification helper
  const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      showNotificationMessage('This product is out of stock', 'error');
      return;
    }
    
    if (quantity > product.stock) {
      showNotificationMessage(`Only ${product.stock} items available in stock`, 'error');
      return;
    }
    
    onAddToCart(product, quantity);
    showNotificationMessage(`${product.name} added to cart`, 'success');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl opacity-50">📦</div>
            </div>
          )}

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/80 text-white">
                {product.category}
              </span>
            </div>
          )}

          {/* In Cart Badge */}
          {isInCart && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/80 text-black">
                In Cart ({cartQuantity})
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-yellow-400">
              ₹{product.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Stock: {product.stock}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mb-4">
            <label htmlFor={`quantity-${product._id}`} className="text-white mr-2">Qty:</label>
            <select 
              id={`quantity-${product._id}`}
              value={quantity} 
              onChange={handleQuantityChange}
              className="bg-white/10 border border-white/20 rounded text-white px-2 py-1 mr-2"
              disabled={product.stock <= 0}
            >
              {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num} className="bg-[#3c0052]">{num}</option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-4 font-semibold rounded-lg transition-all duration-300 ${
              product.stock <= 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black hover:shadow-lg'
            }`}
          >
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
          notificationType === 'success' 
            ? 'bg-green-500 text-white'
            : notificationType === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notificationType === 'success' ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : notificationType === 'error' ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notificationMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowNotification(false)}
                className="inline-flex text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;