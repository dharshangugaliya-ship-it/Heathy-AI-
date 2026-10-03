import React, { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Pill, 
  CheckCircle2, 
  Sparkles,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { SAMPLE_LONGITUDINAL_PATIENTS } from '../data/clinicalCases';
import { LongitudinalPatient } from '../types/clinical';
import { useTheme } from '../context/ThemeContext';

export const LongitudinalTrends: React.FC = () => {
  const { theme } = useTheme();
  const [patient, setPatient] = useState<LongitudinalPatient>(SAMPLE_LONGITUDINAL_PATIENTS[0]);
  const [activeMetricIndex, setActiveMetricIndex] = useState<number>(1); // eGFR by default
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisSummary, setAnalysisSummary] = useState<string>(patient.aiTrajectorySummary);
  const [polypharmacyAlerts, setPolypharmacyAlerts] = useState(patient.polypharmacyAlerts);
  const [careGaps, setCareGaps] = useState(patient.careGaps);

  const selectedMetric = patient.labTrends[activeMetricIndex];
  const dataPoints = selectedMetric.dataPoints;
  const latestPoint = dataPoints[dataPoints.length - 1];
  const initialPoint = dataPoints[0];
  const delta = Number((latestPoint.value - initialPoint.value).toFixed(2));
  const percentDelta = Number(((delta / initialPoint.value) * 100).toFixed(1));
  const isDeclining = selectedMetric.testName.includes('eGFR') ? delta < 0 : delta > 0;

  const isLight = theme === 'light';

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-patient-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: patient })
      });

      const data = await response.json();
      if (data.status === 'success' && data.data) {
        setAnalysisSummary(data.data.aiTrajectorySummary || patient.aiTrajectorySummary);
        if (data.data.polypharmacyAlerts?.length > 0) {
          setPolypharmacyAlerts(data.data.polypharmacyAlerts);
        }
        if (data.data.careGaps?.length > 0) {
          setCareGaps(data.data.careGaps);
        }
      }
    } catch (err) {
      console.error('Error analyzing patient records:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderTrendSvg = () => {
    if (!selectedMetric || dataPoints.length === 0) return null;

    const values = dataPoints.map(p => p.value);
    const minVal = Math.min(...values, selectedMetric.normalMin) * 0.85;
    const maxVal = Math.max(...values, selectedMetric.normalMax) * 1.15;

    const width = 720;
    const height = 260;
    const paddingX = 65;
    const paddingY = 35;

    const plotW = width - paddingX * 2;
    const plotH = height - paddingY * 2;

    const getX = (index: number) => paddingX + (index / (dataPoints.length - 1)) * plotW;
    const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * plotH;

    const pathD = dataPoints.reduce((acc, p, i) => {
      const x = getX(i);
      const y = getY(p.value);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

    const normalYTop = getY(selectedMetric.normalMax);
    const normalYBottom = getY(selectedMetric.normalMin);
    const normalZoneH = Math.abs(normalYBottom - normalYTop);

    // Dynamic colors based on active theme
    const gridColor = isLight ? '#D7E1DF' : '#1e293b';
    const axisColor = isLight ? '#64716E' : '#334155';
    const targetFill = isLight ? '#087F5B' : '#10b981';
    const lineColor = isDeclining 
      ? (isLight ? '#C43D55' : '#f43f5e') 
      : (isLight ? '#087F73' : '#14b8a6');
    const pointBorder = isDeclining 
      ? (isLight ? '#C43D55' : '#f43f5e') 
      : (isLight ? '#087F5B' : '#10b981');
    const pointFill = isLight ? '#FFFFFF' : '#020617';
    const labelColor = isDeclining 
      ? (isLight ? '#C43D55' : '#fca5a5') 
      : (isLight ? '#087F5B' : '#6ee7b7');
    const dateColor = isLight ? '#64716E' : '#94a3b8';

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 font-mono transition-colors">
        {/* Subtle Horizontal Reference Grid */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke={gridColor} strokeDasharray="3,3" />
        <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke={gridColor} strokeDasharray="3,3" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke={axisColor} />

        {/* Muted Target Reference Band (Rothko block) */}
        <rect
          x={paddingX}
          y={Math.min(normalYTop, normalYBottom)}
          width={plotW}
          height={normalZoneH}
          fill={targetFill}
          opacity={isLight ? 0.08 : 0.06}
        />
        <text
          x={width - paddingX - 10}
          y={Math.min(normalYTop, normalYBottom) + 14}
          fill={targetFill}
          fontSize="10"
          fontWeight="bold"
          textAnchor="end"
          opacity="0.9"
        >
          TARGET RANGE: {selectedMetric.normalMin}–{selectedMetric.normalMax} {selectedMetric.unit}
        </text>

        {/* Analytical Trend Line */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Observation Data Points */}
        {dataPoints.map((p, i) => {
          const cx = getX(i);
          const cy = getY(p.value);

          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r="6"
                fill={pointFill}
                stroke={pointBorder}
                strokeWidth="2.5"
              />
              <circle
                cx={cx}
                cy={cy}
                r="2.5"
                fill={pointBorder}
              />

              {/* Exact Value Reading */}
              <text
                x={cx}
                y={cy - 12}
                fill={labelColor}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {p.value}
              </text>

              {/* Date on X Axis */}
              <text
                x={cx}
                y={height - paddingY + 16}
                fill={dateColor}
                fontSize="10"
                textAnchor="middle"
              >
                {p.date}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Workflow Stage Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 flex items-center justify-center font-mono font-bold text-[#087F73] dark:text-[#14B8A6]">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#087F73] dark:text-[#14B8A6] uppercase tracking-widest font-semibold">
                  STAGE 03 · MONITOR
                </span>
                <span className="text-[#D7E1DF] dark:text-slate-700">/</span>
                <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">CHRONIC BIOMARKER TRAJECTORY</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-base font-bold text-[#17211F] dark:text-white font-sans">{patient.name}</h1>
                <span className="text-[11px] font-mono text-[#64716E] dark:text-[#94A3A0]">
                  {patient.age}Y · {patient.gender} · MRN: {patient.mrn}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="bg-[#EAF0EF] hover:bg-[#D7E1DF] dark:bg-[#020617] dark:hover:bg-slate-800 border border-[#D7E1DF] dark:border-slate-800 text-[#087F73] dark:text-teal-300 font-mono text-xs px-3 py-1.5 rounded flex items-center gap-2 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Re-computing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#087F73] dark:text-teal-400" />
                <span>Re-Synthesize Trajectory</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Data-First Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Visual Anchor Chart + Encounter Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 space-y-3 transition-colors">
            {/* Metric Switcher Ribbon */}
            <div className="flex items-center justify-between pb-2 border-b border-[#D7E1DF] dark:border-[#1E293B]">
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0] uppercase tracking-wider">
                LONGITUDINAL BIOMARKER SELECTION
              </span>
              <div className="flex gap-1">
                {patient.labTrends.map((metric, i) => (
                  <button
                    key={metric.testName}
                    onClick={() => setActiveMetricIndex(i)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors border ${
                      activeMetricIndex === i
                        ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] border-[#087F73] dark:border-[#14B8A6] font-semibold'
                        : 'bg-white dark:bg-[#020617]/50 text-[#64716E] dark:text-[#94A3A0] border-[#D7E1DF] dark:border-[#1E293B] hover:text-[#17211F] dark:hover:text-white'
                    }`}
                  >
                    {metric.testName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Level 2 Inset Instrument: Bloomberg/Monitoring Style Reading */}
            <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-4 transition-colors">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-mono uppercase text-[#64716E] dark:text-[#94A3A0] tracking-wider block">
                    {selectedMetric.testName}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-mono font-bold text-[#17211F] dark:text-white tracking-tight">
                      {latestPoint.value}
                    </span>
                    <span className="text-xs font-mono text-[#64716E] dark:text-[#94A3A0]">{selectedMetric.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center justify-end gap-1 font-mono text-xs font-bold ${
                    isDeclining ? 'text-[#C43D55] dark:text-rose-400' : 'text-[#087F5B] dark:text-emerald-400'
                  }`}>
                    {isDeclining ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    <span>{delta > 0 ? `+${delta}` : delta} ({percentDelta > 0 ? `+${percentDelta}` : percentDelta}%)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0] block mt-0.5">
                    OVER 29 MONTH MONITORING WINDOW
                  </span>
                </div>
              </div>

              {/* Chart SVG */}
              {renderTrendSvg()}

              <div className="mt-2 pt-2 border-t border-[#D7E1DF] dark:border-slate-900 flex items-center justify-between text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">
                <span>BASELINE: {initialPoint.date} ({initialPoint.value} {selectedMetric.unit})</span>
                <span>STATUS: {isDeclining ? 'DETERIORATING / PROGRESSIVE LOSS' : 'STABLE / ACCEPTABLE'}</span>
              </div>
            </div>

            {/* Level 2 Inset: Subordinate AI Trajectory Interpretation (Data first, AI second) */}
            <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 text-xs space-y-1 transition-colors">
              <div className="flex items-center gap-1.5 text-[#64716E] dark:text-[#94A3A0] text-[10px] font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#087F73] dark:text-[#14B8A6]" />
                <span>AI TRAJECTORY SYNTHESIS (ADVISORY)</span>
              </div>
              <p className="text-[#17211F] dark:text-slate-300 font-sans leading-relaxed text-xs">
                {analysisSummary}
              </p>
            </div>
          </div>

          {/* Chronological Encounter Notes Table */}
          <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 space-y-2.5 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-[#94A3A0] font-semibold block">
              CHRONOLOGICAL CLINICAL ENCOUNTER LOGS
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {patient.pastVisits.map((v, i) => (
                <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#087F73] dark:text-[#14B8A6] font-bold text-[11px]">{v.visitDate}</span>
                      <span className="text-[#64716E] dark:text-slate-400 text-[11px]">· {v.physician}</span>
                    </div>
                    <p className="text-[#17211F] dark:text-slate-300 text-[11px] italic">"{v.clinicalNotesSummary}"</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#64716E] dark:text-slate-400 shrink-0">
                    <span>BP: <strong className="text-[#17211F] dark:text-slate-200">{v.vitals.bp}</strong></span>
                    <span>WT: <strong className="text-[#17211F] dark:text-slate-200">{v.vitals.weightKg}kg</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Polypharmacy Alerts & Care Gaps */}
        <div className="lg:col-span-4 space-y-4">
          {/* Polypharmacy Caution Panel */}
          <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-[#D7E1DF] dark:border-[#1E293B]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B86A00] dark:text-[#F59E0B] font-semibold flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-[#B86A00] dark:text-[#F59E0B]" />
                <span>POLYPHARMACY ALERTS</span>
              </span>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">{polypharmacyAlerts.length} FLAGGED</span>
            </div>

            <div className="space-y-2">
              {polypharmacyAlerts.map((alert, i) => (
                <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 text-xs space-y-2 transition-colors">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-[#17211F] dark:text-white text-[11px] font-sans">{alert.interaction}</span>
                    <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold uppercase shrink-0 ${
                      alert.severity === 'HIGH'
                        ? 'bg-[#FDF2F4] dark:bg-rose-950/80 text-[#C43D55] dark:text-rose-300 border border-[#F9CAD2] dark:border-rose-800/60'
                        : 'bg-[#FFF8EB] dark:bg-amber-950/80 text-[#B86A00] dark:text-amber-300 border border-[#FDE7BA] dark:border-amber-800/60'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#64716E] dark:text-slate-400">
                    DRUGS: <strong className="text-[#17211F] dark:text-slate-200">{alert.drugsInvolved.join(' + ')}</strong>
                  </div>

                  <div className="p-2 bg-white dark:bg-slate-900 rounded border border-[#D7E1DF] dark:border-slate-800 text-[11px] text-[#17211F] dark:text-slate-300">
                    <strong className="text-[#087F73] dark:text-teal-400 block mb-0.5 text-[10px] font-mono uppercase">CLINICAL ACTION:</strong>
                    {alert.clinicalAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guideline Quality Care Gaps */}
          <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-[#D7E1DF] dark:border-[#1E293B]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-[#94A3A0] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087F73] dark:text-[#14B8A6]" />
                <span>PREVENTIVE CARE GAPS</span>
              </span>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">{careGaps.length} AUDITED</span>
            </div>

            <div className="space-y-2">
              {careGaps.map((gap, i) => (
                <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2.5 text-xs space-y-1 transition-colors">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-medium text-[#17211F] dark:text-slate-200 text-xs">{gap.gap}</span>
                    <span className={`px-1 text-[9px] font-mono rounded shrink-0 ${
                      gap.urgency === 'HIGH'
                        ? 'bg-[#FDF2F4] dark:bg-rose-950/60 text-[#C43D55] dark:text-rose-400 font-bold'
                        : 'bg-white dark:bg-slate-900 text-[#64716E] dark:text-slate-400 border border-[#D7E1DF] dark:border-slate-800'
                    }`}>
                      {gap.urgency}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#C43D55] dark:text-rose-400">
                    STATUS: {gap.dueSince}
                  </div>
                  <div className="text-[10px] font-mono text-[#64716E] dark:text-slate-400 truncate">
                    REF: {gap.guidelineReference}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
