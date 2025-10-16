import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const DashboardTitle = styled.h1`
  color: #2c3e50;
`;

const WelcomeMessage = styled.p`
  color: #7f8c8d;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RecentOrders = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ecf0f1;
  }
  
  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  &.delivered {
    background: #d4edda;
    color: #155724;
  }
  
  &.processing {
    background: #fff3cd;
    color: #856404;
  }
  
  &.shipped {
    background: #cce5ff;
    color: #004085;
  }
`;

const QuickActions = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f8f9fa;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    savedItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Mock user data
    setStats({
      totalOrders: 24,
      totalSpent: 3456,
      pendingOrders: 2,
      savedItems: 8
    });

    setRecentOrders([
      { id: 12345, date: '2024-01-15', total: 299, status: 'delivered', items: 3 },
      { id: 12346, date: '2024-01-12', total: 599, status: 'shipped', items: 2 },
      { id: 12347, date: '2024-01-10', total: 199, status: 'processing', items: 1 },
      { id: 12348, date: '2024-01-08', total: 799, status: 'delivered', items: 4 },
      { id: 12349, date: '2024-01-05', total: 149, status: 'delivered', items: 2 },
    ]);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered': return 'delivered';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      default: return '';
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <div>
          <DashboardTitle>User Dashboard</DashboardTitle>
          <WelcomeMessage>
            Welcome back, {user?.name || 'User'}! Here's an overview of your account.
          </WelcomeMessage>
        </div>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>📦</StatIcon>
          <StatValue>{stats.totalOrders}</StatValue>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>💰</StatIcon>
          <StatValue>${stats.totalSpent}</StatValue>
          <StatLabel>Total Spent</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>⏳</StatIcon>
          <StatValue>{stats.pendingOrders}</StatValue>
          <StatLabel>Pending Orders</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>❤️</StatIcon>
          <StatValue>{stats.savedItems}</StatValue>
          <StatLabel>Saved Items</StatLabel>
        </StatCard>
      </StatsGrid>

      <DashboardContent>
        <RecentOrders>
          <SectionTitle>Recent Orders</SectionTitle>
          <OrderTable>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>${order.total}</td>
                  <td>
                    <StatusBadge className={getStatusClass(order.status)}>
                      {order.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </OrderTable>
        </RecentOrders>

        <QuickActions>
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionButton to="/user-profile">
            👤 Edit Profile
          </ActionButton>
          <ActionButton to="/cart">
            🛒 View Cart
          </ActionButton>
          <ActionButton to="/orders">
            📦 View All Orders
          </ActionButton>
          <ActionButton to="/wishlist">
            ❤️ Wishlist
          </ActionButton>
          <ActionButton to="/settings">
            ⚙️ Account Settings
          </ActionButton>
          <ActionButton to="/store">
            🛍️ Continue Shopping
          </ActionButton>
        </QuickActions>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default UserDashboard;