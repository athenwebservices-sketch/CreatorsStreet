// /src/containers/LoginContainer.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

import LoginForm from '../components/LoginForm'; // Import the presentational component

function LoginContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError,loginFailure } = useAuth(); // Access auth functions and state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/movies'); // Redirect if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const togglePassword = () => setShowPassword(!showPassword);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = loginForm;

    if (!email || !password) {
      dispatch(loginFailure('Please fill in all fields.'));
      return;
    }

    try {
      await login(email, password); // Call login function from context
      // Redirect or show success message here (e.g., navigate to dashboard)
    } catch (err) {
      // Error is handled in the context, no need to catch it again here
      console.error('Login failed', error);
    }

  };

  const loginWithGoogle = () => {
    if (!window.google || !window.google.accounts?.id) {
      dispatch(loginFailure('Google SDK not loaded. Please try again.'));
      return;
    }
    window.google.accounts.id.prompt();
  };

  const navigateToForgotPassword = () => navigate('/forgot-password');
  const navigateToRegister = () => navigate('/register');

  return (
    <LoginForm
      loginForm={loginForm}
      loading={loading}
      errorMessage={error}
      showPassword={showPassword}
      onChange={onChange}
      togglePassword={togglePassword}
      onSubmit={onSubmit}
      loginWithGoogle={loginWithGoogle}
      navigateToForgotPassword={navigateToForgotPassword}
      navigateToRegister={navigateToRegister}
    />
  );
}

export default LoginContainer;
