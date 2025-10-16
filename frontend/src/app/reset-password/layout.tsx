// app/reset-password/layout.tsx
import AuthLayout from '@/components/AuthLayout';

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}