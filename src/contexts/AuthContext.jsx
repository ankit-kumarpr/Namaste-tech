import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = sessionStorage.getItem('token');
    const refreshToken = sessionStorage.getItem('refreshToken');
    const role = sessionStorage.getItem('role');
    const name = sessionStorage.getItem('name');
    const email = sessionStorage.getItem('email');
    const userId = sessionStorage.getItem('userId');
    const customId = sessionStorage.getItem('customId');
    const phone = sessionStorage.getItem('phone');
    const kycStatus = sessionStorage.getItem('kycStatus');
    const kycRejectionReason = sessionStorage.getItem('kycRejectionReason');

    if (token && role && name) {
      setUser({
        token,
        refreshToken: refreshToken || '',
        role,
        name,
        email: email || '',
        userId: userId || '',
        customId: customId || '',
        phone: phone || '',
        kycStatus: kycStatus || 'pending',
        kycRejectionReason: kycRejectionReason || null
      });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const { token, refreshToken, role, name, email, userId, customId, phone, kycStatus, kycRejectionReason } = userData;
    
    // Store in session storage
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('refreshToken', refreshToken || '');
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('email', email || '');
    sessionStorage.setItem('userId', userId || '');
    sessionStorage.setItem('customId', customId || '');
    sessionStorage.setItem('phone', phone || '');
    sessionStorage.setItem('kycStatus', kycStatus || 'pending');
    sessionStorage.setItem('kycRejectionReason', kycRejectionReason || '');
    
    // Update state
    setUser({ 
      token, 
      refreshToken: refreshToken || '', 
      role, 
      name, 
      email: email || '', 
      userId: userId || '', 
      customId: customId || '', 
      phone: phone || '',
      kycStatus: kycStatus || 'pending',
      kycRejectionReason: kycRejectionReason || null
    });
  };

  const logout = () => {
    // Clear session storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('customId');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('kycStatus');
    sessionStorage.removeItem('kycRejectionReason');
    
    // Clear state
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!user.token;
  };

  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  const updateUserKycStatus = (newKycStatus, newKycRejectionReason = null) => {
    if (user) {
      // Update sessionStorage
      sessionStorage.setItem('kycStatus', newKycStatus);
      if (newKycRejectionReason) {
        sessionStorage.setItem('kycRejectionReason', newKycRejectionReason);
      } else {
        sessionStorage.removeItem('kycRejectionReason');
      }
      
      // Update state
      setUser(prevUser => ({
        ...prevUser,
        kycStatus: newKycStatus,
        kycRejectionReason: newKycRejectionReason
      }));
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    loading,
    updateUserKycStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
