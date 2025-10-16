// components/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isLoading) {
        if (!isAuthenticated) {
          console.log('Not authenticated, redirecting to login');
          router.push('/login');
          return;
        }
        
        if (adminOnly && user?.role !== 'admin') {
          console.log('Not admin, redirecting to customer dashboard');
          router.push('/customer-dashboard');
          return;
        }
        
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, user, router, adminOnly]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-[#3c0052] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (adminOnly && user?.role !== 'admin') {
    return null; // Will redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;