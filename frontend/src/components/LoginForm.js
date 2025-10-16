// /src/components/LoginForm.js

import React from 'react';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/login.css'


const LoginForm = ({
  loginForm,
  loading,
  errorMessage,
  showPassword,
  onChange,
  togglePassword,
  onSubmit,
  loginWithGoogle,
  navigateToForgotPassword,
  navigateToRegister
}) => (
  <div className="login-container">
    <div className="login-form">
      <h1>LOGIN</h1>
      <form onSubmit={onSubmit}>
        {/* Email Field */}
        <div className="input-group">
          <div className="input-field">
            <span className="icon"><FaEnvelope /></span>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={onChange}
              placeholder="Email Address"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="input-group">
          <div className="input-field">
            <span className="icon"><FaLock /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={loginForm.password}
              onChange={onChange}
              placeholder="Password"
              required
            />
            <button type="button" className="toggle-password" onClick={togglePassword}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="form-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              name="rememberMe"
              checked={loginForm.rememberMe}
              onChange={onChange}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <span className="forgot-password" onClick={navigateToForgotPassword}>
            Forgot Password?
          </span>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" className="login-button-m" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>

        <div className="divider">OR</div>

        <button
          type="button"
          className="google-button"
          onClick={loginWithGoogle}
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : <FaGoogle />}
          Sign in with Google
        </button>

        <div className="register-link">
          Don’t have an account?{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={navigateToRegister}>
            Register here
          </span>
        </div>
      </form>
    </div>
  </div>
);

export default LoginForm;
