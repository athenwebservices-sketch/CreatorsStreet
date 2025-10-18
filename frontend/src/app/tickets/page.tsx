// app/tickets/page.tsx
'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { FaTicketAlt, FaShoppingCart, FaStar } from 'react-icons/fa';

const TicketsPage = () => {
  const [cartItems, setCartItems] = useState<number[]>([]);
  
  // Dummy products data
  const products = [
    {
      id: 1,
      name: "VIP Convention Pass",
      price: 299,
      description: "Get exclusive access to all events, meet & greets, and special merchandise.",
      image: "/ticket-vip.jpg",
      badge: "Limited",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Weekend Pass",
      price: 149,
      description: "Full access to all convention events throughout the weekend.",
      image: "/ticket-weekend.jpg",
      badge: "Popular",
      rating: 4.6,
      reviews: 89
    },
    {
      id: 3,
      name: "Single Day Pass",
      price: 79,
      description: "Access to all convention events for one day of your choice.",
      image: "/ticket-single.jpg",
      badge: null,
      rating: 4.5,
      reviews: 156
    },
    {
      id: 4,
      name: "Creator Workshop Pass",
      price: 199,
      description: "Join exclusive workshops with industry professionals and creators.",
      image: "/ticket-workshop.jpg",
      badge: "New",
      rating: 4.9,
      reviews: 67
    },
    {
      id: 5,
      name: "Cosplay Competition Pass",
      price: 49,
      description: "Enter the cosplay competition or watch as a spectator.",
      image: "/ticket-cosplay.jpg",
      badge: null,
      rating: 4.7,
      reviews: 92
    }
  ];

  const toggleCartItem = (productId: number) => {
    setCartItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar isHovering={false} setIsHovering={() => {}} />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <FaTicketAlt className="text-yellow-400 text-4xl mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Event Tickets
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get your tickets for Creators Street events. Choose from various passes to suit your needs.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-yellow-900/30 z-10"></div>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.src = `https://picsum.photos/seed/ticket${product.id}/600/400.jpg`;
                  }}
                />
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full z-20">
                    {product.badge}
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4 text-sm">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(product.rating) ? "" : "text-gray-600"} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{product.rating} ({product.reviews} reviews)</span>
                </div>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-yellow-400">${product.price}</div>
                  <button
                    onClick={() => toggleCartItem(product.id)}
                    className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                      cartItems.includes(product.id)
                        ? 'bg-yellow-400 text-black'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <FaShoppingCart className="mr-2" />
                    {cartItems.includes(product.id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-8 right-8 bg-gray-900/90 backdrop-blur-md rounded-lg p-4 border border-purple-500/30 max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">Cart Summary</h3>
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                {cartItems.length}
              </div>
            </div>
            <div className="text-sm text-gray-300 mb-3">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Total:</span>
              <span className="text-xl font-bold text-yellow-400">
                ${products.filter(p => cartItems.includes(p.id)).reduce((sum, p) => sum + p.price, 0)}
              </span>
            </div>
            <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded-full transition-colors duration-300">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;