import type { CodeChallenge } from '../codeChallenges'

export const CODE_CLINICAL_EXTRA: CodeChallenge[] = [
  {
    id: 'cc-cl-07',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'medium',
    title: 'Screen failure flag',
    instruction: 'Run the code. How many observations are in WORK.FAILS?',
    starterCode: `data screen;
  input usubjid $ scrfl $;
  datalines;
S001 Y
S002 N
S003 Y
S004 N
S005 Y
;
run;

data flagged;
  set screen;
  if scrfl = 'Y' then flag = 'SCREEN FAIL';
  else flag = 'PASS';
run;

data fails;
  set flagged;
  if flag = 'SCREEN FAIL';
run;

proc print data=fails;
run;`,
    solutionCode: `/* 3 screen failures */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Three subjects have SCRFL="Y" and FLAG="SCREEN FAIL".',
    tags: ['derivation', 'flag'],
  },
  {
    id: 'cc-cl-08',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'hard',
    title: 'Lab toxic grade',
    instruction: 'Run the code. How many observations are in WORK.TOXIC?',
    starterCode: `data lb;
  input usubjid $ lbtest $ lbval refhigh;
  datalines;
S001 ALT 45 40
S002 ALT 38 40
S003 ALT 52 40
S004 ALT 35 40
S005 ALT 48 40
;
run;

data graded;
  set lb;
  if lbval > refhigh then grade = 'TOXIC';
  else grade = 'NORMAL';
run;

data toxic;
  set graded;
  if grade = 'TOXIC';
run;

proc print data=toxic;
run;`,
    solutionCode: `/* 3 toxic rows */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Values 45, 52, and 48 exceed refhigh 40.',
    tags: ['LB', 'derivation'],
  },
  {
    id: 'cc-cl-09',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'easy',
    title: 'DM row count QC',
    instruction: 'Run the code. How many subjects are in WORK.DM?',
    starterCode: `data dm;
  input usubjid $ age sex $;
  datalines;
S001 45 M
S002 52 F
S003 38 M
S004 61 F
S005 49 M
S006 33 F
;
run;

proc print data=dm;
run;`,
    solutionCode: `/* 6 subjects */`,
    options: ['4', '5', '6', '7'],
    correctIndex: 2,
    explanation: 'Six datalines → six DM observations.',
    tags: ['DM', 'QC', 'observations'],
  },
  {
    id: 'cc-cl-10',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'medium',
    title: 'Treatment arm filter',
    instruction: 'Run the code. How many subjects are in WORK.TRT_A?',
    starterCode: `data rand;
  input usubjid $ arm $;
  datalines;
S001 A
S002 B
S003 A
S004 B
S005 A
S006 B
S007 A
;
run;

data trt_a;
  set rand;
  if arm = 'A';
run;

proc print data=trt_a;
run;`,
    solutionCode: `/* arm=A: 4 subjects */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
    explanation: 'S001, S003, S005, S007 are in treatment arm A.',
    tags: ['filter', 'randomization'],
  },
  {
    id: 'cc-cl-11',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Visit count per subject',
    instruction: 'Run the code. What is N on the **last** observation in WORK.VISIT_N?',
    starterCode: `data visits;
  input usubjid $ visitnum;
  datalines;
S001 1
S001 2
S001 3
S002 1
S002 2
;
run;

data visit_n;
  set visits;
  n + 1;
run;

proc print data=visit_n;
run;`,
    solutionCode: `/* 5 visit rows → last N=5 */`,
    options: ['2', '3', '5', '6'],
    correctIndex: 2,
    explanation: 'Five visit records; running counter N=5 on the last row.',
    tags: ['visits', 'SUM statement'],
  },
  {
    id: 'cc-cl-12',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'hard',
    title: 'AE severity filter',
    instruction: 'Run the code. How many observations are in WORK.SEV_ONLY?',
    starterCode: `data ae;
  input usubjid $ aeterm $ severity $;
  datalines;
S001 HEADACHE MILD
S002 NAUSEA SEVERE
S003 FATIGUE MILD
S004 VOMITING SEVERE
S005 RASH MODERATE
S006 FEVER SEVERE
;
run;

data severe;
  set ae;
  if severity = 'SEVERE' then sev = 'SEVERE';
  else sev = 'OTHER';
run;

data sev_only;
  set severe;
  if sev = 'SEVERE';
run;

proc print data=sev_only;
run;`,
    solutionCode: `/* 3 severe AEs */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'Three AEs have SEVERITY="SEVERE".',
    tags: ['AE', 'derivation'],
  },
  {
    id: 'cc-cl-13',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Merge DM and EX',
    instruction: 'Run the code. How many observations are in WORK.DMEX?',
    starterCode: `data dm;
  input usubjid $ age;
  datalines;
S001 45
S002 52
S003 38
;
run;

data ex;
  input usubjid $ dose;
  datalines;
S001 100
S002 100
S003 100
;
run;

data dmex;
  merge dm ex;
  by usubjid;
run;

proc print data=dmex;
run;`,
    solutionCode: `/* 3 matching subjects → 3 obs */`,
    options: ['2', '3', '4', '6'],
    correctIndex: 1,
    explanation: 'One-to-one MERGE on three subjects produces three rows.',
    tags: ['MERGE', 'DM', 'EX'],
  },
  {
    id: 'cc-cl-14',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'medium',
    title: 'BMI obese flag',
    instruction: 'Run the code. How many observations are in WORK.OBESE?',
    starterCode: `data vitals;
  input usubjid $ bmi;
  datalines;
S001 22.5
S002 27.8
S003 31.2
S004 24.1
S005 28.5
;
run;

data cats;
  set vitals;
  if bmi >= 30 then bmi_cat = 'OBESE';
  else bmi_cat = 'OTHER';
run;

data obese;
  set cats;
  if bmi_cat = 'OBESE';
run;

proc print data=obese;
run;`,
    solutionCode: `/* 1 obese subject */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 0,
    explanation: 'Only S003 (BMI 31.2) is >= 30.',
    tags: ['derivation', 'BMI'],
  },
  {
    id: 'cc-cl-15',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'First visit per subject',
    instruction: 'Run the code. How many observations are in WORK.FIRSTVIS?',
    starterCode: `data sv;
  input usubjid $ visit $ visitdt;
  datalines;
S001 SCREEN 20240101
S001 WEEK4 20240129
S001 WEEK8 20240226
S002 SCREEN 20240105
S002 WEEK4 20240202
;
run;

data firstvis;
  set sv;
  by usubjid;
  if first.usubjid;
run;

proc print data=firstvis;
run;`,
    solutionCode: `/* first visit per subject → 2 obs */`,
    options: ['1', '2', '3', '5'],
    correctIndex: 1,
    explanation: 'IF FIRST.usubjid keeps SCREEN visit for S001 and S002.',
    tags: ['FIRST.', 'visits'],
  },
  {
    id: 'cc-cl-16',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'easy',
    title: 'Production vs validation count',
    instruction: 'Run both datasets. Do they have the same observation count?',
    starterCode: `data prod;
  input usubjid $ param $ aval;
  datalines;
S001 WEIGHT 72.5
S002 WEIGHT 68.0
S003 WEIGHT 81.2
S004 WEIGHT 75.8
;
run;

data val;
  input usubjid $ param $ aval;
  datalines;
S001 WEIGHT 72.5
S002 WEIGHT 68.0
S003 WEIGHT 81.2
S004 WEIGHT 75.8
;
run;

proc print data=prod;
run;
proc print data=val;
run;`,
    solutionCode: `/* both 4 obs */`,
    options: [
      'No — prod has more rows',
      'Yes — both have 4 observations',
      'No — val has more rows',
      'Cannot tell from the log',
    ],
    correctIndex: 1,
    explanation: 'Both datasets contain four matching observations.',
    tags: ['validation', 'QC'],
  },
  {
    id: 'cc-cl-17',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'hard',
    title: 'Dose adjustment flag',
    instruction: 'Run the code. How many observations are in WORK.ADJUSTED?',
    starterCode: `data dosing;
  input usubjid $ planned actual;
  datalines;
S001 100 100
S002 100 80
S003 100 100
S004 100 60
S005 100 100
;
run;

data adj;
  set dosing;
  if actual < planned then adjfl = 'Y';
  else adjfl = 'N';
run;

data adjusted;
  set adj;
  if adjfl = 'Y';
run;

proc print data=adjusted;
run;`,
    solutionCode: `/* 2 dose adjustments */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'S002 (80) and S004 (60) are below planned dose 100.',
    tags: ['derivation', 'dosing'],
  },
  {
    id: 'cc-cl-18',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Concatenate site datasets',
    instruction: 'Run the code. How many observations are in WORK.ALLSITES?',
    starterCode: `data site01;
  input usubjid $;
  datalines;
S001
S002
;
run;

data site02;
  input usubjid $;
  datalines;
S003
S004
S005
;
run;

data allsites;
  set site01 site02;
run;

proc print data=allsites;
run;`,
    solutionCode: `/* 2+3=5 subjects */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'SET concatenates site01 (2) and site02 (3) → 5 rows.',
    tags: ['SET', 'concatenate', 'sites'],
  },
]
