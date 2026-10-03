import { DocumentSummary, TriageCase, LongitudinalPatient, MedicalImageAnalysis } from '../types/clinical';

export interface SampleMedicalDocument {
  id: string;
  title: string;
  category: 'Discharge Summary' | 'Laboratory Panel' | 'Radiology Report' | 'Pathology Biopsy' | 'Emergency Encounter';
  patientName: string;
  age: number;
  gender: string;
  date: string;
  content: string;
  suggestedSummary: DocumentSummary;
}

export const SAMPLE_DOCUMENTS: SampleMedicalDocument[] = [
  {
    id: 'doc-cardio-01',
    title: 'Inpatient Discharge: Acute Decompensated Heart Failure & CKD',
    category: 'Discharge Summary',
    patientName: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    date: '2026-09-18',
    content: `METROPOLITAN UNIVERSITY HOSPITAL
DEPARTMENT OF INTERNAL MEDICINE & CARDIOLOGY
DISCHARGE SUMMARY

PATIENT: Vance, Eleanor
MRN: 849-21-994
DOB: 1958-03-12 (Age 68)
ADMISSION DATE: 2026-09-12
DISCHARGE DATE: 2026-09-18
ATTENDING: Dr. Richard Sterling, MD, FACC

PRIMARY DISCHARGE DIAGNOSES:
1. Acute decompensated heart failure with reduced ejection fraction (HFrEF, EF 32-35%), NYHA Class III, secondary to ischemic cardiomyopathy.
2. Acute kidney injury superimposed on Chronic Kidney Disease Stage 3b (baseline eGFR 38 mL/min/1.73m², nadir during admission 24 mL/min, recovering to 32 mL/min).
3. Primary hypertension, moderate control.
4. Type 2 Diabetes Mellitus with microvascular complications, uncomplicated at discharge.

SECONDARY / HISTORICAL:
- Hyperlipidemia
- History of coronary artery bypass grafting (CABG x3) in 2018
- Paroxysmal atrial fibrillation (CHADS2-VASc score = 4)

HOSPITAL COURSE & CLINICAL NARRATIVE:
The patient is a 68-year-old female presenting with a 1-week history of progressively worsening dyspnea on exertion, orthopnea requiring 3 pillows, paroxysmal nocturnal dyspnea, and bilateral lower extremity 3+ pitting edema to the mid-shins. Weight gain was documented at 6.4 kg over baseline.

On admission, blood pressure was 164/94 mmHg, heart rate 88 bpm regular, SpO2 91% on ambient air, respiratory rate 24/min. Physical exam revealed jugular venous distention of 8 cm above sternal angle, bibasilar inspiratory crackles extending to mid-lung fields, S3 gallop, and hepatojugular reflux.

Chest X-ray on admission showed marked cardiomegaly, bilateral vascular congestion, and cephalization with bilateral pleural effusions (right > left).
Echocardiogram (2026-09-13): Left ventricular ejection fraction severely depressed at 32-35%, severe global hypokinesis of anterior and apical segments, moderate mitral regurgitation (functional), estimated pulmonary artery systolic pressure 48 mmHg.

Aggressive diuresis was initiated with IV Furosemide 80 mg BID, subsequently transitioned to continuous furosemide drip due to diuretic resistance. Net fluid balance of -5,800 mL was achieved over 5 days. Renal parameters transiently rose: Serum Creatinine peaked at 2.45 mg/dL with Potassium rising to 5.4 mEq/L, prompting temporary cessation of Spironolactone and dose reduction of ACE-inhibitor therapy. Upon reaching euvolemic state, serum creatinine stabilized to 1.95 mg/dL and Potassium normalized to 4.7 mEq/L.

LABORATORY FINDINGS AT DISCHARGE (2026-09-18):
- NT-proBNP: 1,840 pg/mL (Admission was 6,920 pg/mL) [Ref < 125 pg/mL] - High
- Serum Creatinine: 1.95 mg/dL (Baseline ~1.6 mg/dL) [Ref 0.5 - 1.1 mg/dL] - High
- Blood Urea Nitrogen (BUN): 48 mg/dL [Ref 7 - 20 mg/dL] - High
- eGFR: 32 mL/min/1.73m² [Ref > 60 mL/min/1.73m²] - Low
- Serum Potassium: 4.7 mEq/L [Ref 3.5 - 5.0 mEq/L] - Normal
- Serum Sodium: 136 mEq/L [Ref 135 - 145 mEq/L] - Normal
- High-Sensitivity Troponin I: 0.038 ng/mL (trending down from peak 0.082 ng/mL) [Ref < 0.014 ng/mL] - Elevated baseline
- Hemoglobin: 10.4 g/dL [Ref 12.0 - 16.0 g/dL] - Mild normocytic anemia

DISCHARGE MEDICATIONS:
1. Furosemide 40 mg oral PO once daily in morning (increased from pre-admission 20 mg).
2. Metoprolol Succinate ER 50 mg oral PO once daily.
3. Sacubitril / Valsartan (Entresto) 24/26 mg oral PO twice daily (re-titrated cautiously, counsel on hypotension/hyperkalemia).
4. Apixaban 5 mg oral PO twice daily for non-valvular AF stroke prevention.
5. Atorvastatin 40 mg oral PO at bedtime.
6. Insulin Glargine 16 units subcutaneous nightly.
*NOTE: Spironolactone discontinued due to elevated potassium risk alongside Entresto and CKD.

POST-DISCHARGE INSTRUCTIONS & CARE PLAN:
- Strict daily weight log: notify clinic if weight increases by > 2 lbs in 24 hours or 4 lbs in 1 week.
- Sodium restriction < 2,000 mg/day; fluid restriction 1.5 - 2.0 Liters/day.
- Mandatory outpatient nephrology & HF clinic follow-up with repeat basic metabolic panel (BMP) in 7 days (2026-09-25) to evaluate Creatinine and Potassium stability.`,
    suggestedSummary: {
      patientName: 'Eleanor Vance',
      mrn: '849-21-994',
      documentType: 'Inpatient Discharge Summary',
      dateOfService: '2026-09-18',
      executiveSummary: '68-year-old female successfully treated for Acute Decompensated HFrEF (EF 32-35%) and acute-on-chronic renal impairment (eGFR 32 mL/min). Euvolemic state achieved with intensive diuresis (-5.8L net). Entresto cautiously restarted; Spironolactone discontinued to prevent recurrent hyperkalemia. Requires close 7-day lab monitoring for renal/electrolyte stability.',
      diagnoses: [
        { condition: 'Acute Decompensated Heart Failure (HFrEF, EF 32-35%)', type: 'PRIMARY', icd10: 'I50.23', confidenceOrEvidence: 'Echo EF 32%, NT-proBNP 6920->1840, S3 gallop, bilateral rales' },
        { condition: 'Acute Kidney Injury on CKD Stage 3b', type: 'PRIMARY', icd10: 'N17.9 / N18.32', confidenceOrEvidence: 'Cr peaked at 2.45, settled at 1.95; eGFR 32' },
        { condition: 'Paroxysmal Atrial Fibrillation', type: 'SECONDARY', icd10: 'I48.0', confidenceOrEvidence: 'CHADS2-VASc = 4, on Apixaban' },
        { condition: 'Ischemic Cardiomyopathy s/p CABG (2018)', type: 'HISTORICAL', icd10: 'I25.5', confidenceOrEvidence: 'Surgical history' }
      ],
      abnormalFindings: [
        'Persistent cardiomegaly with reduced ejection fraction 32-35% and severe apical hypokinesis',
        'Marked initial volume overload with 6.4kg weight gain, JVD 8cm, and bibasilar effusions',
        'Transient acute hyperkalemia (5.4 mEq/L) requiring suspension of mineralocorticoid receptor antagonist',
        'Residual renal impairment (eGFR 32 mL/min/1.73m²)'
      ],
      criticalLabValues: [
        { name: 'NT-proBNP', value: 1840, unit: 'pg/mL', referenceRange: '< 125', status: 'HIGH', interpretation: 'Markedly elevated though substantially improved from admission 6,920' },
        { name: 'Serum Creatinine', value: 1.95, unit: 'mg/dL', referenceRange: '0.5 - 1.1', status: 'HIGH', interpretation: 'Above patient baseline (1.6), recovering from peak 2.45' },
        { name: 'eGFR', value: 32, unit: 'mL/min/1.73m²', referenceRange: '> 60', status: 'LOW', interpretation: 'Moderate-to-severe renal reduction' },
        { name: 'BUN', value: 48, unit: 'mg/dL', referenceRange: '7 - 20', status: 'HIGH', interpretation: 'Prerenal azotemia component secondary to diuresis' },
        { name: 'Hemoglobin', value: 10.4, unit: 'g/dL', referenceRange: '12.0 - 16.0', status: 'LOW', interpretation: 'Mild chronic normocytic anemia' }
      ],
      medications: [
        { drugName: 'Furosemide', dosage: '40 mg', frequency: 'Daily (AM)', route: 'PO', status: 'ADJUSTED', warnings: 'Increased from 20mg baseline; watch orthostasis' },
        { drugName: 'Sacubitril/Valsartan (Entresto)', dosage: '24/26 mg', frequency: 'BID', route: 'PO', status: 'NEWLY_PRESCRIBED', warnings: 'Requires monitoring of BP, K+, and Cr within 7 days' },
        { drugName: 'Metoprolol Succinate ER', dosage: '50 mg', frequency: 'Daily', route: 'PO', status: 'ACTIVE' },
        { drugName: 'Apixaban', dosage: '5 mg', frequency: 'BID', route: 'PO', status: 'ACTIVE', warnings: 'Anticoagulant - bleed precautions' },
        { drugName: 'Spironolactone', dosage: '25 mg', frequency: 'Daily', route: 'PO', status: 'DISCONTINUED', warnings: 'Discontinued due to hyperkalemia risk with Entresto + CKD' }
      ],
      timeline: [
        { date: '2018-06-14', event: 'Triple-vessel CABG procedure', significance: 'IMPORTANT' },
        { date: '2026-09-12', event: 'Hospital admission for acute decompensated heart failure; peak NT-proBNP 6,920 pg/mL', significance: 'CRITICAL' },
        { date: '2026-09-14', event: 'Peak Creatinine 2.45 mg/dL; Spironolactone held', significance: 'CRITICAL' },
        { date: '2026-09-18', event: 'Euvolemic discharge achieved (-5.8 L net)', significance: 'IMPORTANT' },
        { date: '2026-09-25', event: 'Scheduled BMP safety check (Creatinine & Potassium)', significance: 'CRITICAL' }
      ],
      actionableRecommendations: [
        'Order BMP (Serum Creatinine, BUN, Potassium, Sodium) on Day 7 post-discharge to evaluate Entresto tolerance',
        'Verify patient adherence to daily morning weight log with strict call threshold (+2 lbs/24h or +4 lbs/week)',
        'Ensure Spironolactone remains off electronic MAR to prevent fatal accidental hyperkalemia co-prescribing',
        'Schedule follow-up echocardiogram in 3 months for evaluation of possible CRT-D / ICD candidacy if EF remains <= 35%'
      ],
      riskStratification: {
        level: 'HIGH',
        score: 78,
        primaryDrivers: ['Low ejection fraction (32%)', 'Cardiorenal syndrome interplay (eGFR 32)', 'High 30-day HF readmission vulnerability', 'Complex polypharmacy']
      },
      clinicalDisclaimers: 'DECISION-SUPPORT SUMMARY ONLY. Must be verified against original electronic health record by attending clinician.'
    }
  },
  {
    id: 'doc-pneumonia-02',
    title: 'Emergency Encounter: Severe Community-Acquired Pneumonia & Sepsis Workup',
    category: 'Emergency Encounter',
    patientName: 'Marcus Chen',
    age: 54,
    gender: 'Male',
    date: '2026-09-29',
    content: `ST. JUDE EMERGENCY DEPARTMENT
CLINICAL ENCOUNTER & STAT LAB WORKUP

PATIENT: Chen, Marcus
MRN: 412-88-102
DOB: 1972-04-19 (Age 54)
TRIAGE TIME: 2026-09-29 03:15 AM
ATTENDING PHYSICIAN: Dr. Aris Thorne, MD, FACEP

CHIEF COMPLAINT:
Severe acute shortness of breath, high fevers, rigors, and right-sided pleuritic chest pain for 48 hours.

VITAL SIGNS:
- Temp: 39.2 °C (102.6 °F) - Fever
- BP: 98/62 mmHg (Mean Arterial Pressure 74 mmHg) - Borderline hypotensive
- Heart Rate: 118 bpm - Sinus tachycardia
- Respiratory Rate: 28 breaths/min - Tachypneic
- SpO2: 88% on ambient air, improved to 94% on 4L nasal cannula
- Pain: 8/10 right lateral chest on deep inspiration

CLINICAL IMPRESSION:
A 54-year-old male with history of well-controlled asthma and 20 pack-year smoking history presenting with rapid respiratory compromise. Chest auscultation reveals dense bronchial breath sounds, egophony, and coarse crackles over the right middle and lower lung fields. Dullness to percussion at right lung base.

EMERGENCY LABORATORY PANEL:
- Arterial Blood Gas (Room air):
  pH: 7.33 [Ref 7.35 - 7.45] - Acidemic
  pCO2: 31 mmHg [Ref 35 - 45] - Respiratory compensation
  pO2: 56 mmHg [Ref 80 - 100] - Moderate hypoxemia
  HCO3: 16 mEq/L [Ref 22 - 26] - Metabolic acidosis
- Complete Blood Count:
  WBC: 19.8 x 10^3/uL [Ref 4.0 - 11.0] - CRITICAL HIGH (Leukocytosis)
  Neutrophils: 89% with 8% band forms (Left shift)
  Platelets: 134 x 10^3/uL [Ref 150 - 450] - Mild thrombocytopenia
- Chemistry / Sepsis Markers:
  Lactate (Venous): 3.1 mmol/L [Ref 0.5 - 2.0 mmol/L] - HIGH (Tissue hypoperfusion)
  Procalcitonin: 4.8 ng/mL [Ref < 0.1 ng/mL] - High (Severe bacterial sepsis indicator)
  C-Reactive Protein (CRP): 184 mg/L [Ref < 5.0 mg/L] - Markedly elevated
  Serum Creatinine: 1.48 mg/dL (Baseline 0.9) - Mild acute kidney injury

RADIOLOGY REPORT (Bedside Portable Chest AP, 03:40 AM):
Findings: Extensive airspace opacification with air bronchograms involving the right middle and lower lobes, compatible with dense lobar pneumonia. Blunting of right costophrenic angle suggesting reactive parapneumonic pleural effusion. Left lung field is clear. Cardiothorasic ratio within normal limits.

INTERVENTIONS IN ED:
- Blood cultures x2 drawn prior to antimicrobials
- IV Ceftriaxone 2g + IV Azithromycin 500mg initiated
- 2,000 mL IV Normal Saline bolus (30 mL/kg sepsis protocol target) with post-bolus BP responding to 112/70 mmHg
- Supplemental O2 titrated to maintain SpO2 > 92%
- CURB-65 Score: 3 (Confusion 0, Urea > 7mmol/L = 1, RR >= 30 = 0 [RR was 28], BP low = 1, Age >= 65 = 0; Total 2-3 points). Severe CAP classification warranting Stepdown / ICU admission.`,
    suggestedSummary: {
      patientName: 'Marcus Chen',
      mrn: '412-88-102',
      documentType: 'Emergency Sepsis & Pneumonia Workup',
      dateOfService: '2026-09-29',
      executiveSummary: '54-year-old male with severe Community-Acquired Lobar Pneumonia (right middle & lower lobes) meeting Sepsis criteria with elevated lactate (3.1 mmol/L), severe leukocytosis with left shift (WBC 19.8k, 8% bands), and procalcitonin (4.8 ng/mL). Responded to initial fluid resuscitation and empiric IV Ceftriaxone + Azithromycin. Requires intermediate care / stepdown admission.',
      diagnoses: [
        { condition: 'Severe Community-Acquired Lobar Pneumonia', type: 'PRIMARY', icd10: 'J18.1', confidenceOrEvidence: 'Right M/L lobe consolidation on CXR, fever 39.2C, productive cough' },
        { condition: 'Sepsis secondary to pulmonary source', type: 'PRIMARY', icd10: 'A41.9', confidenceOrEvidence: 'SIRS criteria met (WBC 19.8k, HR 118, RR 28, T 39.2C) + Lactate 3.1' },
        { condition: 'Acute Hypoxemic Respiratory Failure', type: 'PRIMARY', icd10: 'J96.01', confidenceOrEvidence: 'PaO2 56 mmHg on ambient air, SpO2 88%' },
        { condition: 'Mild Acute Kidney Injury (Prerenal)', type: 'SECONDARY', icd10: 'N17.9', confidenceOrEvidence: 'Creatinine elevated to 1.48 from 0.9 baseline' }
      ],
      abnormalFindings: [
        'Severe hypoxemic respiratory distress (SpO2 88% room air, tachypnea 28/min)',
        'Extensive right middle and lower lobe consolidation with air bronchograms and parapneumonic effusion',
        'Marked systemic inflammatory response: WBC 19.8k with 8% bands, CRP 184 mg/L, Procalcitonin 4.8 ng/mL',
        'Evidence of hypoperfusion: Venous Lactate 3.1 mmol/L and borderline hypotension (98/62 mmHg)'
      ],
      criticalLabValues: [
        { name: 'Venous Lactate', value: 3.1, unit: 'mmol/L', referenceRange: '0.5 - 2.0', status: 'CRITICAL_HIGH', interpretation: 'Severe sepsis indicator; requires repeat within 2-4 hours' },
        { name: 'WBC Count', value: 19.8, unit: 'x10^3/uL', referenceRange: '4.0 - 11.0', status: 'CRITICAL_HIGH', interpretation: 'Marked leukocytosis with 8% immature bands' },
        { name: 'Procalcitonin', value: 4.8, unit: 'ng/mL', referenceRange: '< 0.1', status: 'CRITICAL_HIGH', interpretation: 'Strong evidence of invasive bacterial infection' },
        { name: 'PaO2 (Arterial)', value: 56, unit: 'mmHg', referenceRange: '80 - 100', status: 'CRITICAL_LOW', interpretation: 'Significant acute hypoxemia' },
        { name: 'Serum Creatinine', value: 1.48, unit: 'mg/dL', referenceRange: '0.7 - 1.3', status: 'HIGH', interpretation: 'Acute prerenal azotemia secondary to sepsis' }
      ],
      medications: [
        { drugName: 'Ceftriaxone', dosage: '2 g', frequency: 'Once daily', route: 'IV', status: 'NEWLY_PRESCRIBED', warnings: 'Broad-spectrum cephalosporin for CAP' },
        { drugName: 'Azithromycin', dosage: '500 mg', frequency: 'Once daily', route: 'IV', status: 'NEWLY_PRESCRIBED', warnings: 'Atypical coverage; monitor QTc if combined with other agents' },
        { drugName: 'Normal Saline 0.9%', dosage: '2,000 mL bolus', frequency: 'STAT', route: 'IV', status: 'NEWLY_PRESCRIBED', warnings: 'Sepsis fluid resuscitation target' }
      ],
      timeline: [
        { date: '2026-09-27', event: 'Onset of fever, productive cough, and pleurisy', significance: 'ROUTINE' },
        { date: '2026-09-29 03:15', event: 'ED Triage with acute respiratory failure (SpO2 88%)', significance: 'CRITICAL' },
        { date: '2026-09-29 03:40', event: 'Chest radiograph confirms RML/RLL consolidation', significance: 'IMPORTANT' },
        { date: '2026-09-29 04:10', event: 'Sepsis bundle initiated: Blood cultures, IV Ceftriaxone/Azithro, 2L IVF', significance: 'CRITICAL' }
      ],
      actionableRecommendations: [
        'Repeat venous lactate in 2-4 hours to confirm clearance (> 10% decrease desired)',
        'Monitor urine output via Foley catheter targeting > 0.5 mL/kg/hr to assess end-organ perfusion',
        'Review blood culture preliminary gram stain at 24 and 48 hours for targeted antimicrobial de-escalation',
        'Obtain lateral decubitus radiograph or bedside ultrasound if parapneumonic effusion enlarges to rule out empyema'
      ],
      riskStratification: {
        level: 'CRITICAL',
        score: 89,
        primaryDrivers: ['Severe sepsis criteria with elevated lactate', 'High oxygen requirement', 'Bacterial lobar pneumonia with effusion']
      },
      clinicalDisclaimers: 'DECISION-SUPPORT TICKET. Immediate bedside physician evaluation and continuous hemodynamic monitoring required.'
    }
  },
  {
    id: 'doc-biopsy-03',
    title: 'Surgical Pathology: Breast Core Needle Biopsy with Biomarker Panel',
    category: 'Pathology Biopsy',
    patientName: 'Margaret Hayes',
    age: 51,
    gender: 'Female',
    date: '2026-09-22',
    content: `PATHOLOGY & ONCOLOGIC LABORATORY REPORT
SURGICAL SPECIMEN EXAMINATION

PATIENT: Hayes, Margaret
MRN: 703-44-192
DOB: 1975-08-11 (Age 51)
SPECIMEN DATE: 2026-09-20
REPORT DATE: 2026-09-22
PATHOLOGIST: Dr. Evelyn Zhao, MD, FCAP

CLINICAL HISTORY:
51-year-old female presenting with a 1.8 cm palpable mass in the upper outer quadrant of the left breast, detected on screening digital mammography (BI-RADS 4C). Ultrasound-guided 14-gauge core needle biopsy was performed with placement of titanium micro-clip.

GROSS DESCRIPTION:
Specimen received in formalin labeled "Left breast 10:00 position, 4 cm from nipple". Consists of four cylindrical core biopsy fragments measuring 1.2 to 1.6 cm in length, tan-white, fibrofatty. Entire specimen submitted in Block A1.

MICROSCOPIC DIAGNOSIS:
LEFT BREAST, 10:00 POSITION, CORE NEEDLE BIOPSY:
- INVASIVE DUCTAL CARCINOMA (INVASIVE BREAST CARCINOMA OF NO SPECIAL TYPE).
- NOTTINGHAM HISTOLOGIC GRADE: 2 OF 3 (MODERATELY DIFFERENTIATED).
  * Tubule formation score: 3 (poor tubule formation, < 10%)
  * Nuclear pleomorphism score: 2 (moderate variation in nuclear size and shape)
  * Mitotic count score: 1 (2 mitoses per 10 high-power fields)
  * Total Nottingham Score: 6/9.
- Associated High-grade Ductal Carcinoma In Situ (DCIS), solid and cribriform patterns with focal comedonecrosis, comprising approximately 20% of tissue volume.
- Lymphovascular space invasion (LVI): Not identified on these core fragments.
- Microcalcifications: Present within areas of DCIS and invasive tumor.

IMMUNOHISTOCHEMISTRY & BIOMARKER RECEPTOR ANALYSIS:
- Estrogen Receptor (ER): POSITIVE (95% of tumor nuclei show strong intensity, Allred Score 8/8).
- Progesterone Receptor (PR): POSITIVE (80% of tumor nuclei show moderate-to-strong intensity, Allred Score 7/8).
- HER2/neu (c-erbB-2): EQUIVOCAL (1+ to 2+ incomplete membrane staining in > 10% of tumor cells).
  * REFLEX TESTING: Specimen automatically routed for HER2 Dual-Color In Situ Hybridization (FISH) to establish gene amplification status.
- Ki-67 Proliferation Index: 22% (Intermediate proliferation rate).

COMMENT & CLINICAL PATHWAY GUIDANCE:
The histopathologic profile demonstrates a hormone receptor-positive (ER+/PR+) invasive carcinoma of intermediate histologic grade. Pending reflex HER2 FISH testing, the tumor provisionally aligns with Luminal B-like (HER2-negative or HER2-positive pending FISH) molecular subtype. Recommend discussion at Multidisciplinary Breast Tumor Board for surgical planning (breast conservation vs mastectomy, sentinel lymph node biopsy) and staging imaging.`,
    suggestedSummary: {
      patientName: 'Margaret Hayes',
      mrn: '703-44-192',
      documentType: 'Surgical Pathology Report',
      dateOfService: '2026-09-22',
      executiveSummary: '51-year-old female diagnosed with Invasive Ductal Carcinoma (Grade 2, Nottingham score 6/9) of left breast with associated DCIS. Strongly ER-positive (95%) and PR-positive (80%). HER2 is equivocal (1-2+) with reflex FISH testing pending. Ki-67 proliferation is 22%. Multidisciplinary tumor board discussion recommended.',
      diagnoses: [
        { condition: 'Invasive Ductal Carcinoma, Left Breast (Nottingham Grade 2)', type: 'PRIMARY', icd10: 'C50.412', confidenceOrEvidence: 'Core needle biopsy with histological confirmation (Score 6/9)' },
        { condition: 'Ductal Carcinoma In Situ (DCIS), High-Grade', type: 'SECONDARY', icd10: 'D05.12', confidenceOrEvidence: '20% volume with focal comedonecrosis' }
      ],
      abnormalFindings: [
        'Malignant epithelial proliferation with tubular score 3, nuclear score 2, mitotic count 1',
        'Comedonecrosis identified in DCIS components',
        'HER2 equivocal immunohistochemistry requiring reflex FISH amplification testing',
        'Ki-67 proliferation index of 22% (intermediate proliferative activity)'
      ],
      criticalLabValues: [
        { name: 'Estrogen Receptor (ER)', value: '95% (Strong)', unit: '%', referenceRange: '> 1% Positive', status: 'NORMAL', interpretation: 'Strongly positive; high likelihood of endocrine therapy benefit' },
        { name: 'Progesterone Receptor (PR)', value: '80% (Moderate-Strong)', unit: '%', referenceRange: '> 1% Positive', status: 'NORMAL', interpretation: 'Strongly positive' },
        { name: 'HER2 IHC', value: '1+ / 2+ (Equivocal)', unit: 'Score', referenceRange: '0 (Neg), 3+ (Pos)', status: 'HIGH', interpretation: 'Equivocal; requires mandatory reflex FISH gene amplification' },
        { name: 'Ki-67 Index', value: 22, unit: '%', referenceRange: '< 14% Low', status: 'HIGH', interpretation: 'Intermediate proliferation indicative of Luminal B-like phenotype' }
      ],
      medications: [],
      timeline: [
        { date: '2026-09-10', event: 'Screening mammogram demonstrates 1.8cm mass (BI-RADS 4C)', significance: 'IMPORTANT' },
        { date: '2026-09-20', event: 'Ultrasound-guided core needle biopsy of left breast 10:00 mass', significance: 'IMPORTANT' },
        { date: '2026-09-22', event: 'Pathology confirmation: Grade 2 IDC (ER 95%, PR 80%, HER2 equivocal)', significance: 'CRITICAL' },
        { date: '2026-09-28', event: 'Expected turnaround for reflex HER2 FISH amplification result', significance: 'CRITICAL' }
      ],
      actionableRecommendations: [
        'Track reflex HER2 FISH report to determine if anti-HER2 targeted therapy (Trastuzumab/Pertuzumab) is warranted',
        'Present case at next Multidisciplinary Breast Tumor Board for surgical oncologic planning (Lumpectomy vs Mastectomy + SLNB)',
        'Order bilateral breast MRI to evaluate disease extent and exclude multicentricity prior to definitive surgery',
        'Offer referral for hereditary cancer genetic risk assessment (BRCA1/2, PALB2) given age <= 50-51 at diagnosis'
      ],
      riskStratification: {
        level: 'HIGH',
        score: 72,
        primaryDrivers: ['Invasive malignant histology', 'High-grade DCIS components', 'Equivocal HER2 status awaiting final staging']
      },
      clinicalDisclaimers: 'DECISION SUPPORT ONLY. Definitive therapeutic strategy requires oncology multidisciplinary consensus and patient informed consent.'
    }
  }
];

export const SAMPLE_TRIAGE_CASES: TriageCase[] = [
  {
    id: 'triage-001',
    patientName: 'David K. Miller',
    age: 63,
    gender: 'M',
    mrn: '619-33-882',
    intakeTime: '10 mins ago',
    chiefComplaint: 'Substernal chest pressure radiating to left jaw, diaphoresis',
    symptoms: ['Crushing chest pressure 9/10', 'Radiation to left arm and jaw', 'Diaphoresis (cold sweats)', 'Nausea', 'Dyspnea at rest'],
    vitals: {
      bloodPressure: '168/102',
      heartRate: 104,
      respiratoryRate: 22,
      spO2: 95,
      temperature: 37.1,
      painScale: 9
    },
    chronicConditions: ['Type 2 Diabetes', 'Hypertension', 'Former 30 pack-year smoker'],
    currentMedications: ['Metformin 1000mg', 'Lisinopril 20mg'],
    urgencyLevel: 'CRITICAL_IMMEDIATE',
    urgencyScore: 98,
    clinicalRationale: 'Classic anginal presentation with radiation and autonomic symptoms in high-risk demographic with vascular risk factors. High suspicion for Acute Coronary Syndrome (STEMI / NSTEMI). Requires immediate 12-lead ECG (< 10 minutes) and emergency resuscitation bay routing.',
    recommendedTimeframe: 'IMMEDIATE (< 10 minutes)',
    suggestedDepartment: 'Emergency Resuscitation / Cardiology Cath Lab',
    preVisitRecommendations: [
      'Stat 12-lead ECG within 10 minutes',
      'Dual large-bore IV access and bedside continuous telemetry',
      'Stat high-sensitivity cardiac troponin, electrolytes, and coagulation panel',
      'Administer chewable Aspirin 324 mg unless verified contraindicated'
    ],
    status: 'WAITING'
  },
  {
    id: 'triage-002',
    patientName: 'Sarah Jenkins',
    age: 34,
    gender: 'F',
    mrn: '482-19-204',
    intakeTime: '22 mins ago',
    chiefComplaint: 'Sudden onset unilateral right calf pain, swelling, and mild pleurisy post-flight',
    symptoms: ['Right calf edema and erythema', 'Calf tenderness on dorsiflexion', 'Mild shortness of breath on exertion', 'Flew 14 hours 2 days ago'],
    vitals: {
      bloodPressure: '124/78',
      heartRate: 96,
      respiratoryRate: 19,
      spO2: 96,
      temperature: 36.8,
      painScale: 6
    },
    chronicConditions: ['Oral contraceptive pill use for 3 years'],
    currentMedications: ['Ethinyl estradiol / levonorgestrel'],
    urgencyLevel: 'HIGH_URGENCY',
    urgencyScore: 84,
    clinicalRationale: 'High clinical pre-test probability for Deep Vein Thrombosis (Wells score >= 2) with high risk of progression to Pulmonary Embolism given recent long-haul immobility and estrogen therapy. Cannot defer beyond today.',
    recommendedTimeframe: 'SAME DAY (< 2 hours)',
    suggestedDepartment: 'Urgent Care / Vascular Ultrasound / Emergency Dept',
    preVisitRecommendations: [
      'Comprehensive duplex ultrasound of right lower extremity',
      'D-dimer quantitative assay and baseline CBC / BMP / Coags',
      'Evaluate for CT Pulmonary Angiogram if dyspnea or hypoxia worsens'
    ],
    status: 'WAITING'
  },
  {
    id: 'triage-003',
    patientName: 'Liam O’Connor',
    age: 7,
    gender: 'M',
    mrn: '901-77-512',
    intakeTime: '35 mins ago',
    chiefComplaint: 'Barking cough, inspiratory stridor at rest, intercostal retractions',
    symptoms: ['Stridor heard without stethoscope', 'Seal-like barking cough', 'Intercostal and suprasternal retractions', 'Fever 38.6°C'],
    vitals: {
      bloodPressure: '98/60',
      heartRate: 142,
      respiratoryRate: 36,
      spO2: 93,
      temperature: 38.6,
      painScale: 5
    },
    chronicConditions: ['Mild eczema'],
    currentMedications: ['Acetaminophen as needed'],
    urgencyLevel: 'HIGH_URGENCY',
    urgencyScore: 91,
    clinicalRationale: 'Pediatric upper airway compromise with resting stridor and retractions (Westley Croup Score 6-7, Moderate-to-Severe). Rapid decompensation risk requires immediate nebulized epinephrine and systemic corticosteroid evaluation.',
    recommendedTimeframe: 'STAT (< 15 minutes)',
    suggestedDepartment: 'Pediatric Emergency Department',
    preVisitRecommendations: [
      'Keep child calm on caregiver lap; avoid distressing procedures',
      'Administer humidified blow-by oxygen as tolerated',
      'Prepare single-dose oral or IM Dexamethasone (0.6 mg/kg)',
      'Prepare nebulized racemic epinephrine (0.5 mL of 2.25%)'
    ],
    status: 'WAITING'
  },
  {
    id: 'triage-004',
    patientName: 'Carmen Morales',
    age: 49,
    gender: 'F',
    mrn: '551-09-382',
    intakeTime: '1 hour ago',
    chiefComplaint: 'High fever, shaking chills, right flank pain and vomiting for 24h',
    symptoms: ['Fever 38.9°C', 'Severe right costovertebral angle tenderness', 'Dysuria and urinary urgency', 'Inability to tolerate oral fluids'],
    vitals: {
      bloodPressure: '106/68',
      heartRate: 108,
      respiratoryRate: 20,
      spO2: 98,
      temperature: 38.9,
      painScale: 7
    },
    chronicConditions: ['Recurrent uncomplicated cystitis'],
    currentMedications: ['None active'],
    urgencyLevel: 'SEMI_URGENT',
    urgencyScore: 76,
    clinicalRationale: 'Clinical presentation diagnostic of acute pyelonephritis with systemic toxicity and intractable vomiting precluding outpatient oral therapy. Risk of urosepsis without IV fluid and broad-spectrum parenteral antimicrobials.',
    recommendedTimeframe: 'WITHIN 4 HOURS',
    suggestedDepartment: 'Urgent Care / Acute Medical Observation',
    preVisitRecommendations: [
      'Urinalysis with microscopic examination and urine culture with sensitivity',
      'Blood cultures x2 before antibiotics',
      'IV fluid hydration with normal saline',
      'Renal ultrasound if no response in 24-48h to rule out nephrolithiasis / abscess'
    ],
    status: 'WAITING'
  },
  {
    id: 'triage-005',
    patientName: 'Arthur Pendelton',
    age: 72,
    gender: 'M',
    mrn: '320-81-645',
    intakeTime: '1.5 hours ago',
    chiefComplaint: 'Post-op Day 6 laparoscopic hernia repair with spreading incision erythema',
    symptoms: ['Warmth and erythema extending 4 cm beyond trocar incision', 'Purulent serosanguinous discharge', 'Low-grade fever 37.9°C'],
    vitals: {
      bloodPressure: '138/84',
      heartRate: 82,
      respiratoryRate: 16,
      spO2: 97,
      temperature: 37.9,
      painScale: 4
    },
    chronicConditions: ['Benign Prostatic Hyperplasia', 'Dyslipidemia'],
    currentMedications: ['Tamsulosin 0.4mg', 'Atorvastatin 20mg'],
    urgencyLevel: 'SEMI_URGENT',
    urgencyScore: 68,
    clinicalRationale: 'Surgical site infection (SSI) requiring wound exploration, suture removal / drainage if indicated, and targeted antimicrobial initiation to prevent deep fascial involvement.',
    recommendedTimeframe: 'SAME DAY (< 6 hours)',
    suggestedDepartment: 'General Surgery Outpatient Clinic / Urgent Care',
    preVisitRecommendations: [
      'Wound swab culture and sensitivity prior to antibiotic start',
      'Examine wound depth and palpate for underlying fascial dehiscence',
      'Mark erythema borders with surgical pen to track progression'
    ],
    status: 'WAITING'
  },
  {
    id: 'triage-006',
    patientName: 'Elena Rostova',
    age: 28,
    gender: 'F',
    mrn: '839-44-112',
    intakeTime: '2 hours ago',
    chiefComplaint: 'Throbbing right-sided headache with nausea for 3 days, photophobia',
    symptoms: ['Right hemicranial pulsating pain 6/10', 'Nausea without vomiting', 'Sensitivity to light and sound', 'Visual scintillating scotoma 3 days ago'],
    vitals: {
      bloodPressure: '118/74',
      heartRate: 70,
      respiratoryRate: 14,
      spO2: 99,
      temperature: 36.6,
      painScale: 6
    },
    chronicConditions: ['Known episodic migraine with aura since age 19'],
    currentMedications: ['Sumatriptan 50mg PRN (ineffective this episode)'],
    urgencyLevel: 'ROUTINE_PRIORITY',
    urgencyScore: 42,
    clinicalRationale: 'Typical migraine recurrence with aura in known migraineur with normal vitals and no red flags (no sudden thunderclap onset, no focal neurological deficits, no fever). Candidate for abortive rescue therapy.',
    recommendedTimeframe: '24 - 48 HOURS',
    suggestedDepartment: 'Outpatient Neurology / Primary Care Clinic',
    preVisitRecommendations: [
      'Document neurological screening exam',
      'Consider alternative abortive regimen (e.g., CGRP antagonist or dopamine antagonist + NSAID combo)'
    ],
    status: 'WAITING'
  },
  {
    id: 'triage-007',
    patientName: 'Robert Vance',
    age: 58,
    gender: 'M',
    mrn: '228-56-781',
    intakeTime: '3 hours ago',
    chiefComplaint: 'Routine 6-month diabetic follow-up & blood pressure checkup',
    symptoms: ['No acute symptoms', 'Feeling well', 'Requests lab slip for upcoming annual blood work'],
    vitals: {
      bloodPressure: '128/82',
      heartRate: 72,
      respiratoryRate: 14,
      spO2: 98,
      temperature: 36.7,
      painScale: 0
    },
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Hypercholesterolemia'],
    currentMedications: ['Metformin 500mg BID', 'Simvastatin 20mg'],
    urgencyLevel: 'ROUTINE_FOLLOWUP',
    urgencyScore: 18,
    clinicalRationale: 'Clinically stable chronic maintenance review. No acute signs or physiological instability. Optimal for standard scheduled outpatient calendar.',
    recommendedTimeframe: '2 - 4 WEEKS',
    suggestedDepartment: 'Internal Medicine / Family Medicine',
    preVisitRecommendations: [
      'Order fasting lipid panel, HbA1c, and urine albumin-to-creatinine ratio (UACR)',
      'Schedule annual diabetic retinal foot and eye examinations'
    ],
    status: 'WAITING'
  },
  {
    id: 'triage-008',
    patientName: 'Hannah Abbott',
    age: 41,
    gender: 'F',
    mrn: '772-91-003',
    intakeTime: '4 hours ago',
    chiefComplaint: 'Prescription renewal for stable seasonal allergic rhinitis',
    symptoms: ['Mild nasal congestion and sneezing in spring', 'No fever, wheezing, or facial pressure'],
    vitals: {
      bloodPressure: '116/72',
      heartRate: 68,
      respiratoryRate: 12,
      spO2: 99,
      temperature: 36.5,
      painScale: 0
    },
    chronicConditions: ['Allergic rhinitis'],
    currentMedications: ['Fluticasone propionate nasal spray', 'Cetirizine 10mg'],
    urgencyLevel: 'TELEHEALTH',
    urgencyScore: 10,
    clinicalRationale: 'Asymptomatic medication refill for chronic stable condition without contraindications or required physical exam. Ideal candidate for asynchronous or telehealth consultation.',
    recommendedTimeframe: 'TELEHEALTH / 1 - 2 WEEKS',
    suggestedDepartment: 'Telehealth / Virtual Primary Care',
    preVisitRecommendations: [
      'Electronic medication reconciliation and 12-month refill authorization'
    ],
    status: 'WAITING'
  }
];

export const SAMPLE_LONGITUDINAL_PATIENTS: LongitudinalPatient[] = [
  {
    id: 'pt-sofia-longitudinal',
    name: 'Sofia Rodriguez',
    mrn: '592-18-402',
    age: 62,
    gender: 'F',
    primaryDiagnosis: 'Type 2 Diabetes Mellitus with Diabetic Nephropathy',
    chronicConditions: ['Type 2 Diabetes (14 yrs)', 'Hypertension', 'CKD Stage 3a', 'Diabetic Non-Proliferative Retinopathy', 'Obesity Class I (BMI 31.8)'],
    allergies: ['Penicillin (Hives)', 'Sulfa Drugs (Rash)'],
    activeMedications: [
      { drugName: 'Metformin', dosage: '1000 mg', frequency: 'BID', route: 'PO', status: 'ACTIVE', warnings: 'Must re-evaluate as eGFR approaches 45 mL/min' },
      { drugName: 'Lisinopril', dosage: '20 mg', frequency: 'Daily', route: 'PO', status: 'ACTIVE', warnings: 'Renoprotective ACE-i; monitor K+ and Creatinine' },
      { drugName: 'Glipizide', dosage: '10 mg', frequency: 'Daily before breakfast', route: 'PO', status: 'ACTIVE', warnings: 'Increased hypoglycemia risk as kidney clearance declines' },
      { drugName: 'Atorvastatin', dosage: '40 mg', frequency: 'Daily at bedtime', route: 'PO', status: 'ACTIVE' },
      { drugName: 'Ibuprofen', dosage: '600 mg', frequency: 'TID as needed for knee pain', route: 'PO', status: 'ACTIVE', warnings: 'CRITICAL ALERT: Frequent NSAID in CKD accelerates renal loss' }
    ],
    pastVisits: [
      {
        visitDate: '2024-03-10',
        reason: 'Routine Endocrinology Follow-up',
        physician: 'Dr. Katherine Wells, MD',
        vitals: { bp: '132/84', weightKg: 84.5, bmi: 31.4 },
        keyLabs: { HbA1c: 7.2, eGFR: 72, Creatinine: 1.05, UACR: 45 },
        clinicalNotesSummary: 'Glycemic control fair. Mild microalbuminuria noted. Continues metformin and lisinopril.'
      },
      {
        visitDate: '2025-01-15',
        reason: 'Semi-annual Metabolic Review',
        physician: 'Dr. Katherine Wells, MD',
        vitals: { bp: '138/88', weightKg: 85.8, bmi: 31.9 },
        keyLabs: { HbA1c: 8.1, eGFR: 61, Creatinine: 1.22, UACR: 120 },
        clinicalNotesSummary: 'Upward trend in HbA1c. Glipizide added. Moderate worsening of microalbuminuria.'
      },
      {
        visitDate: '2025-10-04',
        reason: 'Diabetic Assessment & Bilateral Knee Pain',
        physician: 'Dr. Robert Miller, MD',
        vitals: { bp: '144/90', weightKg: 86.2, bmi: 32.1 },
        keyLabs: { HbA1c: 8.9, eGFR: 52, Creatinine: 1.38, UACR: 240 },
        clinicalNotesSummary: 'Suboptimal blood pressure control. Patient reports taking over-the-counter high-dose ibuprofen for degenerative knee pain.'
      },
      {
        visitDate: '2026-08-20',
        reason: 'Urgent Clinic Visit: Fatigue and Swelling',
        physician: 'Dr. Katherine Wells, MD',
        vitals: { bp: '152/94', weightKg: 87.5, bmi: 32.6 },
        keyLabs: { HbA1c: 9.6, eGFR: 42, Creatinine: 1.64, UACR: 385 },
        clinicalNotesSummary: 'Significant deterioration in renal filtration rate. Substantial progression to macroalbuminuria. Sulfonylurea dose adjustment indicated.'
      }
    ],
    labTrends: [
      {
        testName: 'Hemoglobin A1c',
        unit: '%',
        normalMin: 4.0,
        normalMax: 5.7,
        dataPoints: [
          { date: '2024-03-10', value: 7.2 },
          { date: '2025-01-15', value: 8.1 },
          { date: '2025-10-04', value: 8.9 },
          { date: '2026-08-20', value: 9.6 }
        ]
      },
      {
        testName: 'eGFR (Kidney Filtration)',
        unit: 'mL/min/1.73m²',
        normalMin: 60,
        normalMax: 120,
        dataPoints: [
          { date: '2024-03-10', value: 72 },
          { date: '2025-01-15', value: 61 },
          { date: '2025-10-04', value: 52 },
          { date: '2026-08-20', value: 42 }
        ]
      },
      {
        testName: 'Serum Creatinine',
        unit: 'mg/dL',
        normalMin: 0.5,
        normalMax: 1.1,
        dataPoints: [
          { date: '2024-03-10', value: 1.05 },
          { date: '2025-01-15', value: 1.22 },
          { date: '2025-10-04', value: 1.38 },
          { date: '2026-08-20', value: 1.64 }
        ]
      },
      {
        testName: 'Urine Albumin-to-Creatinine Ratio (UACR)',
        unit: 'mg/g',
        normalMin: 0,
        normalMax: 30,
        dataPoints: [
          { date: '2024-03-10', value: 45 },
          { date: '2025-01-15', value: 120 },
          { date: '2025-10-04', value: 240 },
          { date: '2026-08-20', value: 385 }
        ]
      }
    ],
    careGaps: [
      {
        gap: 'Annual Dilated Diabetic Retinopathy Eye Exam Overdue',
        urgency: 'HIGH',
        dueSince: '8 months overdue (Last: Nov 2024)',
        guidelineReference: 'ADA Standards of Care 2026: Annual comprehensive dilated eye examination for all T2DM patients'
      },
      {
        gap: 'Metformin Renal Safety Dose Modification Unaddressed',
        urgency: 'HIGH',
        dueSince: 'Immediate (eGFR dropped to 42 mL/min)',
        guidelineReference: 'FDA Safety Alert: Max 1000 mg total daily dose when eGFR 30-45; stop if eGFR < 30'
      },
      {
        gap: 'Organ-protective SGLT2 Inhibitor / GLP-1 RA Indication Not Initiated',
        urgency: 'MEDIUM',
        dueSince: '6 months overdue',
        guidelineReference: 'KDIGO 2025 / ADA: SGLT2i recommended for T2D + CKD (eGFR >= 20, UACR > 200) to halt renal decline'
      },
      {
        gap: 'Comprehensive Diabetic Foot Monofilament Exam',
        urgency: 'LOW',
        dueSince: 'Due this month',
        guidelineReference: 'ADA Annual Diabetic Neuropathy Screening'
      }
    ],
    polypharmacyAlerts: [
      {
        severity: 'HIGH',
        interaction: 'High-dose regular NSAID (Ibuprofen 600mg TID) combined with ACE inhibitor (Lisinopril) in worsening CKD Stage 3b',
        drugsInvolved: ['Ibuprofen', 'Lisinopril'],
        clinicalAction: 'Discontinue Ibuprofen immediately. The triple-whammy hemodynamic insult (afferent arteriole constriction from NSAID + efferent dilation from ACEi) accelerates nephron loss and precipitates acute renal failure. Transition to topical capsaicin, acetaminophen, or physical therapy.'
      },
      {
        severity: 'MODERATE',
        interaction: 'Sulfonylurea (Glipizide) accumulation with deteriorating renal clearance',
        drugsInvolved: ['Glipizide', 'Declining eGFR (42)'],
        clinicalAction: 'Reduce Glipizide dose or deprescribe to avoid severe protracted hypoglycemia. Consider starting SGLT2 inhibitor (e.g. Empagliflozin 10mg) with cardio-renal protective profile.'
      }
    ],
    aiTrajectorySummary: 'CRITICAL CLINICAL TRAJECTORY: Patient demonstrates rapid, progressive decline in renal filtration function (eGFR down 41% from 72 to 42 mL/min over 29 months) accompanied by acceleration into overt macroalbuminuria (UACR 385 mg/g). Glycemic control has deteriorated significantly (HbA1c 7.2% -> 9.6%). Concomitant chronic high-dose NSAID ingestion presents an immediate treatable insult to renal hemodynamics. Urgent clinical intervention required to adjust oral hypoglycemics, stop NSAID, optimize blood pressure to < 130/80 mmHg, and initiate renal protective SGLT2i therapy.'
  }
];

export interface SampleMedicalImage {
  id: string;
  name: string;
  modality: 'CHEST_XRAY' | 'DERMATOLOGY' | 'CT_SCAN';
  clinicalContext: string;
  imageUrl: string; // High-detail medical SVG / Data URL
  defaultAnalysis: MedicalImageAnalysis;
}

// Generate realistic medical images (Chest X-Rays and Dermatology) with SVG data URLs
const createChestXRayPneumoniaSvg = (): string => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
  <defs>
    <radialGradient id="lungGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#14171d"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>
    <filter id="blurFilter">
      <feGaussianBlur stdDeviation="3" />
    </filter>
    <filter id="denseConsolidation">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0.8  0 1 0 0 0.8  0 0 1 0 0.8  0 0 0 1 0" />
      <feComposite in="SourceGraphic" in2="noise" operator="in" />
    </filter>
  </defs>

  <!-- Background Radiograph Frame -->
  <rect width="600" height="700" fill="#040608"/>
  <rect x="20" y="20" width="560" height="660" rx="8" fill="url(#lungGlow)" stroke="#1e293b" stroke-width="2"/>

  <!-- DICOM Metadata Overlays -->
  <text x="35" y="45" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold">ST. JUDE RADIOLOGY PACS</text>
  <text x="35" y="62" fill="#64748b" font-family="monospace" font-size="11">CXR CHEST AP PORTABLE</text>
  <text x="35" y="78" fill="#64748b" font-family="monospace" font-size="11">DOB: 1972-04-19 | M | 54Y</text>
  <text x="510" y="45" fill="#f59e0b" font-family="monospace" font-size="14" font-weight="bold">R (RIGHT)</text>
  <text x="500" y="650" fill="#64748b" font-family="monospace" font-size="11">kVp: 110 | mAs: 3.2</text>

  <!-- Cervical Spine & Clavicles -->
  <path d="M 285,50 L 315,50 L 315,130 L 285,130 Z" fill="#d1d5db" opacity="0.45" filter="url(#blurFilter)"/>
  <!-- Right Clavicle -->
  <path d="M 120,110 Q 210,130 285,120 Q 210,140 120,110" fill="#e2e8f0" opacity="0.6"/>
  <!-- Left Clavicle -->
  <path d="M 480,110 Q 390,130 315,120 Q 390,140 480,110" fill="#e2e8f0" opacity="0.6"/>

  <!-- Thoracic Rib Cage -->
  <g stroke="#cbd5e1" stroke-width="7" opacity="0.28" fill="none" stroke-linecap="round">
    <path d="M 290,140 Q 180,150 140,210" />
    <path d="M 310,140 Q 420,150 460,210" />
    <path d="M 290,180 Q 170,210 130,280" />
    <path d="M 310,180 Q 430,210 470,280" />
    <path d="M 290,230 Q 160,270 125,350" />
    <path d="M 310,230 Q 440,270 475,350" />
    <path d="M 290,290 Q 155,340 120,430" />
    <path d="M 310,290 Q 445,340 480,430" />
    <path d="M 290,350 Q 150,410 125,500" />
    <path d="M 310,350 Q 450,410 475,500" />
  </g>

  <!-- Mediastinum & Cardiac Silhouette -->
  <!-- Trachea (radiolucent air column) -->
  <rect x="294" y="60" width="12" height="90" rx="3" fill="#090d14"/>
  <!-- Cardiac Shadow (Apex oriented toward left) -->
  <path d="M 290,220 C 310,260 380,340 375,440 C 370,490 280,510 240,490 C 220,470 230,380 250,280 Z" fill="#e2e8f0" opacity="0.55" filter="url(#blurFilter)"/>
  <text x="310" y="380" fill="#475569" font-family="monospace" font-size="11" opacity="0.5">CARDIAC SILHOUETTE</text>

  <!-- Left Lung Field (Clearer aerated parenchyma) -->
  <path d="M 320,150 C 420,160 480,240 470,480 C 430,510 380,500 375,470 C 360,350 330,250 320,150 Z" fill="#080c14" opacity="0.75"/>
  <ellipse cx="410" cy="320" rx="45" ry="90" fill="#000000" opacity="0.5" filter="url(#blurFilter)"/>

  <!-- Right Lung Field with CONSOLIDATION & AIR BRONCHOGRAMS -->
  <path d="M 280,150 C 180,160 120,240 130,480 C 170,510 230,500 240,470 C 250,350 270,250 280,150 Z" fill="#080c14" opacity="0.4"/>
  
  <!-- Right Lower/Middle Lobe Infiltrate Opacity (Pneumonia finding) -->
  <ellipse cx="185" cy="420" rx="65" ry="75" fill="#f1f5f9" opacity="0.72" filter="url(#blurFilter)"/>
  <ellipse cx="205" cy="380" rx="45" ry="50" fill="#e2e8f0" opacity="0.65" filter="url(#blurFilter)"/>
  
  <!-- Air Bronchograms (dark branching air within dense consolidation) -->
  <path d="M 190,360 L 180,410 L 165,445" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M 180,410 L 195,435" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>

  <!-- Right Costophrenic Angle Blunting (Pleural Effusion) -->
  <path d="M 125,480 Q 150,495 180,505 L 140,515 Z" fill="#e2e8f0" opacity="0.7" filter="url(#blurFilter)"/>

  <!-- Diaphragm domes -->
  <path d="M 120,520 Q 200,480 270,500" stroke="#f8fafc" stroke-width="8" opacity="0.7" fill="none" filter="url(#blurFilter)"/>
  <path d="M 330,500 Q 420,490 485,530" stroke="#f8fafc" stroke-width="8" opacity="0.7" fill="none" filter="url(#blurFilter)"/>
  
  <!-- Calibration Marker Scale -->
  <line x1="50" y1="200" x2="50" y2="400" stroke="#94a3b8" stroke-width="2"/>
  <line x1="45" y1="200" x2="55" y2="200" stroke="#94a3b8" stroke-width="2"/>
  <line x1="45" y1="300" x2="55" y2="300" stroke="#94a3b8" stroke-width="2"/>
  <line x1="45" y1="400" x2="55" y2="400" stroke="#94a3b8" stroke-width="2"/>
  <text x="35" y="305" fill="#94a3b8" font-family="monospace" font-size="9" transform="rotate(-90 35,305)">10 cm</text>
</svg>
`);
};

const createChestXRayCardiomegalySvg = (): string => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
  <defs>
    <radialGradient id="lungGlow2" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#14171d"/>
      <stop offset="100%" stop-color="#05070a"/>
    </radialGradient>
    <filter id="blurFilter2">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>

  <rect width="600" height="700" fill="#040608"/>
  <rect x="20" y="20" width="560" height="660" rx="8" fill="url(#lungGlow2)" stroke="#1e293b" stroke-width="2"/>

  <!-- DICOM Header -->
  <text x="35" y="45" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold">METRO HEART & VASCULAR</text>
  <text x="35" y="62" fill="#64748b" font-family="monospace" font-size="11">CXR CHEST PA ERECT</text>
  <text x="35" y="78" fill="#64748b" font-family="monospace" font-size="11">DOB: 1958-03-12 | F | 68Y</text>
  <text x="510" y="45" fill="#f59e0b" font-family="monospace" font-size="14" font-weight="bold">R</text>

  <!-- Clavicles & Spine -->
  <path d="M 285,50 L 315,50 L 315,130 L 285,130 Z" fill="#d1d5db" opacity="0.45" filter="url(#blurFilter2)"/>
  <path d="M 120,115 Q 210,135 285,125 Q 210,145 120,115" fill="#e2e8f0" opacity="0.6"/>
  <path d="M 480,115 Q 390,135 315,125 Q 390,145 480,115" fill="#e2e8f0" opacity="0.6"/>

  <!-- Prominent Sternal Wire Sutures (s/p CABG) -->
  <g stroke="#ffffff" stroke-width="3" fill="none" opacity="0.95">
    <circle cx="300" cy="180" r="5" stroke-dasharray="3,1"/>
    <circle cx="300" cy="220" r="5" stroke-dasharray="3,1"/>
    <circle cx="300" cy="260" r="5" stroke-dasharray="3,1"/>
    <circle cx="300" cy="300" r="5" stroke-dasharray="3,1"/>
    <circle cx="300" cy="340" r="5" stroke-dasharray="3,1"/>
  </g>

  <!-- Marked Cardiomegaly Silhouette (CTR > 0.58) -->
  <path d="M 280,220 C 320,250 430,330 420,460 C 410,510 240,520 180,480 C 160,430 200,320 250,260 Z" fill="#f1f5f9" opacity="0.68" filter="url(#blurFilter2)"/>

  <!-- Pulmonary Vascular Cephalization (Engorged Upper Lobe Vessels) -->
  <g stroke="#cbd5e1" stroke-width="3" opacity="0.6" stroke-linecap="round">
    <path d="M 270,220 Q 220,180 180,170" />
    <path d="M 330,220 Q 380,180 420,170" />
    <path d="M 270,240 Q 210,210 170,205" />
    <path d="M 330,240 Q 390,210 430,205" />
  </g>

  <!-- Kerley B Lines (Interlobular septal edema at lateral bases) -->
  <g stroke="#e2e8f0" stroke-width="1.5" opacity="0.75">
    <line x1="125" y1="450" x2="145" y2="450" />
    <line x1="122" y1="460" x2="142" y2="460" />
    <line x1="124" y1="470" x2="146" y2="470" />
    <line x1="470" y1="450" x2="490" y2="450" />
    <line x1="472" y1="460" x2="492" y2="460" />
  </g>

  <!-- Cardiothoracic Ratio Measurement Guide -->
  <line x1="180" y1="470" x2="420" y2="470" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="260" y="465" fill="#38bdf8" font-family="monospace" font-size="10">Cardiac: 240mm</text>
  <line x1="120" y1="520" x2="480" y2="520" stroke="#a855f7" stroke-width="2" stroke-dasharray="4,2"/>
  <text x="260" y="535" fill="#a855f7" font-family="monospace" font-size="10">Thoracic: 360mm (CTR 0.67)</text>
</svg>
`);
};

const createDermatologyLesionSvg = (): string => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <radialGradient id="skinBase" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#edd5be"/>
      <stop offset="60%" stop-color="#deb89b"/>
      <stop offset="100%" stop-color="#cda080"/>
    </radialGradient>
    <filter id="skinTexture">
      <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="0.1 0 0 0 0  0 0.1 0 0 0  0 0 0.1 0 0  0 0 0 0.12 0" />
      <feComposite in2="SourceAlpha" operator="in" />
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#skinBase)"/>
  <rect width="600" height="600" filter="url(#skinTexture)"/>

  <!-- Dermatoscope Ring Light Reticle (Millimeter Grid) -->
  <circle cx="300" cy="300" r="260" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.4"/>
  <circle cx="300" cy="300" r="200" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="4,4" opacity="0.3"/>
  <circle cx="300" cy="300" r="100" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="4,4" opacity="0.3"/>
  
  <!-- Dermatoscope Millimeter Scale Bar -->
  <line x1="50" y1="550" x2="250" y2="550" stroke="#0f172a" stroke-width="3"/>
  <line x1="50" y1="540" x2="50" y2="560" stroke="#0f172a" stroke-width="2"/>
  <line x1="150" y1="545" x2="150" y2="555" stroke="#0f172a" stroke-width="2"/>
  <line x1="250" y1="540" x2="250" y2="560" stroke="#0f172a" stroke-width="2"/>
  <text x="135" y="575" fill="#0f172a" font-family="sans-serif" font-size="12" font-weight="bold">10 mm</text>

  <!-- Pigmented Skin Lesion (Asymmetric, Irregular Border, Color Variation) -->
  <!-- Base Melanocytic Plaque -->
  <path d="M 240,210 C 310,180 390,200 410,250 C 440,310 400,380 370,410 C 310,450 220,430 190,370 C 170,330 190,240 240,210 Z" fill="#693922" opacity="0.85"/>

  <!-- Dark Hyperpigmented Central Region -->
  <path d="M 260,240 C 320,230 360,260 370,300 C 380,350 330,380 290,390 C 240,370 230,300 260,240 Z" fill="#2b140b"/>

  <!-- Blue-White Veil Pattern (Dermoscopic Flag) -->
  <ellipse cx="295" cy="310" rx="35" ry="25" fill="#8ba0b8" opacity="0.45"/>

  <!-- Peripheral Pigment Network & Atypical Pseudopods / Projections -->
  <path d="M 405,245 Q 435,235 440,255 Q 425,270 412,265" fill="#4a2213"/>
  <path d="M 370,405 Q 390,435 375,445 Q 355,430 365,410" fill="#4a2213"/>
  <path d="M 190,360 Q 165,375 160,355 Q 175,340 188,350" fill="#4a2213"/>

  <!-- Erythematous Rim / Inflammation -->
  <path d="M 230,195 C 320,165 410,185 435,240 C 465,310 425,395 390,430 C 315,470 205,450 170,380 C 150,330 175,230 230,195 Z" fill="none" stroke="#dc2626" stroke-width="6" opacity="0.3"/>
</svg>
`);
};

export const SAMPLE_MEDICAL_IMAGES: SampleMedicalImage[] = [
  {
    id: 'img-pneumonia-cxr',
    name: 'Chest X-Ray AP: Right Middle/Lower Lobe Pneumonia',
    modality: 'CHEST_XRAY',
    clinicalContext: '54-year-old male with acute fever 39.2°C, leukocytosis (WBC 19.8k), hypoxemia (SpO2 88%), and right-sided pleuritic chest pain.',
    imageUrl: createChestXRayPneumoniaSvg(),
    defaultAnalysis: {
      modality: 'CHEST_XRAY',
      technicalQuality: 'ADEQUATE',
      primaryObservations: [
        'Prominent focal consolidation / airspace opacity in the right middle and lower lung fields',
        'Air bronchograms clearly visualized within the right-sided dense opacification',
        'Blunting of the right costophrenic sulcus suggestive of reactive parapneumonic pleural effusion',
        'Left lung parenchyma demonstrates normal aerated radiolucency without focal opacities',
        'Trachea is midline with normal caliber; no evidence of tension or pneumothorax'
      ],
      differentialConsiderations: [
        {
          condition: 'Community-Acquired Lobar Bacterial Pneumonia (e.g. Streptococcus pneumoniae, Legionella)',
          likelihood: 'HIGH',
          rationale: 'Dense lobar consolidation with air bronchograms matches classical bacterial alveolar consolidation.'
        },
        {
          condition: 'Complicated Parapneumonic Effusion / Early Empyema',
          likelihood: 'MODERATE',
          rationale: 'Right costophrenic angle blunting adjacent to lobar consolidation warrants diagnostic vigilance.'
        },
        {
          condition: 'Aspiration Pneumonitis',
          likelihood: 'LOW',
          rationale: 'Predilection for dependent lung segments, but acute clinical infection markers favor infectious etiology.'
        }
      ],
      anatomicalRegions: [
        { region: 'Right Lower/Middle Lobe', finding: 'Dense alveolar consolidation with air bronchograms', isAbnormal: true },
        { region: 'Right Costophrenic Angle', finding: 'Blunted angle consistent with pleural fluid', isAbnormal: true },
        { region: 'Left Hemithorax', finding: 'Clear lung field, sharp costophrenic angle', isAbnormal: false },
        { region: 'Cardiomediastinal Contour', finding: 'Normal size and configuration (CTR < 0.50)', isAbnormal: false },
        { region: 'Osseous Structures', finding: 'No acute fractures or destructive osseous lesions', isAbnormal: false }
      ],
      decisionSupportGuidance: [
        'Recommend clinical correlation with sputum microbiology and blood culture results',
        'Confirm adequate empiric antibiotic coverage against typical and atypical CAP pathogens (e.g., beta-lactam + macrolide/respiratory fluoroquinolone)',
        'Obtain bedside thoracic ultrasound to assess depth and septation of parapneumonic fluid if patient remains febrile at 48 hours',
        'Schedule interval follow-up radiograph in 6-8 weeks post-treatment to verify complete radiographic clearance and exclude underlying endobronchial lesion'
      ],
      roiBoundingBoxes: [
        {
          ymin: 450,
          xmin: 180,
          ymax: 740,
          xmax: 420,
          label: 'Alveolar Consolidation',
          description: 'Right middle and lower lobe airspace opacity with air bronchograms',
          severity: 'CRITICAL',
          confidence: '95%'
        },
        {
          ymin: 670,
          xmin: 190,
          ymax: 750,
          xmax: 300,
          label: 'Parapneumonic Effusion',
          description: 'Blunted right costophrenic sulcus with fluid layering',
          severity: 'WARNING',
          confidence: '82%'
        }
      ],
      urgencyLevel: 'STAT',
      disclaimer: 'DECISION SUPPORT RESEARCH ONLY. Image analysis algorithm is an assistive aid and does not constitute a definitive radiological diagnosis. Overread by a board-certified radiologist is mandatory.'
    }
  },
  {
    id: 'img-cardiomegaly-cxr',
    name: 'Chest X-Ray PA: Marked Cardiomegaly & Congestion',
    modality: 'CHEST_XRAY',
    clinicalContext: '68-year-old female with known ischemic cardiomyopathy, presenting with worsening orthopnea and bilateral pedal edema.',
    imageUrl: createChestXRayCardiomegalySvg(),
    defaultAnalysis: {
      modality: 'CHEST_XRAY',
      technicalQuality: 'ADEQUATE',
      primaryObservations: [
        'Significant cardiomegaly with cardiothoracic ratio (CTR) estimated at 0.67 (normal <= 0.50)',
        'Pulmonary venous congestion with upper lobe diversion (antler sign / cephalization)',
        'Presence of Kerley B lines at both lung bases indicative of interlobular septal edema',
        'Median sternotomy wire sutures in situ from remote coronary revascularization (CABG)',
        'Bilateral small pleural effusions with mild blunting of both costophrenic sulci'
      ],
      differentialConsiderations: [
        {
          condition: 'Congestive Heart Failure with Pulmonary Venous Hypertension',
          likelihood: 'HIGH',
          rationale: 'Classic triad of cardiomegaly (CTR 0.67), cephalization, and Kerley B lines.'
        },
        {
          condition: 'Pericardial Effusion',
          likelihood: 'MODERATE',
          rationale: 'Globular cardiac enlargement can mimic cardiomyopathy; requires echocardiographic confirmation.'
        }
      ],
      anatomicalRegions: [
        { region: 'Cardiac Silhouette', finding: 'Severe cardiomegaly (CTR 0.67) with left ventricular configuration', isAbnormal: true },
        { region: 'Pulmonary Vasculature', finding: 'Prominent cephalization and peri-hilar haze', isAbnormal: true },
        { region: 'Interstitial Compartment', finding: 'Kerley B lines at lateral pleural reflections', isAbnormal: true },
        { region: 'Sternal Hardware', finding: 'Intact median sternotomy wires without dehiscence', isAbnormal: false }
      ],
      decisionSupportGuidance: [
        'Correlate with serum NT-proBNP or BNP and current daily net fluid balance',
        'Review diuretic titration regimen (loop diuretic dosing and electrolyte panel)',
        'Perform transthoracic echocardiogram to reassess ejection fraction and exclude pericardial fluid'
      ],
      roiBoundingBoxes: [
        {
          ymin: 310,
          xmin: 250,
          ymax: 740,
          xmax: 710,
          label: 'Cardiomegaly (CTR 0.67)',
          description: 'Enlarged cardiac silhouette with apex extending into left hemithorax',
          severity: 'CRITICAL',
          confidence: '96%'
        },
        {
          ymin: 240,
          xmin: 280,
          ymax: 360,
          xmax: 720,
          label: 'Pulmonary Venous Cephalization',
          description: 'Engorgement of upper lobe pulmonary vessels',
          severity: 'WARNING',
          confidence: '88%'
        }
      ],
      urgencyLevel: 'PRIORITY',
      disclaimer: 'DECISION SUPPORT RESEARCH ONLY. Image analysis algorithm is an assistive aid and does not constitute a definitive radiological diagnosis. Overread by a board-certified radiologist is mandatory.'
    }
  },
  {
    id: 'img-derm-melanoma',
    name: 'Dermatoscope: Atypical Pigmented Skin Lesion',
    modality: 'DERMATOLOGY',
    clinicalContext: '46-year-old male with an evolving pigmented macule on upper back showing recent darkening and border alteration.',
    imageUrl: createDermatologyLesionSvg(),
    defaultAnalysis: {
      modality: 'DERMATOLOGY',
      technicalQuality: 'ADEQUATE',
      primaryObservations: [
        'Marked geometric asymmetry across perpendicular 90-degree axes',
        'Border irregularity with notched margins and focal pseudopod-like projections',
        'Polychromatic pigmentation with shades of dark brown, black, tan, and subtle blue-white veil',
        'Diameter measured against dermatoscope reticle at approximately 8.5 mm (exceeds 6 mm guideline)',
        'Peripheral atypical pigment network with abrupt termination at margins'
      ],
      differentialConsiderations: [
        {
          condition: 'Superficial Spreading Cutaneous Melanoma',
          likelihood: 'HIGH',
          rationale: 'Fulfills all ABCDE criteria (Asymmetry, Border irregularity, Color variegation, Diameter > 6mm, Evolution).'
        },
        {
          condition: 'Severely Dysplastic Melanocytic Nevus (Clark Nevus)',
          likelihood: 'CANNOT_EXCLUDE',
          rationale: 'Atypical dermoscopic network present; histopathological evaluation required for distinction.'
        },
        {
          condition: 'Pigmented Basal Cell Carcinoma',
          likelihood: 'LOW',
          rationale: 'Pigment network and pseudopods favor melanocytic origin rather than BCC arborizing vessels.'
        }
      ],
      anatomicalRegions: [
        { region: 'Lesion Symmetry', finding: 'Severe 2-axis asymmetry', isAbnormal: true },
        { region: 'Periphery & Borders', finding: 'Irregular scolloped borders with focal projections', isAbnormal: true },
        { region: 'Central Architecture', finding: 'Atypical dark brown-black blotch with central veil', isAbnormal: true },
        { region: 'Surrounding Skin', finding: 'Mild perifocal erythema, no satellite nodules', isAbnormal: false }
      ],
      decisionSupportGuidance: [
        'Urgent referral to Dermatology for full-body cutaneous examination and dermoscopic mapping',
        'Complete excisional biopsy with 1-2 mm narrow clinical margins recommended for histopathologic micro-staging (Breslow depth, ulceration)',
        'Avoid partial shave or punch biopsies through high-suspicion melanocytic lesions when possible'
      ],
      roiBoundingBoxes: [
        {
          ymin: 280,
          xmin: 270,
          ymax: 720,
          xmax: 710,
          label: 'Atypical Pigmented Lesion (8.5mm)',
          description: 'High ABCDE suspicion: Asymmetry, irregular border, blue-white veil',
          severity: 'CRITICAL',
          confidence: '92%'
        }
      ],
      urgencyLevel: 'PRIORITY',
      disclaimer: 'DECISION SUPPORT RESEARCH ONLY. Dermatoscopic analysis algorithm cannot replace histopathologic biopsy examination. Must be correlated by a qualified dermatologist.'
    }
  }
];
