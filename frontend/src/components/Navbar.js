import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import CountdownTimer from './CountdownTimer';
import '../styles/Navbar.css'
import { useSelector } from 'react-redux';

const Navbar = () => {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const userName = user?.displayName || 'User';
  const cartCount = getCartCount();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="logo-container">
            <Link to="/" className="logo">
              <img src="assets/logo/logo.svg" alt="Studio Jatayu Logo" />
            </Link>
          </div>

          {/* Countdown */}
          <div className="countdown-section">
            <CountdownTimer />
          </div>

          {/* Nav Links */}
          <div className="nav-links">
            <Link to="/" className="nav-link">HOME</Link>
            <Link to="/about" className="nav-link">ABOUT</Link>
            <Link to="/projects" className="nav-link">PROJECTS</Link>
            <Link to="/gallery" className="nav-link">GALLERY</Link>
            <Link to="/store" className="nav-link">STORE</Link>
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <div className="right-section">
              <Link to="/cart" className="cart-container">
                <img src="assets/icons/cart.svg" alt="Cart" className="cart-icon" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>

              {!isAuthenticated ? (
                <button className="login-button" onClick={() => navigate('/login')}>
                  LOGIN
                </button>
              ) : (
                <div className="profile-container">
                  <div className="profile-dropdown">
                    <img
                      src="assets/icons/profile.svg"
                      alt="Profile"
                      className="profile-icon"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                    <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                      <div className="dropdown-header">
                        <Link to="/profile" className="username" onClick={() => setIsDropdownOpen(false)}>
                          {userName}
                        </Link>
                      </div>
                      <Link to="/user-dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        ORDERS
                      </Link>
                      <span className="dropdown-item" onClick={handleLogout}>LOGOUT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span className="toggle-icon"></span>
          </button>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-content">
              <div className="mobile-nav-links">
                <Link to="/" onClick={toggleMobileMenu}>HOME</Link>
                <Link to="/about" onClick={toggleMobileMenu}>ABOUT</Link>
                <Link to="/projects" onClick={toggleMobileMenu}>PROJECTS</Link>
                <Link to="/gallery" onClick={toggleMobileMenu}>GALLERY</Link>
                <Link to="/store" onClick={toggleMobileMenu}>STORE</Link>
                <Link to="/cart" onClick={toggleMobileMenu}>CART</Link>
              </div>

              {!isAuthenticated ? (
                <div className="mobile-auth-links">
                  <Link to="/login" onClick={toggleMobileMenu}>LOGIN</Link>
                  <Link to="/register" onClick={toggleMobileMenu}>REGISTER</Link>
                </div>
              ) : (
                <div className="mobile-profile-links">
                  <div className="mobile-user-info">
                    <img src="assets/icons/profile.svg" alt="Profile" className="profile-icon" />
                    <span>{userName}</span>
                  </div>
                  <Link to="/user-dashboard" onClick={toggleMobileMenu}>ORDERS</Link>
                  <span onClick={handleLogout}>LOGOUT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
