import type { Question } from '../types'

/**
 * Expansion pack — original scenario MCQs emphasizing error-handling and reports.
 * Not copied from official SAS exams.
 */
export const EXPANSION_BASE: Question[] = [
  // ===== ERROR HANDLING (6) =====
  {
    id: 'exp-b-01',
    title: 'OBS=0 before production run',
    topic: 'error-handling',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'A 2-hour ETL job reads 12 million rows. Before the weekend cutover, the lead wants to confirm the revised program compiles and all LIBNAME paths resolve — without touching data.\n\nWhat is the standard approach?',
    options: [
      'Submit with OPTIONS OBS=0 before the DATA and PROC steps',
      'Comment out every SET and MERGE statement',
      'Replace INPUT with INFORMAT in every step',
      'Run PROC DELETE on the source library first',
    ],
    correctIndex: 0,
    explanation:
      'OPTIONS OBS=0 stops observation processing after compilation. Steps still parse and log syntax or metadata errors, but no rows are read or written. This is the usual syntax-check pattern for large jobs.',
    explanationKo:
      'OPTIONS OBS=0은 컴파일 후 observation 처리를 중단합니다. step은 파싱되고 syntax/metadata 오류가 로그에 남지만 행은 읽거나 쓰지 않습니다. 대용량 job의 syntax check에 쓰는 표준 방법입니다.',
    tags: ['OBS=0', 'OPTIONS', 'syntax check'],
  },
  {
    id: 'exp-b-02',
    title: 'WARNING vs ERROR in log review',
    topic: 'error-handling',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Overnight log excerpt:\n\nWARNING: Length of character variable SKU has already been set.\nUse the LENGTH statement as the very first statement in the DATA step.\n\nNOTE: The data set WORK.ITEMS has 45,000 observations and 6 variables.\n\nWhat is the most accurate conclusion?',
    options: [
      'The step completed; SKU kept its prior length — review whether truncation occurred',
      'The step failed with 0 observations because WARNING stops execution',
      'SAS automatically shortened SKU to match the new LENGTH',
      'The ERROR counter increments and downstream steps are blocked',
    ],
    correctIndex: 0,
    explanation:
      'WARNING messages alert you to questionable conditions but allow the step to finish. Here the NOTE confirms 45,000 rows were written. LENGTH cannot shorten an existing variable — the original length is retained.',
    explanationKo:
      'WARNING은 문제 가능성을 알리지만 step 실행은 계속됩니다. NOTE가 45,000행 출력을 확인합니다. LENGTH는 이미 존재하는 변수 길이를 줄일 수 없어 기존 길이가 유지됩니다.',
    coachingTip: 'WARNING = finished with caution. ERROR = step failed or dataset invalid.',
    tags: ['log', 'WARNING', 'LENGTH'],
  },
  {
    id: 'exp-b-03',
    title: '_ERROR_ after bad numeric read',
    topic: 'error-handling',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    trap: true,
    question:
      'How many observations are written to WORK.OUT, and what is _ERROR_ on the row with id=2?',
    code: `data raw;
  infile datalines;
  input id amount;
  datalines;
1 100
2 abc
3 300
;
run;

data out;
  set raw;
run;`,
    options: [
      '3 observations; _ERROR_=1 on id=2',
      '2 observations; id=2 is dropped',
      '3 observations; _ERROR_=0 on all rows',
      '0 observations; the step stops at invalid data',
    ],
    correctIndex: 0,
    explanation:
      'Invalid numeric input sets the variable to missing and _ERROR_=1 for that iteration, but the DATA step continues by default. All three rows are output unless you add logic to delete when _ERROR_=1.',
    explanationKo:
      '잘못된 숫자 입력은 해당 변수를 결측으로 만들고 그 iteration에서 _ERROR_=1을 설정하지만, 기본적으로 DATA step은 계속됩니다. _ERROR_=1일 때 삭제하는 로직이 없으면 세 행 모두 출력됩니다.',
    coachingTip: 'Invalid data → missing + _ERROR_=1, not automatic row drop.',
    tags: ['_ERROR_', 'invalid data', 'INPUT'],
  },
  {
    id: 'exp-b-04',
    title: 'INVALID= option on INFILE',
    topic: 'error-handling',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'A flat file occasionally has non-numeric values in the QTY column. You want invalid rows sent to a separate audit file instead of mixing with clean data.\n\nWhich INFILE/INPUT pattern supports this?',
    options: [
      'infile clean; input id qty; infile bad invalid=badflag; ...',
      'infile clean missover; input id qty @;',
      'infile clean truncover; input id qty;',
      'infile clean dsd; input id qty; where qty > 0;',
    ],
    correctIndex: 0,
    explanation:
      'The INVALID= option on INFILE names a variable that is set when INPUT encounters invalid data. You can branch with IF badflag then OUTPUT to an audit dataset. TRUNCOVER and MISSOVER handle length/missing, not type errors.',
    explanationKo:
      'INFILE의 INVALID= 옵션은 INPUT이 invalid data를 만났을 때 설정되는 변수를 지정합니다. IF badflag로 분기해 audit dataset에 OUTPUT할 수 있습니다. TRUNCOVER/MISSOVER는 길이/결측 처리용입니다.',
    coachingTip: 'Type conversion failures → INVALID=, not TRUNCOVER.',
    tags: ['invalid data', 'INFILE', 'INVALID='],
  },
  {
    id: 'exp-b-05',
    title: 'OPTIONS ERRORS= behavior',
    topic: 'error-handling',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'A batch job sets OPTIONS ERRORS=1 before several DATA steps. One step later logs multiple ERROR messages for bad LIBNAME references.\n\nWhat does ERRORS=1 typically control?',
    options: [
      'Stop processing after the first ERROR message in the session',
      'Suppress all WARNING messages from the log',
      'Convert NOTE messages to ERROR level',
      'Limit PROC output to one page',
    ],
    correctIndex: 0,
    explanation:
      'OPTIONS ERRORS=n sets how many error messages SAS tolerates before stopping. ERRORS=1 halts on the first ERROR. This differs from OBS=0 (no data processing) and from WARNING handling.',
    explanationKo:
      'OPTIONS ERRORS=n은 SAS가 몇 개의 ERROR까지 허용할지 설정합니다. ERRORS=1이면 첫 ERROR에서 중단합니다. OBS=0(데이터 미처리)이나 WARNING 처리와는 다릅니다.',
    tags: ['OPTIONS', 'ERRORS=', 'log'],
  },
  {
    id: 'exp-b-06',
    title: 'NOTE after failed MERGE',
    topic: 'error-handling',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    trap: true,
    question:
      'Log after a MERGE step:\n\nERROR: BY variables are not properly sorted on dataset BONUS.\nNOTE: The data set WORK.COMBINED has 0 observations and 5 variables.\n\nWhat should the developer do first?',
    options: [
      'Sort BONUS (and verify EMPLOYEES) on the BY variables, then rerun',
      'Add NODUPKEY to the MERGE statement',
      'Set OPTIONS OBS=0 and ignore the empty dataset',
      'Replace MERGE with SET because ERROR means match failure',
    ],
    correctIndex: 0,
    explanation:
      'MERGE requires all inputs sorted by the BY variables. An unsorted input triggers ERROR and typically produces 0 observations. Fix the sort order before interpreting row counts or adding IN= filters.',
    explanationKo:
      'MERGE는 모든 입력이 BY 변수로 정렬되어 있어야 합니다. 정렬되지 않은 입력은 ERROR를 발생시키고 보통 0 observation이 됩니다. IN= 필터 전에 정렬 문제를 먼저 해결해야 합니다.',
    coachingTip: 'MERGE ERROR + 0 obs → check BY sort on every input.',
    tags: ['MERGE', 'ERROR', 'PROC SORT'],
  },

  // ===== REPORTS (6) =====
  {
    id: 'exp-b-07',
    title: 'PROC FREQ two-way table',
    topic: 'reports',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Analysts need counts and row percentages of STATUS within each REGION from ORDERS (not one row per order in the table).\n\nWhich TABLES statement is appropriate?',
    options: [
      'tables region*status / nopercent norow;',
      'tables region*status / nocol;',
      'tables region status / list;',
      'tables region*status / out=orders;',
    ],
    correctIndex: 1,
    explanation:
      'The asterisk builds a two-way table. NOCOL suppresses column percentages while keeping row and cell percentages — useful for within-REGION STATUS breakdowns. NOCOL does not remove row percentages.',
    explanationKo:
      'asterisk(*)는 two-way table을 만듭니다. NOCOL은 열(column) 백분율을 제거하고 행/셀 백분율은 유지합니다 — REGION 내 STATUS 분포에 적합합니다.',
    tags: ['PROC FREQ', 'TABLES', 'two-way'],
  },
  {
    id: 'exp-b-08',
    title: 'PROC MEANS CLASS output shape',
    topic: 'reports',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'You run PROC MEANS with CLASS REGION; VAR REVENUE; on SALES with 4 regions and 20,000 rows.\n\nWhat best describes the default printed report?',
    options: [
      'One combined table: statistics for REVENUE within each REGION level',
      '20,000 detail rows identical to the input dataset',
      'A single overall mean with no REGION breakdown',
      'Only frequencies — MEANS cannot combine CLASS and VAR',
    ],
    correctIndex: 0,
    explanation:
      'CLASS creates grouping levels in one output table. VAR lists analysis variables. Default statistics include N, MEAN, STD, MIN, MAX unless restricted with the STATISTICS option.',
    explanationKo:
      'CLASS는 그룹 수준을 하나의 출력 테이블에 만듭니다. VAR는 분석 변수를 지정합니다. 기본 통계량은 N, MEAN, STD, MIN, MAX 등입니다.',
    tags: ['PROC MEANS', 'CLASS', 'VAR'],
  },
  {
    id: 'exp-b-09',
    title: 'PROC SORT OUT= preserves source',
    topic: 'reports',
    difficulty: 'easy',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'CUSTOMERS must stay in original order for audit, but REPORTING needs a copy sorted by STATE then CITY.\n\nWhich PROC SORT achieves this?',
    options: [
      'proc sort data=customers out=reporting; by state city; run;',
      'proc sort data=customers; by state city; run;',
      'proc sort data=customers nodupkey; by state; run;',
      'proc sort data=reporting; set customers; by state city; run;',
    ],
    correctIndex: 0,
    explanation:
      'Without OUT=, PROC SORT replaces the input dataset. OUT= writes the sorted result to a new dataset while leaving the original unchanged — the usual pattern when preserving a source file.',
    explanationKo:
      'OUT= 없이 PROC SORT하면 입력 dataset이 정렬된 결과로 대체됩니다. OUT=는 원본은 유지하고 정렬본을 새 dataset에 씁니다.',
    tags: ['PROC SORT', 'OUT='],
  },
  {
    id: 'exp-b-10',
    title: 'ODS PDF destination',
    topic: 'reports',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'You must capture PROC FREQ and PROC MEANS output in a single PDF for stakeholders, then return to the default destination.\n\nWhich sequence is correct?',
    options: [
      'ods pdf file="summary.pdf"; ... procs ...; ods pdf close;',
      'ods html file="summary.pdf"; ... procs ...; ods html close;',
      'filename pdf "summary.pdf"; proc printto print=pdf; run;',
      'ods listing pdf="summary.pdf"; ... procs ...; ods listing close;',
    ],
    correctIndex: 0,
    explanation:
      'ODS PDF FILE= opens the PDF destination; ODS PDF CLOSE returns to prior destinations. ODS HTML writes HTML, not PDF. PROC PRINTTO redirects listing output, not ODS-managed procedure output.',
    explanationKo:
      'ODS PDF FILE=로 PDF destination을 열고 ODS PDF CLOSE로 닫습니다. ODS HTML은 HTML입니다. PROC PRINTTO는 listing 출력 리다이렉트용이며 ODS procedure 출력과 다릅니다.',
    tags: ['ODS', 'PDF'],
  },
  {
    id: 'exp-b-11',
    title: 'User format in PROC PRINT',
    topic: 'reports',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'PROC FORMAT created $GRADEFMT for letter grades. In a DATA step you assign format grade $gradefmt.; then run PROC PRINT.\n\nWhich is true in the printed report?',
    options: [
      'GRADE displays formatted values; underlying stored values are unchanged',
      'GRADE is permanently converted to character in the dataset',
      'PROC PRINT ignores formats defined in the DATA step',
      'You must use INFORMAT instead of FORMAT for display',
    ],
    correctIndex: 0,
    explanation:
      'FORMAT attaches a display template. Storage remains the coded value; reports and PUT show the formatted label. Changing storage type requires assignment functions like PUT, not FORMAT alone.',
    explanationKo:
      'FORMAT은 표시 템플릿을 연결합니다. 저장값은 코드값 그대로이고 리포트/PUT에서 포맷된 라벨이 보입니다. 저장 타입 변경은 PUT 등 할당이 필요합니다.',
    coachingTip: 'FORMAT = display mask, not data conversion.',
    tags: ['PROC FORMAT', 'FORMAT', 'PROC PRINT'],
  },
  {
    id: 'exp-b-12',
    title: 'Clear TITLE before shared run',
    topic: 'reports',
    difficulty: 'easy',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Program A sets TITLE1 "Quarterly Revenue". Later in the same session, Program B must run without showing Program A\'s title.\n\nWhat clears titles?',
    options: [
      'title;',
      'footnote;',
      'ods _all_ close;',
      'proc datasets lib=work kill; run;',
    ],
    correctIndex: 0,
    explanation:
      'A null TITLE statement (title;) clears all title lines. FOOTNOTE; clears footnotes only. ODS CLOSE ends destinations but does not reset titles. PROC DATASETS KILL removes datasets, not titles.',
    explanationKo:
      '빈 TITLE 문(title;)은 모든 title 줄을 지웁니다. FOOTNOTE;는 각주만 지웁니다. ODS CLOSE는 destination만 닫고 title은 유지됩니다.',
    tags: ['TITLE', 'FOOTNOTE'],
  },

  // ===== MANAGE DATA (4) =====
  {
    id: 'exp-b-13',
    title: 'ARRAY to flag months',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Variables JAN through DEC hold monthly sales. You need HIGH_SEASON=1 if any month exceeds 100000.\n\nWhich approach is correct?',
    code: `/* sales data has jan dec numeric variables */`,
    options: [
      'array m jan--dec; high_season = (max(of m[*]) > 100000);',
      'array m{12}; high_season = m[13] > 100000;',
      'do i = jan to dec; if i > 100000 then high_season=1; end;',
      'high_season = sum(jan, dec) > 100000;',
    ],
    correctIndex: 0,
    explanation:
      'The double-dash list (jan--dec) builds an array across contiguously named variables. MAX(OF m[*]) scans all elements. SUM(jan, dec) adds only two months, not all twelve.',
    explanationKo:
      'jan--dec는 연속 변수명으로 array를 만듭니다. MAX(OF m[*])는 모든 원소를 검사합니다. SUM(jan, dec)는 두 달만 더합니다.',
    coachingTip: 'Variable lists with -- need contiguous names in the PDV.',
    tags: ['ARRAY', 'OF', 'MAX'],
  },
  {
    id: 'exp-b-14',
    title: 'DO WHILE read guard',
    topic: 'manage-data',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'How many observations does WORK.OUT contain?',
    code: `data out;
  x = 1;
  do while (x <= 3);
    y = x * 5;
    output;
    x + 1;
  end;
run;`,
    options: ['0', '3', '4', 'Infinite loop until error'],
    correctIndex: 1,
    explanation:
      'DO WHILE evaluates the condition at the top. x starts at 1; each iteration outputs and increments x via the SUM statement. When x becomes 4, the condition fails after three outputs.',
    explanationKo:
      'DO WHILE는 조건을 루프 시작 시 검사합니다. x는 1에서 시작하고 매 iteration마다 output 후 SUM statement로 증가합니다. x가 4가 되면 조건 실패 — 3행 출력.',
    tags: ['DO WHILE', 'SUM statement'],
  },
  {
    id: 'exp-b-15',
    title: 'SCAN extracts email domain',
    topic: 'manage-data',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Variable EMAIL holds "ana.reyes@finance.corp". You need the domain portion after "@" without knowing delimiter count in the local part.\n\nWhich expression returns FINANCE.CORP?',
    options: [
      'domain = scan(email, 2, "@");',
      'domain = substr(email, index(email, "@"));',
      'domain = trim(email);',
      'domain = compress(email, "@");',
    ],
    correctIndex: 0,
    explanation:
      'SCAN with delimiter "@" returns the second token — text after the first @. SUBSTR with INDEX alone includes the @ symbol unless you offset. COMPRESS removes characters rather than parsing fields.',
    explanationKo:
      'SCAN(..., 2, "@")는 @ 뒤 두 번째 토큰(도메인)을 반환합니다. SUBSTR+INDEX만 쓰면 @가 포함될 수 있습니다. COMPRESS는 문자 제거 함수입니다.',
    tags: ['SCAN', 'character functions'],
  },
  {
    id: 'exp-b-16',
    title: 'PROC TRANSPOSE wide to long',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'WIDE has columns STORE, Q1, Q2, Q3, Q4. You need LONG with STORE, QUARTER, AMOUNT.\n\nWhich PROC TRANSPOSE setup is appropriate?',
    options: [
      'proc transpose data=wide out=long; by store; var q1-q4; run;',
      'proc transpose data=wide out=long; id store; var q1-q4; run;',
      'proc transpose data=wide out=long; copy store; var quarter; run;',
      'proc sort data=wide; by quarter; run;',
    ],
    correctIndex: 0,
    explanation:
      'BY identifies rows to keep as groups; VAR lists columns to unpivot into rows. TRANSPOSE creates _NAME_ (source column) and COL1 (value) — rename to QUARTER and AMOUNT afterward. ID would spread values across new columns.',
    explanationKo:
      'BY는 유지할 그룹 행, VAR는 행으로 펼칠 열입니다. TRANSPOSE는 _NAME_, COL1을 만듭니다 — QUARTER/AMOUNT로 rename합니다. ID는 값을 새 열로 펼칩니다.',
    coachingTip: 'Long format: BY + VAR on measure columns.',
    tags: ['PROC TRANSPOSE', 'restructure'],
  },

  // ===== DATA STRUCTURES (4) =====
  {
    id: 'exp-b-17',
    title: 'LIBNAME for Excel engine',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Folder D:\\incoming holds monthly XLSX files. You want to reference them with a two-level name without importing each sheet to a permanent SAS dataset first.\n\nWhich approach maps the folder?',
    options: [
      'libname xlsxlib xlsx "D:\\incoming";',
      'libname xlsxlib "D:\\incoming.xlsx";',
      'filename xlsxlib "D:\\incoming"; proc import datafile=xlsxlib; run;',
      'libname xlsxlib excel "D:\\incoming";',
    ],
    correctIndex: 0,
    explanation:
      'The XLSX engine on LIBNAME treats an Excel workbook or folder per engine rules as a library of sheets. A plain LIBNAME without an engine expects SAS datasets. FILENAME alone does not create a libref for two-level names.',
    explanationKo:
      'XLSX engine LIBNAME은 Excel 통합문서/폴더를 sheet library처럼 참조합니다. engine 없는 LIBNAME은 SAS dataset용입니다. FILENAME만으로는 two-level libref가 생기지 않습니다.',
    tags: ['LIBNAME', 'XLSX engine'],
  },
  {
    id: 'exp-b-18',
    title: 'SET with KEEP= dataset option',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'SOURCE has 40 variables. You need WORK.SLIM with only ID, REGION, and REVENUE — no new variables added.\n\nWhich DATA step is correct?',
    options: [
      'data slim; set source (keep=id region revenue); run;',
      'data slim; keep=id region revenue; set source; run;',
      'data slim; set source; drop=_all_; keep=id region revenue; run;',
      'proc contents data=source; run;',
    ],
    correctIndex: 0,
    explanation:
      'The KEEP= dataset option on SET filters variables as they enter the PDV — efficient and clear. A subsequent KEEP statement also works but the exam-style best practice is often the SET option when subsetting at read time.',
    explanationKo:
      'SET의 KEEP= dataset option은 PDV에 들어올 때 변수를 필터합니다. 이후 KEEP 문도 가능하지만 읽기 시점 필터링에는 SET option이 명확합니다.',
    tags: ['SET', 'KEEP=', 'dataset options'],
  },
  {
    id: 'exp-b-19',
    title: 'Many-to-one MERGE inflation',
    topic: 'data-structures',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    trap: true,
    question:
      'DEPT has one row per DEPT_ID. EMP has multiple employees per DEPT_ID. Both sorted by DEPT_ID.\n\nHow many rows in WORK.EXPANDED after MERGE?',
    code: `/* DEPT: 3 rows (dept_id 10,20,30) */
/* EMP: 8 rows — 3+2+3 employees per dept */`,
    options: [
      '8 — one row per employee with dept attributes repeated',
      '3 — one row per department',
      '11 — sum of input rows',
      '24 — Cartesian product of all rows',
    ],
    correctIndex: 0,
    explanation:
      'When one side has multiple rows for a BY value and the other has one, MERGE combines each employee row with the matching department row — many-to-one expansion. Output row count follows the many side per BY group.',
    explanationKo:
      '한쪽에 BY 값당 여러 행, 다른 쪽에 한 행이면 MERGE는 employee마다 department 속성을 붙여 many-to-one으로 확장합니다. 출력 행 수는 many 쪽 기준입니다.',
    coachingTip: 'Count rows on the side with duplicates per BY key.',
    tags: ['MERGE', 'BY', 'many-to-one'],
  },
  {
    id: 'exp-b-20',
    title: 'Date literal and INTCK',
    topic: 'data-structures',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'HIRE_DATE holds the SAS date value for 15MAR2024. Contract length must be months from HIRE_DATE to 30JUN2024 inclusive of partial months rule: count whole calendar month boundaries.\n\nWhich function call returns that month span?',
    options: [
      'months = intck("month", "15mar2024"d, "30jun2024"d);',
      'months = "30jun2024"d - "15mar2024"d;',
      'months = intnx("month", hire_date, 3);',
      'months = mdy(6, 30, 2024) - hire_date;',
    ],
    correctIndex: 0,
    explanation:
      'INTCK with "month" counts interval boundaries between SAS date literals. Subtraction returns days, not months. INTNX advances a date by intervals — it does not measure distance. MDY minus date also yields days.',
    explanationKo:
      'INTCK("month", ...)는 SAS date literal 사이의 월 경계 개수를 셉니다. 빼기는 일(day) 수입니다. INTNX는 날짜를 이동시키며 거리 측정이 아닙니다.',
    coachingTip: 'Months between dates → INTCK, not subtraction.',
    tags: ['SAS dates', 'INTCK', 'date literal'],
  },
]
