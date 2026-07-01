import type { CodeChallenge } from '../codeChallenges'

export const CODE_EXPANSION_ADVANCED: CodeChallenge[] = [
  {
    id: 'cc-ad-18',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: 'First visit per patient',
    instruction:
      'Run the code. How many observations are in WORK.FIRST_VISIT after keeping the first visit per patient?',
    starterCode: `data visits;
  input patient visit_no;
  datalines;
101 1
101 2
102 1
103 1
103 2
104 1
;
run;

data first_visit;
  set visits;
  by patient;
  if first.patient;
run;

proc print data=first_visit;
run;`,
    solutionCode: `/* patients 101,102,103,104 → 4 first rows */`,
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation:
      'IF FIRST.patient outputs one row per patient group. Four unique patients (101–104) → four observations.',
    explanationKo:
      'IF FIRST.patient는 환자 그룹당 첫 행만 출력합니다. 고유 환자 4명(101–104) → 4개 관측치.',
    tags: ['FIRST.', 'BY', 'dedup'],
  },
  {
    id: 'cc-ad-19',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: '3×3 nested DO grid',
    instruction:
      'Run the code. How many observations are in WORK.GRID after the nested DO loops?',
    starterCode: `data grid;
  do row = 1 to 3;
    do col = 1 to 3;
      cell = row * col;
      output;
    end;
  end;
run;

proc print data=grid;
run;`,
    solutionCode: `/* 3 outer × 3 inner OUTPUT = 9 obs */`,
    options: ['3', '6', '9', '12'],
    correctIndex: 2,
    explanation:
      'Nested loops run 3 × 3 = 9 iterations, each with explicit OUTPUT → nine observations.',
    explanationKo:
      '중첩 DO 루프가 3 × 3 = 9번 실행되며 매번 OUTPUT → 9개 관측치.',
    tags: ['DO loop', 'nested', 'OUTPUT'],
  },
  {
    id: 'cc-ad-20',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'easy',
    title: 'Four-dataset SET stack',
    instruction:
      'Run the code. How many observations are in WORK.ALL after stacking four datasets with SET?',
    starterCode: `data q1;
  input month sales;
  datalines;
1 100
;
run;

data q2;
  input month sales;
  datalines;
2 120
3 130
;
run;

data q3;
  input month sales;
  datalines;
4 140
5 150
6 160
;
run;

data q4;
  input month sales;
  datalines;
7 170
;
run;

data all;
  set q1 q2 q3 q4;
run;

proc print data=all;
run;`,
    solutionCode: `/* 1+2+3+1 = 7 obs */`,
    options: ['4', '5', '6', '7'],
    correctIndex: 3,
    explanation: 'SET concatenates datasets in order: 1 + 2 + 3 + 1 = 7 observations.',
    explanationKo: 'SET은 데이터셋을 순서대로 연결합니다: 1 + 2 + 3 + 1 = 7개 관측치.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'cc-ad-21',
    cert: 'advanced',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    title: 'SET with WHERE= filter',
    instruction:
      'Run the code. How many observations are in WORK.TOP after the SET(where=) subset?',
    starterCode: `data payroll;
  input emp $ salary;
  datalines;
Ann 55000
Bob 62000
Cal 68000
Deb 42000
Eve 72000
Fin 58000
;
run;

data top;
  set payroll(where=(salary >= 60000));
run;

proc print data=top;
run;`,
    solutionCode: `/* Bob 62000, Cal 68000, Eve 72000 → 3 obs */`,
    options: ['2', '3', '4', '6'],
    correctIndex: 1,
    explanation:
      'WHERE= on SET keeps rows with salary >= 60000: Bob (62000), Cal (68000), and Eve (72000) → three observations.',
    explanationKo:
      'SET의 WHERE=는 salary >= 60000인 행만 유지합니다: Bob, Cal, Eve → 3개 관측치.',
    tags: ['SET', 'WHERE', 'subsetting'],
  },
  {
    id: 'cc-ad-22',
    cert: 'advanced',
    topic: 'sql',
    difficulty: 'medium',
    title: 'MERGE as inner join',
    instruction:
      'Run the code. How many observations are in WORK.CUST_ORDERS after the one-to-one MERGE BY cust_id?',
    starterCode: `data cust;
  input cust_id name $;
  datalines;
1 Ann
2 Bob
3 Cal
4 Deb
;
run;

data orders;
  input cust_id order_amt;
  datalines;
1 250
2 180
3 320
4 90
;
run;

data cust_orders;
  merge cust orders;
  by cust_id;
run;

proc print data=cust_orders;
run;`,
    solutionCode: `/* 4 matching cust_id rows → 4 obs */`,
    options: ['2', '3', '4', '8'],
    correctIndex: 2,
    explanation:
      'MERGE BY cust_id on four matching keys combines one customer row with one order row each → four observations (DATA-step equivalent of an inner join).',
    explanationKo:
      'cust_id가 일치하는 4행을 MERGE BY로 결합 → 4개 관측치(DATA 단계 내부 조인과 동일).',
    tags: ['MERGE', 'BY', 'join'],
  },
  {
    id: 'cc-ad-23',
    cert: 'advanced',
    topic: 'sql',
    difficulty: 'hard',
    title: 'Regional join expansion',
    instruction:
      'Run the code. How many observations are in WORK.JOINED after MERGE BY region (many-to-many within region)?',
    starterCode: `data sales;
  input region $ prod $ qty;
  datalines;
East A 10
East B 20
West A 15
;
run;

data targets;
  input region $ prod $ goal;
  datalines;
East A 100
East B 100
West A 100
West C 100
;
run;

data joined;
  merge sales targets;
  by region;
run;

proc print data=joined;
run;`,
    solutionCode: `/* East 2×2=4, West 1×2=2 → 6 obs */`,
    options: ['3', '4', '6', '7'],
    correctIndex: 2,
    explanation:
      'Within each region, MERGE forms a Cartesian product: East has 2×2 = 4 rows, West has 1×2 = 2 rows → six observations total.',
    explanationKo:
      '지역별 MERGE는 카테시안 곱을 만듭니다: East 2×2=4, West 1×2=2 → 총 6개 관측치.',
    tags: ['MERGE', 'many-to-many', 'join'],
  },
  {
    id: 'cc-ad-24',
    cert: 'advanced',
    topic: 'macro',
    difficulty: 'easy',
    title: 'Macro-style %DO row generator',
    instruction:
      'Run the code. How many observations does the DO loop (simulating a %DO %TO 8 macro) create in WORK.PCT_ROWS?',
    starterCode: `data pct_rows;
  do pct = 1 to 8;
    rate = pct * 0.05;
    output;
  end;
run;

proc print data=pct_rows;
run;`,
    solutionCode: `/* DO pct=1 TO 8 with OUTPUT → 8 obs */`,
    options: ['1', '5', '8', '10'],
    correctIndex: 2,
    explanation:
      'A DATA-step DO loop from 1 TO 8 with OUTPUT mimics a macro %DO %TO 8 — eight iterations create eight observations.',
    explanationKo:
      '1 TO 8 DO 루프와 OUTPUT은 매크로 %DO %TO 8과 같습니다 — 8번 반복으로 8개 관측치.',
    tags: ['DO loop', 'macro-style', 'OUTPUT'],
  },
  {
    id: 'cc-ad-25',
    cert: 'advanced',
    topic: 'macro',
    difficulty: 'medium',
    title: 'Year loop row count',
    instruction:
      'Run the code. How many observations are in WORK.YEARS after the iterative DO loop (macro-style year counter)?',
    starterCode: `data years;
  do yr = 2020 to 2024;
    label = yr;
    output;
  end;
run;

proc print data=years;
run;`,
    solutionCode: `/* yr=2020..2024 → 5 obs */`,
    options: ['4', '5', '6', '2024'],
    correctIndex: 1,
    explanation:
      'DO yr = 2020 TO 2024 runs five times (2020, 2021, 2022, 2023, 2024) with OUTPUT → five observations.',
    explanationKo:
      'DO yr = 2020 TO 2024는 5번 실행(2020–2024)되며 OUTPUT → 5개 관측치.',
    tags: ['DO loop', 'macro-style', 'OUTPUT'],
  },
]
