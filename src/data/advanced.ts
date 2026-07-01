import type { CertData, TopicInfo } from './types'
import { ADVANCED_EXTRA } from './extra/advanced'
import { EXAM_GRADE_ADVANCED } from './extra/exam-grade-advanced'
import { EXPANSION_ADVANCED } from './extra/expansion-advanced'
import { ADVANCED_UPGRADES } from './upgrade/advanced-upgrades'
import { applyMcqUpgrades } from '../lib/mergeUpgrades'
import { applyKoPatches } from '../lib/applyKoPatches'
import { KO_PATCHES_ADVANCED } from './locale/ko-patches-advanced'

export type AdvancedTopic = 'sql' | 'macro' | 'advanced-techniques'

export const TOPICS: Record<AdvancedTopic, TopicInfo> = {
  sql: { label: 'Accessing Data Using SQL', weight: '35%', color: '#3b82f6' },
  macro: { label: 'Macro Processing', weight: '35%', color: '#f59e0b' },
  'advanced-techniques': { label: 'Advanced Techniques', weight: '30%', color: '#8b5cf6' },
}

export const QUESTIONS = [
  {
    id: 'sq-01',
    topic: 'sql',
    difficulty: 'easy' as const,
    question: 'In PROC SQL, what is the result of an inner join between two tables?',
    options: [
      'Only rows that match on both sides',
      'All rows from the left table',
      'All rows from the right table',
      'All rows from both tables (including non-matches)',
    ],
    correctIndex: 0,
    explanation:
      'INNER JOIN returns only rows that satisfy the join condition. LEFT/RIGHT/FULL JOIN also include unmatched rows.',
    explanationKo:
      'INNER JOIN은 join 조건을 만족하는 행만 반환합니다. LEFT/RIGHT/FULL JOIN은 unmatched 행도 포함합니다.',
    tags: ['JOIN', 'PROC SQL'],
  },
  {
    id: 'sq-02',
    topic: 'sql',
    difficulty: 'medium' as const,
    question: 'What is the difference between UNION and OUTER UNION in PROC SQL?',
    options: [
      'UNION removes duplicates; OUTER UNION can combine tables with different column structures',
      'They have the same functionality',
      'UNION is for PROC steps only',
      'OUTER UNION is for JOINs only',
    ],
    correctIndex: 0,
    explanation:
      'UNION combines rows and removes duplicates; UNION ALL keeps duplicates. OUTER UNION can combine tables with different column structures.',
    explanationKo:
      'UNION은 행 결합(중복 제거), UNION ALL은 중복 유지. OUTER UNION은 서로 다른 열 구조의 테이블도 결합합니다.',
    tags: ['set operators', 'UNION'],
  },
  {
    id: 'sq-03',
    topic: 'sql',
    difficulty: 'hard' as const,
    question: 'What is the role of the COALESCE function in the following SQL?',
    code: `proc sql;
  select a.id, coalesce(a.value, b.value, 0) as final
  from a full join b on a.id = b.id;
quit;`,
    options: [
      'Returns the first non-missing value',
      'Calculates the mean',
      'Counts rows',
      'Performs sorting',
    ],
    correctIndex: 0,
    explanation:
      'COALESCE returns the first non-missing value among its arguments. Often used after FULL JOIN to replace missing values.',
    explanationKo:
      'COALESCE는 인자 중 첫 non-missing 값을 반환합니다. FULL JOIN 후 missing을 대체할 때 자주 사용됩니다.',
    tags: ['COALESCE', 'FULL JOIN'],
  },
  {
    id: 'sq-04',
    topic: 'sql',
    difficulty: 'medium' as const,
    question: 'What is the difference between HAVING and WHERE in PROC SQL?',
    options: [
      'WHERE filters rows before grouping; HAVING filters aggregated results after GROUP BY',
      'They are the same',
      'HAVING is for DATA steps',
      'WHERE cannot be used in PROC SQL',
    ],
    correctIndex: 0,
    explanation:
      'WHERE filters observations before grouping; HAVING applies conditions to summary function results.',
    explanationKo:
      'WHERE는 grouping 전 observation 필터, HAVING은 summary function 결과에 조건을 겁니다.',
    tags: ['HAVING', 'WHERE', 'GROUP BY'],
  },
  {
    id: 'sq-05',
    topic: 'sql',
    difficulty: 'medium' as const,
    question: 'What is the relationship between dictionary.tables and sashelp.vtable?',
    options: [
      'Both can query table metadata (dictionary via SQL, vtable as a VIEW)',
      'They are completely different',
      'vtable is for macros only',
      'dictionary is for Excel only',
    ],
    correctIndex: 0,
    explanation:
      'PROC SQL uses dictionary.tables and dictionary.columns to query metadata. sashelp.vtable/vcolumn provide similar information.',
    explanationKo:
      'PROC SQL에서 dictionary.tables, dictionary.columns로 메타데이터를 조회합니다. sashelp.vtable/vcolumn도 유사 정보 제공.',
    tags: ['DICTIONARY', 'metadata'],
  },
  {
    id: 'sq-06',
    topic: 'sql',
    difficulty: 'hard' as const,
    question: 'What is an inline view?',
    options: [
      'A temporary view defined as a subquery in the FROM clause',
      'A macro variable',
      'A permanent library',
      'ODS output',
    ],
    correctIndex: 0,
    explanation:
      'Use a subquery as an inline view with FROM (select ... from ...) as alias. Useful for simplifying complex SQL.',
    explanationKo:
      'FROM (select ... from ...) as alias 형태로 서브쿼리를 inline view로 사용합니다. 복잡한 SQL 단순화에 유용합니다.',
    tags: ['inline view', 'subquery'],
  },
  {
    id: 'sq-07',
    topic: 'sql',
    difficulty: 'medium' as const,
    question: 'What is the purpose of the CALCULATED keyword in PROC SQL?',
    options: [
      'Reference a calculated column from SELECT in WHERE/HAVING within the same query',
      'Macro calculation',
      'Creating hash objects',
      'Defining arrays',
    ],
    correctIndex: 0,
    explanation:
      'CALCULATED colname lets you reference a calculated column defined in SELECT in later clauses.',
    explanationKo:
      'CALCULATED colname으로 SELECT에서 정의한 계산 열을 이후 절에서 참조할 수 있습니다.',
    tags: ['CALCULATED', 'PROC SQL'],
  },
  {
    id: 'sq-08',
    topic: 'sql',
    difficulty: 'easy' as const,
    question: 'What is the result of the EXCEPT set operator?',
    options: [
      'Rows in the first query that are not in the second',
      'Intersection of the two queries',
      'Union of all rows',
      'Inner join of the two tables',
    ],
    correctIndex: 0,
    explanation:
      'EXCEPT is set difference; INTERSECT is set intersection. Set operator distinctions are frequently tested on the exam.',
    explanationKo:
      'EXCEPT는 차집합, INTERSECT는 교집합입니다. 시험에서 set operator 구분이 자주 출제됩니다.',
    tags: ['EXCEPT', 'INTERSECT'],
  },
  {
    id: 'sq-09',
    topic: 'sql',
    difficulty: 'hard' as const,
    question: 'What is the effect of the NOEXEC option in PROC SQL?',
    options: [
      'Checks syntax only without executing',
      'Suppresses result output',
      'Disables macros',
      'Sets obs to 0',
    ],
    correctIndex: 0,
    explanation:
      'NOEXEC checks SQL syntax but does not execute the query. Used for debugging.',
    explanationKo:
      'NOEXEC는 SQL 문법을 검사하지만 쿼리를 실행하지 않습니다. 디버깅에 사용됩니다.',
    tags: ['PROC SQL options', 'NOEXEC'],
  },
  {
    id: 'sq-10',
    topic: 'sql',
    difficulty: 'medium' as const,
    question: 'What is the role of DISTINCT in a PROC SQL SELECT?',
    options: ['Removes duplicate rows', 'Sorts', 'Group totals', 'Performs joins'],
    correctIndex: 0,
    explanation:
      'SELECT DISTINCT returns only unique rows. Unlike GROUP BY, it removes duplicates without aggregate functions.',
    explanationKo:
      'SELECT DISTINCT는 unique row만 반환합니다. GROUP BY와 달리 집계 함수 없이 중복만 제거합니다.',
    tags: ['DISTINCT', 'PROC SQL'],
  },
  {
    id: 'mc-01',
    topic: 'macro',
    difficulty: 'easy' as const,
    question: 'What does the automatic macro variable &SYSDATE represent?',
    options: [
      'The date (character) when the SAS session started',
      'The current DATA step observation number',
      'An error flag',
      'A library path',
    ],
    correctIndex: 0,
    explanation:
      'Automatic macro variables include &SYSDATE, &SYSTIME, &SYSJOBID, etc. &SYSDATE9 is a DATE9. formatted string.',
    explanationKo:
      '자동 매크로 변수: &SYSDATE, &SYSTIME, &SYSJOBID 등. &SYSDATE9는 DATE9. 포맷 문자열입니다.',
    tags: ['automatic macro variables', 'SYSDATE'],
  },
  {
    id: 'mc-02',
    topic: 'macro',
    difficulty: 'medium' as const,
    question: 'What is the difference between %GLOBAL and %LOCAL?',
    options: [
      '%GLOBAL is valid outside macros; %LOCAL is a local variable inside a macro',
      'They are the same',
      '%LOCAL is global',
      'For DATA steps only',
    ],
    correctIndex: 0,
    explanation:
      '%LOCAL creates macro-local variables; %GLOBAL is valid throughout the SAS session. Use %LOCAL to avoid name conflicts.',
    explanationKo:
      '%LOCAL은 매크로 내부 지역 변수, %GLOBAL은 SAS session 전체에서 유효합니다. 이름 충돌 방지에 %LOCAL 사용.',
    tags: ['%GLOBAL', '%LOCAL'],
  },
  {
    id: 'mc-03',
    topic: 'macro',
    difficulty: 'hard' as const,
    question: 'What is the role of the macro quoting function %STR?',
    options: [
      'Protects special characters (semicolons, commas, etc.) as literals until macro execution time',
      'Converts strings to uppercase',
      'Converts to numbers',
      'Executes SQL',
    ],
    correctIndex: 0,
    explanation:
      '%STR, %NRSTR, %BQUOTE, %SUPERQ, and similar functions use macro quoting to prevent special characters from being interpreted early in the macro facility.',
    explanationKo:
      '%STR, %NRSTR, %BQUOTE, %SUPERQ 등은 macro quoting으로 특수문자가 매크로에서 조기 해석되는 것을 방지합니다.',
    tags: ['macro quoting', '%STR'],
  },
  {
    id: 'mc-04',
    topic: 'macro',
    difficulty: 'medium' as const,
    question: 'What is the difference between %DO %WHILE and %DO %UNTIL?',
    options: [
      '%WHILE repeats while the condition is true; %UNTIL repeats until the condition becomes true',
      'They are the same',
      'For DATA steps only',
      'For SQL only',
    ],
    correctIndex: 0,
    explanation:
      '%DO %WHILE(%condition) is top-tested; %DO %UNTIL(%condition) is bottom-tested.',
    explanationKo:
      '%DO %WHILE(%condition)은 top-tested, %DO %UNTIL(%condition)은 bottom-tested loop입니다.',
    tags: ['%DO %WHILE', '%DO %UNTIL'],
  },
  {
    id: 'mc-05',
    topic: 'macro',
    difficulty: 'medium' as const,
    question: 'What is the purpose of the SYMGET function?',
    options: [
      'Reads a macro variable value in a DATA step and returns it as a DATA step variable',
      'Defines a macro',
      'SQL join',
      'Creates a hash object',
    ],
    correctIndex: 0,
    explanation:
      'SYMGET("macvar") retrieves a macro variable value as a DATA step character value in a DATA step. SYMPUT does the reverse.',
    explanationKo:
      'SYMGET("macvar")는 DATA step에서 macro variable 값을 data step character value로 가져옵니다. 반대는 SYMPUT.',
    tags: ['SYMGET', 'SYMPUT'],
  },
  {
    id: 'mc-06',
    topic: 'macro',
    difficulty: 'hard' as const,
    question: 'What is the effect of OPTIONS MERROR?',
    options: [
      'Produces an error when an undefined macro is called',
      'Disables macros',
      'Hides the log',
      'Optimizes SQL',
    ],
    correctIndex: 0,
    explanation:
      'MERROR treats unresolved macro references as errors. Used with MPRINT, MLOGIC, and SYMBOLGEN for macro debugging.',
    explanationKo:
      'MERROR는 unresolved macro reference를 ERROR로 처리합니다. 매크로 디버깅 시 MPRINT MLOGIC SYMBOLGEN과 함께 사용.',
    tags: ['MERROR', 'debugging'],
  },
  {
    id: 'mc-07',
    topic: 'macro',
    difficulty: 'easy' as const,
    question: 'What is the purpose of the %EVAL function?',
    options: [
      'Performs integer arithmetic/comparison at macro execution time',
      'Evaluates DATA step variables',
      'SQL aggregation',
      'Applies formats',
    ],
    correctIndex: 0,
    explanation:
      '%EVAL performs integer arithmetic at macro execution time. %SYSEVALF handles floating point. Use %SCAN, %SUBSTR, etc. for strings.',
    explanationKo:
      '%EVAL은 macro execution time에 integer arithmetic. %SYSEVALF는 floating point. 문자열은 %SCAN, %SUBSTR 등.',
    tags: ['%EVAL', 'macro functions'],
  },
  {
    id: 'mc-08',
    topic: 'macro',
    difficulty: 'medium' as const,
    question: 'When are conditions evaluated in macro %IF %THEN %ELSE within a %MACRO?',
    options: [
      'At macro compile/execution time (before DATA step execution)',
      'After DATA step execution',
      'After PROC step completion',
      'When the log is written',
    ],
    correctIndex: 0,
    explanation:
      'Macro %IF is evaluated at compile/execute time and determines which SAS code is generated. This differs from DATA step IF.',
    explanationKo:
      'Macro %IF는 compile/execute time에 평가되어 어떤 SAS code가 생성될지 결정합니다. DATA step IF와 다릅니다.',
    tags: ['%IF', 'macro logic'],
  },
  {
    id: 'at-01',
    topic: 'advanced-techniques',
    difficulty: 'medium' as const,
    question: 'What is a major advantage of hash objects?',
    options: [
      'Efficient in-memory key lookup compared to large merges',
      'Always requires disk sorting',
      'Cannot replace macros',
      'Always slower than SQL',
    ],
    correctIndex: 0,
    explanation:
      'DECLARE HASH objects enable key-based lookup, performing merge-like operations efficiently without SORT.',
    explanationKo:
      'DECLARE HASH 객체로 key-based lookup을 하면 SORT 없이 merge 유사 작업을 효율적으로 수행할 수 있습니다.',
    tags: ['hash object'],
  },
  {
    id: 'at-02',
    topic: 'advanced-techniques',
    difficulty: 'hard' as const,
    question: 'In the following hash code, what does rc=0 mean?',
    code: `if _N_ = 1 then do;
  declare hash h(dataset:'lookup');
  h.definekey('id');
  h.definedata('name', 'score');
  h.definedone();
end;
rc = h.find();`,
    options: ['Key found (success)', 'Key not found', 'Error occurred', 'Hash not defined'],
    correctIndex: 0,
    explanation:
      'In hash.find(), rc=0 means key match success. Non-zero values indicate key not found or other conditions.',
    explanationKo:
      'hash.find()에서 rc=0은 key match success. non-zero는 key not found 등을 의미합니다.',
    tags: ['hash object', 'find()'],
  },
  {
    id: 'at-03',
    topic: 'advanced-techniques',
    difficulty: 'medium' as const,
    question: 'Which is the correct way to declare a two-dimensional ARRAY?',
    options: [
      'array name(r,c) var1-var12; (r×c = number of variables)',
      'array name(*) _all_;',
      'Two-dimensional ARRAYs are not possible in SAS',
      'Only possible with PROC SQL',
    ],
    correctIndex: 0,
    explanation:
      'Declare a 2D array with ARRAY name(3,4) a1-a12; and access elements with name(i,j). A core topic in advanced techniques.',
    explanationKo:
      'ARRAY name(3,4) a1-a12; 형태로 2D array를 선언하고 name(i,j)로 접근합니다. 시험 advanced techniques 영역 핵심.',
    tags: ['2D ARRAY'],
  },
  {
    id: 'at-04',
    topic: 'advanced-techniques',
    difficulty: 'easy' as const,
    question: 'What is the primary use of PROC DATASETS?',
    options: [
      'Managing datasets in a library (delete, rename, modify attributes) without reading data',
      'Statistical analysis',
      'Creating macros',
      'SQL joins',
    ],
    correctIndex: 0,
    explanation:
      'PROC DATASETS is a utility procedure that efficiently manages dataset metadata with MODIFY, DELETE, CHANGE, and similar statements.',
    explanationKo:
      'PROC DATASETS는 MODIFY, DELETE, CHANGE 등으로 데이터셋 메타데이터를 효율적으로 관리하는 utility procedure입니다.',
    tags: ['PROC DATASETS', 'utility procedures'],
  },
  {
    id: 'at-05',
    topic: 'advanced-techniques',
    difficulty: 'medium' as const,
    question: 'What does the _METHOD option in PROC SQL do?',
    options: [
      'Displays the query execution plan in the log',
      'Encrypts results',
      'Creates macro variables',
      'Replaces hash objects',
    ],
    correctIndex: 0,
    explanation:
      'PROC SQL _METHOD shows the join/merge method chosen by the optimizer in the log. Used for performance tuning and debugging.',
    explanationKo:
      'PROC SQL _METHOD는 optimizer가 선택한 join/merge 방법을 로그에 보여줍니다. 성능 튜닝/디버깅에 사용.',
    tags: ['PROC SQL', '_METHOD'],
  },
  {
    id: 'at-06',
    topic: 'advanced-techniques',
    difficulty: 'hard' as const,
    question: 'What is the result of WHICH("a b c", "b")?',
    options: ['1', '2', '3', '0'],
    correctIndex: 1,
    explanation:
      'WHICH returns the position (1-based) of the matching argument in the list. "b" is the second argument, so the result is 2. Different from INDEX.',
    explanationKo:
      'WHICH는 인자 목록에서 일치하는 위치(1-based)를 반환. b는 두 번째 인자이므로 2. INDEX와 다릅니다.',
    tags: ['WHICH', 'advanced functions'],
  },
  {
    id: 'at-07',
    topic: 'advanced-techniques',
    difficulty: 'medium' as const,
    question: 'What is the purpose of the PROC FORMAT CNTLIN= option?',
    options: [
      'Reads format definitions from a dataset to create user-defined formats',
      'SQL join',
      'Creates macro variables',
      'Defines hash objects',
    ],
    correctIndex: 0,
    explanation:
      'CNTLIN= uses a dataset (start, label, type, etc.) to dynamically create formats. An advanced utility technique.',
    explanationKo:
      'CNTLIN= 데이터셋(start, label, type 등)으로 format을 동적 생성합니다. Advanced utility technique입니다.',
    tags: ['PROC FORMAT', 'CNTLIN'],
  },
  {
    id: 'at-08',
    topic: 'advanced-techniques',
    difficulty: 'hard' as const,
    question: 'What is the purpose of a hash iterator?',
    options: [
      'Iterate through entries in a hash object',
      'SQL sorting',
      'Macro iteration',
      'ODS output',
    ],
    correctIndex: 0,
    explanation:
      'DECLARE HITER objects let you iterate through hash table entries. Used for complex lookup and iteration.',
    explanationKo:
      'DECLARE HITER 객체로 hash table entries를 순회할 수 있습니다. 복잡한 lookup/iteration에 사용.',
    tags: ['hash iterator', 'HITER'],
  },
]

export const EXAM_INFO = {
  name: 'SAS Certified Professional: Advanced Programming Using SAS 9.4',
  examId: 'A00-232',
  questions: 15,
  minutes: 125,
  passingScore: 725,
  passingLabel: '725 points',
  scoreRange: '200-1000',
  prerequisite: 'Base Programming Specialist (required)',
  topics: [
    { topic: 'sql', weight: '35%' },
    { topic: 'macro', weight: '35%' },
    { topic: 'advanced-techniques', weight: '30%' },
  ],
}

export const STUDY_CHECKLIST = [
  { id: 'ad1', text: 'PROC SQL JOIN (inner, left, right, full) + COALESCE', topic: 'sql' },
  { id: 'ad2', text: 'Set operators: UNION, EXCEPT, INTERSECT, OUTER UNION', topic: 'sql' },
  { id: 'ad3', text: 'Subquery, inline view, CALCULATED keyword', topic: 'sql' },
  { id: 'ad4', text: 'GROUP BY, HAVING, summary functions', topic: 'sql' },
  { id: 'ad5', text: 'DICTIONARY tables / sashelp.vtable', topic: 'sql' },
  { id: 'ad6', text: 'Macro variables: %LET, &, %GLOBAL, %LOCAL', topic: 'macro' },
  { id: 'ad7', text: '%MACRO / %MEND, parameters, %IF %THEN', topic: 'macro' },
  { id: 'ad8', text: 'Macro quoting: %STR, %NRSTR, %BQUOTE', topic: 'macro' },
  { id: 'ad9', text: '%SYSFUNC, %EVAL, SYMGET/SYMPUT', topic: 'macro' },
  { id: 'ad10', text: 'MPRINT, MLOGIC, SYMBOLGEN, MERROR debugging', topic: 'macro' },
  { id: 'ad11', text: 'Hash object: definekey, definedata, find/add', topic: 'advanced-techniques' },
  { id: 'ad12', text: '1D/2D ARRAY usage', topic: 'advanced-techniques' },
  { id: 'ad13', text: 'PROC DATASETS, FORMAT CNTLIN', topic: 'advanced-techniques' },
  { id: 'ad14', text: 'WHICH, FINDC, and other advanced functions', topic: 'advanced-techniques' },
  { id: 'ad15', text: 'Take the official Advanced Practice Exam (performance-based)', topic: 'sql' },
]

export const ADVANCED_CERT: CertData = {
  id: 'advanced',
  shortName: 'Advanced',
  fullName: 'Advanced Programming Professional',
  subtitle: 'SAS 9.4 · A00-232',
  color: '#5b4a9e',
  topics: TOPICS,
  questions: applyKoPatches(
    applyMcqUpgrades(
      [...QUESTIONS, ...ADVANCED_EXTRA, ...EXAM_GRADE_ADVANCED, ...EXPANSION_ADVANCED],
      ADVANCED_UPGRADES
    ),
    KO_PATCHES_ADVANCED
  ),
  examInfo: EXAM_INFO,
  checklist: STUDY_CHECKLIST,
}
