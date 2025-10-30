import BASE_URL from '../config';

// Get auth token from session storage
export const getAuthToken = () => {
  return sessionStorage.getItem('token');
};

// Get user data from session storage
export const getUserData = () => {
  return {
    token: sessionStorage.getItem('token'),
    role: sessionStorage.getItem('role'),
    name: sessionStorage.getItem('name'),
    email: sessionStorage.getItem('email'),
    userId: sessionStorage.getItem('userId'),
    phone: sessionStorage.getItem('phone'),
    kycStatus: sessionStorage.getItem('kycStatus')
  };
};

// Create axios instance with auth header
export const createAuthAxios = () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Make authenticated API call
export const makeAuthenticatedRequest = async (method, endpoint, data = null) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    config.data = data;
  }

  return config;
};

export default {
  getAuthToken,
  getUserData,
  createAuthAxios,
  makeAuthenticatedRequest
};
