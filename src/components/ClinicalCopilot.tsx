import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Activity, 
  Copy, 
  Check, 
  FileText
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/clinicalCases';

interface StructuredAiResponse {
  synthesis: string;
  evidence: string[];
  decisionSupport: string[];
  guidelineSource?: string;
}

interface Message {
  id: string;
  sender: 'doctor' | 'ai';
  rawText?: string;
  structured?: StructuredAiResponse;
  timestamp: string;
}

export const ClinicalCopilot: React.FC = () => {
  const [selectedCaseDoc, setSelectedCaseDoc] = useState(SAMPLE_DOCUMENTS[0]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      structured: {
        synthesis: `Clinical reasoning copilot initialized and strictly bounded to ${selectedCaseDoc.patientName}'s inpatient health record. Ready to assist with pharmacovigilance, organ clearance titration, and evidence synthesis.`,
        evidence: [
          `Primary: ${selectedCaseDoc.suggestedSummary.diagnoses[0]?.condition || 'Cardiovascular'}`,
          `Nadir eGFR: 32 mL/min/1.73m² · NT-proBNP: 1,840 pg/mL`,
          `Current Active Regimen: ${selectedCaseDoc.suggestedSummary.medications.map(m => m.drugName).slice(0, 3).join(', ')}`
        ],
        decisionSupport: [
          'Formulated as physician decision support under human clinical oversight',
          'Ask specific questions regarding dosage adjustments, guideline pathways, or handover generation'
        ],
        guidelineSource: 'AHA/ACC/HFSA Heart Failure Guidelines & KDIGO Clinical Practice Consensus'
      },
      timestamp: 'ACTIVE'
    }
  ]);

  const quickPrompts = [
    `Analyze drug interactions between Entresto and Spironolactone in this patient's CKD stage.`,
    `Calculate recommended antibiotic or diuretic adjustment given eGFR of 32 mL/min.`,
    `Draft an SBAR overnight handover briefing for the incoming hospitalist.`,
    `Evaluate 30-day readmission risk factors based on discharge labs and EF.`
  ];

  const parseClinicalOutput = (text: string): StructuredAiResponse => {
    const lines = text.split('\n');
    let synthesis = '';
    const evidence: string[] = [];
    const decisionSupport: string[] = [];
    let guidelineSource = 'Clinical Practice Consensus';

    let currentSection: 'synthesis' | 'evidence' | 'decision' | 'guideline' = 'synthesis';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (/evidence|in record|data points|findings/i.test(line) && line.length < 35) {
        currentSection = 'evidence';
        continue;
      } else if (/decision support|recommendation|plan|action/i.test(line) && line.length < 35) {
        currentSection = 'decision';
        continue;
      } else if (/guideline|source|reference|literature/i.test(line) && line.length < 35) {
        currentSection = 'guideline';
        continue;
      }

      if (currentSection === 'evidence') {
        evidence.push(line.replace(/^[•\-\*0-9\.]\s*/, ''));
      } else if (currentSection === 'decision') {
        decisionSupport.push(line.replace(/^[•\-\*0-9\.]\s*/, ''));
      } else if (currentSection === 'guideline') {
        guidelineSource = line.replace(/^[•\-\*0-9\.]\s*/, '');
      } else {
        synthesis += (synthesis ? ' ' : '') + line;
      }
    }

    if (evidence.length === 0) {
      evidence.push('Extracted from patient chart and historical laboratory trajectory');
    }
    if (decisionSupport.length === 0) {
      decisionSupport.push('Attending physician verification required prior to clinical implementation');
    }

    return {
      synthesis: synthesis || text,
      evidence: evidence.slice(0, 4),
      decisionSupport: decisionSupport.slice(0, 4),
      guidelineSource
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'doctor',
      rawText: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/clinical-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context: selectedCaseDoc.content
        })
      });

      const data = await response.json();
      const structured = parseClinicalOutput(data.answer || '');

      const aiReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        structured,
        rawText: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error('Error querying clinical copilot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Workflow Stage Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#087F73] dark:text-[#14B8A6] uppercase tracking-widest font-semibold">
                STAGE 05 · INQUIRE
              </span>
              <span className="text-[#D7E1DF] dark:text-slate-700">/</span>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">CHART-BOUND REASONING INSTRUMENT</span>
            </div>
            <h1 className="text-base font-bold text-[#17211F] dark:text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#087F73] dark:text-[#14B8A6]" />
              Clinical Reasoning Copilot
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">PATIENT FOCUS:</span>
            <select
              value={selectedCaseDoc.id}
              onChange={(e) => {
                const found = SAMPLE_DOCUMENTS.find(d => d.id === e.target.value);
                if (found) setSelectedCaseDoc(found);
              }}
              className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded px-2.5 py-1 text-xs text-[#17211F] dark:text-slate-200 font-mono focus:outline-none focus:border-[#087F73] dark:focus:border-[#14B8A6] cursor-pointer"
            >
              {SAMPLE_DOCUMENTS.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.patientName} — {doc.category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Split: Active Anchor Context (Left) + Reasoning Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Prominent Chart Anchor Instrument */}
        <div className="lg:col-span-4 flex flex-col h-[740px] bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[#D7E1DF] dark:border-[#1E293B]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#087F73] dark:text-teal-400 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#087F73] dark:text-teal-400" />
              <span>ACTIVE ANCHOR CHART</span>
            </span>
            <span className="text-[9px] font-mono text-[#087F5B] dark:text-emerald-400 bg-[#E8F7F1] dark:bg-emerald-950/60 border border-[#B6E8D4] dark:border-emerald-800/60 px-1.5 py-0.2 rounded font-bold">
              BOUND
            </span>
          </div>

          {/* Level 2 Inset Patient Identity Card */}
          <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800/90 rounded p-3 space-y-2 transition-colors">
            <div>
              <span className="text-sm font-bold text-[#17211F] dark:text-white block">{selectedCaseDoc.patientName}</span>
              <span className="text-[11px] font-mono text-[#64716E] dark:text-[#94A3A0]">
                DOB: 1958-03-12 ({selectedCaseDoc.age}Y) · {selectedCaseDoc.gender}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#087F73] dark:text-teal-400">
              MRN: 849-21-994
            </div>
            <div className="text-[11px] text-[#17211F] dark:text-slate-300 font-medium pt-1 border-t border-[#D7E1DF] dark:border-slate-900">
              {selectedCaseDoc.category}
            </div>
          </div>

          {/* Chart Evidence Scope */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
              CHART EVIDENCE SCOPE
            </span>
            <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800/90 rounded p-3 space-y-2 text-[11px] transition-colors">
              <div>
                <span className="text-[10px] font-mono text-[#64716E] dark:text-slate-500 uppercase block">PRIMARY DIAGNOSES</span>
                <span className="text-[#17211F] dark:text-slate-300 font-medium">
                  {selectedCaseDoc.suggestedSummary.diagnoses[0]?.condition || 'Document diagnosis'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64716E] dark:text-slate-500 uppercase block">KEY BIOMARKERS IN MEMORY</span>
                <span className="text-[#17211F] dark:text-slate-300 font-mono">
                  {selectedCaseDoc.suggestedSummary.criticalLabValues.slice(0, 3).map(l => `${l.name}: ${l.value}`).join(' · ')}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64716E] dark:text-slate-500 uppercase block">ACTIVE PHARMACOTHERAPY</span>
                <span className="text-[#17211F] dark:text-slate-300 font-mono">
                  {selectedCaseDoc.suggestedSummary.medications.slice(0, 3).map(m => m.drugName).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Prompts Instrument */}
          <div className="space-y-2 text-xs flex-1 flex flex-col justify-end">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
              CLINICAL INQUIRY TEMPLATES
            </span>
            <div className="space-y-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left text-[11px] bg-[#EAF0EF] hover:bg-[#D7E1DF] dark:bg-[#020617] dark:hover:bg-slate-800/80 text-[#17211F] dark:text-slate-300 border border-[#D7E1DF] dark:border-slate-800 rounded p-2 transition-colors cursor-pointer leading-snug font-sans"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reasoning Stream (Separates Evidence from Inference) */}
        <div className="lg:col-span-8 flex flex-col h-[740px] bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[#D7E1DF] dark:border-[#1E293B] text-xs font-mono">
            <span className="text-[#64716E] dark:text-slate-400 text-[10px] uppercase">
              REASONING STREAM · EVIDENCE-GROUNDED OUTPUT
            </span>
            <span className="text-[10px] text-[#087F73] dark:text-teal-400 font-bold">
              DECISION-SUPPORT ACTIVE
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 text-xs">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                {msg.sender === 'doctor' ? (
                  /* Doctor Query Box */
                  <div className="flex items-start justify-end gap-2">
                    <div className="bg-[#EAF0EF] dark:bg-slate-950 border border-[#D7E1DF] dark:border-slate-800 rounded p-3 max-w-xl text-xs text-[#17211F] dark:text-white transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-mono text-[#087F73] dark:text-teal-400">
                        <span className="font-semibold uppercase">PHYSICIAN INQUIRY</span>
                        <span className="text-[#64716E] dark:text-slate-500">{msg.timestamp}</span>
                      </div>
                      <p className="font-sans leading-relaxed">{msg.rawText}</p>
                    </div>
                    <div className="w-7 h-7 rounded bg-[#D7E1DF] dark:bg-slate-800 border border-[#BCE2DC] dark:border-slate-700 flex items-center justify-center text-[#17211F] dark:text-slate-300 shrink-0 text-xs font-mono font-bold">
                      MD
                    </div>
                  </div>
                ) : (
                  /* AI Reasoning Compartment: Separates Synthesis, Evidence, Decision Support, Source */
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#EAF0EF] dark:bg-[#020617] border border-[#BCE2DC] dark:border-teal-500/40 flex items-center justify-center text-[#087F73] dark:text-teal-400 shrink-0 text-xs font-mono font-bold">
                      AI
                    </div>
                    <div className="flex-1 bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800/90 rounded p-3.5 space-y-3 max-w-2xl transition-colors">
                      {/* Section 1: Clinical Synthesis */}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#087F73] dark:text-teal-400 font-semibold block mb-1">
                          CLINICAL SYNTHESIS
                        </span>
                        <p className="text-[#17211F] dark:text-slate-200 font-sans text-sm leading-relaxed">
                          {msg.structured?.synthesis || msg.rawText}
                        </p>
                      </div>

                      {/* Section 2: Evidence in Chart */}
                      {msg.structured?.evidence && msg.structured.evidence.length > 0 && (
                        <div className="pt-2 border-t border-[#D7E1DF] dark:border-slate-900">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block mb-1">
                            EVIDENCE IN RECORD
                          </span>
                          <ul className="space-y-1 text-[11px] text-[#17211F] dark:text-slate-300 font-mono">
                            {msg.structured.evidence.map((ev, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#087F73] dark:text-teal-400 font-bold shrink-0">•</span>
                                <span>{ev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Section 3: Decision Support / Implication */}
                      {msg.structured?.decisionSupport && msg.structured.decisionSupport.length > 0 && (
                        <div className="pt-2 border-t border-[#D7E1DF] dark:border-slate-900">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#B86A00] dark:text-amber-300 font-semibold block mb-1">
                            DECISION SUPPORT CONSIDERATIONS
                          </span>
                          <div className="space-y-1 text-xs text-[#17211F] dark:text-slate-300 font-sans">
                            {msg.structured.decisionSupport.map((ds, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#B86A00] dark:text-amber-400 font-mono text-[10px] shrink-0 mt-0.5">›</span>
                                <span>{ds}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section 4: Source / Guideline Footnote */}
                      <div className="pt-2 border-t border-[#D7E1DF] dark:border-slate-900 flex items-center justify-between text-[10px] font-mono text-[#64716E] dark:text-slate-500">
                        <span>REF: {msg.structured?.guidelineSource || 'Standard Clinical Practice'}</span>
                        <button
                          onClick={() => copyResponse(msg.id, `${msg.structured?.synthesis}\n\nEvidence:\n${msg.structured?.evidence?.join('\n')}\n\nDecision Support:\n${msg.structured?.decisionSupport?.join('\n')}`)}
                          className="hover:text-[#17211F] dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#087F5B] dark:text-emerald-400" />
                              <span className="text-[#087F5B] dark:text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Briefing</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded bg-[#EAF0EF] dark:bg-[#020617] border border-[#BCE2DC] dark:border-teal-500/40 flex items-center justify-center text-[#087F73] dark:text-teal-400 shrink-0 text-xs font-mono font-bold animate-pulse">
                  AI
                </div>
                <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 text-xs font-mono text-[#087F73] dark:text-teal-300 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>Cross-referencing active chart with clinical pharmacology literature...</span>
                </div>
              </div>
            )}
          </div>

          {/* Operational Input Box */}
          <div className="pt-3 border-t border-[#D7E1DF] dark:border-[#1E293B] flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask a specific clinical reasoning or pharmacological question about ${selectedCaseDoc.patientName}...`}
              className="flex-1 bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded px-3 py-2 text-xs text-[#17211F] dark:text-white placeholder-[#64716E] dark:placeholder-slate-500 focus:outline-none focus:border-[#087F73] dark:focus:border-[#14B8A6] font-mono"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white p-2 rounded cursor-pointer transition-colors disabled:opacity-50 shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
