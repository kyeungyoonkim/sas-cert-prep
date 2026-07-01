import type { CodeChallenge } from '../codeChallenges'

export const CODE_EXPANSION_BASE: CodeChallenge[] = [
  {
    id: 'cc-b-40',
    cert: 'base',
    topic: 'error-handling',
    difficulty: 'medium',
    title: 'Drop missing quantities',
    instruction:
      'Run the program. How many observations are in WORK.CLEAN after removing invalid or zero quantities?',
    starterCode: `data orders;
  input id qty;
  datalines;
1 10
2 .
3 25
4 0
5 15
;
run;

data clean;
  set orders;
  if qty > 0;
run;

proc print data=clean;
run;`,
    solutionCode: `/* missing (.) and 0 fail qty > 0 → ids 1,3,5 → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation:
      'Missing values fail numeric comparisons. Rows with qty 10, 25, and 15 pass qty > 0; the missing row (id=2) and zero row (id=4) are dropped — 3 observations.',
    explanationKo:
      '결측값은 숫자 비교에서 false가 됩니다. qty가 10, 25, 15인 행만 qty > 0을 통과하고, 결측(id=2)과 0(id=4) 행은 제외되어 3개 observation이 남습니다.',
    hint: 'In SAS, missing (.) is treated as less than any positive number in comparisons.',
    tags: ['missing value', 'IF', 'invalid data'],
  },
  {
    id: 'cc-b-41',
    cert: 'base',
    topic: 'error-handling',
    difficulty: 'hard',
    title: 'Invalid numeric becomes missing',
    instruction:
      'Run the code. How many observations are in WORK.KEEP after the positive-amount filter?',
    starterCode: `data raw;
  input id amount;
  datalines;
1 100
2 abc
3 300
4 50
;
run;

data keep;
  set raw;
  if amount > 0;
run;

proc print data=keep;
run;`,
    solutionCode: `/* abc → missing, fails >0; 100,300,50 pass → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation:
      'Invalid numeric input (abc) becomes missing (.), which fails amount > 0. Rows with 100, 300, and 50 pass — 3 observations remain.',
    explanationKo:
      '잘못된 숫자 입력(abc)은 결측(.)이 되어 amount > 0 비교에 실패합니다. 100, 300, 50인 행만 통과하여 3개 observation이 남습니다.',
    hint: 'Check the Log for invalid-data notes; the row is still written unless you subset it out.',
    tags: ['invalid data', 'missing value', 'INPUT'],
  },
  {
    id: 'cc-b-42',
    cert: 'base',
    topic: 'reports',
    difficulty: 'easy',
    title: 'PROC PRINT full listing',
    instruction:
      'Run the code. How many data rows appear in the PROC PRINT output (excluding the header row)?',
    starterCode: `data products;
  input sku $ price;
  datalines;
A01 9.99
A02 14.50
B01 7.25
B02 12.00
C01 5.99
D01 3.50
;
run;

proc print data=products;
run;`,
    solutionCode: `/* 6 datalines → 6 print rows */`,
    options: ['4', '5', '6', '7'],
    correctIndex: 2,
    explanation:
      'Six DATALINES rows create six observations; PROC PRINT lists each as one data row (rows 1–6).',
    explanationKo:
      'DATALINES 6행이 6개 observation을 만들고, PROC PRINT는 각각을 데이터 행 1개씩(1~6행) 출력합니다.',
    hint: 'Count observations in the Log NOTE or numbered rows in the Output listing.',
    tags: ['PROC PRINT', 'listing'],
  },
  {
    id: 'cc-b-43',
    cert: 'base',
    topic: 'reports',
    difficulty: 'medium',
    title: 'PROC PRINT after filter',
    instruction:
      'Run all steps. How many data rows appear in the PROC PRINT output for WORK.ACTIVE_ONLY?',
    starterCode: `data staff;
  input name $ dept $ active;
  datalines;
Ann Sales 1
Bob IT 0
Cal Sales 1
Deb HR 1
Eve IT 0
;
run;

data active_only;
  set staff;
  if active = 1;
run;

proc print data=active_only;
run;`,
    solutionCode: `/* active=1: Ann, Cal, Deb → 3 print rows */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation:
      'IF active = 1 keeps Ann, Cal, and Deb. PROC PRINT shows three data rows for the filtered dataset.',
    explanationKo:
      'IF active = 1 조건으로 Ann, Cal, Deb만 남습니다. PROC PRINT는 필터된 데이터셋의 3개 데이터 행을 출력합니다.',
    hint: 'Apply the IF filter first, then count rows in the PRINT listing — not the original STAFF count.',
    tags: ['PROC PRINT', 'IF', 'subsetting'],
  },
  {
    id: 'cc-b-44',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'WHERE age cutoff',
    instruction:
      'Run the program. How many observations are in WORK.ADULTS after the WHERE subset?',
    starterCode: `data patients;
  input name $ age;
  datalines;
Kim 15
Lee 22
Park 14
Choi 31
Jung 19
Min 12
;
run;

data adults;
  set patients;
  where age >= 18;
run;

proc print data=adults;
run;`,
    solutionCode: `/* ages 22, 31, 19 → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Lee (22), Choi (31), and Jung (19) satisfy age >= 18 — 3 observations.',
    explanationKo: 'Lee(22), Choi(31), Jung(19)가 age >= 18 조건을 만족하여 3개 observation이 남습니다.',
    hint: 'WHERE filters before the row is written to the output dataset — same rows you see in PROC PRINT.',
    tags: ['WHERE', 'subsetting'],
  },
  {
    id: 'cc-b-45',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Pass/Fail then subset',
    instruction:
      'Run all steps. How many observations are in WORK.PASSED?',
    starterCode: `data tests;
  input id score;
  datalines;
1 55
2 72
3 88
4 45
5 90
;
run;

data graded;
  set tests;
  if score >= 60 then result = 'Pass';
  else result = 'Fail';
run;

data passed;
  set graded;
  if result = 'Pass';
run;

proc print data=passed;
run;`,
    solutionCode: `/* Pass: ids 2,3,5 → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation:
      'Scores 72, 88, and 90 receive RESULT="Pass". The second DATA step keeps those three rows.',
    explanationKo:
      '점수 72, 88, 90이 RESULT="Pass"를 받습니다. 두 번째 DATA step에서 이 세 행만 남아 3개 observation입니다.',
    hint: 'Trace IF-THEN-ELSE first, then count rows where RESULT equals Pass.',
    tags: ['IF-THEN-ELSE', 'pipeline'],
  },
  {
    id: 'cc-b-46',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'Two-step regional filter',
    instruction:
      'Run all steps. How many observations are in WORK.BIG_E?',
    starterCode: `data sales;
  input region $ amount;
  datalines;
E 100
W 250
E 180
S 90
W 300
E 220
;
run;

data region_e;
  set sales;
  if region = 'E';
run;

data big_e;
  set region_e;
  if amount >= 150;
run;

proc print data=big_e;
run;`,
    solutionCode: `/* region E: 100,180,220 → amount>=150: 180,220 → 2 obs */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation:
      'Region E has three rows (100, 180, 220). Only amounts 180 and 220 meet amount >= 150 — 2 observations.',
    explanationKo:
      'region E는 100, 180, 220 세 행입니다. amount >= 150을 만족하는 180과 220만 남아 2개 observation입니다.',
    hint: 'Apply filters in pipeline order: region first, then the amount threshold.',
    tags: ['IF', 'pipeline', 'character filter'],
  },
  {
    id: 'cc-b-47',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'medium',
    title: 'SET quarterly revenue',
    instruction:
      'Run all steps. How many observations are in WORK.ANNUAL?',
    starterCode: `data q1;
  input id rev;
  datalines;
1 100
2 200
;
run;

data q2;
  input id rev;
  datalines;
3 150
;
run;

data q3;
  input id rev;
  datalines;
4 175
5 225
;
run;

data annual;
  set q1 q2 q3;
run;

proc print data=annual;
run;`,
    solutionCode: `/* SET stacks 2+1+2 = 5 obs */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'SET vertically concatenates Q1 (2), Q2 (1), and Q3 (2) → 5 observations.',
    explanationKo: 'SET은 Q1(2) + Q2(1) + Q3(2)를 세로로 쌓아 5개 observation을 만듭니다.',
    hint: 'SET stacks datasets — add each source dataset row count separately.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'cc-b-48',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'hard',
    title: 'MERGE with unmatched keys',
    instruction:
      'Run the code. How many observations are in WORK.COMBINED?',
    starterCode: `data left;
  input id name $;
  datalines;
1 Ann
2 Bob
5 Eve
;
run;

data right;
  input id dept $;
  datalines;
1 Sales
3 IT
5 HR
;
run;

data combined;
  merge left right;
  by id;
run;

proc print data=combined;
run;`,
    solutionCode: `/* ids 1,2,3,5 → 4 obs (non-matches included) */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation:
      'MERGE outputs all BY values: ids 1, 2, 3, and 5 → four rows (id 2 missing DEPT, id 3 missing NAME).',
    explanationKo:
      'MERGE는 모든 BY 값을 출력합니다: id 1, 2, 3, 5 → 4행(id 2는 DEPT 결측, id 3는 NAME 결측).',
    hint: 'Unmatched keys still produce a row — check every unique ID across both tables.',
    tags: ['MERGE', 'BY', 'full outer'],
  },
  {
    id: 'cc-b-49',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'hard',
    title: 'FIRST. first visit per patient',
    instruction:
      'Run the program. How many observations are in WORK.FIRST_VISIT?',
    starterCode: `data visits;
  input patient $ visitdate;
  datalines;
P001 1
P001 2
P002 3
P002 4
P002 5
P003 6
;
run;

data first_visit;
  set visits;
  by patient;
  if first.patient;
run;

proc print data=first_visit;
run;`,
    solutionCode: `/* first.patient per group → 3 obs */`,
    options: ['2', '3', '5', '6'],
    correctIndex: 1,
    explanation:
      'IF FIRST.patient keeps the first row for each PATIENT value — P001, P002, and P003 → 3 observations.',
    explanationKo:
      'IF FIRST.patient는 각 PATIENT 그룹의 첫 행만 유지합니다 — P001, P002, P003 → 3개 observation.',
    hint: 'Count distinct PATIENT values — FIRST. outputs one row per group.',
    tags: ['FIRST.', 'BY', 'dedup'],
  },
]
