import React, { useState, useMemo } from 'react';
import { useCamp } from '../../context/CampContext';
import { Calendar, Users, CheckCircle, XCircle, Clock, BarChart3, Info } from 'lucide-react';

export const AttendanceLogTab: React.FC = () => {
  const { attendanceRecords, students } = useCamp();

  // Aggregate attendance data by date
  const aggregatedData = useMemo(() => {
    // Find all unique dates in the logs
    const uniqueDates = Array.from(new Set(attendanceRecords.map((r) => r.date))).sort();
    
    // If no records, return empty list
    if (uniqueDates.length === 0) return [];

    return uniqueDates.map((date) => {
      const recordsForDate = attendanceRecords.filter((r) => r.date === date);
      const presentCount = recordsForDate.filter((r) => r.status === 'PRESENT').length;
      const absentCount = recordsForDate.filter((r) => r.status === 'ABSENT').length;
      
      // Total might be recordsForDate.length, but let's base it on actual records or current students count as fallback
      const totalStudentsOnDate = recordsForDate.length || students.length || 1;
      const presentPercent = Math.round((presentCount / totalStudentsOnDate) * 100);

      return {
        date,
        presentCount,
        absentCount,
        total: totalStudentsOnDate,
        percent: presentPercent,
      };
    });
  }, [attendanceRecords, students]);

  // Track selected date for detailed list
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    if (aggregatedData.length > 0) {
      return aggregatedData[aggregatedData.length - 1].date; // default to most recent date
    }
    return null;
  });

  // Ensure selectedDate is valid, fallback if it gets deleted/reset
  const activeDate = selectedDate || (aggregatedData.length > 0 ? aggregatedData[aggregatedData.length - 1].date : null);

  // Get details for active date
  const activeDateDetails = useMemo(() => {
    if (!activeDate) return null;
    const summary = aggregatedData.find((d) => d.date === activeDate);
    
    // Find all records for this date
    const records = attendanceRecords.filter((r) => r.date === activeDate);
    
    // Map records to student names
    const presentStudents = records
      .filter((r) => r.status === 'PRESENT')
      .map((r) => {
        const student = students.find((s) => s.id === r.studentId);
        return {
          id: r.studentId,
          name: student?.fullName || 'Unknown Student',
          class: student?.grade || 'Grade 10',
          section: student?.section || 'A',
          checkInTime: r.checkInTime || '09:00 AM',
          verifiedBy: r.verifiedBy || 'SYSTEM',
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const absentStudents = records
      .filter((r) => r.status === 'ABSENT')
      .map((r) => {
        const student = students.find((s) => s.id === r.studentId);
        return {
          id: r.studentId,
          name: student?.fullName || 'Unknown Student',
          class: student?.grade || 'Grade 10',
          section: student?.section || 'A',
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Also check if any registered students are missing from the records (implying ABSENT)
    const recordedStudentIds = new Set(records.map((r) => r.studentId));
    students.forEach((stu) => {
      if (!recordedStudentIds.has(stu.id)) {
        absentStudents.push({
          id: stu.id,
          name: stu.fullName,
          class: stu.grade,
          section: stu.section,
        });
      }
    });

    return {
      summary,
      present: presentStudents,
      absent: absentStudents,
    };
  }, [activeDate, aggregatedData, attendanceRecords, students]);

  // Format date nicely (e.g. "Aug 25, 2026")
  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Find max present count to scale graph height
  const maxPresentCount = useMemo(() => {
    if (aggregatedData.length === 0) return 10;
    const maxVal = Math.max(...aggregatedData.map((d) => d.presentCount));
    return maxVal > 0 ? maxVal : 10;
  }, [aggregatedData]);

  return (
    <div id="attendance-log-tab-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
      
      {/* Left Pane (7 cols): Infographic / Bar Chart Trend */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F7] flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#0A84FF]" />
                <span>Attendance Log Analytics</span>
              </h3>
              <p className="text-xs text-[#8E8E93] mt-0.5">
                Overview of student attendance count over the logged dates.
              </p>
            </div>
            {aggregatedData.length > 0 && (
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/25">
                {aggregatedData.length} active logs
              </span>
            )}
          </div>

          {aggregatedData.length === 0 ? (
            <div className="h-64 rounded-xl bg-[#121212] border border-[#3A3A3C] border-dashed flex flex-col items-center justify-center text-center p-6 space-y-2">
              <Info className="w-8 h-8 text-[#8E8E93]" />
              <div className="text-xs font-semibold text-[#F5F5F7]">No Attendance Records Found</div>
              <p className="text-[11px] text-[#8E8E93] max-w-xs leading-relaxed">
                Add students and toggle attendance in the "Daily Attendance Register" to populate log metrics.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Custom CSS/SVG Interactive Bar Graph */}
              <div className="h-64 bg-[#121212] rounded-xl border border-[#3A3A3C]/70 p-6 flex flex-col justify-between relative overflow-hidden">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 px-6 py-6 flex flex-col justify-between pointer-events-none opacity-5">
                  <div className="w-full border-t border-white"></div>
                  <div className="w-full border-t border-white"></div>
                  <div className="w-full border-t border-white"></div>
                  <div className="w-full border-t border-white"></div>
                </div>

                {/* Bars Container */}
                <div className="flex-1 flex items-end justify-around space-x-2 z-10">
                  {aggregatedData.map((d) => {
                    const isActive = d.date === activeDate;
                    // Calculate height percentage relative to max present count
                    const barHeightPercent = Math.max(8, (d.presentCount / maxPresentCount) * 100);
                    
                    return (
                      <div
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className="flex-1 flex flex-col items-center group cursor-pointer"
                      >
                        {/* Present Count Tooltip Hover label */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 bg-[#2C2C2E] border border-[#3A3A3C] text-[10px] px-2 py-0.5 rounded font-mono shadow-md text-[#F5F5F7] z-20 pointer-events-none">
                          {d.presentCount} Pres. / {d.absentCount} Abs.
                        </div>

                        {/* Visual Bar */}
                        <div className="w-full max-w-[45px] flex flex-col justify-end h-full">
                          <div
                            style={{ height: `${barHeightPercent}%` }}
                            className={`w-full rounded-t-md transition-all duration-300 relative ${
                              isActive
                                ? 'bg-gradient-to-t from-[#0A84FF] to-[#30D158] shadow-[0_0_12px_rgba(48,209,88,0.3)]'
                                : 'bg-gradient-to-t from-[#2C2C2E] to-[#0A84FF] group-hover:to-[#30D158]/80'
                            }`}
                          >
                            {/* Inner percent label */}
                            <span className="absolute top-1 left-0 right-0 text-center font-mono text-[9px] font-bold text-black drop-shadow-sm truncate">
                              {d.percent}%
                            </span>
                          </div>
                        </div>

                        {/* Date label */}
                        <span className={`text-[9px] font-mono mt-2 truncate max-w-full ${isActive ? 'text-[#30D158] font-bold' : 'text-[#8E8E93]'}`}>
                          {d.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend bar */}
              <div className="flex items-center justify-center space-x-6 text-xs text-[#8E8E93]">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-[#30D158]"></div>
                  <span>Present Ratio (%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-[#0A84FF]"></div>
                  <span>Standard Trendline</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Small Log Summary Card List */}
        {aggregatedData.length > 0 && (
          <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] space-y-3">
            <h4 className="text-xs font-bold text-[#F5F5F7] uppercase tracking-wider">Date Selection Ledger</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aggregatedData.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    d.date === activeDate
                      ? 'bg-[#0A84FF]/10 border-[#0A84FF] text-[#F5F5F7]'
                      : 'bg-[#121212] border-[#3A3A3C]/70 text-[#8E8E93] hover:border-[#8E8E93]/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#F5F5F7]">{formatDateLabel(d.date)}</div>
                    <div className="text-[10px] font-mono">{d.presentCount} of {d.total} Present</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#30D158] bg-[#121212] px-2 py-0.5 rounded border border-[#3A3A3C]">
                    {d.percent}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Pane (5 cols): Briefing on Who was Present/Absent on Selected Date */}
      <div className="lg:col-span-5">
        {!activeDateDetails ? (
          <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] text-center text-xs text-[#8E8E93] h-full flex items-center justify-center">
            Select a date from the chart to view details.
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-6 h-full flex flex-col">
            
            {/* Header info */}
            <div className="border-b border-[#3A3A3C] pb-4 space-y-2 shrink-0">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#0A84FF]" />
                <h3 className="text-sm font-bold text-[#F5F5F7] font-mono">
                  {formatDateLabel(activeDate)}
                </h3>
              </div>

              {/* Present / Absent mini stat pills */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{activeDateDetails.present.length} Present</span>
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20 font-bold">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{activeDateDetails.absent.length} Absent</span>
                </span>
              </div>
            </div>

            {/* Attendance Details scroll area */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[450px]">
              
              {/* PRESENT List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#30D158] flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]"></div>
                  <span>Present Cohort ({activeDateDetails.present.length})</span>
                </h4>

                {activeDateDetails.present.length === 0 ? (
                  <div className="p-3 text-center text-xs text-[#8E8E93] bg-[#121212] rounded border border-[#3A3A3C]/40">
                    No students marked present.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {activeDateDetails.present.map((stu) => (
                      <div key={stu.id} className="p-3 bg-[#121212] rounded border border-[#3A3A3C]/40 flex items-center justify-between text-xs hover:border-[#8E8E93]/25 transition-all">
                        <div className="space-y-0.5">
                          <div className="font-bold text-[#F5F5F7]">{stu.name}</div>
                          <div className="text-[10px] text-[#8E8E93] font-mono">{stu.class} • {stu.section}</div>
                        </div>
                        <div className="text-right space-y-0.5 font-mono text-[10px]">
                          <div className="text-[#F5F5F7] flex items-center space-x-1 justify-end">
                            <Clock className="w-3 h-3 text-[#30D158]" />
                            <span>{stu.checkInTime}</span>
                          </div>
                          <div className="text-[#8E8E93] text-[9px] uppercase tracking-wider">
                            Verified: {stu.verifiedBy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ABSENT List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF453A]"></div>
                  <span>Absent Cohort ({activeDateDetails.absent.length})</span>
                </h4>

                {activeDateDetails.absent.length === 0 ? (
                  <div className="p-3 text-center text-xs text-[#30D158] bg-[#121212] rounded border border-[#30D158]/15">
                    100% Camp Attendance! No absentees.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {activeDateDetails.absent.map((stu) => (
                      <div key={stu.id} className="p-3 bg-[#121212] rounded border border-[#3A3A3C]/40 flex items-center justify-between text-xs hover:border-[#8E8E93]/25 transition-all">
                        <div className="space-y-0.5">
                          <div className="font-medium text-[#8E8E93]">{stu.name}</div>
                          <div className="text-[10px] text-[#505054] font-mono">{stu.class} • {stu.section}</div>
                        </div>
                        <span className="text-[10px] text-[#FF453A] bg-[#FF453A]/5 border border-[#FF453A]/15 px-2 py-0.5 rounded font-mono font-bold">
                          ABSENT
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
};
