import React from 'react';
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  Scan, 
  MessageSquare, 
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type ActiveTab = 'summarizer' | 'triage' | 'longitudinal' | 'imaging' | 'copilot';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDisclaimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDisclaimer
}) => {
  const { theme, setTheme } = useTheme();

  const workflowSteps = [
    {
      id: 'summarizer' as ActiveTab,
      stage: '01 · UNDERSTAND',
      label: 'Document Summarizer',
      icon: FileText
    },
    {
      id: 'triage' as ActiveTab,
      stage: '02 · PRIORITIZE',
      label: 'Appointment Triage',
      icon: Clock,
      hasAlert: true
    },
    {
      id: 'longitudinal' as ActiveTab,
      stage: '03 · MONITOR',
      label: 'Health Record Trends',
      icon: TrendingUp
    },
    {
      id: 'imaging' as ActiveTab,
      stage: '04 · INVESTIGATE',
      label: 'Image Research',
      icon: Scan
    },
    {
      id: 'copilot' as ActiveTab,
      stage: '05 · INQUIRE',
      label: 'Clinical Copilot',
      icon: MessageSquare
    }
  ];

  return (
    <header className="bg-white dark:bg-[#0F172A] border-b border-[#D7E1DF] dark:border-[#1E293B] sticky top-0 z-40 transition-colors">
      {/* Top Clinical Safety Bar (Restrained & Quiet) */}
      <div className="bg-[#EAF0EF] dark:bg-[#020617] border-b border-[#D7E1DF] dark:border-[#1E293B] px-4 sm:px-6 py-1 text-[11px] text-[#64716E] dark:text-[#94A3A0] flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B86A00] dark:bg-[#F59E0B] inline-block shrink-0"></span>
          <span className="font-mono uppercase tracking-wider text-[10px] text-[#B86A00] dark:text-[#F59E0B] font-semibold">
            CLINICAL DECISION SUPPORT
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden md:inline">|</span>
          <span className="hidden md:inline text-[11px]">
            Advisory software for qualified clinicians. Diagnostic authority rests with licensed medical professionals.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#087F5B] dark:bg-[#10B981] animate-pulse"></span>
            <span>SYSTEM ACTIVE</span>
          </div>
          <span className="text-[#D7E1DF] dark:text-slate-700">|</span>
          <button 
            onClick={onOpenDisclaimer}
            className="hover:text-[#17211F] dark:hover:text-white flex items-center gap-1 cursor-pointer font-medium transition-colors text-[10px]"
          >
            <HelpCircle className="w-3 h-3 text-[#64716E] dark:text-[#94A3A0]" />
            <span>SaMD Protocol</span>
          </button>
        </div>
      </div>

      {/* Main Command Center Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          {/* Brand Mark & Clinical System Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#EAF0EF] dark:bg-[#020617] border border-[#BCE2DC] dark:border-teal-500/30 flex items-center justify-center shadow-xs relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#087F73] dark:text-[#14B8A6]">
                <rect x="10.5" y="3" width="3" height="18" rx="1.5" fill="currentColor" opacity="0.35" />
                <rect x="3" y="10.5" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
                <path d="M4 12H7L9.5 7L13 17L15.5 12H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#087F73] dark:bg-[#14B8A6] ring-2 ring-white dark:ring-[#0F172A]"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[#17211F] dark:text-white font-sans">
                  AegisHealth
                </span>
                <span className="text-[10px] font-mono text-[#087F73] dark:text-teal-400 uppercase tracking-widest bg-[#E8F5F3] dark:bg-teal-950/60 border border-[#BCE2DC] dark:border-teal-800/40 px-1.5 py-0.2 rounded font-semibold">
                  CDSS
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0] tracking-tight hidden lg:block">
                Clinical Intelligence Workstation
              </p>
            </div>
          </div>

          {/* Workflow Reasoning Tabs */}
          <nav className="flex space-x-1 overflow-x-auto py-1.5">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex flex-col items-start px-2.5 sm:px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap text-left border ${
                    isActive
                      ? 'bg-[#EAF0EF] dark:bg-[#020617] border-[#087F73] dark:border-[#14B8A6] text-[#17211F] dark:text-white shadow-xs'
                      : 'border-transparent text-[#64716E] dark:text-[#94A3A0] hover:text-[#17211F] dark:hover:text-white hover:bg-[#EAF0EF]/70 dark:hover:bg-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${
                      isActive ? 'text-[#087F73] dark:text-[#14B8A6]' : 'text-[#64716E] dark:text-slate-400'
                    }`}>
                      {step.stage}
                    </span>
                    {step.hasAlert && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C43D55] dark:bg-[#F43F5E] shrink-0"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#087F73] dark:text-[#14B8A6]' : 'text-[#64716E] dark:text-slate-400'}`} />
                    <span className={`text-xs font-medium ${isActive ? 'text-[#17211F] dark:text-white font-semibold' : 'text-[#17211F] dark:text-slate-300'}`}>
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Theme Switch Control [ ☼ Light | ◐ Dark ] */}
          <div className="flex items-center bg-[#EAF0EF] dark:bg-[#020617] p-0.5 rounded border border-[#D7E1DF] dark:border-[#1E293B] shrink-0">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-[#087F73] font-bold shadow-xs border border-[#BCE2DC]'
                  : 'text-[#64716E] hover:text-[#17211F]'
              }`}
              title="Clinical Daylight (Light Mode)"
            >
              <Sun className="w-3 h-3 text-[#087F73]" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#0F172A] text-[#14B8A6] font-bold shadow-xs border border-teal-500/40'
                  : 'text-[#94A3A0] hover:text-white'
              }`}
              title="Clinical Night (Dark Mode)"
            >
              <Moon className="w-3 h-3 text-[#14B8A6]" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
