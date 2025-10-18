// components/AdminProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  createdAt: string;
  description?: string;
  image?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get(`/api/products?page=${page}`);
      
      // Handle different response formats
      const productsData = response.products || response.data || response;
      const newProducts = Array.isArray(productsData) ? productsData : [];
      
      setProducts(newProducts);
      setPagination({
        page: response.page || page,
        limit: response.limit || 20,
        total: response.total || newProducts.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      // Use mock data as fallback
      const mockProducts: Product[] = [
        { _id: 'PRD001', name: 'Gaming Keyboard', price: 89.99, stock: 50, category: 'Electronics', createdAt: '2023-11-15T10:00:00Z' },
        { _id: 'PRD002', name: 'Wireless Mouse', price: 49.99, stock: 75, category: 'Electronics', createdAt: '2023-11-14T15:30:00Z' },
        { _id: 'PRD003', name: 'Gaming Headset', price: 129.99, stock: 30, category: 'Electronics', createdAt: '2023-11-13T09:15:00Z' },
        { _id: 'PRD004', name: 'Monitor Stand', price: 39.99, stock: 100, category: 'Accessories', createdAt: '2023-11-12T14:20:00Z' },
        { _id: 'PRD005', name: 'Desk Lamp', price: 29.99, stock: 60, category: 'Accessories', createdAt: '2023-11-11T11:45:00Z' },
      ];
      setProducts(mockProducts);
      setPagination({ page: 1, limit: 20, total: mockProducts.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts(1);
  }, [token]);

  const handleNextPage = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (pagination.page < totalPages) fetchProducts(pagination.page + 1);
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) fetchProducts(pagination.page - 1);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-400';
    if (stock < 10) return 'text-yellow-400';
    return 'text-green-400';
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
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Manage Products</h1>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white font-semibold">Product ID</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Price</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Category</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">#{product._id}</td>
                    <td className="py-3 px-4 text-white font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-white">{product.price.toLocaleString()}</td>
                    <td className={`py-3 px-4 font-semibold ${getStockColor(product.stock)}`}>
                      {product.stock}
                    </td>
                    <td className="py-3 px-4 text-white">{product.category || 'N/A'}</td>
                    <td className="py-3 px-4 text-white">
                      {new Date(product.createdAt).toLocaleDateString()}
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

export default AdminProducts;