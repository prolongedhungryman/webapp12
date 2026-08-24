import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { UserPlus } from 'lucide-react';
import { CAMP_CLASSES, CAMP_SECTIONS, DEFAULT_CAMP_CLASS, DEFAULT_CAMP_SECTION } from '../../lib/campOptions';

export const StudentForm: React.FC = () => {
  const { addOrUpdateStudent } = useCamp();
  const [fullName, setFullName] = useState('');
  const [overrideToken, setOverrideToken] = useState(false);
  const [token, setToken] = useState('');
  const [studentClass, setStudentClass] = useState(DEFAULT_CAMP_CLASS);
  const [section, setSection] = useState(DEFAULT_CAMP_SECTION);
  const [assignedGrade, setAssignedGrade] = useState(DEFAULT_CAMP_CLASS);
  const [points, setPoints] = useState(50);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await addOrUpdateStudent({
        fullName,
        token: overrideToken ? token : '',
        studentClass,
        section,
        assignedGrade,
        points,
      });
      setNotice(`Saved ${result.fullName} with token ${result.tokenId}.`);
      setFullName('');
      setToken('');
      setOverrideToken(false);
      setPoints(50);
    } catch (err: any) {
      setError(err?.message || 'Could not save student.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-[#121212] border border-[#3A3A3C] space-y-3">
      <div className="flex items-center space-x-2">
        <UserPlus className="w-4 h-4 text-[#0A84FF]" />
        <h3 className="text-sm font-semibold text-[#F5F5F7]">Add or update student</h3>
      </div>
      <p className="text-[11px] text-[#8E8E93]">
        Leave token empty to assign an existing unused code. New numeric tokens are generated only after the original 100 are used.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-mono text-[#8E8E93] uppercase mb-1">Name *</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#8E8E93] uppercase mb-1">Class</label>
          <select
            value={studentClass}
            onChange={(e) => {
              setStudentClass(e.target.value);
              setAssignedGrade(e.target.value);
            }}
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7]"
          >
            {CAMP_CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#8E8E93] uppercase mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7]"
          >
            {CAMP_SECTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#8E8E93] uppercase mb-1">Assigned class</label>
          <select
            value={assignedGrade}
            onChange={(e) => setAssignedGrade(e.target.value)}
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7]"
          >
            {CAMP_CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#8E8E93] uppercase mb-1">CODEX points</label>
          <input
            type="number"
            min={0}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] font-mono"
          />
        </div>
      </div>

      <label className="flex items-center space-x-2 text-xs text-[#F5F5F7]">
        <input
          type="checkbox"
          checked={overrideToken}
          onChange={(e) => setOverrideToken(e.target.checked)}
        />
        <span>Override token (leave unchecked to auto-assign)</span>
      </label>

      {overrideToken && (
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Existing or new token"
          className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] font-mono"
        />
      )}

      {error && <p className="text-xs text-[#FF453A]">{error}</p>}
      {notice && <p className="text-xs text-[#30D158]">{notice}</p>}

      <button
        type="submit"
        disabled={busy}
        className="px-4 py-2 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white text-xs font-semibold disabled:opacity-60"
      >
        {busy ? 'Saving…' : 'Save student'}
      </button>
    </form>
  );
};
