import type { CodeChallenge } from '../codeChallenges'

export const CODE_ADVANCED_EXTRA: CodeChallenge[] = [
  {
    id: 'cc-ad-08',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'easy',
    title: 'DO loop squares',
    instruction: 'Run the code. What is SQ on the **last** observation in WORK.SQUARES?',
    starterCode: `data squares;
  do n = 1 to 5;
    sq = n * n;
    output;
  end;
run;

proc print data=squares;
run;`,
    solutionCode: `/* last n=5 sq=25 */`,
    options: ['9', '16', '25', '36'],
    correctIndex: 2,
    explanation: 'Last iteration: n=5, sq=5×5=25.',
    tags: ['DO loop', 'OUTPUT'],
  },
  {
    id: 'cc-ad-09',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: 'Nested DO grid size',
    instruction: 'Run the code. How many observations are in WORK.GRID?',
    starterCode: `data grid;
  do r = 1 to 3;
    do c = 1 to 2;
      val = r * c;
      output;
    end;
  end;
run;

proc print data=grid;
run;`,
    solutionCode: `/* 3×2=6 OUTPUT */`,
    options: ['3', '5', '6', '9'],
    correctIndex: 2,
    explanation: 'Nested loops 3×2 with OUTPUT → 6 observations.',
    tags: ['DO loop', 'nested'],
  },
  {
    id: 'cc-ad-10',
    cert: 'advanced',
    topic: 'sql',
    difficulty: 'medium',
    title: 'MERGE demographics',
    instruction: 'Run the code. How many observations are in WORK.COMBINED?',
    starterCode: `data demo;
  input id gender $;
  datalines;
1 M
2 F
3 M
4 F
;
run;

data labs;
  input id glucose;
  datalines;
1 95
2 102
3 88
4 110
;
run;

data combined;
  merge demo labs;
  by id;
run;

proc print data=combined;
run;`,
    solutionCode: `/* 4 matching ids → 4 obs */`,
    options: ['2', '4', '6', '8'],
    correctIndex: 1,
    explanation: 'MERGE BY id on four matching rows → four observations.',
    tags: ['MERGE', 'BY'],
  },
  {
    id: 'cc-ad-11',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    title: 'Running total on subset',
    instruction: 'Run the code. What is TOT on the **last** observation in WORK.EAST_TOT?',
    starterCode: `data east;
  input amount;
  datalines;
100
150
50
;
run;

data east_tot;
  set east;
  tot + amount;
run;

proc print data=east_tot;
run;`,
    solutionCode: `/* 100+150+50=300 on last row */
data east;
  input amount;
  datalines;
100
150
50
;
run;

data east_tot;
  set east;
  tot + amount;
run;`,
    options: ['150', '250', '300', '350'],
    correctIndex: 2,
    explanation: 'SUM statement: 100+150+50=300 on the final row.',
    tags: ['SUM statement', 'running total'],
  },
  {
    id: 'cc-ad-12',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: 'Explicit OUTPUT count',
    instruction: 'Run the code. How many observations are in WORK.MULTI?',
    starterCode: `data multi;
  do x = 10 to 14;
    sq = x * x;
    output;
  end;
run;

proc print data=multi;
run;`,
    solutionCode: `/* x=10,11,12,13,14 → 5 obs */`,
    options: ['1', '4', '5', '10'],
    correctIndex: 2,
    explanation: 'DO x=10 TO 14 with OUTPUT creates five rows.',
    tags: ['DO loop', 'OUTPUT'],
  },
  {
    id: 'cc-ad-13',
    cert: 'advanced',
    topic: 'sql',
    difficulty: 'hard',
    title: 'Duplicate key expansion',
    instruction: 'Run the code. How many observations are in WORK.EXPANDED?',
    starterCode: `data a;
  input id grp $;
  datalines;
1 X
1 X
2 Y
;
run;

data b;
  input id score;
  datalines;
1 80
1 90
2 70
;
run;

data expanded;
  merge a b;
  by id;
run;

proc print data=expanded;
run;`,
    solutionCode: `/* id1: 2×2=4, id2: 1×1=1 → 5 total */
data a;
  input id grp $;
  datalines;
1 X
1 X
2 Y
;
run;

data b;
  input id score;
  datalines;
1 80
1 90
2 70
;
run;

data expanded;
  merge a b;
  by id;
run;`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'Many-to-many BY: id 1 produces 4 combinations, id 2 produces 1 → 5 total.',
    tags: ['MERGE', 'many-to-many'],
  },
  {
    id: 'cc-ad-14',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: 'Error row count',
    instruction: 'Run the code. How many observations are in WORK.ERRS?',
    starterCode: `data log;
  input recno status $;
  datalines;
1 OK
2 OK
3 ERR
4 OK
5 ERR
6 ERR
;
run;

data errs;
  set log;
  if status = 'ERR';
run;

proc print data=errs;
run;`,
    solutionCode: `/* 3 ERR rows */`,
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'Three observations have STATUS="ERR".',
    tags: ['IF', 'subsetting'],
  },
  {
    id: 'cc-ad-15',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    title: 'WHERE + assignment',
    instruction: 'Run the code. How many observations are in WORK.BONUS?',
    starterCode: `data payroll;
  input emp $ salary;
  datalines;
Ann 55000
Bob 42000
Cal 68000
Deb 39000
Eve 72000
;
run;

data bonus;
  set payroll;
  where salary >= 50000;
  bump = salary * 0.05;
run;

proc print data=bonus;
run;`,
    solutionCode: `/* salaries 55000,68000,72000 → 3 obs */`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation: 'WHERE keeps Ann, Cal, and Eve (salary >= 50000).',
    tags: ['WHERE', 'assignment'],
  },
  {
    id: 'cc-ad-16',
    cert: 'advanced',
    topic: 'macro',
    difficulty: 'easy',
    title: 'Expression evaluation',
    instruction: 'Run the code. What is RATIO on the single observation (PART=25, WHOLE=100)?',
    starterCode: `data ratio;
  part = 25;
  whole = 100;
  ratio = (part / whole) * 100;
run;

proc print data=ratio;
run;`,
    solutionCode: `/* 25/100*100 = 25 */`,
    options: ['0.25', '4', '25', '100'],
    correctIndex: 2,
    explanation: '(25 / 100) × 100 = 25.',
    tags: ['expressions', 'percent'],
  },
  {
    id: 'cc-ad-17',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    title: 'Three-dataset SET',
    instruction: 'Run the code. How many observations are in WORK.UNION?',
    starterCode: `data q1;
  input month sales;
  datalines;
1 100
2 120
;
run;

data q2;
  input month sales;
  datalines;
3 140
4 130
;
run;

data q3;
  input month sales;
  datalines;
5 160
;
run;

data union;
  set q1 q2 q3;
run;

proc print data=union;
run;`,
    solutionCode: `/* 2+2+1=5 obs */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'SET concatenates three datasets: 2+2+1=5 observations.',
    tags: ['SET', 'concatenate'],
  },
]
