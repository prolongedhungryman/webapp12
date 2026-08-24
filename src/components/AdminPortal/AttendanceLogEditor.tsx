import React, { useMemo, useState } from 'react';
import { useCamp } from '../../context/CampContext';

export const AttendanceLogEditor: React.FC = () => {
  const { students, attendanceRecords, todayStr, markAttendance } = useCamp();
  const [date, setDate] = useState(todayStr);
  const [busyToken, setBusyToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => {
    return students.map((stu) => {
      const rec = attendanceRecords.find((a) => a.studentId === stu.id && a.date === date);
      return {
        student: stu,
        present: rec?.status === 'PRESENT',
      };
    });
  }, [students, attendanceRecords, date]);

  const handleToggle = async (tokenId: string, nextPresent: boolean) => {
    setBusyToken(tokenId);
    setError(null);
    try {
      await markAttendance(tokenId, date, nextPresent);
    } catch (err: any) {
      setError(err?.message || 'Could not update attendance.');
    } finally {
      setBusyToken(null);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-[#121212] border border-[#3A3A3C] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#F5F5F7]">Attendance log</h3>
        <label className="text-[11px] font-mono text-[#8E8E93] uppercase flex items-center space-x-2">
          <span>Date</span>
          <input
            type="date"
            min={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value < todayStr ? todayStr : e.target.value)}
            className="px-2 py-1.5 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7]"
          />
        </label>
      </div>
      <p className="text-[11px] text-[#8E8E93]">Attendance can only be recorded from today onward.</p>
      {error && <p className="text-xs text-[#FF453A]">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-[#3A3A3C]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1E1E1E] text-[#8E8E93] font-mono uppercase">
            <tr>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Token</th>
              <th className="px-3 py-2 text-right">Present</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3A3C]/70">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-[#8E8E93]">No students yet.</td>
              </tr>
            ) : (
              rows.map(({ student, present }) => (
                <tr key={student.id}>
                  <td className="px-3 py-2 text-[#F5F5F7]">{student.fullName}</td>
                  <td className="px-3 py-2 font-mono text-[#8E8E93]">{student.tokenId}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      disabled={busyToken === student.tokenId}
                      onClick={() => handleToggle(student.tokenId, !present)}
                      className={`px-2.5 py-1 rounded-md font-mono border ${
                        present
                          ? 'bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30'
                          : 'bg-[#121212] text-[#8E8E93] border-[#3A3A3C]'
                      }`}
                    >
                      {present ? 'PRESENT' : 'ABSENT'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
