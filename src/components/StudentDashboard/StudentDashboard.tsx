import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { ProfileTab } from './ProfileTab';
import { AttendanceTab } from './AttendanceTab';
import { CodexRewardsTab } from './CodexRewardsTab';
import { EarnCodexTab } from './EarnCodexTab';
import { CodexBadgeIcon } from '../CodexBadgeIcon';
import { CalendarCheck2, Award, User, KeyRound, Copy, Check, LogOut, Sparkles, BookOpen, Layers } from 'lucide-react';

export type StudentDashboardTab = 'attendance' | 'codex' | 'earn' | 'profile';

export const StudentDashboard: React.FC = () => {
  const { currentStudent, logout } = useCamp();
  const [activeTab, setActiveTab] = useState<StudentDashboardTab>('attendance');
  const [copiedToken, setCopiedToken] = useState(false);

  if (!currentStudent) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(currentStudent.tokenId);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div id="student-dashboard-view" className="w-full bg-[#121212] font-sans text-[#F5F5F7] min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      
      {/* Sidebar - Clean Minimalism Style */}
      <aside className="w-full md:w-64 bg-[#121212] border-b md:border-b-0 md:border-r border-[#3A3A3C] flex flex-col shrink-0">
        <div className="p-6 flex items-center space-x-3 border-b md:border-b-0 border-[#3A3A3C]/40">
          <div className="w-8 h-8 bg-[#0A84FF] rounded flex items-center justify-center font-bold text-white text-sm shadow-sm">
            O
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-[#F5F5F7]">OXFORD CAMP</span>
            <span className="text-[10px] text-[#8E8E93] font-medium tracking-wide">BUTWAL • EST 2026</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 md:mt-4 flex-1 px-4 space-y-1 pb-4">
          <button
            id="nav-tab-attendance"
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'attendance'
                ? 'bg-[#1E1E1E] text-[#F5F5F7] shadow-sm'
                : 'text-[#8E8E93] hover:bg-[#1E1E1E] hover:text-[#F5F5F7]'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4 opacity-80" />
            <span>Attendance</span>
          </button>

          <button
            id="nav-tab-earn"
            onClick={() => setActiveTab('earn')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'earn'
                ? 'bg-[#1E1E1E] text-[#F5F5F7] shadow-sm'
                : 'text-[#8E8E93] hover:bg-[#1E1E1E] hover:text-[#F5F5F7]'
            }`}
          >
            <Sparkles className="w-4 h-4 opacity-80" />
            <span>Earn CODEX</span>
          </button>

          <button
            id="nav-tab-codex"
            onClick={() => setActiveTab('codex')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'codex'
                ? 'bg-[#1E1E1E] text-[#F5F5F7] shadow-sm'
                : 'text-[#8E8E93] hover:bg-[#1E1E1E] hover:text-[#F5F5F7]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Award className="w-4 h-4 opacity-80" />
              <span>CODEX Rewards</span>
            </div>
            <span className="text-[10px] font-mono text-[#0A84FF] bg-[#121212] px-1.5 py-0.5 rounded border border-[#3A3A3C]">
              {currentStudent.codexBalance}
            </span>
          </button>

          <button
            id="nav-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-[#1E1E1E] text-[#F5F5F7] shadow-sm'
                : 'text-[#8E8E93] hover:bg-[#1E1E1E] hover:text-[#F5F5F7]'
            }`}
          >
            <User className="w-4 h-4 opacity-80" />
            <span>Student Profile</span>
          </button>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 sm:p-6 border-t border-[#3A3A3C] bg-[#121212]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#3A3A3C] flex items-center justify-center text-xs font-bold text-[#F5F5F7]">
                {getInitials(currentStudent.fullName)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#F5F5F7] truncate max-w-[110px]">
                  {currentStudent.fullName}
                </span>
                <span className="text-[10px] text-[#8E8E93]">
                  {currentStudent.grade} • {currentStudent.section}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log Out"
              className="p-1.5 rounded text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-[#1E1E1E] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#3A3A3C] flex items-center justify-between px-4 sm:px-8 bg-[#121212] shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={handleCopyToken}
              title="Click to copy token"
              className="bg-[#1E1E1E] hover:bg-[#252528] border border-[#3A3A3C] px-3 py-1 rounded text-[11px] font-mono text-[#8E8E93] hover:text-[#F5F5F7] transition-colors flex items-center space-x-1.5"
            >
              <span>TOKEN: {currentStudent.tokenId}</span>
              {copiedToken ? (
                <Check className="w-3 h-3 text-[#30D158]" />
              ) : (
                <Copy className="w-3 h-3 text-[#8E8E93]" />
              )}
            </button>
            <span className="h-4 w-px bg-[#3A3A3C] hidden sm:inline-block"></span>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#30D158] shadow-[0_0_8px_#30D158]"></div>
              <span className="text-[11px] font-medium text-[#F5F5F7] tracking-wider uppercase">
                Summer 2026 Cohort
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="flex flex-col items-end cursor-pointer" onClick={() => setActiveTab('codex')}>
              <span className="text-[10px] text-[#8E8E93] uppercase tracking-widest leading-none">Balance</span>
              <span className="text-sm font-bold text-[#F5F5F7] mt-0.5">
                {currentStudent.codexBalance.toLocaleString()} CODEX
              </span>
            </div>
            <button
              onClick={() => setActiveTab('codex')}
              title="View CODEX Rewards"
              className="w-8 h-8 flex items-center justify-center border border-[#3A3A3C] rounded bg-[#1E1E1E] hover:border-[#0A84FF]/60 transition-colors text-[#0A84FF]"
            >
              <CodexBadgeIcon size={16} glow />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'attendance' && <AttendanceTab onNavigateTab={setActiveTab} />}
          {activeTab === 'codex' && <CodexRewardsTab />}
          {activeTab === 'earn' && <EarnCodexTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </main>

    </div>
  );
};
