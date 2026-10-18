export const tokens = {
  colors: {
    // Canvas & Surfaces
    bgMain: '#080B16',
    bgSidebar: '#0D1220',
    bgSurfaceSecondary: '#111827',
    bgSurfaceElevated: '#151D2E',
    bgSurfaceRaised: '#1A2438',
    
    // Borders
    border: 'rgba(148, 163, 184, 0.14)',
    borderHover: 'rgba(56, 217, 255, 0.35)',
    borderActive: '#38D9FF',
    borderMuted: 'rgba(148, 163, 184, 0.08)',
    
    // Typography
    textPrimary: '#F4F7FC',
    textSecondary: '#9AA7BC',
    textMuted: '#64748B',
    
    // Brand Accents
    primaryAccent: '#38D9FF', // Electric Cyan
    secondaryAccent: '#8B5CF6', // Vibrant Violet
    accent: '#38D9FF',
    accentHighlight: '#80E5FF',
    accentSubtle: 'rgba(56, 217, 255, 0.12)',
    accentVioletSubtle: 'rgba(139, 92, 246, 0.12)',
    
    // Status Tiers
    success: '#34D399',
    warning: '#FBBF24',
    error: '#FB7185',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    full: '9999px',
  },
  typography: {
    fontSans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  motion: {
    durationFast: '150ms',
    durationNormal: '240ms',
    durationSlow: '360ms',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
};
