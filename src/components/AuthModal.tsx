import React, { useState } from 'react';
import { useCamp } from '../context/CampContext';
import { KeyRound, Shield, X, ArrowRight, AlertCircle, Sparkles, Check } from 'lucide-react';
import { CodexBadgeIcon } from './CodexBadgeIcon';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalTab,
    setAuthModalOpen,
    setAuthModalTab,
    loginWithToken,
    loginAdmin,
    tokens
  } = useCamp();

  const [tokenInput, setTokenInput] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = loginWithToken(tokenInput);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid access token.');
    } else {
      setTokenInput('');
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await loginAdmin(adminUser, adminPass);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid credentials.');
    } else {
      setAdminUser('');
      setAdminPass('');
    }
  };

  const quickFillToken = (t: string) => {
    setTokenInput(t);
    setErrorMsg(null);
  };

  const fillAdminCredentials = () => {
    setAdminUser('admin');
    setAdminPass('');
    setErrorMsg(null);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md bg-[#1E1E1E] border border-[#3A3A3C] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header & Tabs */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#3A3A3C]">
          <div className="flex items-center space-x-1.5 p-1 bg-[#121212] rounded-lg border border-[#3A3A3C]">
            <button
              id="tab-student-access"
              type="button"
              onClick={() => {
                setAuthModalTab('student');
                setErrorMsg(null);
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                authModalTab === 'student'
                  ? 'bg-[#1E1E1E] text-[#F5F5F7] shadow-sm border border-[#3A3A3C]'
                  : 'text-[#8E8E93] hover:text-[#F5F5F7]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span>Student Access</span>
            </button>
            <button
              id="tab-admin-portal"
              type="button"
              onClick={() => {
                setAuthModalTab('admin');
                setErrorMsg(null);
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                authModalTab === 'admin'
                  ? 'bg-[#1E1E1E] text-[#F5F5F7] shadow-sm border border-[#3A3A3C]'
                  : 'text-[#8E8E93] hover:text-[#F5F5F7]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span>Admin Portal</span>
            </button>
          </div>

          <button
            id="btn-close-auth-modal"
            onClick={() => setAuthModalOpen(false)}
            className="p-1 rounded-md text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-[#2C2C2E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF453A]/10 border border-[#FF453A]/30 flex items-start space-x-2.5 text-xs text-[#FF453A]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {authModalTab === 'student' ? (
            /* Student Access Form */
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="token-input"
                  className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-2"
                >
                  Access Token ID
                </label>
                <div className="relative">
                  <input
                    id="token-input"
                    type="text"
                    required
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                    placeholder="e.g. OXF-2026-A891"
                    className="w-full px-4 py-3 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm font-mono text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all"
                  />
                  <div className="absolute right-3 top-3 text-[#505054]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-[#8E8E93]">
                  Enter the single-use token provided upon your camp enrollment.
                </p>
              </div>

              <button
                id="btn-enter-dashboard"
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99]"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Admin Login Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-2"
                >
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-2"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all font-mono"
                />
              </div>

              <button
                id="btn-admin-login-submit"
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99]"
              >
                <Shield className="w-4 h-4" />
                <span>Login as Administrator</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
