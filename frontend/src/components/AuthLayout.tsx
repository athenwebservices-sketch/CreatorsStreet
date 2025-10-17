// components/AuthLayout.tsx
'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useState } from 'react';
interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar  />
      {children}
    </div>
  );
};

export default AuthLayout;