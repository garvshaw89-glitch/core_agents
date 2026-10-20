import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  BarChart3,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { ActivityRecord, Agent } from '../../types/app';

interface ActivityVolumeChartProps {
  activities: ActivityRecord[];
  agents: Agent[];
  isZeroState?: boolean;
  onNavigateToActivity?: (filter?: { status?: string }) => void;
}

interface DailyVolumePoint {
  date: string;
  displayDate: string;
  dayOfWeek: string;
  total: number;
  completed: number;
  awaiting_approval: number;
  failed: number;
  isPeakDay?: boolean;
}

interface HourlyVolumePoint {
  hour: string;
  hourNum: number;
  total: number;
  isPeakHour?: boolean;
  label: string;
}

export const ActivityVolumeChart: React.FC<ActivityVolumeChartProps> = ({
  activities,
  agents,
  isZeroState = false,
  onNavigateToActivity,
}) => {
  const [viewMode, setViewMode] = useState<'30days' | 'hourly'>('30days');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Compute 30-Day Historical Timeseries
  const { dailyData, peakDay, totalVolume, avgDailyVolume, successRate, hourlyData, peakHour } = useMemo(() => {
    if (isZeroState || (activities.length === 0 && agents.length === 0)) {
      return {
        dailyData: [],
        peakDay: null,
        totalVolume: 0,
        avgDailyVolume: 0,
        successRate: '100%',
        hourlyData: [],
        peakHour: null,
      };
    }

    // Base date is fixed around the simulated current date (Oct 20, 2026)
    const baseDate = new Date('2026-10-20T12:00:00Z');
    const daysCount = 30;
    const dailyMap: Record<string, DailyVolumePoint> = {};

    // 1. Initialize last 30 days
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });

      // Generate consistent deterministic realistic baseline volumes with weekday peaks (Tue/Thu)
      const dayIndex = d.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekend = dayIndex === 0 || dayIndex === 6;
      const isPeakWeekday = dayIndex === 2 || dayIndex === 4; // Tuesday or Thursday

      // Realistic baseline variance
      const seed = (d.getDate() * 7 + d.getMonth() * 13) % 17;
      let baseTotal = isWeekend ? 3 + (seed % 4) : 12 + (seed % 10);
      if (isPeakWeekday) baseTotal += 14 + (seed % 8); // Peak volume days

      // Specific known peak spike on Oct 14 (release deployment & sync)
      if (isoDate === '2026-10-14') {
        baseTotal = 42;
      }

      const completed = Math.max(1, Math.round(baseTotal * 0.9));
      const awaiting_approval = baseTotal > 15 ? Math.round(baseTotal * 0.07) : 0;
      const failed = Math.max(0, baseTotal - completed - awaiting_approval);

      dailyMap[isoDate] = {
        date: isoDate,
        displayDate,
        dayOfWeek,
        total: baseTotal,
        completed,
        awaiting_approval,
        failed,
      };
    }

    // 2. Overlay real activities from state
    activities.forEach((act) => {
      if (selectedAgentId !== 'all' && act.agentId !== selectedAgentId) {
        return;
      }
      const actDate = act.startTime ? act.startTime.split('T')[0] : '';
      if (dailyMap[actDate]) {
        dailyMap[actDate].total += 1;
        if (act.status === 'completed') dailyMap[actDate].completed += 1;
        else if (act.status === 'awaiting_approval') dailyMap[actDate].awaiting_approval += 1;
        else if (act.status === 'failed') dailyMap[actDate].failed += 1;
      }
    });

    // Filter by agent if selected (scale proportional when single agent is selected)
    const dailyPoints = Object.values(dailyMap).map((pt) => {
      if (selectedAgentId !== 'all') {
        // Proportionate slice for chosen agent
        const ratio = 0.35;
        const total = Math.max(1, Math.round(pt.total * ratio));
        const completed = Math.round(pt.completed * ratio);
        const awaiting_approval = Math.round(pt.awaiting_approval * ratio);
        const failed = Math.max(0, total - completed - awaiting_approval);
        return {
          ...pt,
          total,
          completed,
          awaiting_approval,
          failed,
        };
      }
      return pt;
    });

    // Find peak day
    let maxDay = dailyPoints[0];
    dailyPoints.forEach((pt) => {
      if (pt.total > (maxDay?.total || 0)) {
        maxDay = pt;
      }
    });

    if (maxDay) {
      maxDay.isPeakDay = true;
    }

    const totalRuns = dailyPoints.reduce((acc, p) => acc + p.total, 0);
    const totalCompleted = dailyPoints.reduce((acc, p) => acc + p.completed, 0);
    const avgRuns = Math.round((totalRuns / daysCount) * 10) / 10;
    const rate = totalRuns > 0 ? `${((totalCompleted / totalRuns) * 100).toFixed(1)}%` : '100%';

    // 3. Hourly distribution model (24 hours in UTC)
    // Enterprise usage typically peaks around 13:00 - 17:00 UTC (US morning / EU afternoon)
    const hourly: HourlyVolumePoint[] = [];
    const hourlyWeights = [
      2, 1, 1, 1, 2, 3, 5, 8, 14, 18, 22, 26, 28, 38, 44, 41, 35, 27, 20, 15, 11, 8, 5, 3,
    ];

    let maxHourlyVal = 0;
    let peakHourIndex = 14;

    for (let h = 0; h < 24; h++) {
      const hourStr = `${h.toString().padStart(2, '0')}:00`;
      const volume = Math.round((hourlyWeights[h] / 100) * (totalRuns / 7));
      if (volume > maxHourlyVal) {
        maxHourlyVal = volume;
        peakHourIndex = h;
      }
      hourly.push({
        hour: hourStr,
        hourNum: h,
        total: volume,
        label: `${hourStr} UTC`,
      });
    }

    if (hourly[peakHourIndex]) {
      hourly[peakHourIndex].isPeakHour = true;
    }

    return {
      dailyData: dailyPoints,
      peakDay: maxDay,
      totalVolume: totalRuns,
      avgDailyVolume: avgRuns,
      successRate: rate,
      hourlyData: hourly,
      peakHour: hourly[peakHourIndex],
    };
  }, [activities, agents, isZeroState, selectedAgentId]);

  // Custom Recharts Tooltip for 30-day Daily Volume
  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload as DailyVolumePoint;

    return (
      <div className="p-3.5 rounded-xl bg-[#080B16] border border-slate-700/80 shadow-2xl backdrop-blur-xl text-left min-w-[200px] z-50">
        <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-slate-800 text-xs">
          <div className="font-semibold text-[#F4F7FC]">
            {data.dayOfWeek}, {data.displayDate}
          </div>
          {data.isPeakDay && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#FBBF24] bg-[#FBBF24]/15 px-2 py-0.5 rounded-full border border-[#FBBF24]/30">
              <Flame size={10} />
              <span>30-Day Peak</span>
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[#9AA7BC]">Total Volume:</span>
            <span className="font-bold text-[#F4F7FC] text-sm">{data.total} runs</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-[#34D399]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              Completed:
            </span>
            <span>{data.completed}</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-[#FBBF24]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
              Approval Barrier:
            </span>
            <span>{data.awaiting_approval}</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-[#FB7185]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
              Failed / Retried:
            </span>
            <span>{data.failed}</span>
          </div>
        </div>

        {data.total > 25 && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-[#38D9FF] flex items-center gap-1 font-mono">
            <TrendingUp size={11} />
            <span>High concurrency period</span>
          </div>
        )}
      </div>
    );
  };

  // Custom Recharts Tooltip for 24-Hour Peak Distribution
  const CustomHourlyTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload as HourlyVolumePoint;

    return (
      <div className="p-3 rounded-xl bg-[#080B16] border border-slate-700/80 shadow-2xl backdrop-blur-xl text-left min-w-[170px] z-50">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-xs">
          <span className="font-semibold text-[#F4F7FC] font-mono">{data.label}</span>
          {data.isPeakHour && (
            <span className="text-[10px] text-[#FBBF24] bg-[#FBBF24]/15 px-1.5 py-0.5 rounded font-mono">
              Peak Window
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between font-mono text-xs">
          <span className="text-[#9AA7BC]">Hourly Traffic:</span>
          <span className="text-sm font-bold text-[#38D9FF]">{data.total} runs</span>
        </div>
        <div className="text-[10px] text-[#64748B] mt-1 font-mono">
          {data.hourNum >= 13 && data.hourNum <= 17
            ? '⚡ Peak execution window (webhook triggers)'
            : data.hourNum >= 1 && data.hourNum <= 6
              ? '🌙 Low traffic off-peak period'
              : 'Standard execution window'}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 backdrop-blur-md shadow-lg space-y-6 text-left">
      {/* Top Header & Telemetry Summary Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#38D9FF]/15 text-[#38D9FF] border border-[#38D9FF]/30">
              <BarChart3 size={16} />
            </div>
            <h2 className="text-base font-bold text-[#F4F7FC]">
              Agent Activity Volume & Peak Usage
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#111827] border border-slate-800 text-[#9AA7BC]">
              Last 30 Days
            </span>
          </div>
          <p className="text-xs text-[#9AA7BC]">
            Inspect daily workload volume, spot peak execution windows, and identify capacity trends across your fleet.
          </p>
        </div>

        {/* View Mode & Chart Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Agent Filter Selector */}
          <div className="w-40">
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-1.5 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer font-medium"
              aria-label="Filter chart by agent"
            >
              <option value="all">All Specialists ({agents.length})</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time View Switcher: 30-Day Trend vs Hourly Peak Distribution */}
          <div className="flex items-center p-1 bg-[#111827] border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('30days')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === '30days'
                  ? 'bg-[#151D2E] text-[#38D9FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#F4F7FC]'
              }`}
            >
              30-Day Timeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode('hourly')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'hourly'
                  ? 'bg-[#151D2E] text-[#38D9FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#F4F7FC]'
              }`}
            >
              Peak Hours (UTC)
            </button>
          </div>

          {/* Area vs Bar toggle for 30-day view */}
          {viewMode === '30days' && (
            <div className="flex items-center p-1 bg-[#111827] border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-[#151D2E] text-[#38D9FF]'
                    : 'text-[#64748B] hover:text-[#F4F7FC]'
                }`}
                title="Continuous Area Trend"
              >
                Area
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  chartType === 'bar'
                    ? 'bg-[#151D2E] text-[#38D9FF]'
                    : 'text-[#64748B] hover:text-[#F4F7FC]'
                }`}
                title="Discrete Daily Bars"
              >
                Bars
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Highlight Strip for Peak Usage Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {/* Stat 1: Total 30-Day Volume */}
        <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>30-DAY TOTAL</span>
            <Activity size={12} className="text-[#38D9FF]" />
          </div>
          <div className="text-xl font-bold text-[#F4F7FC] font-mono tabular-nums">
            {totalVolume.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#9AA7BC] mt-0.5">
            ~{avgDailyVolume} runs / day avg
          </div>
        </div>

        {/* Stat 2: Peak Traffic Day */}
        <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>PEAK VOLUME DAY</span>
            <Flame size={12} className="text-[#FBBF24]" />
          </div>
          <div className="text-xl font-bold text-[#FBBF24] font-mono tabular-nums">
            {peakDay ? `${peakDay.total} runs` : 'N/A'}
          </div>
          <div className="text-[10px] text-[#9AA7BC] mt-0.5">
            {peakDay ? `${peakDay.dayOfWeek}, ${peakDay.displayDate}` : 'No records'}
          </div>
        </div>

        {/* Stat 3: Peak Execution Window */}
        <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>PEAK HOURS WINDOW</span>
            <Clock size={12} className="text-[#38D9FF]" />
          </div>
          <div className="text-xl font-bold text-[#38D9FF] font-mono tabular-nums">
            14:00 - 17:00
          </div>
          <div className="text-[10px] text-[#9AA7BC] mt-0.5 font-mono">
            UTC timezone peak concurrency
          </div>
        </div>

        {/* Stat 4: Operational SLA Pass Rate */}
        <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>EXECUTION SUCCESS</span>
            <CheckCircle2 size={12} className="text-[#34D399]" />
          </div>
          <div className="text-xl font-bold text-[#34D399] font-mono tabular-nums">
            {successRate}
          </div>
          <div className="text-[10px] text-[#9AA7BC] mt-0.5">
            Deterministic completion
          </div>
        </div>
      </div>

      {/* Main Recharts Visualization Container */}
      <div className="h-[280px] w-full pt-2">
        {dailyData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-[#64748B]">
            <Activity size={24} className="text-slate-600 mb-2" />
            <div className="font-semibold text-[#9AA7BC]">No activity volume recorded</div>
            <p className="max-w-sm mt-1">
              Switch from Zero State mode in the header or run workflows to visualize 30-day activity traces.
            </p>
          </div>
        ) : viewMode === '30days' ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38D9FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38D9FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="emeraldVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} opacity={0.6} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#1E293B' }}
                  interval={3}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total Executions"
                  stroke="#38D9FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cyanVolumeGradient)"
                  activeDot={{ r: 5, fill: '#38D9FF', stroke: '#080B16', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#34D399"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  fillOpacity={1}
                  fill="url(#emeraldVolumeGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} opacity={0.6} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#1E293B' }}
                  interval={3}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#38D9FF" radius={[0, 0, 0, 0]} />
                <Bar dataKey="awaiting_approval" name="Approval Gate" stackId="a" fill="#FBBF24" />
                <Bar dataKey="failed" name="Failed" stackId="a" fill="#FB7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          /* Hourly Distribution Chart */
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} opacity={0.6} />
              <XAxis
                dataKey="hour"
                tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#1E293B' }}
                interval={2}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomHourlyTooltip />} />
              <Bar
                dataKey="total"
                name="Runs per hour"
                fill="#38D9FF"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Peak Usage Analysis Footer Callout */}
      <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#38D9FF] shadow-[0_0_8px_rgba(56,217,255,0.7)] shrink-0" />
          <div className="text-[#9AA7BC]">
            <span className="font-semibold text-[#F4F7FC]">Traffic Analysis: </span>
            Peak workloads concentrate around mid-afternoon (14:00 - 17:00 UTC) with scheduled triage queues.
            Off-peak capacity (01:00 - 06:00 UTC) has <span className="text-[#34D399] font-mono">92% headroom</span>.
          </div>
        </div>

        {onNavigateToActivity && (
          <button
            type="button"
            onClick={() => onNavigateToActivity()}
            className="inline-flex items-center gap-1 text-[#38D9FF] hover:text-[#80E5FF] font-medium shrink-0 transition-colors cursor-pointer"
          >
            <span>Inspect run traces</span>
            <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
