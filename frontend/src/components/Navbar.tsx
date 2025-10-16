// components/Navbar.tsx (Updated)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const Navbar = ({ isHovering, setIsHovering }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const sections = ["Awards", "Cosplay", "Exhibit With Us", "Events"];

  const handleCloseMenu = (e) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  // Extract user's first name from email or use the full email if no name is available
  const getDisplayName = () => {
    if (!user) return '';
    
    // If user has a name property, use it
    if (user.name) return user.name.split(' ')[0];
    
    // Otherwise, extract name from email (everything before @)
    const emailParts = user.email.split('@');
    if (emailParts.length > 0) {
      return emailParts[0];
    }
    
    return user.email;
  };

  return (
    <div className="relative" onClick={handleCloseMenu}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo First */}
            <Link href="/" className="cursor-pointer group">
              <img
                src="/Logo1.png"
                alt="Creators Street Logo"
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 0 8px white)',
                }}
              />
            </Link>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="text-white"
              >
                <FaBars className="w-6 h-6" />
              </button>
            </div>

            {/* Center: Desktop Nav (after logo) */}
            <div className="hidden md:flex items-center space-x-6">
              {sections.map((item) => (
                <a
                  key={item}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollToSection(item);
                  }}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium cursor-pointer"
                >
                  {item.replace(/([A-Z])/g, ' $1').trim()}
                </a>
              ))}
            </div>

            {/* Right: Social + Join Us + Auth */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://www.instagram.com/creatorsstreet.official"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-purple-600 hover:text-white transition-all duration-300"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/creators-street/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-blue-700 hover:text-white transition-all duration-300"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
              <a
                href="https://chat.whatsapp.com/FsOZBOVFstj4PPSJjHZT4v"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-300"
              >
                Join Us
              </a>
              
              {/* Auth Buttons */}
              {isAuthenticated ? (
                <>
                  <div className="relative group">
                    <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-5 rounded-full transition-colors duration-300 flex items-center">
                      <span className="mr-1">Hi, {getDisplayName()}</span>
                      <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <Link
                        href={user?.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard'}
                        className="block px-4 py-2 text-white hover:bg-white/10 transition-colors rounded-t-lg"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/customer-dashboard/products"
                        className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                      >
                        Browse Products
                      </Link>
                      <Link
                        href="/customer-dashboard/orders"
                        className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                      >
                        My Orders
                      </Link>
                      <div className="border-t border-white/10"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors rounded-b-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-5 rounded-full transition-colors duration-300"
                  >
                    Login
                  </Link>
                  
                  <Link
                    href="/register"
                    className="bg-transparent hover:bg-white/10 text-white font-semibold py-2 px-5 rounded-full border border-white/30 transition-colors duration-300"
                  >
                    Register
                  </Link>
                </>
              )}
              
              {/* Ticket Icon */}
              <a
                href="/tickets"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-yellow-600 hover:text-white transition-all duration-300"
              >
                <FaTicketAlt className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/90 p-4 z-50"
        >
          <div className="flex flex-col space-y-4">
            {/* Logo inside the mobile menu */}
            <div className="mb-6">
              <Link href="/" className="cursor-pointer group">
                <img
                  src="/Logo1.png"
                  alt="Creators Street Logo"
                  className="h-14 w-auto transition-transform duration-300 group-hover:scale-110 mx-auto"
                  style={{
                    filter: 'drop-shadow(0 0 8px white)',
                  }}
                />
              </Link>
            </div>

            {/* Close Button (X) */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white absolute top-4 right-4"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Menu Items */}
            {["Awards", "Cosplay", "Exhibit With Us", "Events"].map((item) => (
              <a
                key={item}
                href=""
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(item);
                  setMobileMenuOpen(false);
                }}
              >
                {item}
              </a>
            ))}

            {/* Auth Buttons for Mobile */}
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              {isAuthenticated ? (
                <>
                  <div className="text-white font-medium py-2">
                    Hi, {getDisplayName()}
                  </div>
                  <Link
                    href={user?.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard'}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-5 rounded-full transition-colors duration-300 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/customer-dashboard/products"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-5 rounded-full transition-colors duration-300 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Products
                  </Link>
                  <Link
                    href="/customer-dashboard/orders"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-5 rounded-full transition-colors duration-300 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent hover:bg-white/10 text-white font-semibold py-2 px-5 rounded-full border border-white/30 transition-colors duration-300 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-5 rounded-full transition-colors duration-300 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  
                  <Link
                    href="/register"
                    className="bg-transparent hover:bg-white/10 text-white font-semibold py-2 px-5 rounded-full border border-white/30 transition-colors duration-300 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Join Us Button */}
            <a
              href="https://chat.whatsapp.com/FsOZBOVFstj4PPSJjHZT4v"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Us
            </a>

            {/* Ticket, Facebook, and LinkedIn in Same Row */}
            <div className="flex items-center space-x-4">
              {/* Facebook Icon */}
              <a
                href="https://www.facebook.com/creatorsstreet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>

              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/company/creators-street/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-blue-700 hover:text-white transition-all duration-300"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>

              {/* Ticket Icon */}
              <a
                href="/tickets"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:bg-yellow-600 hover:text-white transition-all duration-300"
              >
                <FaTicketAlt className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;