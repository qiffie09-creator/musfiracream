import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { api } from '../lib/api';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('musfira_admin_token');
    if (!token) {
      setAdmin(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const user = await api.adminGetMe();
      setAdmin(user);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('musfira_admin_token');
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.adminLogin(email, password);
      if (res.token) {
        localStorage.setItem('musfira_admin_token', res.token);
        setAdmin(res.admin);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('musfira_admin_token');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
