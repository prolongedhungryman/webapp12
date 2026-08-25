import React, { useState, useMemo } from 'react';
import { useCamp } from '../../context/CampContext';
import {
  Users,
  Search,
  KeyRound,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Hash,
  RefreshCw,
} from 'lucide-react';

export const RegisteredUsersPanel: React.FC = () => {
  const { students, tokens, refreshFromBackend } = useCamp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'has_password' | 'no_password'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFromBackend();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filter by password status
    if (filterStatus === 'has_password') {
      result = result.filter((s) => s.password);
    } else if (filterStatus === 'no_password') {
      result = result.filter((s) => !s.password);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.tokenId.toLowerCase().includes(q) ||
          s.grade.toLowerCase().includes(q) ||
          s.section.toLowerCase().includes(q)
      );
    }

    return result;
  }, [students, searchQuery, filterStatus]);

  const totalRegistered = students.length;
  const withPassword = students.filter((s) => s.password).length;
  const withoutPassword = students.filter((s) => !s.password).length;

  return (
    <div className="space-y-6">
      {/* Header + Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#0A84FF]" />
            <h2 className="text-lg font-bold text-[#F5F5F7]">Registered Users</h2>
          </div>
          <p className="text-xs text-[#8E8E93]">
            All students who have signed up through the camp portal.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] hover:border-[#0A84FF]/50 text-xs text-[#8E8E93] hover:text-[#F5F5F7] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#3A3A3C]">
          <div className="flex items-center space-x-2 text-[#8E8E93] text-xs mb-1">
            <Hash className="w-3.5 h-3.5" />
            <span>Total Registered</span>
          </div>
          <div className="text-2xl font-bold text-[#F5F5F7] font-mono">{totalRegistered}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#3A3A3C]">
          <div className="flex items-center space-x-2 text-[#30D158] text-xs mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>With Password</span>
          </div>
          <div className="text-2xl font-bold text-[#30D158] font-mono">{withPassword}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#3A3A3C]">
          <div className="flex items-center space-x-2 text-[#FF9F0A] text-xs mb-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>No Password Set</span>
          </div>
          <div className="text-2xl font-bold text-[#FF9F0A] font-mono">{withoutPassword}</div>
        </div>
      </div>

      {/* Search + Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
          <input
            type="text"
            placeholder="Search by name, token, class, or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] text-sm text-[#F5F5F7] placeholder-[#8E8E93] focus:outline-none focus:border-[#0A84FF] transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(['all', 'has_password', 'no_password'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filterStatus === status
                  ? 'bg-[#0A84FF] text-white'
                  : 'bg-[#1E1E1E] border border-[#3A3A3C] text-[#8E8E93] hover:text-[#F5F5F7]'
              }`}
            >
              {status === 'all' ? 'All' : status === 'has_password' ? 'Has Password' : 'No Password'}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-[#8E8E93]">
        Showing <span className="text-[#F5F5F7] font-semibold">{filteredStudents.length}</span> of{' '}
        <span className="text-[#F5F5F7] font-semibold">{totalRegistered}</span> registered students
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#1E1E1E] border border-[#3A3A3C] text-center">
          <Users className="w-10 h-10 text-[#3A3A3C] mx-auto mb-3" />
          <div className="text-sm text-[#8E8E93]">
            {students.length === 0
              ? 'No students have registered yet.'
              : 'No students match your search criteria.'}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-[#1E1E1E] border border-[#3A3A3C] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#3A3A3C] text-[#8E8E93] text-xs font-mono uppercase">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Token Code</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-left">Section</th>
                  <th className="px-4 py-3 text-left">Registered</th>
                  <th className="px-4 py-3 text-center">Password</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="border-b border-[#3A3A3C]/50 hover:bg-[#2C2C2E]/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[#8E8E93] font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[#F5F5F7] font-medium truncate max-w-[180px]">
                          {student.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#121212] border border-[#3A3A3C] text-xs font-mono text-[#F5F5F7]">
                        <KeyRound className="w-3 h-3 text-[#0A84FF]" />
                        <span>{student.tokenId}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center space-x-1 text-xs text-[#F5F5F7]">
                        <BookOpen className="w-3 h-3 text-[#8E8E93]" />
                        <span>{student.grade}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#F5F5F7]">{student.section}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center space-x-1 text-xs text-[#8E8E93]">
                        <Clock className="w-3 h-3" />
                        <span>{student.registeredAt || '—'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {student.password ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#30D158]/15 text-[#30D158] text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Set</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#FF9F0A]/15 text-[#FF9F0A] text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          <span>None</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
