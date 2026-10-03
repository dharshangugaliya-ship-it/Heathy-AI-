import React, { useState } from 'react';
import { 
  Scan, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Sparkles, 
  Upload, 
  Activity
} from 'lucide-react';
import { SAMPLE_MEDICAL_IMAGES, SampleMedicalImage } from '../data/clinicalCases';
import { MedicalImageAnalysis } from '../types/clinical';
import { useTheme } from '../context/ThemeContext';

export const MedicalImageResearch: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_MEDICAL_IMAGES[0].id);
  const [activeImage, setActiveImage] = useState<SampleMedicalImage>(SAMPLE_MEDICAL_IMAGES[0]);
  const [clinicalContext, setClinicalContext] = useState<string>(SAMPLE_MEDICAL_IMAGES[0].clinicalContext);
  const [analysisResult, setAnalysisResult] = useState<MedicalImageAnalysis>(SAMPLE_MEDICAL_IMAGES[0].defaultAnalysis);
  
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [invertColors, setInvertColors] = useState<boolean>(false);
  const [filterPreset, setFilterPreset] = useState<'standard' | 'bone' | 'lung' | 'softTissue'>('standard');
  const [showRoiBoxes, setShowRoiBoxes] = useState<boolean>(true);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [attestationConfirmed, setAttestationConfirmed] = useState<boolean>(false);

  const handleSelectPreset = (img: SampleMedicalImage) => {
    setSelectedPresetId(img.id);
    setActiveImage(img);
    setClinicalContext(img.clinicalContext);
    setAnalysisResult(img.defaultAnalysis);
    setZoomLevel(1);
    setInvertColors(false);
    setSelectedBoxIndex(0);
    setAttestationConfirmed(false);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const customImg: SampleMedicalImage = {
        id: `custom-${Date.now()}`,
        name: file.name,
        modality: file.name.toLowerCase().includes('derm') ? 'DERMATOLOGY' : 'CHEST_XRAY',
        clinicalContext: 'Uploaded clinical scan for preliminary pattern detection',
        imageUrl: dataUrl,
        defaultAnalysis: {
          modality: 'CHEST_XRAY',
          technicalQuality: 'ADEQUATE',
          primaryObservations: ['Uploaded image loaded. Execute "Run Pattern Identification" to detect regions of interest.'],
          differentialConsiderations: [],
          anatomicalRegions: [],
          decisionSupportGuidance: ['Awaiting preliminary automated pattern identification.'],
          roiBoundingBoxes: [],
          urgencyLevel: 'PRIORITY',
          disclaimer: 'DECISION SUPPORT RESEARCH ONLY. Radiologist overread required.'
        }
      };

      setSelectedPresetId(customImg.id);
      setActiveImage(customImg);
      setClinicalContext(customImg.clinicalContext);
      setAnalysisResult(customImg.defaultAnalysis);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAiVisionAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-medical-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeImage.imageUrl,
          clinicalIndication: clinicalContext,
          modality: activeImage.modality
        })
      });

      const data = await response.json();
      if (data.status === 'success' && data.data) {
        setAnalysisResult(data.data);
        if (data.data.roiBoundingBoxes?.length > 0) {
          setSelectedBoxIndex(0);
        }
      }
    } catch (err) {
      console.error('Error analyzing medical image:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFilterStyle = () => {
    let filter = '';
    if (invertColors) {
      filter += 'invert(1) ';
    }
    switch (filterPreset) {
      case 'bone':
        filter += 'contrast(160%) brightness(110%) ';
        break;
      case 'lung':
        filter += 'contrast(125%) brightness(95%) ';
        break;
      case 'softTissue':
        filter += 'contrast(90%) brightness(115%) ';
        break;
      default:
        break;
    }
    return filter.trim();
  };

  return (
    <div className="space-y-4">
      {/* Workflow Stage Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#087F73] dark:text-[#14B8A6] uppercase tracking-widest font-semibold">
                STAGE 04 · INVESTIGATE
              </span>
              <span className="text-[#D7E1DF] dark:text-slate-700">/</span>
              <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">RADIOLOGY &amp; DERMATOLOGY PATTERN ASSIST</span>
            </div>
            <h1 className="text-base font-bold text-[#17211F] dark:text-white tracking-tight flex items-center gap-2">
              <Scan className="w-4 h-4 text-[#087F73] dark:text-[#14B8A6]" />
              Medical Image Research Workstation
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] font-mono text-[#64716E] dark:text-[#94A3A0]">STUDY PRESETS:</span>
            <div className="flex flex-wrap gap-1">
              {SAMPLE_MEDICAL_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleSelectPreset(img)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors border ${
                    selectedPresetId === img.id
                      ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-[#14B8A6] border-[#087F73] dark:border-[#14B8A6] font-semibold'
                      : 'bg-white dark:bg-[#020617]/50 text-[#64716E] dark:text-[#94A3A0] border-[#D7E1DF] dark:border-[#1E293B] hover:text-[#17211F] dark:hover:text-white'
                  }`}
                >
                  {img.name.split(':')[0]}
                </button>
              ))}

              <label className="px-2 py-1 text-[11px] font-mono rounded bg-white dark:bg-slate-950 text-[#64716E] dark:text-slate-400 hover:text-[#17211F] dark:hover:text-slate-200 border border-[#D7E1DF] dark:border-slate-800 cursor-pointer flex items-center gap-1 transition-colors">
                <Upload className="w-3 h-3 text-[#64716E] dark:text-slate-400" />
                <span>Upload Scan</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: 7/5 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Workstation Frame with Dedicated #050505 Viewport */}
        <div className="lg:col-span-7 flex flex-col h-[740px] bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-3 transition-colors">
          {/* Workstation Controls Bar */}
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#D7E1DF] dark:border-[#1E293B] gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-bold text-[#087F73] dark:text-[#14B8A6] uppercase">{activeImage.modality}</span>
              <span className="text-[#D7E1DF] dark:text-slate-700">|</span>
              <span className="text-[#64716E] dark:text-[#94A3A0]">QUAL: <strong className="text-[#17211F] dark:text-white">{analysisResult.technicalQuality}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Zoom Controls */}
              <div className="flex items-center bg-[#EAF0EF] dark:bg-[#020617] rounded p-0.5 border border-[#D7E1DF] dark:border-slate-800 text-[10px]">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
                  className="p-1 hover:text-[#087F73] dark:hover:text-teal-400 cursor-pointer text-[#64716E] dark:text-slate-400"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="px-1 text-[#17211F] dark:text-slate-300 min-w-8 text-center font-mono">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.15))}
                  className="p-1 hover:text-[#087F73] dark:hover:text-teal-400 cursor-pointer text-[#64716E] dark:text-slate-400"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1 hover:text-[#087F73] dark:hover:text-teal-400 cursor-pointer text-[#64716E] dark:text-slate-400"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Invert Button */}
              <button
                onClick={() => setInvertColors(prev => !prev)}
                className={`px-2 py-0.5 rounded border text-[10px] cursor-pointer transition-colors ${
                  invertColors
                    ? 'bg-[#FFF8EB] dark:bg-amber-950/80 text-[#B86A00] dark:text-amber-300 border-[#FDE7BA] dark:border-amber-800/80 font-semibold'
                    : 'bg-[#EAF0EF] dark:bg-[#020617] text-[#17211F] dark:text-slate-300 border-[#D7E1DF] dark:border-slate-800'
                }`}
              >
                INVERT
              </button>

              {/* ROI Toggle */}
              <button
                onClick={() => setShowRoiBoxes(prev => !prev)}
                className={`px-2 py-0.5 rounded border text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                  showRoiBoxes
                    ? 'bg-[#E8F5F3] dark:bg-teal-950/80 text-[#087F73] dark:text-teal-300 border-[#BCE2DC] dark:border-teal-800/80 font-semibold'
                    : 'bg-[#EAF0EF] dark:bg-[#020617] text-[#64716E] dark:text-slate-400 border-[#D7E1DF] dark:border-slate-800'
                }`}
              >
                {showRoiBoxes ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>ROI ({analysisResult.roiBoundingBoxes.length})</span>
              </button>
            </div>
          </div>

          {/* Windowing Filters Strip */}
          <div className="flex items-center gap-1 py-1.5 border-b border-[#D7E1DF] dark:border-[#1E293B] text-[10px] font-mono">
            <span className="text-[#64716E] dark:text-slate-400">WINDOW PRESET:</span>
            <button
              onClick={() => setFilterPreset('standard')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                filterPreset === 'standard' ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-teal-400 font-bold border border-[#D7E1DF] dark:border-slate-800' : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
              }`}
            >
              STANDARD
            </button>
            <button
              onClick={() => setFilterPreset('bone')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                filterPreset === 'bone' ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-teal-400 font-bold border border-[#D7E1DF] dark:border-slate-800' : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
              }`}
            >
              BONE / CONTRAST
            </button>
            <button
              onClick={() => setFilterPreset('lung')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                filterPreset === 'lung' ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-teal-400 font-bold border border-[#D7E1DF] dark:border-slate-800' : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
              }`}
            >
              LUNG PARENCHYMA
            </button>
            <button
              onClick={() => setFilterPreset('softTissue')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                filterPreset === 'softTissue' ? 'bg-[#EAF0EF] dark:bg-[#020617] text-[#087F73] dark:text-teal-400 font-bold border border-[#D7E1DF] dark:border-slate-800' : 'text-[#64716E] dark:text-slate-400 hover:text-[#17211F]'
              }`}
            >
              SOFT TISSUE
            </button>
          </div>

          {/* Radiograph Viewport — Strict #050505 Near-Black in BOTH Light & Dark Modes */}
          <div className="flex-1 bg-[#050505] rounded overflow-hidden relative flex items-center justify-center p-2 select-none border border-black shadow-inner">
            <div 
              className="relative transition-transform duration-100 flex items-center justify-center max-w-full max-h-full"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={activeImage.imageUrl}
                alt={activeImage.name}
                style={{ filter: getFilterStyle() }}
                className="max-h-[530px] max-w-full object-contain rounded"
              />

              {/* Semantic ROI Overlays: Teal (AI ROI), Amber (Uncertain), Rose (High Priority) */}
              {showRoiBoxes && (analysisResult.roiBoundingBoxes || []).map((box, index) => {
                const isSelected = selectedBoxIndex === index;
                const top = (box.ymin / 1000) * 100;
                const left = (box.xmin / 1000) * 100;
                const height = ((box.ymax - box.ymin) / 1000) * 100;
                const width = ((box.xmax - box.xmin) / 1000) * 100;

                const borderClass = box.severity === 'CRITICAL'
                  ? 'border-[#F43F5E] bg-[#F43F5E]/15'
                  : box.severity === 'WARNING'
                  ? 'border-[#F59E0B] bg-[#F59E0B]/15'
                  : 'border-[#14B8A6] bg-[#14B8A6]/15';

                const dotColor = box.severity === 'CRITICAL'
                  ? 'bg-[#F43F5E]'
                  : box.severity === 'WARNING'
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#14B8A6]';

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedBoxIndex(index)}
                    style={{
                      top: `${top}%`,
                      left: `${left}%`,
                      width: `${width}%`,
                      height: `${height}%`
                    }}
                    className={`absolute border-2 cursor-pointer transition-all rounded ${borderClass} ${
                      isSelected ? 'ring-1 ring-white z-20' : 'opacity-85 z-10'
                    }`}
                  >
                    <div className="absolute -top-5 left-0 bg-[#050505]/95 border border-slate-700 px-1 py-0.5 rounded text-[9px] font-mono font-bold text-white whitespace-nowrap shadow flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                      <span>{box.label}</span>
                      {box.confidence && <span className="text-slate-400 font-normal">({box.confidence})</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inset Technical DICOM Overlay HUD */}
            <div className="absolute bottom-2 left-2 bg-[#050505]/90 border border-slate-800 p-2 rounded text-[9px] text-slate-400 font-mono pointer-events-none space-y-0.5">
              <div>STUDY: {activeImage.modality}</div>
              <div>VIEWPORT: {filterPreset.toUpperCase()}</div>
              <div>OVERLAYS: {(analysisResult.roiBoundingBoxes || []).length} SEMANTIC LOCI</div>
            </div>
          </div>

          {/* Operational Bottom Action Bar */}
          <div className="pt-2.5 border-t border-[#D7E1DF] dark:border-[#1E293B] flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[#64716E] dark:text-[#94A3A0] truncate max-w-md">
              INDICATION: <strong className="text-[#17211F] dark:text-slate-200">{clinicalContext}</strong>
            </span>

            <button
              onClick={handleRunAiVisionAnalysis}
              disabled={isAnalyzing}
              className="bg-[#087F73] hover:bg-[#05665E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white font-mono text-xs px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white/90" />
                  <span>Re-Analyze Patterns</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Workstation AI Findings & Differential */}
        <div className="lg:col-span-5 flex flex-col h-[740px] bg-white dark:bg-[#0F172A] border border-[#D7E1DF] dark:border-[#1E293B] rounded-lg p-4 justify-between transition-colors">
          <div className="space-y-3.5 overflow-y-auto pr-1 text-xs">
            {/* SaMD Disclaimer Pill (Restrained) */}
            <div className="p-2.5 rounded bg-[#FFF8EB] dark:bg-[#020617] border border-[#FDE7BA] dark:border-amber-800/40 text-[#B86A00] dark:text-amber-200/90 text-xs flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B86A00] dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] font-mono leading-relaxed">
                <span className="font-bold block mb-0.5">PRELIMINARY PATTERN DETECTION ONLY</span>
                {analysisResult.disclaimer}
              </div>
            </div>

            {/* Key Radiologic Observations */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#087F73] dark:text-teal-400 font-semibold block">
                RADIOLOGICAL &amp; VISUAL FINDINGS
              </span>
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-3 space-y-1.5 transition-colors">
                {(analysisResult.primaryObservations || []).map((obs, i) => (
                  <div key={i} className="flex items-start gap-2 text-[#17211F] dark:text-slate-200 text-xs">
                    <span className="text-[#087F73] dark:text-teal-400 font-mono font-bold shrink-0">·</span>
                    <span className="leading-relaxed font-sans">{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Differential Pattern Considerations */}
            {(analysisResult.differentialConsiderations || []).length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
                  DIFFERENTIAL PATTERN MATCHING
                </span>
                <div className="space-y-1.5">
                  {(analysisResult.differentialConsiderations || []).map((diff, i) => (
                    <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2.5 space-y-1 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#17211F] dark:text-white text-xs">{diff.condition}</span>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-semibold ${
                          diff.likelihood === 'HIGH'
                            ? 'bg-[#FDF2F4] dark:bg-rose-950/80 text-[#C43D55] dark:text-rose-300 border border-[#F9CAD2] dark:border-rose-800/60'
                            : diff.likelihood === 'MODERATE'
                            ? 'bg-[#FFF8EB] dark:bg-amber-950/80 text-[#B86A00] dark:text-amber-300 border border-[#FDE7BA] dark:border-amber-800/60'
                            : 'bg-white dark:bg-slate-900 text-[#64716E] dark:text-slate-400'
                        }`}>
                          {diff.likelihood}
                        </span>
                      </div>
                      <p className="text-[#64716E] dark:text-slate-400 text-[11px] leading-normal font-sans italic">
                        Rationale: {diff.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anatomical Regions Checklist */}
            {(analysisResult.anatomicalRegions || []).length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
                  ANATOMICAL COMPARTMENTS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(analysisResult.anatomicalRegions || []).map((region, i) => (
                    <div key={i} className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2 transition-colors">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-[#17211F] dark:text-slate-200 text-xs">{region.region}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${region.isAbnormal ? 'bg-[#C43D55] dark:bg-rose-500' : 'bg-[#087F5B] dark:bg-emerald-400'}`}></span>
                      </div>
                      <p className="text-[10px] text-[#64716E] dark:text-slate-400 font-mono leading-tight">{region.finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Diagnostic Workup */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64716E] dark:text-slate-400 font-semibold block">
                RECOMMENDED CORRELATION &amp; WORKUP
              </span>
              <div className="bg-[#EAF0EF] dark:bg-[#020617] border border-[#D7E1DF] dark:border-slate-800 rounded p-2.5 space-y-1 text-[#17211F] dark:text-slate-300 text-xs transition-colors">
                {(analysisResult.decisionSupportGuidance || []).map((guide, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#087F73] dark:text-teal-400 font-mono text-[10px] mt-0.5 shrink-0">›</span>
                    <span className="leading-snug">{guide}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radiologist Formal Sign-off Strip */}
          <div className="pt-3 border-t border-[#D7E1DF] dark:border-[#1E293B] space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#64716E] dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={attestationConfirmed}
                onChange={(e) => setAttestationConfirmed(e.target.checked)}
                className="rounded border-[#D7E1DF] text-[#087F73] focus:ring-[#087F73] h-3.5 w-3.5 bg-white dark:bg-slate-950"
              />
              <span className="text-[11px] text-[#17211F] dark:text-slate-300">
                I attest that I have performed formal image overread and correlated with clinical presentation.
              </span>
            </label>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#64716E] dark:text-slate-400">
              <span>PRIORITY ROUTING: <strong className="text-[#B86A00] dark:text-amber-400">{analysisResult.urgencyLevel}</strong></span>
              <span className={attestationConfirmed ? 'text-[#087F5B] dark:text-emerald-400 font-bold' : 'text-[#64716E] dark:text-slate-400'}>
                {attestationConfirmed ? 'ATTESTATION RECORDED' : 'OVERREAD PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
