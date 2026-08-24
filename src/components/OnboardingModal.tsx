import React, { useState } from 'react';
import { useCamp } from '../context/CampContext';
import { User, GraduationCap, School, Phone, ArrowRight, ShieldCheck, KeyRound, X } from 'lucide-react';
import { CodexBadgeIcon } from './CodexBadgeIcon';
import { CAMP_CLASSES, CAMP_SECTIONS, DEFAULT_CAMP_CLASS, DEFAULT_CAMP_SECTION } from '../lib/campOptions';

export const OnboardingModal: React.FC = () => {
  const {
    pendingOnboardingToken,
    completeOnboarding,
    cancelOnboarding,
    tokens
  } = useCamp();

  const tokenRecord = tokens.find(
    (t) => t.token.toUpperCase() === pendingOnboardingToken?.toUpperCase()
  );

  const [fullName, setFullName] = useState(tokenRecord?.studentName || '');
  const [grade, setGrade] = useState(tokenRecord?.assignedGrade || DEFAULT_CAMP_CLASS);
  const [section, setSection] = useState(DEFAULT_CAMP_SECTION);
  const [schoolName, setSchoolName] = useState('Oxford Secondary School');
  const [parentPhone, setParentPhone] = useState('+977 ');

  if (!pendingOnboardingToken) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    completeOnboarding({
      fullName,
      grade,
      section,
      schoolName,
      parentPhone,
    });
  };

  return (
    <div
      id="onboarding-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="onboarding-modal-container"
        className="w-full max-w-lg bg-[#1E1E1E] border border-[#3A3A3C] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="relative px-6 pt-6 pb-5 border-b border-[#3A3A3C] bg-gradient-to-b from-[#1E1E1E] to-[#161616]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-[#0A84FF]/15 border border-[#0A84FF]/40 text-xs font-mono font-semibold text-[#0A84FF]">
                FIRST-TIME ACTIVATION
              </span>
              <div className="flex items-center space-x-1 text-xs font-mono text-[#8E8E93]">
                <KeyRound className="w-3.5 h-3.5 text-[#0A84FF]" />
                <span>{pendingOnboardingToken}</span>
              </div>
            </div>
            <button
              onClick={cancelOnboarding}
              className="p-1 rounded-md text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-[#2C2C2E] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="mt-3 text-lg font-bold text-[#F5F5F7] tracking-tight">
            Complete Student Profile Registration
          </h2>
          <p className="mt-1 text-xs text-[#8E8E93] leading-relaxed">
            Welcome to the Oxford Secondary School Coding Summer Camp in Butwal. Enter your official details to claim your seat and receive your <span className="text-[#0A84FF] font-semibold">50 CODEX points</span> welcome grant.
          </p>

          <div className="mt-3 flex items-center space-x-2.5 p-2.5 rounded-lg bg-[#121212] border border-[#3A3A3C] text-xs">
            <CodexBadgeIcon size={18} glow />
            <div className="flex-1 text-[#F5F5F7]">
              <span className="font-semibold text-[#0A84FF]">+50 CODEX</span> starter points credited upon completion
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="input-full-name" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                id="input-full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-9 pr-4 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all"
              />
              <User className="w-4 h-4 absolute left-3 top-3 text-[#8E8E93]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="select-grade" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
                Class *
              </label>
              <div className="relative">
                <select
                  id="select-grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF] transition-all"
                >
                  {CAMP_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-[#8E8E93]" />
              </div>
            </div>

            <div>
              <label htmlFor="select-section" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
                Section *
              </label>
              <select
                id="select-section"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF] transition-all"
              >
                {CAMP_SECTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="input-school-name" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
              School Name
            </label>
            <div className="relative">
              <input
                id="input-school-name"
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Oxford Secondary School"
                className="w-full pl-9 pr-4 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF] transition-all"
              />
              <School className="w-4 h-4 absolute left-3 top-3 text-[#8E8E93]" />
            </div>
          </div>

          <div>
            <label htmlFor="input-parent-phone" className="block text-xs font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
              Parent&apos;s Phone Number *
            </label>
            <div className="relative">
              <input
                id="input-parent-phone"
                type="tel"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className="w-full pl-9 pr-4 py-2.5 bg-[#121212] border border-[#3A3A3C] rounded-lg text-sm text-[#F5F5F7] font-mono focus:outline-none focus:border-[#0A84FF] transition-all"
              />
              <Phone className="w-4 h-4 absolute left-3 top-3 text-[#8E8E93]" />
            </div>
            <p className="mt-1 text-[10px] text-[#8E8E93]">Used strictly for emergency contact and camp status updates.</p>
          </div>

          <div className="pt-3">
            <button
              id="btn-complete-registration"
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
