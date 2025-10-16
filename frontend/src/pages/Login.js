import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const backendBase = ''; // e.g., http://localhost:5000

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setLoginForm(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }

    loadGoogleScript()
      .then(() => initializeGoogleSignIn())
      .catch(err => console.warn('Failed to load Google script', err));
  }, []);

  const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts) return resolve();
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = e => reject(e);
      document.head.appendChild(script);
    });
  };

  const initializeGoogleSignIn = () => {
    if (!window.google || !window.google.accounts?.id) {
      console.warn('Google Identity Services not available');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      callback: handleCredentialResponse,
      ux_mode: 'popup'
    });
  };

  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      setErrorMessage('Google sign-in failed: no credential returned.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.post(`${backendBase}/api/auth/google`, {
        id_token: response.credential
      });

      if (res.data?.success) {
        if (res.data.token) localStorage.setItem('token', res.data.token);
        if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        setErrorMessage(res.data?.message || 'Google login failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Server error during Google login.');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = loginForm;

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      if (rememberMe) localStorage.setItem('rememberedEmail', email);
      else localStorage.removeItem('rememberedEmail');

      const res = await axios.post(`${backendBase}/api/auth/login`, { email, password });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        setErrorMessage(res.data?.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Server error during login.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    if (!window.google || !window.google.accounts?.id) {
      setErrorMessage('Google SDK not loaded. Please try again.');
      return;
    }
    window.google.accounts.id.prompt();
  };

  const navigateToRegister = () => navigate('/register');
  const navigateToForgotPassword = () => navigate('/forgot-password');

  return (
    <div className="login-container">
      <style>{`
        /* --- STYLES --- */
        .login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: black;
  padding: 20px;
}

.login-form {
  background: transparent;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #fff;
}

.login-form h1 {
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.input-group {
  margin-bottom: 25px;
  position: relative;
}

.input-field {
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 0;
  padding: 0 15px;
  height: 50px;
  transition: all 0.3s ease;
  border: none;
  border-bottom: 1px solid #fff;
}

.input-field:hover {
  background: transparent;
  border-bottom-color: rgba(255, 255, 255, 0.8);
}

.icon {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.input-field input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  padding: 0;
  height: 100%;
  outline: none;
}

.input-field input::placeholder {
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
}

.input-underline {
  display: none;
}

.input-underline.error-underline {
  background: #fff;
}

.toggle-password {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 10px;
}

.remember-me input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.remember-me input[type="checkbox"]:checked {
  background: #fff;
  border-color: #fff;
}

.remember-me input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: #000;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.remember-me label {
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
}

.forgot-password {
  color: #fff;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.forgot-password:hover {
  color: rgba(255, 255, 255, 0.8);
}

.error-message {
  color: #fff;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
}

.login-button-m {
  width: 100%;
  height: 50px;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.login-button-m:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.login-button-m:disabled {
  background: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider span {
  color: #fff;
  padding: 0 15px;
  font-size: 0.9rem;
}

.google-button {
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.google-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.google-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.google-icon {
  width: 24px;
  height: 24px;
}

.register-link {
  text-align: center;
  color: #fff;
  font-size: 0.9rem;
}

.register-link span {
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-link span:hover {
  color: rgba(255, 255, 255, 0.8);
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

      `}</style>

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
}

export default Login;
