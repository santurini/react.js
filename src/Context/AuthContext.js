import React, { createContext, useState, useEffect } from 'react';
import  secureLocalStorage  from  "react-secure-storage";

// Create a Context for Auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Function to fetch user data based on token
  const fetchUserData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/user/getUserDetails', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // On mount, try to fetch user data if a token exists
  useEffect(() => {
    const token = secureLocalStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Function to clear user data and token on logout
  const clearUser = () => {
    setUser(null);
    secureLocalStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, fetchUserData, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};
