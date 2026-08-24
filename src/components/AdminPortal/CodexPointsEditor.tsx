import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { Minus, Plus } from 'lucide-react';

export const CodexPointsEditor: React.FC = () => {
  const { students, adjustCodexPoints } = useCamp();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdjust = async (tokenId: string, delta: number) => {
    setBusyId(tokenId);
    setError(null);
    try {
      await adjustCodexPoints(tokenId, delta);
    } catch (err: any) {
      setError(err?.message || 'Could not adjust CODEX points.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-[#121212] border border-[#3A3A3C] space-y-3">
      <h3 className="text-sm font-semibold text-[#F5F5F7]">CODEX points</h3>
      {error && <p className="text-xs text-[#FF453A]">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-[#3A3A3C]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1E1E1E] text-[#8E8E93] font-mono uppercase">
            <tr>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Token</th>
              <th className="px-3 py-2">Points</th>
              <th className="px-3 py-2 text-right">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3A3C]/70">
            {students.map((stu) => (
              <tr key={stu.id}>
                <td className="px-3 py-2 text-[#F5F5F7]">{stu.fullName}</td>
                <td className="px-3 py-2 font-mono text-[#8E8E93]">{stu.tokenId}</td>
                <td className="px-3 py-2 font-mono text-[#0A84FF]">{stu.codexBalance}</td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex items-center space-x-1.5">
                    <button
                      disabled={busyId === stu.tokenId}
                      onClick={() => handleAdjust(stu.tokenId, -1)}
                      className="p-1.5 rounded-md border border-[#3A3A3C] hover:border-[#FF453A]/40 hover:text-[#FF453A]"
                      title="Minus 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={busyId === stu.tokenId}
                      onClick={() => handleAdjust(stu.tokenId, 1)}
                      className="p-1.5 rounded-md border border-[#3A3A3C] hover:border-[#30D158]/40 hover:text-[#30D158]"
                      title="Plus 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
