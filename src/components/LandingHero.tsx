import React from 'react';
import { useCamp } from '../context/CampContext';
import { CodexBadgeIcon } from './CodexBadgeIcon';
import {
  Code2,
  Terminal,
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  Cpu,
  Layers,
  Award,
  Users
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { openStudentAuth, openAdminAuth, tokens } = useCamp();

  const sampleEnrolledToken = 'OXF-2026-A891';
  const sampleNewToken = tokens.find((t) => !t.isOnboarded)?.token || 'OXF-2026-NEW99';

  return (
    <div id="landing-hero-view" className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Subtle Background Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#3A3A3C_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-[#0A84FF]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 w-full">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1E1E1E] border border-[#3A3A3C] text-xs font-mono text-[#F5F5F7]">
            <MapPin className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Butwal, Lumbini Province</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1E1E1E] border border-[#3A3A3C] text-xs font-mono text-[#30D158]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse" />
            <span>Summer 2026 Cohort • Active</span>
          </div>
        </div>

        {/* High-Impact Title & Subtitle */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F7] leading-[1.15]">
            Oxford Secondary School <br className="hidden sm:inline" />
            <span className="text-[#F5F5F7] text-opacity-90">Coding Summer Camp</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E8E93] leading-relaxed max-w-2xl">
            An intensive engineering incubator for aspiring student developers. Master full-stack architectures, algorithms, and collaborative software craft while tracking daily attendance and earning digital CODEX points.
          </p>
        </div>

        {/* Primary Action Card ("Access Camp Portal") */}
        <div className="mt-10 max-w-xl">
          <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-xl hover:border-[#505054] transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-[#0A84FF]" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0A84FF]">
                    Student & Instructor Gateway
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F7]">
                  Access Camp Portal
                </h3>
                <p className="text-xs text-[#8E8E93]">
                  Enter your single-use token or administrator credentials to open your terminal.
                </p>
              </div>

              <button
                id="btn-access-camp-portal"
                onClick={openStudentAuth}
                className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#0A84FF] hover:bg-[#0071E3] text-white text-sm font-semibold transition-all shadow-md active:scale-95 shrink-0"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Pillars (Vercel/Supabase style clean grid) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#1E1E1E]/70 border border-[#3A3A3C]/80">
            <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#3A3A3C] flex items-center justify-center text-[#0A84FF] mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-[#F5F5F7]">Daily Check-in Register</div>
            <div className="mt-1 text-xs text-[#8E8E93]">
              Real-time one-click presence verification with cryptographic timestamp logging.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1E1E1E]/70 border border-[#3A3A3C]/80">
            <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#3A3A3C] flex items-center justify-center text-[#0A84FF] mb-3">
              <CodexBadgeIcon size={16} glow />
            </div>
            <div className="text-sm font-semibold text-[#F5F5F7]">CODEX Digital Rewards</div>
            <div className="mt-1 text-xs text-[#8E8E93]">
              Earn points for on-time check-ins, lab challenges, and redeem exclusive Oxford tech swag.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1E1E1E]/70 border border-[#3A3A3C]/80">
            <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#3A3A3C] flex items-center justify-center text-[#0A84FF] mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-[#F5F5F7]">Instructor Command Center</div>
            <div className="mt-1 text-xs text-[#8E8E93]">
              Comprehensive live attendance registry, manual overrides, CSV reporting, and token generation.
            </div>
          </div>
        </div>

        {/* Quick Demo Evaluation Panel */}
        <div className="mt-10 p-4 rounded-xl bg-[#1E1E1E] border border-[#3A3A3C] text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3A3A3C]">
            <div className="flex items-center space-x-2 font-mono text-[#F5F5F7] font-medium">
              <Terminal className="w-4 h-4 text-[#0A84FF]" />
              <span>TEST CREDENTIALS & DEMO TOKENS</span>
            </div>
            <span className="text-[11px] text-[#8E8E93]">Click any item to open modal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={openStudentAuth}
              className="text-left p-2.5 rounded-lg bg-[#121212] border border-[#3A3A3C] hover:border-[#0A84FF]/60 transition-colors"
            >
              <div className="text-[11px] text-[#8E8E93] uppercase font-mono">Enrolled Student Token</div>
              <div className="font-mono text-xs text-[#F5F5F7] font-semibold mt-0.5">{sampleEnrolledToken}</div>
              <div className="text-[10px] text-[#8E8E93] mt-0.5">Aarav Sharma (Grade 10)</div>
            </button>

            <button
              onClick={openStudentAuth}
              className="text-left p-2.5 rounded-lg bg-[#121212] border border-[#3A3A3C] hover:border-[#30D158]/60 transition-colors"
            >
              <div className="text-[11px] text-[#8E8E93] uppercase font-mono">New Student Onboarding</div>
              <div className="font-mono text-xs text-[#30D158] font-semibold mt-0.5">{sampleNewToken}</div>
              <div className="text-[10px] text-[#8E8E93] mt-0.5">Triggers registration modal</div>
            </button>

            <button
              onClick={openAdminAuth}
              className="text-left p-2.5 rounded-lg bg-[#121212] border border-[#3A3A3C] hover:border-[#0A84FF]/60 transition-colors"
            >
              <div className="text-[11px] text-[#8E8E93] uppercase font-mono">Administrator Login</div>
              <div className="font-mono text-xs text-[#0A84FF] font-semibold mt-0.5">admin</div>
              <div className="text-[10px] text-[#8E8E93] mt-0.5">Password: HenryCabil@26</div>
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-[#3A3A3C] py-4 bg-[#121212]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E8E93] gap-2">
          <div>
            © 2026 Oxford Secondary School, Butwal. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>CAMP PORTAL v2.4.0</span>
            <span className="text-[#3A3A3C]">•</span>
            <span>NEPAL TIME (NPT)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
