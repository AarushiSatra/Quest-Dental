import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('qd_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('qd_token'))
      .finally(() => setLoading(false));
  }, []);

  function saveSession({ token, user }) {
    localStorage.setItem('qd_token', token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('qd_token');
    setUser(null);
  }

  async function loginWithGoogle(credential) {
    const data = await api.post('/auth/google', { credential });
    saveSession(data);
    return data.user;
  }

  async function loginWithEmail(email, password) {
    const data = await api.post('/auth/login', { email, password });
    saveSession(data);
    return data.user;
  }

  async function signup(name, email, password) {
    const data = await api.post('/auth/signup', { name, email, password });
    saveSession(data);
    return data.user;
  }

  async function updateProfile(updates) {
    const data = await api.patch('/auth/me', updates);
    setUser(data.user);
    return data.user;
  }

  async function requestEmailChangeOtp(newEmail) {
    return api.post('/auth/change-email/request-otp', { newEmail });
  }

  async function changeEmail(otp) {
    const data = await api.patch('/auth/change-email', { otp });
    setUser(data.user);
    return data.user;
  }

  async function requestPasswordChangeOtp() {
    return api.post('/auth/change-password/request-otp', {});
  }

  async function changePassword(otp, newPassword) {
    return api.patch('/auth/change-password', { otp, newPassword });
  }

  async function forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  }

  async function resetPassword(email, otp, newPassword) {
    return api.post('/auth/reset-password', { email, otp, newPassword });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signup,
        updateProfile,
        requestEmailChangeOtp,
        changeEmail,
        requestPasswordChangeOtp,
        changePassword,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}