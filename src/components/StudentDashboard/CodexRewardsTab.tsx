import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { CodexBadgeIcon } from '../CodexBadgeIcon';
import { CheckCircle, Lock, History, AlertCircle, ShoppingBag } from 'lucide-react';

interface ShopItem {
  id: string;
  title: string;
  cost: number;
  description: string;
  category: 'MODULE' | 'LIBRARY' | 'NOTES' | 'HOSTING' | 'HARDWARE' | 'BUNDLE';
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'shop_modules',
    title: 'Advanced Interactive Coding Modules',
    cost: 500,
    description: 'Unlock step-by-step masterclasses on advanced CSS layouts, Node.js architecture, and React state systems.',
    category: 'MODULE',
  },
  {
    id: 'shop_libraries',
    title: 'Premium Developer Components Library',
    cost: 1200,
    description: 'Lifetime authorization key to premium CSS/Tailwind component libraries and responsive landing page templates.',
    category: 'LIBRARY',
  },
  {
    id: 'shop_notes',
    title: 'Oxford Bootcamp Handwritten Notes PDF',
    cost: 2500,
    description: 'High-quality comprehensive digital scan of the instructors\' systems engineering and full-stack architecture notebooks.',
    category: 'NOTES',
  },
  {
    id: 'shop_hosting',
    title: '1-Year Custom Domain & Web Hosting',
    cost: 5000,
    description: 'Claim a custom .COM or .DEV domain name registry complete with a 1-year node/static cloud hosting server.',
    category: 'HOSTING',
  },
  {
    id: 'shop_arduino',
    title: 'Arduino Electronics Projects Kit',
    cost: 8000,
    description: 'Physical hardware kit including Arduino Uno controller board, breadboard, resistors, sensors, and jumper wires.',
    category: 'HARDWARE',
  },
  {
    id: 'shop_bundle',
    title: 'Highest Reward: Custom Domain + Arduino Kit',
    cost: 10000,
    description: 'The ultimate camp milestone! Unlocks the premium custom domain web hosting package AND the physical Arduino electronics kit.',
    category: 'BUNDLE',
  }
];

export const CodexRewardsTab: React.FC = () => {
  const { currentStudent, transactions, redeemCodexReward } = useCamp();
  
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!currentStudent) return null;

  const studentTx = transactions
    .filter((tx) => tx.studentId === currentStudent.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const handlePurchase = async (item: ShopItem) => {
    if (currentStudent.codexBalance < item.cost) {
      setErrorMsg('Insufficient CODEX points.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to purchase "${item.title}" for ${item.cost} CODEX points?`)) {
      setRedeemingId(item.id);
      setErrorMsg(null);
      setSuccessMsg(null);
      
      const res = await redeemCodexReward(item.id, item.title, item.cost);
      setRedeemingId(null);
      
      if (res.success) {
        setSuccessMsg(`Successfully purchased "${item.title}"! Points deducted.`);
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(res.message || 'Purchase failed.');
      }
    }
  };

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
            CODEX tokens are merit-based digital assets awarded for consistent camp attendance, code reviews, algorithm sprints, and peer mentorship. Spend them in our secure shop below.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
              +50 per daily check-in
            </span>
            <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
              +50 registration grant
            </span>
            <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#3A3A3C] text-[#8E8E93]">
              Up to +500 per coding challenge
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-lg bg-[#30D158]/10 border border-[#30D158]/35 text-xs text-[#30D158] flex items-center space-x-2">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-lg bg-[#FF453A]/10 border border-[#FF453A]/35 text-xs text-[#FF453A] flex items-center space-x-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Rewards Catalog */}
      <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7] flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#0A84FF]" />
              <span>CODEX Digital Shop</span>
            </h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">Spend your earned CODEX points to claim premium tools and physical kits.</p>
          </div>
          <span className="text-[10px] font-mono text-[#0A84FF] uppercase tracking-wider bg-[#121212] px-2.5 py-1 rounded border border-[#3A3A3C]">
            {SHOP_ITEMS.filter(p => currentStudent.codexBalance >= p.cost).length}/{SHOP_ITEMS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHOP_ITEMS.map((item) => {
            const canAfford = currentStudent.codexBalance >= item.cost;
            const isRedeeming = redeemingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-md border transition-all flex flex-col justify-between ${
                  canAfford
                    ? 'bg-[#121212] border-[#3A3A3C] hover:border-[#0A84FF]/60'
                    : 'bg-[#121212]/50 border-[#3A3A3C]/40 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#1E1E1E] text-[#8E8E93] border border-[#3A3A3C]">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-1 font-mono text-xs font-bold">
                      <CodexBadgeIcon size={14} />
                      <span className={canAfford ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}>
                        {item.cost} CODEX
                      </span>
                    </div>
                  </div>

                  <h4 className="mt-2 text-sm font-semibold text-[#F5F5F7]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#8E8E93] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#3A3A3C]/60 flex items-center justify-between text-xs">
                  {canAfford ? (
                    <span className="inline-flex items-center text-[#30D158] font-medium space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Eligible for Purchase</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[#8E8E93] space-x-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Need {item.cost - currentStudent.codexBalance} more</span>
                    </span>
                  )}

                  <button
                    disabled={!canAfford || isRedeeming}
                    onClick={() => handlePurchase(item)}
                    className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                      canAfford
                        ? 'bg-[#0A84FF] hover:bg-[#0071E3] text-white'
                        : 'bg-[#1E1E1E] text-[#505054] cursor-not-allowed border border-[#3A3A3C]'
                    }`}
                  >
                    {isRedeeming ? 'Processing...' : canAfford ? 'Purchase' : 'Locked'}
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
                <div className="font-mono font-bold text-sm flex items-center space-x-1">
                  <span className={tx.type === 'EARNED' ? 'text-[#30D158]' : 'text-[#FF453A]'}>
                    {tx.type === 'EARNED' ? '+' : '-'}{tx.amount}
                  </span>
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
