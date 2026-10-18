import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Inbox,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react';

interface WorkflowRoutingMapProps {
  className?: string;
}

export const WorkflowRoutingMap: React.FC<WorkflowRoutingMapProps> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activePath, setActivePath] = useState<'all' | 'primary' | 'secondary' | 'fallback'>('all');
  const [inspectedStage, setInspectedStage] = useState<string | null>(null);

  const stages = [
    {
      id: 'intake',
      label: 'Intake',
      sub: 'Ingestion & triggers',
      icon: Inbox,
      stats: '100% (2.4k/hr)',
      color: '#38D9FF',
    },
    {
      id: 'classify',
      label: 'Classify',
      sub: 'Intent & specialist routing',
      icon: Cpu,
      stats: '68% Research · 22% Ops',
      color: '#8B5CF6',
    },
    {
      id: 'review',
      label: 'Review',
      sub: 'Human approval gates',
      icon: ShieldCheck,
      stats: '94% Auto · 6% Hold',
      color: '#38D9FF',
    },
    {
      id: 'fallback',
      label: 'Fallback',
      sub: 'Auto-retry & recovery',
      icon: AlertTriangle,
      stats: '99.2% Recovered',
      color: '#FBBF24',
    },
    {
      id: 'deliver',
      label: 'Deliver',
      sub: 'Webhook & cited output',
      icon: CheckCircle2,
      stats: '98.6% SLA hit',
      color: '#34D399',
    },
  ];

  return (
    <div
      className={`rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 p-5 backdrop-blur-xl relative overflow-hidden group ${className}`}
    >
      {/* Top Header bar with live pulse & selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <h2 className="text-sm font-semibold text-[#F4F7FC]">Workflow Routing Matrix</h2>
          <span className="text-[11px] font-mono text-[#64748B]">· Real-time specialist telemetry</span>
        </div>

        {/* Path Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#111827] border border-slate-800/70 rounded-xl text-[11px]">
          <button
            type="button"
            onClick={() => setActivePath('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activePath === 'all'
                ? 'bg-[#151D2E] text-[#38D9FF] font-semibold shadow-xs'
                : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
            }`}
          >
            All Paths
          </button>
          <button
            type="button"
            onClick={() => setActivePath('primary')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePath === 'primary'
                ? 'bg-[#151D2E] text-[#38D9FF] font-semibold shadow-xs'
                : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38D9FF]" />
            <span>Primary (68%)</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePath('secondary')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePath === 'secondary'
                ? 'bg-[#151D2E] text-[#8B5CF6] font-semibold shadow-xs'
                : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span>Secondary (22%)</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePath('fallback')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePath === 'fallback'
                ? 'bg-[#151D2E] text-[#FBBF24] font-semibold shadow-xs'
                : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
            <span>Fallback (10%)</span>
          </button>
        </div>
      </div>

      {/* SVG Pipeline Canvas */}
      <div className="relative pt-6 pb-4">
        {/* Responsive grid of stage cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isHovered = inspectedStage === stage.id;

            return (
              <div
                key={stage.id}
                onMouseEnter={() => setInspectedStage(stage.id)}
                onMouseLeave={() => setInspectedStage(null)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'bg-[#151D2E] border-[#38D9FF]/60 shadow-lg shadow-[#38D9FF]/5 -translate-y-0.5'
                    : 'bg-[#111827]/80 border-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: `${stage.color}15`,
                      color: stage.color,
                      border: `1px solid ${stage.color}30`,
                    }}
                  >
                    <Icon size={14} />
                  </div>
                  <span className="text-[10px] font-mono text-[#64748B]">Step 0{idx + 1}</span>
                </div>

                <div className="text-xs font-semibold text-[#F4F7FC] truncate">{stage.label}</div>
                <div className="text-[11px] text-[#9AA7BC] truncate mt-0.5">{stage.sub}</div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#64748B]">Metric:</span>
                  <span className="text-[#F4F7FC] font-medium truncate ml-1">{stage.stats}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Conduit Flow Trace */}
        <div className="hidden md:block mt-4 pt-3 border-t border-slate-800/40">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38D9FF]" />
              <span className="text-[#9AA7BC]">Deterministic Intent Pipeline</span>
              <span>·</span>
              <span className="text-[#34D399]">98.6% Total Success Rate</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Avg End-to-End Latency: <strong className="text-[#F4F7FC] font-semibold">1.84s</strong></span>
              <span>·</span>
              <span>Human Checkpoint: <strong className="text-[#FBBF24] font-semibold">Enforced</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
