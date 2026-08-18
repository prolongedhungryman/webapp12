import React from 'react';
import { useCamp } from '../../context/CampContext';
import { CodexBadgeIcon } from '../CodexBadgeIcon';
import { CODEX_PERKS } from '../../data/initialData';
import { CheckCircle, Lock, History } from 'lucide-react';

export const CodexRewardsTab: React.FC = () => {
  const { currentStudent, transactions } = useCamp();

  if (!currentStudent) return null;

  const studentTx = transactions
    .filter((tx) => tx.studentId === currentStudent.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div id="student-codex-rewards-tab" className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner Card with Hexagonal Circuit Badge */}
      <div className="p-6 sm:p-8 rounded-lg bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-[#3A3A3C] shadow-lg relative overflow-hidden">
        {/* Subtle background circuit pattern */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden sm:block">
          <CodexBadgeIcon size={180} />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="flex items-center space-x-2">
            <CodexBadgeIcon size={18} glow />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0A84FF]">
              CODEX DIGITAL REWARDS PROTOCOL
            </span>
          </div>

          <div>
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest">Available Balance</div>
            <div className="text-4xl sm:text-5xl font-light font-mono text-[#F5F5F7] tracking-tight mt-1 flex items-baseline space-x-3">
              <span>{currentStudent.codexBalance}</span>
              <span className="text-base sm:text-lg text-[#0A84FF] font-bold">CODEX</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
            CODEX tokens are merit-based digital assets awarded for consistent camp attendance, code reviews, algorithm sprints, and peer mentorship.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
              +10 per daily check-in
            </span>
            <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
              +50 registration grant
            </span>
            <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
              +30 per lab challenge
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">Camp Swag & Milestone Perks</h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">Redeemable at the Oxford Secondary School instructor desk.</p>
          </div>
          <span className="text-[10px] font-mono text-[#0A84FF] uppercase tracking-wider bg-[#121212] px-2.5 py-1 rounded border border-[#3A3A3C]">
            {CODEX_PERKS.filter(p => currentStudent.codexBalance >= p.cost).length}/{CODEX_PERKS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CODEX_PERKS.map((perk) => {
            const canAfford = currentStudent.codexBalance >= perk.cost;

            return (
              <div
                key={perk.id}
                className={`p-4 rounded-md border transition-all flex flex-col justify-between ${
                  canAfford
                    ? 'bg-[#121212] border-[#3A3A3C] hover:border-[#0A84FF]/60'
                    : 'bg-[#121212]/50 border-[#3A3A3C]/40 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#1E1E1E] text-[#8E8E93] border border-[#3A3A3C]">
                      {perk.category}
                    </span>
                    <div className="flex items-center space-x-1 font-mono text-xs font-bold">
                      <CodexBadgeIcon size={14} />
                      <span className={canAfford ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}>
                        {perk.cost} CODEX
                      </span>
                    </div>
                  </div>

                  <h4 className="mt-2 text-sm font-semibold text-[#F5F5F7]">
                    {perk.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#8E8E93] leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#3A3A3C]/60 flex items-center justify-between text-xs">
                  {canAfford ? (
                    <span className="inline-flex items-center text-[#30D158] font-medium space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Unlocked & Eligible</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[#8E8E93] space-x-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Need {perk.cost - currentStudent.codexBalance} more</span>
                    </span>
                  )}

                  <button
                    disabled={!canAfford}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      canAfford
                        ? 'bg-[#0A84FF] hover:bg-[#0071E3] text-white font-semibold'
                        : 'bg-[#1E1E1E] text-[#505054] cursor-not-allowed border border-[#3A3A3C]'
                    }`}
                  >
                    {canAfford ? 'Claim at Desk' : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Point Transaction Ledger */}
      <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#0A84FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">CODEX Points Ledger</h3>
          </div>
          <span className="text-[10px] font-mono text-[#8E8E93]">
            {studentTx.length} TRANSACTIONS
          </span>
        </div>

        {studentTx.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#8E8E93]">
            No transaction records found yet. Check in daily to accumulate points.
          </div>
        ) : (
          <div className="divide-y divide-[#3A3A3C]/50">
            {studentTx.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-medium text-[#F5F5F7]">{tx.reason}</div>
                  <div className="text-[11px] font-mono text-[#8E8E93]">{tx.date}</div>
                </div>
                <div className="font-mono font-bold text-sm text-[#30D158] flex items-center space-x-1">
                  <span>+{tx.amount}</span>
                  <span className="text-xs font-normal text-[#8E8E93]">CODEX</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
