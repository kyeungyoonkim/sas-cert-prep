import type { Question } from '../types'

/**
 * Scenario-based, exam-objective questions with plausible distractors.
 * Original content — not copied from official SAS exams.
 */
export const EXAM_GRADE_BASE: Question[] = [
  {
    id: 'eg-b-01',
    title: 'Permanent library routing',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'Your team maps folder C:\\projects\\finance to library FIN. You need a dataset that still exists after the SAS session ends.\n\nWhich DATA step writes to the permanent library?',
  code: `libname fin "C:\\projects\\finance";

/* Option A */ data work.budget; set fin.raw; run;
/* Option B */ data fin.budget; set fin.raw; run;
/* Option C */ data budget; set fin.raw; run;
/* Option D */ set fin.raw; data fin.budget; run;`,
    options: [
      'Option A — WORK.BUDGET',
      'Option B — FIN.BUDGET',
      'Option C — BUDGET (no libref)',
      'Option D — SET before DATA',
    ],
    correctIndex: 1,
    explanation:
      'Only a libref from LIBNAME (here FIN.) creates permanent storage. WORK and one-level names are temporary. The DATA step must come before SET inside the step — Option D is invalid syntax order.',
    coachingTip: 'Permanent = libref.dataset. One-level names default to WORK.',
    tags: ['LIBNAME', 'WORK', 'permanent'],
  },
  {
    id: 'eg-b-02',
    title: 'PROC CONTENTS before merge',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'Before merging CUSTOMERS and ORDERS, you need variable names, types, lengths, and formats for both tables — without printing all rows.\n\nWhich procedure is appropriate?',
    options: [
      'PROC CONTENTS on each dataset',
      'PROC PRINT with OBS=5',
      'PROC FREQ on all variables',
      'PROC SORT with NODUPKEY',
    ],
    correctIndex: 0,
    explanation:
      'PROC CONTENTS reports dataset metadata (variables, types, lengths, formats, labels). PROC PRINT shows data values; FREQ is for categorical summaries; SORT reorders data.',
    coachingTip: 'Metadata question → CONTENTS. Row preview → PRINT.',
    tags: ['PROC CONTENTS', 'metadata'],
  },
  {
    id: 'eg-b-03',
    title: 'Log NOTE after import',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'You import a 50,000-row CSV. The log shows:\n\nNOTE: The data set WORK.SALES has 50,000 observations and 8 variables.\n\nWhat can you conclude?',
    options: [
      'All 50,000 rows were read and 8 columns were created',
      'Only 20 rows were read because GUESSINGROWS defaults to 20',
      'The file is permanently stored in WORK',
      'PROC IMPORT always creates a character variable for every column',
    ],
    correctIndex: 0,
    explanation:
      'The NOTE confirms successful read: observation and variable counts. GUESSINGROWS affects type guessing during import, not how many rows are read. WORK is still temporary.',
    tags: ['PROC IMPORT', 'log', 'NOTE'],
  },
  {
    id: 'eg-b-04',
    title: 'RETAIN for department counter',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'sum-retain'],
    question:
      'HR wants a counter that increments within each department and resets when DEPT changes. Data is sorted by DEPT.\n\nWhich approach is correct?',
    code: `data staff;
  input emp dept $;
  datalines;
1 Sales
2 Sales
3 IT
4 IT
5 IT
;
run;`,
    options: [
      'count + 1; without BY processing',
      'retain count; by dept; if first.dept then count=0; count+1;',
      'count = count + 1; without RETAIN',
      'count + 1; by dept; if last.dept;',
    ],
    correctIndex: 1,
    explanation:
      'BY-group counters need RETAIN, BY statement, and reset on FIRST.dept. Plain assignment resets each row; SUM without BY reset accumulates across the whole file.',
    coachingTip: 'Per-group counter = RETAIN + BY + reset on FIRST.',
    tags: ['RETAIN', 'BY', 'FIRST.'],
  },
  {
    id: 'eg-b-05',
    title: 'DO loop observation count',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'How many observations are written to WORK.OUT?',
    code: `data out;
  do i = 1 to 3;
    x = i * 10;
    output;
  end;
run;`,
    options: ['1', '3', '4', '9'],
    correctIndex: 1,
    explanation:
      'Each iteration of the DO loop reaches OUTPUT, creating one observation. 3 iterations → 3 rows with x=10, 20, 30.',
    coachingTip: 'Count OUTPUT statements inside the loop, not loop upper bound alone.',
    tags: ['DO loop', 'OUTPUT'],
  },
  {
    id: 'eg-b-06',
    title: 'LENGTH before assignment',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'A numeric ID is read as 1234567890123456789 but you need a 20-character text key for merging.\n\nWhich sequence avoids truncation?',
    options: [
      'id_char = put(id, best.);',
      'length id_char $20; id_char = put(id, best.);',
      'id_char $20; id_char = id;',
      'format id $20.; id_char = id;',
    ],
    correctIndex: 1,
    explanation:
      'LENGTH must appear before first reference to set character length. PUT converts numeric to character. FORMAT changes display, not storage type/length for a new variable.',
    coachingTip: 'Character length problems → LENGTH before first use.',
    tags: ['LENGTH', 'PUT', 'character'],
  },
  {
    id: 'eg-b-07',
    title: 'ERROR vs WARNING in production',
    topic: 'error-handling',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'A nightly job log shows ERROR: Variable REGION not found, followed by NOTE: DATA statement used and 0 observations read.\n\nWhat is the most likely outcome?',
    options: [
      'WORK.OUT was created with 0 observations; downstream steps may fail',
      'SAS ignored the error and processed all rows normally',
      'Only a WARNING appeared; the dataset has the expected row count',
      'The ERROR is informational; rerun is never needed',
    ],
    correctIndex: 0,
    explanation:
      'ERROR typically stops the step from completing as intended — often 0 observations or no valid dataset. WARNING allows execution to continue. Always verify NOTE observation counts.',
    tags: ['log', 'ERROR', 'WARNING'],
  },
  {
    id: 'eg-b-08',
    title: 'PROC FREQ table shape',
    topic: 'reports',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'You run PROC FREQ on REGION (4 levels: East, West, North, South) in a dataset with 1,000 rows.\n\nWhat appears in the default frequency table?',
    options: [
      '4 rows (one per level) with frequency and percent columns',
      '1,000 rows — one per input observation',
      'Means and standard deviations for REGION',
      'A sorted copy of the source dataset',
    ],
    correctIndex: 0,
    explanation:
      'PROC FREQ summarizes categorical variables: one row per distinct value plus frequency, percent, cumulative frequency and percent. It does not list every input row.',
    coachingTip: 'FREQ = summary table, not row listing.',
    tags: ['PROC FREQ', 'reports'],
  },
  {
    id: 'eg-b-09',
    title: 'WHERE on SET with missing',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    trap: true,
    collections: ['exam-quality', 'missing-values'],
    question:
      'How many observations are in WORK.HIGH?',
    code: `data scores;
  input id score;
  datalines;
1 88
2 .
3 91
4 79
;
run;

data high;
  set scores (where=(score > 80));
run;`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation:
      'Missing (.) is treated as false in WHERE comparisons. Only id 1 (88) and id 3 (91) pass score > 80.',
    coachingTip: 'Missing fails numeric comparisons — count it as dropped.',
    tags: ['WHERE', 'missing value'],
  },
  {
    id: 'eg-b-10',
    title: 'MERGE non-match from left',
    topic: 'data-structures',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    trap: true,
    collections: ['exam-quality', 'merge-by', 'exam-traps'],
    question:
      'EMPLOYEES has 6 rows (emp_id 101–106). BONUS has 4 rows (emp_id 101–104 only). Both sorted by emp_id.\n\nHow many rows in WORK.COMBINED after the MERGE?',
    code: `data employees;
  input emp_id dept $;
  datalines;
101 Sales
102 Sales
103 IT
104 IT
105 HR
106 HR
;
run;

data bonus;
  input emp_id bonus;
  datalines;
101 500
102 600
103 700
104 800
;
run;

data combined;
  merge employees bonus;
  by emp_id;
run;`,
    options: ['4', '6', '10', '24'],
    correctIndex: 1,
    explanation:
      'MERGE is a full outer join on BY groups. All 6 employee rows appear; emp_id 105–106 have missing bonus fields. A common wrong answer is 4 (match count only).',
    coachingTip: 'Non-matching left rows still output — count the larger side minimum.',
    tags: ['MERGE', 'BY'],
  },
  {
    id: 'eg-b-11',
    title: 'SUM statement last row',
    topic: 'manage-data',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'sum-retain'],
    question:
      'What is the value of TOTAL on the last observation?',
    code: `data sales;
  input amount;
  datalines;
100
250
150
;
run;

data cum;
  set sales;
  total + amount;
run;`,
    options: ['150', '250', '500', 'Missing'],
    correctIndex: 2,
    explanation:
      'total + amount is a SUM statement with implicit RETAIN. Running total: 100, 350, 500. Last row = 500.',
    tags: ['SUM statement', 'RETAIN'],
  },
  {
    id: 'eg-b-12',
    title: 'PROC SORT NODUPKEY',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'CUSTOMERS has duplicate CUSTOMER_ID values. You want one row per CUSTOMER_ID, keeping the first row in current sort order.\n\nWhich PROC SORT statement works?',
    options: [
      'proc sort data=customers noduprec; by customer_id; run;',
      'proc sort data=customers nodupkey; by customer_id; run;',
      'proc sort data=customers; by customer_id; where first.customer_id; run;',
      'proc sort data=customers unique; by customer_id; run;',
    ],
    correctIndex: 1,
    explanation:
      'NODUPKEY removes duplicates on BY variables, keeping the first in the BY order. NODUPREC removes rows where all variables are identical. WHERE FIRST. is invalid in PROC SORT.',
    tags: ['PROC SORT', 'NODUPKEY'],
  },
  {
    id: 'eg-b-13',
    title: 'FORMAT vs stored value',
    topic: 'reports',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'Variable REVENUE stores 1250000. You add format revenue dollar12.; before PROC PRINT.\n\nWhich is true?',
    options: [
      'Stored value becomes character "$1,250,000"',
      'Stored value stays 1250000; report shows formatted display',
      'Stored value is divided by 100 for currency',
      'PROC PRINT fails because FORMAT is invalid in DATA step',
    ],
    correctIndex: 1,
    explanation: 'FORMAT affects display only. Arithmetic and storage use the underlying numeric value.',
    tags: ['FORMAT', 'PROC PRINT'],
  },
  {
    id: 'eg-b-14',
    title: 'IN= inner join filter',
    topic: 'data-structures',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'merge-by'],
    question:
      'You need only employees who appear in both PAYROLL and CONTACT.\n\nWhich MERGE pattern is correct?',
    options: [
      'merge payroll contact; by emp_id; if emp_id;',
      'merge payroll(in=a) contact(in=b); by emp_id; if a and b;',
      'merge payroll contact; by emp_id; if first.emp_id;',
      'merge payroll contact; by emp_id; where emp_id;',
    ],
    correctIndex: 1,
    explanation:
      'IN= flags mark which input contributed the current row. if a and b keeps only BY groups present in both datasets — inner join logic.',
    coachingTip: 'Inner join in DATA step = IN= + if a and b.',
    tags: ['MERGE', 'IN='],
  },
  {
    id: 'eg-b-15',
    title: 'OBS=0 syntax check',
    topic: 'error-handling',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'You want to verify a long program compiles without processing millions of rows.\n\nWhich is the standard approach?',
    options: [
      'Add OBS=0 as a system option before the DATA steps',
      'Replace all SET statements with MERGE',
      'Delete all RUN statements',
      'Use PROC DELETE on the input library',
    ],
    correctIndex: 0,
    explanation:
      'OPTIONS OBS=0 stops data processing after compilation — useful for syntax checks on large jobs. DATA steps still compile and log errors.',
    tags: ['OBS=0', 'OPTIONS'],
  },
  {
    id: 'eg-b-16',
    title: 'Character compare padding',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    trap: true,
    collections: ['exam-quality', 'exam-traps'],
    question:
      'Variable CODE is $5. The row value is "NY" (no trailing spaces in the source file).\n\nHow many rows pass `if code = "NY";`?',
    code: `data test;
  length code $5;
  code = 'NY';
  output;
  code = 'NY  ';
  output;
  code = 'NYC';
  output;
run;

data keep;
  set test;
  if code = "NY";
run;`,
    options: ['0', '1', '2', '3'],
    correctIndex: 2,
    explanation:
      'SAS pads character values to stored length. "NY" in $5 is "NY   " and matches literal "NY". Both first and second rows pass; "NYC" does not.',
    tags: ['character', 'comparison'],
  },
  {
    id: 'eg-b-17',
    title: 'FIRST. after sort',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'merge-by'],
    question:
      'Data sorted by REGION then STORE. How many observations have FIRST.REGION = 1?',
    code: `data stores;
  input region $ store $;
  datalines;
East S1
East S2
East S3
East S4
West S1
West S2
West S3
West S4
North S1
North S2
North S3
North S4
;
run;

proc sort data=stores; by region store; run;

data flagged;
  set stores;
  by region store;
  if first.region;
run;`,
    options: ['1', '3', '4', '12'],
    correctIndex: 1,
    explanation:
      'FIRST.region is 1 on the first row of each REGION group. 3 regions → 3 observations output.',
    tags: ['FIRST.', 'BY'],
  },
  {
    id: 'eg-b-18',
    title: 'INPUT vs INFILE roles',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    question:
      'You must read an external pipe-delimited file C:\\raw\\claims.txt into WORK.CLAIMS.\n\nWhich pairing is correct?',
    options: [
      'INFILE names the file; INPUT defines variable layout',
      'INPUT names the file; INFILE defines formats',
      'SET names the file; INPUT defines the library',
      'FILENAME reads rows; LIBNAME defines columns',
    ],
    correctIndex: 0,
    explanation:
      'INFILE points to the external file (often with DLM= or DSD). INPUT describes how to read each field. SET reads existing SAS datasets.',
    tags: ['INFILE', 'INPUT'],
  },
]
