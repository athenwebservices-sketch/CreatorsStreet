// components/AdminUsers.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/api';

interface User {
  _id: string;
  name?: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get(`/api/users?page=${page}`);
      
      // Handle different response formats
      const usersData = response.users || response.data || response;
      const newUsers = Array.isArray(usersData) ? usersData : [];
      
      setUsers(newUsers);
      setPagination({
        page: response.page || page,
        limit: response.limit || 20,
        total: response.total || newUsers.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      // Use mock data as fallback
      const mockUsers: User[] = [
        { _id: 'USR001', name: 'John Doe', email: 'john@example.com', role: 'customer', isActive: true, createdAt: '2023-11-15T10:00:00Z' },
        { _id: 'USR002', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', isActive: true, createdAt: '2023-11-14T15:30:00Z' },
        { _id: 'USR003', name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', isActive: false, createdAt: '2023-11-13T09:15:00Z' },
        { _id: 'USR004', name: 'Alice Brown', email: 'alice@example.com', role: 'customer', isActive: true, createdAt: '2023-11-12T14:20:00Z' },
        { _id: 'USR005', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'customer', isActive: true, createdAt: '2023-11-11T11:45:00Z' },
      ];
      setUsers(mockUsers);
      setPagination({ page: 1, limit: 20, total: mockUsers.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers(1);
  }, [token]);

  const handleNextPage = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (pagination.page < totalPages) fetchUsers(pagination.page + 1);
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) fetchUsers(pagination.page - 1);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300';
      case 'customer':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/20 text-green-300' 
      : 'bg-red-500/20 text-red-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="text-white text-2xl">Loading users...</div>
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
          <h1 className="text-3xl font-bold text-white mb-6">Manage Users</h1>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white font-semibold">User ID</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Role</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Created</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">#{user._id}</td>
                      <td className="py-3 px-4 text-white">{user.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-white">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.isActive)}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
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

export default AdminUsers;