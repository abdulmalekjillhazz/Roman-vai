import { useEffect, useRef, useState } from 'react';
import { createAdminApi } from '../api.js';

const api = createAdminApi();

export default function useAdminAuth() {
  const [token, setToken] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminAvatar, setAdminAvatar] = useState('');
  const avatarInputRef = useRef(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    setToken(sessionStorage.getItem('dst_admin_token') || '');
    setAdminUser(sessionStorage.getItem('dst_admin_email') || '');
    setAdminAvatar(localStorage.getItem('dst_admin_avatar') || '');
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Profile photo must be 5 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setAdminAvatar(base64);
        localStorage.setItem('dst_admin_avatar', base64);
      }
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAdminAvatar('');
    localStorage.removeItem('dst_admin_avatar');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await api.post(`/auth/login`, {
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (res.data && res.data.token) {
        sessionStorage.setItem('dst_admin_token', res.data.token);
        sessionStorage.setItem('dst_admin_email', res.data.email);
        setToken(res.data.token);
        setAdminUser(res.data.email);
      } else {
        setLoginError('Authentication failed. Please verify .env credentials.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setLoginError('Email or password is incorrect. Please try again.');
      } else if (err.response?.data?.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError('Sign-in is temporarily unavailable. Please try again in a moment.');
      }
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('dst_admin_token');
    sessionStorage.removeItem('dst_admin_email');
    setToken('');
    setAdminUser('');
    setLoginPassword('');
  }

  return {
    token, adminUser, adminAvatar, avatarInputRef,
    loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    showPassword, setShowPassword, loginError, loginLoading,
    handleLogin, handleLogout, handleAvatarChange, removeAvatar
  };
}
