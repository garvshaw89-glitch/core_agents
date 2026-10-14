import React from 'react';

interface CoreSymbolProps {
  className?: string;
  size?: number;
}

export const CoreSymbol: React.FC<CoreSymbolProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="CORE Agents emblem"
      role="img"
    >
      {/* Outer hairline orbit */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="#292936"
        strokeWidth="1.2"
        strokeDasharray="2 3"
      />
      {/* Inner boundary orbit */}
      <circle
        cx="16"
        cy="16"
        r="9.5"
        stroke="#A78BFA"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      {/* Core nucleus diamond-rhombus */}
      <path
        d="M16 8L22 16L16 24L10 16Z"
        fill="#A78BFA"
        fillOpacity="0.25"
        stroke="#A78BFA"
        strokeWidth="1.2"
      />
      {/* Focal point center */}
      <circle cx="16" cy="16" r="2.5" fill="#F4F2FA" />
      {/* Cardinal orientation ticks */}
      <line x1="16" y1="2" x2="16" y2="4.5" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="27.5" x2="16" y2="30" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="2" y1="16" x2="4.5" y2="16" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27.5" y1="16" x2="30" y2="16" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};
