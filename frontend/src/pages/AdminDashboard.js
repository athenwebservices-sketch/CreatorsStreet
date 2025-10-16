import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5a67d8;
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
  
  &.pending {
    background: #fff3cd;
    color: #856404;
  }
  
  &.completed {
    background: #d4edda;
    color: #155724;
  }
  
  &.cancelled {
    background: #f8d7da;
    color: #721c24;
  }
`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalOrders: 1234,
      totalRevenue: 45678,
      totalUsers: 890,
      totalProducts: 567
    });

    setRecentOrders([
      { id: 1, customer: 'John Doe', total: 299, status: 'pending', date: '2024-01-15' },
      { id: 2, customer: 'Jane Smith', total: 599, status: 'completed', date: '2024-01-14' },
      { id: 3, customer: 'Bob Johnson', total: 199, status: 'pending', date: '2024-01-14' },
      { id: 4, customer: 'Alice Brown', total: 799, status: 'cancelled', date: '2024-01-13' },
    ]);
  }, []);

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Admin Dashboard</DashboardTitle>
        <ActionButtons>
          <ActionButton to="/admin/products">Manage Products</ActionButton>
          <ActionButton to="/admin/orders">Manage Orders</ActionButton>
          <ActionButton to="/admin/users">Manage Users</ActionButton>
        </ActionButtons>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>📦</StatIcon>
          <StatValue>{stats.totalOrders}</StatValue>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>💰</StatIcon>
          <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>👥</StatIcon>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>🛍️</StatIcon>
          <StatValue>{stats.totalProducts}</StatValue>
          <StatLabel>Total Products</StatLabel>
        </StatCard>
      </StatsGrid>

      <RecentOrders>
        <SectionTitle>Recent Orders</SectionTitle>
        <OrderTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>${order.total}</td>
                <td>
                  <StatusBadge className={order.status}>
                    {order.status}
                  </StatusBadge>
                </td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </OrderTable>
      </RecentOrders>
    </DashboardContainer>
  );
};

export default AdminDashboard;