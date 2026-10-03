import React, { useState } from 'react';
import { 
  Clock, 
  Activity, 
  Plus, 
  Search, 
  Video, 
  X,
  Sparkles
} from 'lucide-react';
import { SAMPLE_TRIAGE_CASES } from '../data/clinicalCases';
import { TriageCase, UrgencyLevel } from '../types/clinical';

export const AppointmentTriage: React.FC = () => {
  const [triageList, setTriageList] = useState<TriageCase[]>(SAMPLE_TRIAGE_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SAMPLE_TRIAGE_CASES[0].id);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAiTriaging, setIsAiTriaging] = useState<boolean>(false);

  // New patient form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState(45);
  const [newPatientGender, setNewPatientGender] = useState<'M' | 'F' | 'Other'>('M');
  const [newChiefComplaint, setNewChiefComplaint] = useState('');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newBp, setNewBp] = useState('130/80');
  const [newHr, setNewHr] = useState(80);
  const [newRr, setNewRr] = useState(16);
  const [newSpo2, setNewSpo2] = useState(98);
  const [newTemp, setNewTemp] = useState(37.0);
  const [newPain, setNewPain] = useState(3);
  const [newComorbidities, setNewComorbidities] = useState('Hypertension');

  const selectedCase = triageList.find(c => c.id === selectedCaseId) || triageList[0];

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case 'CRITICAL_IMMEDIATE':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#FDF2F4] dark:bg-rose-950/90 text-[#C43D55] dark:text-rose-300 border border-[#F9CAD2] dark:border-rose-800/80 tracking-wider">
            STAT &lt;10M
          </span>
        );
      case 'HIGH_URGENCY':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#FDF2F4] dark:bg-rose-950/50 text-[#C43D55] dark:text-rose-400 border border-[#F9CAD2] dark:border-rose-900/50 tracking-wider">
            HIGH &lt;2H
          </span>
        );
      case 'SEMI_URGENT':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#FFF8EB] dark:bg-amber-950/60 text-[#B86A00] dark:text-amber-300 border border-[#FDE7BA] dark:border-amber-800/50">
            SEMI-URGENT
          </span>
        );
      case 'ROUTINE_PRIORITY':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono text-[#17211F] dark:text-slate-300 bg-[#EAF0EF] dark:bg-slate-800 border border-[#D7E1DF] dark:border-slate-700">
            PRIORITY
          </span>
        );
      case 'TELEHEALTH':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono text-[#087F73] dark:text-teal-300 bg-[#E8F5F3] dark:bg-teal-950/50 border border-[#BCE2DC] dark:border-teal-800/50 flex items-center gap-1 font-semibold">
            <Video className="w-2.5 h-2.5" />
            TELEHEALTH
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono text-[#64716E] dark:text-slate-400 bg-[#EAF0EF] dark:bg-slate-950 border border-[#D7E1DF] dark:border-slate-800">
            ROUTINE
          </span>
        );
    }
  };

  const filteredCases = triageList
    .filter(c => {
      if (filterLevel === 'CRITICAL' && c.urgencyLevel !== 'CRITICAL_IMMEDIATE' && c.urgencyLevel !== 'HIGH_URGENCY') {
        return false;
      }
      if (filterLevel === 'SEMI' && c.urgencyLevel !== 'SEMI_URGENT') {
        return false;
      }
      if (filterLevel === 'ROUTINE' && c.urgencyLevel !== 'ROUTINE_PRIORITY' && c.urgencyLevel !== 'ROUTINE_FOLLOWUP') {
        return false;
      }
      if (filterLevel === 'TELEHEALTH' && c.urgencyLevel !== 'TELEHEALTH') {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.patientName.toLowerCase().includes(q) || c.chiefComplaint.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => b.urgencyScore - a.urgencyScore);

  const handleAddNewIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChiefComplaint.trim()) return;

    setIsAiTriaging(true);

    const newCasePayload = {
      patientName: newPatientName || 'Walk-in Intake',
      age: Number(newPatientAge),
      gender: newPatientGender,
      chiefComplaint: newChiefComplaint,
      symptoms: newSymptoms.split(',').map(s => s.trim()).filter(Boolean),
      vitals: {
        bloodPressure: newBp,
        heartRate: Number(newHr),
        respiratoryRate: Number(newRr),
        spO2: Number(newSpo2),
        temperature: Number(newTemp),
        painScale: Number(newPain)
      },
      chronicConditions: newComorbidities.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const response = await fetch('/api/triage-appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientCase: newCasePayload })
      });

      const data = await response.json();
      const triageResult = data.data || {};

      const createdCase: TriageCase = {
        id: `triage-${Date.now()}`,
        patientName: newCasePayload.patientName,
        age: newCasePayload.age,
        gender: newCasePayload.gender,
        mrn: `INT-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`,
        intakeTime: 'Just now',
        chiefComplaint: newCasePayload.chiefComplaint,
        symptoms: newCasePayload.symptoms.length > 0 ? newCasePayload.symptoms : [newCasePayload.chiefComplaint],
        vitals: newCasePayload.vitals,
        chronicConditions: newCasePayload.chronicConditions,
        urgencyLevel: triageResult.urgencyLevel || 'HIGH_URGENCY',
        urgencyScore: triageResult.urgencyScore || 75,
        clinicalRationale: triageResult.clinicalRationale || 'Physiological parameters evaluated against clinical triage benchmarks.',
        recommendedTimeframe: triageResult.recommendedTimeframe || '< 2 hours',
        suggestedDepartment: triageResult.suggestedDepartment || 'Emergency / Urgent Care',
        preVisitRecommendations: triageResult.preVisitRecommendations || [
          'Nurse baseline vitals repeat',
          'Physician evaluation'
        ],
        status: 'WAITING'
      };

      setTriageList(prev => [createdCase, ...prev]);
      setSelectedCaseId(createdCase.id);
      setIsModalOpen(false);

      setNewChiefComplaint('');
      setNewSymptoms('');
    } catch (err) {
      console.error('Error triaging appointment:', err);
    } finally {
      setIsAiTriaging(false);
    }
  };

  const handleUpdateStatus = (caseId: string, status: TriageCase['status']) => {
    setTriageList(prev => prev.map(c => c.id === caseId ? { ...c, status } : c));
  };

  return (
    <div className="space-y-4">
      {/* Workflow Stage Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#087F73] dark:text-[#14B8A6] uppercase tracking-widest font-semibold">
                STAGE 02 · PRIORITIZE
              </span>
              <span className="text-[#D7E1DF] dark:text-slate-700">/</span>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">EMERGENCY SEVERITY INDEX &amp; SCHEDULING</span>
            </div>
            <h1 className="text-base font-bold text-[#17211F] dark:text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#087F73] dark:text-[#14B8A6]" />
              Appointment Prioritization &amp; Clinical Triage Queue
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white font-mono text-xs px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Triage New Intake</span>
          </button>
        </div>

        {/* Level 2 Inset Strip: Queue Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-[#D7E1DF] dark:border-[#1E293B] text-[11px] font-mono">
          <div className="bg-[#EAF0EF] dark:bg-[#020617] p-2 rounded border border-[#D7E1DF] dark:border-slate-800 transition-colors">
            <span className="text-[#64716E] dark:text-slate-500 block text-[10px]">TOTAL WAITING</span>
            <span className="text-sm font-bold text-[#17211F] dark:text-white">{triageList.length} CASES</span>
          </div>
          <div className="bg-[#FDF2F4] dark:bg-[#020617] p-2 rounded border border-[#F9CAD2] dark:border-rose-950 transition-colors">
            <span className="text-[#C43D55] dark:text-rose-400 block text-[10px] font-bold">STAT / CRITICAL</span>
            <span className="text-sm font-bold text-[#C43D55] dark:text-rose-300">
              {triageList.filter(c => c.urgencyLevel === 'CRITICAL_IMMEDIATE' || c.urgencyLevel === 'HIGH_URGENCY').length} CASES
            </span>
          </div>
          <div className="bg-[#FFF8EB] dark:bg-[#020617] p-2 rounded border border-[#FDE7BA] dark:border-slate-800 transition-colors">
            <span className="text-[#B86A00] dark:text-amber-400 block text-[10px]">SEMI-URGENT</span>
            <span className="text-sm font-bold text-[#17211F] dark:text-slate-200">
              {triageList.filter(c => c.urgencyLevel === 'SEMI_URGENT').length} CASES
            </span>
          </div>
          <div className="bg-[#EAF0EF] dark:bg-[#020617] p-2 rounded border border-[#D7E1DF] dark:border-slate-800 transition-colors">
            <span className="text-[#64716E] dark:text-slate-400 block text-[10px]">ROUTINE SCHED</span>
            <span className="text-sm font-bold text-[#17211F] dark:text-slate-300">
              {triageList.filter(c => c.urgencyLevel === 'ROUTINE_PRIORITY' || c.urgencyLevel === 'ROUTINE_FOLLOWUP').length} CASES
            </span>
          </div>
          <div className="bg-[#E8F5F3] dark:bg-[#020617] p-2 rounded border border-[#BCE2DC] dark:border-slate-800 transition-colors">
            <span className="text-[#087F73] dark:text-teal-400 block text-[10px]">TELEHEALTH DIVERTER</span>
            <span className="text-sm font-bold text-[#087F73] dark:text-teal-300">
              {triageList.filter(c => c.urgencyLevel === 'TELEHEALTH').length} CASES
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Waiting Queue Instrument */}
        <div className="lg:col-span-5 space-y-2">
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-2.5 space-y-2 transition-colors">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64716E] dark:text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by patient name, symptom, or complaint..."
                className="w-full bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded pl-8 pr-2 py-1 text-xs text-[#17211F] dark:text-slate-200 font-mono focus:outline-none focus:border-[#087F73] dark:focus:border-[#14B8A6]"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[10px] font-mono">
              <button
                onClick={() => setFilterLevel('ALL')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  filterLevel === 'ALL'
                    ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#17211F] dark:text-white border border-[#D7E1DF] dark:border-slate-700 font-bold'
                    : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
                }`}
              >
                ALL ({triageList.length})
              </button>
              <button
                onClick={() => setFilterLevel('CRITICAL')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  filterLevel === 'CRITICAL'
                    ? 'bg-[#FDF2F4] dark:bg-rose-950/80 text-[#C43D55] dark:text-rose-300 border border-[#F9CAD2] dark:border-rose-800/80 font-bold'
                    : 'text-[#64716E] dark:text-slate-400 hover:text-[#C43D55]'
                }`}
              >
                CRITICAL
              </button>
              <button
                onClick={() => setFilterLevel('SEMI')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  filterLevel === 'SEMI'
                    ? 'bg-[#FFF8EB] dark:bg-amber-950/80 text-[#B86A00] dark:text-amber-300 border border-[#FDE7BA] dark:border-amber-800/80 font-bold'
                    : 'text-[#64716E] dark:text-slate-400 hover:text-[#B86A00]'
                }`}
              >
                SEMI
              </button>
              <button
                onClick={() => setFilterLevel('ROUTINE')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  filterLevel === 'ROUTINE'
                    ? 'bg-[#EAF0EF] dark:bg-slate-800 text-[#17211F] dark:text-white border border-[#D7E1DF] dark:border-slate-700 font-bold'
                    : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
                }`}
              >
                ROUTINE
              </button>
              <button
                onClick={() => setFilterLevel('TELEHEALTH')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  filterLevel === 'TELEHEALTH'
                    ? 'bg-[#E8F5F3] dark:bg-teal-950 text-[#087F73] dark:text-teal-300 border border-[#BCE2DC] dark:border-teal-800 font-bold'
                    : 'text-[#64716E] dark:text-slate-400 hover:text-[#087F73]'
                }`}
              >
                TELEHEALTH
              </button>
            </div>
          </div>

          {/* Queue List Cards */}
          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredCases.map((patientCase) => {
              const isSelected = selectedCaseId === patientCase.id;
              const isHighUrgency = patientCase.urgencyLevel === 'CRITICAL_IMMEDIATE' || patientCase.urgencyLevel === 'HIGH_URGENCY';

              return (
                <div
                  key={patientCase.id}
                  onClick={() => setSelectedCaseId(patientCase.id)}
                  className={`bg-[#EAF0EF] dark:bg-[#020617] border rounded p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#087F73] dark:border-teal-500/80 ring-1 ring-[#087F73]/30 dark:ring-teal-500/30'
                      : 'border-[#D7E1DF] dark:border-slate-800/90 hover:border-[#64716E] dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#17211F] dark:text-white font-sans">{patientCase.patientName}</span>
                        <span className="text-[10px] font-mono text-[#64716E] dark:text-slate-400">
                          {patientCase.age}Y · {patientCase.gender}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#64716E] dark:text-slate-400 block mt-0.5">
                        {patientCase.mrn} · In: {patientCase.intakeTime}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-mono font-bold ${isHighUrgency ? 'text-[#C43D55] dark:text-rose-400' : 'text-[#17211F] dark:text-slate-200'}`}>
                        {patientCase.urgencyScore}<span className="text-[10px] text-[#64716E] dark:text-slate-400">/100</span>
                      </span>
                      {getUrgencyBadge(patientCase.urgencyLevel)}
                    </div>
                  </div>

                  <p className="text-xs text-[#17211F] dark:text-slate-300 mt-1.5 line-clamp-1 font-sans">
                    {patientCase.chiefComplaint}
                  </p>

                  {/* Micro Vitals Indicator */}
                  <div className="flex items-center gap-3 mt-2 pt-1.5 border-t border-[#D7E1DF] dark:border-slate-900 text-[10px] font-mono text-[#64716E] dark:text-slate-400">
                    <span>BP: <strong className="text-[#17211F] dark:text-slate-200">{patientCase.vitals.bloodPressure || 'N/A'}</strong></span>
                    <span>HR: <strong className="text-[#17211F] dark:text-slate-200">{patientCase.vitals.heartRate ? `${patientCase.vitals.heartRate} bpm` : 'N/A'}</strong></span>
                    <span>SpO2: <strong className={patientCase.vitals.spO2 && patientCase.vitals.spO2 < 92 ? 'text-[#C43D55] dark:text-rose-400 font-bold' : 'text-[#17211F] dark:text-slate-200'}>
                      {patientCase.vitals.spO2 ? `${patientCase.vitals.spO2}%` : 'N/A'}
                    </strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Clinical Triage Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 space-y-4 transition-colors">
          {/* Header of Active Case */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#D7E1DF] dark:border-[#1E293B]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#17211F] dark:text-white font-sans">{selectedCase.patientName}</span>
                <span className="text-[11px] font-mono text-[#64716E] dark:text-slate-400">
                  {selectedCase.age}Y · {selectedCase.gender} · {selectedCase.mrn}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-slate-400 block mt-0.5">
                Target Department: <strong className="text-[#17211F] dark:text-slate-200">{selectedCase.suggestedDepartment}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {getUrgencyBadge(selectedCase.urgencyLevel)}
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 px-2.5 py-1 rounded text-right">
                <span className="text-[9px] font-mono text-[#64716E] dark:text-slate-400 block uppercase">ACUITY SCORE</span>
                <span className="text-sm font-mono font-bold text-[#17211F] dark:text-white">{selectedCase.urgencyScore} / 100</span>
              </div>
            </div>
          </div>

          {/* Level 2 Inset: Benchmark Window Target */}
          <div className={`p-3 rounded border flex items-center justify-between text-xs font-mono transition-colors ${
            selectedCase.urgencyScore >= 80
              ? 'bg-[#FDF2F4] dark:bg-rose-950/40 border-[#F9CAD2] dark:border-rose-800/60 text-[#C43D55] dark:text-rose-200'
              : 'bg-[#EAF0EF] dark:bg-[#020617] border-[#D7E1DF] dark:border-slate-800 text-[#17211F] dark:text-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0 text-[#087F73] dark:text-teal-400" />
              <div>
                <span className="text-[10px] text-[#64716E] dark:text-slate-400 uppercase block">TARGET EVALUATION WINDOW</span>
                <span className="font-bold text-sm tracking-wide">{selectedCase.recommendedTimeframe}</span>
              </div>
            </div>
            <span className="text-[10px] text-[#64716E] dark:text-slate-400 uppercase">
              ESI THROUGHPUT BENCHMARK
            </span>
          </div>

          {/* Vitals Technical Strip */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
              PHYSIOLOGICAL VITALS STREAM
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs font-mono">
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2 text-center">
                <span className="text-[9px] text-[#64716E] dark:text-slate-400 block">BP</span>
                <span className="text-xs font-bold text-[#17211F] dark:text-white mt-0.5 block">{selectedCase.vitals.bloodPressure || '--'}</span>
              </div>
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2 text-center">
                <span className="text-[9px] text-[#64716E] dark:text-slate-400 block">HR</span>
                <span className={`text-xs font-bold mt-0.5 block ${
                  selectedCase.vitals.heartRate && (selectedCase.vitals.heartRate > 100 || selectedCase.vitals.heartRate < 55)
                    ? 'text-[#C43D55] dark:text-rose-400'
                    : 'text-[#17211F] dark:text-white'
                }`}>
                  {selectedCase.vitals.heartRate || '--'} bpm
                </span>
              </div>
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2 text-center">
                <span className="text-[9px] text-[#64716E] dark:text-slate-400 block">RESP</span>
                <span className={`text-xs font-bold mt-0.5 block ${
                  selectedCase.vitals.respiratoryRate && selectedCase.vitals.respiratoryRate > 20
                    ? 'text-[#C43D55] dark:text-rose-400'
                    : 'text-[#17211F] dark:text-white'
                }`}>
                  {selectedCase.vitals.respiratoryRate || '--'} /min
                </span>
              </div>
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2 text-center">
                <span className="text-[9px] text-[#64716E] dark:text-slate-400 block">SpO2</span>
                <span className={`text-xs font-bold mt-0.5 block ${
                  selectedCase.vitals.spO2 && selectedCase.vitals.spO2 < 92
                    ? 'text-[#C43D55] dark:text-rose-400'
                    : 'text-[#17211F] dark:text-white'
                }`}>
                  {selectedCase.vitals.spO2 ? `${selectedCase.vitals.spO2}%` : '--'}
                </span>
              </div>
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2 text-center">
                <span className="text-[9px] text-[#64716E] dark:text-slate-400 block">TEMP</span>
                <span className={`text-xs font-bold mt-0.5 block ${
                  selectedCase.vitals.temperature && selectedCase.vitals.temperature >= 38.0
                    ? 'text-[#C43D55] dark:text-rose-400'
                    : 'text-[#17211F] dark:text-white'
                }`}>
                  {selectedCase.vitals.temperature ? `${selectedCase.vitals.temperature}°C` : '--'}
                </span>
              </div>
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2 text-center">
                <span className="text-[9px] text-[#64716E] dark:text-slate-400 block">PAIN</span>
                <span className="text-xs font-bold text-[#B86A00] dark:text-amber-400 mt-0.5 block">
                  {selectedCase.vitals.painScale !== undefined ? `${selectedCase.vitals.painScale} / 10` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Chief Complaint & Symptoms */}
          <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 space-y-1.5 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
              PRESENTING COMPLAINT &amp; DOCUMENTED SYMPTOMS
            </span>
            <p className="text-xs text-[#17211F] dark:text-slate-100 font-sans leading-relaxed">{selectedCase.chiefComplaint}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {(selectedCase.symptoms || []).map((sym, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-[#D7E1DF] dark:border-slate-800 text-[#17211F] dark:text-slate-300 rounded text-[11px] font-mono">
                  {sym}
                </span>
              ))}
            </div>
          </div>

          {/* AI Clinical Triage Rationale */}
          <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 space-y-1 text-xs transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#087F73] dark:text-teal-400 font-semibold block">
              CLINICAL TRIAGE RATIONALE &amp; DECOMPENSATION RISK
            </span>
            <p className="text-[#17211F] dark:text-slate-300 font-sans leading-relaxed text-xs">
              {selectedCase.clinicalRationale}
            </p>
          </div>

          {/* Pre-Visit Recommendations */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
              PRE-VISIT PROTOCOL ORDERS
            </span>
            <div className="space-y-1">
              {(selectedCase.preVisitRecommendations || []).map((order, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#EAF0EF] dark:bg-[#020617] p-2 rounded border border-[#D7E1DF] dark:border-slate-800 text-xs text-[#17211F] dark:text-slate-300 transition-colors">
                  <span className="text-[#087F73] dark:text-teal-400 font-mono text-[10px]">›</span>
                  <span>{order}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#D7E1DF] dark:border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[#64716E] dark:text-slate-400">
              STATUS: <strong className="text-[#087F73] dark:text-teal-300">{selectedCase.status}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateStatus(selectedCase.id, 'TRIAGED')}
                className="px-2.5 py-1 rounded bg-white hover:bg-[#D7E1DF] dark:bg-[#020617] dark:hover:bg-slate-800 text-[#17211F] dark:text-slate-300 text-xs font-mono cursor-pointer border border-[#D7E1DF] dark:border-slate-800 transition-colors"
              >
                Confirm Triage
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedCase.id, 'ATTENDING_REVIEWED')}
                className="px-3 py-1 rounded bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white text-xs font-mono cursor-pointer transition-colors shadow-xs"
              >
                Assign Physician
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Intake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg max-w-lg w-full p-5 space-y-3.5 text-xs shadow-xl transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-[#D7E1DF] dark:border-[#1E293B]">
              <span className="font-bold text-sm text-[#17211F] dark:text-white font-mono uppercase">New Intake Triage Entry</span>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64716E] dark:text-slate-400 hover:text-[#17211F] dark:hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewIntake} className="space-y-3 font-mono">
              <div>
                <label className="text-[#64716E] dark:text-slate-400 block text-[10px] mb-0.5">PATIENT NAME &amp; AGE</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Patient Name"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="col-span-2 bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-1.5 text-[#17211F] dark:text-white"
                  />
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-1.5 text-[#17211F] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#64716E] dark:text-slate-400 block text-[10px] mb-0.5">PRESENTING CHIEF COMPLAINT</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sudden severe retrosternal chest pain with diaphoresis"
                  value={newChiefComplaint}
                  onChange={(e) => setNewChiefComplaint(e.target.value)}
                  className="w-full bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-1.5 text-[#17211F] dark:text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="text-[#64716E] dark:text-slate-400 block text-[10px] mb-0.5">ASSOCIATED SYMPTOMS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="e.g. Diaphoresis, dyspnea, pain radiating to left shoulder"
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  className="w-full bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-1.5 text-[#17211F] dark:text-white font-sans text-xs"
                />
              </div>

              {/* Vitals Form */}
              <div className="bg-[#EAF0EF] dark:bg-[#020617] p-2.5 rounded border border-[#D7E1DF] dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] text-[#087F73] dark:text-teal-400 font-bold block uppercase">INTAKE VITALS</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] text-[#64716E] dark:text-slate-500 block">BP</label>
                    <input type="text" value={newBp} onChange={(e) => setNewBp(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-[#D7E1DF] dark:border-slate-800 rounded p-1 text-[#17211F] dark:text-white text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#64716E] dark:text-slate-500 block">HR (bpm)</label>
                    <input type="number" value={newHr} onChange={(e) => setNewHr(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-[#D7E1DF] dark:border-slate-800 rounded p-1 text-[#17211F] dark:text-white text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#64716E] dark:text-slate-500 block">SpO2 (%)</label>
                    <input type="number" value={newSpo2} onChange={(e) => setNewSpo2(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-[#D7E1DF] dark:border-slate-800 rounded p-1 text-[#17211F] dark:text-white text-xs" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D7E1DF] dark:border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-white hover:bg-[#EAF0EF] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#17211F] dark:text-slate-300 text-xs border border-[#D7E1DF] dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAiTriaging || !newChiefComplaint.trim()}
                  className="px-4 py-1.5 rounded bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAiTriaging ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Calculate ESI Triage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
