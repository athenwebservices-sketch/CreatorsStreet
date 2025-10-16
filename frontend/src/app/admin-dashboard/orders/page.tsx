// app/admin-dashboard/orders/page.tsx
import AdminOrders from '@/components/AdminOrders';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-[#3c0052]">
        <div className="bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <a href="/admin-dashboard" className="text-white hover:text-yellow-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
            </div>
          </div>
        </div>
        <AdminOrders />
      </div>
    </ProtectedRoute>
  );
}