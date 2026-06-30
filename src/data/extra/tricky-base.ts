import type { Question } from '../types'

/** Exam traps & commonly missed SAS Base patterns — verified against SAS behavior. */
export const TRICKY_BASE: Question[] = [
  {
    id: 'trap-b-01',
    title: 'Many-to-one MERGE count',
    topic: 'data-structures',
    difficulty: 'hard',
    trap: true,
    collections: ['exam-traps', 'merge-by'],
    relatedIds: ['cc-b-16', 'mx-05'],
    question:
      'Dataset LEFT has 4 observations (one row per id 1–4). Dataset RIGHT has 2 observations (ids 1 and 2 only). Both are sorted by id with unique BY values. How many observations after `merge left right; by id;`?',
    options: ['2', '4', '6', '8'],
    correctIndex: 1,
    explanation:
      'MERGE is a full outer join on BY groups. All 4 LEFT rows appear; ids 3–4 have missing values from RIGHT. Non-matching LEFT rows are still output — a classic trap.',
    explanationKo:
      'MERGE는 BY 그룹 기준 full outer join입니다. LEFT 4행 모두 출력되고, id 3–4는 RIGHT 값이 결측입니다.',
    tags: ['MERGE', 'BY', 'observation count'],
  },
  {
    id: 'trap-b-02',
    title: 'Missing value in IF test',
    topic: 'manage-data',
    difficulty: 'hard',
    trap: true,
    collections: ['exam-traps', 'missing-values'],
    relatedIds: ['md-04', 'cc-b-04'],
    question:
      'A variable SCORE has values 85, 90, and missing (.). How many observations pass `if score > 80;` in a DATA step?',
    options: ['0', '1', '2', '3'],
    correctIndex: 2,
    explanation:
      'Missing numeric values evaluate to false in IF comparisons. Only 85 and 90 pass; the row with score=. is dropped.',
    tags: ['IF', 'missing value', 'subsetting'],
  },
  {
    id: 'trap-b-03',
    title: 'Character comparison padding',
    topic: 'manage-data',
    difficulty: 'medium',
    trap: true,
    collections: ['exam-traps'],
    question:
      'Variable REGION is stored as $5. The value "US" is compared with `if region = "US";`. What is true?',
    options: [
      'Comparison fails because lengths differ',
      'SAS pads the shorter value with blanks — "US" matches "US   "',
      'You must use TRIM on both sides',
      'Only exact byte match without padding works',
    ],
    correctIndex: 1,
    explanation:
      'SAS pads character values to the stored length with blanks before comparison. "US" in a $5 variable is "US   " and compares equal to a literal "US".',
    tags: ['character', 'comparison'],
  },
  {
    id: 'trap-b-04',
    title: 'SUM vs assignment in loop',
    topic: 'manage-data',
    difficulty: 'hard',
    trap: true,
    collections: ['exam-traps', 'sum-retain'],
    relatedIds: ['md-08', 'cc-b-05'],
    question:
      'In a DATA step reading 3 rows, which statement produces a running total that persists across observations?',
    options: [
      'total = total + amount;  (regular assignment)',
      'total + amount;  (SUM statement)',
      'total = sum(amount);',
      'retain total; total = 0; total = amount;',
    ],
    correctIndex: 1,
    explanation:
      'The SUM statement `total + amount;` implies RETAIN and accumulates. Plain `total = total + amount` resets total to missing each row unless you RETAIN it.',
    tags: ['SUM statement', 'RETAIN'],
  },
  {
    id: 'trap-b-05',
    title: 'WHERE vs IF efficiency',
    topic: 'manage-data',
    difficulty: 'medium',
    collections: ['exam-traps'],
    question:
      'When subsetting a large SAS dataset in a DATA step, which is generally more efficient?',
    options: [
      'IF statement — evaluated row by row after read',
      'WHERE statement — can filter before the PDV is fully populated',
      'They are always identical in performance',
      'DELETE statement only',
    ],
    correctIndex: 1,
    explanation:
      'WHERE can subset earlier in the read path (especially with indexed/sorted data). IF applies after the observation enters the PDV.',
    tags: ['WHERE', 'IF', 'subsetting'],
  },
  {
    id: 'trap-b-06',
    title: 'IN= inner join filter',
    topic: 'data-structures',
    difficulty: 'hard',
    trap: true,
    collections: ['exam-traps', 'merge-by'],
    relatedIds: ['mx-04'],
    question:
      'To keep only matching observations when merging A and B, which approach is correct?',
    options: [
      'merge a b; by id; where a.id = b.id;',
      'merge a(in=ina) b(in=inb); by id; if ina and inb;',
      'merge a b; by id; if id > 0;',
      'set a b; by id;',
    ],
    correctIndex: 1,
    explanation:
      'IN= flags mark which input datasets contributed to the current BY group. `if ina and inb` keeps only true matches (inner join).',
    tags: ['MERGE', 'IN=', 'BY'],
  },
  {
    id: 'trap-b-07',
    title: 'PROC SORT NODUPKEY',
    topic: 'manage-data',
    difficulty: 'medium',
    trap: true,
    collections: ['exam-traps'],
    relatedIds: ['rp-04'],
    question:
      'PROC SORT with NODUPKEY removes:',
    options: [
      'Rows where ALL variables are identical',
      'Duplicate BY-group rows, keeping the first BY-group occurrence',
      'All rows with missing BY values',
      'The last duplicate in each BY group',
    ],
    correctIndex: 1,
    explanation:
      'NODUPKEY deduplicates on BY variables only, keeping the first row per BY combination. NODUPREC removes rows where all variables match.',
    tags: ['PROC SORT', 'NODUPKEY'],
  },
  {
    id: 'trap-b-08',
    title: 'Automatic variable _ERROR_',
    topic: 'error-handling',
    difficulty: 'medium',
    trap: true,
    collections: ['exam-traps'],
    question: 'When does the automatic variable _ERROR_ equal 1 in a DATA step?',
    options: [
      'Whenever the log shows a WARNING',
      'When a conversion or operation error occurs for the current observation',
      'Only when the DATA step fails to compile',
      'When any variable is missing',
    ],
    correctIndex: 1,
    explanation:
      '_ERROR_ flags data-related errors for the current observation (e.g., invalid conversion). It does not trigger on every WARNING or missing value.',
    tags: ['_ERROR_', 'automatic variables'],
  },
  {
    id: 'trap-b-09',
    title: 'DATE9. format edge case',
    topic: 'data-structures',
    difficulty: 'medium',
    collections: ['missing-values'],
    question: 'What does `put(., date9.)` produce?',
    options: ['01JAN1960', 'Missing blank', 'A period (.)', 'An error in the log'],
    correctIndex: 2,
    explanation:
      'Formatting a missing numeric date still yields the standard missing display "." unless you use special missing-value formats.',
    tags: ['SAS dates', 'format', 'missing value'],
  },
  {
    id: 'trap-b-10',
    title: 'Double SET interleave',
    topic: 'data-structures',
    difficulty: 'hard',
    collections: ['merge-by', 'hard-picks'],
    relatedIds: ['ds-04', 'cc-b-02'],
    question:
      'Dataset A has 3 obs, dataset B has 3 obs. `data both; set a b; run;` creates how many observations?',
    options: ['3', '6', '9', '1'],
    correctIndex: 1,
    explanation: 'SET with multiple datasets concatenates vertically: 3 + 3 = 6. MERGE would be horizontal on BY variables.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'trap-b-11',
    title: 'DROP statement timing',
    topic: 'manage-data',
    difficulty: 'medium',
    trap: true,
    collections: ['exam-traps'],
    question:
      'A DROP statement in a DATA step affects variables:',
    options: [
      'Only in the input dataset permanently',
      'On output to the new dataset — variables are still available earlier in the step',
      'Only numeric variables',
      'Only at the PROC PRINT step',
    ],
    correctIndex: 1,
    explanation:
      'DROP excludes variables from the output dataset but they can still be used in the DATA step before output.',
    tags: ['DROP', 'KEEP'],
  },
  {
    id: 'trap-b-12',
    title: 'OBS=0 syntax check',
    topic: 'error-handling',
    difficulty: 'easy',
    collections: ['exam-traps'],
    relatedIds: ['eh-03'],
    question: 'What does `data test(obs=0); set sashelp.class; run;` accomplish?',
    options: [
      'Creates an empty dataset with 0 variables',
      'Checks syntax and metadata without processing observations',
      'Deletes all rows from sashelp.class',
      'Raises an error because OBS=0 is invalid',
    ],
    correctIndex: 1,
    explanation:
      'OBS=0 compiles the step and reads variable structure but processes zero rows — useful for syntax checking.',
    tags: ['OBS=0', 'syntax check'],
  },
  {
    id: 'trap-b-13',
    title: 'PROC FREQ default order',
    topic: 'reports',
    difficulty: 'medium',
    question:
      'In PROC FREQ, requesting a one-way frequency table without BY or WEIGHT produces:',
    options: [
      'Only chi-square statistics',
      'Frequency counts and percent for each level',
      'A sorted copy of the input dataset',
      'Means and standard deviations',
    ],
    correctIndex: 1,
    explanation:
      'PROC FREQ default output includes frequency, percent, cumulative frequency, and cumulative percent for each category.',
    tags: ['PROC FREQ'],
  },
  {
    id: 'trap-b-14',
    title: 'LAG function scope',
    topic: 'manage-data',
    difficulty: 'hard',
    trap: true,
    collections: ['exam-traps', 'sum-retain'],
    question:
      'LAG(x) returns missing for:',
    options: [
      'Every observation where x is missing',
      'The first observation in the DATA step (no prior row)',
      'The last observation in the dataset',
      'Observations after a BY-group change automatically',
    ],
    correctIndex: 1,
    explanation:
      'LAG(x) returns the previous observation\'s x; on the first row there is no prior value, so missing. BY-group reset requires explicit logic with FIRST./LAST.',
    tags: ['LAG', 'RETAIN'],
  },
  {
    id: 'trap-b-15',
    title: 'Rename with DATA step',
    topic: 'manage-data',
    difficulty: 'easy',
    question: 'Which statement renames OLDVAR to NEWVAR in the output dataset?',
    options: [
      'change oldvar=newvar;',
      'rename oldvar=newvar;',
      'label oldvar="newvar";',
      'format oldvar=newvar;',
    ],
    correctIndex: 1,
    explanation: 'RENAME renames variables for the current DATA or PROC step. CHANGE is not valid SAS syntax.',
    tags: ['RENAME'],
  },
]
