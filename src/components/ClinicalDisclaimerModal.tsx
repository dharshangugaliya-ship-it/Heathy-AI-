import React from 'react';
import { ShieldAlert, CheckCircle2, Lock, FileText, AlertTriangle, X } from 'lucide-react';

interface ClinicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalDisclaimerModal: React.FC<ClinicalDisclaimerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg max-w-2xl w-full p-6 shadow-xl space-y-4 text-[#17211F] dark:text-slate-200 text-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#D7E1DF] dark:border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#FFF8EB] dark:bg-amber-500/20 text-[#B86A00] dark:text-amber-400 flex items-center justify-center border border-[#FDE7BA] dark:border-amber-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17211F] dark:text-white font-sans">Clinical Decision Support Architecture</h3>
              <p className="text-[11px] font-mono text-[#64716E] dark:text-[#94A3A0]">Software as a Medical Device (SaMD) &amp; Physician Autonomy Guardrails</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64716E] dark:text-slate-400 hover:text-[#17211F] dark:hover:text-white p-1 rounded cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
          <div className="p-3.5 rounded bg-[#FFF8EB] dark:bg-amber-950/40 border border-[#FDE7BA] dark:border-amber-800/40 text-[#B86A00] dark:text-amber-200">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5 font-sans">
              <AlertTriangle className="w-4 h-4 text-[#B86A00] dark:text-amber-400" />
              Core Clinical Objective &amp; Scope of Use
            </h4>
            <p className="text-xs leading-relaxed opacity-95">
              <strong>AegisHealth AI</strong> is engineered solely as an assistive clinical intelligence system. It organizes, extracts, and summarizes complex healthcare data to reduce cognitive search fatigue for qualified physicians, nurses, and hospital staff. <strong>It does not diagnose, treat, cure, or prevent any illness or replace human medical judgment.</strong>
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 bg-[#EAF0EF] dark:bg-[#020617] p-3 rounded border border-[#D7E1DF] dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#087F73] dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#17211F] dark:text-white block mb-0.5 font-sans">1. Physician Decision Ownership</strong>
                <span className="text-[#64716E] dark:text-slate-300">All diagnostic assessments, therapeutic interventions, prescription alterations, and triage slot assignments remain under the sole clinical authority and responsibility of the licensed attending practitioner.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#EAF0EF] dark:bg-[#020617] p-3 rounded border border-[#D7E1DF] dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#087F73] dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#17211F] dark:text-white block mb-0.5 font-sans">2. Radiological Pattern Identification Disclaimer</strong>
                <span className="text-[#64716E] dark:text-slate-300">The Medical Image Research module provides preliminary computer vision pattern localization. Findings such as consolidations, cardiomegaly, or dermatological irregularities are hypothesis-generating decision supports and require mandatory overread by a board-certified radiologist or pathologist.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#EAF0EF] dark:bg-[#020617] p-3 rounded border border-[#D7E1DF] dark:border-slate-800">
              <Lock className="w-4 h-4 text-[#087F73] dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#17211F] dark:text-white block mb-0.5 font-sans">3. HIPAA &amp; Anonymization Safeguards</strong>
                <span className="text-[#64716E] dark:text-slate-300">The demonstration environment uses synthetic and fully de-identified clinical records adhering to Safe Harbor de-identification standards (18 HIPAA identifiers stripped). In clinical production, end-to-end encryption and BAA data protection are enforced.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#EAF0EF] dark:bg-[#020617] p-3 rounded border border-[#D7E1DF] dark:border-slate-800">
              <FileText className="w-4 h-4 text-[#087F73] dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#17211F] dark:text-white block mb-0.5 font-sans">4. Evidence-Grounded Guidelines</strong>
                <span className="text-[#64716E] dark:text-slate-300">Clinical metrics and alerts (such as ESI triage thresholds, ADA glycemic targets, and KDIGO renal dose recommendations) cite standard evidence-based medical literature.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#D7E1DF] dark:border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white font-mono text-xs cursor-pointer transition-colors shadow-xs"
          >
            I Acknowledge &amp; Understand
          </button>
        </div>
      </div>
    </div>
  );
};
