import type { CertData, TopicInfo } from './types'
import { CLINICAL_EXTRA } from './extra/clinical'
import { EXAM_GRADE_CLINICAL } from './extra/exam-grade-clinical'
import { CLINICAL_UPGRADES } from './upgrade/clinical-upgrades'
import { applyMcqUpgrades } from '../lib/mergeUpgrades'

export type ClinicalTopic =
  | 'clinical-process'
  | 'cdisc-structures'
  | 'regulatory'
  | 'manage-data'
  | 'transform-data'
  | 'statistics'
  | 'macro'
  | 'reporting'
  | 'validation'

export const TOPICS: Record<ClinicalTopic, TopicInfo> = {
  'clinical-process': { label: 'Clinical Trial Process', weight: '5%', color: '#6366f1' },
  'cdisc-structures': { label: 'CDISC Data Structures', weight: '10%', color: '#3b82f6' },
  regulatory: { label: 'Regulatory Submission', weight: '5%', color: '#8b5cf6' },
  'manage-data': { label: 'Clinical Data Management', weight: '5%', color: '#06b6d4' },
  'transform-data': { label: 'Data Transformation/Summarization', weight: '15%', color: '#10b981' },
  statistics: { label: 'Statistical Procedures', weight: '15%', color: '#f59e0b' },
  macro: { label: 'Macro Programming', weight: '15%', color: '#ef4444' },
  reporting: { label: 'Results Reporting', weight: '10%', color: '#ec4899' },
  validation: { label: 'Data Validation', weight: '20%', color: '#14b8a6' },
}

export const QUESTIONS = [
  {
    id: 'cp-01',
    topic: 'clinical-process',
    difficulty: 'easy' as const,
    question: 'What is the primary purpose of a Phase III clinical trial?',
    options: [
      'Initial safety evaluation in a small group of healthy volunteers',
      'Large-scale randomized controlled trial to confirm efficacy and safety',
      'Post-marketing safety surveillance',
      'Animal testing phase',
    ],
    correctIndex: 1,
    explanation:
      'Phase III uses large RCTs to confirm treatment efficacy and safety. Phase I assesses safety, Phase II explores efficacy, and Phase IV is post-marketing research.',
    explanationKo:
      'Phase III는 대규모 RCT로 치료 효과와 안전성을 확인합니다. Phase I은 안전성, Phase II는 유효성 탐색, Phase IV는 시판 후 연구입니다.',
    tags: ['clinical phases', 'GCP'],
  },
  {
    id: 'cp-02',
    topic: 'clinical-process',
    difficulty: 'medium' as const,
    question: 'Which statement correctly describes the role of a Statistical Analysis Plan (SAP)?',
    options: [
      'Designing raw data collection forms',
      'Pre-specifying statistical methods and analyses for primary/secondary endpoints',
      'Containing only SDTM mapping rules',
      'Listing FDA submission package contents',
    ],
    correctIndex: 1,
    explanation:
      'The SAP is a document that pre-defines statistical methods, endpoints, analysis populations, and more before trial analysis. Programmers use the SAP to generate ADaM datasets and TLFs.',
    explanationKo:
      'SAP는 시험 분석 전에 통계 방법, endpoint, 분석 population 등을 사전에 정의하는 문서입니다. 프로그래머는 SAP를 기반으로 ADaM/TLF를 생성합니다.',
    tags: ['SAP', 'clinical process'],
  },
  {
    id: 'cd-01',
    topic: 'cdisc-structures',
    difficulty: 'medium' as const,
    question: 'What is the primary purpose of SDTM (Standard Data Tabulation Model)?',
    options: [
      'Storing derived variables for analysis',
      'Providing a standardized tabulation data structure for regulatory submission',
      'Storing macro variables',
      'A data format used only for graphs',
    ],
    correctIndex: 1,
    explanation:
      'SDTM organizes CRF data into a standard regulatory structure (domains such as DM, AE, LB, etc.). ADaM is the analysis dataset model.',
    explanationKo:
      'SDTM은 CRF 데이터를 규제 제출용 표준 구조(DM, AE, LB 등 domain)로 정리합니다. ADaM은 분석용 데이터셋 모델입니다.',
    tags: ['SDTM', 'CDISC'],
  },
  {
    id: 'cd-02',
    topic: 'cdisc-structures',
    difficulty: 'hard' as const,
    question: 'Which variable is generally NOT included in the SDTM DM (Demographics) domain?',
    options: ['USUBJID', 'AGE', 'AVAL', 'SEX'],
    correctIndex: 2,
    explanation:
      'AVAL (Analysis Value) is a variable in ADaM analysis datasets. DM includes demographic variables such as USUBJID, AGE, SEX, and RACE.',
    explanationKo:
      'AVAL(Analysis Value)은 ADaM 분석 데이터셋의 변수입니다. DM에는 USUBJID, AGE, SEX, RACE 등 인구통계 변수가 포함됩니다.',
    tags: ['SDTM', 'DM domain'],
  },
  {
    id: 'cd-03',
    topic: 'cdisc-structures',
    difficulty: 'medium' as const,
    question: 'Which is NOT a core principle of ADaM (Analysis Data Model)?',
    options: [
      'Analysis-Ready: immediately usable for analysis',
      'Traceability: traceable back to SDTM',
      'One row per subject per parameter',
      'Storing raw data as-is',
    ],
    correctIndex: 3,
    explanation:
      'ADaM consists of derived datasets for analysis purposes (ADSL, BDS, OCCDS structures). It maintains traceability from SDTM while being analysis-ready.',
    explanationKo:
      'ADaM은 분석 목적에 맞게 파생된 데이터셋(ADSL, BDS, OCCDS 구조)입니다. SDTM에서 traceability를 유지하며 analysis-ready 형태로 만듭니다.',
    tags: ['ADaM', 'CDISC'],
  },
  {
    id: 'cd-04',
    topic: 'cdisc-structures',
    difficulty: 'easy' as const,
    question: 'In CDISC, what type of data does the AE (Adverse Events) domain primarily contain?',
    options: ['Laboratory tests', 'Adverse events', 'Drug exposure', 'Demographics'],
    correctIndex: 1,
    explanation:
      'The AE domain stores adverse event data using standard variables such as AETERM, AESEV, and AESTDTC.',
    explanationKo:
      'AE domain은 adverse events(이상반응) 데이터를 표준 변수(AETERM, AESEV, AESTDTC 등)로 저장합니다.',
    tags: ['SDTM', 'AE domain'],
  },
  {
    id: 'rg-01',
    topic: 'regulatory',
    difficulty: 'medium' as const,
    question: 'What is a characteristic of SAS V5 Transport files (.xpt)?',
    options: [
      'Unlimited variable length support',
      'Standard binary format for FDA submission with specifications such as 8-character variable names',
      'Excel-compatible format',
      'XML-based define file',
    ],
    correctIndex: 1,
    explanation:
      'XPT is the SAS V5 transport format used for FDA submissions. Read and write with LIBNAME XPORT. define.xml is a metadata document.',
    explanationKo:
      'XPT는 SAS V5 transport format으로 FDA 제출에 사용됩니다. LIBNAME XPORT로 읽고 씁니다. define.xml은 메타데이터 문서입니다.',
    tags: ['XPT', 'regulatory submission'],
  },
  {
    id: 'rg-02',
    topic: 'regulatory',
    difficulty: 'easy' as const,
    question: 'What is the role of define.xml?',
    options: [
      'Executing SAS programs',
      'Describing metadata for SDTM/ADaM datasets (variable definitions, codelists, etc.)',
      'Performing statistical analysis',
      'Generating log files',
    ],
    correctIndex: 1,
    explanation:
      'define.xml documents variable definitions, origin, codelists, and methodology for submission datasets in XML. Validated with tools such as Pinnacle 21.',
    explanationKo:
      'define.xml은 제출 데이터셋의 변수 정의, origin, codelist, 방법론을 XML로 문서화합니다. Pinnacle 21 등으로 검증합니다.',
    tags: ['define.xml', 'CDISC'],
  },
  {
    id: 'md-01',
    topic: 'manage-data',
    difficulty: 'medium' as const,
    question: 'What information can you retrieve from dictionary.columns in PROC SQL?',
    options: [
      'Variable names, types, and lengths in a dataset',
      'Macro variable values',
      'Graph options',
      'License information',
    ],
    correctIndex: 0,
    explanation:
      'dictionary.columns, dictionary.tables, dictionary.members, and similar tables are used in PROC SQL to query metadata. Commonly used for clinical data QC.',
    explanationKo:
      'dictionary.columns, dictionary.tables, dictionary.members 등은 PROC SQL에서 메타데이터를 조회합니다. 임상 데이터 QC에 자주 사용됩니다.',
    tags: ['DICTIONARY', 'PROC SQL'],
  },
  {
    id: 'md-02',
    topic: 'manage-data',
    difficulty: 'hard' as const,
    question: 'Why must clinical data QC distinguish between missing (.) and zero (0)?',
    options: [
      'SAS treats them the same, so no distinction is needed',
      'Not measured (missing) and an actual value of 0 have different clinical meaning',
      '0 is always treated as missing',
      'Missing is automatically replaced with 0',
    ],
    correctIndex: 1,
    explanation:
      'For example, a blood pressure of 0 may be a data error, while missing means not measured. Distinguishing outliers/missing vs. zero is essential in clinical QC.',
    explanationKo:
      '예: 혈압 0은 데이터 오류일 수 있고, missing은 측정 안 됨을 의미합니다. 임상 QC에서 outlier/missing vs zero 구분은 필수입니다.',
    tags: ['data cleaning', 'missing values'],
  },
  {
    id: 'tr-01',
    topic: 'transform-data',
    difficulty: 'medium' as const,
    question: 'What is generally required to calculate Change from Baseline?',
    options: [
      'The difference between the baseline value and the visit value',
      'The product of two variables',
      'Using only the last observation',
      'Using only PROC FREQ',
    ],
    correctIndex: 0,
    explanation:
      'Derived as CHG = AVAL - BASE or post-baseline minus baseline. In ADaM BDS, PARAM, AVISIT, BASE, and CHG are key variables.',
    explanationKo:
      'CHG = AVAL - BASE 또는 post-baseline - baseline 형태로 파생합니다. ADaM BDS에서 PARAM, AVISIT, BASE, CHG 등이 핵심 변수입니다.',
    tags: ['change from baseline', 'ADaM'],
  },
  {
    id: 'tr-02',
    topic: 'transform-data',
    difficulty: 'hard' as const,
    question: 'Why is the ISO 8601 date format (e.g., 2026-06-29) used in SDTM?',
    options: [
      'SAS internal storage format',
      'Standardized character date/time representation for exchange and regulatory submission consistency',
      'For Excel compatibility only',
      'To improve macro execution speed',
    ],
    correctIndex: 1,
    explanation:
      'SDTM/ADaM --DTC and --STDTC variables use ISO 8601 character strings. Care is needed when converting to and from SAS numeric dates.',
    explanationKo:
      'SDTM/ADaM에서 --DTC, --STDTC 변수는 ISO 8601 형식 문자열을 사용합니다. SAS date numeric과 변환 시 주의가 필요합니다.',
    tags: ['ISO 8601', 'date handling'],
  },
  {
    id: 'tr-03',
    topic: 'transform-data',
    difficulty: 'medium' as const,
    question: 'What is the purpose of windowing (analysis visit windows)?',
    options: [
      'Encrypting datasets',
      'Mapping measurements within an allowed range around protocol visit dates to analysis visits',
      'Shortening variable names to 8 characters',
      'Creating XPT files',
    ],
    correctIndex: 1,
    explanation:
      'Windowing assigns measurements to an AVISIT when the actual visit date falls within a window around the target visit. Defined in the SAP.',
    explanationKo:
      'Windowing은 실제 방문일이 target visit 주변 window 내에 있으면 해당 AVISIT에 할당하는 기법입니다. SAP에 정의됩니다.',
    tags: ['windowing', 'AVISIT'],
  },
  {
    id: 'tr-04',
    topic: 'transform-data',
    difficulty: 'medium' as const,
    question: 'What is commonly used to convert SDTM LB (Laboratory) data from wide to long format?',
    options: ['PROC SORT only', 'ARRAY + OUTPUT or PROC TRANSPOSE', 'PROC FREQ', 'LIBNAME XPORT'],
    correctIndex: 1,
    explanation:
      'When converting raw lab data (wide: LBTEST1–LBTEST10) to SDTM long structure (LBTESTCD, LBORRES), ARRAY/OUTPUT or TRANSPOSE is used.',
    explanationKo:
      '원시 lab 데이터(wide: LBTEST1-LBTEST10)를 SDTM long 구조(LBTESTCD, LBORRES)로 변환 시 ARRAY/OUTPUT 또는 TRANSPOSE를 사용합니다.',
    tags: ['PROC TRANSPOSE', 'ARRAY', 'reshaping'],
  },
  {
    id: 'st-01',
    topic: 'statistics',
    difficulty: 'easy' as const,
    question: 'Which PROC is appropriate for frequency analysis of categorical variables?',
    options: ['PROC REG', 'PROC FREQ', 'PROC UNIVARIATE (default)', 'PROC SQL only'],
    correctIndex: 1,
    explanation:
      'PROC FREQ is used for categorical frequencies, cross-tabulations, and chi-square tests. Continuous descriptive statistics use MEANS/UNIVARIATE.',
    explanationKo:
      'PROC FREQ는 범주형 변수 빈도, 교차표, chi-square 검정에 사용됩니다. 연속형 기술통계는 MEANS/UNIVARIATE입니다.',
    tags: ['PROC FREQ', 'statistics'],
  },
  {
    id: 'st-02',
    topic: 'statistics',
    difficulty: 'medium' as const,
    question: 'Which PROC is appropriate for comparing means between two groups?',
    options: ['PROC FREQ', 'PROC TTEST', 'PROC PRINT', 'PROC CONTENTS'],
    correctIndex: 1,
    explanation:
      'PROC TTEST is used for two independent samples or paired t-tests. ANOVA uses PROC GLM; regression uses PROC REG.',
    explanationKo:
      'PROC TTEST는 두 independent samples 또는 paired t-test에 사용됩니다. ANOVA는 PROC GLM, 회귀는 PROC REG입니다.',
    tags: ['PROC TTEST', 'statistics'],
  },
  {
    id: 'st-03',
    topic: 'statistics',
    difficulty: 'hard' as const,
    question: 'What can be saved with the OUTPUT statement in PROC GLM?',
    options: [
      'An output dataset containing analysis result statistics',
      'An XPT file',
      'define.xml',
      'Macro variables',
    ],
    correctIndex: 0,
    explanation:
      'PROC GLM, REG, TTEST, and similar procedures can save predicted values, residuals, and statistics to an output dataset with OUTPUT OUT=.',
    explanationKo:
      'PROC GLM, REG, TTEST 등은 OUTPUT OUT= 데이터셋으로 predicted values, residuals, statistics를 저장할 수 있습니다.',
    tags: ['PROC GLM', 'OUTPUT'],
  },
  {
    id: 'st-04',
    topic: 'statistics',
    difficulty: 'medium' as const,
    question: 'What is the primary use of PROC UNIVARIATE?',
    options: [
      'Distribution and descriptive statistics for continuous variables, including normality tests',
      'Merging datasets',
      'Defining macros',
      'Generating HTML define files',
    ],
    correctIndex: 0,
    explanation:
      'PROC UNIVARIATE provides mean, median, std, quantiles, normality tests, and more for continuous variables.',
    explanationKo:
      'PROC UNIVARIATE는 연속형 변수의 mean, median, std, quantiles, normality tests 등을 제공합니다.',
    tags: ['PROC UNIVARIATE'],
  },
  {
    id: 'mc-01',
    topic: 'macro',
    difficulty: 'easy' as const,
    question: 'Which is the correct syntax for referencing a macro variable?',
    options: ['&varname', '%varname', '$varname', '#varname'],
    correctIndex: 0,
    explanation:
      '&name references a macro variable; %name invokes a macro or macro statement. Define with %LET name=value;.',
    explanationKo:
      '&name은 매크로 변수 참조, %name은 매크로 호출/문장입니다. %LET name=value; 로 정의합니다.',
    tags: ['macro variables', '%LET'],
  },
  {
    id: 'mc-02',
    topic: 'macro',
    difficulty: 'medium' as const,
    question: 'Which option prints generated macro code to the log for macro debugging?',
    options: ['MPRINT', 'MLOGIC', 'SYMBOLGEN', 'All of the above are helpful'],
    correctIndex: 3,
    explanation:
      'OPTIONS MPRINT MLOGIC SYMBOLGEN; is the standard combination for clinical macro debugging. MPRINT shows generated code; MLOGIC shows condition evaluation.',
    explanationKo:
      'OPTIONS MPRINT MLOGIC SYMBOLGEN; 은 임상 매크로 디버깅의 기본 조합입니다. MPRINT는 생성 코드, MLOGIC은 조건 평가를 보여줍니다.',
    tags: ['MPRINT', 'MLOGIC', 'debugging'],
  },
  {
    id: 'mc-03',
    topic: 'macro',
    difficulty: 'hard' as const,
    question: 'In the macro call %create_lb(domain=LB, lib=work), what is domain?',
    options: [
      'A macro parameter',
      'A DATA step variable',
      'A libref',
      'An informat',
    ],
    correctIndex: 0,
    explanation:
      'In %MACRO create_lb(domain=, lib=);, domain and lib are macro parameters. Commonly used in clinical macros that create SDTM datasets by domain.',
    explanationKo:
      '%MACRO create_lb(domain=, lib=); 에서 domain, lib은 매크로 매개변수입니다. 임상에서 domain별 SDTM 생성 매크로에 자주 사용됩니다.',
    tags: ['macro parameters'],
  },
  {
    id: 'mc-04',
    topic: 'macro',
    difficulty: 'medium' as const,
    question: 'What is the role of the %SYSFUNC function?',
    options: [
      'Using DATA step functions at macro execution time',
      'SQL-only function',
      'Creating XPT files',
      'Closing ODS',
    ],
    correctIndex: 0,
    explanation:
      'Call SAS functions within macro % code, such as %SYSFUNC(UPCASE(&var)). Also used for date handling, e.g., %SYSFUNC(TODAY()).',
    explanationKo:
      '%SYSFUNC(UPCASE(&var))처럼 SAS 함수를 매크로 % 내에서 호출합니다. %SYSFUNC(TODAY()) 등 날짜 처리에도 사용합니다.',
    tags: ['%SYSFUNC', 'macro functions'],
  },
  {
    id: 'rp-01',
    topic: 'reporting',
    difficulty: 'medium' as const,
    question: 'In clinical TLFs (Tables, Listings, Figures), what characterizes a Listing?',
    options: [
      'Shows summary statistics only',
      'Lists detailed data at the individual subject level',
      'Contains graphs only',
      'define.xml format',
    ],
    correctIndex: 1,
    explanation:
      'A Listing is a patient-level detail report. A Table shows summary statistics; a Figure is a graph (SGPLOT, SGPANEL).',
    explanationKo:
      'Listing은 patient-level detail report입니다. Table은 요약 통계, Figure는 그래프(SGPLOT, SGPANEL)입니다.',
    tags: ['TLF', 'listing'],
  },
  {
    id: 'rp-02',
    topic: 'reporting',
    difficulty: 'medium' as const,
    question: 'What is the role of a GROUP variable in PROC REPORT?',
    options: [
      'Groups rows and displays summaries by group',
      'Deletes the dataset',
      'Executes macros',
      'Converts to XPT',
    ],
    correctIndex: 0,
    explanation:
      'Use DEFINE var / GROUP; to group rows and specify statistics on ANALYSIS variables to build clinical tables.',
    explanationKo:
      'DEFINE var / GROUP; 으로 그룹화하고, ANALYSIS 변수에 statistic을 지정해 clinical table을 만듭니다.',
    tags: ['PROC REPORT', 'TLF'],
  },
  {
    id: 'rp-03',
    topic: 'reporting',
    difficulty: 'easy' as const,
    question: 'What is the purpose of the SGPLOT procedure?',
    options: [
      'Creating single-panel statistical graphs',
      'SDTM mapping',
      'PROC COMPARE',
      'Defining macro variables',
    ],
    correctIndex: 0,
    explanation:
      'PROC SGPLOT and SGPANEL are used to create clinical figures. Output via ODS RTF/PDF for inclusion in TLF packages.',
    explanationKo:
      'PROC SGPLOT, SGPANEL은 임상 figure 생성에 사용됩니다. ODS RTF/PDF로 출력해 TLF 패키지에 포함합니다.',
    tags: ['SGPLOT', 'figures'],
  },
  {
    id: 'vl-01',
    topic: 'validation',
    difficulty: 'medium' as const,
    question: 'What is the core principle of Independent Programming Validation?',
    options: [
      'The same programmer performs both coding and validation',
      'An independent programmer reproduces the same results with separate code',
      'Reviewing the log only',
      'Comparing only one sample record',
    ],
    correctIndex: 1,
    explanation:
      'Clinical programming validation requires an independent programmer to regenerate outputs with validation code and compare results.',
    explanationKo:
      '임상 프로그래밍 검증은 independent programmer가 validation code로 output을 재생성하고 비교합니다.',
    tags: ['validation', 'independent programming'],
  },
  {
    id: 'vl-02',
    topic: 'validation',
    difficulty: 'hard' as const,
    question: 'What is the primary use of PROC COMPARE?',
    options: [
      'Comparing variable values between two datasets',
      'Creating graphs',
      'Macro debugging',
      'Reading XPT files',
    ],
    correctIndex: 0,
    explanation:
      'PROC COMPARE compares production vs. validation datasets. Use VAR and ID statements to specify comparison variables and keys.',
    explanationKo:
      'PROC COMPARE는 production vs validation 데이터셋을 비교합니다. VAR, ID 문으로 비교 변수와 키를 지정합니다.',
    tags: ['PROC COMPARE', 'validation'],
  },
  {
    id: 'vl-03',
    topic: 'validation',
    difficulty: 'medium' as const,
    question: 'What must be verified when reviewing logs during validation?',
    options: [
      'No ERROR/WARNING messages, matching observation counts, and expected variables present',
      'Program runtime only',
      'Window size',
      'Macro color',
    ],
    correctIndex: 0,
    explanation:
      'Validation checklist: clean log, observation count, variable attributes, key values match via PROC COMPARE, and more.',
    explanationKo:
      'Validation checklist: log clean, obs count, variable attributes, key values match via PROC COMPARE 등을 확인합니다.',
    tags: ['log review', 'validation'],
  },
  {
    id: 'vl-04',
    topic: 'validation',
    difficulty: 'easy' as const,
    question: 'What is the correct difference between Double Programming and Independent Programming?',
    options: [
      'Independent uses a different person with separate code; Double writes the same spec twice and compares',
      'No difference',
      'Double only checks the log',
      'Independent does not compare results',
    ],
    correctIndex: 0,
    explanation:
      'Both validation methods focus on comparing results. Independent programming is more common in clinical settings.',
    explanationKo:
      '두 검증 방식 모두 결과 비교가 핵심입니다. Independent programming이 임상에서 더 일반적입니다.',
    tags: ['validation methods'],
  },
]

export const EXAM_INFO = {
  name: 'SAS Certified Professional: Clinical Trials Programming Using SAS 9.4',
  examId: 'A00-282',
  questions: 65,
  minutes: 110,
  passingScore: 68,
  passingLabel: '68%',
  prerequisite: 'Base Programming Specialist or Advanced Programming Professional',
  topics: [
    { topic: 'clinical-process', weight: '5%' },
    { topic: 'cdisc-structures', weight: '10%' },
    { topic: 'regulatory', weight: '5%' },
    { topic: 'manage-data', weight: '5%' },
    { topic: 'transform-data', weight: '15%' },
    { topic: 'statistics', weight: '15%' },
    { topic: 'macro', weight: '15%' },
    { topic: 'reporting', weight: '10%' },
    { topic: 'validation', weight: '20%' },
  ],
}

export const STUDY_CHECKLIST = [
  { id: 'cl1', text: 'Understand clinical trial phases, SAP, and CRF concepts', topic: 'clinical-process' },
  { id: 'cl2', text: 'SDTM domain structure (DM, AE, LB, EX, etc.)', topic: 'cdisc-structures' },
  { id: 'cl3', text: 'ADaM structure (ADSL, BDS, OCCDS) and traceability', topic: 'cdisc-structures' },
  { id: 'cl4', text: 'Understand XPT transport and define.xml', topic: 'regulatory' },
  { id: 'cl5', text: 'Metadata QC with DICTIONARY tables', topic: 'manage-data' },
  { id: 'cl6', text: 'Missing vs. zero and outlier identification', topic: 'manage-data' },
  { id: 'cl7', text: 'Change from baseline, windowing, and ISO 8601 dates', topic: 'transform-data' },
  { id: 'cl8', text: 'Reshape data with ARRAY/TRANSPOSE', topic: 'transform-data' },
  { id: 'cl9', text: 'PROC FREQ, MEANS, UNIVARIATE, TTEST', topic: 'statistics' },
  { id: 'cl10', text: 'PROC GLM, REG, and OUTPUT datasets', topic: 'statistics' },
  { id: 'cl11', text: 'Macro variables, parameters, and %SYSFUNC', topic: 'macro' },
  { id: 'cl12', text: 'MPRINT, MLOGIC, SYMBOLGEN debugging', topic: 'macro' },
  { id: 'cl13', text: 'Create clinical tables with PROC REPORT', topic: 'reporting' },
  { id: 'cl14', text: 'Create figures with SGPLOT/SGPANEL', topic: 'reporting' },
  { id: 'cl15', text: 'Independent programming validation', topic: 'validation' },
  { id: 'cl16', text: 'Compare outputs with PROC COMPARE', topic: 'validation' },
  { id: 'cl17', text: 'Validation log review checklist', topic: 'validation' },
  { id: 'cl18', text: 'Take the official Clinical Practice Exam', topic: 'validation' },
]

export const CLINICAL_CERT: CertData = {
  id: 'clinical',
  shortName: 'Clinical',
  fullName: 'Clinical Trials Programming',
  subtitle: 'SAS 9.4 · A00-282',
  color: '#2d7a4f',
  topics: TOPICS,
  questions: applyMcqUpgrades(
    [...QUESTIONS, ...CLINICAL_EXTRA, ...EXAM_GRADE_CLINICAL],
    CLINICAL_UPGRADES
  ),
  examInfo: EXAM_INFO,
  checklist: STUDY_CHECKLIST,
}
