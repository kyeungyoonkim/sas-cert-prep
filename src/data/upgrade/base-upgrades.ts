import type { Question } from '../types'

/**
 * Scenario-based exam-quality upgrades for SAS Base certification questions.
 * Merged onto base questions via applyMcqUpgrades — correctIndex preserves original intent.
 */
export const BASE_UPGRADES: Record<string, Partial<Question>> = {
  // ===== Already exam-quality — coachingTip only =====
  'ds-01': {
    coachingTip: 'Permanent = libref from LIBNAME. One-level names default to WORK (temporary).',
    collections: ['exam-quality'],
  },
  'ds-03': {
    coachingTip: 'Structure before rows — PROC CONTENTS for metadata; PROC PRINT lists data.',
    collections: ['exam-quality'],
  },
  'ds-12': {
    coachingTip: 'No libref on the DATA statement → WORK. Temporary data disappears at session end.',
    collections: ['exam-quality'],
  },
  'md-01': {
    coachingTip: 'Running totals need RETAIN + initialize, or use the SUM statement (implicit RETAIN).',
    collections: ['exam-quality'],
  },
  'md-05': {
    coachingTip: 'Count OUTPUT calls inside the loop — each iteration can create one observation.',
    collections: ['exam-quality'],
  },
  'md-08': {
    coachingTip: 'LENGTH must come before first assignment — formats only change display, not storage.',
    collections: ['exam-quality'],
  },
  'eh-01': {
    coachingTip: 'ERROR = step failed. Always verify the output dataset exists before downstream steps.',
    collections: ['exam-quality'],
  },
  'rp-01': {
    coachingTip: 'Frequency tables → PROC FREQ. Do not print 50,000 rows when counts will do.',
    collections: ['exam-quality'],
  },

  // ===== DATA STRUCTURES (base.ts) =====
  'ds-02': {
    title: 'LIBNAME maps a folder',
    question:
      'You need to read SAS datasets stored in C:\\data without copying them into WORK. Your colleague suggests adding this statement at the top of the program:\n\nlibname mylib "C:\\data";\n\nWhich statement correctly describes what mylib becomes?',
    options: [
      'mylib is a temporary library reference valid only for the current DATA step',
      'mylib is a library reference pointing to the C:\\data folder',
      'mylib is an alias for the SASHELP library',
      'The LIBNAME statement can only be used inside a DATA step',
    ],
    correctIndex: 1,
    explanation:
      'LIBNAME maps an external folder to a SAS library (libref). You then reference datasets as mylib.sales. LIBNAME is a global statement, not limited to DATA steps.',
    coachingTip: 'LIBNAME = folder → libref. Two-level names (mylib.dataset) access permanent storage.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-04': {
    title: 'SET concatenation count',
    question:
      'You stack two small lookup tables into one analysis file using SET. After this code runs, how many observations are in WORK.TEST?',
    code: `data one; x=1; output; x=2; output; run;
data two; y=3; output; run;
data test; set one two; run;`,
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation:
      'SET with multiple datasets concatenates vertically. ONE has 2 observations, TWO has 1 → 3 total in TEST.',
    coachingTip: 'SET = stack rows (vertical). MERGE = combine columns by BY (horizontal).',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-05': {
    title: 'PROC IMPORT CSV delimiter',
    question:
      'A vendor delivers comma-separated sales extracts. You use PROC IMPORT with DBMS=CSV and omit the DELIMITER= option.\n\nWhat delimiter does PROC IMPORT assume by default?',
    options: ['Comma (,)', 'Tab', 'Space', 'Semicolon'],
    correctIndex: 0,
    explanation:
      'For DBMS=CSV, the default delimiter is a comma. Use DELIMITER= for tab, pipe, or other separators.',
    coachingTip: 'CSV defaults to comma. Tab-delimited files often need DELIMITER=\'09\'x or DSD.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-06': {
    title: 'MERGE without SORT',
    question:
      'You merge two customer files by ID but forget to sort first. The log may show a message about BY variables.\n\nWhat message is most likely when BY variables are not properly sorted?',
    code: `data merged;
  merge one two;
  by id;
run;`,
    options: [
      'ERROR: BY variables are not properly sorted',
      'WARNING: Data set ONE may be incomplete',
      'NOTE: MERGE statement has more than one data set',
      'ERROR: Variable ID is not found',
    ],
    correctIndex: 0,
    explanation:
      'MERGE requires inputs sorted by BY variables. Unsorted data triggers a BY-sort error/warning and can produce incorrect matches.',
    coachingTip: 'MERGE recipe: PROC SORT both datasets BY the key, then MERGE … BY key.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-07': {
    title: 'SAS date value lookup',
    question:
      'A legacy file stores order dates as SAS date integers. One row shows the value 21915 and you apply FORMAT date9.\n\nWhat calendar date does 21915 represent?',
    options: ['01JAN2020', '15JAN2020', '01DEC2019', '15DEC2019'],
    correctIndex: 0,
    explanation:
      'SAS dates count days from 01JAN1960 (0). 21915 formats to 01JAN2020 with DATE9.',
    coachingTip: 'Epoch = 01JAN1960. Use PUT(date, date9.) or MDY() to verify unfamiliar integers.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-08': {
    title: 'WHERE vs IF efficiency',
    question:
      'You subset a 10-million-row claims table in a DATA step. The lead programmer asks why WHERE on SET is preferred over IF for large files.\n\nWhich statement is correct?',
    options: [
      'WHERE is only for DATA steps; IF is only for PROC steps',
      'WHERE filters before reading observations, making it more efficient',
      'IF cannot be used in PROC steps',
      'WHERE and IF behave exactly the same',
    ],
    correctIndex: 1,
    explanation:
      'WHERE can subset during the read phase (especially on SET). IF evaluates after the observation enters the PDV.',
    coachingTip: 'Large data + SET → prefer WHERE on the SET statement for earlier filtering.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-09': {
    title: 'KEEP vs DROP options',
    question:
      'You inherit a 200-variable dataset but only need five columns in the output. You can use dataset options on SET or DATA.\n\nHow do KEEP= and DROP= differ?',
    options: [
      'KEEP= retains only specified variables; DROP= removes only specified variables',
      'KEEP= is for PROC steps; DROP= is for DATA steps',
      'Both have the same function',
      'KEEP= can only be used on permanent datasets',
    ],
    correctIndex: 0,
    explanation:
      'KEEP= whitelists variables; DROP= blacklists them. Both work as dataset options on DATA or SET.',
    coachingTip: 'Few columns needed → KEEP=. Few to exclude → DROP=. Same effect, opposite logic.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-10': {
    title: 'IF subsetting with missing',
    question:
      'You filter high scorers with IF score > 80. One row has a missing score (.).\n\nHow many observations are written to RESULT?',
    code: `data demo;
  input id score;
  datalines;
1 85
2 90
3 .
4 75
;
run;

data result;
  set demo;
  if score > 80;
run;`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1,
    explanation:
      'Only id 1 (85) and id 2 (90) exceed 80. Missing values evaluate false in numeric comparisons and are excluded.',
    coachingTip: 'Missing (.) is never > any number. Always account for . in IF subsetting traps.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ds-11': {
    title: 'GUESSINGROWS in PROC IMPORT',
    question:
      'PROC IMPORT misclassified a column as numeric because a text value appeared only on row 50. Your manager asks which option controls how many rows IMPORT scans when guessing types.\n\nWhat does GUESSINGROWS= do?',
    options: [
      'Specify the number of rows PROC IMPORT examines when guessing variable types',
      'Specify the number of rows to match during a MERGE',
      'Limit the number of rows in PROC PRINT output',
      'Specify the number of iterations in a DATA step',
    ],
    correctIndex: 0,
    explanation:
      'GUESSINGROWS= sets how many initial rows PROC IMPORT reads to infer character vs numeric. Default is 20.',
    coachingTip: 'Late-arriving text in CSV? Raise GUESSINGROWS= or define column types explicitly.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },

  // ===== MANAGE DATA (base.ts) =====
  'md-02': {
    title: 'SUM statement total',
    question:
      'A DATA step accumulates VALUE with a SUM statement (no explicit RETAIN). After three rows (10, 20, 30), what is TOTAL on the last observation?',
    code: `data calc;
  input value;
  total + value;
  datalines;
10
20
30
;
run;`,
    options: ['30', '60', '10', '0'],
    correctIndex: 1,
    explanation:
      'total + value is a SUM statement with implicit RETAIN starting at 0. 10+20+30 = 60 on the last row.',
    coachingTip: 'SUM statement (+) accumulates. Plain assignment (=) does not unless you RETAIN.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-03': {
    title: 'SUBSTR position and length',
    question:
      'You extract a three-character product code from NAME="SASBASE" starting at position 2.\n\nWhat does SUBSTR(name, 2, 3) return?',
    options: ['SAS', 'ASB', 'ASBA', 'SB'],
    correctIndex: 1,
    explanation:
      'SUBSTR(string, start, length) — position 2 for 3 characters from "SASBASE" yields "ASB". SAS indexes from 1.',
    coachingTip: 'SUBSTR = start position + length. Position 1 is the first character, not 0.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-04': {
    title: 'INPUT character to numeric',
    question:
      'A character field holds "123.45" and you need a numeric variable for calculations.\n\nWhat is the result of INPUT("123.45", 8.2)?',
    options: ['Character "123.45"', 'Numeric 123.45', 'Numeric 123', 'An error occurs'],
    correctIndex: 1,
    explanation:
      'INPUT converts character to numeric using an informat. 8.2 reads 123.45 as a numeric value.',
    coachingTip: 'INPUT = char→num (needs informat). PUT = num→char (needs format).',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-06': {
    title: 'ARRAY element assignment',
    question:
      'An ARRAY groups A1–A3. A DO loop sets each element to i*10.\n\nWhat is the value of A2 after the loop completes?',
    code: `data test;
  array nums(3) a1-a3;
  do i = 1 to 3;
    nums(i) = i * 10;
  end;
  drop i;
run;`,
    options: ['10', '20', '30', 'Missing'],
    correctIndex: 1,
    explanation:
      'When i=2, nums(2) maps to a2, so a2 = 2*10 = 20.',
    coachingTip: 'ARRAY name(index) refers to the indexed variable — nums(2) is a2 when a1-a3 are listed.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-07': {
    title: 'INTCK interval count',
    question:
      'You need the number of whole months between an employee start date and termination date for tenure reporting.\n\nWhat does INTCK("month", start_date, end_date) return?',
    options: [
      'The number of months between two dates',
      'A date with months added',
      'The month number (1–12) from a date',
      'The month name as text',
    ],
    correctIndex: 0,
    explanation:
      'INTCK counts interval boundaries between two dates/times. INTNX shifts a date by an interval.',
    coachingTip: 'INTCK = count intervals. INTNX = move date forward/back by intervals.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-09': {
    title: 'FIRST. and LAST. flags',
    question:
      'After PROC SORT by REGION, you use BY REGION in a DATA step to flag group boundaries.\n\nWhat is the purpose of FIRST.var and LAST.var?',
    options: [
      'Identify the first/last observation in a BY group',
      'Select the first/last variables in a dataset',
      'Specify sort direction',
      'Read the first/last row of a file',
    ],
    correctIndex: 0,
    explanation:
      'FIRST.var is 1 on the first row of each BY group; LAST.var is 1 on the last row. Requires prior sort by BY variables.',
    coachingTip: 'FIRST./LAST. only work after PROC SORT by the same BY variables.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-10': {
    title: 'COMPRESS removes blanks',
    question:
      'You clean a product label stored as "SAS Base" by removing spaces before concatenation.\n\nWhat is the result of COMPRESS("SAS Base", " ")?',
    options: ['SASBase', 'SAS Base', 'SASBASE', 'S A S B a s e'],
    correctIndex: 0,
    explanation:
      'COMPRESS removes specified characters — here blanks — yielding "SASBase". Modifiers like "a" or "d" target alphabetic or digit characters.',
    coachingTip: 'COMPRESS = remove chars. CATS/CAT = concatenate (with different trimming rules).',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-11': {
    title: 'PROC TRANSPOSE purpose',
    question:
      'Monthly revenue arrives with one column per month (wide format). Analytics needs one row per month per product (long format).\n\nWhat is the primary purpose of PROC TRANSPOSE?',
    options: [
      'Convert data between wide and long formats',
      'Sort a dataset',
      'Merge variables horizontally',
      'Replace missing values',
    ],
    correctIndex: 0,
    explanation:
      'PROC TRANSPOSE pivots rows to columns (or vice versa), spreading VAR variables into new column names grouped by BY variables.',
    coachingTip: 'Wide ↔ long reshaping → PROC TRANSPOSE. Sorting duplicates → PROC SORT.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-12': {
    title: 'Regional running total',
    question:
      'You compute a running total of AMOUNT within each REGION after sorting by REGION.\n\nWhat does GROUP_TOTAL represent on each observation?',
    code: `proc sort data=sales; by region; run;
data summary;
  set sales;
  by region;
  if first.region then group_total = 0;
  group_total + amount;
run;`,
    options: [
      'Grand total of amount across all regions',
      'Running total of amount within the current region',
      'Average amount by region',
      'Total for only the last region',
    ],
    correctIndex: 1,
    explanation:
      'FIRST.region resets group_total to 0; the SUM statement accumulates within each region — a per-group running total.',
    coachingTip: 'Reset at FIRST.byvar + SUM statement = running total within BY group.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-13': {
    title: 'RENAME dataset option',
    question:
      'A downstream report expects NEWNAME but your source file has OLDNAME. You want to rename during the DATA step creation.\n\nWhich is a correct use of the RENAME= dataset option?',
    options: [
      'data new(rename=(oldname=newname));',
      'rename oldname=newname; as a global statement',
      'proc rename data=old new=new;',
      'set old rename new;',
    ],
    correctIndex: 0,
    explanation:
      'RENAME=(old=new) is a dataset option on DATA or SET. A RENAME statement inside the DATA step also works.',
    coachingTip: 'Dataset option: rename=(old=new) in parentheses on DATA or SET.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-14': {
    title: 'SCAN token extraction',
    question:
      'A comma-delimited course list is stored as "SAS,Base,Cert". You need the second token.\n\nWhat does SCAN("SAS,Base,Cert", 2, ",") return?',
    options: ['SAS', 'Base', 'Cert', 'SAS,Base,Cert'],
    correctIndex: 1,
    explanation:
      'SCAN returns the nth delimited token. Token 2 with comma delimiter is "Base". COUNTW counts tokens.',
    coachingTip: 'SCAN = get nth word. COUNTW = count words. Always specify the delimiter for non-blank separators.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'md-15': {
    title: 'PROC MEANS MISSING option',
    question:
      'A CLASS variable has missing values you want reported as their own category in summary tables.\n\nWhat does the MISSING option in PROC MEANS do?',
    options: [
      'Include missing values of CLASS variables in the analysis',
      'Replace missing values with 0',
      'Delete observations with missing values',
      'Output only missing values',
    ],
    correctIndex: 0,
    explanation:
      'MISSING includes missing CLASS levels as a separate category. By default, missing CLASS levels are excluded.',
    coachingTip: 'Want a row for missing category in CLASS summaries → PROC MEANS MISSING.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },

  // ===== ERROR HANDLING (base.ts) =====
  'eh-02': {
    title: 'Missing semicolon syntax error',
    question:
      'Your program fails to compile. Review the DATA step below and identify the syntax problem.\n\nWhat is wrong with this code?',
    code: `data test;
  set mydata;
  if age > 18 then status = "Adult"
run;`,
    options: [
      'Missing semicolon (;) after the assignment',
      'Incorrect IF condition — age cannot exceed 18',
      'SET statement is invalid in a DATA step',
      'Variable STATUS is a reserved name',
    ],
    correctIndex: 0,
    explanation:
      'The assignment after THEN needs a terminating semicolon: status = "Adult";. Missing semicolons are the most common syntax errors.',
    coachingTip: 'Every statement ends with ;. The line before RUN is a frequent miss.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-03': {
    title: 'Invalid data default behavior',
    question:
      'A raw file has a non-numeric value in a numeric column. No special invalid= handler is coded.\n\nWhat is the default DATA step behavior for invalid data?',
    options: [
      '_ERROR_=1 is set and the observation is still output',
      'The DATA step stops immediately',
      'The observation is skipped entirely',
      'Values are converted to missing and processing stops',
    ],
    correctIndex: 0,
    explanation:
      'Invalid data sets the affected variable to missing, sets _ERROR_=1, and typically still outputs the row unless you handle it otherwise.',
    coachingTip: 'Check _ERROR_ flag or use invalid= option to branch on bad input rows.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-04': {
    title: 'OPTIONS OBS=0 syntax check',
    question:
      'You want to verify that a long program compiles without processing millions of rows.\n\nWhat is the effect of OPTIONS OBS=0?',
    options: [
      'Steps run but create 0 observations (syntax check mode)',
      'All DATA steps are permanently disabled',
      'Log output is suppressed',
      'Only PROC steps are allowed to run',
    ],
    correctIndex: 0,
    explanation:
      'OBS=0 enables syntax-check behavior: code compiles and logic executes but no observations are processed.',
    coachingTip: 'Debug compile errors on big jobs → OPTIONS OBS=0; before the heavy steps.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-05': {
    title: 'Missing value arithmetic NOTE',
    question:
      'After adding two variables where one is missing, the log shows:\n\nNOTE: Missing values were generated as a result of performing an operation on missing values.\n\nWhat does this NOTE mean?',
    options: [
      'Arithmetic involving missing values produces missing results',
      'SAS replaced missing values with 0 automatically',
      'A fatal program error occurred',
      'Observations were deleted from the output',
    ],
    correctIndex: 0,
    explanation:
      'Any arithmetic with a missing operand yields missing (.). This NOTE reports normal SAS behavior, not a failure.',
    coachingTip: 'Missing + number = missing. This NOTE is informational — not an ERROR.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-06': {
    title: 'Logic error in IF condition',
    question:
      'Four programmers submitted adult-flag code. One version uses an invalid operator that SAS may misinterpret.\n\nWhich option contains a logic/syntax error?',
    code: `/* Option A */
if age >= 18 then adult = 1;
else adult = 0;

/* Option B */
if age => 18 then adult = 1;

/* Option C */
if age >= 18; then adult = 1;

/* Option D */
if age >= 18 then adult = 1;`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 1,
    explanation:
      'Option B uses => which is not the greater-or-equal operator (>=). SAS may treat it as a variable reference, causing unexpected behavior.',
    coachingTip: 'Greater-or-equal is >=, never =>. Scan IF conditions for typos that compile but misbehave.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-07': {
    title: 'PROC PRINTTO redirect',
    question:
      'Your batch job fills the interactive log window. You need to capture log and listing output to files for overnight review.\n\nWhat is the purpose of PROC PRINTTO?',
    options: [
      'Redirect log and listing output to specified file destinations',
      'Change the storage format of output datasets',
      'Configure physical printer hardware',
      'Generate HTML reports directly',
    ],
    correctIndex: 0,
    explanation:
      'PROC PRINTTO with LOG= and/or PRINT= sends log and listing output to external files. Restore defaults with PROC PRINTTO without options.',
    coachingTip: 'Capture logs in batch → PROC PRINTTO LOG="path"; … then PROC PRINTTO; to reset.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-08': {
    title: 'LENGTH cannot shorten',
    question:
      'Mid-step you try to shrink an existing 20-character variable to length 5 with a LENGTH statement.\n\nWhat happens when you attempt to shorten a variable length with LENGTH after the variable already exists?',
    options: [
      'A warning is issued and the existing length is kept',
      'The variable length is shortened successfully',
      'The step stops with an ERROR',
      'A new variable with the shorter length is created',
    ],
    correctIndex: 0,
    explanation:
      'LENGTH can increase a variable length before or at first reference, but cannot shorten an already-defined length in the same step.',
    coachingTip: 'Need shorter values → use SUBSTR or redefine in a new step. LENGTH only grows.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-09': {
    title: 'MERGE without IN=',
    question:
      'You merge CUSTOMERS and ORDERS by CUSTOMER_ID without the IN= option. Some customers have no orders and some orders reference unknown customers.\n\nWhat happens to non-matching observations?',
    options: [
      'They are included in the output (full outer join behavior)',
      'They are automatically deleted',
      'SAS stops with an ERROR',
      'Only missing values are output for non-matches',
    ],
    correctIndex: 0,
    explanation:
      'Default MERGE outputs all BY groups from either input — like a full outer join. Use IN= with IF for inner-join filtering.',
    coachingTip: 'Match-only rows → merge a(in=x) b(in=y); by id; if x and y;. Default MERGE keeps non-matches.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'eh-10': {
    title: 'PUT and INPUT misuse',
    question:
      'A junior programmer uses PUT to read a character column into numeric and INPUT to display a numeric salary.\n\nWhat happens when PUT and INPUT are used in reverse of their intended direction?',
    options: [
      'Type mismatches cause unexpected results or errors',
      'SAS automatically converts types with no issues',
      'Nothing changes — both functions are interchangeable',
      'The source dataset is deleted',
    ],
    correctIndex: 0,
    explanation:
      'PUT converts numeric→character; INPUT converts character→numeric. Reversing them causes conversion failures or wrong values.',
    coachingTip: 'PUT = num out as text. INPUT = text in as num. Match function to source type.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },

  // ===== REPORTS (base.ts) =====
  'rp-02': {
    title: 'PROC MEANS NMISS statistic',
    question:
      'QC asks for a report showing how many missing values exist in each numeric analysis variable.\n\nWhat does the NMISS option/statistic do in PROC MEANS?',
    options: [
      'Output the count of missing values',
      'Exclude missing values from all calculations',
      'Treat missing values as 0 in sums',
      'Analyze only rows where values are missing',
    ],
    correctIndex: 0,
    explanation:
      'NMISS reports the count of missing values per variable. N reports the count of non-missing values.',
    coachingTip: 'N = non-missing count. NMISS = missing count. Both are common QC statistics.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-03': {
    title: 'ODS HTML destination',
    question:
      'You need to email a tabular report as a standalone web page. Your team uses ODS to capture procedure output.\n\nWhat is the role of ODS HTML FILE="report.html"?',
    options: [
      'Send SAS procedure output to an HTML file',
      'Convert an HTML file into a SAS dataset',
      'Start a local web server for live viewing',
      'Generate a PDF document',
    ],
    correctIndex: 0,
    explanation:
      'ODS HTML FILE= opens an HTML destination. Close it with ODS HTML CLOSE; when finished.',
    coachingTip: 'ODS HTML FILE= … run procs … ODS HTML CLOSE;. PDF uses ODS PDF FILE=.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-04': {
    title: 'PROC REPORT COLUMN',
    question:
      'You build a custom cross-tab in PROC REPORT and must control which variables appear and in what order.\n\nWhat is the role of the COLUMN statement?',
    options: [
      'Specify variables (columns) to display and their order in the report',
      'Limit the number of data rows printed',
      'Define the sort order of the source dataset',
      'Set the report title text',
    ],
    correctIndex: 0,
    explanation:
      'COLUMN lists report columns in display order. DEFINE sets each column role (group, analysis, display, order, etc.).',
    coachingTip: 'COLUMN = what shows and order. DEFINE = how each column behaves.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-05': {
    title: 'PROC PRINT default output',
    question:
      'A reviewer wants to eyeball raw rows before writing summary code.\n\nWhat is the default behavior of PROC PRINT?',
    options: [
      'List dataset observations in listing format (rows and columns)',
      'Compute summary statistics automatically',
      'Create one-way frequency tables',
      'Generate charts and graphs',
    ],
    correctIndex: 0,
    explanation:
      'PROC PRINT lists observations. Control columns with VAR, subset with WHERE, limit rows with OBS.',
    coachingTip: 'Quick row inspection → PROC PRINT. Summaries → PROC MEANS or FREQ.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-06': {
    title: 'PROC SORT NODUPKEY',
    question:
      'After sorting by CUSTOMER_ID, you want to keep only the first row per customer and drop later duplicates on that key.\n\nWhat does the NODUPKEY option do in PROC SORT?',
    options: [
      'Remove duplicate observations based on BY variables, keeping the first',
      'Remove rows where all variables are identical',
      'Skip the sort and only deduplicate',
      'Sort missing values to the top',
    ],
    correctIndex: 0,
    explanation:
      'NODUPKEY deduplicates on BY variables only, retaining the first row per BY group. NODUPREC compares all variables.',
    coachingTip: 'Key-level dedup → NODUPKEY. Exact duplicate rows → NODUPREC.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-07': {
    title: 'PROC TABULATE CLASS vs VAR',
    question:
      'You build a summary table: REGION and GENDER as table dimensions, SALARY as the measure to analyze.\n\nWhat is the difference between CLASS and VAR in PROC TABULATE?',
    options: [
      'CLASS is for categorical variables; VAR is for continuous analysis variables',
      'CLASS must be numeric; VAR must be character',
      'There is no difference — they are interchangeable',
      'Only CLASS can be used with a BY statement',
    ],
    correctIndex: 0,
    explanation:
      'CLASS variables form table dimensions (categories). VAR variables are the continuous measures analyzed in table cells.',
    coachingTip: 'Categories → CLASS. Numbers to summarize → VAR. Build layout with TABLE statement.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-08': {
    title: 'TITLE statement effect',
    question:
      'Every page of your printed output should show "Q4 Sales Summary" at the top across all procedures.\n\nWhat is the effect of a TITLE statement?',
    options: [
      'Display a title at the top of SAS output',
      'Set variable labels in the dataset',
      'Specify the output file name',
      'Write a message to the SAS log only',
    ],
    correctIndex: 0,
    explanation:
      'TITLE and FOOTNOTE add headers and footers to procedure output. Clear with TITLE; or FOOTNOTE;.',
    coachingTip: 'TITLE persists until cleared. Use TITLE1, TITLE2 for multi-line titles.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-09': {
    title: 'Applying PROC FORMAT values',
    question:
      'You created a user-defined format with PROC FORMAT to display 1/2/3 as Low/Medium/High.\n\nHow do you apply that format to a variable in output?',
    options: [
      'Use a FORMAT statement or assign a format to the variable',
      'Use a LABEL statement only',
      'Use an INFORMAT statement only — formats cannot be applied in procedures',
      'Use PROC PRINTTO to map values',
    ],
    correctIndex: 0,
    explanation:
      'Define with PROC FORMAT VALUE= and apply via FORMAT variable fmtname.; in DATA or PROC steps, or with the PUT function.',
    coachingTip: 'FORMAT changes display, not stored values. Define once in PROC FORMAT, apply in FORMAT statement.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-10': {
    title: 'PROC SQL DISTINCT rows',
    question:
      'A query returns duplicate customer rows because multiple addresses exist. You only want unique customer IDs.\n\nWhat is the role of DISTINCT in a PROC SQL SELECT?',
    options: [
      'Return only unique rows based on the selected columns',
      'Sort rows in ascending order',
      'Calculate group totals with subqueries',
      'Perform an inner join between tables',
    ],
    correctIndex: 0,
    explanation:
      'SELECT DISTINCT eliminates duplicate rows from the result set based on the selected column combination.',
    coachingTip: 'Duplicate rows in SQL result → try SELECT DISTINCT or refine JOIN keys.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-11': {
    title: 'PROC MEANS CLASS grouping',
    question:
      'You want mean and sum of REVENUE broken out by REGION in one combined table (not separate BY-group blocks).\n\nWhat happens when you use a CLASS statement in PROC MEANS?',
    options: [
      'Summary statistics are computed for groups defined by CLASS variables',
      'CLASS variables are excluded from the output',
      'Only the dataset is sorted — no statistics are produced',
      'Only frequency counts are produced — no means',
    ],
    correctIndex: 0,
    explanation:
      'CLASS creates grouped summary statistics in a single output table. BY produces separate physical tables per BY group.',
    coachingTip: 'One combined grouped table → CLASS. Separate tables per group → BY.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'rp-12': {
    title: 'ODS TRACE debugging',
    question:
      'You need the exact ODS output object name to capture with ODS OUTPUT, but you are unsure what PROC MEANS produces.\n\nWhat is the purpose of ODS TRACE ON?',
    options: [
      'Display names of ODS output objects created in the log (for debugging)',
      'Disable all procedure output',
      'Change the HTML style template',
      'Increase log message severity to ERROR',
    ],
    correctIndex: 0,
    explanation:
      'ODS TRACE ON lists output object names and labels in the log. Pair with ODS TRACE OFF when done.',
    coachingTip: 'Cannot find ODS object name → run once with ODS TRACE ON; and read the log.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },

  // ===== MIXED (base.ts) =====
  'mx-01': {
    title: 'SUM statement behavior',
    question:
      'You need a running total without writing RETAIN explicitly. Your teammate suggests `total + amount;`.\n\nWhich statement correctly describes a SUM statement?',
    options: [
      'It implicitly RETAINs the variable and starts at 0',
      'It requires an explicit RETAIN statement to work',
      'It can only be used in PROC steps',
      'It works with character variables for concatenation',
    ],
    correctIndex: 0,
    explanation:
      'The SUM statement (target + expression;) implies RETAIN and initializes the target to 0 before the first addition.',
    coachingTip: 'SUM statement = shorthand for retain + accumulate. Do not confuse with total = total + amount;.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-02': {
    title: 'INFILE and INPUT roles',
    question:
      'You read a fixed-width text file from disk into a SAS dataset using a DATA step.\n\nWhat is the relationship between INFILE and INPUT?',
    options: [
      'INFILE specifies the raw file; INPUT defines variable reading rules',
      'They perform the same function and are interchangeable',
      'Raw files can be read with INPUT alone — INFILE is optional',
      'INFILE is only valid inside PROC steps',
    ],
    correctIndex: 0,
    explanation:
      'INFILE points to the external file (or fileref); INPUT declares how columns map to variables and informats.',
    coachingTip: 'INFILE = which file. INPUT = how to read columns. Both are required for raw file reads.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-03': {
    title: 'DATA step completion NOTE',
    question:
      'After a successful DATA step, the log ends with:\n\nNOTE: DATA statement used (Total process time):\n      real time           0.01 seconds\n\nWhat does this NOTE indicate?',
    options: [
      'The DATA step completed successfully',
      'The DATA step failed with errors',
      'Zero observations were created because of a filter',
      'Syntax check mode (OBS=0) prevented execution',
    ],
    correctIndex: 0,
    explanation:
      'This NOTE confirms normal completion and reports timing. ERROR messages would appear earlier if the step failed.',
    coachingTip: 'Scan log top-to-bottom: ERROR first, then WARNING, then confirming NOTEs.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-04': {
    title: 'SQL WHERE vs HAVING',
    question:
      'You summarize sales by REGION in PROC SQL and want to exclude low-volume regions after computing totals.\n\nWhat is the difference between HAVING and WHERE in PROC SQL?',
    options: [
      'WHERE filters rows before grouping; HAVING filters grouped results',
      'They are interchangeable in all PROC SQL queries',
      'HAVING is only valid in DATA steps',
      'WHERE cannot be used in any PROC step',
    ],
    correctIndex: 0,
    explanation:
      'WHERE subsets rows before GROUP BY. HAVING filters groups based on aggregate expressions after GROUP BY.',
    coachingTip: 'Row filter before GROUP BY → WHERE. Group filter on sums/counts → HAVING.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-05': {
    title: 'CATS vs CAT trimming',
    question:
      'You concatenate FIRST and LAST names. Some values have trailing blanks that would create double spaces with CAT.\n\nWhat is the difference between CATS and CAT?',
    options: [
      'CATS trims leading and trailing blanks from each argument before concatenating',
      'CAT concatenates only numeric values',
      'There is no difference',
      'CATS concatenates only numeric values',
    ],
    correctIndex: 0,
    explanation:
      'CAT joins as-is. CATS strips blanks from each argument. CATT trims trailing only; CATX adds a delimiter.',
    coachingTip: 'Messy character fields → CATS or CATX. CAT alone preserves padding blanks.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-06': {
    title: 'UPDATE vs MERGE',
    question:
      'You maintain a master customer table and apply daily transaction updates matched by CUSTOMER_ID.\n\nHow does UPDATE differ from MERGE?',
    options: [
      'UPDATE applies transactions to a master dataset (1:1 or 1:many)',
      'They are identical — only the keyword differs',
      'UPDATE is a PROC step statement only',
      'Only MERGE can use BY variables',
    ],
    correctIndex: 0,
    explanation:
      'UPDATE modifies a master dataset with transaction rows matched on BY variables. Unmatched master rows are typically retained.',
    coachingTip: 'Master + transactions → UPDATE. Combining two sources horizontally → MERGE.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-07': {
    title: 'MDY function return type',
    question:
      'You create a SAS date from month, day, and year components for June 29, 2026.\n\nWhat is the result type of MDY(6, 29, 2026)?',
    options: [
      'A SAS date value (numeric)',
      'Character text "29JUN2026"',
      'A compile-time error',
      'A missing value',
    ],
    correctIndex: 0,
    explanation:
      'MDY returns a numeric SAS date integer. Apply FORMAT DATE9. to display 29JUN2026.',
    coachingTip: 'Date functions return numbers. Formats control display; informats parse text input.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-08': {
    title: 'SAS program step boundaries',
    question:
      'A new team member asks what marks the end of a DATA or PROC step in a SAS program.\n\nWhat separates steps in a basic SAS program?',
    options: [
      'A semicolon ending the step statement, or a RUN/QUIT statement',
      'A comma between steps',
      'A period on its own line',
      'A slash (/) character only',
    ],
    correctIndex: 0,
    explanation:
      'Steps end with a semicolon on the triggering statement (DATA, PROC) and often RUN; or QUIT; for PROCs.',
    coachingTip: 'DATA steps often end at RUN; PROCs usually need RUN; unless the procedure auto-terminates.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-09': {
    title: 'PROC FREQ cross-tabulation',
    question:
      'You need a two-way frequency table of AGE group by GENDER, not two separate one-way tables.\n\nIn PROC FREQ, what does the * in TABLES age * gender mean?',
    options: [
      'Request a cross-tabulation (two-way frequency table)',
      'Multiply cell counts mathematically',
      'Concatenate the two variables into one column',
      'Specify ascending sort order for both variables',
    ],
    correctIndex: 0,
    explanation:
      'TABLES A * B requests a cross-tab. A alone is one-way; A * B / C adds a third dimension.',
    coachingTip: 'One-way = single variable. Two-way = var1 * var2. Layered = var1 * var2 / var3.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'mx-10': {
    title: 'Automatic variables quiz',
    question:
      'During a code review, you must identify which variable is NOT an automatic variable present in every DATA step.\n\nWhich of the following is NOT an automatic variable?',
    options: ['_NAME_', '_N_', '_ERROR_', 'FIRST.id'],
    correctIndex: 0,
    explanation:
      '_N_ counts iterations, _ERROR_ flags data errors, FIRST./LAST. appear with BY processing. _NAME_ is created by PROC TRANSPOSE, not automatic in all DATA steps.',
    coachingTip: 'Always automatic in DATA step: _N_, _ERROR_. FIRST./LAST. need BY. _NAME_ comes from TRANSPOSE.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },

  // ===== EXTRA BASE (ex-*) =====
  'ex-ds-01': {
    title: 'Tab-delimited INFILE read',
    question:
      'IT delivers a tab-delimited personnel file. You must read it with a DATA step (not Excel import).\n\nWhich approach correctly reads a tab-delimited external file?',
    options: [
      'infile "data.txt" dsd delimiter=\'09\'x; input id name $ score;',
      'proc import data=file.xlsx out=work.hr;',
      'libname raw "data.txt";',
      'filename raw "data.txt"; /* no INPUT needed */',
    ],
    correctIndex: 0,
    explanation:
      'INFILE names the file; DSD and DELIMITER=\'09\'x handle tab separation; INPUT defines variables.',
    coachingTip: 'Tab delimiter hex is \'09\'x. INFILE + INPUT for raw text; PROC IMPORT for structured files.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ds-02': {
    title: 'FILEREF function',
    question:
      'You assigned fileref REPORT to a CSV path with FILENAME. A macro needs the physical path string at runtime.\n\nWhat does the FILEREF function return when used with a FILENAME-assigned fileref?',
    options: [
      'The physical path associated with the fileref',
      'The number of observations in a dataset',
      'A libref name for a SAS library',
      'Always a missing value',
    ],
    correctIndex: 0,
    explanation:
      'FILEREF(fileref) returns the external file path. LIBNAME/libref is the parallel concept for libraries.',
    coachingTip: 'FILENAME + FILEREF = files. LIBNAME + PATH/physical path functions = libraries.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ds-03': {
    title: 'MERGE row count trap',
    question:
      'Dataset A has 5 observations (ids 1–5). Dataset B has 3 observations (ids 1–3 only). Both are sorted by id with unique BY values.\n\nHow many observations result from `merge a b; by id;`?',
    options: ['3', '5', '8', '15'],
    correctIndex: 1,
    explanation:
      'MERGE outputs all BY groups from either input — 5 rows from A. Ids 4–5 have missing B-side values. Matching-only count (3) is a common trap.',
    coachingTip: 'MERGE count = all unique BY values from both tables, not just matches.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
  },
  'ex-ds-04': {
    title: 'SAS date epoch zero',
    question:
      'A mainframe extract documents date values as integers. The spec says day 0 is the SAS epoch.\n\nThe SAS date value 0 represents which calendar date?',
    options: ['01JAN1960', '01JAN1900', '31DEC1959', '01JAN1970'],
    correctIndex: 0,
    explanation:
      'SAS date values count days from 01JAN1960. MDY(1,1,1960) returns 0.',
    coachingTip: 'Memorize epoch 01JAN1960 = 0. Excel epochs differ — do not mix systems.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-ds-05': {
    title: 'Default numeric length',
    question:
      'You create a numeric variable with no LENGTH statement in a new dataset.\n\nWhat is the default storage length of a numeric variable in SAS?',
    options: ['8 bytes', '4 bytes', '32 bytes', '$8 characters'],
    correctIndex: 0,
    explanation:
      'Numeric variables default to 8-byte floating point. Character variables default to length 8 unless specified.',
    coachingTip: 'Numeric default 8 bytes. Character default $8 — use LENGTH for longer text fields.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-md-01': {
    title: 'TRIM trailing blanks',
    question:
      'After PROC IMPORT, a character ID field shows trailing spaces in the log viewer. You only want trailing blanks removed (not leading).\n\nWhich function removes trailing blanks only?',
    options: ['TRIM', 'UPCASE only', 'SUBSTR only', 'MISSING function'],
    correctIndex: 0,
    explanation:
      'TRIM removes trailing blanks. STRIP removes both leading and trailing; LEFT left-aligns after trim.',
    coachingTip: 'Trailing only → TRIM. Both ends → STRIP. Compare safely with STRIP on both sides.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-md-02': {
    title: 'SUM without explicit RETAIN',
    question:
      'A colleague writes `total + amount;` without a RETAIN statement and expects accumulation across rows.\n\nWhat is the effect of that statement?',
    options: [
      'Implicit RETAIN — total accumulates across observations',
      'total resets to 0 on every row',
      'Syntax error — RETAIN is mandatory',
      'total becomes missing on row 2',
    ],
    correctIndex: 0,
    explanation:
      'The SUM statement implies RETAIN and initializes the accumulator to 0.',
    coachingTip: 'See `var + expr;` → SUM statement → automatic RETAIN. See `var = var + expr;` → needs RETAIN.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-md-03': {
    title: 'FINDC with modifiers',
    question:
      'You search "SAS Base" for any vowel, ignoring case, using FINDC with modifier "i".\n\nWhat does FINDC("SAS Base", "aeiou", "i") search for?',
    options: [
      'Any vowel character in the string, case-insensitive',
      'The exact substring "aeiou" only',
      'The character position where "Base" starts',
      'The count of consonants in the string',
    ],
    correctIndex: 0,
    explanation:
      'FINDC locates any character from the second argument in the first string. Modifier "i" ignores case.',
    coachingTip: 'FINDC = any-of list. INDEX/FIND = whole substring. Modifiers go in the third argument.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-md-04': {
    title: 'TODAY function',
    question:
      'A daily batch job must stamp records with the current calendar date as a SAS date value.\n\nWhich function returns the current date as a SAS date value?',
    options: ['TODAY()', 'DATE()', 'SYSDATE (without macro &)', 'TIME()'],
    correctIndex: 0,
    explanation:
      'TODAY() returns the current SAS date number. &SYSDATE is a macro variable (character), not a DATA step function.',
    coachingTip: 'DATA step current date → TODAY(). Macro text date → &SYSDATE.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-md-05': {
    title: 'DROP index variable',
    question:
      'Your DO loop uses index variable I. You add `drop i;` at the end of the DATA step.\n\nWhat does `drop i;` accomplish?',
    options: [
      'Excludes variable I from the output dataset',
      'Deletes all observations from the output',
      'Stops the DATA step immediately',
      'Drops only the first observation',
    ],
    correctIndex: 0,
    explanation:
      'DROP as a statement or dataset option removes variables from output. I remains usable earlier in the step.',
    coachingTip: 'DROP removes from output, not from PDV during the step. Common for loop indexes.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-md-06': {
    title: 'LAG previous value',
    question:
      'You compare each row\'s revenue to the prior row without sorting into a new dataset.\n\nWhat does the LAG function return?',
    options: [
      'The previous observation\'s value for the argument',
      'The last observation in the entire dataset',
      'The current log line number',
      'A sort order integer',
    ],
    correctIndex: 0,
    explanation:
      'LAG(x) returns x from the prior observation. First row returns missing. BY-group reset requires explicit logic.',
    coachingTip: 'LAG = previous row value. For BY-group LAG behavior, combine with FIRST./LAST. logic.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-md-07': {
    title: 'CATX delimiter join',
    question:
      'You build a display label from CITY and STATE with a comma between them, trimming extra spaces.\n\nHow does CATX differ from CAT?',
    options: [
      'CATX inserts a delimiter between trimmed non-missing strings',
      'CATX only works on numeric arguments',
      'CATX sorts arguments alphabetically before joining',
      'There is no difference',
    ],
    correctIndex: 0,
    explanation:
      'CATX(delim, arg1, arg2, …) trims each argument and places the delimiter between non-missing values.',
    coachingTip: 'Need delimiter + trim → CATX. Trim only → CATS. Raw join → CAT.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-eh-01': {
    title: 'WARNING in the log',
    question:
      'Your job finishes but the log shows WARNING messages about length conversion. The manager asks if the step failed.\n\nA WARNING in the SAS log typically means:',
    options: [
      'The step ran but something may need attention',
      'The step failed completely — no output exists',
      'The program compiled but did not execute',
      'The output dataset was automatically deleted',
    ],
    correctIndex: 0,
    explanation:
      'WARNING: execution continued. ERROR: step likely failed. NOTE: informational.',
    coachingTip: 'Severity order: ERROR > WARNING > NOTE. Always read WARNING text — output may be wrong.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-eh-02': {
    title: 'Syntax check without data',
    question:
      'Before production, you want to validate syntax on a program that processes millions of rows.\n\nWhich option helps catch syntax errors without creating data?',
    options: ['OPTIONS OBS=0;', 'OPTIONS NODATE;', 'PROC DELETE data=work._all_;', 'RUN CANCEL;'],
    correctIndex: 0,
    explanation:
      'OBS=0 processes zero observations while compiling steps — ideal for syntax checking large jobs.',
    coachingTip: 'OPTIONS OBS=0; at top → compile check. Remove or reset before real run.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-eh-03': {
    title: '_ERROR_ flag meaning',
    question:
      'While reading a messy CSV, some rows fail numeric conversion. You inspect the automatic error flag.\n\nWhat does _ERROR_=1 indicate in a DATA step?',
    options: [
      'An error condition occurred for the current observation',
      'The entire program must stop immediately',
      'The SAS log buffer is full',
      'A libref was not assigned',
    ],
    correctIndex: 0,
    explanation:
      '_ERROR_=1 marks data-related problems on the current row (invalid input, conversion issues). The step may continue.',
    coachingTip: '_ERROR_=1 per row ≠ program halt. Use IF _ERROR_ for row-level handling.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-rp-01': {
    title: 'PROC MEANS with CLASS',
    question:
      'Analytics needs mean and sum of SALES by REGION in one report table.\n\nPROC MEANS with CLASS and VAR statements produces:',
    options: [
      'Summary statistics grouped by CLASS variables',
      'Frequency tables only — no means',
      'A sorted copy of the raw input',
      'A regulatory define.xml document',
    ],
    correctIndex: 0,
    explanation:
      'CLASS defines grouping columns; VAR lists analysis variables. Output is combined summary tables.',
    coachingTip: 'CLASS + VAR in MEANS → grouped stats. TABLES in FREQ → counts and percents.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-rp-02': {
    title: 'ODS PDF destination',
    question:
      'Regulatory wants a print-ready PDF packet from your SAS procedures.\n\nWhich ODS statement sends output to a PDF file?',
    options: [
      'ODS PDF FILE="report.pdf";',
      'ODS LISTING PDF;',
      'PROC PDF data=work.results;',
      'FILE PDF "report.pdf";',
    ],
    correctIndex: 0,
    explanation:
      'ODS PDF FILE= opens a PDF destination. Close with ODS PDF CLOSE; when done.',
    coachingTip: 'PDF = ODS PDF FILE=. HTML = ODS HTML FILE=. Always CLOSE the destination.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-rp-03': {
    title: 'SQL WHERE before GROUP BY',
    question:
      'You filter individual transactions before aggregating sales by STORE in PROC SQL.\n\nWhich clause limits rows BEFORE grouping?',
    options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
    correctIndex: 0,
    explanation:
      'WHERE filters source rows before GROUP BY. HAVING filters groups after aggregation.',
    coachingTip: 'Pre-aggregate row filter → WHERE. Post-aggregate group filter → HAVING.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-rp-04': {
    title: 'NODUPREC exact duplicates',
    question:
      'You need to remove rows that are identical on every column after sorting.\n\nPROC SORT with NODUPREC removes:',
    options: [
      'Observations where ALL variables are identical',
      'Duplicates based on BY variables only',
      'All rows with any missing value',
      'Variables that share the same name',
    ],
    correctIndex: 0,
    explanation:
      'NODUPREC compares all variables on the row. NODUPKEY compares only BY variables.',
    coachingTip: 'Exact duplicate rows → NODUPREC. Duplicate keys → NODUPKEY with BY statement.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'ex-rp-05': {
    title: 'PROC SGPLOT bar chart',
    question:
      'You need a vertical bar chart of mean revenue by region using modern Base graphics (no legacy SAS/GRAPH).\n\nWhich procedure creates a vertical bar chart?',
    options: ['PROC SGPLOT with VBAR', 'PROC PRINT', 'PROC CONTENTS', 'PROC COMPARE'],
    correctIndex: 0,
    explanation:
      'PROC SGPLOT supports VBAR, HBAR, SERIES, SCATTER, and other ODS Graphics plots.',
    coachingTip: 'Base exam charts → PROC SGPLOT. Listing rows → PROC PRINT.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },

  // ===== TRICKY BASE (trap-b-*) — keep trap:true =====
  'trap-b-01': {
    question:
      'You merge customer demographics (LEFT, 4 rows, ids 1–4) with loyalty points (RIGHT, 2 rows, ids 1–2). Both datasets are sorted by id with unique BY values.\n\nHow many observations are in the output of `merge left right; by id;`?',
    coachingTip: 'MERGE keeps all BY groups from either side — count LEFT rows when RIGHT is smaller.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-02': {
    question:
      'A quiz dataset has SCORE values 85, 90, and missing (.). You subset with `if score > 80;` in a DATA step.\n\nHow many observations pass the filter?',
    coachingTip: 'Missing never satisfies numeric comparisons — only 85 and 90 pass.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-03': {
    question:
      'REGION is stored as $5 with value "US" (padded). Your code tests `if region = "US";` without TRIM.\n\nWhat is true about this comparison?',
    coachingTip: 'SAS pads shorter values with blanks — "US" in $5 equals literal "US".',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-04': {
    question:
      'You read three rows and need AMOUNT to accumulate into TOTAL across observations in one DATA step.\n\nWhich statement produces a true running total?',
    coachingTip: 'Only the SUM statement (`total + amount;`) accumulates without explicit RETAIN.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-05': {
    question:
      'Your DATA step reads a 5 GB SAS dataset and subsets to active customers only.\n\nWhen subsetting a large SAS dataset in a DATA step, which approach is generally more efficient?',
    coachingTip: 'WHERE on SET filters earlier; IF filters after the row enters the PDV.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-06': {
    question:
      'You must produce only matched rows when merging tables A and B on ID (inner join semantics).\n\nWhich approach correctly keeps only matching observations?',
    coachingTip: 'IN= flags + `if ina and inb` = inner join. WHERE on both ids does not work post-merge.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-07': {
    question:
      'After PROC SORT with BY customer_id, you need one row per customer_id, keeping the first occurrence.\n\nPROC SORT with NODUPKEY removes:',
    coachingTip: 'NODUPKEY = dedup on BY vars. NODUPREC = exact duplicate rows on all columns.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-08': {
    question:
      'During a DATA step load, some character-to-numeric conversions fail on specific rows.\n\nWhen does the automatic variable _ERROR_ equal 1?',
    coachingTip: '_ERROR_=1 flags data errors on the current row — not every WARNING or missing value.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-09': {
    title: 'PUT missing date display',
    question:
      'A report formats a date variable that is missing for some subjects.\n\nWhat does `put(., date9.)` produce?',
    coachingTip: 'Formatting missing numeric values displays "." — not a default epoch date.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-10': {
    question:
      'Dataset A has 3 observations; dataset B has 3 observations. You stack them for a combined analysis file.\n\n`data both; set a b; run;` creates how many observations?',
    coachingTip: 'SET stacks vertically: 3 + 3 = 6. MERGE would match horizontally on BY.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-11': {
    question:
      'You DROP a helper variable at the end of a DATA step but use it earlier for calculations.\n\nA DROP statement in a DATA step affects variables:',
    coachingTip: 'DROP hides from output — variables remain usable earlier in the same step.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-12': {
    question:
      'You want to verify that a DATA step compiles against SASHELP.CLASS without writing rows.\n\nWhat does `data test(obs=0); set sashelp.class; run;` accomplish?',
    coachingTip: 'OBS=0 on the DATA statement = zero rows processed, structure validated.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-13': {
    title: 'PROC FREQ default output',
    question:
      'You run PROC FREQ on GENDER with no extra options for a quick distribution check.\n\nA one-way TABLES request without BY or WEIGHT produces:',
    coachingTip: 'Default FREQ output = frequency, percent, cumulative frequency and percent.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    trap: true,
  },
  'trap-b-14': {
    question:
      'You use LAG(REVENUE) to compare each store\'s revenue to the prior row in processing order.\n\nLAG(x) returns missing for:',
    coachingTip: 'First row has no predecessor → LAG returns missing. BY reset is not automatic.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality', 'exam-traps'],
    trap: true,
  },
  'trap-b-15': {
    title: 'RENAME in DATA step',
    question:
      'The warehouse schema expects NEWVAR but your program still references OLDVAR internally until output.\n\nWhich statement renames OLDVAR to NEWVAR in the output dataset?',
    coachingTip: 'RENAME statement or rename= dataset option. CHANGE is not valid SAS syntax.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
    trap: true,
  },

  // ===== PREMIUM BASE (prem-b-*) =====
  'prem-b-01': {
    coachingTip: 'Pipeline filters: apply step 1, count rows, then apply step 2 — do not merge IFs mentally.',
    collections: ['exam-quality', 'exam-traps', 'hard-picks'],
  },
  'prem-b-02': {
    coachingTip: 'MERGE first and count all rows, then apply FIRST. — order of operations matters.',
    collections: ['exam-quality', 'merge-by', 'hard-picks'],
  },
  'prem-b-03': {
    coachingTip: 'Exam favorite: WHERE on SET = earlier filter; IF = after read into PDV.',
    collections: ['exam-quality'],
  },
  'prem-b-04': {
    coachingTip: 'FORMAT is display-only — stored numeric value never changes.',
    collections: ['exam-quality'],
  },
  'prem-b-05': {
    title: '_N_ observation counter',
    question:
      'You debug a DATA step by printing the automatic variable that shows which input row is currently being processed.\n\nWhat does the automatic variable _N_ represent?',
    options: [
      'The number of variables currently in the PDV',
      'The observation number being processed in the DATA step',
      'The cumulative error count in the log',
      'The index of the current BY group',
    ],
    correctIndex: 1,
    explanation:
      '_N_ increments with each iteration of the DATA step loop — the current observation number being processed.',
    coachingTip: '_N_ = row iteration counter. _ERROR_ = data error flag on current row.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'prem-b-06': {
    coachingTip: 'All columns identical → NODUPREC. Key columns only → NODUPKEY with BY.',
    collections: ['exam-quality'],
  },
  'prem-b-07': {
    title: 'Permanent dataset reference',
    question:
      'Library MYLIB points to D:\\projects\\analytics. You need SURVEY results to persist after you log off.\n\nWhich statement creates a permanent SAS dataset MYDATA in library MYLIB?',
    options: [
      'data mydata; set raw.responses; run;',
      'data mylib.mydata; set raw.responses; run;',
      'set mylib.mydata; run;',
      'libname mydata mylib; run;',
    ],
    correctIndex: 1,
    explanation:
      'Two-level name mylib.mydata writes to the permanent library. One-level mydata defaults to WORK (temporary).',
    coachingTip: 'Permanent = libref.dataset on the DATA statement. LIBNAME assigns the folder, not the dataset.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'prem-b-08': {
    coachingTip: 'Assignment (=) resets each row. SUM statement (+) accumulates across rows.',
    collections: ['exam-quality', 'exam-traps'],
  },
  'prem-b-09': {
    title: 'INFILE locates raw file',
    question:
      'You receive a fixed-width text extract from a vendor and must point your DATA step at the file on disk before reading columns.\n\nWhich statement identifies an external raw data file to be read?',
    options: [
      'INFILE names the external file (or fileref) to read',
      'INPUT names the file path on disk',
      'SET reads an external raw text file by path',
      'FILENAME alone reads data without INFILE or INPUT',
    ],
    correctIndex: 0,
    explanation:
      'INFILE declares the raw file source. INPUT defines how to read variables from that file.',
    coachingTip: 'INFILE = file location. INPUT = column layout. SET = existing SAS datasets only.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'prem-b-10': {
    title: 'PROC FREQ one-way table',
    question:
      'Marketing needs counts and percentages for each PRODUCT_CATEGORY level before building charts.\n\nPROC FREQ on a single categorical variable produces:',
    options: [
      'Means, standard deviations, and medians',
      'Frequency counts and percentages for each category',
      'A sorted copy of every input row',
      'Regression coefficients and R-squared',
    ],
    correctIndex: 1,
    explanation:
      'PROC FREQ default one-way output includes frequency, percent, cumulative frequency, and cumulative percent.',
    coachingTip: 'Distribution of categories → PROC FREQ. Numeric summaries → PROC MEANS.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
  'prem-b-11': {
    coachingTip: 'SET A A lists the same dataset twice — vertical concat doubles the row count.',
    collections: ['exam-quality'],
  },
  'prem-b-12': {
    title: 'A00-231 exam pacing',
    question:
      'You sit for the SAS Base exam (A00-231): about 40 performance tasks in 135 minutes with no partial credit on multi-select items.\n\nWhat pacing strategy maximizes your score?',
    options: [
      'Spend a fixed 10 minutes on every question before moving on',
      'Aim for ~3 minutes per task; flag difficult items and return later',
      'Solve the hardest code-tracing items first while fresh',
      'Skip every question that shows program code',
    ],
    correctIndex: 1,
    explanation:
      '~3 minutes per task leaves review time. Bank confident points first, flag uncertain items, return at the end.',
    coachingTip: 'Easy points first, flag and revisit — never burn 15 minutes on one trap question early.',
    examStyle: true,
    qualityTier: 'exam',
    collections: ['exam-quality'],
  },
}
