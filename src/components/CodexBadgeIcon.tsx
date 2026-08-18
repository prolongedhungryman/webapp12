import React from 'react';

interface CodexBadgeIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const CodexBadgeIcon: React.FC<CodexBadgeIconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  glow = false
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-[#0A84FF]/25 blur-md rounded-full pointer-events-none" />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 text-[#0A84FF]"
      >
        {/* Hexagon Outer Frame */}
        <polygon
          points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(10, 132, 255, 0.08)"
        />
        {/* Internal Circuit Core */}
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" fill="rgba(10, 132, 255, 0.25)" />
        {/* Circuit traces */}
        <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="12" x2="6.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17.5" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Micro-nodes */}
        <circle cx="12" cy="6" r="0.9" fill="currentColor" />
        <circle cx="12" cy="18" r="0.9" fill="currentColor" />
        <circle cx="6.5" cy="12" r="0.9" fill="currentColor" />
        <circle cx="17.5" cy="12" r="0.9" fill="currentColor" />
      </svg>
    </div>
  );
};
