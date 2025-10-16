// /src/hooks/useGoogleLogin.js
import { useState } from 'react';
import axios from 'axios';

const useGoogleLogin = (backendBase, navigate, setLoading, setErrorMessage) => {
  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      setErrorMessage('Google sign-in failed: no credential returned.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.post(`${backendBase}/api/auth/google`, {
        id_token: response.credential,
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
      ux_mode: 'popup',
    });
  };

  const loginWithGoogle = () => {
    if (!window.google || !window.google.accounts?.id) {
      setErrorMessage('Google SDK not loaded. Please try again.');
      return;
    }
    window.google.accounts.id.prompt();
  };

  return { loadGoogleScript, initializeGoogleSignIn, loginWithGoogle };
};

export default useGoogleLogin;
