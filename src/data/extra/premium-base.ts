import type { Question } from '../types'

/** Exam-objective-aligned premium questions — original content, not copied from official exams */
export const PREMIUM_BASE: Question[] = [
  {
    id: 'prem-b-01',
    title: 'Multi-step DATA pipeline',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    trap: true,
    collections: ['exam-traps', 'hard-picks'],
    question:
      'How many observations are in WORK.FINAL after both DATA steps? (Step 1 keeps dept=A; step 2 keeps sales>=150)',
    code: `data source;
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
data step1; set source; if dept = 'A'; run;
data final; set step1; if sales >= 150; run;`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation: 'Dept A: 100, 180, 220. Sales>=150: 180 and 220 → 2 observations.',
    coachingTip: "Draw a pipeline table — filter step 1, then step 2. Don't try to combine IFs mentally.",
    tags: ['pipeline', 'IF', 'exam-style'],
  },
  {
    id: 'prem-b-02',
    title: 'MERGE + FIRST. combo',
    topic: 'data-structures',
    difficulty: 'hard',
    examStyle: true,
    collections: ['merge-by', 'hard-picks'],
    question:
      'After MERGE and IF FIRST.id, how many observations are in WORK.OUT?',
    code: `data a; input id x; datalines; 1 10 1 20 2 30 3 40 ; run;
data b; input id y; datalines; 1 100 2 200 4 400 ; run;
data merged; merge a b; by id; run;
data out; set merged; by id; if first.id; run;`,
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
    explanation: 'MERGE yields ids 1,1,2,3,4 (5 rows). FIRST.id keeps first per id → 4 observations.',
    coachingTip: 'MERGE first, count rows, THEN apply FIRST. — order of operations matters.',
    tags: ['MERGE', 'FIRST.', 'exam-style'],
  },
  {
    id: 'prem-b-03',
    title: 'WHERE vs IF efficiency',
    topic: 'manage-data',
    difficulty: 'medium',
    examStyle: true,
    question:
      'Which statement is generally more efficient for subsetting a large dataset in a DATA step reading an existing SAS dataset?',
    options: [
      'IF condition; after SET',
      'WHERE condition; on the SET statement',
      'DELETE statement without condition',
      'They are always identical',
    ],
    correctIndex: 1,
    explanation: 'WHERE can subset during the read phase; IF applies after the observation enters the PDV.',
    coachingTip: 'Exam loves WHERE vs IF — remember WHERE = earlier filter on SET.',
    tags: ['WHERE', 'IF', 'efficiency'],
  },
  {
    id: 'prem-b-04',
    title: 'FORMAT display vs storage',
    topic: 'reports',
    difficulty: 'medium',
    examStyle: true,
    question:
      'A variable SALARY stores 75000. After `format salary dollar8.;` in PROC PRINT, what happens to the stored value?',
    options: [
      'Stored value becomes $75,000 text',
      'Stored value remains 75000; only display changes',
      'Stored value is divided by 100',
      'PROC PRINT fails',
    ],
    correctIndex: 1,
    explanation: 'FORMAT affects display only. The underlying numeric value is unchanged.',
    tags: ['FORMAT', 'PROC PRINT'],
  },
  {
    id: 'prem-b-05',
    title: 'Automatic variable _N_',
    topic: 'error-handling',
    difficulty: 'medium',
    examStyle: true,
    question: 'What does the automatic variable _N_ represent in a DATA step?',
    options: [
      'The number of variables in the PDV',
      'The observation number being processed',
      'The number of errors so far',
      'The BY-group count',
    ],
    correctIndex: 1,
    explanation: '_N_ is the current observation number in the DATA step iteration.',
    tags: ['_N_', 'automatic variables'],
  },
  {
    id: 'prem-b-06',
    title: 'PROC SORT options',
    topic: 'manage-data',
    difficulty: 'medium',
    examStyle: true,
    question: 'Which PROC SORT option removes duplicate rows where ALL variables are identical?',
    options: ['NODUPKEY', 'NODUPREC', 'DUPOUT=', 'UNIQUE'],
    correctIndex: 1,
    explanation: 'NODUPREC removes exact duplicate rows. NODUPKEY deduplicates on BY variables only.',
    tags: ['PROC SORT', 'NODUPREC'],
  },
  {
    id: 'prem-b-07',
    title: 'LIBNAME permanence',
    topic: 'data-structures',
    difficulty: 'easy',
    examStyle: true,
    question: 'Which statement creates a permanent SAS dataset MYDATA in library MYLIB?',
    options: [
      'data mydata; ...',
      'data mylib.mydata; ...',
      'set mylib.mydata; ...',
      'libname mydata mylib; ...',
    ],
    correctIndex: 1,
    explanation: 'libref.dataset references a permanent library. WORK datasets are temporary.',
    tags: ['LIBNAME', 'permanent'],
  },
  {
    id: 'prem-b-08',
    title: 'Assignment vs SUM trap',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    trap: true,
    question:
      'Each observation runs `total = 10; total = total + amount;`. With amount=5 on every row, what is TOTAL on each observation?',
    options: ['5', '10', '15', 'Cumulative 15, 20, 25...'],
    correctIndex: 2,
    explanation: 'Each row resets: total=10, then total=10+amount=15. Not cumulative — that would need SUM statement.',
    coachingTip: 'Assignment (=) resets each iteration. SUM statement (+) accumulates.',
    tags: ['RETAIN', 'assignment', 'SUM'],
  },
  {
    id: 'prem-b-09',
    title: 'INFILE vs INPUT',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    question: 'Which statement identifies an external raw data file to be read?',
    options: ['INFILE', 'INPUT', 'SET', 'FILENAME only'],
    correctIndex: 0,
    explanation: 'INFILE points to an external file; INPUT describes variable layout.',
    tags: ['INFILE', 'external files'],
  },
  {
    id: 'prem-b-10',
    title: 'PROC FREQ output',
    topic: 'reports',
    difficulty: 'easy',
    examStyle: true,
    question: 'PROC FREQ on a single categorical variable produces:',
    options: [
      'Means and standard deviations',
      'Frequency counts and percentages',
      'A sorted copy of the input',
      'Regression coefficients',
    ],
    correctIndex: 1,
    explanation: 'PROC FREQ default output includes frequency, percent, cumulative frequency and percent.',
    tags: ['PROC FREQ'],
  },
  {
    id: 'prem-b-11',
    title: 'Double SET same dataset',
    topic: 'data-structures',
    difficulty: 'hard',
    examStyle: true,
    question:
      'Dataset A has 3 observations. `data both; set a a; run;` creates how many observations?',
    options: ['3', '6', '9', '1'],
    correctIndex: 1,
    explanation: 'SET A A concatenates A with itself: 3+3=6 observations.',
    coachingTip: 'Same dataset listed twice in SET = duplicate concatenation.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'prem-b-12',
    title: 'Exam pacing strategy',
    topic: 'manage-data',
    difficulty: 'easy',
    examStyle: true,
    question:
      'For the A00-231 exam (~40 performance tasks, 135 minutes), what is the best pacing strategy?',
    options: [
      'Spend 10 minutes per question regardless',
      'Aim for ~3 minutes per task; flag hard ones and return',
      'Complete the hardest questions first',
      'Skip all code-run questions',
    ],
    correctIndex: 1,
    explanation: '~3 min/task leaves buffer time. Flag uncertain items, finish confident ones first.',
    coachingTip: 'Bank easy points first, review flagged items at the end.',
    tags: ['exam strategy'],
  },
]
