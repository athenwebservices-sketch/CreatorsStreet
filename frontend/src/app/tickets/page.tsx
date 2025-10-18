// app/tickets/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';
import { FaTicketAlt, FaStar, FaClock } from 'react-icons/fa';
import Navbar from '@/components/Navbar';

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

const TicketsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get(`/api/products?limit=5&Authorization=Bearer ${token}`);
      
      // Handle different response formats
      const productsData = response.products || response.data || response;
      const newProducts = Array.isArray(productsData) ? productsData : [];
      
      setProducts(newProducts.slice(0, 5)); // Ensure only 5 products are shown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      // Use mock data as fallback
      const mockProducts: Product[] = [
        { 
          _id: 'PRD001', 
          name: 'VIP Convention Pass', 
          price: 299, 
          stock: 50, 
          category: 'Tickets', 
          description: 'Get exclusive access to all events, meet & greets, and special merchandise.',
          image: '/ticket-vip.jpg',
          createdAt: '2023-11-15T10:00:00Z' 
        },
        { 
          _id: 'PRD002', 
          name: 'Weekend Pass', 
          price: 149, 
          stock: 75, 
          category: 'Tickets', 
          description: 'Full access to all convention events throughout the weekend.',
          image: '/ticket-weekend.jpg',
          createdAt: '2023-11-14T15:30:00Z' 
        },
        { 
          _id: 'PRD003', 
          name: 'Single Day Pass', 
          price: 79, 
          stock: 30, 
          category: 'Tickets', 
          description: 'Access to all convention events for one day of your choice.',
          image: '/ticket-single.jpg',
          createdAt: '2023-11-13T09:15:00Z' 
        },
        { 
          _id: 'PRD004', 
          name: 'Creator Workshop Pass', 
          price: 199, 
          stock: 100, 
          category: 'Tickets', 
          description: 'Join exclusive workshops with industry professionals and creators.',
          image: '/ticket-workshop.jpg',
          createdAt: '2023-11-12T14:20:00Z' 
        },
        { 
          _id: 'PRD005', 
          name: 'Cosplay Competition Pass', 
          price: 49, 
          stock: 200, 
          category: 'Tickets', 
          description: 'Enter the cosplay competition or watch as a spectator.',
          image: '/ticket-cosplay.jpg',
          createdAt: '2023-11-11T11:45:00Z' 
        },
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  // Function to determine badge based on stock or category
  const getBadge = (product: Product) => {
    if (product.category === 'Tickets' && product.stock < 50) return 'Limited';
    if (product.category === 'Tickets' && product.stock > 100) return 'Popular';
    if (new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) return 'New';
    return null;
  };

  // Handle Buy Now button click
  const handleBuyNow = () => {
    router.push('/customer-dashboard');
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
    <div className="min-h-screen bg-[#3c0052]">
      {/* Using existing Navbar component */}
      <Navbar isHovering={false} setIsHovering={() => {}} />
      
      <div className="container mx-auto px-4 pt-32 pb-12">
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
                  <span>Valid for entire event duration</span>
                </div>
                
                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-5">
                  <div className="text-2xl font-bold text-yellow-400">₹{product.price}</div>
                  {/* <div className="text-sm text-gray-300 flex items-center">
                    <FaStar className="mr-1 text-yellow-400" />
                    {product.stock > 20 ? `${product.stock} available` : `Only ${product.stock} left`}
                  </div> */}
                </div>
                
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-xl mb-4">No products found</div>
            <p className="text-gray-400">Please try again later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;