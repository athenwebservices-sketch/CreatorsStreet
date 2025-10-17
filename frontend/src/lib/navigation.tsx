// components/SomeComponent.tsx - FIXED
'use client'; // Mark as a Client Component

import { useState, useEffect } from 'react';

export default function SomeComponent() {
  const [width, setWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set a flag to indicate we're on the client side
    setIsClient(true);
    
    // This code only runs on the client
    setWidth(window.innerWidth);
    
    // Optional: Add resize listener
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render anything until we're on the client side
  if (!isClient) {
    return <div>Loading...</div>; // Or a placeholder with the same dimensions
  }

  return <div>My width is {width}</div>;
}