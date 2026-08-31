import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { api } from '../lib/api';
import { firebaseApi } from '../lib/firebaseApi';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('musfira_admin_token');
    const localUser = localStorage.getItem('musfira_admin_user');

    if (!token && !localUser) {
      setAdmin(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      if (localUser) {
        setAdmin(JSON.parse(localUser));
        setIsAuthenticated(true);
      }
      const user = await api.adminGetMe();
      if (user && user.id) {
        setAdmin(user);
        localStorage.setItem('musfira_admin_user', JSON.stringify(user));
        setIsAuthenticated(true);
      }
    } catch {
      if (localUser) {
        setAdmin(JSON.parse(localUser));
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('musfira_admin_token');
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = firebaseApi.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && !admin) {
        const adminData: AdminUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Musfira Admin',
          email: firebaseUser.email || 'musfirabeautycream@gmail.com',
          role: 'super_admin',
        };
        setAdmin(adminData);
        setIsAuthenticated(true);
        localStorage.setItem('musfira_admin_user', JSON.stringify(adminData));
      }
    });

    checkAuth();
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
    let authSucceeded = false;

    // 1. Try Firebase Auth (Email & Password)
    try {
      const fbUser = await firebaseApi.loginWithEmailPassword(trimmedEmail, password);
      if (fbUser) {
        const adminData: AdminUser = {
          id: fbUser.uid,
          name: fbUser.displayName || trimmedEmail.split('@')[0] || 'Musfira Admin',
          email: fbUser.email || trimmedEmail,
          role: 'super_admin',
        };
        setAdmin(adminData);
        setIsAuthenticated(true);
        localStorage.setItem('musfira_admin_user', JSON.stringify(adminData));
        authSucceeded = true;
      }
    } catch (fbErr: any) {
      console.log('Firebase auth notice:', fbErr.code || fbErr.message);
      // If user doesn't exist yet in Firebase Auth, attempt auto-registration
      if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
        try {
          const newUser = await firebaseApi.registerWithEmailPassword(trimmedEmail, password);
          if (newUser) {
            const adminData: AdminUser = {
              id: newUser.uid,
              name: newUser.displayName || trimmedEmail.split('@')[0] || 'Musfira Admin',
              email: newUser.email || trimmedEmail,
              role: 'super_admin',
            };
            setAdmin(adminData);
            setIsAuthenticated(true);
            localStorage.setItem('musfira_admin_user', JSON.stringify(adminData));
            authSucceeded = true;
          }
        } catch {
          // Continue to backend verification
        }
      }
    }

    // 2. Also authenticate with backend for JWT session
    try {
      const res = await api.adminLogin(trimmedEmail, password);
      if (res && res.token) {
        localStorage.setItem('musfira_admin_token', res.token);
        localStorage.setItem('musfira_admin_user', JSON.stringify(res.admin));
        setAdmin(res.admin);
        setIsAuthenticated(true);
        return true;
      }
    } catch (apiErr: any) {
      if (authSucceeded) {
        // Firebase auth succeeded, generate a client session token
        localStorage.setItem('musfira_admin_token', `fb_${Date.now()}`);
        return true;
      }

      // Check fallback admin credentials (for offline/static deployment mode)
      const isOfficialAdminEmail = 
        trimmedEmail === 'musfirabeautycream@gmail.com' ||
        trimmedEmail === 'admin@musfira.pk' ||
        trimmedEmail === 'qiffie09@gmail.com';

      const isMatchingAdminPass = 
        password === 'admin123' ||
        password === 'MusfiraAdmin2026!';

      if (isOfficialAdminEmail && isMatchingAdminPass) {
        const fallbackAdmin: AdminUser = {
          id: 'admin-official-store',
          name: 'Musfira Store Administrator',
          email: trimmedEmail,
          role: 'super_admin',
        };
        localStorage.setItem('musfira_admin_token', `token_${Date.now()}`);
        localStorage.setItem('musfira_admin_user', JSON.stringify(fallbackAdmin));
        setAdmin(fallbackAdmin);
        setIsAuthenticated(true);
        return true;
      }

      const errorMessage = apiErr?.message?.includes('HTTP') 
        ? 'Invalid admin email or password.' 
        : (apiErr?.message || 'Invalid admin credentials');
      throw new Error(errorMessage);
    }

    if (authSucceeded) {
      localStorage.setItem('musfira_admin_token', `fb_${Date.now()}`);
      return true;
    }

    throw new Error('Invalid email or password. Please check your admin credentials.');
  };

  const resetPassword = async (email: string): Promise<void> => {
    await firebaseApi.sendPasswordReset(email);
  };

  const logout = async () => {
    localStorage.removeItem('musfira_admin_token');
    localStorage.removeItem('musfira_admin_user');
    setAdmin(null);
    setIsAuthenticated(false);
    try {
      await firebaseApi.firebaseSignOut();
    } catch {
      // Ignored
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        login,
        logout,
        resetPassword,
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
