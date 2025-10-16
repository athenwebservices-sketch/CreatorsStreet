// app/customer-dashboard/page.tsx
import CustomerDashboard from '@/components/CustomerDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute>
      <CustomerDashboard />
    </ProtectedRoute>
  );
}