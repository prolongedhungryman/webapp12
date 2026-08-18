import React from 'react';
import { useCamp } from '../../context/CampContext';
import { Users, UserCheck, UserX, Percent, TrendingUp } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  const { stats } = useCamp();

  return (
    <div id="admin-metrics-bar" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Metric 1: Total Registered */}
      <div className="p-5 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-[#8E8E93] uppercase tracking-wider">
            Total Enrolled
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#3A3A3C] flex items-center justify-center text-[#0A84FF]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono text-[#F5F5F7] tracking-tight">
            {stats.totalStudents}
          </div>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">
            Summer 2026 Cohort
          </p>
        </div>
      </div>

      {/* Metric 2: Present Today */}
      <div className="p-5 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-[#30D158] uppercase tracking-wider">
            Present Today
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#30D158]/30 flex items-center justify-center text-[#30D158]">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono text-[#30D158] tracking-tight">
            {stats.presentToday}
          </div>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">
            Verified in lab
          </p>
        </div>
      </div>

      {/* Metric 3: Absent Today */}
      <div className="p-5 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-[#8E8E93] uppercase tracking-wider">
            Absent Today
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#3A3A3C] flex items-center justify-center text-[#FF453A]">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono text-[#F5F5F7] tracking-tight">
            {stats.absentToday}
          </div>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">
            Pending check-in
          </p>
        </div>
      </div>

      {/* Metric 4: Attendance Rate */}
      <div className="p-5 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-[#0A84FF] uppercase tracking-wider">
            Attendance Rate
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#0A84FF]/30 flex items-center justify-center text-[#0A84FF]">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold font-mono text-[#F5F5F7] tracking-tight">
            {stats.attendanceRate}%
          </div>
          <div className="w-full h-1.5 bg-[#121212] rounded-full overflow-hidden mt-2 border border-[#3A3A3C]">
            <div
              className="h-full bg-[#0A84FF] rounded-full transition-all duration-500"
              style={{ width: `${stats.attendanceRate}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
