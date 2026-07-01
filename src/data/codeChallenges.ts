import type { CertId } from './types'
import { CODE_BASE_EXTRA } from './extra/code-base'
import { CODE_CLINICAL_EXTRA } from './extra/code-clinical'
import { CODE_ADVANCED_EXTRA } from './extra/code-advanced'
import { CODE_UPGRADES } from './upgrade/code-upgrades'
import { applyCodeUpgrades } from '../lib/mergeUpgrades'
import { applyKoPatches } from '../lib/applyKoPatches'
import { KO_PATCHES } from './locale'

export interface CodeChallenge {
  id: string
  cert: CertId
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  title: string
  instruction: string
  starterCode: string
  solutionCode: string
  options: string[]
  correctIndex: number
  explanation: string
  explanationKo?: string
  hint?: string
  tags: string[]
}

const RAW_CODE_CHALLENGES: CodeChallenge[] = [
  // ─── BASE ───
  {
    id: 'cc-b-01',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'easy',
    title: 'Count observations',
    instruction:
      'Run the code below. How many observations does the WORK.SCORES dataset contain? (Check the Log tab for the NOTE line, or count rows in Output.)',
    starterCode: `data scores;
  input id score;
  datalines;
1 85
2 92
3 78
4 95
5 88
;
run;

proc print data=scores;
run;`,
    solutionCode: `/* 5 datalines → 5 observations */
data scores;
  input id score;
  datalines;
1 85
2 92
3 78
4 95
5 88
;
run;`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'Five data lines after DATALINES produce five observations.',
    explanationKo: 'DATALINES 다음 5줄 → observation 5개.',
    hint: 'Look for "has N observations" in the Log.',
    tags: ['DATA step', 'INPUT', 'observations'],
  },
  {
    id: 'cc-b-02',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'medium',
    title: 'SET concatenate',
    instruction:
      'Run both DATA steps and the SET step. How many observations are in WORK.COMBINED?',
    starterCode: `data east;
  input city $ sales;
  datalines;
NYC 100
BOS 80
;
run;

data west;
  input city $ sales;
  datalines;
LA 120
SEA 90
;
run;

data combined;
  set east west;
run;

proc print data=combined;
run;`,
    solutionCode: `/* SET stacks datasets: 2 + 2 = 4 obs */
data combined;
  set east west;
run;`,
    options: ['2', '3', '4', '8'],
    correctIndex: 2,
    explanation: 'SET vertically concatenates datasets. East has 2 rows, West has 2 rows → 4 total.',
    explanationKo: 'SET은 세로 연결. 2+2=4개 observation.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'cc-b-03',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'medium',
    title: 'IF subset filter',
    instruction: 'Run the code. How many observations are written to WORK.HIGH?',
    starterCode: `data scores;
  input id score;
  datalines;
1 85
2 92
3 71
4 88
5 95
;
run;

data high;
  set scores;
  if score >= 88;
run;

proc print data=high;
run;`,
    solutionCode: `/* id 1(85)? no. 2(92),4(88),5(95) → 3 obs */
data high;
  set scores;
  if score >= 88;
run;`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'IF score >= 88 keeps observations with 92, 88, and 95 — three rows.',
    tags: ['IF', 'subsetting'],
  },
  {
    id: 'cc-b-04',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'easy',
    title: 'Derived character variable',
    instruction:
      'Run the code. What is the value of STATUS for the first observation (id=1) in WORK.RESULT?',
    starterCode: `data result;
  input id score;
  if score >= 80 then status = 'Pass';
  else status = 'Fail';
  datalines;
1 85
2 70
3 90
;
run;

proc print data=result;
run;`,
    solutionCode: `/* id=1 score=85 → Pass */
if score >= 80 then status = 'Pass';`,
    options: ['Pass', 'Fail', 'Missing (.)', 'Error'],
    correctIndex: 0,
    explanation: 'Score 85 meets >= 80, so STATUS is assigned Pass before the row is output.',
    tags: ['IF-THEN', 'character variables'],
  },
  {
    id: 'cc-b-05',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'SUM statement total',
    instruction:
      'Run the code. What is the value of TOTAL on the **last** observation in WORK.CALC?',
    starterCode: `data calc;
  input amount;
  total + amount;
  datalines;
10
20
30
;
run;

proc print data=calc;
run;`,
    solutionCode: `/* SUM statement: 10+20+30 = 60 on last row */
total + amount;`,
    options: ['30', '60', '10', 'Missing (.)'],
    correctIndex: 1,
    explanation: 'The SUM statement (total + amount;) implicitly retains TOTAL. Last row shows 10+20+30=60.',
    explanationKo: 'SUM statement는 누적 합계. 마지막 observation의 total=60.',
    tags: ['SUM statement', 'RETAIN'],
  },
  {
    id: 'cc-b-06',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'Missing value comparison',
    instruction: 'Run the code. How many observations are in WORK.FILTERED?',
    starterCode: `data raw;
  input id value;
  datalines;
1 50
2 .
3 75
4 .
5 80
;
run;

data filtered;
  set raw;
  if value > 60;
run;

proc print data=filtered;
run;`,
    solutionCode: `/* Missing fails IF value>60. Keeps id 1(50)? no. 3(75),5(80) → 2 */
data filtered;
  set raw;
  if value > 60;
run;`,
    options: ['1', '2', '3', '5'],
    correctIndex: 1,
    explanation: 'Missing (.) is treated as false in comparisons. Only id 3 (75) and id 5 (80) pass value > 60.',
    tags: ['missing values', 'IF'],
  },
  {
    id: 'cc-b-07',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Arithmetic assignment',
    instruction: 'Run the code. What is BONUS on observation 2 (id=2)?',
    starterCode: `data pay;
  input id salary;
  bonus = salary * 0.1;
  datalines;
1 50000
2 60000
3 45000
;
run;

proc print data=pay;
run;`,
    solutionCode: `bonus = salary * 0.1;  /* 60000 * 0.1 = 6000 */`,
    options: ['5000', '6000', '4500', '600'],
    correctIndex: 1,
    explanation: 'For id=2, salary=60000, bonus=60000*0.1=6000.',
    tags: ['assignment', 'expressions'],
  },
  {
    id: 'cc-b-08',
    cert: 'base',
    topic: 'error-handling',
    difficulty: 'easy',
    title: 'Fix the bug',
    instruction:
      'The code below has a syntax error. Fix it, run successfully, then answer: how many observations are created?',
    starterCode: `data fixed;
  input x y
  datalines;
1 2
3 4
;
run;

proc print data=fixed;
run;`,
    solutionCode: `data fixed;
  input x y;
  datalines;
1 2
3 4
;
run;`,
    options: ['0 — step fails', '1', '2', '4'],
    correctIndex: 2,
    explanation: 'Missing semicolon after INPUT causes an error. After fixing with INPUT x y;, two datalines create 2 observations.',
    hint: 'Check the Log for ERROR. SAS statements end with semicolons.',
    tags: ['syntax error', 'semicolon'],
  },
  {
    id: 'cc-b-09',
    cert: 'base',
    topic: 'reports',
    difficulty: 'easy',
    title: 'PROC PRINT row count',
    instruction: 'Run the code. How many data rows appear in the PROC PRINT output (excluding header)?',
    starterCode: `data team;
  input name $ dept $;
  datalines;
Ann Sales
Bob IT
Cal Sales
;
run;

proc print data=team;
run;`,
    solutionCode: `/* 3 datalines → 3 print rows */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'Three observations are printed as rows 1–3 in the Output window.',
    tags: ['PROC PRINT'],
  },
  {
    id: 'cc-b-10',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'Conditional + filter combo',
    instruction: 'Run the code. How many observations are in WORK.FINAL?',
    starterCode: `data source;
  input id type $ amt;
  datalines;
1 A 100
2 B 200
3 A 150
4 B 50
5 A 300
;
run;

data final;
  set source;
  if type = 'A';
  tax = amt * 0.1;
run;

proc print data=final;
run;`,
    solutionCode: `/* type=A: id 1,3,5 → 3 observations */
if type = 'A';`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Character comparison type = "A" keeps three rows. TAX is computed for each.',
    tags: ['IF', 'character', 'assignment'],
  },
  {
    id: 'cc-b-11',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'medium',
    title: 'Two-step pipeline',
    instruction:
      'Run all steps. After filtering, what is the highest SCORE value printed in WORK.TOP?',
    starterCode: `data raw;
  input name $ score;
  datalines;
Amy 78
Ben 91
Cara 85
Dan 91
;
run;

data top;
  set raw;
  if score >= 85;
run;

proc print data=top;
run;`,
    solutionCode: `/* Kept: Ben 91, Cara 85, Dan 91 → max score 91 */`,
    options: ['78', '85', '91', '93'],
    correctIndex: 2,
    explanation: 'IF score >= 85 keeps 85, 91, 91. Maximum score among them is 91.',
    tags: ['pipeline', 'IF'],
  },
  {
    id: 'cc-b-12',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Complete the program',
    instruction:
      'Fill in the missing filter so that only scores above 70 are kept. Edit the code if needed, run it, and select how many observations remain.',
    starterCode: `data scores;
  input id score;
  datalines;
1 65
2 72
3 80
4 58
;
run;

data pass;
  set scores;
  /* ADD YOUR FILTER HERE — e.g. if score > 70; */
run;

proc print data=pass;
run;`,
    solutionCode: `data scores;
  input id score;
  datalines;
1 65
2 72
3 80
4 58
;
run;

data pass;
  set scores;
  if score > 70;
run;`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'Scores 72 and 80 are > 70. Two observations remain.',
    tags: ['IF', 'complete code'],
  },

  // ─── CLINICAL ───
  {
    id: 'cc-cl-01',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'medium',
    title: 'Change from baseline',
    instruction:
      'Run the code. Subject 102 has baseline score 120 and follow-up 135. What is CHG on the last row?',
    starterCode: `data lbs;
  input usubjid score;
  datalines;
102 120
102 135
;
run;

data chg;
  set lbs;
  chg = score - 120;
run;

proc print data=chg;
run;`,
    solutionCode: `chg = score - 120;  /* last row: 135-120 = 15 */`,
    options: ['15', '135', '120', '255'],
    correctIndex: 0,
    explanation: 'Change from baseline = 135 − 120 = 15 on the follow-up row.',
    explanationKo: 'CHG = 135 - 120 = 15.',
    tags: ['change from baseline'],
  },
  {
    id: 'cc-cl-02',
    cert: 'clinical',
    topic: 'manage-data',
    difficulty: 'easy',
    title: 'Subject count',
    instruction: 'Run the code. How many unique subjects (rows) are in WORK.DM?',
    starterCode: `data dm;
  input usubjid $ age sex $;
  datalines;
S001 45 M
S002 52 F
S003 38 M
S004 61 F
S005 29 M
;
run;

proc print data=dm;
run;`,
    solutionCode: `/* 5 subjects in DM */`,
    options: ['3', '4', '5', '10'],
    correctIndex: 2,
    explanation: 'Five datalines → five subject records in DM.',
    tags: ['DM', 'demographics'],
  },
  {
    id: 'cc-cl-03',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'medium',
    title: 'AE record count',
    instruction: 'Run the code. How many adverse event records are in WORK.AE after filtering SERIOUS events?',
    starterCode: `data ae_raw;
  input usubjid $ aeterm $ serious $;
  datalines;
S001 Headache N
S001 Nausea Y
S002 Rash N
S002 Fever Y
S003 Fatigue Y
;
run;

data ae;
  set ae_raw;
  if serious = 'Y';
run;

proc print data=ae;
run;`,
    solutionCode: `/* serious=Y: 3 records */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Three records have serious=Y (Nausea, Fever, Fatigue).',
    tags: ['AE', 'filtering'],
  },
  {
    id: 'cc-cl-04',
    cert: 'clinical',
    topic: 'statistics',
    difficulty: 'easy',
    title: 'Group mean (manual)',
    instruction:
      'Run the code. The program computes total TRT and total PLACEBO sales. What is TRT total?',
    starterCode: `data sales;
  input arm $ rev;
  datalines;
TRT 100
TRT 150
PLACEBO 80
PLACEBO 90
TRT 50
;
run;

data sums;
  set sales;
  if arm = 'TRT' then trt_tot + rev;
  if arm = 'PLACEBO' then plc_tot + rev;
run;

proc print data=sums;
run;`,
    solutionCode: `/* TRT: 100+150+50 = 300 on last row */`,
    options: ['200', '250', '300', '350'],
    correctIndex: 2,
    explanation: 'SUM statement accumulates TRT revenues: 100+150+50=300 on the final observation.',
    tags: ['SUM statement', 'clinical summary'],
  },
  {
    id: 'cc-cl-05',
    cert: 'clinical',
    topic: 'validation',
    difficulty: 'medium',
    title: 'Row count QC',
    instruction:
      'Run production and validation datasets. Do they have the same number of observations?',
    starterCode: `data prod;
  input id result;
  datalines;
1 10
2 20
3 30
;
run;

data val;
  input id result;
  datalines;
1 10
2 20
3 30
;
run;

proc print data=prod;
run;

proc print data=val;
run;`,
    solutionCode: `/* Both have 3 obs — QC pass for row count */`,
    options: [
      'Yes — both have 3 observations',
      'No — prod has more',
      'No — val has more',
      'Cannot tell',
    ],
    correctIndex: 0,
    explanation: 'Both datasets have 3 observations. Row-count QC check passes.',
    tags: ['validation', 'QC'],
  },
  {
    id: 'cc-cl-06',
    cert: 'clinical',
    topic: 'transform-data',
    difficulty: 'hard',
    title: 'Lab flag derivation',
    instruction: 'Run the code. How many observations have FLAG="HIGH"?',
    starterCode: `data lb;
  input usubjid $ lbtest $ lbval refhigh;
  datalines;
S001 GLUC 110 100
S002 GLUC 95 100
S003 GLUC 120 100
S004 GLUC 88 100
;
run;

data flagged;
  set lb;
  if lbval > refhigh then flag = 'HIGH';
  else flag = 'NORMAL';
run;

proc print data=flagged;
run;`,
    solutionCode: `/* lbval>100: S001(110), S003(120) → 2 HIGH */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'GLUC 110 and 120 exceed refhigh 100 → two HIGH flags.',
    tags: ['LB', 'derivation'],
  },

  // ─── ADVANCED ───
  {
    id: 'cc-ad-01',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: 'Variable assignment chain',
    instruction:
      'Run the code. What is the value of X2 on the single observation in WORK.ARR?',
    starterCode: `data arr;
  x1 = 10;
  x2 = 20;
  x3 = 30;
run;

proc print data=arr;
run;`,
    solutionCode: `/* x2 = 20 */`,
    options: ['10', '20', '30', 'Missing'],
    correctIndex: 1,
    explanation: 'Direct assignment sets x2=20. (ARRAY syntax requires full SAS — practice arrays conceptually in Study Mode.)',
    tags: ['assignment', 'DATA step'],
  },
  {
    id: 'cc-ad-02',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'easy',
    title: 'DO loop count',
    instruction: 'Run the code. How many observations are in WORK.MULTI?',
    starterCode: `data multi;
  do i = 1 to 5;
    value = i * 2;
    output;
  end;
run;

proc print data=multi;
run;`,
    solutionCode: `/* OUTPUT each iteration: 5 obs */`,
    options: ['1', '4', '5', '10'],
    correctIndex: 2,
    explanation: 'DO i=1 TO 5 with explicit OUTPUT creates 5 observations.',
    hint: 'Each OUTPUT writes one row.',
    tags: ['DO loop', 'OUTPUT'],
  },
  {
    id: 'cc-ad-03',
    cert: 'advanced',
    topic: 'sql',
    difficulty: 'medium',
    title: 'Manual join with SET',
    instruction:
      'Run the code (DATA-step join simulation). How many observations are in WORK.MERGED?',
    starterCode: `data demo;
  input id name $;
  datalines;
1 Ann
2 Bob
3 Cal
;
run;

data scores;
  input id score;
  datalines;
1 90
2 85
3 88
;
run;

data merged;
  merge demo scores;
  by id;
run;

proc print data=merged;
run;`,
    solutionCode: `/* MERGE 1:1 on id → 3 obs (simulator basic merge) */`,
    options: ['2', '3', '4', '6'],
    correctIndex: 1,
    explanation: 'One-to-one merge on ID combines three matching rows.',
    tags: ['MERGE', 'BY'],
  },
  {
    id: 'cc-ad-04',
    cert: 'advanced',
    topic: 'macro',
    difficulty: 'easy',
    title: 'Macro variable math (on paper + run DATA)',
    instruction:
      'The DATA step uses a computed value. Run the code — what is PCT on the last row?',
    starterCode: `data pctdemo;
  input part total;
  pct = (part / total) * 100;
  datalines;
25 100
40 200
15 60
;
run;

proc print data=pctdemo;
run;`,
    solutionCode: `/* last row: 15/60*100 = 25 */`,
    options: ['15', '25', '60', '100'],
    correctIndex: 1,
    explanation: 'Last dataline: part=15, total=60, pct=(15/60)*100=25.',
    tags: ['expressions', 'percent'],
  },
  {
    id: 'cc-ad-05',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    title: 'Running count with SUM',
    instruction: 'Run the code. What is N on the **last** observation?',
    starterCode: `data events;
  input id event $;
  datalines;
1 A
1 B
2 A
2 C
3 A
;
run;

data counted;
  set events;
  n + 1;
run;

proc print data=counted;
run;`,
    solutionCode: `/* n + 1 sums to 5 on last row */`,
    options: ['1', '3', '5', '6'],
    correctIndex: 2,
    explanation: 'n + 1 is a SUM statement counting observations. Last row shows N=5.',
    tags: ['SUM statement', 'count'],
  },
  {
    id: 'cc-ad-06',
    cert: 'advanced',
    topic: 'sql',
    difficulty: 'medium',
    title: 'Duplicate removal logic',
    instruction:
      'Run the code. How many observations remain after keeping first occurrence per ID?',
    starterCode: `data dup;
  input id value;
  datalines;
1 10
1 20
2 30
2 40
3 50
;
run;

data nodup;
  set dup;
  by id;
  if first.id;
run;

proc print data=nodup;
run;`,
    solutionCode: `/* first.id per group: 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'IF FIRST.id outputs first row per ID → three observations.',
    tags: ['FIRST.', 'dedup'],
  },
  {
    id: 'cc-ad-07',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: 'Nested DO',
    instruction: 'Run the code. How many observations are created?',
    starterCode: `data grid;
  do row = 1 to 2;
    do col = 1 to 3;
      cell = row * col;
      output;
    end;
  end;
run;

proc print data=grid;
run;`,
    solutionCode: `/* 2*3 = 6 OUTPUT statements */`,
    options: ['2', '3', '5', '6'],
    correctIndex: 3,
    explanation: 'Nested loops 2×3 with OUTPUT each inner iteration → 6 observations.',
    tags: ['DO loop', 'nested'],
  },
  {
    id: 'cc-b-16',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'hard',
    title: 'MERGE — extra LEFT rows',
    instruction:
      'Run the code. Dataset A has ids 1–4; B has ids 1–2 only. How many observations are in WORK.M?',
    starterCode: `data a;
  input id val;
  datalines;
1 10
2 20
3 30
4 40
;
run;

data b;
  input id flag;
  datalines;
1 1
2 1
;
run;

data m;
  merge a b;
  by id;
run;

proc print data=m;
run;`,
    solutionCode: `/* full outer merge → 4 rows from A */`,
    options: ['2', '4', '6', '8'],
    correctIndex: 1,
    explanation: 'MERGE keeps all BY groups from either table. Four ids in A → 4 observations (classic exam trap).',
    hint: 'Non-matching rows from A still appear with missing B values.',
    tags: ['MERGE', 'BY', 'exam trap'],
  },
  {
    id: 'cc-b-17',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'Missing values in IF',
    instruction: 'Run the code. How many observations are in WORK.KEEP?',
    starterCode: `data scores;
  input id score;
  datalines;
1 85
2 .
3 90
4 75
;
run;

data keep;
  set scores;
  if score > 80;
run;

proc print data=keep;
run;`,
    solutionCode: `/* 85 and 90 pass; . and 75 fail → 2 obs */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'Missing (.) is false in numeric comparisons. Only id 1 and 3 qualify.',
    tags: ['IF', 'missing value', 'subsetting'],
  },
  {
    id: 'cc-b-18',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'WHERE on SET',
    instruction: 'Run the code. How many observations are in WORK.SUB?',
    starterCode: `data class;
  input name $ age;
  datalines;
Ann 14
Bob 13
Cal 15
Deb 12
;
run;

data sub;
  set class;
  where age >= 14;
run;

proc print data=sub;
run;`,
    solutionCode: `/* ages 14 and 15 → Ann, Cal */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'WHERE age >= 14 keeps Ann (14) and Cal (15) — two observations.',
    tags: ['WHERE', 'subsetting'],
  },
  {
    id: 'cc-b-19',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'hard',
    title: 'One-to-many MERGE',
    instruction:
      'Run the code. A has 2 obs, B has 4 obs with duplicate BY ids. How many observations in WORK.M?',
    starterCode: `data a;
  input id dept $;
  datalines;
1 HR
2 IT
;
run;

data b;
  input id salary;
  datalines;
1 50000
1 52000
2 60000
2 62000
;
run;

data m;
  merge a b;
  by id;
run;

proc print data=m;
run;`,
    solutionCode: `/* 2 dept rows × 2 salary rows per id = 4 */`,
    options: ['2', '4', '6', '8'],
    correctIndex: 1,
    explanation:
      'One-to-many MERGE: each id has 1 dept row and 2 salary rows → 2 combinations per id × 2 ids = 4 observations.',
    tags: ['MERGE', 'BY', 'many-to-many'],
  },
  ...CODE_BASE_EXTRA,
  ...CODE_CLINICAL_EXTRA,
  ...CODE_ADVANCED_EXTRA,
]

export const CODE_CHALLENGES = applyKoPatches(
  applyCodeUpgrades(RAW_CODE_CHALLENGES, CODE_UPGRADES),
  KO_PATCHES
)

export function getChallengesForCert(cert: CertId): CodeChallenge[] {
  return CODE_CHALLENGES.filter((c) => c.cert === cert)
}
