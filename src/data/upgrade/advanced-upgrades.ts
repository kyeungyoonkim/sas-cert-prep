import type { Question } from '../types'

export const ADVANCED_UPGRADES: Record<string, Partial<Question>> = {
  'sq-01': {
    title: 'Inner join row set',
    question:
      'A clinical programmer joins enrollment (enroll) to lab results (labs) on subject_id using an inner join in PROC SQL. Several enrolled subjects have no lab records yet.\n\nHow many rows appear in the result for subjects with no matching lab record?',
    options: [
      'Zero — inner join returns only rows that match on both sides',
      'One row per unmatched subject with missing lab columns',
      'All enrollment rows with lab values set to zero',
      'All rows from both tables including every non-match',
    ],
    explanation:
      'INNER JOIN returns only rows satisfying the join condition. Unmatched subjects on either side are excluded entirely — unlike LEFT, RIGHT, or FULL joins.',
    coachingTip:
      'Picture Venn diagrams: inner = overlap only. If the scenario says "keep all patients even without labs," that is a LEFT JOIN, not inner.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-02': {
    title: 'UNION vs OUTER UNION',
    question:
      'You must combine quarterly sales from two regional tables. Q1 has columns region, product, revenue. Q2 adds a new column units_sold that Q1 lacks.\n\nWhich set operator lets you stack these tables despite different column structures?',
    options: [
      'OUTER UNION — it can combine tables with different column structures; standard UNION requires matching columns and removes duplicates',
      'UNION — it automatically pads missing columns with zeros',
      'INTERSECT — it merges rows with different schemas',
      'EXCEPT — it aligns columns before stacking',
    ],
    explanation:
      'UNION combines rows with identical column structures and removes duplicates (UNION ALL keeps duplicates). OUTER UNION can combine tables with different column structures, filling non-matching columns with missing values.',
    coachingTip:
      'Column mismatch → think OUTER UNION. Duplicate handling → UNION vs UNION ALL.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-03': {
    title: 'COALESCE after FULL JOIN',
    question:
      'After a FULL JOIN between tables A and B on id, some rows have a missing value in A.value but a populated B.value.\n\nWhat does coalesce(a.value, b.value, 0) return for those rows?',
    code: `proc sql;
  select a.id, coalesce(a.value, b.value, 0) as final
  from a full join b on a.id = b.id;
quit;`,
    options: [
      'The first non-missing value among the arguments — here, B.value',
      'The arithmetic mean of A.value and B.value',
      'The count of non-missing arguments',
      'Missing, because FULL JOIN always produces nulls',
    ],
    explanation:
      'COALESCE returns the first non-missing value in its argument list. After a FULL JOIN it is commonly used to prefer one table\'s value, then fall back to another, then a default.',
    coachingTip:
      'Order matters in COALESCE: list arguments from most preferred to fallback default.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-04': {
    title: 'WHERE vs HAVING',
    question:
      'You need average claim amount by provider, but only for providers with more than 50 claims. Individual claim rows below $100 should be excluded before aggregation.\n\nWhere should each filter be applied?',
    options: [
      'WHERE claim_amt >= 100 before GROUP BY; HAVING count(*) > 50 after grouping',
      'HAVING claim_amt >= 100 before GROUP BY; WHERE count(*) > 50 after grouping',
      'Both conditions belong in WHERE because HAVING is only for DATA steps',
      'Both conditions belong in HAVING because they involve counts',
    ],
    explanation:
      'WHERE filters individual rows before grouping. HAVING filters groups based on aggregate results (e.g., COUNT, SUM) after GROUP BY.',
    coachingTip:
      'Row-level filter → WHERE. Group-level filter on summaries → HAVING.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-05': {
    title: 'Dictionary vs vtable metadata',
    question:
      'A macro loops over all datasets in a library and needs table names and engine type programmatically.\n\nWhich approaches can supply this metadata in SAS?',
    options: [
      'Both dictionary.tables (via PROC SQL) and sashelp.vtable (as a view) expose table metadata',
      'Only dictionary.tables — vtable stores macro variables',
      'Only sashelp.vtable — dictionary tables are Excel-specific',
      'Neither — metadata requires PROC CONTENTS run manually for each table',
    ],
    explanation:
      'PROC SQL can query dictionary.tables and dictionary.columns. sashelp.vtable and sashelp.vcolumn provide similar metadata through views.',
    coachingTip:
      'dictionary.* in SQL; sashelp.v* as views — both are fair game on the Advanced exam.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-06': {
    title: 'Inline view in FROM',
    question:
      'A complex report needs average score by department, but only for employees hired after 2020. You want to reuse that filtered subset in multiple joins within one PROC SQL step.\n\nWhat is the inline view technique?',
    options: [
      'A subquery in the FROM clause aliased as a temporary result set, e.g. FROM (select ...) as filtered',
      'A %MACRO variable holding the filter condition',
      'A permanent libref assigned with a LIBNAME statement',
      'An ODS destination wrapping the query output',
    ],
    explanation:
      'An inline view is a subquery in the FROM clause: FROM (select ... from ...) as alias. It simplifies multi-step logic inside a single query.',
    coachingTip:
      'Subquery in FROM + alias = inline view. Do not confuse with a CREATE VIEW statement.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-07': {
    title: 'CALCULATED keyword',
    question:
      'In one SELECT you compute bonus as salary * 0.10 and need to filter rows where bonus exceeds 5000 in the same query.\n\nHow do you reference the computed bonus column in WHERE?',
    options: [
      'Use CALCULATED bonus in WHERE or HAVING within the same query',
      'Repeat the full expression salary * 0.10 — CALCULATED is for macros only',
      'Move the filter to a separate DATA step; PROC SQL cannot reference aliases in WHERE',
      'Use CALCULATED only with hash object definitions',
    ],
    explanation:
      'The CALCULATED keyword lets you reference a column defined in the SELECT list within WHERE or HAVING in the same PROC SQL query.',
    coachingTip:
      'Alias in SELECT not visible in WHERE unless you prefix with CALCULATED.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-08': {
    title: 'EXCEPT set operator',
    question:
      'Table ACTIVE holds current members. Table FORMER holds everyone who ever held membership. You need IDs present in ACTIVE but not in FORMER.\n\nWhich set operator produces that result?',
    options: [
      'EXCEPT — rows in the first query not found in the second',
      'INTERSECT — rows common to both queries',
      'UNION — all rows from both queries with duplicates removed',
      'INNER JOIN — matching rows only',
    ],
    explanation:
      'EXCEPT returns rows from the first query that are not in the second. INTERSECT returns the intersection; UNION stacks results.',
    coachingTip:
      'EXCEPT = set difference. Order matters: A EXCEPT B ≠ B EXCEPT A.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-09': {
    title: 'PROC SQL NOEXEC',
    question:
      'You are debugging a long PROC SQL program and want to verify syntax without waiting for a heavy join to execute.\n\nWhat does the NOEXEC option do?',
    options: [
      'Checks SQL syntax and semantics without executing the query',
      'Suppresses all printed results but still runs the query',
      'Disables the macro facility for the step',
      'Sets OBS=0 on every input table automatically',
    ],
    explanation:
      'NOEXEC validates the PROC SQL code without executing it — useful for syntax checking during development.',
    coachingTip:
      'NOEXEC = parse/validate only. Pair with _METHOD when tuning execution plans.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'sq-10': {
    title: 'SELECT DISTINCT purpose',
    question:
      'A log table has duplicate rows from retries. You need one row per transaction_id without computing any aggregates.\n\nWhat does SELECT DISTINCT accomplish?',
    options: [
      'Returns unique rows by removing duplicates across the selected columns',
      'Sorts rows into ascending order by the first column',
      'Computes group totals like GROUP BY',
      'Performs an automatic join between duplicate keys',
    ],
    explanation:
      'SELECT DISTINCT eliminates duplicate rows. Unlike GROUP BY, it does not require or produce aggregate functions.',
    coachingTip:
      'Need unique rows without summaries → DISTINCT. Need sums/counts by group → GROUP BY.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-01': {
    title: 'Automatic macro SYSDATE',
    question:
      'A batch job log must stamp each run with the date the SAS session started, not today\'s wall-clock date if the session crosses midnight.\n\nWhat does the automatic macro variable &SYSDATE contain?',
    options: [
      'The character date when the current SAS session started',
      'The current DATA step observation number',
      'A numeric error flag from the last procedure',
      'The path of the default WORK library',
    ],
    explanation:
      'Automatic macro variables report session context. &SYSDATE holds the session start date as text; &SYSDATE9 uses DATE9. format.',
    coachingTip:
      'Session start: &SYSDATE, &SYSTIME. Current macro: &SYSMACRONAME. Do not confuse with DATA step date functions.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-02': {
    title: '%GLOBAL vs %LOCAL scope',
    question:
      'Macro %report uses a loop index &i. Another macro %summarize also uses &i. Values leak between macros and overwrite each other.\n\nWhat is the correct scope distinction between %GLOBAL and %LOCAL?',
    options: [
      '%GLOBAL creates or references session-wide variables; %LOCAL creates variables visible only inside the current macro',
      'They are interchangeable — both always global',
      '%LOCAL variables persist across all future sessions',
      'Both directives apply only inside DATA steps',
    ],
    explanation:
      '%LOCAL declares macro variables scoped to the executing macro, preventing name collisions. %GLOBAL is visible throughout the SAS session.',
    coachingTip:
      'Loop counters and temp names inside a macro → %LOCAL. Shared config → %GLOBAL or outer scope.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-03': {
    title: '%STR macro quoting',
    question:
      'A macro builds a WHERE clause containing semicolons and commas that must not terminate the macro statement early.\n\nWhat does the %STR quoting function do?',
    options: [
      'Masks special characters (semicolons, commas, etc.) so they are treated as literals until macro execution time',
      'Converts all text to uppercase for comparison',
      'Coerces character arguments to numeric at DATA step runtime',
      'Executes embedded PROC SQL statements immediately',
    ],
    explanation:
      '%STR, %NRSTR, %BQUOTE, and %SUPERQ are macro quoting functions that delay interpretation of special characters in macro code.',
    coachingTip:
      'Literal semicolons or commas in macro text → quoting function. & and % in literals → often %NRSTR or %SUPERQ.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-04': {
    title: '%DO %WHILE vs %UNTIL',
    question:
      'You write a macro loop to process files while &more eq 1, but the first file must always be processed even if &more starts at 0.\n\nWhich loop tests the condition at the bottom of the iteration?',
    options: [
      '%DO %UNTIL — repeats until the condition becomes true (bottom-tested); %DO %WHILE is top-tested',
      '%DO %WHILE — bottom-tested; %DO %UNTIL is top-tested',
      'Both are identical — choice depends only on indentation',
      'Neither works in macros — use DATA step DO loops instead',
    ],
    explanation:
      '%DO %WHILE(%condition) evaluates before each iteration. %DO %UNTIL(%condition) runs at least once and evaluates after each iteration.',
    coachingTip:
      'Must run at least once → %UNTIL. Might run zero times → %WHILE.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-05': {
    title: 'SYMGET in DATA step',
    question:
      'A DATA step must branch logic based on a threshold stored in macro variable &limit. The value must be available as a DATA step character variable.\n\nWhich function retrieves a macro variable value inside a DATA step?',
    options: [
      'SYMGET("limit") returns the macro variable value as a DATA step character value',
      '%EVAL reads macro variables into numeric PDV columns automatically',
      'CALL SYMPUT retrieves macro variables into the PDV',
      'PROC SQL SELECT INTO is the only way to read macro variables in DATA steps',
    ],
    explanation:
      'SYMGET reads a macro variable into the DATA step as a character value. SYMPUT/SYMPUTX write from the DATA step to macro variables.',
    coachingTip:
      'Macro → DATA step: SYMGET. DATA step → macro: SYMPUT/SYMPUTX. Direction matters on the exam.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-06': {
    title: 'OPTIONS MERROR',
    question:
      'Production code calls %cleanup but a typo invokes %cleanuo. You want SAS to abort with an error instead of passing the typo through as plain text.\n\nWhat does OPTIONS MERROR do?',
    options: [
      'Generates an error when an undefined macro name is invoked',
      'Disables the entire macro facility',
      'Suppresses the SAS log to hide typos',
      'Optimizes PROC SQL joins automatically',
    ],
    explanation:
      'MERROR treats unresolved macro references as errors. Combine with MPRINT, MLOGIC, and SYMBOLGEN for macro debugging.',
    coachingTip:
      'Debug trio: MPRINT MLOGIC SYMBOLGEN. Catch typos: MERROR.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-07': {
    title: '%EVAL integer math',
    question:
      'A macro computes the number of batches as %let n=%eval(&total / &size); where both macro variables hold integers.\n\nWhat does %EVAL do at macro execution time?',
    options: [
      'Performs integer arithmetic and integer comparisons on macro expressions',
      'Evaluates floating-point DATA step variables in the PDV',
      'Runs SQL aggregate functions inside the macro compiler',
      'Applies SAS formats to macro variable values',
    ],
    explanation:
      '%EVAL handles integer arithmetic and comparisons during macro execution. %SYSEVALF handles floating-point macro expressions.',
    coachingTip:
      'Integers in macros → %EVAL. Decimals → %SYSEVALF. String ops → %SCAN, %SUBSTR, etc.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mc-08': {
    title: 'Macro %IF timing',
    question:
      'Macro %export chooses ODS Excel or CSV based on parameter &fmt before any DATA or PROC step runs.\n\nWhen is %IF %THEN %ELSE inside a %MACRO evaluated?',
    options: [
      'At macro compile/execution time — before generated SAS code runs',
      'After the DATA step finishes reading observations',
      'After each PROC step completes',
      'Only when the log is closed at session end',
    ],
    explanation:
      'Macro %IF is resolved when the macro executes, determining which SAS source code is generated. DATA step IF runs at data execution time — a common exam trap.',
    coachingTip:
      'Macro %IF = code generation time. DATA IF = runtime. Never mix the two timelines.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-01': {
    title: 'Hash object advantage',
    question:
      'You merge a 5-million-row transaction file to a 50,000-row lookup table by key. SORT plus DATA step merge is slow and disk-heavy.\n\nWhat is a major advantage of a hash object for this task?',
    options: [
      'Efficient in-memory key lookup without presorting both datasets',
      'Hash objects always require both tables sorted on disk first',
      'Hash lookup is always slower than PROC SQL for keyed joins',
      'Hash objects replace the need for any macro variables',
    ],
    explanation:
      'DECLARE HASH enables key-based lookup in memory, often avoiding SORT and performing merge-like operations efficiently on unsorted data.',
    coachingTip:
      'Large fact + small dimension, key lookup, no sort → hash. Exam loves hash vs merge tradeoffs.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-02': {
    title: 'hash.find return code',
    question:
      'A DATA step loads a hash from dataset lookup and calls rc = h.find() for each incoming row.\n\nWhat does rc = 0 indicate after h.find()?',
    code: `if _N_ = 1 then do;
  declare hash h(dataset:'lookup');
  h.definekey('id');
  h.definedata('name', 'score');
  h.definedone();
end;
rc = h.find();`,
    options: [
      'The key was found successfully',
      'The key was not found',
      'A syntax error occurred in the hash definition',
      'The hash object was never declared',
    ],
    explanation:
      'For hash.find(), return code 0 means success — the key matched and defined data columns were loaded. Non-zero typically means key not found.',
    coachingTip:
      'hash.find/add/check: rc=0 is success. Memorize the sign — exams test rc constantly.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-03': {
    title: 'Two-dimensional ARRAY',
    question:
      'You store monthly sales for 3 products over 4 quarters in variables m1–m12 and need matrix-style access sales(product, quarter).\n\nHow do you declare a two-dimensional ARRAY for 12 variables in a 3×4 layout?',
    options: [
      'array sales(3,4) m1-m12; then reference sales(i,j) where rows×cols equals variable count',
      'array sales(*) _all_; — automatic 2D detection',
      'SAS does not support two-dimensional arrays',
      'Only PROC SQL can define 2D arrays with GROUP BY',
    ],
    explanation:
      'Declare ARRAY name(rows,cols) varlist; with rows×cols matching the variable count, then use name(i,j) for element access.',
    coachingTip:
      'ARRAY name(r,c) vars; and r*c = number of vars. Classic Advanced techniques item.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-04': {
    title: 'PROC DATASETS role',
    question:
      'A library contains obsolete scratch datasets. You need to delete several members and rename one without reading observation data for analysis.\n\nWhat is the primary purpose of PROC DATASETS?',
    options: [
      'Manage dataset members in a library (delete, rename, modify attributes) without reading data for analysis',
      'Perform regression and hypothesis testing',
      'Compile macro catalogs from source code',
      'Execute SQL joins across librefs',
    ],
    explanation:
      'PROC DATASETS is a utility procedure for MODIFY, DELETE, CHANGE, and similar operations on catalog metadata efficiently.',
    coachingTip:
      'Delete/rename/modify labels or formats in place → PROC DATASETS, not DATA step.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-05': {
    title: 'PROC SQL _METHOD',
    question:
      'A PROC SQL join runs slowly. You suspect the optimizer chose a suboptimal join method and want evidence in the log.\n\nWhat does the _METHOD option on PROC SQL do?',
    options: [
      'Writes the query execution plan (join/merge methods) to the SAS log',
      'Encrypts query results before printing',
      'Creates macro variables from the execution plan',
      'Replaces hash objects with sort-merge automatically',
    ],
    explanation:
      'PROC SQL _METHOD displays the methods the SQL optimizer selected — useful for performance tuning and debugging.',
    coachingTip:
      'Tune slow SQL → _METHOD in log. NOEXEC for syntax-only checks.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-06': {
    title: 'WHICH function position',
    question:
      'In a DATA step validation rule you locate which argument in a list equals the target value "b".\n\nWhat is the result of which("b", "a", "b", "c")?',
    options: ['1', '2', '3', '0'],
    explanation:
      'WHICH returns the 1-based position of the first argument matching the search value. "b" matches the second argument, so the result is 2. This differs from INDEX, which searches inside a single string.',
    coachingTip:
      'WHICH = which argument equals the first value. INDEX = position of substring inside one string.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-07': {
    title: 'PROC FORMAT CNTLIN',
    question:
      'Format labels for codes change weekly from a maintenance table with start and label columns. You cannot hard-code VALUE statements each time.\n\nWhat does PROC FORMAT CNTLIN= do?',
    options: [
      'Builds a format from a dataset containing start, label, and related columns',
      'Joins two SQL tables on formatted keys',
      'Creates macro variables from format names',
      'Defines hash object keys from a format catalog',
    ],
    explanation:
      'CNTLIN= reads a dataset (start, label, type, etc.) to create or update user-defined formats dynamically.',
    coachingTip:
      'Dynamic formats from a lookup table → PROC FORMAT CNTLIN= dataset.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'at-08': {
    title: 'Hash iterator HITER',
    question:
      'A hash table holds multiple rows per key. After a successful find(), you must process every duplicate entry for that key.\n\nWhat SAS feature iterates through entries in a hash object?',
    options: [
      'A DECLARE HITER hash iterator bound to the hash object',
      'ORDER BY in PROC SQL on the hash table',
      'A %DO loop over automatic macro variables',
      'ODS OUTPUT from PROC PRINT',
    ],
    explanation:
      'DECLARE HITER objects traverse hash table entries — essential when multiple rows share a key or you need full enumeration.',
    coachingTip:
      'Multiple rows per key or walk all entries → HITER after hash setup.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-01': {
    title: 'LEFT JOIN retention',
    question:
      'Table PATIENTS lists every enrolled subject. Table LABS has results only for subjects who completed visits. The report must list all patients; lab columns should be missing when no lab exists.\n\nWhich join type do you use?',
    options: [
      'LEFT JOIN — all rows from the left table plus matching right rows',
      'INNER JOIN — only subjects with lab records',
      'INTERSECT — subjects in both tables',
      'EXCEPT — patients not in the lab table',
    ],
    explanation:
      'LEFT JOIN keeps every row from the left table; unmatched right-side columns are missing.',
    coachingTip:
      'Keep all from table A, optional match from B → LEFT JOIN with A on the left.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-02': {
    title: 'CORR summary function',
    question:
      'In PROC SQL you group by site and need the Pearson correlation between baseline and follow-up lab values per site.\n\nWhat does the CORR() summary function provide?',
    options: [
      'Correlation between two numeric columns, typically with GROUP BY',
      'A merge of two datasets on correlated keys',
      'Automatic creation of macro variables from correlation output',
      'Row ordering by correlation magnitude',
    ],
    explanation:
      'PROC SQL summary functions such as CORR, STD, and VAR operate on numeric columns and combine with GROUP BY for grouped statistics.',
    coachingTip:
      'Grouped stats in SQL → summary functions (MEAN, STD, CORR) + GROUP BY.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-03': {
    title: 'SELECT INTO macro variable',
    question:
      'Before a macro runs, you need the maximum event date from staging.events stored in macro variable &maxdt for a WHERE clause.\n\nWhat does SELECT max(event_date) INTO :maxdt accomplish in PROC SQL?',
    options: [
      'Creates or updates macro variable &maxdt from the query result',
      'Creates an index on event_date for faster joins',
      'Loads the result into a hash object named maxdt',
      'Writes a permanent format catalog entry',
    ],
    explanation:
      'SELECT ... INTO :macvar stores query results into macro variables — a core SQL and macro integration pattern on the Advanced exam.',
    coachingTip:
      'Single value (or list with trimmed/separated options) from SQL → INTO :macvar.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-04': {
    title: '%NRSTR quoting',
    question:
      'A macro stores the literal text %include &path; inside a macro variable without triggering macro resolution at definition time.\n\nWhat does %NRSTR protect against?',
    options: [
      'Macro trigger characters (& and %) being interpreted during macro compilation',
      'Accidental deletion of datasets in a library',
      'Log output from being written to the console',
      'The OBS= system option resetting to zero',
    ],
    explanation:
      '%NRSTR is a macro quoting function — stronger than %STR for masking & and % so they remain literal until intended execution.',
    coachingTip:
      'Literals containing & or % → %NRSTR (or %SUPERQ for indirect resolution).',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-05': {
    title: 'SYMPUTX vs SYMPUT',
    question:
      'You write macro variables from a DATA step. Values have trailing blanks and you need a macro-local symbol table in some cases.\n\nHow does CALL SYMPUTX differ from CALL SYMPUT?',
    options: [
      'SYMPUTX trims leading/trailing blanks and supports symbol-table scope options such as LOCAL',
      'SYMPUTX works only in PROC steps, not DATA steps',
      'SYMPUT creates permanent datasets instead of macro variables',
      'There is no functional difference on SAS 9.4',
    ],
    explanation:
      'CALL SYMPUTX is the preferred interface: it trims values and can control macro variable scope (e.g., LOCAL). SYMPUT is the older routine.',
    coachingTip:
      'DATA step → macro with clean values → SYMPUTX. Scope control → SYMPUTX options.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-06': {
    title: '&SYSMACRONAME context',
    question:
      'A nested macro calls %log_state for debugging. The log must print which macro is currently executing without hard-coding names.\n\nWhat does &SYSMACRONAME return?',
    options: [
      'The name of the macro currently executing',
      'The SAS product version string',
      'The numeric code of the last ERROR in the log',
      'The physical path of the WORK library',
    ],
    explanation:
      'Automatic macro variables report execution context — &SYSMACRONAME is the active macro name; &SYSDATE and &SYSTIME are other examples.',
    coachingTip:
      'Debugging nested macros → &SYSMACRONAME. Session date → &SYSDATE.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-07': {
    title: 'hash.add duplicate key',
    question:
      'You load keys into a hash with h.add() in a DATA step. The second row has the same key as an row already added.\n\nWhen does hash.add() return a non-zero rc?',
    options: [
      'When the key already exists — duplicate keys are rejected unless replace= is used',
      'When the source dataset is empty on the first observation',
      'Whenever PROC PRINT runs in the same step',
      'Whenever system option OBS=0 is set globally',
    ],
    explanation:
      'By default hash.add() fails (rc≠0) on duplicate keys. Use the replace= dataset option or replace method to allow overwrites.',
    coachingTip:
      'add + duplicate key → error rc. Need upsert behavior → replace= or .replace().',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-08': {
    title: 'PROC FCMP purpose',
    question:
      'Your team needs a custom scoring function callable from both DATA steps and other procedures, with arguments validated like built-ins.\n\nWhat is PROC FCMP used for?',
    options: [
      'Creating user-defined functions and CALL routines reusable across steps',
      'Importing and formatting Excel workbooks',
      'Comparing two datasets observation-by-observation in PROC COMPARE only',
      'Running pass-through SQL to external databases',
    ],
    explanation:
      'PROC FCMP lets you define custom functions and subroutines stored in catalogs for reuse — an advanced programming technique.',
    coachingTip:
      'Reusable custom functions → FCMP catalog, not macro text generation.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-09': {
    title: 'UNION ALL vs UNION',
    question:
      'You stack daily extracts from two sites into one table. Exact duplicate rows are acceptable and must all be kept for audit.\n\nHow does UNION ALL differ from UNION?',
    options: [
      'UNION ALL keeps all rows including duplicates; UNION removes duplicate rows',
      'UNION ALL works on only one table; UNION requires two',
      'UNION ALL always sorts; UNION never sorts',
      'UNION ALL creates macro variables from each row',
    ],
    explanation:
      'UNION concatenates result sets and removes duplicates. UNION ALL concatenates without deduplication.',
    coachingTip:
      'Keep dupes → UNION ALL. Dedupe when stacking → UNION.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-10': {
    title: 'PROC CONTENTS OUT=',
    question:
      'A validation script must read variable names, types, and lengths from 200 datasets into one dataset for reporting — not printed listings.\n\nWhat does PROC CONTENTS with OUT= produce?',
    options: [
      'A SAS dataset containing variable-level metadata from the scanned members',
      'A graphical chart of variable distributions',
      'A macro catalog of CONTENTS procedures',
      'An XPT transport file for FDA submission',
    ],
    explanation:
      'OUT= on PROC CONTENTS writes metadata (name, type, length, label, etc.) to a dataset for programmatic processing.',
    coachingTip:
      'Automate metadata harvest → CONTENTS OUT= work.meta, then SQL on the output.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-11': {
    title: 'Macro %DO iterative loop',
    question:
      'Macro %run_reports contains %DO i=1 %TO 10; ... %MEND; and generates ten %include statements before any DATA step executes.\n\nWhat does %DO i=1 %TO 10 accomplish?',
    options: [
      'Iterates macro statements at macro compile/execution time, generating SAS code text',
      'Runs the DATA step exactly ten times only at data runtime',
      'Automatically creates ten permanent datasets named i1–i10',
      'Replaces PROC SQL with ten separate PROC PRINT steps at runtime only',
    ],
    explanation:
      'Macro %DO loops generate SAS source code before execution — distinct from DATA step DO loops which iterate at runtime.',
    coachingTip:
      'Macro %DO → text generation time. DATA DO → observation/runtime. Classic trap.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ad-12': {
    title: 'Correlated subquery',
    question:
      'You need employees whose salary exceeds their department average. The inner query references dept from the outer query row.\n\nWhat defines a correlated subquery?',
    options: [
      'The inner query references values from the current row of the outer query',
      'Both queries use tables with identical names in the same library',
      'Two SELECT statements are combined with UNION',
      'System option OBS=0 prevents execution of the inner query',
    ],
    explanation:
      'A correlated subquery depends on outer query columns and is evaluated in context of each outer row — unlike uncorrelated subqueries.',
    coachingTip:
      'Inner WHERE uses outer column → correlated. Often appears with EXISTS or row comparisons.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
}
