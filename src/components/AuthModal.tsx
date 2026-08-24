import React, { useState } from 'react';
import { useCamp } from '../context/CampContext';
import { KeyRound, Shield, X, AlertCircle, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { CAMP_CLASSES, CAMP_SECTIONS } from '../lib/campOptions';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalTab,
    setAuthModalOpen,
    setAuthModalTab,
    loginStudentWithPassword,
    signupStudent,
    loginAdmin,
  } = useCamp();

  const [studentMode, setStudentMode] = useState<'login' | 'signup'>('login');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [signupName, setSignupName] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupClass, setSignupClass] = useState<string>(CAMP_CLASSES[0]);
  const [signupSection, setSignupSection] = useState<string>(CAMP_SECTIONS[0]);

  // Login fields
  const [loginCode, setLoginCode] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginCode || !loginPassword) {
      setErrorMsg('Please enter your login code and password.');
      return;
    }
    const res = await loginStudentWithPassword(loginCode, loginPassword);
    if (!res.success) {
      setErrorMsg(res.message || 'Login failed.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupCode.trim()) {
      setErrorMsg('Please enter your login code.');
      return;
    }
    if (!signupPassword) {
      setErrorMsg('Please create a password.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your confirm password.');
      return;
    }

    const res = await signupStudent({
      tokenCode: signupCode,
      password: signupPassword,
      fullName: signupName,
      grade: signupClass,
      section: signupSection,
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Registration failed.');
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

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md bg-[#1E1E1E] border border-[#3A3A3C] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header & Portal Switcher */}
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

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF453A]/10 border border-[#FF453A]/30 flex items-start space-x-2.5 text-xs text-[#FF453A]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {authModalTab === 'student' ? (
            <div className="space-y-4">
              {/* Student Mode Selector: Log In vs Sign Up */}
              <div className="flex bg-[#121212] p-1 rounded-lg border border-[#3A3A3C]">
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    studentMode === 'login'
                      ? 'bg-[#0A84FF] text-white shadow-sm'
                      : 'text-[#8E8E93] hover:text-[#F5F5F7]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-all ${
                    studentMode === 'signup'
                      ? 'bg-[#0A84FF] text-white shadow-sm'
                      : 'text-[#8E8E93] hover:text-[#F5F5F7]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up / Register</span>
                </button>
              </div>

              {studentMode === 'login' ? (
                /* Student Log In Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
                  <div>
                    <label htmlFor="login-code" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
                      Login Code *
                    </label>
                    <input
                      id="login-code"
                      type="text"
                      required
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                      placeholder="e.g. 103033"
                      className="w-full px-4 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm font-mono text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-4 pr-10 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#8E8E93] hover:text-[#F5F5F7] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99]"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Dashboard</span>
                  </button>
                </form>
              ) : (
                /* Student Sign Up / Registration Form */
                <form onSubmit={handleSignupSubmit} className="space-y-3.5 pt-2">
                  <div>
                    <label htmlFor="signup-name" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-code" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1">
                      Login Code *
                    </label>
                    <input
                      id="signup-code"
                      type="text"
                      required
                      value={signupCode}
                      onChange={(e) => setSignupCode(e.target.value.toUpperCase())}
                      placeholder="e.g. 103033"
                      className="w-full px-3 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs font-mono text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="signup-password" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1">
                        Password *
                      </label>
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs font-mono text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF]"
                      />
                    </div>

                    <div>
                      <label htmlFor="signup-confirm" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1">
                        Confirm Password *
                      </label>
                      <input
                        id="signup-confirm"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs font-mono text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="signup-class" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1">
                        Class *
                      </label>
                      <select
                        id="signup-class"
                        value={signupClass}
                        onChange={(e) => setSignupClass(e.target.value)}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
                      >
                        {CAMP_CLASSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="signup-section" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1">
                        Section *
                      </label>
                      <select
                        id="signup-section"
                        value={signupSection}
                        onChange={(e) => setSignupSection(e.target.value)}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
                      >
                        {CAMP_SECTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] mt-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Registration & Log In</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Admin Login Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-username" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-2">Username</label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] transition-all"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-10 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#8E8E93] hover:text-[#F5F5F7] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
