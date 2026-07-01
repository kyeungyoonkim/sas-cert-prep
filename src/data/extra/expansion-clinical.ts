import type { Question } from '../types'

/** Expansion clinical MCQs — gap topics with no code challenges (A00-282) */
export const EXPANSION_CLINICAL: Question[] = [
  {
    id: 'exp-cl-01',
    title: 'SAP amendment after database lock',
    topic: 'clinical-process',
    difficulty: 'hard',
    examStyle: true,
    question:
      'The database is locked and SDTM v1.0 is frozen. Biostatistics issues SAP Amendment 2 adding a secondary endpoint and a new analysis population flag.\n\nWhat is the correct programming response?',
    options: [
      'Implement Amendment 2 under change control; document impact on frozen SDTM and derived ADaM/TLFs',
      'Ignore the amendment — locked data cannot change',
      'Re-randomize subjects to match the new population',
      'Delete all prior TLFs without documentation',
    ],
    correctIndex: 0,
    explanation:
      'Post-lock SAP changes are controlled through formal amendment. Programmers update derivations and outputs per the amendment while documenting what changed and re-running validation.',
    explanationKo:
      'DB lock 이후 SAP 변경은 공식 amendment로 관리합니다. 프로그래머는 amendment에 따라 derivation/TLF를 수정하고 변경 영향을 문서화한 뒤 validation을 재실행해야 합니다.',
    tags: ['SAP', 'database lock', 'change control'],
    coachingTip: 'Lock freezes the data snapshot — not the analysis specification. Amendments still drive programming.',
  },
  {
    id: 'exp-cl-02',
    title: 'Stratified randomization in analysis',
    topic: 'clinical-process',
    difficulty: 'medium',
    examStyle: true,
    question:
      'Subjects were randomized 1:1 within strata defined by region (US vs EU) and baseline disease severity (Mild vs Severe). The SAP specifies stratified randomization was used.\n\nWhich variable in ADSL best preserves stratification for analysis?',
    options: [
      'STRAT1 / STRAT2 (or equivalent stratification variables from the randomization scheme)',
      'USUBJID only',
      'SITEID alone',
      'LSTALVDT',
    ],
    correctIndex: 0,
    explanation:
      'Stratification factors from the randomization list should be carried into ADSL (often STRAT1, STRAT2, etc.) so statistical models and summaries can account for the design.',
    explanationKo:
      '무작위 배정 층화 요인은 ADSL의 STRAT1, STRAT2 등으로 보존해야 하며, 통계 분석과 요약에서 설계를 반영할 수 있습니다.',
    tags: ['randomization', 'ADSL', 'stratification'],
    coachingTip: 'Read the IWRS/randomization spec — strata in ADSL must match what biostatistics expects in the model.',
  },
  {
    id: 'exp-cl-03',
    title: 'EDC reconciliation timing',
    topic: 'clinical-process',
    difficulty: 'medium',
    examStyle: true,
    question:
      'A site uploads paper source documents for a subject visit that were never entered in the EDC system. Data management opens a query.\n\nWhen should programming use this subject\'s data for SDTM production?',
    options: [
      'After EDC entry is complete and reconciliation confirms the database reflects resolved queries',
      'Immediately from the paper scan without EDC update',
      'Only after the CSR is published',
      'Never — paper sources are invalid',
    ],
    correctIndex: 0,
    explanation:
      'SDTM is built from the clinical database after data management reconciliation. Using unreconciled source bypasses query resolution and breaks traceability.',
    explanationKo:
      'SDTM은 EDC 데이터가 reconcile되고 query가 해결된 후 DB 기준으로 생성합니다. 미해결 paper source만으로 programming하면 traceability가 깨집니다.',
    tags: ['EDC', 'reconciliation', 'data management'],
    coachingTip: 'Programming starts from the controlled database — not from investigator folders.',
  },
  {
    id: 'exp-cl-04',
    title: 'SUPP-- qualifier domains',
    topic: 'cdisc-structures',
    difficulty: 'hard',
    examStyle: true,
    question:
      'SDTM AE holds core variables, but the protocol requires storing "Action Taken with Study Treatment" as a qualifier that does not fit the standard AE structure.\n\nWhich CDISC approach is standard?',
    options: [
      'Create SUPPAE with QNAM, QLABEL, QVAL, and IDVAR linking to AESEQ',
      'Add a 9th-character variable name to AE.sas7bdat',
      'Store the qualifier only in a separate Excel file',
      'Duplicate AE rows with a different DOMAIN code',
    ],
    correctIndex: 0,
    explanation:
      'Supplemental qualifier domains (SUPP--) hold non-standard variables linked to parent records via USUBJID, IDVAR (e.g., AESEQ), and QNAM/QVAL pairs.',
    explanationKo:
      '표준 AE 구조에 맞지 않는 변수는 SUPPAE에 QNAM/QLABEL/QVAL로 저장하고 IDVAR(AESEQ 등)로 부모 레코드와 연결합니다.',
    tags: ['SDTM', 'SUPP--', 'qualifiers'],
    coachingTip: 'When a variable cannot map to the parent domain — think SUPP--, not wide hacks.',
  },
  {
    id: 'exp-cl-05',
    title: 'LBTESTCD vs LBTEST',
    topic: 'cdisc-structures',
    difficulty: 'medium',
    examStyle: true,
    question:
      'You map local lab codes to CDISC. LBTESTCD="ALT" and LBTEST="Alanine Aminotransferase" appear on LB records.\n\nWhat is the correct relationship between these variables?',
    options: [
      'LBTESTCD is the short standard code; LBTEST is the decode/label for the test',
      'LBTESTCD is the unit; LBTEST is the numeric result',
      'They must always be identical strings',
      'LBTESTCD replaces USUBJID in LB',
    ],
    correctIndex: 0,
    explanation:
      'In SDTM LB, --TESTCD stores the short code (often from CDISC CT); --TEST stores the human-readable test name. Both describe the same lab analyte.',
    explanationKo:
      'SDTM LB에서 --TESTCD는 짧은 표준 코드(ALT 등)이고 --TEST는 해당 검사의 decode/라벨입니다. 같은 검사 analyte를 나타냅니다.',
    tags: ['SDTM', 'LB', 'controlled terminology'],
    coachingTip: 'Code + decode pairs (--TESTCD/--TEST, --TERM/--DECOD) repeat across SDTM domains.',
  },
  {
    id: 'exp-cl-06',
    title: 'ADaM BDS key structure',
    topic: 'cdisc-structures',
    difficulty: 'hard',
    examStyle: true,
    question:
      'ADVS is a BDS dataset with one row per subject per parameter per analysis visit. A QC check finds duplicate rows for the same USUBJID, PARAMCD, and AVISIT.\n\nWhat does this most likely violate?',
    options: [
      'The BDS grain — keys should uniquely identify one analysis record per parameter-visit',
      'The requirement that ADVS must have one row per subject total',
      'FDA rule that PARAMCD must be missing',
      'SDTM rule that VS domain cannot exist',
    ],
    correctIndex: 0,
    explanation:
      'BDS datasets (e.g., ADVS, ADLB) are structured at subject × parameter × analysis visit (plus other keys per spec). Duplicate keys indicate a derivation or merge error.',
    explanationKo:
      'BDS(ADVS, ADLB 등)는 subject × parameter × analysis visit grain을 가집니다. USUBJID+PARAMCD+AVISIT 중복은 derivation/merge 오류 신호입니다.',
    tags: ['ADaM', 'BDS', 'ADVS', 'keys'],
    coachingTip: 'Before derivations — write down the BDS key from the ADaM spec and sort-check uniqueness.',
  },
  {
    id: 'exp-cl-07',
    title: 'Study Data Reviewers Guide',
    topic: 'regulatory',
    difficulty: 'medium',
    examStyle: true,
    question:
      'An FDA statistical reviewer needs narrative context on analysis datasets, programming conventions, and traceability from SDTM to ADaM.\n\nWhich submission document provides that overview?',
    options: [
      'Study Data Reviewers Guide (SDRG)',
      'SAS autoexec.sas',
      'Site monitoring report',
      'Investigator brochure only',
    ],
    correctIndex: 0,
    explanation:
      'The SDRG describes submission datasets, analysis conventions, and reviewer guidance. It complements define.xml and supports regulatory review.',
    explanationKo:
      'SDRG(Study Data Reviewers Guide)는 제출 데이터셋, 분석 규칙, SDTM→ADaM traceability 등 reviewer를 위한 개요를 제공합니다.',
    tags: ['SDRG', 'regulatory', 'submission'],
    coachingTip: 'define.xml = variable metadata; SDRG = study-level programming story for reviewers.',
  },
  {
    id: 'exp-cl-08',
    title: 'ADaM IG conformance at submission',
    topic: 'regulatory',
    difficulty: 'hard',
    examStyle: true,
    question:
      'Pinnacle 21 reports ADAE records where ASEQ is not unique within USUBJID and PARAMCD is missing on half the rows.\n\nBefore eCTD upload, what is the priority action?',
    options: [
      'Fix derivations to meet ADaM IG and study ADaM spec; re-validate before submission',
      'Submit anyway — warnings are informational only',
      'Rename ADAE to a non-standard domain to bypass rules',
      'Remove PARAMCD from define.xml only',
    ],
    correctIndex: 0,
    explanation:
      'ADaM must conform to the ADaM Implementation Guide and study specifications. Key integrity (ASEQ uniqueness) and required variables (PARAMCD) must be resolved pre-submission.',
    explanationKo:
      'ADaM은 ADaM IG와 study spec을 따라야 합니다. ASEQ 유일성, PARAMCD 누락 등 conformance 오류는 eCTD 제출 전 derivation 수정과 re-validation으로 해결해야 합니다.',
    tags: ['ADaM IG', 'Pinnacle 21', 'conformance'],
    coachingTip: 'Validator errors on keys and required variables are submission blockers — not cosmetic.',
  },
  {
    id: 'exp-cl-09',
    title: '%LOCAL in nested macros',
    topic: 'macro',
    difficulty: 'hard',
    examStyle: true,
    question:
      '%outer calls %inner in a loop. %inner assigns &domain without a %LOCAL declaration. On the second iteration, &domain still holds the first domain name.\n\nWhat prevents this macro variable bleed?',
    options: [
      '%local domain; at the start of %inner',
      'OPTIONS NOMLOGIC;',
      'PROC DATASETS;',
      'Adding a TITLE statement',
    ],
    correctIndex: 0,
    explanation:
      'Macro variables assigned in nested macros are global by default unless declared %LOCAL. %LOCAL scopes the variable to the macro that declares it.',
    explanationKo:
      '중첩 macro에서 변수는 기본적으로 global입니다. %inner 시작 부분의 %local domain; 선언으로 iteration 간 값 bleed를 방지합니다.',
    tags: ['macro', '%LOCAL', 'scope'],
    coachingTip: 'Every macro that sets scratch variables in a loop — %LOCAL first, debug second.',
  },
  {
    id: 'exp-cl-10',
    title: 'Batch macro debugging options',
    topic: 'macro',
    difficulty: 'medium',
    examStyle: true,
    question:
      '%build_adam(study=ABC, domain=ADSL) runs correctly interactively but fails in batch with "Apparent symbolic reference DOMAIN not resolved."\n\nWhich option combination best traces the failure?',
    options: [
      'MPRINT MLOGIC SYMBOLGEN',
      'OBS=0 NODATE',
      'COMPRESS=YES',
      'MISSOVER DSD',
    ],
    correctIndex: 0,
    explanation:
      'MPRINT shows generated SAS code, MLOGIC traces macro execution, and SYMBOLGEN shows how macro variables resolve — essential for batch macro debugging.',
    explanationKo:
      'MPRINT(생성 코드), MLOGIC(macro 실행), SYMBOLGEN(변수 치환)을 함께 켜면 batch에서 macro variable 미해결 오류를 추적하기 좋습니다.',
    tags: ['macro', 'MPRINT', 'MLOGIC', 'SYMBOLGEN'],
    coachingTip: 'Reproduce one failing study interactively with all three debug options before re-submitting batch.',
  },
  {
    id: 'exp-cl-11',
    title: 'Population footnotes in TLFs',
    topic: 'reporting',
    difficulty: 'medium',
    examStyle: true,
    question:
      'Table 14.1.1 displays demographics for the Safety population. The SAP defines Safety as all randomized subjects who received at least one dose.\n\nWhere should the population definition appear on the output?',
    options: [
      'In the table footnote exactly as specified in the SAP shell',
      'Only in the programmer\'s email to the statistician',
      'In the SAS log header',
      'Nowhere — reviewers infer the population',
    ],
    correctIndex: 0,
    explanation:
      'TLF shells and SAP define population text in footnotes. PROC REPORT/RTF output must reproduce the authorized wording for regulatory tables.',
    explanationKo:
      'TLF population 정의는 SAP shell의 footnote 문구 그대로 표에 표시해야 합니다. reviewer가 population을 추론하게 두면 안 됩니다.',
    tags: ['TLF', 'footnotes', 'Safety population'],
    coachingTip: 'Copy footnote text verbatim from the mock shell — paraphrasing is a common QC fail.',
  },
  {
    id: 'exp-cl-12',
    title: 'Listing vs summary table choice',
    topic: 'reporting',
    difficulty: 'hard',
    examStyle: true,
    question:
      'The SAP requires Listing 16.2.1 showing all serious adverse events with onset date, action taken, and outcome for each subject.\n\nWhich approach best matches a clinical listing deliverable?',
    options: [
      'PROC REPORT or DATA _NULL_ with ODS RTF/PDF producing one row per AE per subject per the shell',
      'PROC MEANS with CLASS=USUBJID only',
      'PROC FREQ on AETERM without subject detail',
      'A macro catalog printout',
    ],
    correctIndex: 0,
    explanation:
      'Listings present subject-level detail (one event per row). PROC REPORT with ODS or controlled DATA step output reproduces listing shells; summary procedures collapse detail.',
    explanationKo:
      'Listing은 subject-level 상세(사건별 행)를 보여줍니다. PROC REPORT+ODS 또는 controlled DATA step으로 shell을 구현하고, MEANS/FREQ 요약 proc만으로는 부족합니다.',
    tags: ['listing', 'PROC REPORT', 'ODS', 'AE'],
    coachingTip: 'Table = summarize; Listing = show every qualifying record. Match the shell type.',
  },
  {
    id: 'exp-cl-13',
    title: 'Annotated CRF purpose',
    topic: 'regulatory',
    difficulty: 'easy',
    examStyle: true,
    question:
      'An FDA reviewer asks which CRF field maps to SDTM AE.AETERM for a specific form.\n\nWhich deliverable shows CRF-to-SDTM traceability?',
    options: [
      'Annotated CRF (aCRF) with SDTM variable annotations',
      'SAS program header comment only',
      'PROC CONTENTS output alone',
      'Randomization schedule',
    ],
    correctIndex: 0,
    explanation:
      'The annotated CRF links collection fields to SDTM variables and domains, providing traceability from source to tabulation datasets.',
    explanationKo:
      'aCRF(Annotated CRF)는 CRF 수집 항목과 SDTM 변수/도메인 매핑을 보여 source→tabulation traceability를 제공합니다.',
    tags: ['aCRF', 'traceability', 'regulatory'],
    coachingTip: 'aCRF + define.xml + SDRG together tell the full data story for reviewers.',
  },
  {
    id: 'exp-cl-14',
    title: 'RELREC in RECIST SDTM',
    topic: 'cdisc-structures',
    difficulty: 'hard',
    examStyle: true,
    question:
      'Oncology SDTM TU (Tumor Results) includes target lesions linked to prior assessments. The spec requires indicating which prior TU record a lesion relates to.\n\nWhich SDTM variable supports that relationship?',
    options: [
      'RELREC — related record identifier linking to another --SEQ within the domain',
      'USUBJID only',
      'STUDYID duplicated on every row',
      'DOMAIN=REL',
    ],
    correctIndex: 0,
    explanation:
      'RELREC (Related Record) points to another record\'s sequence variable (e.g., TUSEQ) within the same domain to express temporal or lesion relationships.',
    explanationKo:
      'RELREC(Related Record)는 같은 domain 내 다른 레코드의 --SEQ(예: TUSEQ)를 가리켜 lesion/assessment 간 관계를 표현합니다.',
    tags: ['SDTM', 'TU', 'RELREC', 'oncology'],
    coachingTip: 'Cross-record links within a domain → RELREC + --SEQ, not extra merge keys.',
  },
  {
    id: 'exp-cl-15',
    title: 'Autocall macro library in production',
    topic: 'macro',
    difficulty: 'medium',
    examStyle: true,
    question:
      'A global macro library holds %derive_trtemfl and %compare_adam used across 12 studies. Production batch jobs reference it via OPTIONS SASAUTOS.\n\nWhat is the primary benefit of this approach?',
    options: [
      'Centralized, version-controlled macros ensure consistent derivations and reduce duplicated code across studies',
      'Macros run faster than open code in all cases',
      'SASAUTOS eliminates the need for validation',
      'It prevents the use of PROC SQL',
    ],
    correctIndex: 0,
    explanation:
      'Autocall libraries standardize reusable clinical macros across studies. Combined with version control and validation, they improve consistency and maintainability.',
    explanationKo:
      'Autocall macro library(SASAUTOS)는 study 간 derivation macro를 중앙 관리해 일관성을 높이고 중복 코드를 줄입니다. version control과 validation과 함께 사용합니다.',
    tags: ['macro', 'SASAUTOS', 'autocall', 'production'],
    coachingTip: 'Production macros still need independent validation — SASAUTOS is not a substitute.',
  },
]
