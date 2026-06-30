import type { CodeChallenge } from '../codeChallenges'

export const CODE_BASE_EXTRA: CodeChallenge[] = [
  {
    id: 'cc-b-20',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'medium',
    title: 'INPUT with missing score',
    instruction:
      'Run the program. How many observations are in WORK.VALID after the subsetting step?',
    starterCode: `data team;
  input name $ dept $ score;
  datalines;
Ann Sales 88
Bob IT .
Cal Sales 91
Deb HR 76
Eve IT 85
;
run;

data valid;
  set team;
  if score > 80;
run;

proc print data=valid;
run;`,
    solutionCode: `data team;
  input name $ dept $ score;
  datalines;
Ann Sales 88
Bob IT .
Cal Sales 91
Deb HR 76
Eve IT 85
;
run;

data valid;
  set team;
  if score > 80;
run;`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation:
      'Missing (.) fails numeric comparisons. Rows with 88, 91, and 85 pass — 3 observations. Bob with missing score is dropped.',
    tags: ['INPUT', 'missing value', 'IF'],
  },
  {
    id: 'cc-b-21',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'easy',
    title: 'SET three-way concat',
    instruction: 'Run all steps. How many observations are in WORK.ALL?',
    starterCode: `data a;
  input x;
  datalines;
1
;
run;

data b;
  input x;
  datalines;
2
3
;
run;

data c;
  input x;
  datalines;
4
;
run;

data all;
  set a b c;
run;

proc print data=all;
run;`,
    solutionCode: `data a;
  input x;
  datalines;
1
;
run;

data b;
  input x;
  datalines;
2
3
;
run;

data c;
  input x;
  datalines;
4
;
run;

data all;
  set a b c;
run;`,
    options: ['1', '3', '4', '6'],
    correctIndex: 2,
    explanation: 'SET stacks datasets: 1 + 2 + 1 = 4 observations.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'cc-b-22',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'IF score threshold',
    instruction: 'Run the code. How many observations are in WORK.TOP?',
    starterCode: `data scores;
  input id score;
  datalines;
1 88
2 91
3 76
4 95
5 82
;
run;

data top;
  set scores;
  if score >= 90;
run;

proc print data=top;
run;`,
    solutionCode: `/* scores 91 and 95 pass >= 90 → 2 obs */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'Only id 2 (91) and id 4 (95) meet score >= 90.',
    tags: ['IF', 'subsetting'],
  },
  {
    id: 'cc-b-23',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'IF-THEN-ELSE status',
    instruction: 'Run the code. What is STATUS for id=3 in WORK.RESULT?',
    starterCode: `data raw;
  input id score;
  datalines;
1 55
2 72
3 88
4 45
;
run;

data result;
  set raw;
  if score >= 60 then status = 'Pass';
  else status = 'Fail';
run;

proc print data=result;
run;`,
    solutionCode: `/* id=3 score 88 → Pass */`,
    options: ['Pass', 'Fail', 'Missing', 'Error'],
    correctIndex: 0,
    explanation: 'Score 88 >= 60 assigns STATUS="Pass".',
    tags: ['IF-THEN-ELSE', 'character'],
  },
  {
    id: 'cc-b-24',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'SUM running total',
    instruction: 'Run the code. What is TOTAL on the **last** observation in WORK.CALC?',
    starterCode: `data sales;
  input day amount;
  datalines;
1 100
2 250
3 150
;
run;

data calc;
  set sales;
  total + amount;
run;

proc print data=calc;
run;`,
    solutionCode: `/* 100+250+150 = 500 on last row */`,
    options: ['150', '350', '500', '600'],
    correctIndex: 2,
    explanation: 'SUM statement accumulates: 100+250+150=500 on the final row.',
    tags: ['SUM statement', 'RETAIN'],
  },
  {
    id: 'cc-b-25',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'easy',
    title: 'MERGE 1:1 match',
    instruction: 'Run the code. How many observations are in WORK.JOINED?',
    starterCode: `data names;
  input id name $;
  datalines;
1 Ann
2 Bob
3 Cal
;
run;

data ages;
  input id age;
  datalines;
1 30
2 25
3 35
;
run;

data joined;
  merge names ages;
  by id;
run;

proc print data=joined;
run;`,
    solutionCode: `/* 3 matching ids → 3 obs */`,
    options: ['2', '3', '6', '9'],
    correctIndex: 1,
    explanation: 'One-to-one MERGE on three matching IDs produces three rows.',
    tags: ['MERGE', 'BY'],
  },
  {
    id: 'cc-b-26',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'easy',
    title: 'Subsetting with IF',
    instruction: 'Run the code. How many observations remain in WORK.PASS?',
    starterCode: `data grades;
  input student $ score;
  datalines;
Amy 92
Ben 58
Cia 77
Dan 45
Eve 83
;
run;

data pass;
  set grades;
  if score >= 60;
run;

proc print data=pass;
run;`,
    solutionCode: `/* 92, 77, 83 pass → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Amy (92), Cia (77), and Eve (83) pass the 60-point cutoff.',
    tags: ['IF', 'subsetting'],
  },
  {
    id: 'cc-b-27',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Character IF filter',
    instruction: 'Run the code. How many observations are in WORK.MALES?',
    starterCode: `data demo;
  input id sex $ age;
  datalines;
1 M 34
2 F 28
3 M 41
4 F 36
5 M 22
;
run;

data males;
  set demo;
  if sex = 'M';
run;

proc print data=males;
run;`,
    solutionCode: `/* sex=M: ids 1,3,5 → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Three rows have SEX="M".',
    tags: ['IF', 'character'],
  },
  {
    id: 'cc-b-28',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'easy',
    title: 'DO loop OUTPUT',
    instruction: 'Run the code. How many observations are in WORK.SERIES?',
    starterCode: `data series;
  do i = 1 to 6;
    value = i * 5;
    output;
  end;
run;

proc print data=series;
run;`,
    solutionCode: `/* DO 1 TO 6 with OUTPUT → 6 obs */`,
    options: ['1', '5', '6', '30'],
    correctIndex: 2,
    explanation: 'Each iteration writes one row; 6 iterations → 6 observations.',
    tags: ['DO loop', 'OUTPUT'],
  },
  {
    id: 'cc-b-29',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'medium',
    title: 'Two-dataset SET',
    instruction: 'Run the code. How many observations are in WORK.BOTH?',
    starterCode: `data north;
  input city $ pop;
  datalines;
Seoul 9700000
Busan 3400000
;
run;

data south;
  input city $ pop;
  datalines;
Daegu 2400000
;
run;

data both;
  set north south;
run;

proc print data=both;
run;`,
    solutionCode: `/* 2 + 1 = 3 obs */`,
    options: ['2', '3', '4', '6'],
    correctIndex: 1,
    explanation: 'SET concatenates north (2) and south (1) → 3 rows.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'cc-b-30',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Tax calculation',
    instruction: 'Run the code. What is TAX on the observation where ID=2?',
    starterCode: `data orders;
  input id amount;
  datalines;
1 200
2 500
3 150
;
run;

data taxed;
  set orders;
  tax = amount * 0.1;
run;

proc print data=taxed;
run;`,
    solutionCode: `/* id=2 amount=500 tax=50 */`,
    options: ['15', '20', '50', '500'],
    correctIndex: 2,
    explanation: 'TAX = amount × 0.1 → 500 × 0.1 = 50.',
    tags: ['assignment', 'expressions'],
  },
  {
    id: 'cc-b-31',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'Observation counter',
    instruction: 'Run the code. What is N on the **last** observation?',
    starterCode: `data events;
  input id event $;
  datalines;
1 start
1 stop
2 start
2 pause
2 stop
3 start
;
run;

data counted;
  set events;
  n + 1;
run;

proc print data=counted;
run;`,
    solutionCode: `/* n+1 SUM → last row N=6 */`,
    options: ['2', '4', '6', '8'],
    correctIndex: 2,
    explanation: 'n + 1 counts all rows; the sixth row shows N=6.',
    tags: ['SUM statement', 'count'],
  },
  {
    id: 'cc-b-32',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'FIRST. deduplication',
    instruction: 'Run the code. How many observations are in WORK.UNIQUE?',
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

data unique;
  set dup;
  by id;
  if first.id;
run;

proc print data=unique;
run;`,
    solutionCode: `/* first.id per group → 3 obs */`,
    options: ['2', '3', '5', '6'],
    correctIndex: 1,
    explanation: 'IF FIRST.id keeps the first row per ID → three observations.',
    tags: ['FIRST.', 'BY', 'dedup'],
  },
  {
    id: 'cc-b-33',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'hard',
    title: 'MERGE non-match rows',
    instruction: 'Run the code. How many observations are in WORK.M?',
    starterCode: `data left;
  input id a;
  datalines;
1 10
2 20
3 30
;
run;

data right;
  input id b;
  datalines;
1 100
2 200
4 400
;
run;

data m;
  merge left right;
  by id;
run;

proc print data=m;
run;`,
    solutionCode: `/* ids 1,2,3,4 → 4 obs full outer */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation: 'MERGE outputs all BY values: ids 1–4 → four rows (id 3 missing B, id 4 missing A).',
    tags: ['MERGE', 'BY', 'full outer'],
  },
  {
    id: 'cc-b-34',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'medium',
    title: 'WHERE numeric filter',
    instruction: 'Run the code. How many observations are in WORK.ADULTS?',
    starterCode: `data people;
  input name $ age;
  datalines;
Kim 17
Lee 22
Park 15
Choi 31
Jung 19
;
run;

data adults;
  set people;
  where age >= 18;
run;

proc print data=adults;
run;`,
    solutionCode: `/* ages 22, 31, 19 → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Lee (22), Choi (31), and Jung (19) are >= 18.',
    tags: ['WHERE', 'subsetting'],
  },
  {
    id: 'cc-b-35',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'Pipeline two filters',
    instruction: 'Run all steps. How many observations are in WORK.FINAL?',
    starterCode: `data source;
  input dept $ sales;
  datalines;
A 100
B 250
A 180
C 90
B 300
A 220
;
run;

data step1;
  set source;
  if dept = 'A';
run;

data final;
  set step1;
  if sales >= 150;
run;

proc print data=final;
run;`,
    solutionCode: `/* dept A: 100,180,220 → sales>=150: 180,220 → 2 obs */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'Dept A has three rows; only sales 180 and 220 exceed 150.',
    tags: ['IF', 'pipeline'],
  },
  {
    id: 'cc-b-36',
    cert: 'base',
    topic: 'reports',
    difficulty: 'easy',
    title: 'PROC PRINT rows',
    instruction: 'Run the code. How many data rows appear in PROC PRINT output (excluding header)?',
    starterCode: `data items;
  input sku $ price;
  datalines;
A01 9.99
A02 14.50
B01 7.25
B02 12.00
C01 5.99
;
run;

proc print data=items;
run;`,
    solutionCode: `/* 5 datalines → 5 print rows */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'Five observations are listed as rows 1–5.',
    tags: ['PROC PRINT'],
  },
  {
    id: 'cc-b-37',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'Grade assignment',
    instruction: 'Run the code. How many observations are in WORK.A_GRADE (GRADE="A")?',
    starterCode: `data tests;
  input name $ score;
  datalines;
Ann 91
Bob 72
Cal 88
Deb 55
Eve 94
;
run;

data graded;
  set tests;
  if score >= 90 then grade = 'A';
  else grade = 'OTHER';
run;

data a_grade;
  set graded;
  if grade = 'A';
run;

proc print data=a_grade;
run;`,
    solutionCode: `/* 2 rows with grade A after filter */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'Ann (91) and Eve (94) receive GRADE="A".',
    tags: ['IF-THEN-ELSE', 'nested'],
  },
  {
    id: 'cc-b-38',
    cert: 'base',
    topic: 'manage-data',
    difficulty: 'hard',
    title: 'Missing in comparison',
    instruction: 'Run the code. How many observations are in WORK.VALID?',
    starterCode: `data measures;
  input id reading;
  datalines;
1 120
2 .
3 98
4 110
5 .
;
run;

data valid;
  set measures;
  if reading > 0;
run;

proc print data=valid;
run;`,
    solutionCode: `/* . fails >0; 120,98,110 pass → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'Missing values fail numeric comparisons; three valid readings remain.',
    tags: ['missing value', 'IF'],
  },
  {
    id: 'cc-b-39',
    cert: 'base',
    topic: 'data-structures',
    difficulty: 'medium',
    title: 'Percent calculation',
    instruction: 'Run the code. What is PCT on the observation where PART=40?',
    starterCode: `data parts;
  input part total;
  datalines;
10 50
25 100
40 200
15 60
;
run;

data pctdata;
  set parts;
  pct = (part / total) * 100;
run;

proc print data=pctdata;
run;`,
    solutionCode: `/* 40/200*100 = 20 */`,
    options: ['10', '20', '25', '40'],
    correctIndex: 1,
    explanation: '(40 / 200) × 100 = 20%.',
    tags: ['expressions', 'percent'],
  },
]
