import type { CertId } from './types'

export type ModulePhase = 'learn' | 'practice' | 'review' | 'exam-prep'

export interface StudyModule {
  id: string
  cert: CertId
  order: number
  phase: ModulePhase
  title: string
  subtitle: string
  /** Official exam domain id from syllabus.ts */
  syllabusDomain?: string
  examWeight: string
  /** Mini-lesson bullets (Coaching Actuaries "Learn" style) */
  concepts: string[]
  coachingTip: string
  problemIds: string[]
  /** Min % of problems attempted to mark module complete */
  completionThreshold: number
}

export const OFFICIAL_SAS_RESOURCES = {
  practiceExams: 'https://www.sas.com/en_us/certification/resources/sas-practice-exams.html',
  contentGuideBase:
    'https://www.sas.com/content/dam/SAS/documents/technical/certification/content-guide/specialist-base-programming.pdf',
  contentGuideClinical:
    'https://www.sas.com/en_us/certification/credentials/foundation-tools/clinical-trials-programming.html',
  contentGuideAdvanced:
    'https://www.sas.com/content/dam/sasdam/documents/20250124/advanced-programming-sas-94-exam-guide.pdf',
  sampleQuestions: 'https://learn.sas.com/course/view.php?id=7021',
  onDemand: 'https://www.sas.com/en_us/training/offers.html',
} as const

/** A00-231 — 4 official exam domains */
export const BASE_STUDY_PATH: StudyModule[] = [
  {
    id: 'base-m1',
    cert: 'base',
    order: 1,
    phase: 'learn',
    syllabusDomain: 'data-structures',
    title: 'Data Structures — Libraries & Access',
    subtitle: 'LIBNAME, CONTENTS, IMPORT, INFILE/INPUT (A00-231 §1)',
    examWeight: '20-25%',
    concepts: [
      'WORK vs permanent libraries (libref.)',
      'PROC CONTENTS for metadata',
      'PROC IMPORT / delimited files',
      'SAS dates from 01JAN1960',
    ],
    coachingTip: 'Domain 1 is ~25% of exam — know library + access before MERGE.',
    problemIds: ['eg-b-01', 'eg-b-02', 'eg-b-03', 'eg-b-18', 'ds-01', 'ds-02', 'ds-05', 'ds-07', 'ds-11', 'ex-ds-01', 'cc-b-01', 'cc-b-20'],
    completionThreshold: 70,
  },
  {
    id: 'base-m2',
    cert: 'base',
    order: 2,
    phase: 'practice',
    syllabusDomain: 'data-structures',
    title: 'Data Structures — SET & MERGE',
    subtitle: 'Concatenate, match-merge, BY, dates, subsetting (A00-231 §1)',
    examWeight: '20-25%',
    concepts: [
      'SET stacks vertically',
      'MERGE = full outer join on BY',
      'Sort before MERGE/BY',
      'WHERE / KEEP / DROP',
    ],
    coachingTip: 'MERGE non-matches stay — count the larger side, not matches only.',
    problemIds: [
      'eg-b-10', 'eg-b-14', 'ds-04', 'ds-06', 'ds-08', 'ds-09', 'ds-10', 'ex-ds-03',
      'trap-b-01', 'trap-b-06', 'mx-02', 'cc-b-02', 'cc-b-03', 'cc-b-16', 'cc-b-19', 'cc-b-21', 'cc-b-25', 'cc-b-33',
    ],
    completionThreshold: 75,
  },
  {
    id: 'base-m3',
    cert: 'base',
    order: 3,
    phase: 'practice',
    syllabusDomain: 'manage-data',
    title: 'Manage Data — Transform & Functions',
    subtitle: 'IF/ELSE, DO, functions, INPUT/PUT, TRANSPOSE (A00-231 §2)',
    examWeight: '35-40%',
    concepts: [
      'IF/WHERE and missing values',
      'SUM statement vs assignment',
      'Character & date functions',
      'DO loops and ARRAY',
      'PROC TRANSPOSE',
    ],
    coachingTip: 'Largest domain — functions + DO loops appear on almost every exam.',
    problemIds: [
      'eg-b-04', 'eg-b-05', 'eg-b-06', 'eg-b-09', 'eg-b-11', 'eg-b-16',
      'md-01', 'md-02', 'md-03', 'md-04', 'md-05', 'md-06', 'md-07', 'md-10', 'md-11', 'md-14',
      'trap-b-02', 'trap-b-03', 'trap-b-04', 'trap-b-05', 'mx-01', 'mx-05',
      'cc-b-04', 'cc-b-06', 'cc-b-17', 'cc-b-18', 'cc-b-22', 'cc-b-23', 'cc-b-26', 'cc-b-27', 'cc-b-34', 'cc-b-38',
    ],
    completionThreshold: 75,
  },
  {
    id: 'base-m4',
    cert: 'base',
    order: 4,
    phase: 'practice',
    syllabusDomain: 'manage-data',
    title: 'Manage Data — RETAIN & BY Groups',
    subtitle: 'SUM, RETAIN, FIRST./LAST., PROC SORT options (A00-231 §2)',
    examWeight: '35-40%',
    concepts: [
      'SUM statement implies RETAIN',
      'FIRST.var / LAST.var counters',
      'NODUPKEY vs NODUPREC',
      'Group totals with BY',
    ],
    coachingTip: 'LAST.row cumulative total on SUM — not the same as assignment.',
    problemIds: [
      'eg-b-12', 'eg-b-17', 'md-08', 'md-09', 'md-12', 'md-15', 'trap-b-04', 'trap-b-14',
      'rp-06', 'cc-b-05', 'cc-b-24', 'cc-b-31', 'cc-b-32',
    ],
    completionThreshold: 75,
  },
  {
    id: 'base-m5',
    cert: 'base',
    order: 5,
    phase: 'practice',
    syllabusDomain: 'error-handling',
    title: 'Error Handling',
    subtitle: 'Log messages, syntax vs logic, OBS=0, missing/invalid (A00-231 §3)',
    examWeight: '15-20%',
    concepts: [
      'ERROR vs WARNING vs NOTE',
      'Syntax errors (semicolons)',
      'OPTIONS OBS=0 syntax check',
      '_ERROR_ and invalid data',
      'MERGE without IN=',
    ],
    coachingTip: 'Read Log NOTE observation counts — always verify after ERROR.',
    problemIds: [
      'eg-b-15', 'eh-01', 'eh-02', 'eh-03', 'eh-04', 'eh-05', 'eh-06', 'eh-07', 'eh-08', 'eh-09', 'eh-10',
      'ex-eh-01', 'ex-eh-02', 'ex-eh-03', 'mx-03', 'trap-b-07', 'trap-b-08', 'cc-b-08',
    ],
    completionThreshold: 70,
  },
  {
    id: 'base-m6',
    cert: 'base',
    order: 6,
    phase: 'practice',
    syllabusDomain: 'reports',
    title: 'Reports & Output',
    subtitle: 'PRINT, FREQ, MEANS, REPORT, ODS, FORMAT (A00-231 §4)',
    examWeight: '15-20%',
    concepts: [
      'PROC FREQ / MEANS / PRINT output shape',
      'ODS HTML/PDF destinations',
      'PROC FORMAT and TITLE',
      'PROC SQL basics (SELECT, DISTINCT)',
      'PROC TABULATE CLASS vs VAR',
    ],
    coachingTip: 'PROC questions test output structure — rows vs summary table.',
    problemIds: [
      'eg-b-08', 'eg-b-13', 'rp-01', 'rp-02', 'rp-03', 'rp-04', 'rp-05', 'rp-07', 'rp-08', 'rp-09', 'rp-10', 'rp-11', 'rp-12',
      'trap-b-13', 'mx-04', 'cc-b-09', 'cc-b-10',
    ],
    completionThreshold: 70,
  },
  {
    id: 'base-m7',
    cert: 'base',
    order: 7,
    phase: 'review',
    title: 'Exam Traps Bootcamp',
    subtitle: 'High-miss patterns — drill until automatic',
    examWeight: 'Review',
    concepts: ['MERGE counts', 'Missing in IF', 'SUM vs =', 'Character padding'],
    coachingTip: 'Repeat this module until traps are instant.',
    problemIds: [
      'trap-b-01', 'trap-b-02', 'trap-b-04', 'trap-b-06', 'trap-b-11', 'trap-b-12',
      'prem-b-08', 'cc-b-16', 'cc-b-38', 'mx-05',
    ],
    completionThreshold: 80,
  },
  {
    id: 'base-m8',
    cert: 'base',
    order: 8,
    phase: 'practice',
    title: 'Performance-Based Code Lab',
    subtitle: 'Run code first — matches A00-231 lab format',
    examWeight: 'PBC',
    concepts: ['Run before answering', 'Log NOTE lines', 'PROC PRINT verify', 'Fix syntax first'],
    coachingTip: 'Lab section is weighted heavier on the real exam.',
    problemIds: [
      'cc-b-01', 'cc-b-03', 'cc-b-05', 'cc-b-08', 'cc-b-10', 'cc-b-11', 'cc-b-12',
      'cc-b-16', 'cc-b-23', 'cc-b-28', 'cc-b-30', 'cc-b-35', 'cc-b-37', 'cc-b-39',
    ],
    completionThreshold: 70,
  },
  {
    id: 'base-m9',
    cert: 'base',
    order: 9,
    phase: 'review',
    title: 'Premium Exam-Style Set',
    subtitle: 'Multi-step reasoning aligned to objectives',
    examWeight: 'Review',
    concepts: ['Pipeline DATA steps', 'MERGE + subset', 'PROC vs DATA step'],
    coachingTip: 'Timed practice — no hints, exam conditions.',
    problemIds: [
      'prem-b-01', 'prem-b-02', 'prem-b-03', 'prem-b-04', 'prem-b-06',
      'prem-b-08', 'prem-b-11', 'prem-b-12',
    ],
    completionThreshold: 75,
  },
  {
    id: 'base-m10',
    cert: 'base',
    order: 10,
    phase: 'exam-prep',
    title: 'Exam Ready — A00-231',
    subtitle: 'Practice exam + official SAS resources',
    examWeight: 'Final',
    concepts: [
      '40–45 questions, 135 min, passing 725',
      'Take official SAS practice exam at 80%+ readiness',
      'Review content guide for weak domains',
    ],
    coachingTip: 'Schedule real exam after 2+ passing practice exams here.',
    problemIds: [],
    completionThreshold: 100,
  },
]

export const CLINICAL_STUDY_PATH: StudyModule[] = [
  {
    id: 'clin-m1',
    cert: 'clinical',
    order: 1,
    phase: 'learn',
    syllabusDomain: 'clinical-process',
    title: 'Clinical Trials Process',
    subtitle: 'Phases, SAP, GCP, analysis populations (A00-282 · 5%)',
    examWeight: '5%',
    concepts: ['Phase I–IV purposes', 'SAP defines methods', 'CRF → SDTM flow', 'Analysis populations'],
    coachingTip: 'Process questions set context for programming decisions.',
    problemIds: ['eg-cl-08', 'cp-01', 'cp-02', 'ex-cl-07'],
    completionThreshold: 70,
  },
  {
    id: 'clin-m2',
    cert: 'clinical',
    order: 2,
    phase: 'learn',
    syllabusDomain: 'cdisc-structures',
    title: 'CDISC Data Structures',
    subtitle: 'SDTM domains, ADaM, USUBJID, traceability (A00-282 · 10%)',
    examWeight: '10%',
    concepts: ['USUBJID links domains', 'SDTM vs ADaM purpose', 'DM, AE, LB domains', 'AVAL is ADaM not SDTM'],
    coachingTip: 'Know which variables belong in SDTM vs ADaM before derivations.',
    problemIds: ['eg-cl-01', 'cd-01', 'cd-02', 'cd-03', 'cd-04', 'ex-cl-01', 'ex-cl-02', 'cc-cl-01', 'cc-cl-13', 'cc-cl-18'],
    completionThreshold: 70,
  },
  {
    id: 'clin-m3',
    cert: 'clinical',
    order: 3,
    phase: 'learn',
    syllabusDomain: 'regulatory',
    title: 'Regulatory & Data QC',
    subtitle: 'XPT, define.xml, DICTIONARY, missing vs zero (A00-282 · 10%)',
    examWeight: '10%',
    concepts: ['XPT transport format', 'define.xml metadata', 'dictionary.columns QC', 'Missing ≠ zero clinically'],
    coachingTip: 'Submission package = datasets + define.xml + validation.',
    problemIds: ['eg-cl-06', 'eg-cl-09', 'eg-cl-12', 'rg-01', 'rg-02', 'md-01', 'md-02', 'ex-cl-06', 'cc-cl-09'],
    completionThreshold: 70,
  },
  {
    id: 'clin-m4',
    cert: 'clinical',
    order: 4,
    phase: 'practice',
    syllabusDomain: 'transform-data',
    title: 'Transform & Derive',
    subtitle: 'Flags, CHG, windowing, ISO 8601, reshape (A00-282 · 15%)',
    examWeight: '15%',
    concepts: ['CHG = AVAL - BASE', 'Analysis visit windowing', 'ISO 8601 DTC strings', 'ARRAY/TRANSPOSE reshape'],
    coachingTip: 'Trace each flag rule from SAP line by line.',
    problemIds: [
      'eg-cl-02', 'eg-cl-03', 'eg-cl-05', 'eg-cl-07', 'tr-01', 'tr-02', 'tr-03', 'tr-04',
      'ex-cl-03', 'cc-cl-02', 'cc-cl-03', 'cc-cl-06', 'cc-cl-07', 'cc-cl-08', 'cc-cl-12', 'cc-cl-14', 'cc-cl-17',
    ],
    completionThreshold: 75,
  },
  {
    id: 'clin-m5',
    cert: 'clinical',
    order: 5,
    phase: 'practice',
    syllabusDomain: 'statistics',
    title: 'Statistical Procedures',
    subtitle: 'FREQ, TTEST, GLM, UNIVARIATE, OUTPUT datasets (A00-282 · 15%)',
    examWeight: '15%',
    concepts: ['FREQ for categorical', 'TTEST for two groups', 'GLM for ANOVA', 'OUTPUT OUT= datasets'],
    coachingTip: 'Match procedure to variable type — categorical vs continuous.',
    problemIds: ['st-01', 'st-02', 'st-03', 'st-04', 'ex-cl-04', 'cc-cl-10'],
    completionThreshold: 75,
  },
  {
    id: 'clin-m6',
    cert: 'clinical',
    order: 6,
    phase: 'practice',
    syllabusDomain: 'macro',
    title: 'Clinical Macro Programming',
    subtitle: '%EVAL vs %SYSEVALF, debugging, batch QC (A00-282 · 15%)',
    examWeight: '15%',
    concepts: ['Macro variables in batch jobs', 'SYMBOLGEN/MPRINT debug', '%SYSFUNC date functions', 'Parameterized derivations'],
    coachingTip: 'Turn on SYMBOLGEN when batch macros fail on study 2 of 3.',
    problemIds: ['eg-cl-11', 'mc-01', 'mc-02', 'mc-03', 'mc-04', 'ex-cl-05', 'cc-cl-11'],
    completionThreshold: 75,
  },
  {
    id: 'clin-m7',
    cert: 'clinical',
    order: 7,
    phase: 'practice',
    syllabusDomain: 'reporting',
    title: 'TLF Reporting',
    subtitle: 'PROC REPORT, SGPLOT, ODS for clinical tables (A00-282 · 10%)',
    examWeight: '10%',
    concepts: ['PROC REPORT for tables', 'SGPLOT/SGPANEL figures', 'ODS RTF/PDF', 'SAP shell alignment'],
    coachingTip: 'Table shells come from SAP — match population and labels exactly.',
    problemIds: ['eg-cl-10', 'rp-01', 'rp-02', 'rp-03', 'ex-cl-07', 'cc-cl-15'],
    completionThreshold: 70,
  },
  {
    id: 'clin-m8',
    cert: 'clinical',
    order: 8,
    phase: 'practice',
    syllabusDomain: 'validation',
    title: 'Programming Validation',
    subtitle: 'PROC COMPARE, independent QC, log review (A00-282 · 20%)',
    examWeight: '20%',
    concepts: ['Independent vs double programming', 'PROC COMPARE limits', 'Row-count reconciliation', 'Log validation'],
    coachingTip: 'Largest domain — validation is 20% of A00-282.',
    problemIds: [
      'eg-cl-04', 'vl-01', 'vl-02', 'vl-03', 'vl-04', 'ex-cl-08', 'ex-cl-09', 'ex-cl-10', 'ex-cl-11', 'ex-cl-12',
      'cc-cl-04', 'cc-cl-05', 'cc-cl-16',
    ],
    completionThreshold: 75,
  },
  {
    id: 'clin-m9',
    cert: 'clinical',
    order: 9,
    phase: 'exam-prep',
    title: 'Exam Ready — A00-282',
    subtitle: 'Practice exam + official resources',
    examWeight: 'Final',
    concepts: ['60–70 questions, 110 min, 68% pass', 'Requires Base or Advanced cert', 'Official practice exam'],
    coachingTip: 'Pace ~1.7 min/question. Validation domain is the heaviest.',
    problemIds: [],
    completionThreshold: 100,
  },
]

export const ADVANCED_STUDY_PATH: StudyModule[] = [
  {
    id: 'adv-m1',
    cert: 'advanced',
    order: 1,
    phase: 'practice',
    syllabusDomain: 'sql',
    title: 'PROC SQL',
    subtitle: 'JOINs, set operators, GROUP BY/HAVING, DICTIONARY (A00-232 · 35%)',
    examWeight: '35%',
    concepts: ['INNER/LEFT/FULL JOIN', 'UNION/EXCEPT/INTERSECT', 'HAVING vs WHERE', 'INTO :macrovar', 'CALCULATED'],
    coachingTip: 'SQL domain is 35% — JOIN row counts are high-value traps.',
    problemIds: [
      'eg-ad-01', 'eg-ad-02', 'eg-ad-04', 'eg-ad-07', 'eg-ad-08',
      'sq-01', 'sq-02', 'sq-03', 'sq-04', 'sq-05', 'sq-06', 'sq-07', 'sq-08', 'sq-09', 'sq-10',
      'ex-ad-01', 'ex-ad-02', 'ex-ad-03', 'ex-ad-09', 'ex-ad-12',
      'cc-ad-01', 'cc-ad-03', 'cc-ad-06', 'cc-ad-10', 'cc-ad-13', 'cc-ad-16',
    ],
    completionThreshold: 75,
  },
  {
    id: 'adv-m2',
    cert: 'advanced',
    order: 2,
    phase: 'practice',
    syllabusDomain: 'macro',
    title: 'Macro Processing',
    subtitle: '%MACRO, quoting, %SYSFUNC, debugging (A00-232 · 35%)',
    examWeight: '35%',
    concepts: ['& resolution order', '%NRSTR/%STR quoting', '%IF-%THEN/%DO', 'MLOGIC/MPRINT/SYMBOLGEN', 'SYMPUTX'],
    coachingTip: 'Trace &variable substitution before blaming DATA step logic.',
    problemIds: [
      'eg-ad-03', 'eg-ad-06', 'eg-ad-10',
      'mc-01', 'mc-02', 'mc-03', 'mc-04', 'mc-05', 'mc-06', 'mc-07', 'mc-08',
      'ex-ad-04', 'ex-ad-05', 'ex-ad-06', 'ex-ad-11',
      'cc-ad-04', 'cc-ad-05',
    ],
    completionThreshold: 75,
  },
  {
    id: 'adv-m3',
    cert: 'advanced',
    order: 3,
    phase: 'practice',
    syllabusDomain: 'advanced-techniques',
    title: 'Advanced Techniques',
    subtitle: 'Hash, arrays, indexes, FCMP concepts (A00-232 · 30%)',
    examWeight: '30%',
    concepts: ['Hash object lookup', '1D/2D ARRAY', 'PROC DATASETS', 'Index creation', 'Advanced functions'],
    coachingTip: 'Small lookup + large fact table → hash object pattern.',
    problemIds: [
      'eg-ad-05', 'eg-ad-09',
      'at-01', 'at-02', 'at-03', 'at-04', 'at-05', 'at-06', 'at-07', 'at-08',
      'ex-ad-07', 'ex-ad-08', 'ex-ad-10',
      'cc-ad-02', 'cc-ad-07', 'cc-ad-08', 'cc-ad-09', 'cc-ad-11', 'cc-ad-12', 'cc-ad-14', 'cc-ad-15', 'cc-ad-17',
    ],
    completionThreshold: 75,
  },
  {
    id: 'adv-m4',
    cert: 'advanced',
    order: 4,
    phase: 'exam-prep',
    title: 'Exam Ready — A00-232',
    subtitle: 'Performance projects + practice exam',
    examWeight: 'Final',
    concepts: ['10–15 coding projects + 10–15 standard Qs', '125 min, passing 725', 'Code evaluated by scoring macro'],
    coachingTip: 'Use required technique (SQL vs DATA step) as specified in each project.',
    problemIds: [],
    completionThreshold: 100,
  },
]

const PATHS: Record<CertId, StudyModule[]> = {
  base: BASE_STUDY_PATH,
  clinical: CLINICAL_STUDY_PATH,
  advanced: ADVANCED_STUDY_PATH,
}

export function getStudyPath(certId: CertId): StudyModule[] {
  return PATHS[certId]
}

export interface ModuleProgress {
  attempted: number
  total: number
  correct: number
  accuracy: number
  percentComplete: number
  isComplete: boolean
  isUnlocked: boolean
}

export function getModuleProgress(
  module: StudyModule,
  answered: Record<string, { correct: boolean; attempts: number }>,
  allModules: StudyModule[],
  moduleIndex: number
): ModuleProgress {
  const ids = module.problemIds.filter((id) => id.length > 0)
  const total = ids.length
  if (total === 0) {
    return {
      attempted: 0,
      total: 0,
      correct: 0,
      accuracy: 0,
      percentComplete: 0,
      isComplete: false,
      isUnlocked: moduleIndex === 0 || getModuleProgress(allModules[moduleIndex - 1], answered, allModules, moduleIndex - 1).isComplete,
    }
  }

  const attemptedIds = ids.filter((id) => answered[id])
  const correct = attemptedIds.filter((id) => answered[id]?.correct).length
  const attempted = attemptedIds.length
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
  const percentComplete = Math.round((attempted / total) * 100)

  const prevComplete =
    moduleIndex === 0 ||
    getModuleProgress(allModules[moduleIndex - 1], answered, allModules, moduleIndex - 1).isComplete

  const isComplete = percentComplete >= module.completionThreshold && accuracy >= 60

  return {
    attempted,
    total,
    correct,
    accuracy,
    percentComplete,
    isComplete,
    isUnlocked: prevComplete || moduleIndex === 0,
  }
}

export function getNextModule(
  certId: CertId,
  answered: Record<string, { correct: boolean; attempts: number }>
): { module: StudyModule; index: number } | null {
  const path = getStudyPath(certId)
  for (let i = 0; i < path.length; i++) {
    const mp = getModuleProgress(path[i], answered, path, i)
    if (mp.isUnlocked && !mp.isComplete && path[i].problemIds.length > 0) {
      return { module: path[i], index: i }
    }
  }
  return null
}

export function getCoachingTipForProblem(problemId: string, certId: CertId): string | undefined {
  for (const m of getStudyPath(certId)) {
    if (m.problemIds.includes(problemId)) return m.coachingTip
  }
  return undefined
}
