'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
     const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't show navbar and footer on login and register pages
  const hideNavFooter = pathname === '/login' || pathname === '/register';

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {isClient && !hideNavFooter && <Navbar isHovering={isHovering} setIsHovering={setIsHovering} />}
      {children}
      {isClient && !hideNavFooter && <Footer isHovering={isHovering} setIsHovering={setIsHovering} />}
    </div>
  );
};

export default Layout;