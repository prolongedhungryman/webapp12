import React from 'react';
import { CampProvider, useCamp } from './context/CampContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { StudentDashboard } from './components/StudentDashboard/StudentDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { currentStudent, isAdminLoggedIn, pendingOnboardingToken } = useCamp();

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F7] flex flex-col">
      {/* Global Header */}
      <Navbar />

      {/* Primary Workspace Views */}
      <div className="flex-1">
        {currentStudent ? (
          <StudentDashboard />
        ) : isAdminLoggedIn ? (
          <AdminDashboard />
        ) : (
          <LandingHero />
        )}
      </div>

      {/* Dual-Tab Auth Modal */}
      <AuthModal />

      {/* First-Time Student Onboarding Modal */}
      {pendingOnboardingToken && <OnboardingModal />}
    </div>
  );
};

export default function App() {
  return (
    <CampProvider>
      <MainAppContent />
    </CampProvider>
  );
}
