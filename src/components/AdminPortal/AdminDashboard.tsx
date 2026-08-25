import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { MetricsBar } from './MetricsBar';
import { AttendanceRegisterTable } from './AttendanceRegisterTable';
import { TokenManagerPanel } from './TokenManagerPanel';
import { RegisteredUsersPanel } from './RegisteredUsersPanel';
import {
  Shield,
  Calendar,
  KeyRound,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle,
  Clock,
  LogOut,
  ExternalLink,
  Users
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { todayStr, logout, resetDemoData } = useCamp();
  const [activeAdminView, setActiveAdminView] = useState<'register' | 'tokens' | 'reports' | 'users'>('register');
  const [resetNotice, setResetNotice] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset all demo attendance records and student data to factory state?')) {
      resetDemoData();
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 3000);
    }
  };

  const formattedDate = new Date('2026-08-17T09:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Admin Top Header Banner */}
      <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#0A84FF]/15 border border-[#0A84FF]/40 text-xs font-mono font-semibold text-[#0A84FF] flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>COMMAND & INSTRUCTOR PORTAL</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-mono text-[#30D158]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse" />
              <span>LIVE REGISTRY SYNC</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F7]">
            Oxford Secondary School — Camp Command Desk
          </h1>
          <p className="text-xs text-[#8E8E93]">
            {formattedDate} • Butwal Campus Computer Lab 2
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleResetData}
            title="Reset to default demo data"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#121212] hover:bg-[#2C2C2E] border border-[#3A3A3C] text-xs text-[#8E8E93] hover:text-[#F5F5F7] transition-colors font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo State</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#2C2C2E] hover:bg-[#3A3A3C] border border-[#3A3A3C] text-xs font-medium text-[#F5F5F7] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {resetNotice && (
        <div className="p-3 rounded-xl bg-[#30D158]/15 border border-[#30D158]/30 text-xs text-[#30D158] flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>Demo state reset successfully. Initial students, tokens, and attendance restored.</span>
        </div>
      )}

      {/* Top 4 Key Metrics Bar */}
      <MetricsBar />

      {/* View Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#3A3A3C] pb-3">
        <button
          onClick={() => setActiveAdminView('register')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeAdminView === 'register'
              ? 'bg-[#0A84FF] text-white shadow-sm'
              : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-[#1E1E1E]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Daily Attendance Register</span>
        </button>

        <button
          onClick={() => setActiveAdminView('tokens')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeAdminView === 'tokens'
              ? 'bg-[#0A84FF] text-white shadow-sm'
              : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-[#1E1E1E]'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Access Token Management</span>
        </button>

        <button
          onClick={() => setActiveAdminView('reports')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeAdminView === 'reports'
              ? 'bg-[#0A84FF] text-white shadow-sm'
              : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-[#1E1E1E]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Student Reports</span>
        </button>

        <button
          onClick={() => setActiveAdminView('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeAdminView === 'users'
              ? 'bg-[#0A84FF] text-white shadow-sm'
              : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-[#1E1E1E]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Registered Users</span>
        </button>
      </div>

      {/* Active Admin Section */}
      <div className="space-y-8">
        {activeAdminView === 'register' && <AttendanceRegisterTable />}
        {activeAdminView === 'tokens' && <TokenManagerPanel />}
        {activeAdminView === 'reports' && <AttendanceRegisterTable />}
        {activeAdminView === 'users' && <RegisteredUsersPanel />}
      </div>

    </div>
  );
};
