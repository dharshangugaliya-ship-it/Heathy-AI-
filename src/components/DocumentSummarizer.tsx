import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  Pill, 
  Printer, 
  Check, 
  Copy,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, SampleMedicalDocument } from '../data/clinicalCases';
import { DocumentSummary, LabStatus } from '../types/clinical';

interface DocumentSummarizerProps {
  onSelectForCopilot?: (summary: DocumentSummary, text: string) => void;
}

export const DocumentSummarizer: React.FC<DocumentSummarizerProps> = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_DOCUMENTS[0].id);
  const [inputText, setInputText] = useState<string>(SAMPLE_DOCUMENTS[0].content);
  const [documentType, setDocumentType] = useState<string>(SAMPLE_DOCUMENTS[0].category);
  const [patientName, setPatientName] = useState<string>(SAMPLE_DOCUMENTS[0].patientName);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<DocumentSummary>(SAMPLE_DOCUMENTS[0].suggestedSummary);
  const [activeView, setActiveView] = useState<'summary' | 'labs' | 'meds' | 'diagnoses' | 'timeline'>('summary');
  const [labFilter, setLabFilter] = useState<'ALL' | 'ABNORMAL'>('ALL');
  const [attestationChecked, setAttestationChecked] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const handleSelectPreset = (doc: SampleMedicalDocument) => {
    setSelectedPresetId(doc.id);
    setInputText(doc.content);
    setDocumentType(doc.category);
    setPatientName(doc.patientName);
    setSummaryResult(doc.suggestedSummary);
    setAttestationChecked(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      setSelectedPresetId('custom');
      setDocumentType('Uploaded Clinical Report');
      setPatientName(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsText(file);
  };

  const handleProcessDocument = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setProcessingStep('Parsing clinical entities...');

    try {
      setTimeout(() => setProcessingStep('Extracting biomarkers & reference ranges...'), 500);
      setTimeout(() => setProcessingStep('Synthesizing medication safety & clinical timeline...'), 1200);

      const response = await fetch('/api/summarize-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          documentType,
          patientName
        })
      });

      const data = await response.json();
      if (data.status === 'success' && data.data) {
        setSummaryResult(data.data);
      }
    } catch (err) {
      console.error('Failed to summarize document:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const getLabStatusBadge = (status: LabStatus) => {
    switch (status) {
      case 'CRITICAL_HIGH':
      case 'CRITICAL_LOW':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#FDF2F4] dark:bg-rose-950/80 text-[#C43D55] dark:text-rose-300 border border-[#F9CAD2] dark:border-rose-800/80 tracking-wider">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#FDF2F4] dark:bg-rose-950/40 text-[#C43D55] dark:text-rose-400 border border-[#F9CAD2] dark:border-rose-900/40">
            HIGH
          </span>
        );
      case 'LOW':
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40">
            LOW
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0] bg-[#EAF0EF] dark:bg-slate-900 border border-[#D7E1DF] dark:border-slate-800">
            NORM
          </span>
        );
    }
  };

  const diagnoses = summaryResult?.diagnoses || [];
  const criticalLabValues = summaryResult?.criticalLabValues || [];
  const medications = summaryResult?.medications || [];
  const timeline = summaryResult?.timeline || [];
  const actionableRecommendations = summaryResult?.actionableRecommendations || [];

  const copySbarHandover = () => {
    if (!summaryResult) return;
    const sbarText = `SBAR CLINICAL HANDOVER SUMMARY
==============================
SITUATION:
Patient: ${summaryResult.patientName || 'Anonymous'} (MRN: ${summaryResult.mrn || 'N/A'})
Type: ${summaryResult.documentType || 'Clinical Summary'} | Date: ${summaryResult.dateOfService || 'Recent'}
Risk Level: ${summaryResult.riskStratification?.level || 'Moderate'} (Score: ${summaryResult.riskStratification?.score || 'N/A'}/100)

BACKGROUND & EXECUTIVE SUMMARY:
${summaryResult.executiveSummary || 'No executive summary available.'}

PRIMARY DIAGNOSES:
${diagnoses.map(d => `• ${d.condition} [${d.type}] ${d.icd10 ? `(ICD-10: ${d.icd10})` : ''}`).join('\n')}

CRITICAL/ABNORMAL LABS:
${criticalLabValues.map(l => `• ${l.name}: ${l.value} ${l.unit} [Ref: ${l.referenceRange}] (${l.status})`).join('\n')}

MEDICATIONS:
${medications.map(m => `• ${m.drugName} ${m.dosage} ${m.frequency} (${m.status})${m.warnings ? ` - ALERT: ${m.warnings}` : ''}`).join('\n')}

ACTION PLAN:
${actionableRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Clinician Attestation Status: ${attestationChecked ? 'Attested by Reviewing Physician' : 'Pending Formal Review'}
Advisory Decision Support. Licensed physician confirmation required.`;

    navigator.clipboard.writeText(sbarText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const filteredLabs = criticalLabValues.filter(lab => {
    if (labFilter === 'ABNORMAL') {
      return lab.status !== 'NORMAL';
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Workflow Stage Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#087F73] dark:text-[#14B8A6] uppercase tracking-widest font-semibold">
                STAGE 01 · UNDERSTAND
              </span>
              <span className="text-[#D7E1DF] dark:text-slate-700">/</span>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">UNSTRUCTURED RECORD EXTRACTION</span>
            </div>
            <h1 className="text-base font-bold text-[#17211F] dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#087F73] dark:text-[#14B8A6]" />
              Clinical Document Summarizer
            </h1>
          </div>

          {/* Quick Case Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-[#64716E] dark:text-[#94A3A0]">BENCHMARK CASES:</span>
            <div className="flex flex-wrap gap-1">
              {SAMPLE_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleSelectPreset(doc)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors border ${
                    selectedPresetId === doc.id
                      ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] border-[#087F73] dark:border-[#14B8A6] font-semibold'
                      : 'bg-white dark:bg-[#020617]/50 text-[#64716E] dark:text-[#94A3A0] border-[#D7E1DF] dark:border-[#1E293B] hover:text-[#17211F] dark:hover:text-white'
                  }`}
                >
                  {doc.patientName.split(' ')[0]} ({doc.category.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Raw Clinical Source Instrument */}
        <div className="lg:col-span-5 flex flex-col h-[740px] bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#D7E1DF] dark:border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#087F73] dark:bg-[#14B8A6]"></span>
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#17211F] dark:text-[#E7EFED]">
                Source Document Stream
              </span>
            </div>
            <label className="text-[11px] bg-[#EAF0EF] dark:bg-[#020617] hover:bg-[#D7E1DF] dark:hover:bg-[#111827] text-[#17211F] dark:text-slate-300 px-2 py-1 rounded cursor-pointer flex items-center gap-1.5 transition-colors border border-[#D7E1DF] dark:border-[#1E293B] font-mono">
              <Upload className="w-3 h-3 text-[#64716E] dark:text-[#94A3A0]" />
              <span>Import File</span>
              <input
                type="file"
                accept=".txt,.md,.doc,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Metadata Bar */}
          <div className="grid grid-cols-2 gap-2 my-2.5">
            <div>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0] block mb-0.5">PATIENT RECORD</span>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-[#1E293B] rounded px-2 py-1 text-xs text-[#17211F] dark:text-[#E7EFED] focus:outline-none focus:border-[#087F73] dark:focus:border-[#14B8A6] font-mono"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0] block mb-0.5">DOCUMENT CLASSIFICATION</span>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-[#1E293B] rounded px-2 py-1 text-xs text-[#17211F] dark:text-[#E7EFED] focus:outline-none focus:border-[#087F73] dark:focus:border-[#14B8A6] font-mono"
              />
            </div>
          </div>

          {/* Deep Inset Textarea (Level 2 Instrument Surface) */}
          <div className="flex-1 min-h-0 relative">
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedPresetId('custom');
              }}
              className="w-full h-full bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 text-xs font-mono text-[#17211F] dark:text-slate-300 focus:outline-none focus:border-[#087F73] dark:focus:border-[#14B8A6] resize-none leading-relaxed overflow-y-auto"
              placeholder="Paste raw hospital notes, laboratory panel transcriptions, or surgical pathology narrative..."
            />
          </div>

          {/* Operational Bottom Controls */}
          <div className="pt-3 border-t border-[#D7E1DF] dark:border-[#1E293B] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">
              {inputText.length.toLocaleString()} BYTES · {inputText.split(/\s+/).filter(Boolean).length} WORDS
            </span>

            <button
              onClick={handleProcessDocument}
              disabled={isProcessing || !inputText.trim()}
              className="bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white font-mono text-xs px-3.5 py-1.5 rounded flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isProcessing ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white/90" />
                  <span>Run NLP Extraction</span>
                </>
              )}
            </button>
          </div>

          {isProcessing && (
            <div className="mt-2 p-2 rounded bg-[#EAF0EF] dark:bg-[#020617] border border-[#BCE2DC] dark:border-teal-800/40 text-[11px] font-mono text-[#087F73] dark:text-teal-300 flex items-center gap-2 animate-pulse">
              <Activity className="w-3 h-3 text-[#087F73] dark:text-teal-400 animate-spin shrink-0" />
              <span>{processingStep}</span>
            </div>
          )}
        </div>

        {/* Right Column: Structured Clinical Instrumentation */}
        <div className="lg:col-span-7 flex flex-col h-[740px] bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
          {/* Header Strip with Identity and Severity Badge */}
          <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-[#D7E1DF] dark:border-[#1E293B] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#17211F] dark:text-white font-sans">
                  {summaryResult.patientName || patientName}
                </span>
                <span className="text-[11px] font-mono text-[#64716E] dark:text-[#94A3A0]">
                  {summaryResult.mrn ? `MRN: ${summaryResult.mrn}` : 'MRN: VERIFIED'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0] block mt-0.5">
                {summaryResult.documentType} · Service: {summaryResult.dateOfService || 'Recent'}
              </span>
            </div>

            {/* Severity Pill - Rose only for High/Critical */}
            <div className={`px-2.5 py-1 rounded border text-xs font-mono font-semibold flex items-center gap-1.5 ${
              summaryResult.riskStratification?.level === 'CRITICAL'
                ? 'bg-[#FDF2F4] dark:bg-rose-950/80 border-[#F9CAD2] dark:border-rose-800/80 text-[#C43D55] dark:text-rose-300'
                : summaryResult.riskStratification?.level === 'HIGH'
                ? 'bg-[#FDF2F4] dark:bg-rose-950/40 border-[#F9CAD2] dark:border-rose-900/40 text-[#C43D55] dark:text-rose-300'
                : 'bg-[#EAF0EF] dark:bg-[#020617] border-[#D7E1DF] dark:border-[#1E293B] text-[#17211F] dark:text-slate-300'
            }`}>
              <AlertTriangle className={`w-3.5 h-3.5 ${
                summaryResult.riskStratification?.level === 'CRITICAL' || summaryResult.riskStratification?.level === 'HIGH'
                  ? 'text-[#C43D55] dark:text-rose-400'
                  : 'text-[#B86A00] dark:text-[#F59E0B]'
              }`} />
              <span>ACUITY: {summaryResult.riskStratification?.level || 'MODERATE'} ({summaryResult.riskStratification?.score || 70}/100)</span>
            </div>
          </div>

          {/* Section Selector Tabs */}
          <div className="flex items-center gap-1 py-2 border-b border-[#D7E1DF] dark:border-[#1E293B] overflow-x-auto text-xs">
            <button
              onClick={() => setActiveView('summary')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                activeView === 'summary'
                  ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] font-bold border border-[#D7E1DF] dark:border-[#1E293B]'
                  : 'text-[#64716E] dark:text-[#94A3A0] hover:text-[#17211F] dark:hover:text-white'
              }`}
            >
              EXECUTIVE BRIEF
            </button>
            <button
              onClick={() => setActiveView('diagnoses')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'diagnoses'
                  ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] font-bold border border-[#D7E1DF] dark:border-[#1E293B]'
                  : 'text-[#64716E] dark:text-[#94A3A0] hover:text-[#17211F] dark:hover:text-white'
              }`}
            >
              <span>DIAGNOSES</span>
              <span className="px-1 text-[10px] rounded bg-[#D7E1DF] dark:bg-slate-800 text-[#17211F] dark:text-slate-300 font-mono">
                {diagnoses.length}
              </span>
            </button>
            <button
              onClick={() => setActiveView('labs')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'labs'
                  ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] font-bold border border-[#D7E1DF] dark:border-[#1E293B]'
                  : 'text-[#64716E] dark:text-[#94A3A0] hover:text-[#17211F] dark:hover:text-white'
              }`}
            >
              <span>BIOMARKERS</span>
              <span className="px-1 text-[10px] rounded bg-[#D7E1DF] dark:bg-slate-800 text-[#17211F] dark:text-slate-300 font-mono">
                {criticalLabValues.length}
              </span>
            </button>
            <button
              onClick={() => setActiveView('meds')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'meds'
                  ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] font-bold border border-[#D7E1DF] dark:border-[#1E293B]'
                  : 'text-[#64716E] dark:text-[#94A3A0] hover:text-[#17211F] dark:hover:text-white'
              }`}
            >
              <span>MEDICATIONS</span>
              <span className="px-1 text-[10px] rounded bg-[#D7E1DF] dark:bg-slate-800 text-[#17211F] dark:text-slate-300 font-mono">
                {medications.length}
              </span>
            </button>
            <button
              onClick={() => setActiveView('timeline')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'timeline'
                  ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] font-bold border border-[#D7E1DF] dark:border-[#1E293B]'
                  : 'text-[#64716E] dark:text-[#94A3A0] hover:text-[#17211F] dark:hover:text-white'
              }`}
            >
              <span>TIMELINE</span>
              <span className="px-1 text-[10px] rounded bg-[#D7E1DF] dark:bg-slate-800 text-[#17211F] dark:text-slate-300 font-mono">
                {timeline.length}
              </span>
            </button>
          </div>

          {/* Structured Panel Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3 text-xs">
            {/* VIEW 1: EXECUTIVE BRIEF */}
            {activeView === 'summary' && (
              <div className="space-y-3">
                {/* Level 2 Inset: Executive Narrative */}
                <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3.5 space-y-1.5 transition-colors">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#087F73] dark:text-teal-400 font-semibold flex items-center gap-1.5">
                    <span>EXECUTIVE CLINICAL SYNTHESIS</span>
                  </div>
                  <p className="text-[#17211F] dark:text-slate-200 leading-relaxed font-sans text-sm">
                    {summaryResult?.executiveSummary || 'No executive summary available.'}
                  </p>
                </div>

                {/* Level 2 Inset: Actionable Clinical Workup */}
                <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3.5 space-y-2 transition-colors">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
                    RECOMMENDED CLINICAL WORKUP &amp; NEXT STEPS
                  </span>
                  <div className="space-y-1.5">
                    {actionableRecommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white dark:bg-slate-900/80 p-2 rounded border border-[#D7E1DF] dark:border-slate-800/80">
                        <span className="text-[10px] font-mono font-bold text-[#087F73] dark:text-teal-400 w-4 shrink-0">
                          {i + 1}.
                        </span>
                        <span className="text-[#17211F] dark:text-slate-200 leading-normal">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level 2 Inset: Primary Risk Drivers */}
                {summaryResult.riskStratification?.primaryDrivers && (
                  <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3.5 space-y-2 transition-colors">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C43D55] dark:text-rose-400/90 font-semibold block">
                      KEY CLINICAL RISK VULNERABILITIES
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {summaryResult.riskStratification.primaryDrivers.map((driver, i) => (
                        <div key={i} className="flex items-start gap-2 bg-white dark:bg-slate-900/60 p-2 rounded border border-[#D7E1DF] dark:border-slate-800 text-[#17211F] dark:text-slate-300 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C43D55] dark:bg-rose-400 mt-1.5 shrink-0"></span>
                          <span>{driver}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: DIAGNOSES */}
            {activeView === 'diagnoses' && (
              <div className="space-y-2">
                {diagnoses.map((diag, i) => (
                  <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 hover:border-[#087F73] dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#17211F] dark:text-white font-sans">{diag.condition}</span>
                          <span className={`px-1.5 py-0.2 text-[9px] font-mono uppercase font-semibold rounded ${
                            diag.type === 'PRIMARY'
                              ? 'bg-[#FDF2F4] dark:bg-rose-950/60 text-[#C43D55] dark:text-rose-300 border border-[#F9CAD2] dark:border-rose-900/50'
                              : 'bg-white dark:bg-slate-900 text-[#64716E] dark:text-slate-400 border border-[#D7E1DF] dark:border-slate-800'
                          }`}>
                            {diag.type}
                          </span>
                        </div>
                        {diag.confidenceOrEvidence && (
                          <p className="text-[11px] text-[#64716E] dark:text-slate-400 mt-1 font-mono">
                            Evidence: "{diag.confidenceOrEvidence}"
                          </p>
                        )}
                      </div>
                      {diag.icd10 && (
                        <span className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded font-mono text-xs text-[#087F73] dark:text-teal-400 font-semibold border border-[#D7E1DF] dark:border-slate-800 shrink-0">
                          {diag.icd10}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 3: LABS (INSTRUMENT GRID) */}
            {activeView === 'labs' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">LABORATORY MEASUREMENTS</span>
                  <div className="flex items-center gap-1 bg-[#EAF0EF] dark:bg-[#020617] p-0.5 rounded border border-[#D7E1DF] dark:border-slate-800">
                    <button
                      onClick={() => setLabFilter('ALL')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        labFilter === 'ALL'
                          ? 'bg-white dark:bg-slate-800 text-[#17211F] dark:text-white font-bold shadow-xs'
                          : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
                      }`}
                    >
                      ALL ({criticalLabValues.length})
                    </button>
                    <button
                      onClick={() => setLabFilter('ABNORMAL')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        labFilter === 'ABNORMAL'
                          ? 'bg-[#FDF2F4] dark:bg-rose-950/80 text-[#C43D55] dark:text-rose-300 font-bold border border-[#F9CAD2]'
                          : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
                      }`}
                    >
                      ABNORMAL ONLY ({criticalLabValues.filter(l => l.status !== 'NORMAL').length})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredLabs.map((lab, i) => (
                    <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2.5 flex flex-col justify-between transition-colors">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-xs font-semibold text-[#17211F] dark:text-slate-200">{lab.name}</span>
                          {getLabStatusBadge(lab.status)}
                        </div>
                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-base font-bold text-[#17211F] dark:text-white font-mono">{lab.value}</span>
                          <span className="text-[11px] text-[#64716E] dark:text-slate-400 font-mono">{lab.unit}</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#64716E] dark:text-slate-400">
                          Ref: {lab.referenceRange}
                        </div>
                      </div>
                      {lab.interpretation && (
                        <div className="mt-1.5 pt-1.5 border-t border-[#D7E1DF] dark:border-slate-900 text-[10px] text-[#64716E] dark:text-slate-400 italic">
                          {lab.interpretation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 4: MEDICATIONS */}
            {activeView === 'meds' && (
              <div className="space-y-2">
                {medications.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-[#64716E] dark:text-slate-400 bg-[#EAF0EF] dark:bg-[#020617] rounded border border-[#D7E1DF] dark:border-slate-800">
                    No active medications documented in this specific extract.
                  </div>
                ) : (
                  medications.map((med, i) => (
                    <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2.5 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-[#087F73] dark:text-teal-400" />
                          <span className="text-xs font-bold text-[#17211F] dark:text-white">{med.drugName}</span>
                          <span className="text-[11px] text-[#17211F] dark:text-slate-300 font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-[#D7E1DF] dark:border-slate-800">
                            {med.dosage}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#64716E] dark:text-slate-400">
                          {med.route} · {med.frequency}
                        </span>
                      </div>
                      {med.warnings && (
                        <div className="mt-1.5 p-1.5 rounded bg-[#FFF8EB] dark:bg-amber-950/30 border border-[#FDE7BA] dark:border-amber-800/40 text-[11px] text-[#B86A00] dark:text-amber-300 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-[#B86A00] dark:text-amber-400 mt-0.5 shrink-0" />
                          <span>{med.warnings}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* VIEW 5: TIMELINE */}
            {activeView === 'timeline' && (
              <div className="relative pl-5 space-y-3 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-[#D7E1DF] dark:before:bg-slate-800">
                {timeline.map((evt, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                      evt.significance === 'CRITICAL' ? 'bg-[#C43D55] dark:bg-rose-500' : 'bg-[#087F73] dark:bg-teal-400'
                    }`}></div>
                    <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2.5 transition-colors">
                      <span className="text-[10px] font-mono text-[#087F73] dark:text-teal-400 block">{evt.date}</span>
                      <p className="text-xs text-[#17211F] dark:text-slate-200 mt-0.5">{evt.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attestation & Export Footer */}
          <div className="pt-3 border-t border-[#D7E1DF] dark:border-[#1E293B] space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#64716E] dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={attestationChecked}
                onChange={(e) => setAttestationChecked(e.target.checked)}
                className="rounded border-[#D7E1DF] text-[#087F73] focus:ring-[#087F73] h-3.5 w-3.5 bg-white dark:bg-slate-950"
              />
              <span className="text-[11px] text-[#17211F] dark:text-slate-300">
                I attest that I have reviewed the primary clinical record and verified this decision-support extraction.
              </span>
            </label>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={copySbarHandover}
                  className="px-3 py-1.5 rounded bg-[#EAF0EF] hover:bg-[#D7E1DF] dark:bg-[#020617] dark:hover:bg-slate-800 text-[#17211F] dark:text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer border border-[#D7E1DF] dark:border-slate-800 transition-colors"
                >
                  <Copy className="w-3 h-3 text-[#087F73] dark:text-teal-400" />
                  <span>Copy SBAR Handover</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-[#EAF0EF] hover:bg-[#D7E1DF] dark:bg-[#020617] dark:hover:bg-slate-800 text-[#17211F] dark:text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer border border-[#D7E1DF] dark:border-slate-800 transition-colors"
                >
                  <Printer className="w-3 h-3 text-[#64716E] dark:text-slate-400" />
                  <span>Print Note</span>
                </button>
              </div>

              {copiedNotice && (
                <span className="text-[11px] text-[#087F5B] dark:text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  SBAR copied to clipboard
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
