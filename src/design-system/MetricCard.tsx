import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export type MetricStatus = 'default' | 'active' | 'success' | 'warning' | 'danger' | 'info';

export interface MetricTrend {
  value: string;
  positive?: boolean;
  direction?: 'up' | 'down' | 'neutral';
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  status?: MetricStatus;
  icon?: React.ReactNode;
  trend?: MetricTrend | React.ReactNode;
  badge?: React.ReactNode;
  subtext?: React.ReactNode;
  filterNotice?: string;
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  status = 'default',
  icon,
  trend,
  badge,
  subtext,
  filterNotice,
  onClick,
  interactive,
  className = '',
  ariaLabel,
}) => {
  const isClickable = interactive ?? Boolean(onClick);

  // Status-driven theme styling
  const statusConfig: Record<
    MetricStatus,
    {
      iconBox: string;
      hoverBorder: string;
      glowAccent: string;
      trendBadge: string;
    }
  > = {
    active: {
      iconBox: 'bg-[#38D9FF]/15 text-[#38D9FF] border border-[#38D9FF]/30 shadow-[0_0_12px_rgba(56,217,255,0.15)]',
      hoverBorder: 'hover:border-[#38D9FF]/60 hover:shadow-[0_0_20px_rgba(56,217,255,0.12)]',
      glowAccent: 'from-[#38D9FF]/10 via-transparent to-transparent',
      trendBadge: 'text-[#38D9FF] bg-[#38D9FF]/10 border border-[#38D9FF]/20',
    },
    success: {
      iconBox: 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 shadow-[0_0_12px_rgba(52,211,153,0.15)]',
      hoverBorder: 'hover:border-[#34D399]/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]',
      glowAccent: 'from-[#34D399]/10 via-transparent to-transparent',
      trendBadge: 'text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20',
    },
    warning: {
      iconBox: 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]',
      hoverBorder: 'hover:border-[#FBBF24]/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]',
      glowAccent: 'from-[#FBBF24]/10 via-transparent to-transparent',
      trendBadge: 'text-[#FBBF24] bg-[#FBBF24]/15 border border-[#FBBF24]/30',
    },
    danger: {
      iconBox: 'bg-[#FB7185]/15 text-[#FB7185] border border-[#FB7185]/30 shadow-[0_0_12px_rgba(251,113,133,0.15)]',
      hoverBorder: 'hover:border-[#FB7185]/60 hover:shadow-[0_0_20px_rgba(251,113,133,0.12)]',
      glowAccent: 'from-[#FB7185]/10 via-transparent to-transparent',
      trendBadge: 'text-[#FB7185] bg-[#FB7185]/15 border border-[#FB7185]/30',
    },
    info: {
      iconBox: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
      hoverBorder: 'hover:border-[#8B5CF6]/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]',
      glowAccent: 'from-[#8B5CF6]/10 via-transparent to-transparent',
      trendBadge: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20',
    },
    default: {
      iconBox: 'bg-[#151D2E] text-[#9AA7BC] border border-slate-700/60',
      hoverBorder: 'hover:border-slate-700 hover:shadow-md',
      glowAccent: 'from-slate-800/10 via-transparent to-transparent',
      trendBadge: 'text-[#9AA7BC] bg-[#151D2E] border border-slate-700/60',
    },
  };

  const currentTheme = statusConfig[status];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  // Render trend element
  const renderTrend = () => {
    if (!trend) return null;

    if (React.isValidElement(trend)) {
      return trend;
    }

    const trendObj = trend as MetricTrend;
    const isPositive = trendObj.positive ?? trendObj.direction === 'up';
    const isNegative = trendObj.direction === 'down' || (!isPositive && trendObj.positive === false);

    return (
      <div
        className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
          isPositive
            ? 'text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20'
            : isNegative
              ? 'text-[#FB7185] bg-[#FB7185]/10 border border-[#FB7185]/20'
              : currentTheme.trendBadge
        }`}
      >
        {isPositive && <TrendingUp size={11} />}
        {isNegative && <TrendingDown size={11} />}
        <span>{trendObj.value}</span>
      </div>
    );
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `${label}: ${value}`}
      className={`p-4 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 transition-all duration-200 text-left relative overflow-hidden group select-none backdrop-blur-md ${
        isClickable
          ? `cursor-pointer ${currentTheme.hoverBorder} hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38D9FF] active:scale-[0.99]`
          : ''
      } ${className}`}
    >
      {/* Top subtle accent gradient */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${currentTheme.glowAccent} opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      {/* Header Row: Label & Icon */}
      <div className="flex items-center justify-between text-xs text-[#9AA7BC] mb-2.5">
        <span className="font-medium group-hover:text-[#F4F7FC] transition-colors">{label}</span>
        {icon && (
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${currentTheme.iconBox}`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value Row: Numeric Telemetry & Trend / Badge */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold text-[#F4F7FC] font-mono tabular-nums tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {renderTrend()}
          {badge}
        </div>
      </div>

      {/* Subtext & Navigation Affordance Row */}
      {(subtext || isClickable) && (
        <div className="text-[11px] text-[#64748B] mt-2 flex items-center justify-between gap-2">
          <div className="truncate text-[#64748B] group-hover:text-[#9AA7BC] transition-colors">
            {subtext}
          </div>
          {isClickable && (
            <div className="flex items-center gap-1 text-[10px] text-[#64748B] group-hover:text-[#38D9FF] transition-colors shrink-0 font-medium">
              <span>{filterNotice || 'View'}</span>
              <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
