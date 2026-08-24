import React, { useState, useMemo } from 'react';
import { useCamp } from '../../context/CampContext';
import { AttendanceStatus } from '../../types';
import {
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Phone,
  KeyRound,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { CAMP_SECTIONS } from '../../lib/campOptions';

export const AttendanceRegisterTable: React.FC = () => {
  const {
    students,
    attendanceRecords,
    todayStr,
    adminToggleAttendance,
    exportAttendanceCSV
  } = useCamp();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT'>('ALL');
  const [sortField, setSortField] = useState<'name' | 'time' | 'grade'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Extract distinct grades
  const distinctGrades = useMemo(() => {
    const grades = Array.from(new Set(students.map((s) => s.grade)));
    return grades.sort();
  }, [students]);

  // Combine student and today's attendance record
  const studentRows = useMemo(() => {
    return students.map((stu) => {
      const att = attendanceRecords.find(
        (a) => a.studentId === stu.id && a.date === todayStr
      );
      const isPresent = att?.status === 'PRESENT';
      const checkInTime = att?.checkInTime || null;

      return {
        student: stu,
        status: (isPresent ? 'PRESENT' : 'ABSENT') as AttendanceStatus,
        checkInTime,
        verifiedBy: att?.verifiedBy || 'SYSTEM',
      };
    });
  }, [students, attendanceRecords, todayStr]);

  // Filtered & Sorted rows
  const filteredRows = useMemo(() => {
    return studentRows
      .filter((row) => {
        // Search query
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          row.student.fullName.toLowerCase().includes(q) ||
          row.student.tokenId.toLowerCase().includes(q) ||
          row.student.parentPhone.toLowerCase().includes(q) ||
          row.student.section.toLowerCase().includes(q);

        // Grade filter
        const matchesGrade = gradeFilter === 'ALL' || row.student.grade === gradeFilter;

        // Section filter
        const matchesSection = sectionFilter === 'ALL' || row.student.section.toLowerCase() === sectionFilter.toLowerCase();

        // Status filter
        const matchesStatus = statusFilter === 'ALL' || row.status === statusFilter;

        return matchesSearch && matchesGrade && matchesSection && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'name') {
          comparison = a.student.fullName.localeCompare(b.student.fullName);
        } else if (sortField === 'grade') {
          comparison = a.student.grade.localeCompare(b.student.grade);
        } else if (sortField === 'time') {
          const timeA = a.checkInTime || 'ZZZ';
          const timeB = b.checkInTime || 'ZZZ';
          comparison = timeA.localeCompare(timeB);
        }
        return sortAsc ? comparison : -comparison;
      });
  }, [studentRows, searchQuery, gradeFilter, sectionFilter, statusFilter, sortField, sortAsc]);

  const toggleSort = (field: 'name' | 'time' | 'grade') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div id="attendance-register-container" className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-5">
      
      {/* Table Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#F5F5F7]">
            Daily Attendance Register
          </h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Real-time cohort presence log for <span className="font-mono text-[#F5F5F7]">{todayStr}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-export-csv"
            onClick={exportAttendanceCSV}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search input */}
        <div className="relative">
          <input
            id="input-admin-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, token..."
            className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF] transition-all"
          />
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8E8E93]" />
        </div>

        {/* Grade Filter */}
        <div className="relative">
          <select
            id="select-filter-grade"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF] transition-all"
          >
            <option value="ALL">All Classes</option>
            {distinctGrades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Section Filter */}
        <div className="relative">
          <select
            id="select-filter-section"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF] transition-all"
          >
            <option value="ALL">All Sections</option>
            {CAMP_SECTIONS.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            id="select-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full pl-3 pr-8 py-2 bg-[#121212] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF] transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present Only</option>
            <option value="ABSENT">Absent Only</option>
          </select>
        </div>
      </div>

      {/* Register Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3A3A3C]">
        <table id="admin-attendance-table" className="w-full text-left text-xs">
          <thead className="bg-[#121212] text-[#8E8E93] font-mono uppercase tracking-wider border-b border-[#3A3A3C]">
            <tr>
              <th
                onClick={() => toggleSort('name')}
                className="px-4 py-3.5 cursor-pointer hover:text-[#F5F5F7] transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Student Name</span>
                  <ArrowUpDown className="w-3 h-3 text-[#505054]" />
                </div>
              </th>
              <th className="px-4 py-3.5">Token & Auth</th>
              <th
                onClick={() => toggleSort('grade')}
                className="px-4 py-3.5 cursor-pointer hover:text-[#F5F5F7] transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Class & Sec</span>
                  <ArrowUpDown className="w-3 h-3 text-[#505054]" />
                </div>
              </th>
              <th className="px-4 py-3.5">Parent Contact</th>
              <th className="px-4 py-3.5">Status</th>
              <th
                onClick={() => toggleSort('time')}
                className="px-4 py-3.5 cursor-pointer hover:text-[#F5F5F7] transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Check-in Time</span>
                  <ArrowUpDown className="w-3 h-3 text-[#505054]" />
                </div>
              </th>
              <th className="px-4 py-3.5 text-right">Manual Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3A3C]/70">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#8E8E93]">
                  No student records match the specified filters.
                </td>
              </tr>
            ) : (
              filteredRows.map(({ student, status, checkInTime, verifiedBy }) => {
                const isPresent = status === 'PRESENT';

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-[#252528] transition-colors group"
                  >
                    {/* Student Name */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#F5F5F7]">
                        {student.fullName}
                      </div>
                      <div className="text-[10px] text-[#8E8E93]">
                        {student.schoolName}
                      </div>
                    </td>

                    {/* Token Code & Password */}
                    <td className="px-4 py-3 font-mono font-medium text-[#8E8E93]">
                      <div className="space-y-1">
                        <div className="bg-[#121212] px-2 py-0.5 rounded border border-[#3A3A3C] text-[#F5F5F7] inline-block">
                          {student.tokenId}
                        </div>
                        <div className="text-[10px] flex items-center space-x-1" title="Student Password">
                          <KeyRound className="w-3 h-3 text-[#505054]" />
                          <span className={student.password ? "text-[#0A84FF]" : "text-[#505054] italic"}>
                            {student.password || 'No Password'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Class & Sec */}
                    <td className="px-4 py-3 font-mono text-[#F5F5F7]">
                      {student.grade} • <span className="text-[#8E8E93]">{student.section}</span>
                    </td>

                    {/* Parent Contact */}
                    <td className="px-4 py-3 font-mono text-[#8E8E93]">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-[#505054]" />
                        <span>{student.parentPhone}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      {isPresent ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] mr-1.5" />
                          PRESENT
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] mr-1.5" />
                          ABSENT
                        </span>
                      )}
                    </td>

                    {/* Check-in Time */}
                    <td className="px-4 py-3 font-mono text-[#8E8E93]">
                      {checkInTime ? (
                        <div className="flex items-center space-x-1.5 text-[#F5F5F7]">
                          <Clock className="w-3 h-3 text-[#30D158]" />
                          <span>{checkInTime}</span>
                        </div>
                      ) : (
                        <span className="text-[#505054]">—</span>
                      )}
                    </td>

                    {/* Manual Override Toggle */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          adminToggleAttendance(
                            student.id,
                            todayStr,
                            isPresent ? 'ABSENT' : 'PRESENT'
                          )
                        }
                        title={`Click to mark as ${isPresent ? 'Absent' : 'Present'}`}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium font-mono border transition-all ${
                          isPresent
                            ? 'bg-[#121212] hover:bg-[#FF453A]/10 border-[#3A3A3C] text-[#8E8E93] hover:text-[#FF453A] hover:border-[#FF453A]/40'
                            : 'bg-[#30D158]/10 hover:bg-[#30D158]/20 border-[#30D158]/30 text-[#30D158]'
                        }`}
                      >
                        {isPresent ? (
                          <>
                            <XCircle className="w-3 h-3 text-[#FF453A]" />
                            <span>Mark Absent</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#30D158]" />
                            <span>Mark Present</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
        <div>
          Showing <span className="font-mono font-semibold text-[#F5F5F7]">{filteredRows.length}</span> of <span className="font-mono text-[#F5F5F7]">{students.length}</span> students
        </div>
        <div className="font-mono text-[11px]">
          Changes to attendance auto-sync immediately
        </div>
      </div>

    </div>
  );
};
