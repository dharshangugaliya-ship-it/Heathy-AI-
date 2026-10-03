export type UrgencyLevel = 'CRITICAL_IMMEDIATE' | 'HIGH_URGENCY' | 'SEMI_URGENT' | 'ROUTINE_PRIORITY' | 'ROUTINE_FOLLOWUP' | 'TELEHEALTH';

export type LabStatus = 'CRITICAL_HIGH' | 'HIGH' | 'NORMAL' | 'LOW' | 'CRITICAL_LOW';

export interface LabValue {
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: LabStatus;
  interpretation?: string;
}

export interface DiagnosisItem {
  condition: string;
  type: 'PRIMARY' | 'SECONDARY' | 'DIFFERENTIAL' | 'HISTORICAL';
  icd10?: string;
  confidenceOrEvidence?: string;
}

export interface MedicationItem {
  drugName: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'ACTIVE' | 'NEWLY_PRESCRIBED' | 'DISCONTINUED' | 'ADJUSTED';
  warnings?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  significance: 'CRITICAL' | 'IMPORTANT' | 'ROUTINE';
}

export interface DocumentSummary {
  patientName?: string;
  mrn?: string;
  documentType: string;
  dateOfService?: string;
  executiveSummary: string;
  diagnoses: DiagnosisItem[];
  abnormalFindings: string[];
  criticalLabValues: LabValue[];
  medications: MedicationItem[];
  timeline: TimelineEvent[];
  actionableRecommendations: string[];
  riskStratification: {
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    score: number; // 0-100
    primaryDrivers: string[];
  };
  clinicalDisclaimers: string;
}

export interface TriageCase {
  id: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  mrn: string;
  intakeTime: string;
  chiefComplaint: string;
  symptoms: string[];
  vitals: {
    bloodPressure?: string; // e.g. 145/92
    heartRate?: number; // bpm
    respiratoryRate?: number; // breaths/min
    spO2?: number; // %
    temperature?: number; // Celsius
    painScale?: number; // 1-10
  };
  chronicConditions: string[];
  currentMedications?: string[];
  urgencyLevel: UrgencyLevel;
  urgencyScore: number; // 1-100 (100 = most urgent)
  clinicalRationale: string;
  recommendedTimeframe: string; // e.g. "< 1 hour (Emergency)", "< 24 hours"
  suggestedDepartment: string;
  preVisitRecommendations: string[];
  status: 'WAITING' | 'TRIAGED' | 'ATTENDING_REVIEWED' | 'DISMISSED';
}

export interface LongitudinalVisit {
  visitDate: string;
  reason: string;
  physician: string;
  vitals: {
    bp: string;
    weightKg: number;
    bmi: number;
  };
  keyLabs: Record<string, number | string>;
  clinicalNotesSummary: string;
}

export interface LongitudinalPatient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  primaryDiagnosis: string;
  chronicConditions: string[];
  allergies: string[];
  activeMedications: MedicationItem[];
  pastVisits: LongitudinalVisit[];
  labTrends: {
    testName: string;
    unit: string;
    normalMin: number;
    normalMax: number;
    dataPoints: { date: string; value: number }[];
  }[];
  careGaps: {
    gap: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
    dueSince: string;
    guidelineReference: string;
  }[];
  polypharmacyAlerts: {
    severity: 'HIGH' | 'MODERATE' | 'INFO';
    interaction: string;
    drugsInvolved: string[];
    clinicalAction: string;
  }[];
  aiTrajectorySummary: string;
}

export interface BoundingBox {
  ymin: number; // 0 to 1000
  xmin: number; // 0 to 1000
  ymax: number; // 0 to 1000
  xmax: number; // 0 to 1000
  label: string;
  description: string;
  confidence?: string;
  severity?: 'CRITICAL' | 'WARNING' | 'NOTE';
}

export interface MedicalImageAnalysis {
  modality: 'CHEST_XRAY' | 'CT_SCAN' | 'DERMATOLOGY' | 'MRI' | 'ULTRASOUND' | 'OTHER';
  technicalQuality: 'ADEQUATE' | 'SUBOPTIMAL' | 'LIMITED';
  primaryObservations: string[];
  differentialConsiderations: {
    condition: string;
    likelihood: 'HIGH' | 'MODERATE' | 'LOW' | 'CANNOT_EXCLUDE';
    rationale: string;
  }[];
  anatomicalRegions: {
    region: string;
    finding: string;
    isAbnormal: boolean;
  }[];
  decisionSupportGuidance: string[];
  roiBoundingBoxes: BoundingBox[];
  urgencyLevel: 'STAT' | 'PRIORITY' | 'ROUTINE';
  disclaimer: string;
}
