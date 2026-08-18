import React from 'react';
import { useCamp } from '../../context/CampContext';
import { StudentDashboardTab } from './StudentDashboard';

interface AttendanceTabProps {
  onNavigateTab?: (tab: StudentDashboardTab) => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ onNavigateTab }) => {
  const { currentStudent, attendanceRecords, todayStr, markAttendanceSelf } = useCamp();

  if (!currentStudent) return null;

  // Find today's attendance for this student
  const todayRecord = attendanceRecords.find(
    (a) => a.studentId === currentStudent.id && a.date === todayStr
  );
  const isCheckedInToday = todayRecord?.status === 'PRESENT';

  // Format today's date nicely (e.g., Tuesday, July 14 or Monday, August 17)
  const formattedToday = new Date('2026-08-17T09:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Get student attendance history sorted by date desc
  const studentHistory = attendanceRecords
    .filter((a) => a.studentId === currentStudent.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const totalSessions = studentHistory.length;
  const presentSessions = studentHistory.filter((s) => s.status === 'PRESENT').length;
  const attendanceRate = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(1) : '100.0';

  return (
    <div id="student-attendance-tab" className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-150">
      
      {/* Left Column (8 cols): Daily Attendance Hero, 3-Stat Metrics, Recent History */}
      <section className="xl:col-span-8 space-y-6">
        
        {/* Daily Attendance Hero Card */}
        <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="text-[#8E8E93] text-xs font-medium uppercase tracking-[0.2em] mb-4">
            Daily Attendance
          </div>
          
          <h2 className="text-2xl font-semibold mb-2 text-[#F5F5F7]">
            {formattedToday}
          </h2>
          
          <p className="text-[#8E8E93] text-sm mb-8">
            Session starts at 09:00 AM • Lab 402, Butwal Campus
          </p>
          
          <div className="relative">
            {isCheckedInToday ? (
              <>
                <div className="absolute inset-0 bg-[#30D158] opacity-10 blur-xl rounded-full"></div>
                <div className="relative px-8 sm:px-12 py-4 bg-[#30D158] text-black font-bold text-xs sm:text-sm rounded-md hover:brightness-110 flex items-center space-x-3 transition-all select-none shadow-sm">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span>PRESENT • CHECKED IN AT {todayRecord?.checkInTime || '09:15 AM'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[#0A84FF] opacity-15 blur-xl rounded-full"></div>
                <button
                  id="btn-i-am-present"
                  onClick={() => markAttendanceSelf(currentStudent.id)}
                  className="relative px-8 sm:px-12 py-4 bg-[#0A84FF] hover:bg-[#0071E3] text-white font-bold text-xs sm:text-sm rounded-md hover:brightness-110 flex items-center space-x-3 transition-all active:scale-95 shadow-md"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span>I AM PRESENT • CONFIRM CHECK-IN</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3-Stat Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded p-4">
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest">Streak</div>
            <div className="text-xl font-bold mt-1 text-[#F5F5F7]">12 Days</div>
          </div>
          <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded p-4">
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest">Attendance Rate</div>
            <div className="text-xl font-bold mt-1 text-[#30D158]">{attendanceRate}%</div>
          </div>
          <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded p-4">
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest">Rank</div>
            <div className="text-xl font-bold mt-1 text-[#0A84FF]">#04</div>
          </div>
        </div>

        {/* Recent History Table Card */}
        <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#3A3A3C] flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">Recent History</span>
            <span className="text-[10px] text-[#8E8E93] font-mono">
              {studentHistory.length} LOGGED SESSIONS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[#3A3A3C]/50">
                {studentHistory.map((rec) => {
                  const dateObj = new Date(`${rec.date}T09:00:00`);
                  const dateLabel = dateObj.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                  return (
                    <tr key={rec.id} className="hover:bg-[#252528] transition-colors">
                      <td className="px-6 py-3 text-[#F5F5F7] font-medium text-xs sm:text-sm">
                        {dateLabel}
                      </td>
                      <td className="px-6 py-3 text-[#8E8E93] text-xs sm:text-sm">
                        {dayName}
                      </td>
                      <td className="px-6 py-3 text-xs sm:text-sm font-semibold">
                        {rec.status === 'PRESENT' ? (
                          <span className="text-[#30D158]">PRESENT</span>
                        ) : (
                          <span className="text-[#FF453A]">ABSENT</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right text-[#8E8E93] font-mono text-xs sm:text-sm">
                        {rec.checkInTime || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* Right Column (4 cols): Digital Asset CODEX Card & Instructor Note Card */}
      <section className="xl:col-span-4 space-y-6">
        
        {/* CODEX Digital Asset Card */}
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-[#3A3A3C] rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#0A84FF] rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#0A84FF]"></div>
              </div>
            </div>
            <span className="text-[10px] text-[#0A84FF] font-bold px-2 py-1 bg-[#0A84FF]/10 rounded font-mono">
              DIGITAL ASSET
            </span>
          </div>

          <div className="text-4xl font-light mb-1 text-[#F5F5F7]">
            {currentStudent.codexBalance}{' '}
            <span className="text-base font-bold text-[#0A84FF]">CODEX</span>
          </div>

          <p className="text-[#8E8E93] text-xs leading-relaxed">
            Earn tokens by arriving early, completing coding modules, and helping peers. Redeem for Oxford Merch, AWS Cloud Credits, or Hardware kits.
          </p>

          <div className="mt-6 pt-6 border-t border-[#3A3A3C]">
            <button
              onClick={() => onNavigateTab && onNavigateTab('codex')}
              className="w-full py-2 bg-transparent border border-[#3A3A3C] rounded text-xs font-semibold text-[#F5F5F7] hover:bg-[#3A3A3C] transition-colors uppercase tracking-widest"
            >
              View Rewards Shop
            </button>
          </div>
        </div>

        {/* Instructor Note Card */}
        <div className="bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg p-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-4 text-[#F5F5F7]">
            Instructor Note
          </div>
          <div className="flex space-x-3">
            <div className="w-1 h-auto bg-[#0A84FF] rounded-full shrink-0"></div>
            <p className="text-xs text-[#8E8E93] italic leading-relaxed">
              &quot;Great progress on the React state &amp; Tailwind architecture assignments, {currentStudent.fullName.split(' ')[0]}. Keep up the solid consistency!&quot; — Er. Pandey
            </p>
          </div>
        </div>

      </section>

    </div>
  );
};
