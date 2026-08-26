import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { CAMP_CLASSES, CAMP_SECTIONS, DEFAULT_CAMP_CLASS, DEFAULT_CAMP_SECTION } from '../../lib/campOptions';
import { KeyRound, Plus, Copy, Check, Trash2, ShieldCheck, Sparkles, UserPlus, AlertCircle, Users, CheckCircle2, CircleDot } from 'lucide-react';

export const TokenManagerPanel: React.FC = () => {
  const { tokens, students, adminGenerateToken, adminRevokeToken, adminAssignToken } = useCamp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [targetGrade, setTargetGrade] = useState<string>(DEFAULT_CAMP_CLASS);
  const [studentNamePre, setStudentNamePre] = useState('');
  const [justGeneratedToken, setJustGeneratedToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [assigningToken, setAssigningToken] = useState<string | null>(null);
  const [assignName, setAssignName] = useState('');
  const [assignGrade, setAssignGrade] = useState<string>(DEFAULT_CAMP_CLASS);
  const [assignSection, setAssignSection] = useState<string>(DEFAULT_CAMP_SECTION);
  const [assignError, setAssignError] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const token = adminGenerateToken(targetGrade, studentNamePre.trim() || undefined);
    setJustGeneratedToken(token);
    setStudentNamePre('');
    setIsGenerating(false);
  };

  const handleCopy = (tokenStr: string) => {
    navigator.clipboard.writeText(tokenStr);
    setCopiedToken(tokenStr);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Summary counts: use students.length for "enrolled" (source of truth for actual students)
  // Use token-level counts for token registry metrics
  const totalEnrolledStudents = students.length;
  const onboardedTokenCount = tokens.filter((t) => t.isOnboarded).length;
  const unassignedTokens = tokens.filter((t) => !t.isOnboarded && !t.studentName);
  const assignedActiveTokens = tokens.filter((t) => t.isOnboarded || t.studentName);

  const handleAssign = async (e: React.FormEvent, tokenStr: string) => {
    e.preventDefault();
    setAssignError(null);
    if (!assignName.trim()) {
      setAssignError('Please provide a student name.');
      return;
    }
    const res = await adminAssignToken(tokenStr, assignName, assignGrade, assignSection);
    if (res.success) {
      setAssigningToken(null);
      setAssignName('');
    } else {
      setAssignError(res.message || 'Failed to assign token.');
    }
  };

  const openAssignForm = (tokenStr: string, existingGrade?: string) => {
    setAssigningToken(tokenStr);
    setAssignName('');
    setAssignGrade(existingGrade && CAMP_CLASSES.includes(existingGrade as any) ? existingGrade : DEFAULT_CAMP_CLASS);
    setAssignSection(DEFAULT_CAMP_SECTION);
    setAssignError(null);
  };

  const AssignFormRow = ({ tokenStr }: { tokenStr: string }) => (
    <tr className="bg-[#0A84FF]/5 border-y border-[#0A84FF]/20">
      <td colSpan={5} className="p-4">
        <form onSubmit={(e) => handleAssign(e, tokenStr)} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-mono text-[#0A84FF] uppercase mb-1">Student Name</label>
            <input
              type="text"
              value={assignName}
              onChange={(e) => setAssignName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#0A84FF]/30 rounded text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
              autoFocus
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="block text-[10px] font-mono text-[#0A84FF] uppercase mb-1">Class</label>
            <select
              value={assignGrade}
              onChange={(e) => setAssignGrade(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#0A84FF]/30 rounded text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
            >
              {CAMP_CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-28">
            <label className="block text-[10px] font-mono text-[#0A84FF] uppercase mb-1">Section</label>
            <select
              value={assignSection}
              onChange={(e) => setAssignSection(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#0A84FF]/30 rounded text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
            >
              {CAMP_SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setAssigningToken(null)}
              className="px-3 py-1.5 text-xs text-[#8E8E93] hover:text-[#F5F5F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#0A84FF] hover:bg-[#0071E3] text-white text-xs font-semibold"
            >
              Save
            </button>
          </div>
        </form>
        {assignError && (
          <div className="mt-2 text-[11px] text-[#FF453A] flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {assignError}
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div id="token-manager-panel" className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-[#0A84FF]" />
            <h2 className="text-base font-semibold text-[#F5F5F7]">
              Student Access Token Generator & Registry
            </h2>
          </div>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Issue, manage, and assign authentication codes for camp enrollment.
          </p>
        </div>

        <button
          id="btn-open-generate-token"
          onClick={() => setIsGenerating(!isGenerating)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white text-xs font-semibold transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Token</span>
        </button>
      </div>

      {/* Generator Form (Collapsible) */}
      {isGenerating && (
        <form onSubmit={handleGenerate} className="p-4 rounded-xl bg-[#121212] border border-[#0A84FF]/40 space-y-3 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-[#F5F5F7] flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Generate New Camp Access Token</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#8E8E93] uppercase mb-1">
                Student Name (Optional Pre-Assignment)
              </label>
              <input
                type="text"
                value={studentNamePre}
                onChange={(e) => setStudentNamePre(e.target.value)}
                placeholder="e.g. Suman Bhandari"
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] placeholder-[#505054] focus:outline-none focus:border-[#0A84FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E8E93] uppercase mb-1">
                Class / Grade
              </label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#3A3A3C] rounded-lg text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
              >
                {CAMP_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerating(false)}
              className="px-3 py-1.5 text-xs text-[#8E8E93] hover:text-[#F5F5F7]"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-generate-token"
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#0A84FF] hover:bg-[#0071E3] text-white text-xs font-semibold transition-all"
            >
              Issue Token
            </button>
          </div>
        </form>
      )}

      {/* Just Generated Notice */}
      {justGeneratedToken && (
        <div className="p-3.5 rounded-xl bg-[#30D158]/10 border border-[#30D158]/30 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#30D158]" />
            <span className="text-[#F5F5F7]">
              Generated Token: <strong className="font-mono text-[#30D158]">{justGeneratedToken}</strong>
            </span>
          </div>
          <button
            onClick={() => handleCopy(justGeneratedToken)}
            className="px-2.5 py-1 rounded bg-[#1E1E1E] border border-[#3A3A3C] text-[11px] font-mono text-[#F5F5F7] hover:bg-[#2C2C2E]"
          >
            {copiedToken === justGeneratedToken ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      )}

      {/* Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="px-3 py-2.5 rounded-lg bg-[#121212] border border-[#3A3A3C] flex flex-col gap-0.5">
          <span className="text-[10px] font-mono text-[#8E8E93] uppercase">Total Tokens</span>
          <span className="text-lg font-bold font-mono text-[#F5F5F7]">{tokens.length}</span>
          <span className="text-[10px] text-[#505054]">Issued total</span>
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-[#121212] border border-[#30D158]/30 flex flex-col gap-0.5">
          <span className="text-[10px] font-mono text-[#8E8E93] uppercase">Enrolled Students</span>
          <span className="text-lg font-bold font-mono text-[#30D158]">{totalEnrolledStudents}</span>
          <span className="text-[10px] text-[#505054]">Active in system</span>
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-[#121212] border border-[#0A84FF]/30 flex flex-col gap-0.5">
          <span className="text-[10px] font-mono text-[#8E8E93] uppercase">Activated Tokens</span>
          <span className="text-lg font-bold font-mono text-[#0A84FF]">{onboardedTokenCount}</span>
          <span className="text-[10px] text-[#505054]">Token-level onboarded</span>
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-[#121212] border border-[#FF9F0A]/30 flex flex-col gap-0.5">
          <span className="text-[10px] font-mono text-[#8E8E93] uppercase">Unassigned</span>
          <span className="text-lg font-bold font-mono text-[#FF9F0A]">{unassignedTokens.length}</span>
          <span className="text-[10px] text-[#505054]">Open for distribution</span>
        </div>
      </div>

      {/* ── SECTION 1: ACTIVE / ASSIGNED TOKENS ── */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#30D158]" />
          <h3 className="text-xs font-semibold font-mono text-[#30D158] uppercase tracking-wider">
            Active & Assigned Tokens
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#30D158]/10 border border-[#30D158]/30 text-[10px] font-mono text-[#30D158]">
            {assignedActiveTokens.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#30D158]/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] text-[#8E8E93] font-mono uppercase tracking-wider border-b border-[#3A3A3C]">
              <tr>
                <th className="px-4 py-2.5">Access Token</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Assigned Student</th>
                <th className="px-4 py-2.5">Class</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3A3C]/70">
              {assignedActiveTokens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[#505054] italic text-xs">
                    No assigned tokens yet.
                  </td>
                </tr>
              ) : (
                assignedActiveTokens.map((t) => {
                  const isCopied = copiedToken === t.token;
                  return (
                    <React.Fragment key={t.token}>
                      <tr className="hover:bg-[#252528] transition-colors">
                        <td className="px-4 py-2.5 font-mono font-bold text-[#F5F5F7]">
                          <span className="bg-[#121212] px-2 py-0.5 rounded border border-[#3A3A3C]">
                            {t.token}
                          </span>
                        </td>

                        <td className="px-4 py-2.5">
                          {t.isOnboarded ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30">
                              ACTIVATED
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/30">
                              AWAITING REG
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2.5 text-[#8E8E93]">
                          {t.studentName ? (
                            <span className="font-medium text-[#F5F5F7]">{t.studentName}</span>
                          ) : (
                            <span className="text-[#505054] italic">—</span>
                          )}
                        </td>

                        <td className="px-4 py-2.5 text-[#8E8E93] font-mono text-[11px]">
                          {t.assignedGrade || '—'}
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleCopy(t.token)}
                              title="Copy Token"
                              className="p-1.5 rounded-md bg-[#121212] hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-[#F5F5F7] border border-[#3A3A3C] transition-colors"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => adminRevokeToken(t.token)}
                              title="Revoke Token"
                              className="p-1.5 rounded-md bg-[#121212] hover:bg-[#FF453A]/10 text-[#8E8E93] hover:text-[#FF453A] border border-[#3A3A3C] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 2: UNASSIGNED / OPEN TOKENS ── */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <CircleDot className="w-4 h-4 text-[#FF9F0A]" />
          <h3 className="text-xs font-semibold font-mono text-[#FF9F0A] uppercase tracking-wider">
            Unassigned Tokens — Available for Distribution
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 text-[10px] font-mono text-[#FF9F0A]">
            {unassignedTokens.length}
          </span>
        </div>
        <p className="text-[11px] text-[#8E8E93]">
          These tokens have not been given to any student yet. Click the <strong className="text-[#0A84FF]">Assign</strong> button to link a token to a new student.
        </p>

        <div className="overflow-x-auto rounded-xl border border-[#FF9F0A]/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] text-[#8E8E93] font-mono uppercase tracking-wider border-b border-[#3A3A3C]">
              <tr>
                <th className="px-4 py-2.5">Access Token</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Class Tag</th>
                <th className="px-4 py-2.5">Issued Date</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3A3C]/70">
              {unassignedTokens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[#505054] italic text-xs">
                    All tokens have been assigned. Generate more using the button above.
                  </td>
                </tr>
              ) : (
                unassignedTokens.map((t) => {
                  const isCopied = copiedToken === t.token;
                  return (
                    <React.Fragment key={t.token}>
                      <tr className="hover:bg-[#252528] transition-colors">
                        <td className="px-4 py-2.5 font-mono font-bold text-[#F5F5F7]">
                          <span className="bg-[#121212] px-2 py-0.5 rounded border border-[#3A3A3C]">
                            {t.token}
                          </span>
                        </td>

                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/30">
                            UNCLAIMED
                          </span>
                        </td>

                        <td className="px-4 py-2.5 font-mono text-[#8E8E93] text-[11px]">
                          {t.assignedGrade || '—'}
                        </td>

                        <td className="px-4 py-2.5 font-mono text-[#8E8E93]">
                          {t.createdAt}
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => openAssignForm(t.token, t.assignedGrade)}
                              title="Assign to Student"
                              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30 transition-colors text-[11px] font-semibold"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Assign</span>
                            </button>
                            <button
                              onClick={() => handleCopy(t.token)}
                              title="Copy Token"
                              className="p-1.5 rounded-md bg-[#121212] hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-[#F5F5F7] border border-[#3A3A3C] transition-colors"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => adminRevokeToken(t.token)}
                              title="Delete Token"
                              className="p-1.5 rounded-md bg-[#121212] hover:bg-[#FF453A]/10 text-[#8E8E93] hover:text-[#FF453A] border border-[#3A3A3C] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {assigningToken === t.token && <AssignFormRow tokenStr={t.token} />}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
