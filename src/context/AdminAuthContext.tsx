import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminEmail: string;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_EMAIL = 'afaqfraz9@gmail.com';
const DEFAULT_ADMIN_PASS = 'Afp4753#';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('musfira_admin_auth') === 'true';
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('musfira_admin_email') || DEFAULT_ADMIN_EMAIL;
  });

  const login = async (email: string, pass: string): Promise<boolean> => {
    const inputEmail = email.trim().toLowerCase();
    const storedPass = localStorage.getItem('musfira_admin_pass') || DEFAULT_ADMIN_PASS;
    const storedEmail = (localStorage.getItem('musfira_admin_email') || DEFAULT_ADMIN_EMAIL).toLowerCase();

    // Check credentials against explicit user credentials or stored credentials
    const isEmailValid = inputEmail === 'afaqfraz9@gmail.com' || inputEmail === storedEmail || inputEmail === 'admin';
    const isPassValid = pass === 'Afp4753#' || pass === storedPass;

    if (isEmailValid && isPassValid) {
      setIsAuthenticated(true);
      setAdminEmail('afaqfraz9@gmail.com');
      localStorage.setItem('musfira_admin_auth', 'true');
      localStorage.setItem('musfira_admin_email', 'afaqfraz9@gmail.com');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('musfira_admin_auth');
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    const storedPass = localStorage.getItem('musfira_admin_pass') || DEFAULT_ADMIN_PASS;
    if (oldPass !== storedPass) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    localStorage.setItem('musfira_admin_pass', newPass);
    return { success: true, message: 'Password successfully changed!' };
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminEmail,
        login,
        logout,
        changePassword,
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
