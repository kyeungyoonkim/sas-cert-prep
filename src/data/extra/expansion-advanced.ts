import type { Question } from '../types'

/** Expansion Advanced (A00-232) MCQs — original exam-style content */
export const EXPANSION_ADVANCED: Question[] = [
  {
    id: 'exp-ad-01',
    title: 'Correlated subquery per group',
    topic: 'sql',
    difficulty: 'hard',
    examStyle: true,
    question:
      'SALES has REGION, STORE_ID, and REVENUE. You need stores whose REVENUE exceeds the average REVENUE for their own REGION (not the global average).\n\nWhich pattern is correct?',
    options: [
      'WHERE revenue > (select avg(revenue) from sales s2 where s2.region = sales.region)',
      'WHERE revenue > (select avg(revenue) from sales)',
      'HAVING revenue > avg(revenue) without GROUP BY store_id',
      'WHERE revenue > avg(revenue) in the same SELECT list',
    ],
    correctIndex: 0,
    explanation:
      'A correlated subquery references the outer row (s2.region = sales.region) so the average is computed per region for each store row.',
    explanationKo:
      '상관 서브쿼리는 외부 행을 참조(s2.region = sales.region)하여 지역별 평균을 각 매장 행마다 계산합니다.',
    coachingTip: 'Per-group comparison → correlate the subquery to the outer table alias.',
    tags: ['correlated subquery', 'PROC SQL'],
  },
  {
    id: 'exp-ad-02',
    title: 'HAVING with two aggregates',
    topic: 'sql',
    difficulty: 'hard',
    examStyle: true,
    question:
      'PROC SQL groups ORDERS by CUSTOMER_ID. You need customers with COUNT(*) >= 5 AND SUM(AMOUNT) > 10,000.\n\nWhere do both conditions belong?',
    options: [
      'HAVING count(*) >= 5 and sum(amount) > 10000',
      'WHERE count(*) >= 5 and sum(amount) > 10000',
      'WHERE amount > 10000 only; COUNT in ORDER BY',
      'GROUP BY cannot filter on COUNT or SUM',
    ],
    correctIndex: 0,
    explanation:
      'Aggregate functions are not valid in WHERE. After GROUP BY, filter groups with HAVING using summary expressions.',
    explanationKo:
      '집계 함수는 WHERE에서 사용할 수 없습니다. GROUP BY 이후 HAVING으로 그룹 조건을 필터링합니다.',
    coachingTip: 'Any condition on COUNT/SUM/AVG after grouping → HAVING, never WHERE.',
    tags: ['HAVING', 'GROUP BY'],
  },
  {
    id: 'exp-ad-03',
    title: 'LEFT JOIN unmatched rows',
    topic: 'sql',
    difficulty: 'medium',
    examStyle: true,
    question:
      'EMPLOYEES has 1,200 rows; DEPARTMENTS has 45 rows. Every employee has DEPT_ID, but 3 department IDs exist only in DEPARTMENTS with no employees.\n\nHow many rows does LEFT JOIN (employees left) return?',
    options: ['1,200', '1,203', '45', '1,197'],
    correctIndex: 0,
    explanation:
      'LEFT JOIN keeps every row from the left table. Unmatched departments on the right do not add rows — only employees appear in the result.',
    explanationKo:
      'LEFT JOIN은 왼쪽 테이블의 모든 행을 유지합니다. 오른쪽에만 있는 부서는 행을 추가하지 않습니다.',
    coachingTip: 'LEFT JOIN row count = left table rows (unless one-to-many duplicates expand matches).',
    tags: ['LEFT JOIN', 'JOIN'],
  },
  {
    id: 'exp-ad-04',
    title: 'EXCEPT for row difference',
    topic: 'sql',
    difficulty: 'hard',
    examStyle: true,
    question:
      'ACTIVE_IDS and ARCHIVE_IDS share columns (ID, SOURCE). You need IDs present in ACTIVE_IDS but absent from ARCHIVE_IDS.\n\nWhich PROC SQL set operator applies?',
    options: [
      'select * from active_ids except select * from archive_ids',
      'select * from active_ids union select * from archive_ids',
      'select * from active_ids intersect select * from archive_ids',
      'except all is required whenever duplicates exist',
    ],
    correctIndex: 0,
    explanation:
      'EXCEPT returns rows from the first query not found in the second. Column count and compatible types must match both sides.',
    explanationKo:
      'EXCEPT는 첫 번째 쿼리에만 있는 행을 반환합니다. 양쪽 열 수와 호환 가능한 타입이 일치해야 합니다.',
    coachingTip: 'Set difference A \\ B → EXCEPT. Stack/combine → UNION or UNION ALL.',
    tags: ['EXCEPT', 'set operators'],
  },
  {
    id: 'exp-ad-05',
    title: 'UNION ALL preserves duplicates',
    topic: 'sql',
    difficulty: 'medium',
    examStyle: true,
    question:
      'Q1 returns 500 rows (50 duplicates on key ID). Q2 returns 500 rows (30 duplicates on ID). You need all 1,000 rows including duplicates for a staging table.\n\nWhich operator is appropriate?',
    options: ['UNION ALL', 'UNION', 'INTERSECT', 'EXCEPT'],
    correctIndex: 0,
    explanation:
      'UNION removes duplicate rows across the combined result; UNION ALL concatenates every row from both queries without deduplication.',
    explanationKo:
      'UNION은 결합 결과에서 중복 행을 제거하고, UNION ALL은 중복 제거 없이 모든 행을 연결합니다.',
    coachingTip: 'Need every row stacked → UNION ALL. Need distinct combined set → UNION.',
    tags: ['UNION ALL', 'UNION'],
  },
  {
    id: 'exp-ad-06',
    title: '%NRSTR in macro text',
    topic: 'macro',
    difficulty: 'medium',
    examStyle: true,
    question:
      '%macro notify;\n  %let msg = %nrstr(Final review: 100% done & approved);\n  %put &msg;\n%mend;\n\nWhat does %PUT write?',
    options: [
      'Final review: 100% done & approved',
      'Final review: 100 done (macro resolves &approved)',
      'Syntax error at % in the string',
      'Empty line because &msg is unresolved',
    ],
    correctIndex: 0,
    explanation:
      '%NRSTR masks % and & at macro compile time so the literal text is stored in &msg without macro resolution.',
    explanationKo:
      '%NRSTR는 매크로 컴파일 시 %와 &를 보호하여 &msg에 리터럴 텍스트가 그대로 저장됩니다.',
    coachingTip: 'Literal % or & inside macro-generated text → %NRSTR (or %STR) at definition time.',
    tags: ['%NRSTR', 'macro quoting'],
  },
  {
    id: 'exp-ad-07',
    title: 'SYMPUTX trim and scope',
    topic: 'macro',
    difficulty: 'medium',
    examStyle: true,
    question:
      'A DATA step reads REGION values with trailing blanks. You need a global macro variable &region with trimmed text for later %IF checks.\n\nWhich CALL routine is preferred?',
    options: [
      'call symputx("region", region, "G")',
      'call symput("region ", region)',
      'call execute("%let region=" || region)',
      'call missing(region)',
    ],
    correctIndex: 0,
    explanation:
      'CALL SYMPUTX trims leading/trailing blanks and accepts a symbol-table scope (G=global). SYMPUT does not trim by default.',
    explanationKo:
      'CALL SYMPUTX는 앞뒤 공백을 제거하고 심볼 테이블 범위(G=전역)를 지정할 수 있습니다. SYMPUT은 기본적으로 trim하지 않습니다.',
    coachingTip: 'DATA step → macro variable with clean text → SYMPUTX, not legacy SYMPUT.',
    tags: ['SYMPUTX', 'macro variables'],
  },
  {
    id: 'exp-ad-08',
    title: '%DO %TO generates code',
    topic: 'macro',
    difficulty: 'hard',
    examStyle: true,
    question:
      '%macro tables;\n  %do i = 1 %to 3;\n    proc print data=sales_&i;\n  %end;\n%mend;\n%tables;\n\nHow many PROC PRINT steps are generated?',
    options: ['3', '1', '0 — %DO runs only at DATA step runtime', '6'],
    correctIndex: 0,
    explanation:
      'Macro %DO %TO loops at macro compile time, emitting three PROC PRINT statements for sales_1, sales_2, and sales_3.',
    explanationKo:
      '매크로 %DO %TO는 컴파일 시점에 반복되어 sales_1, sales_2, sales_3에 대한 PROC PRINT 3개를 생성합니다.',
    coachingTip: 'Macro %DO writes code text; DATA step DO executes at runtime — do not confuse them.',
    tags: ['%DO', 'macro loops'],
  },
  {
    id: 'exp-ad-09',
    title: '%IF selects execution path',
    topic: 'macro',
    difficulty: 'hard',
    examStyle: true,
    question:
      '%let env = PROD;\n%macro run;\n  %if &env = PROD %then %do;\n    %include prod_setup.sas;\n  %end;\n  %else %do;\n    %include test_setup.sas;\n  %end;\n%mend;\n\nWhich file is included?',
    options: ['prod_setup.sas', 'test_setup.sas', 'Both files', 'Neither — %IF is invalid in open code'],
    correctIndex: 0,
    explanation:
      'Macro %IF/%THEN/%ELSE evaluates at macro compile time. With env=PROD, only the %THEN branch generates the INCLUDE statement.',
    explanationKo:
      '매크로 %IF/%THEN/%ELSE는 컴파일 시점에 평가됩니다. env=PROD이므로 %THEN 분기의 INCLUDE만 생성됩니다.',
    coachingTip: 'Conditional code generation before run → macro %IF. Row-level logic → DATA step IF.',
    tags: ['%IF', 'macro logic'],
  },
  {
    id: 'exp-ad-10',
    title: '%NRSTR vs nested resolution',
    topic: 'macro',
    difficulty: 'hard',
    examStyle: true,
    trap: true,
    question:
      '%let suffix = _v2;\n%let name = report&suffix;\n%macro title;\n  %put %nrstr(Current dataset: &name);\n%mend;\n%title;\n\nWhat appears in the log?',
    options: [
      'Current dataset: &name',
      'Current dataset: report_v2',
      'Syntax error on &name',
      'Current dataset: report&suffix',
    ],
    correctIndex: 0,
    explanation:
      '%NRSTR inside the macro prevents &name from resolving when the macro compiles, so the literal &name is passed to %PUT.',
    explanationKo:
      '매크로 내부의 %NRSTR는 컴파일 시 &name 해석을 막아 %PUT에 리터럴 &name이 전달됩니다.',
    coachingTip: '%NRSTR timing matters — it freezes macro triggers at the point it is applied.',
    tags: ['%NRSTR', 'macro resolution'],
  },
  {
    id: 'exp-ad-11',
    title: 'Hash find after definekey',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    examStyle: true,
    question:
      'TRANSACTIONS (2M rows) needs LOOKUP.DESC by shared KEY. LOOKUP has 800 rows.\n\nWhich hash sequence enriches each transaction row?',
    options: [
      'declare hash h(dataset:"lookup"); h.definekey("key"); h.definedata("desc"); rc = h.find();',
      'declare hash h(); h.add(); merge without by;',
      'declare hash h(method 8); h.delete();',
      'hash objects require PROC SQL only',
    ],
    correctIndex: 0,
    explanation:
      'Load the small table into a hash object, define the key and data columns, then call find() per row to retrieve matching attributes.',
    explanationKo:
      '작은 테이블을 hash 객체에 로드하고 키·데이터 열을 정의한 뒤, find()로 각 행의 속성을 조회합니다.',
    coachingTip: 'Big fact + small dimension → hash with definekey/definedata/find.',
    tags: ['hash object', 'find'],
  },
  {
    id: 'exp-ad-12',
    title: 'Hash duplicate key handling',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    examStyle: true,
    question:
      'You load a hash from a dataset that accidentally contains duplicate KEY values. add() returns rc=1 on the second duplicate.\n\nWhich declaration allows later keys to overwrite earlier ones?',
    options: [
      'declare hash h(dataset:"lookup", replace:"YES");',
      'declare hash h(multiply:"YES");',
      'declare hash h(ordered:"NO");',
      'Duplicates cannot be handled in hash objects',
    ],
    correctIndex: 0,
    explanation:
      'By default add() rejects duplicate keys (rc≠0). replace="YES" lets a new entry replace an existing key value.',
    explanationKo:
      '기본적으로 add()는 중복 키를 거부합니다(rc≠0). replace="YES"면 새 항목이 기존 키 값을 덮어씁니다.',
    coachingTip: 'rc=1 on hash add() → duplicate key; use replace= or dedupe the source first.',
    tags: ['hash object', 'replace'],
  },
  {
    id: 'exp-ad-13',
    title: 'FCMP function registration',
    topic: 'advanced-techniques',
    difficulty: 'medium',
    examStyle: true,
    question:
      'You define function clamp(val, lo, hi) in PROC FCMP and save it to work.functions.sasfunc.\n\nHow do you call clamp in a DATA step in the same session?',
    options: [
      'options cmplib=(work.functions); then y = clamp(x, 0, 100);',
      'call clamp(x, 0, 100) without options',
      'proc sql; select clamp(x) from t; quit; without cmplib',
      'FCMP functions require SAS/IML only',
    ],
    correctIndex: 0,
    explanation:
      'After PROC FCMP stores functions in a catalog, OPTIONS CMPLIB= points the session to that library so DATA step can call them.',
    explanationKo:
      'PROC FCMP로 함수를 카탈로그에 저장한 뒤 OPTIONS CMPLIB=로 세션에 연결하면 DATA step에서 호출할 수 있습니다.',
    coachingTip: 'Custom FCMP function → save catalog + CMPLIB= before use in DATA/SQL.',
    tags: ['PROC FCMP', 'CMPLIB'],
  },
  {
    id: 'exp-ad-14',
    title: 'Temporary array in DATA step',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    examStyle: true,
    question:
      'You need a 5-element scratch array for intermediate calculations without adding columns to the output dataset.\n\nWhich declaration is correct?',
    options: [
      'array _temporary_ w[5];',
      'array w[5] _temporary_;',
      'array w[5] $ permanent;',
      'temporary arrays require PROC FCMP',
    ],
    correctIndex: 0,
    explanation:
      'The _temporary_ keyword creates an array that does not become a variable in the PDV output — ideal for scratch calculations.',
    explanationKo:
      '_temporary_ 키워드는 PDV 출력에 변수로 남지 않는 배열을 만들어 중간 계산에 적합합니다.',
    coachingTip: 'Scratch math without new columns → array _temporary_ name[n];',
    tags: ['ARRAY', '_temporary_'],
  },
  {
    id: 'exp-ad-15',
    title: '2D array row sum',
    topic: 'advanced-techniques',
    difficulty: 'hard',
    examStyle: true,
    question:
      'Scores for 4 students × 3 tests are in array s[4,3]. You need each student\'s row total in variable total.\n\nWhich loop is correct?',
    options: [
      'do i = 1 to 4; total = 0; do j = 1 to 3; total + s[i,j]; end; output; end;',
      'total + s[4,3]; output;',
      'do j = 1 to 3; total + s[i,j]; end; without initializing total',
      'Multidimensional arrays are not supported in the DATA step',
    ],
    correctIndex: 0,
    explanation:
      'Use nested DO loops: outer index i selects the student row, inner j sums s[i,j]. Reset total before each row sum.',
    explanationKo:
      '중첩 DO 루프를 사용합니다. 외부 i가 학생 행을, 내부 j가 s[i,j]를 합산합니다. 각 행 합 전에 total을 초기화합니다.',
    coachingTip: '2D array row/column sums → nested DO with fixed outer index.',
    tags: ['ARRAY', 'DO loop'],
  },
]
