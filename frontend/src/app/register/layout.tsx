// app/register/layout.tsx
import AuthLayout from '@/components/AuthLayout';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}