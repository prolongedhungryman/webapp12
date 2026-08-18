import React from 'react';
import { useCamp } from '../context/CampContext';
import { CodexBadgeIcon } from './CodexBadgeIcon';
import { Terminal, Shield, LogOut, Code2, Sparkles, RefreshCw, KeyRound } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentStudent,
    isAdminLoggedIn,
    logout,
    openStudentAuth,
    openAdminAuth,
    resetDemoData
  } = useCamp();

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-[#3A3A3C] bg-[#121212]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Cohort Status */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] flex items-center justify-center text-[#0A84FF] shadow-sm">
            <Code2 className="w-5 h-5 text-[#0A84FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-[#F5F5F7]">
                Oxford Secondary School
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#1E1E1E] text-[#8E8E93] border border-[#3A3A3C]">
                Butwal, Nepal
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#8E8E93]">
              <span>Coding Summer Camp</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#3A3A3C]" />
              <span className="text-[#30D158] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse" />
                Summer 2026 Cohort
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Session State */}
        <div className="flex items-center space-x-3">
          {currentStudent ? (
            <div className="flex items-center space-x-3">
              {/* Token ID pill */}
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#1E1E1E] border border-[#3A3A3C] text-xs font-mono text-[#8E8E93]">
                <KeyRound className="w-3.5 h-3.5 text-[#0A84FF]" />
                <span>{currentStudent.tokenId}</span>
              </div>

              {/* CODEX Balance */}
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#1E1E1E] border border-[#3A3A3C] text-xs font-mono font-semibold text-[#F5F5F7]">
                <CodexBadgeIcon size={16} glow />
                <span>{currentStudent.codexBalance}</span>
                <span className="text-[10px] text-[#8E8E93] tracking-wide">CODEX</span>
              </div>

              {/* Student Name */}
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-medium text-[#F5F5F7] leading-tight">
                  {currentStudent.fullName}
                </span>
                <span className="text-[10px] text-[#8E8E93] font-mono">
                  {currentStudent.grade} • {currentStudent.section}
                </span>
              </div>

              {/* Logout Button */}
              <button
                id="btn-student-logout"
                onClick={logout}
                title="Log Out"
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-[#1E1E1E] hover:bg-[#2C2C2E] border border-[#3A3A3C] text-[#8E8E93] hover:text-[#F5F5F7] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          ) : isAdminLoggedIn ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-[#1E1E1E] border border-[#0A84FF]/40 text-xs font-mono text-[#0A84FF]">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold">ADMINISTRATOR</span>
              </div>
              <button
                id="btn-admin-logout"
                onClick={logout}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#1E1E1E] hover:bg-[#2C2C2E] border border-[#3A3A3C] text-[#8E8E93] hover:text-[#F5F5F7] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                id="btn-nav-admin-login"
                onClick={openAdminAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#1E1E1E] hover:bg-[#2C2C2E] border border-[#3A3A3C] text-[#8E8E93] hover:text-[#F5F5F7] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span className="hidden sm:inline">Admin Portal</span>
              </button>
              <button
                id="btn-nav-student-login"
                onClick={openStudentAuth}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#0A84FF] hover:bg-[#0071E3] text-white transition-all shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Student Login</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
