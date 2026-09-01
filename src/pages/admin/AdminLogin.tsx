import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandAssets } from '../../assets/images';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { login, resetPassword } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setIsLoading(true);
      await login(email.trim(), password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Please enter your email above to receive a password reset link.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setIsResetting(true);
      await resetPassword(email.trim());
      setSuccessMsg(`Password reset instructions sent to ${email.trim()}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset email. Ensure the email is registered.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Musfira Store</span>
        </button>

        <div className="flex justify-center items-center mb-4">
          <img
            src={BrandAssets.logo}
            alt="Musfira Admin"
            className="h-16 w-auto object-contain rounded-lg shadow-lg border border-slate-700 bg-black/40 p-1"
            referrerPolicy="no-referrer"
          />
        </div>

        <h2 className="text-3xl font-serif-brand font-bold text-white tracking-wide">
          Musfira Admin Portal
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Firebase Auth & Multi-Channel Store Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700">
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email
              </label>
              <div className="relative rounded-lg border border-slate-600 bg-slate-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email..."
                  autoComplete="off"
                  className="w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {isResetting ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative rounded-lg border border-slate-600 bg-slate-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  autoComplete="new-password"
                  className="w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#2952ff] to-[#1e90ff] hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating with Firebase...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Login to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
