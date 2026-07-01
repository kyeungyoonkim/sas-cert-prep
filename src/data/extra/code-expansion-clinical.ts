import type { CodeChallenge } from '../codeChallenges'

export const CODE_EXPANSION_CLINICAL: CodeChallenge[] = [
  {
    id: 'cc-cl-19',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'medium',
    title: 'ADSL ITT population',
    instruction: 'Run the code. How many observations are in WORK.ITT?',
    starterCode: `data rand;
  input usubjid $ ittfl $;
  datalines;
S001 Y
S002 Y
S003 N
S004 Y
S005 N
S006 Y
;
run;

data itt;
  set rand;
  if ittfl = 'Y';
run;

proc print data=itt;
run;`,
    solutionCode: `/* ITTFL=Y: 4 subjects */`,
    options: ['2', '3', '4', '6'],
    correctIndex: 2,
    explanation: 'Four subjects have ITTFL="Y" (S001, S002, S004, S006).',
    explanationKo:
      'Step 1: ITTFL="Y"인 subject만 유지.\nStep 2: S001, S002, S004, S006 — 4명.\nStep 3: WORK.ITT에 4 observations.',
    tags: ['ADSL', 'ITTFL', 'derivation'],
  },
  {
    id: 'cc-cl-20',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'medium',
    title: 'Lab below reference low',
    instruction: 'Run the code. How many observations are in WORK.LOWLB?',
    starterCode: `data lb;
  input usubjid $ lbtest $ lbval reflow;
  datalines;
S001 HGB 10.5 12.0
S002 HGB 13.8 12.0
S003 HGB 9.2 12.0
S004 HGB 13.1 12.0
S005 HGB 14.5 12.0
;
run;

data graded;
  set lb;
  if lbval < reflow then lbfl = 'LOW';
  else lbfl = 'NORMAL';
run;

data lowlb;
  set graded;
  if lbfl = 'LOW';
run;

proc print data=lowlb;
run;`,
    solutionCode: `/* 2 values below reflow 12 */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'HGB values 10.5 (S001) and 9.2 (S003) are below REFLOW 12.',
    explanationKo:
      'Step 1: LBVAL < REFLOW이면 LBFL="LOW".\nStep 2: S001(10.5)과 S003(9.2)만 해당.\nStep 3: WORK.LOWLB에 2 observations.',
    tags: ['LB', 'derivation', 'reference range'],
  },
  {
    id: 'cc-cl-21',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'easy',
    title: 'Treatment-emergent AE filter',
    instruction: 'Run the code. How many observations are in WORK.TEAE?',
    starterCode: `data ae;
  input usubjid $ aeterm $ trtemfl $;
  datalines;
S001 HEADACHE Y
S002 NAUSEA Y
S003 RASH N
S004 FATIGUE Y
S005 FEVER N
S006 HEADACHE Y
;
run;

data teae;
  set ae;
  if trtemfl = 'Y';
run;

proc print data=teae;
run;`,
    solutionCode: `/* TRTEMFL=Y: 4 TEAE records */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
    explanation: 'Four AE records have TRTEMFL="Y".',
    explanationKo:
      'Step 1: TRTEMFL="Y"인 AE만 유지.\nStep 2: S001, S002, S004, S006 — 4 records.\nStep 3: WORK.TEAE에 4 observations.',
    tags: ['AE', 'TRTEMFL', 'derivation'],
  },
  {
    id: 'cc-cl-22',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Merge DM and treatment start',
    instruction: 'Run the code. How many observations are in WORK.ADSL?',
    starterCode: `data dm;
  input usubjid $ age sex $;
  datalines;
S001 45 M
S002 52 F
S003 38 M
S004 61 F
;
run;

data ex;
  input usubjid $ trtsdt;
  datalines;
S001 20240101
S002 20240105
S003 20240108
S004 20240112
;
run;

data adsl;
  merge dm ex;
  by usubjid;
run;

proc print data=adsl;
run;`,
    solutionCode: `/* 1:1 MERGE on 4 subjects → 4 obs */`,
    options: ['2', '3', '4', '8'],
    correctIndex: 2,
    explanation: 'One-to-one MERGE BY USUBJID on four matching subjects produces four rows.',
    explanationKo:
      'Step 1: DM과 EX 모두 4 subject.\nStep 2: MERGE BY USUBJID — 1:1 match.\nStep 3: WORK.ADSL에 4 observations.',
    tags: ['MERGE', 'DM', 'ADSL'],
  },
  {
    id: 'cc-cl-23',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'easy',
    title: 'Stack AE from study sites',
    instruction: 'Run the code. How many observations are in WORK.ALLAE?',
    starterCode: `data site01_ae;
  input usubjid $ aeterm $;
  datalines;
S001 HEADACHE
S002 NAUSEA
;
run;

data site02_ae;
  input usubjid $ aeterm $;
  datalines;
S003 RASH
S004 FATIGUE
S005 FEVER
;
run;

data allae;
  set site01_ae site02_ae;
run;

proc print data=allae;
run;`,
    solutionCode: `/* 2 + 3 = 5 AE records */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'SET concatenates site01_ae (2 rows) and site02_ae (3 rows) → 5 observations.',
    explanationKo:
      'Step 1: SITE01_AE 2 row, SITE02_AE 3 row.\nStep 2: SET으로 vertical stack.\nStep 3: 2 + 3 = 5 observations in WORK.ALLAE.',
    tags: ['SET', 'AE', 'concatenate'],
  },
  {
    id: 'cc-cl-24',
    cert: 'clinical',
    topic: 'validation',
    difficulty: 'medium',
    title: 'ADSL validation row count',
    instruction:
      'Run both datasets. How many observations are in WORK.ADSL_VAL?',
    starterCode: `data adsl_prod;
  input usubjid $ saffl $;
  datalines;
S001 Y
S002 Y
S003 Y
S004 N
S005 N
;
run;

data adsl_val;
  input usubjid $ saffl $;
  datalines;
S001 Y
S002 Y
S003 Y
S004 N
;
run;

proc print data=adsl_prod;
run;
proc print data=adsl_val;
run;`,
    solutionCode: `/* ADSL_VAL has 4 obs; prod has 5 — row-count QC fail */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation:
      'ADSL_VAL has four observations while ADSL_PROD has five — a row-count QC discrepancy.',
    explanationKo:
      'Step 1: ADSL_PROD는 5 observations.\nStep 2: ADSL_VAL은 4 observations.\nStep 3: validation row count가 불일치 — QC fail.',
    tags: ['validation', 'QC', 'ADSL'],
  },
  {
    id: 'cc-cl-25',
    cert: 'clinical',
    topic: 'validation',
    difficulty: 'hard',
    title: 'Screen failure QC flag',
    instruction: 'Run the code. How many observations are in WORK.SCRFAIL?',
    starterCode: `data adsl;
  input usubjid $ scrfl $ saffl $;
  datalines;
S001 N Y
S002 N Y
S003 Y N
S004 N Y
S005 Y N
S006 N Y
;
run;

data flagged;
  set adsl;
  if scrfl = 'Y' then qcfl = 'FAIL';
  else qcfl = 'PASS';
run;

data scrfail;
  set flagged;
  if qcfl = 'FAIL';
run;

proc print data=scrfail;
run;`,
    solutionCode: `/* 2 screen failures */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'S003 and S005 have SCRFL="Y" and fail screen-failure QC.',
    explanationKo:
      'Step 1: SCRFL="Y"이면 QCFL="FAIL".\nStep 2: S003, S005 — 2 subject.\nStep 3: WORK.SCRFAIL에 2 observations.',
    tags: ['validation', 'QC', 'ADSL', 'SCRFL'],
  },
]
