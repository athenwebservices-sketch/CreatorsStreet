import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #2c3e50;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  margin-top: 0.5rem;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px 10px 0 0;
  
  h4 {
    margin: 0;
    font-size: 1rem;
  }
  
  p {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    opacity: 0.9;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }
  
  &:first-child {
    border-radius: 0 0 0 10px;
  }
  
  &:last-child {
    border-radius: 0 0 10px 0;
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #e74c3c;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <ProfileButton onClick={toggleDropdown}>
        <Avatar>{getInitials(user?.name)}</Avatar>
        <span>{user?.name || 'User'}</span>
        <span>▼</span>
      </ProfileButton>
      
      <DropdownMenu isOpen={isOpen}>
        <DropdownHeader>
          <h4>{user?.name || 'User'}</h4>
          <p>{user?.email || 'user@example.com'}</p>
        </DropdownHeader>
        
        <DropdownItem to="/user-profile" onClick={() => setIsOpen(false)}>
          👤 Profile
        </DropdownItem>
        
        <DropdownItem to="/user-dashboard" onClick={() => setIsOpen(false)}>
          📊 Dashboard
        </DropdownItem>
        
        <DropdownItem to="/cart" onClick={() => setIsOpen(false)}>
          🛒 Cart
        </DropdownItem>
        
        <DropdownItem to="/orders" onClick={() => setIsOpen(false)}>
          📦 Orders
        </DropdownItem>
        
        <DropdownItem to="/settings" onClick={() => setIsOpen(false)}>
          ⚙️ Settings
        </DropdownItem>
        
        <LogoutButton onClick={handleLogout}>
          🚪 Logout
        </LogoutButton>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default UserProfileDropdown;