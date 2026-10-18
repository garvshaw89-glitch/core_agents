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
      <defs>
        <linearGradient id="coreSymbolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38D9FF" />
          <stop offset="60%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38D9FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38D9FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle background tile */}
      <rect width="32" height="32" rx="7" fill="#080B16" />
      <rect width="31" height="31" x="0.5" y="0.5" rx="6.5" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />

      {/* Central glow aura */}
      <circle cx="16" cy="16" r="6" fill="url(#coreGlow)" />

      {/* The Geometric 'C' outer sweep */}
      <path
        d="M21.5 10C19.5 7.5 15.5 6.8 12.5 8C8.5 9.5 6.5 13.5 6.5 16C6.5 18.5 8.5 22.5 12.5 24C15.5 25.2 19.5 24.5 21.5 22L18.8 19.8C17.5 21.2 14.8 21.8 12.8 20.8C10.5 19.8 9.5 17.5 9.5 16C9.5 14.5 10.5 12.2 12.8 11.2C14.8 10.2 17.5 10.8 18.8 12.2Z"
        fill="url(#coreSymbolGrad)"
      />

      {/* Circuit link dashed line */}
      <line x1="16" y1="16" x2="21.5" y2="10" stroke="#38D9FF" strokeWidth="0.8" strokeDasharray="1.2 1.2" opacity="0.5" />
      <line x1="16" y1="16" x2="21.5" y2="22" stroke="#8B5CF6" strokeWidth="0.8" strokeDasharray="1.2 1.2" opacity="0.5" />

      {/* Terminal Node Accent Dots */}
      <circle cx="21.5" cy="10" r="1.4" fill="#38D9FF" />
      <circle cx="21.5" cy="22" r="1.4" fill="#8B5CF6" />

      {/* Central AI Core Diamond */}
      <polygon
        points="16,13 18.5,14.5 18.5,17.5 16,19 13.5,17.5 13.5,14.5"
        fill="#080B16"
        stroke="url(#coreSymbolGrad)"
        strokeWidth="1"
      />
      <circle cx="16" cy="16" r="1.2" fill="#FFFFFF" />
    </svg>
  );
};
