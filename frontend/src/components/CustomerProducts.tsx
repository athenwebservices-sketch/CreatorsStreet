// components/CustomerProducts.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';
import ProductCard from './ProductCard';
import { debounce } from 'lodash'; // or implement your own debounce function

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const CustomerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  // Memoize categories to avoid recreation on every render
  const categories = useMemo(() => 
    ['all', 'Apparel', 'Accessories', 'Tickets', 'Electronics', 'Collectibles'], 
    []
  );

  // Debounced search function to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setSearchTerm(searchValue);
    }, 300),
    []
  );

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/products?page=${page}&limit=${pagination.limit}`;
      
      // Add category filter if selected
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      
      // Add search term if provided
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await apiService.get(url, token ? { Authorization: `Bearer ${token}` } : {});
      
      // Handle different response formats
      const productsData = response.products || response.data || response;
      const newProducts = Array.isArray(productsData) ? productsData : [];
      
      setProducts(newProducts);
      setPagination({
        page: response.page || page,
        limit: response.limit || pagination.limit,
        total: response.total || newProducts.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      // Use mock data as fallback
      const mockProducts: Product[] = [
        { 
          _id: 'PRD001', 
          name: 'Creators Street T-Shirt', 
          price: 599, 
          stock: 50, 
          category: 'Apparel', 
          description: 'Premium quality t-shirt with Creators Street logo. Made from 100% cotton.',
          image: '/products/tshirt.jpg',
          createdAt: '2023-11-15T10:00:00Z' 
        },
        { 
          _id: 'PRD002', 
          name: 'Gaming Mouse Pad', 
          price: 299, 
          stock: 75, 
          category: 'Accessories', 
          description: 'Large gaming mouse pad with smooth surface and non-slip base.',
          image: '/products/mousepad.jpg',
          createdAt: '2023-11-14T15:30:00Z' 
        },
        { 
          _id: 'PRD003', 
          name: 'Creators Street Hoodie', 
          price: 999, 
          stock: 30, 
          category: 'Apparel', 
          description: 'Comfortable hoodie with front pocket and adjustable hood.',
          image: '/products/hoodie.jpg',
          createdAt: '2023-11-13T09:15:00Z' 
        },
        { 
          _id: 'PRD004', 
          name: 'Event Pass - VIP', 
          price: 2499, 
          stock: 100, 
          category: 'Tickets', 
          description: 'VIP pass for Creators Street event with exclusive access and perks.',
          image: '/products/vip-pass.jpg',
          createdAt: '2023-11-12T14:20:00Z' 
        },
        { 
          _id: 'PRD005', 
          name: 'Event Pass - General', 
          price: 999, 
          stock: 200, 
          category: 'Tickets', 
          description: 'General admission pass for Creators Street event.',
          image: '/products/general-pass.jpg',
          createdAt: '2023-11-11T11:45:00Z' 
        },
        { 
          _id: 'PRD006', 
          name: 'Creators Street Cap', 
          price: 399, 
          stock: 60, 
          category: 'Accessories', 
          description: 'Stylish cap with embroidered Creators Street logo.',
          image: '/products/cap.jpg',
          createdAt: '2023-11-10T16:30:00Z' 
        },
      ];
      setProducts(mockProducts);
      setPagination({ page: 1, limit: pagination.limit, total: mockProducts.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [selectedCategory, searchTerm, token]);

  const handleNextPage = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (pagination.page < totalPages) fetchProducts(pagination.page + 1);
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) fetchProducts(pagination.page - 1);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when changing category
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const currentPage = pagination.page;
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  }, [pagination.page, pagination.total, pagination.limit]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Shop Products</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                aria-label="Search products"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Product categories">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8" role="list">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-xl mb-4">No products found</div>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Enhanced Pagination */}
        {products.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap" role="navigation" aria-label="Pagination">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              Previous
            </button>
            
            {pageNumbers.map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-white">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pagination.page === page
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={pagination.page === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            ))}
            
            <button
              onClick={handleNextPage}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProducts;