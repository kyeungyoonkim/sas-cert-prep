export interface CodeLabStarter {
  name: string
  category: string
  code: string
}

export const CODE_LAB_CATEGORIES = [
  'Basics',
  'Subsetting',
  'MERGE & SET',
  'Loops',
  'SUM & Count',
  'IF-THEN',
  'Clinical',
] as const

export const CODE_LAB_STARTERS: CodeLabStarter[] = [
  {
    name: 'Hello DATA step',
    category: 'Basics',
    code: `data demo;
  input id score;
  datalines;
1 85
2 92
3 78
4 95
5 88
;
run;

proc print data=demo;
run;`,
  },
  {
    name: 'Character INPUT',
    category: 'Basics',
    code: `data team;
  input name $ dept $ salary;
  datalines;
Ann Sales 55000
Bob IT 62000
Cal Sales 58000
;
run;

proc print data=team;
run;`,
  },
  {
    name: 'Multiple OUTPUT',
    category: 'Basics',
    code: `data rows;
  x = 10;
  output;
  x = 20;
  output;
  x = 30;
  output;
run;

proc print data=rows;
run;`,
  },
  {
    name: 'IF subset',
    category: 'Subsetting',
    code: `data scores;
  input id score;
  datalines;
1 85
2 92
3 58
4 77
5 90
;
run;

data high;
  set scores;
  if score >= 80;
run;

proc print data=high;
run;`,
  },
  {
    name: 'WHERE filter',
    category: 'Subsetting',
    code: `data people;
  input name $ age;
  datalines;
Kim 17
Lee 22
Park 15
Choi 31
;
run;

data adults;
  set people;
  where age >= 18;
run;

proc print data=adults;
run;`,
  },
  {
    name: 'Missing values',
    category: 'Subsetting',
    code: `data vals;
  input id x;
  datalines;
1 100
2 .
3 50
4 .
5 75
;
run;

data clean;
  set vals;
  if x > 0;
run;

proc print data=clean;
run;`,
  },
  {
    name: 'SET concatenate',
    category: 'MERGE & SET',
    code: `data east;
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
SF 95
;
run;

data all;
  set east west;
run;

proc print data=all;
run;`,
  },
  {
    name: 'MERGE 1:1',
    category: 'MERGE & SET',
    code: `data a;
  input id name $;
  datalines;
1 Ann
2 Bob
3 Cal
;
run;

data b;
  input id score;
  datalines;
1 90
2 85
3 88
;
run;

data merged;
  merge a b;
  by id;
run;

proc print data=merged;
run;`,
  },
  {
    name: 'MERGE extra rows',
    category: 'MERGE & SET',
    code: `data left;
  input id val;
  datalines;
1 10
2 20
3 30
4 40
;
run;

data right;
  input id flag;
  datalines;
1 1
2 1
;
run;

data m;
  merge left right;
  by id;
run;

proc print data=m;
run;`,
  },
  {
    name: 'FIRST. dedup',
    category: 'MERGE & SET',
    code: `data dup;
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
  },
  {
    name: 'DO loop OUTPUT',
    category: 'Loops',
    code: `data series;
  do i = 1 to 5;
    sq = i * i;
    output;
  end;
run;

proc print data=series;
run;`,
  },
  {
    name: 'Nested DO',
    category: 'Loops',
    code: `data grid;
  do row = 1 to 2;
    do col = 1 to 3;
      cell = row * col;
      output;
    end;
  end;
run;

proc print data=grid;
run;`,
  },
  {
    name: 'Running total',
    category: 'SUM & Count',
    code: `data sales;
  input day amount;
  datalines;
1 100
2 250
3 150
4 200
;
run;

data calc;
  set sales;
  total + amount;
run;

proc print data=calc;
run;`,
  },
  {
    name: 'Row counter',
    category: 'SUM & Count',
    code: `data events;
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
  },
  {
    name: 'Pass / Fail',
    category: 'IF-THEN',
    code: `data tests;
  input name $ score;
  datalines;
Amy 92
Ben 58
Cia 77
Dan 45
;
run;

data result;
  set tests;
  if score >= 60 then status = 'Pass';
  else status = 'Fail';
run;

proc print data=result;
run;`,
  },
  {
    name: 'Derived tax',
    category: 'IF-THEN',
    code: `data orders;
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
  total = amount + tax;
run;

proc print data=taxed;
run;`,
  },
  {
    name: 'Grade A filter',
    category: 'IF-THEN',
    code: `data scores;
  input name $ score;
  datalines;
Ann 91
Bob 72
Cal 88
Eve 94
;
run;

data graded;
  set scores;
  if score >= 90 then grade = 'A';
  else grade = 'OTHER';
run;

data a_only;
  set graded;
  if grade = 'A';
run;

proc print data=a_only;
run;`,
  },
  {
    name: 'Lab toxic flag',
    category: 'Clinical',
    code: `data lb;
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
  },
  {
    name: 'Screen failure',
    category: 'Clinical',
    code: `data screen;
  input usubjid $ scrfl $;
  datalines;
S001 Y
S002 N
S003 Y
S004 N
;
run;

data flagged;
  set screen;
  if scrfl = 'Y' then flag = 'SCREEN FAIL';
  else flag = 'PASS';
run;

proc print data=flagged;
run;`,
  },
  {
    name: 'DM + EX merge',
    category: 'Clinical',
    code: `data dm;
  input usubjid $ age sex $;
  datalines;
S001 45 M
S002 52 F
S003 38 M
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
  },
]

export const CODE_LAB_SNIPPETS = [
  { label: 'DATA step shell', code: `data work.mydata;\n  /* your code */\nrun;` },
  { label: 'PROC PRINT', code: `proc print data=mydata;\nrun;` },
  { label: 'IF subset', code: `if variable > 0;` },
  { label: 'WHERE', code: `where age >= 18;` },
  { label: 'MERGE', code: `merge a b;\nby id;` },
  { label: 'SET', code: `set dataset1 dataset2;` },
  { label: 'DO loop', code: `do i = 1 to 10;\n  /* body */\n  output;\nend;` },
  { label: 'SUM statement', code: `total + amount;` },
  { label: 'FIRST.', code: `if first.id;` },
]
