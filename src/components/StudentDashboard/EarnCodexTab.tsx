import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { Award, Code, CheckCircle, AlertCircle, Play, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  category: 'HTML' | 'CSS' | 'JS';
  reward: number;
  description: string;
  instructions: string;
  starterCode: string;
  validationRules: {
    description: string;
    validate: (code: string) => boolean | Promise<boolean>;
  }[];
}

const CHALLENGES: Challenge[] = [
  {
    id: 'challenge_html_semantic',
    title: 'Semantic Layout Architect',
    category: 'HTML',
    reward: 150,
    description: 'Structure a web page layout using modern semantic HTML5 markup tags.',
    instructions: 'Write a valid HTML layout that contains at least one of each: <header>, <nav>, <main>, <section>, and <footer> tags. Do not worry about styling, just structure!',
    starterCode: `<!-- Write your semantic HTML layout below -->
<div class="container">
  <!-- TODO: Replace divs with semantic elements -->
  <div class="header">Header Section</div>
  <div class="navigation">Navbar Link</div>
  <div class="content">
    <div class="card">Camp Section</div>
  </div>
  <div class="footer">Footer Info</div>
</div>`,
    validationRules: [
      {
        description: 'Contains a <header> element',
        validate: (code) => /<header\b[^>]*>/i.test(code) && /<\/header>/i.test(code)
      },
      {
        description: 'Contains a <nav> element',
        validate: (code) => /<nav\b[^>]*>/i.test(code) && /<\/nav>/i.test(code)
      },
      {
        description: 'Contains a <main> element',
        validate: (code) => /<main\b[^>]*>/i.test(code) && /<\/main>/i.test(code)
      },
      {
        description: 'Contains a <section> element',
        validate: (code) => /<section\b[^>]*>/i.test(code) && /<\/section>/i.test(code)
      },
      {
        description: 'Contains a <footer> element',
        validate: (code) => /<footer\b[^>]*>/i.test(code) && /<\/footer>/i.test(code)
      }
    ]
  },
  {
    id: 'challenge_css_glass',
    title: 'Glassmorphic Glow Card',
    category: 'CSS',
    reward: 250,
    description: 'Design a high-tech glassmorphism CSS class card with hover glow details.',
    instructions: 'Develop a CSS stylesheet for class `.glass-card`. It must implement a backdrop filter blur of at least 8px, a semi-transparent border, and a smooth transition property for hover-effects.',
    starterCode: `/* Create your .glass-card styles below */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  /* TODO: Implement backdrop blur, border, and transitions */
  
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(10, 132, 255, 0.3);
}`,
    validationRules: [
      {
        description: 'Includes backdrop-filter: blur() with value of at least 8px',
        validate: (code) => {
          const match = code.match(/backdrop-filter:\s*blur\(\s*(\d+)px\s*\)/i);
          return match ? parseInt(match[1]) >= 8 : false;
        }
      },
      {
        description: 'Implements a transparent/semi-transparent border',
        validate: (code) => /border\s*:\s*[^;]*rgba/i.test(code) || /border-color\s*:\s*[^;]*rgba/i.test(code) || /border\s*:\s*\d+px\s*solid\s*[^;]*/i.test(code)
      },
      {
        description: 'Includes transition definition for smooth hover scaling or glows',
        validate: (code) => /transition\s*:/i.test(code)
      }
    ]
  },
  {
    id: 'challenge_js_regex',
    title: 'Oxford Token Serial Parser',
    category: 'JS',
    reward: 500,
    description: 'Implement a validation algorithm that matches the camp access code pattern.',
    instructions: 'Write a JavaScript function named `validateToken(token)` that returns `true` if the input is a valid Oxford camp token, else `false`. A valid token starts with "OXF-2026-" followed by exactly 4 alphanumeric characters (case-insensitive).',
    starterCode: `function validateToken(token) {
  // TODO: Validate token pattern e.g., "OXF-2026-F3E4"
  // Return true if valid, false if invalid
  
}`,
    validationRules: [
      {
        description: 'Function validateToken is defined',
        validate: (code) => /function\s+validateToken\s*\(/i.test(code) || /const\s+validateToken\s*=\s*/i.test(code)
      },
      {
        description: 'Correctly matches valid token format (e.g. "OXF-2026-A1B2" returns true)',
        validate: (code) => {
          try {
            const func = new Function(code + '\nreturn validateToken("OXF-2026-A1B2");')();
            return func === true;
          } catch {
            return false;
          }
        }
      },
      {
        description: 'Correctly rejects invalid tokens (e.g. "OXF-2025-A1B2" returns false)',
        validate: (code) => {
          try {
            const func = new Function(code + '\nreturn validateToken("OXF-2025-A1B2");')();
            return func === false;
          } catch {
            return false;
          }
        }
      },
      {
        description: 'Correctly rejects tokens with incorrect suffix length (e.g. "OXF-2026-A1B" or "OXF-2026-A1B2C" returns false)',
        validate: (code) => {
          try {
            const func1 = new Function(code + '\nreturn validateToken("OXF-2026-A1B");')();
            const func2 = new Function(code + '\nreturn validateToken("OXF-2026-A1B2C");')();
            return func1 === false && func2 === false;
          } catch {
            return false;
          }
        }
      }
    ]
  }
];

export const EarnCodexTab: React.FC = () => {
  const { currentStudent, transactions, completeChallenge } = useCamp();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [editorCode, setEditorCode] = useState('');
  const [validationResults, setValidationResults] = useState<{ desc: string; passed: boolean }[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!currentStudent) return null;

  const isChallengeCompleted = (challengeTitle: string) => {
    return transactions.some(
      (tx) => tx.studentId === currentStudent.id && tx.reason === `Challenge Completed: ${challengeTitle}`
    );
  };

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setEditorCode(challenge.starterCode);
    setValidationResults([]);
    setHasVerified(false);
    setClaimSuccess(null);
    setErrorMsg(null);
  };

  const handleVerify = async () => {
    if (!selectedChallenge) return;
    setIsVerifying(true);
    setErrorMsg(null);
    setHasVerified(false);

    // Simulate run time delay for visual impact
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const results = [];
    let allPassed = true;

    for (const rule of selectedChallenge.validationRules) {
      try {
        const passed = await rule.validate(editorCode);
        results.push({ desc: rule.description, passed });
        if (!passed) allPassed = false;
      } catch (err) {
        results.push({ desc: rule.description, passed: false });
        allPassed = false;
      }
    }

    setValidationResults(results);
    setIsVerifying(false);
    setHasVerified(true);

    if (allPassed) {
      // Trigger contract completion on public database
      const res = await completeChallenge(selectedChallenge.id, selectedChallenge.title, selectedChallenge.reward);
      if (res.success) {
        setClaimSuccess(`Challenge successfully completed! +${selectedChallenge.reward} CODEX Points awarded.`);
      } else {
        setErrorMsg(res.message || 'Verification succeeded, but failed to claim points.');
      }
    } else {
      setErrorMsg('Code verification failed. Check the rules checklist and adjust your code.');
    }
  };

  return (
    <div id="student-earn-codex-tab" className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Welcome Title */}
      {!selectedChallenge ? (
        <>
          <div className="p-6 rounded-lg bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-[#3A3A3C] shadow-sm">
            <h2 className="text-xl font-bold text-[#F5F5F7] flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#0A84FF] animate-pulse" />
              <span>Earn CODEX: Dev Challenges Hub</span>
            </h2>
            <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
              Level up your developer skill sets! Write standard HTML, CSS, and JS to build mini components, solve challenges, and securely earn real CODEX points. Each challenge can be completed once.
            </p>
          </div>

          {/* List of Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHALLENGES.map((challenge) => {
              const completed = isChallengeCompleted(challenge.title);
              
              return (
                <div
                  key={challenge.id}
                  className={`p-5 rounded-lg border transition-all flex flex-col justify-between ${
                    completed
                      ? 'bg-[#121212] border-[#30D158]/35 opacity-90'
                      : 'bg-[#1E1E1E] border-[#3A3A3C] hover:border-[#0A84FF]/60 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        challenge.category === 'HTML' ? 'bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/30' :
                        challenge.category === 'CSS' ? 'bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30' :
                        'bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/30'
                      }`}>
                        {challenge.category}
                      </span>
                      <span className="text-xs font-bold text-[#F5F5F7] flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-[#0A84FF]" />
                        <span>{challenge.reward} Pts</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#F5F5F7]">{challenge.title}</h3>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">{challenge.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#3A3A3C]/50 flex items-center justify-between">
                    {completed ? (
                      <span className="text-xs text-[#30D158] font-medium flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>COMPLETED</span>
                      </span>
                    ) : (
                      <span className="text-xs text-[#8E8E93] flex items-center space-x-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Available</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleSelectChallenge(challenge)}
                      className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                        completed
                          ? 'bg-[#121212] border border-[#3A3A3C] text-[#8E8E93] hover:bg-[#1E1E1E]'
                          : 'bg-[#0A84FF] hover:bg-[#0071E3] text-white'
                      }`}
                    >
                      {completed ? 'View Code' : 'Start Challenge'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Code Workspace Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom duration-200">
          
          {/* Left Column (5 cols): Challenge Description and Validation */}
          <div className="lg:col-span-5 space-y-6">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#1E1E1E] hover:bg-[#2C2C2E] border border-[#3A3A3C] text-xs text-[#8E8E93] hover:text-[#F5F5F7] transition-all font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </button>

            <div className="p-5 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-[#8E8E93]">Challenge Guidelines</span>
                <span className="text-xs font-bold text-[#0A84FF] flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{selectedChallenge.reward} CODEX</span>
                </span>
              </div>

              <h2 className="text-base font-bold text-[#F5F5F7]">{selectedChallenge.title}</h2>
              <div className="text-xs text-[#8E8E93] leading-relaxed space-y-2">
                <p className="font-semibold text-[#F5F5F7]">Instructions:</p>
                <p className="bg-[#121212] p-3 rounded border border-[#3A3A3C] text-[#F5F5F7] font-mono text-[11px] whitespace-pre-line leading-relaxed">
                  {selectedChallenge.instructions}
                </p>
              </div>
            </div>

            {/* Validation Checklist Card */}
            <div className="p-5 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">Validation Checklist</h3>
              
              {hasVerified ? (
                <div className="space-y-2">
                  {validationResults.map((r, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs">
                      {r.passed ? (
                        <CheckCircle className="w-4 h-4 text-[#30D158] shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#FF453A] shrink-0 mt-0.5" />
                      )}
                      <span className={r.passed ? 'text-[#30D158] font-medium' : 'text-[#8E8E93]'}>
                        {r.desc}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8E8E93]">
                  Write your solution in the editor and click <strong className="text-[#0A84FF]">Verify &amp; Submit</strong> to run the automated validation tests.
                </p>
              )}

              {claimSuccess && (
                <div className="p-3.5 rounded bg-[#30D158]/10 border border-[#30D158]/35 text-xs text-[#30D158] flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{claimSuccess}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded bg-[#FF453A]/10 border border-[#FF453A]/35 text-xs text-[#FF453A] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 cols): IDE Workspace */}
          <div className="lg:col-span-7 flex flex-col h-[500px] border border-[#3A3A3C] rounded-lg overflow-hidden bg-[#1E1E1E]">
            {/* Tab Header bar */}
            <div className="px-4 py-2 border-b border-[#3A3A3C] bg-[#121212] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-[#0A84FF]" />
                <span className="text-xs font-mono font-medium text-[#8E8E93]">
                  index.{selectedChallenge.category.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></span>
              </div>
            </div>

            {/* Code Textarea Area */}
            <div className="flex-1 relative font-mono text-xs flex">
              {/* Fake Gutter */}
              <div className="w-10 bg-[#121212] border-r border-[#3A3A3C]/60 text-right pr-2.5 py-4 text-[#505054] select-none flex flex-col space-y-0.5 font-bold">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                disabled={isChallengeCompleted(selectedChallenge.title) || isVerifying}
                className="flex-1 p-4 bg-[#1E1E1E] text-[#F5F5F7] font-mono text-xs focus:outline-none resize-none overflow-y-auto leading-relaxed border-0"
              />
            </div>

            {/* Action Bar */}
            <div className="px-4 py-3 bg-[#121212] border-t border-[#3A3A3C] flex items-center justify-between shrink-0">
              <span className="text-[10px] text-[#8E8E93] font-mono">
                UTF-8 • Sandbox Environment
              </span>
              <button
                onClick={handleVerify}
                disabled={isChallengeCompleted(selectedChallenge.title) || isVerifying}
                className={`flex items-center space-x-2 px-5 py-2 rounded text-xs font-bold transition-all active:scale-95 ${
                  isChallengeCompleted(selectedChallenge.title)
                    ? 'bg-[#1E1E1E] text-[#505054] border border-[#3A3A3C] cursor-not-allowed'
                    : 'bg-[#0A84FF] hover:bg-[#0071E3] text-white'
                }`}
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Running Tests...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Verify &amp; Submit Solution</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
