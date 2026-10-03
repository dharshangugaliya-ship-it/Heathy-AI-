import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header, ActiveTab } from './components/Header';
import { DocumentSummarizer } from './components/DocumentSummarizer';
import { AppointmentTriage } from './components/AppointmentTriage';
import { LongitudinalTrends } from './components/LongitudinalTrends';
import { MedicalImageResearch } from './components/MedicalImageResearch';
import { ClinicalCopilot } from './components/ClinicalCopilot';
import { ClinicalDisclaimerModal } from './components/ClinicalDisclaimerModal';
import { ShieldCheck, HeartPulse, AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ClinicalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Clinical Workstation Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#0F172A] border border-[#F9CAD2] dark:border-rose-900/50 rounded-lg p-6 max-w-lg w-full shadow-lg space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F4] dark:bg-rose-950/80 text-[#C43D55] dark:text-rose-400 flex items-center justify-center mx-auto border border-[#F9CAD2] dark:border-rose-800">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17211F] dark:text-white">Workspace Session Recovered</h2>
              <p className="text-xs text-[#64716E] dark:text-[#94A3A0] mt-1">
                A rendering anomaly was isolated by the clinical integrity layer. Your clinical data remains protected.
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white font-mono text-xs cursor-pointer shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summarizer');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F4F7F6] dark:bg-[#020617] text-[#17211F] dark:text-[#E7EFED] flex flex-col font-sans transition-colors duration-150 selection:bg-[#087F73] dark:selection:bg-[#14B8A6] selection:text-white">
      {/* Top Clinical Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <ClinicalErrorBoundary>
          {activeTab === 'summarizer' && <DocumentSummarizer />}
          {activeTab === 'triage' && <AppointmentTriage />}
          {activeTab === 'longitudinal' && <LongitudinalTrends />}
          {activeTab === 'imaging' && <MedicalImageResearch />}
          {activeTab === 'copilot' && <ClinicalCopilot />}
        </ClinicalErrorBoundary>
      </main>

      {/* Persistent Clinical System Footer */}
      <footer className="bg-white dark:bg-[#0F172A] border-t border-[#D7E1DF] dark:border-[#1E293B] py-3.5 px-6 text-xs text-[#64716E] dark:text-[#94A3A0] mt-auto transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#087F73] dark:text-[#14B8A6] shrink-0" />
            <span>
              <strong className="text-[#17211F] dark:text-white font-semibold">AegisHealth AI</strong> — Dual-Environment Clinical Intelligence Workstation.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-[#087F5B] dark:text-[#10B981]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>HIPAA Safe Harbor De-Identified Data</span>
            </span>
            <span className="text-[#D7E1DF] dark:text-slate-700">|</span>
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="hover:text-[#087F73] dark:hover:text-[#14B8A6] underline cursor-pointer"
            >
              SaMD Guidelines &amp; Human Autonomy
            </button>
          </div>
        </div>
      </footer>

      {/* Clinical Disclaimer & Ethics Modal */}
      <ClinicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
