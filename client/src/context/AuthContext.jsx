/**
 * Global Authentication Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careerpath_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('careerpath_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profileRes = await profileAPI.getProfile();
          if (profileRes.data) {
            setProfile(profileRes.data);
          }
        } catch (err) {
          console.warn('Session verification failed, logging out');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { user: userData, token: jwtToken, profile: userProfile } = res.data;
    
    setUser(userData);
    setToken(jwtToken);
    setProfile(userProfile);

    localStorage.setItem('careerpath_token', jwtToken);
    localStorage.setItem('careerpath_user', JSON.stringify(userData));
    return res;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const { user: createdUser, token: jwtToken } = res.data;

    setUser(createdUser);
    setToken(jwtToken);

    localStorage.setItem('careerpath_token', jwtToken);
    localStorage.setItem('careerpath_user', JSON.stringify(createdUser));

    // Fetch fresh profile
    try {
      const pRes = await profileAPI.getProfile();
      setProfile(pRes.data);
    } catch (e) {}

    return res;
  };

  const demoLogin = async () => {
    const res = await authAPI.demoLogin();
    const { user: demoUser, token: jwtToken, profile: demoProfile } = res.data;

    setUser(demoUser);
    setToken(jwtToken);
    setProfile(demoProfile);

    localStorage.setItem('careerpath_token', jwtToken);
    localStorage.setItem('careerpath_user', JSON.stringify(demoUser));

    try {
      const pRes = await profileAPI.getProfile();
      setProfile(pRes.data);
    } catch (e) {}

    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProfile(null);
    localStorage.removeItem('careerpath_token');
    localStorage.removeItem('careerpath_user');
  };

  const refreshProfile = async () => {
    try {
      const pRes = await profileAPI.getProfile();
      setProfile(pRes.data);
      return pRes.data;
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
