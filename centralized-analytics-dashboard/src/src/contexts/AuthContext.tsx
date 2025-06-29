import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Define types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

interface JwtToken {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  roles: string[];
  permissions: string[];
  exp: number;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check for token on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Validate token
        await validateToken(token);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const validateToken = async (token: string) => {
    try {
      // Decode token
      const decoded = jwt_decode<JwtToken>(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error('Token expired');
      }
      
      // Set user from token
      setUser({
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        roles: decoded.roles,
      });
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Make API call to auth service
      const response = await axios.post('/api/auth/login', { email, password });
      
      // Extract token
      const { accessToken } = response.data;
      
      // Store token
      localStorage.setItem('token', accessToken);
      
      // Validate token and set user
      await validateToken(accessToken);
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    // Remove token from storage
    localStorage.removeItem('token');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };
  
  const hasPermission = (permission: string) => {
    // Mock implementation - in real app, would check user permissions from token
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.roles.includes('admin')) return true;
    
    // Check specific permissions in JWT claims (would be part of user object)
    return false;
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
