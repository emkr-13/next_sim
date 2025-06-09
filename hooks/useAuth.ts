import { useState, useEffect } from 'react';

interface User {
  email: string;
  fullname?: string;
  usercreated?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Here you would typically validate the token with your backend
      // For now, we'll just assume the token is valid if it exists
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
  };
} 