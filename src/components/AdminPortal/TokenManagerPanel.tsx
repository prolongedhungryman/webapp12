import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { KeyRound, Plus, Copy, Check, Trash2, ShieldCheck, Sparkles, UserPlus, AlertCircle } from 'lucide-react';

export const TokenManagerPanel: React.FC = () => {
  const { tokens, adminGenerateToken, adminRevokeToken } = useCamp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [targetGrade, setTargetGrade] = useState('Grade 10');
  const [studentNamePre, setStudentNamePre] = useState('');
  const [justGeneratedToken, setJustGeneratedToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

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

  const onboardedCount = tokens.filter((t) => t.isOnboarded).length;
  const pendingCount = tokens.length - onboardedCount;

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
            Issue cryptographically formatted single-use authentication codes for camp onboarding.
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
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
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
      <div className="flex items-center space-x-3 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-md bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
          Total Issued: <strong className="text-[#F5F5F7]">{tokens.length}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
          Activated: <strong className="text-[#30D158]">{onboardedCount}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
          Unclaimed: <strong className="text-[#0A84FF]">{pendingCount}</strong>
        </span>
      </div>

      {/* Token List */}
      <div className="overflow-x-auto rounded-xl border border-[#3A3A3C]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#121212] text-[#8E8E93] font-mono uppercase tracking-wider border-b border-[#3A3A3C]">
            <tr>
              <th className="px-4 py-3">Access Token</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned / Enrolled Student</th>
              <th className="px-4 py-3">Issued Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3A3C]/70">
            {tokens.map((t) => {
              const isCopied = copiedToken === t.token;

              return (
                <tr key={t.token} className="hover:bg-[#252528] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#F5F5F7]">
                    <span className="bg-[#121212] px-2 py-0.5 rounded border border-[#3A3A3C]">
                      {t.token}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {t.isOnboarded ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30">
                        ACTIVATED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/30">
                        UNCLAIMED
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-[#8E8E93]">
                    {t.studentName ? (
                      <span className="font-medium text-[#F5F5F7]">{t.studentName}</span>
                    ) : (
                      <span className="text-[#505054] italic">Unassigned (Open for distribution)</span>
                    )}
                    {t.assignedGrade && <span className="ml-1 text-[10px] text-[#8E8E93]">({t.assignedGrade})</span>}
                  </td>

                  <td className="px-4 py-3 font-mono text-[#8E8E93]">
                    {t.createdAt}
                  </td>

                  <td className="px-4 py-3 text-right">
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
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
