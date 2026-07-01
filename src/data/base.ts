import type { CertData, TopicInfo, Question } from './types'
import { BASE_EXTRA } from './extra/base'
import { TRICKY_BASE } from './extra/tricky-base'
import { PREMIUM_BASE } from './extra/premium-base'
import { EXAM_GRADE_BASE } from './extra/exam-grade-base'
import { BASE_UPGRADES } from './upgrade/base-upgrades'
import { applyMcqUpgrades } from '../lib/mergeUpgrades'
import { applyKoPatches } from '../lib/applyKoPatches'
import { KO_PATCHES_BASE } from './locale/ko-patches-base'

export type BaseTopic =
  | 'data-structures'
  | 'manage-data'
  | 'error-handling'
  | 'reports'

export const TOPICS: Record<BaseTopic, TopicInfo> = {
  'data-structures': {
    label: 'Accessing and Creating Data Structures',
    weight: '20-25%',
    color: '#3b82f6',
  },
  'manage-data': {
    label: 'Managing Data',
    weight: '35-40%',
    color: '#10b981',
  },
  'error-handling': {
    label: 'Error Handling',
    weight: '15-20%',
    color: '#f59e0b',
  },
  reports: {
    label: 'Generating Reports and Output',
    weight: '15-20%',
    color: '#8b5cf6',
  },
}

export const QUESTIONS: Question[] = [
  // ===== DATA STRUCTURES =====
  {
    id: 'ds-01',
    title: 'Permanent vs temporary storage',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Library PROJ points to D:\\analytics\\proj (permanent). You finish a report dataset that must remain after logout.\n\nWhich reference stores it permanently?',
    options: [
      'data proj.report; ...',
      'data work.report; ...',
      'data report; ...',
      'proc copy in=work out=report; ...',
    ],
    correctIndex: 0,
    explanation:
      'A libref from LIBNAME (PROJ.) writes to permanent storage. WORK and one-level names are temporary for the session.',
    explanationKo: 'LIBNAME으로 만든 libref(PROJ.)가 영구 저장입니다. WORK와 일단계 이름은 임시입니다.',
    tags: ['LIBNAME', 'DATA step'],
  },
  {
    id: 'ds-02',
    topic: 'data-structures',
    difficulty: 'medium',
    question: 'Which statement is correct about the result of the following LIBNAME statement?\n\nlibname mylib "C:\\data";',
    options: [
      'mylib is a temporary library reference',
      'mylib is a library reference pointing to the C:\\data folder',
      'mylib is an alias for the SASHELP library',
      'The LIBNAME statement can only be used in a DATA step',
    ],
    correctIndex: 1,
    explanation: 'The LIBNAME statement maps an external folder to a SAS library. You can access SAS datasets in that folder using the form mylib.sales.',
    explanationKo: 'LIBNAME 문은 외부 폴더를 SAS 라이브러리로 매핑합니다. mylib.sales 형태로 해당 폴더의 SAS 데이터셋에 접근할 수 있습니다.',
    tags: ['LIBNAME'],
  },
  {
    id: 'ds-03',
    title: 'Inspect dataset structure',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'You inherit WORK.ORDERS and must confirm variable names, types, and lengths before writing a MERGE — without listing every row.\n\nWhich procedure should you run first?',
    options: [
      'PROC CONTENTS',
      'PROC MEANS',
      'PROC SORT',
      'PROC EXPORT',
    ],
    correctIndex: 0,
    explanation: 'PROC CONTENTS is a utility procedure that examines dataset structure (variable names, types, lengths, formats, labels, etc.).',
    explanationKo: 'PROC CONTENTS는 데이터셋의 구조(변수명, 타입, 길이, 포맷, 라벨 등)를 조사하는 유틸리티 프로시저입니다.',
    tags: ['PROC CONTENTS'],
  },
  {
    id: 'ds-04',
    topic: 'data-structures',
    difficulty: 'hard',
    question: 'How many observations are created in work.test after the following code runs?',
    code: `data one; x=1; output; x=2; output; run;
data two; y=3; output; run;
data test; set one two; run;`,
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'The SET statement concatenates datasets vertically. one has 2 observations + two has 1 = 3 total observations are created.',
    explanationKo: 'SET 문은 데이터셋을 세로로 연결(concatenate)합니다. one에 2개 + two에 1개 = 총 3개 observation이 생성됩니다.',
    tags: ['SET', 'concatenate'],
  },
  {
    id: 'ds-05',
    topic: 'data-structures',
    difficulty: 'medium',
    question: 'What is the default value of the DELIMITER option when reading a CSV file with PROC IMPORT?',
    options: ['Comma (,)', 'Tab', 'Space', 'Semicolon'],
    correctIndex: 0,
    explanation: 'When using DBMS=CSV in PROC IMPORT, the default delimiter is a comma (,). You can change it with the DELIMITER= option.',
    explanationKo: 'PROC IMPORT에서 DBMS=CSV를 사용하면 기본 구분자는 쉼표(,)입니다. DELIMITER= 옵션으로 변경할 수 있습니다.',
    tags: ['PROC IMPORT', 'CSV'],
  },
  {
    id: 'ds-06',
    topic: 'data-structures',
    difficulty: 'hard',
    question: 'What message may appear in the log when BY variables are not sorted in the following MERGE statement?',
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
    explanation: 'Data must be sorted by the BY variables before a MERGE. If not sorted, a "BY variables are not properly sorted" error/warning occurs and results may be incorrect.',
    explanationKo: 'MERGE 전에 BY 변수로 정렬해야 합니다. 정렬되지 않으면 "BY variables are not properly sorted" 오류/경고가 발생하고 결과가 부정확합니다.',
    tags: ['MERGE', 'BY', 'PROC SORT'],
  },
  {
    id: 'ds-07',
    topic: 'data-structures',
    difficulty: 'medium',
    question: 'What date does the SAS date value 21915 represent when formatted with DATE9.?',
    options: ['01JAN2020', '15JAN2020', '01DEC2019', '15DEC2019'],
    correctIndex: 0,
    explanation: 'SAS dates are integers with 01JAN1960 as 0. 21915 = 01JAN2020. You can verify with INTNX, TODAY(), etc.',
    explanationKo: 'SAS 날짜는 1960년 1월 1일을 0으로 하는 정수입니다. 21915 = 01JAN2020입니다. INTNX, TODAY() 등으로 확인할 수 있습니다.',
    tags: ['date values', 'formats'],
  },
  {
    id: 'ds-08',
    topic: 'data-structures',
    difficulty: 'easy',
    question: 'Which statement correctly describes the difference between IF and WHERE?',
    options: [
      'WHERE is only for DATA steps; IF is only for PROC steps',
      'WHERE filters before reading observations, making it more efficient',
      'IF cannot be used in PROC steps',
      'WHERE and IF behave exactly the same',
    ],
    correctIndex: 1,
    explanation: 'WHERE filters data before reading it into memory, so it is more efficient for large datasets. IF applies conditions after observations are read in a DATA step.',
    explanationKo: 'WHERE는 데이터를 메모리에 읽기 전에 필터링하므로 대용량 데이터에서 더 효율적입니다. IF는 DATA step에서 observation을 읽은 후 조건을 적용합니다.',
    tags: ['IF', 'WHERE'],
  },
  {
    id: 'ds-09',
    topic: 'data-structures',
    difficulty: 'medium',
    question: 'What is the difference between the KEEP= and DROP= dataset options?',
    options: [
      'KEEP= retains only specified variables; DROP= removes only specified variables',
      'KEEP= is for PROC steps; DROP= is for DATA steps',
      'Both have the same function',
      'KEEP= can only be used on permanent datasets',
    ],
    correctIndex: 0,
    explanation: 'KEEP= keeps only the listed variables, and DROP= excludes the listed variables. Both are used as dataset options on SET or DATA statements.',
    explanationKo: 'KEEP=는 나열한 변수만 유지하고, DROP=는 나열한 변수를 제외합니다. SET 문이나 DATA 문의 데이터셋 옵션으로 사용합니다.',
    tags: ['KEEP', 'DROP'],
  },
  {
    id: 'ds-10',
    topic: 'data-structures',
    difficulty: 'hard',
    question: 'How many observations are in the result of the following code?',
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
    explanation: 'IF score > 80 outputs only observations where score exceeds 80. Only id=1 (85) and id=2 (90) qualify. Missing values (.) evaluate as false in comparisons.',
    explanationKo: 'IF score > 80은 score가 80 초과인 observation만 출력합니다. id=1(85), id=2(90) 두 개만 해당됩니다. 결측값(.)은 비교 시 false입니다.',
    tags: ['IF', 'missing values'],
  },
  {
    id: 'ds-11',
    topic: 'data-structures',
    difficulty: 'medium',
    question: 'What is the role of the GUESSINGROWS= option?',
    options: [
      'Specify the number of rows PROC IMPORT examines when guessing variable types',
      'Specify the number of rows to match during a MERGE',
      'Limit the number of rows in PROC PRINT output',
      'Specify the number of iterations in a DATA step',
    ],
    correctIndex: 0,
    explanation: 'GUESSINGROWS= specifies how many rows PROC IMPORT reads when guessing character vs numeric types. The default is 20.',
    explanationKo: 'GUESSINGROWS=는 PROC IMPORT가 문자/숫자 타입을 추정할 때 읽는 행 수를 지정합니다. 기본값은 20입니다.',
    tags: ['PROC IMPORT', 'GUESSINGROWS'],
  },
  {
    id: 'ds-12',
    title: 'WORK library behavior',
    topic: 'data-structures',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'A colleague writes `data summary; set raw.sales; run;` without assigning a libref to SUMMARY.\n\nWhere is SUMMARY stored, and what happens when SAS closes?',
    options: [
      'WORK.SUMMARY — deleted when the session ends',
      'RAW.SUMMARY — permanent in the RAW folder',
      'SASHELP.SUMMARY — read-only system copy',
      'SUMMARY library on disk — survives logout',
    ],
    correctIndex: 0,
    explanation: 'WORK is the default temporary library. If you write a dataset name without a libref, work. is applied automatically.',
    explanationKo: 'WORK는 기본 임시 라이브러리입니다. libref 없이 데이터셋 이름만 쓰면 work.이 자동 적용됩니다.',
    tags: ['WORK', 'libraries'],
  },

  // ===== MANAGE DATA =====
  {
    id: 'md-01',
    title: 'Running total without SUM',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'You need TOTAL to accumulate AMOUNT across rows using explicit RETAIN (no SUM statement).\n\nWhich block is correct?',
    options: [
      'retain total 0; total = total + amount;',
      'total = total + amount;',
      'retain total; total = amount;',
      'total + amount; retain total;',
    ],
    correctIndex: 0,
    explanation: 'RETAIN keeps variable values from being reset when moving to the next observation. Initialize (retain total 0) then assign. Plain assignment without RETAIN resets each row.',
    explanationKo: 'RETAIN은 변수 값이 다음 observation으로 넘어갈 때 초기화되지 않도록 유지합니다. retain total 0 후 누적 할당이 필요합니다.',
    tags: ['RETAIN'],
  },
  {
    id: 'md-02',
    topic: 'manage-data',
    difficulty: 'medium',
    question: 'What is the value of total after the following code runs?',
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
    explanation: 'total + value is a SUM statement with implicit RETAIN. 10+20+30=60. The total on the last observation is 60.',
    explanationKo: 'total + value는 SUM statement로, 암묵적 RETAIN이 적용됩니다. 10+20+30=60. 마지막 observation의 total이 60입니다.',
    tags: ['SUM statement', 'RETAIN'],
  },
  {
    id: 'md-03',
    topic: 'manage-data',
    difficulty: 'medium',
    question: 'What is the result of SUBSTR(name, 2, 3) when name="SASBASE"?',
    options: ['SAS', 'ASB', 'ASBA', 'SB'],
    correctIndex: 1,
    explanation: 'SUBSTR(string, start position, length). Starting at position 2 for 3 characters = "ASB". SAS string indexing starts at 1.',
    explanationKo: 'SUBSTR(문자열, 시작위치, 길이). 2번째 문자부터 3글자 = "ASB"입니다. SAS 문자열 인덱스는 1부터 시작합니다.',
    tags: ['SUBSTR', 'character functions'],
  },
  {
    id: 'md-04',
    topic: 'manage-data',
    difficulty: 'hard',
    question: 'What is the result of INPUT("123.45", 8.2)?',
    options: ['Character "123.45"', 'Numeric 123.45', 'Numeric 123', 'An error occurs'],
    correctIndex: 1,
    explanation: 'The INPUT function converts character to numeric. Using informat 8.2 yields 123.45. PUT does the opposite (numeric to character).',
    explanationKo: 'INPUT 함수는 문자를 숫자로 변환합니다. informat 8.2를 사용하면 123.45가 됩니다. PUT은 반대(숫자→문자)입니다.',
    tags: ['INPUT', 'PUT', 'type conversion'],
  },
  {
    id: 'md-05',
    title: 'DO loop output count',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'How many observations does this DATA step write?',
    code: `data tiers;
  do tier = 1 to 4;
    bonus = tier * 500;
    output;
  end;
run;`,
    options: ['1', '4', '5', '16'],
    correctIndex: 1,
    explanation: 'Each loop iteration hits OUTPUT, creating one row. DO tier=1 to 4 produces 4 observations.',
    explanationKo: '루프마다 OUTPUT이 실행되어 4개 observation이 생성됩니다.',
    tags: ['DO loop'],
  },
  {
    id: 'md-06',
    topic: 'manage-data',
    difficulty: 'hard',
    question: 'What is the value of a2 in the following ARRAY statement?',
    code: `data test;
  array nums(3) a1-a3;
  do i = 1 to 3;
    nums(i) = i * 10;
  end;
  drop i;
run;`,
    options: ['10', '20', '30', 'Missing'],
    correctIndex: 1,
    explanation: 'ARRAY nums(3) a1-a3 groups a1, a2, and a3 into an array. When i=2, nums(2)=a2=20.',
    explanationKo: 'ARRAY nums(3) a1-a3는 a1, a2, a3를 배열로 묶습니다. i=2일 때 nums(2)=a2=20입니다.',
    tags: ['ARRAY', 'DO loop'],
  },
  {
    id: 'md-07',
    topic: 'manage-data',
    difficulty: 'medium',
    question: 'What does the INTCK("month", start_date, end_date) function do?',
    options: [
      'Calculate the number of months between two dates',
      'Add months to a date',
      'Extract the month from a date',
      'Return the month name',
    ],
    correctIndex: 0,
    explanation: 'INTCK calculates the interval between two dates/times. INTNX adds or subtracts intervals from a date.',
    explanationKo: 'INTCK는 두 날짜/시간 사이의 간격을 계산합니다. INTNX는 날짜에 간격을 더하거나 빼는 함수입니다.',
    tags: ['INTCK', 'INTNX', 'date functions'],
  },
  {
    id: 'md-08',
    title: 'LENGTH before first use',
    topic: 'manage-data',
    difficulty: 'hard',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'ZIP codes like "02108" must stay 5 characters when read from a numeric source field.\n\nWhich prevents silent truncation?',
    options: [
      'length zip $5; before any assignment to ZIP',
      'format zip $5.; after ZIP is created',
      'label zip = "ZIP";',
      'drop zip; zip = put(...);',
    ],
    correctIndex: 0,
    explanation: 'LENGTH specifies variable length before first use. It is useful for increasing character variable length or defining numeric variables as character.',
    explanationKo: 'LENGTH는 변수 길이를 첫 사용 전에 지정합니다. 문자 변수 길이를 늘리거나 숫자를 문자로 정의할 때 유용합니다.',
    tags: ['LENGTH'],
  },
  {
    id: 'md-09',
    topic: 'manage-data',
    difficulty: 'hard',
    question: 'What is the purpose of FIRST.var and LAST.var?',
    options: [
      'Identify the first/last observation in a BY group',
      'Select the first/last variables in a dataset',
      'Specify sort direction',
      'Read the first/last row of a file',
    ],
    correctIndex: 0,
    explanation: 'After sorting by BY variables, FIRST.var is 1 (true) on the first observation of a BY group and LAST.var is 1 on the last observation in a DATA step.',
    explanationKo: 'BY 변수로 정렬 후 DATA step에서 FIRST.var는 해당 BY 그룹의 첫 observation, LAST.var는 마지막 observation일 때 1(참)입니다.',
    tags: ['FIRST.', 'LAST.', 'BY'],
  },
  {
    id: 'md-10',
    topic: 'manage-data',
    difficulty: 'medium',
    question: 'What is the result of COMPRESS("SAS Base", " ")?',
    options: ['SASBase', 'SAS Base', 'SASBASE', 'S A S B a s e'],
    correctIndex: 0,
    explanation: 'COMPRESS removes specified characters (here, blanks). "SAS Base" → "SASBase". A third argument can specify modifiers (a=alphabetic, d=digits, etc.).',
    explanationKo: 'COMPRESS는 지정 문자(여기서 공백)를 제거합니다. "SAS Base" → "SASBase". 세 번째 인자로 modifier(a=알파벳, d=숫자 등)도 사용합니다.',
    tags: ['COMPRESS', 'character functions'],
  },
  {
    id: 'md-11',
    topic: 'manage-data',
    difficulty: 'medium',
    question: 'What is the primary purpose of PROC TRANSPOSE?',
    options: [
      'Convert data between wide and long formats',
      'Sort a dataset',
      'Merge variables',
      'Replace missing values',
    ],
    correctIndex: 0,
    explanation: 'PROC TRANSPOSE switches rows and columns. It groups by BY variables and spreads VAR variables into column names.',
    explanationKo: 'PROC TRANSPOSE는 행과 열을 전환합니다. BY 변수로 그룹화하고, VAR 변수를 열 이름으로 펼칩니다.',
    tags: ['PROC TRANSPOSE'],
  },
  {
    id: 'md-12',
    topic: 'manage-data',
    difficulty: 'hard',
    question: 'What does group_total represent in the following code?',
    code: `proc sort data=sales; by region; run;
data summary;
  set sales;
  by region;
  if first.region then group_total = 0;
  group_total + amount;
run;`,
    options: [
      'Grand total of amount',
      'Running total of amount by region',
      'Average amount by region',
      'Total for only the last region',
    ],
    correctIndex: 1,
    explanation: 'group_total is reset to 0 at FIRST.region and accumulated with a SUM statement, so each observation shows the running total for its region.',
    explanationKo: 'FIRST.region에서 group_total을 0으로 리셋하고 SUM statement로 누적하므로, 각 observation에서 해당 region의 누적 합계가 됩니다.',
    tags: ['FIRST.', 'SUM statement', 'BY'],
  },
  {
    id: 'md-13',
    topic: 'manage-data',
    difficulty: 'easy',
    question: 'Which is a correct example of using the RENAME= dataset option?',
    options: [
      'data new(rename=(oldname=newname));',
      'rename oldname=newname;',
      'proc rename data=old new=new;',
      'set old rename new;',
    ],
    correctIndex: 0,
    explanation: 'RENAME=(old=new) is used as a dataset option on DATA or SET statements. A RENAME statement can also be used inside a DATA step.',
    explanationKo: 'RENAME=(old=new)는 DATA 문이나 SET 문의 데이터셋 옵션으로 사용합니다. RENAME 문도 DATA step 내에서 사용 가능합니다.',
    tags: ['RENAME'],
  },
  {
    id: 'md-14',
    topic: 'manage-data',
    difficulty: 'medium',
    question: 'What is the result of SCAN("SAS,Base,Cert", 2, ",")?',
    options: ['SAS', 'Base', 'Cert', 'SAS,Base,Cert'],
    correctIndex: 1,
    explanation: 'SCAN returns the nth token separated by delimiters. The 2nd token = "Base". COUNTW counts the number of tokens.',
    explanationKo: 'SCAN은 구분자로 분리한 n번째 토큰을 반환합니다. 2번째 토큰 = "Base". COUNTW는 토큰 개수를 셉니다.',
    tags: ['SCAN', 'character functions'],
  },
  {
    id: 'md-15',
    topic: 'manage-data',
    difficulty: 'hard',
    question: 'What happens when you use the MISSING option in PROC MEANS?',
    options: [
      'Include missing values in the analysis',
      'Replace missing values with 0',
      'Delete observations with missing values',
      'Output only missing values',
    ],
    correctIndex: 0,
    explanation: 'The MISSING option includes missing values of CLASS variables as a separate category in the analysis. By default, missing CLASS levels are excluded.',
    explanationKo: 'MISSING 옵션은 CLASS 변수의 결측값도 별도 카테고리로 분석에 포함합니다. 기본적으로 결측 CLASS는 제외됩니다.',
    tags: ['PROC MEANS', 'MISSING'],
  },

  // ===== ERROR HANDLING =====
  {
    id: 'eh-01',
    title: 'ERROR in the log',
    topic: 'error-handling',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Your DATA step log shows:\n\nERROR 22-322: Syntax error, expecting a semicolon.\nNOTE: DATA statement used and stopped processing.\n\nWhat should you assume about WORK.OUT?',
    options: [
      'The step failed — verify whether OUT exists and has expected rows',
      'The program completed normally with all rows',
      'It is only a WARNING and safe to ignore',
      'SAS auto-corrected the semicolon and ran all rows',
    ],
    correctIndex: 0,
    explanation: 'ERROR means step execution failed. WARNING means execution continued but there may be issues. NOTE is informational.',
    explanationKo: 'ERROR는 step 실행 실패를 의미합니다. WARNING은 실행은 되지만 문제가 있을 수 있음, NOTE는 정보성 메시지입니다.',
    tags: ['log', 'ERROR'],
  },
  {
    id: 'eh-02',
    topic: 'error-handling',
    difficulty: 'medium',
    question: 'What is wrong with the following code?',
    code: `data test;
  set mydata;
  if age > 18 then status = "Adult"
run;`,
    options: [
      'Missing semicolon (;)',
      'Incorrect IF condition',
      'SET statement error',
      'Variable name error',
    ],
    correctIndex: 0,
    explanation: 'The THEN clause is missing a semicolon. It should be status = "Adult";. Missing semicolons are the most common syntax errors.',
    explanationKo: 'THEN 절 끝에 세미콜론이 없습니다. status = "Adult"; 가 되어야 합니다. 세미콜론 누락은 가장 흔한 syntax error입니다.',
    tags: ['syntax error', 'semicolon'],
  },
  {
    id: 'eh-03',
    topic: 'error-handling',
    difficulty: 'hard',
    question: 'What is the default behavior when invalid data occurs in a DATA step?',
    options: [
      '_ERROR_=1 is set and the observation is still output',
      'The DATA step stops immediately',
      'The observation is skipped',
      'Values are converted to missing and processing stops',
    ],
    correctIndex: 0,
    explanation: 'For invalid data, the affected variable becomes missing and _ERROR_=1 is set. You can control this with invalid= and _ERROR_= options on INFILE/INPUT.',
    explanationKo: 'invalid data 시 해당 변수는 결측값이 되고 _ERROR_=1이 설정됩니다. INFILE/INPUT의 invalid=, _ERROR_= 옵션으로 제어할 수 있습니다.',
    tags: ['invalid data', '_ERROR_'],
  },
  {
    id: 'eh-04',
    topic: 'error-handling',
    difficulty: 'medium',
    question: 'What is the effect of OPTIONS OBS=0?',
    options: [
      'The DATA step runs but creates 0 observations',
      'All DATA steps are stopped',
      'Log output is disabled',
      'Only syntax checking is performed',
    ],
    correctIndex: 0,
    explanation: 'OBS=0 enables syntax check mode. Code compiles but no data is processed, so no observations are created. Useful for debugging.',
    explanationKo: 'OBS=0은 syntax check 모드입니다. 코드가 컴파일되지만 데이터 처리는 하지 않아 observation이 생성되지 않습니다. 디버깅에 유용합니다.',
    tags: ['OPTIONS OBS=0', 'syntax check'],
  },
  {
    id: 'eh-05',
    topic: 'error-handling',
    difficulty: 'medium',
    question: 'What does the log message "NOTE: Missing values were generated as a result of performing an operation on missing values" mean?',
    options: [
      'Operations involving missing values produce missing results',
      'Missing values are replaced with 0',
      'A program error occurred',
      'Data was lost',
    ],
    correctIndex: 0,
    explanation: 'In SAS, arithmetic operations with missing values (.) produce missing results. This NOTE reports normal behavior.',
    explanationKo: 'SAS에서 결측값(.)과의 산술 연산 결과는 결측값입니다. 이 NOTE는 정상적인 동작을 알려주는 것입니다.',
    tags: ['missing values', 'NOTE'],
  },
  {
    id: 'eh-06',
    topic: 'error-handling',
    difficulty: 'hard',
    question: 'Which of the following is a logic error?',
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
    explanation: 'Option B uses => which is an invalid operator (>= is correct). SAS may interpret it as a variable name, causing a logic or unexpected error.',
    explanationKo: 'Option B에서 => 는 잘못된 연산자입니다 (>= 가 맞음). SAS가 이를 변수명으로 해석하여 logic error 또는 unexpected error가 발생할 수 있습니다.',
    tags: ['logic error', 'operators'],
  },
  {
    id: 'eh-07',
    topic: 'error-handling',
    difficulty: 'easy',
    question: 'What is the purpose of PROC PRINTTO?',
    options: [
      'Redirect log/listing output destinations',
      'Change dataset output format',
      'Configure printer settings',
      'Generate HTML files',
    ],
    correctIndex: 0,
    explanation: 'PROC PRINTTO with LOG= or PRINT= options redirects log and listing output to files.',
    explanationKo: 'PROC PRINTTO LOG= 또는 PRINT= 옵션으로 로그와 listing 출력을 파일로 리다이렉트합니다.',
    tags: ['PROC PRINTTO', 'log'],
  },
  {
    id: 'eh-08',
    topic: 'error-handling',
    difficulty: 'medium',
    question: 'What happens if you try to shorten a variable length with LENGTH when the variable already exists?',
    options: [
      'A warning is issued and the existing length is kept',
      'The variable length is shortened',
      'The step stops with an error',
      'A new variable is created',
    ],
    correctIndex: 0,
    explanation: 'Once a variable length is set in SAS, it cannot be shortened in the same DATA step. LENGTH can increase length but not decrease it.',
    explanationKo: 'SAS에서 한번 설정된 변수 길이는 같은 DATA step에서 줄일 수 없습니다. LENGTH로 늘리는 것은 가능합니다.',
    tags: ['LENGTH', 'variable attributes'],
  },
  {
    id: 'eh-09',
    topic: 'error-handling',
    difficulty: 'hard',
    question: 'When merging two datasets without the IN= option, what happens to non-matching observations?',
    options: [
      'They are included in the output',
      'They are automatically deleted',
      'An error occurs',
      'Only missing values are output',
    ],
    correctIndex: 0,
    explanation: 'The default MERGE behaves like a full outer join. Non-matching observations are included. Use IN= with an IF statement to keep only matches.',
    explanationKo: '기본 MERGE는 full outer join과 유사합니다. match되지 않은 observation도 포함됩니다. match만 원하면 IN= 옵션과 IF 문으로 필터링합니다.',
    tags: ['MERGE', 'IN='],
  },
  {
    id: 'eh-10',
    topic: 'error-handling',
    difficulty: 'medium',
    question: 'What happens when PUT and INPUT functions are used incorrectly?',
    options: [
      'Type mismatches cause unexpected results or errors',
      'Automatic type conversion occurs',
      'Nothing happens',
      'The dataset is deleted',
    ],
    correctIndex: 0,
    explanation: 'PUT converts numeric to character; INPUT converts character to numeric. Using them in reverse causes conversion failures or unexpected results.',
    explanationKo: 'PUT은 숫자→문자, INPUT은 문자→숫자 변환입니다. 반대로 사용하면 변환 실패나 예상치 못한 결과가 나옵니다.',
    tags: ['PUT', 'INPUT', 'type conversion'],
  },

  // ===== REPORTS =====
  {
    id: 'rp-01',
    title: 'PROC FREQ for channel mix',
    topic: 'reports',
    difficulty: 'medium',
    examStyle: true,
    qualityTier: 'exam',
    question:
      'Marketing wants a table of ORDER_CHANNEL frequencies and percents from 50,000 orders (not 50,000 printed rows).\n\nWhich procedure fits?',
    options: [
      'PROC FREQ with TABLES order_channel;',
      'PROC PRINT with OBS=50000;',
      'PROC MEANS with CLASS order_channel;',
      'PROC SORT with NODUPKEY',
    ],
    correctIndex: 0,
    explanation: 'PROC FREQ creates one-way and two-way frequency tables. Use the TABLES statement to specify variables.',
    explanationKo: 'PROC FREQ는 one-way, two-way frequency table을 생성합니다. TABLES 문으로 변수를 지정합니다.',
    tags: ['PROC FREQ'],
  },
  {
    id: 'rp-02',
    topic: 'reports',
    difficulty: 'medium',
    question: 'What does the NMISS option do in PROC MEANS?',
    options: [
      'Output the count of missing values',
      'Exclude missing values',
      'Treat missing values as 0',
      'Analyze only missing values',
    ],
    correctIndex: 0,
    explanation: 'The NMISS statistic in PROC MEANS shows the count of missing values for each variable. N shows the non-missing count.',
    explanationKo: 'PROC MEANS의 NMISS 통계량은 각 변수의 결측값 개수를 보여줍니다. N은 non-missing 개수입니다.',
    tags: ['PROC MEANS', 'NMISS'],
  },
  {
    id: 'rp-03',
    topic: 'reports',
    difficulty: 'medium',
    question: 'What is the role of ODS HTML FILE="report.html"?',
    options: [
      'Save SAS output to an HTML file',
      'Convert HTML to a SAS dataset',
      'Start a web server',
      'Generate a PDF',
    ],
    correctIndex: 0,
    explanation: 'ODS (Output Delivery System) sends SAS output to various formats such as HTML, PDF, and RTF. Close with ODS HTML CLOSE.',
    explanationKo: 'ODS (Output Delivery System)는 SAS 출력을 HTML, PDF, RTF 등 다양한 형식으로 보냅니다. ODS HTML CLOSE로 닫습니다.',
    tags: ['ODS', 'HTML'],
  },
  {
    id: 'rp-04',
    topic: 'reports',
    difficulty: 'hard',
    question: 'What is the role of the COLUMN statement in PROC REPORT?',
    options: [
      'Specify variables (columns) to display in the report',
      'Limit the number of rows',
      'Specify sort criteria',
      'Set the title',
    ],
    correctIndex: 0,
    explanation: 'The COLUMN statement defines report column order and layout. The DEFINE statement sets attributes for each column (group, analysis, display, etc.).',
    explanationKo: 'COLUMN 문은 리포트 열 순서와 구성을 정의합니다. DEFINE 문으로 각 열의 속성(그룹, 분석, 표시 등)을 지정합니다.',
    tags: ['PROC REPORT', 'COLUMN'],
  },
  {
    id: 'rp-05',
    topic: 'reports',
    difficulty: 'easy',
    question: 'What is the default behavior of PROC PRINT?',
    options: [
      'Print dataset contents in listing format',
      'Generate summary statistics',
      'Create frequency tables',
      'Generate graphs',
    ],
    correctIndex: 0,
    explanation: 'PROC PRINT outputs observations as rows and variables as columns. Control output with VAR, WHERE, OBS, etc.',
    explanationKo: 'PROC PRINT는 observation을 행으로, 변수를 열로 출력합니다. VAR, WHERE, OBS 등으로 제어합니다.',
    tags: ['PROC PRINT'],
  },
  {
    id: 'rp-06',
    topic: 'reports',
    difficulty: 'medium',
    question: 'What does the NODUPKEY option do in PROC SORT?',
    options: [
      'Remove duplicate observations based on BY variables',
      'Remove duplicates based on all variables',
      'Skip sorting',
      'Sort missing values first',
    ],
    correctIndex: 0,
    explanation: 'NODUPKEY keeps only the first observation when BY variable combinations are identical. NODUPREC removes rows where all variables match.',
    explanationKo: 'NODUPKEY는 BY 변수 조합이 동일한 observation 중 첫 번째만 유지합니다. NODUPREC는 모든 변수가 동일한 경우 제거합니다.',
    tags: ['PROC SORT', 'NODUPKEY'],
  },
  {
    id: 'rp-07',
    topic: 'reports',
    difficulty: 'hard',
    question: 'What is the difference between CLASS and VAR in PROC TABULATE?',
    options: [
      'CLASS is for categorical variables; VAR is for continuous (analysis) variables',
      'CLASS is numeric; VAR is character',
      'No difference',
      'Only CLASS can be used with BY',
    ],
    correctIndex: 0,
    explanation: 'CLASS variables are categorical (table dimensions); VAR variables are continuous variables to analyze. Use the TABLE statement to build cross-tabulations.',
    explanationKo: 'CLASS는 범주형 변수(표의 차원), VAR는 분석할 연속형 변수입니다. TABLE 문으로 교차표를 구성합니다.',
    tags: ['PROC TABULATE', 'CLASS', 'VAR'],
  },
  {
    id: 'rp-08',
    topic: 'reports',
    difficulty: 'medium',
    question: 'What is the effect of a TITLE statement?',
    options: [
      'Display a title at the top of SAS output',
      'Set dataset variable labels',
      'Specify a file name',
      'Write a log message',
    ],
    correctIndex: 0,
    explanation: 'TITLE and FOOTNOTE set report titles and footnotes. Multiple lines are possible with TITLE1, TITLE2, etc. Use TITLE; to clear titles.',
    explanationKo: 'TITLE, FOOTNOTE는 출력 리포트의 제목/각주를 설정합니다. TITLE1, TITLE2 등 여러 줄 가능. TITLE; 로 초기화합니다.',
    tags: ['TITLE', 'FOOTNOTE'],
  },
  {
    id: 'rp-09',
    topic: 'reports',
    difficulty: 'medium',
    question: 'How do you apply a user-defined format created with PROC FORMAT?',
    options: [
      'Use a FORMAT statement or assign a format to a variable',
      'Use a LABEL statement',
      'Use only an INFORMAT statement',
      'Use PROC PRINTTO',
    ],
    correctIndex: 0,
    explanation: 'Define formats with PROC FORMAT VALUE= and apply with FORMAT variable fmtname.;. Formats can also be used with the PUT function.',
    explanationKo: 'PROC FORMAT VALUE= 로 포맷을 정의하고, FORMAT 변수 fmtname.; 으로 적용합니다. PUT 함수에도 사용 가능합니다.',
    tags: ['PROC FORMAT', 'FORMAT'],
  },
  {
    id: 'rp-10',
    topic: 'reports',
    difficulty: 'easy',
    question: 'What is the role of DISTINCT in a PROC SQL SELECT statement?',
    options: [
      'Remove duplicate rows',
      'Sort rows',
      'Calculate group totals',
      'Perform a join',
    ],
    correctIndex: 0,
    explanation: 'SELECT DISTINCT returns only unique rows. PROC SQL can manipulate data and produce reports without a DATA step.',
    explanationKo: 'SELECT DISTINCT는 고유한 행만 반환합니다. PROC SQL은 DATA step 없이 데이터 조작과 리포트가 가능합니다.',
    tags: ['PROC SQL', 'DISTINCT'],
  },
  {
    id: 'rp-11',
    topic: 'reports',
    difficulty: 'hard',
    question: 'What happens when you use a CLASS statement in PROC MEANS?',
    options: [
      'Summary statistics grouped by CLASS variables',
      'CLASS variables are excluded',
      'Only sorting is performed',
      'Only frequencies are output',
    ],
    correctIndex: 0,
    explanation: 'CLASS divides data into groups by categorical variables to compute MEANS, SUM, FREQ, etc. Unlike BY, output appears in a single combined table.',
    explanationKo: 'CLASS는 범주형 변수로 그룹을 나누어 MEANS, SUM, FREQ 등을 계산합니다. BY와 달리 출력이 합쳐진 테이블로 나옵니다.',
    tags: ['PROC MEANS', 'CLASS'],
  },
  {
    id: 'rp-12',
    topic: 'reports',
    difficulty: 'medium',
    question: 'What is the purpose of ODS TRACE ON?',
    options: [
      'Display names of ODS output objects being created (debugging)',
      'Disable output',
      'Change HTML style',
      'Change log level',
    ],
    correctIndex: 0,
    explanation: 'ODS TRACE ON shows which ODS output objects are created in the log. Use it when you need object names for ODS OUTPUT or SELECT.',
    explanationKo: 'ODS TRACE ON은 어떤 ODS output object가 생성되는지 로그에 표시합니다. ODS OUTPUT이나 SELECT 시 객체 이름을 알아야 할 때 사용합니다.',
    tags: ['ODS TRACE', 'debugging'],
  },

  // ===== ADDITIONAL MIXED QUESTIONS =====
  {
    id: 'mx-01',
    topic: 'manage-data',
    difficulty: 'hard',
    question: 'Which statement correctly describes a SUM statement (running total)?',
    options: [
      'Implicitly RETAINs the variable and starts at 0',
      'Requires an explicit RETAIN',
      'Can only be used in PROC steps',
      'Can be used with character variables',
    ],
    correctIndex: 0,
    explanation: 'A SUM statement like total + value; automatically RETAINs the variable and starts at 0. Commonly used for running totals and counters.',
    explanationKo: 'total + value; 형태의 SUM statement는 변수를 자동 RETAIN하고 초기값 0에서 시작합니다. 누적 합계, 카운터에 자주 사용됩니다.',
    tags: ['SUM statement', 'RETAIN'],
  },
  {
    id: 'mx-02',
    topic: 'data-structures',
    difficulty: 'medium',
    question: 'What is the relationship between INFILE and INPUT statements?',
    options: [
      'INFILE specifies the raw file; INPUT defines variable reading rules',
      'They have the same function',
      'Files can be read with INPUT alone',
      'INFILE is for PROC steps',
    ],
    correctIndex: 0,
    explanation: 'INFILE specifies the external raw data file path, and INPUT defines column/format rules for reading variables from that file.',
    explanationKo: 'INFILE은 외부 raw data 파일 경로를 지정하고, INPUT은 그 파일에서 변수를 읽는 컬럼/포맷 규칙을 정의합니다.',
    tags: ['INFILE', 'INPUT'],
  },
  {
    id: 'mx-03',
    topic: 'error-handling',
    difficulty: 'medium',
    question: 'What does the NOTE "DATA statement used (real time)" mean?',
    options: [
      'The DATA step completed successfully',
      'The DATA step has errors',
      'Zero observations were created',
      'Syntax check mode is active',
    ],
    correctIndex: 0,
    explanation: 'This NOTE indicates the DATA step completed normally. The parenthetical values show CPU/real time. ERROR messages appear first if there are errors.',
    explanationKo: '이 NOTE는 DATA step가 정상 완료되었음을 나타냅니다. 괄호 안은 CPU/real time입니다. 에러 시에는 ERROR 메시지가 먼저 나옵니다.',
    tags: ['log', 'NOTE'],
  },
  {
    id: 'mx-04',
    topic: 'reports',
    difficulty: 'hard',
    question: 'What is the difference between HAVING and WHERE in PROC SQL?',
    options: [
      'WHERE filters rows before grouping; HAVING filters grouped results',
      'They have the same function',
      'HAVING is for DATA steps',
      'WHERE cannot be used in PROC steps',
    ],
    correctIndex: 0,
    explanation: 'WHERE filters observations before GROUP BY, and HAVING filters aggregated results after GROUP BY.',
    explanationKo: 'WHERE는 GROUP BY 전 observation을 필터링하고, HAVING은 GROUP BY 후 집계 결과를 필터링합니다.',
    tags: ['PROC SQL', 'HAVING', 'WHERE'],
  },
  {
    id: 'mx-05',
    topic: 'manage-data',
    difficulty: 'easy',
    question: 'What is the difference between the CATS and CAT functions?',
    options: [
      'CATS trims blanks between strings before concatenating',
      'CAT concatenates only numbers',
      'No difference',
      'CATS concatenates only numbers',
    ],
    correctIndex: 0,
    explanation: 'CAT concatenates as-is, CATS trims then concatenates, CATT removes trailing spaces only, and CATX concatenates with a delimiter.',
    explanationKo: 'CAT은 그대로 연결, CATS는 trim 후 연결, CATT는 trailing space만 제거, CATX는 구분자로 연결합니다.',
    tags: ['CATS', 'CAT', 'character functions'],
  },
  {
    id: 'mx-06',
    topic: 'data-structures',
    difficulty: 'hard',
    question: 'What is the difference between UPDATE and MERGE statements?',
    options: [
      'UPDATE applies transactions to a master dataset (1:1 or 1:many)',
      'They have the same function',
      'UPDATE is for PROC steps',
      'Only MERGE can use BY',
    ],
    correctIndex: 0,
    explanation: 'UPDATE applies transaction data to a master dataset. When matched by BY variables, transaction values update the master.',
    explanationKo: 'UPDATE는 master 데이터셋에 transaction 데이터를 적용합니다. BY 변수로 match 시 transaction 값으로 업데이트합니다.',
    tags: ['UPDATE', 'MERGE'],
  },
  {
    id: 'mx-07',
    topic: 'manage-data',
    difficulty: 'medium',
    question: 'What is the result type of the MDY(6, 29, 2026) function?',
    options: [
      'A SAS date value (numeric)',
      'Character "29JUN2026"',
      'An error',
      'A missing value',
    ],
    correctIndex: 0,
    explanation: 'MDY(month, day, year) returns a numeric SAS date value. Formatting with DATE9. displays 29JUN2026.',
    explanationKo: 'MDY(month, day, year)는 SAS 날짜 숫자 값을 반환합니다. DATE9. 등 포맷으로 출력하면 29JUN2026이 됩니다.',
    tags: ['MDY', 'date functions'],
  },
  {
    id: 'mx-08',
    topic: 'error-handling',
    difficulty: 'easy',
    question: 'In the basic structure of a SAS program, what separates steps?',
    options: ['Semicolon (;) or a RUN statement', 'Comma (,)', 'Period (.)', 'Slash (/)'],
    correctIndex: 0,
    explanation: 'Each step ends with a semicolon or is terminated with RUN/QUIT. DATA steps and PROC steps are the step units.',
    explanationKo: '각 step은 세미콜론으로 끝나거나 RUN/QUIT으로 종료됩니다. DATA step와 PROC step이 step 단위입니다.',
    tags: ['program structure', 'RUN'],
  },
  {
    id: 'mx-09',
    topic: 'reports',
    difficulty: 'medium',
    question: 'In PROC FREQ, what does the * in TABLES age * gender mean?',
    options: [
      'Cross-tabulation (cross) frequency table',
      'Multiplication',
      'Variable concatenation',
      'Sort order',
    ],
    correctIndex: 0,
    explanation: 'TABLES A * B produces a two-way cross-tabulation. A and B are one-way tables; A * B / C is a three-way table.',
    explanationKo: 'TABLES A * B는 two-way cross-tabulation입니다. A, B는 one-way, A * B / C는 three-way table입니다.',
    tags: ['PROC FREQ', 'TABLES'],
  },
  {
    id: 'mx-10',
    topic: 'manage-data',
    difficulty: 'hard',
    question: 'Which of the following is NOT an automatic variable?',
    options: ['_NAME_', '_N_', '_ERROR_', 'FIRST.id'],
    correctIndex: 0,
    explanation: '_N_ is the observation number, _ERROR_ is the error flag, and FIRST./LAST. are BY-group variables. _NAME_ is created by PROC TRANSPOSE and is not always present as an automatic variable.',
    explanationKo: '_N_은 observation 번호, _ERROR_는 에러 플래그, FIRST./LAST.는 BY 그룹 변수입니다. _NAME_은 PROC TRANSPOSE 등에서 생성되는 변수이지 항상 존재하는 automatic variable은 아닙니다.',
    tags: ['automatic variables', '_N_', '_ERROR_'],
  },
]

export const EXAM_INFO = {
  name: 'SAS Certified Specialist: Base Programming Using SAS 9.4',
  examId: 'A00-231',
  questions: 40,
  minutes: 135,
  passingScore: 725,
  passingLabel: '725 points',
  scoreRange: '200-1000',
  topics: [
    { topic: 'data-structures', weight: '20-25%' },
    { topic: 'manage-data', weight: '35-40%' },
    { topic: 'error-handling', weight: '15-20%' },
    { topic: 'reports', weight: '15-20%' },
  ],
}

export const STUDY_CHECKLIST = [
  { id: 'c1', text: 'Investigate libraries and datasets with LIBNAME and PROC CONTENTS', topic: 'data-structures' },
  { id: 'c2', text: 'Read data with PROC IMPORT and INFILE/INPUT', topic: 'data-structures' },
  { id: 'c3', text: 'Combine datasets with SET, MERGE, and UPDATE', topic: 'data-structures' },
  { id: 'c4', text: 'Control observations and variables with IF/WHERE and KEEP/DROP', topic: 'data-structures' },
  { id: 'c5', text: 'Create and format SAS date values (MDY, INTNX, INTCK)', topic: 'data-structures' },
  { id: 'c6', text: 'RETAIN, SUM statement, FIRST./LAST.', topic: 'manage-data' },
  { id: 'c7', text: 'DO loop, ARRAY, conditional execution', topic: 'manage-data' },
  { id: 'c8', text: 'Character functions (SUBSTR, SCAN, COMPRESS, CATS)', topic: 'manage-data' },
  { id: 'c9', text: 'INPUT/PUT type conversion', topic: 'manage-data' },
  { id: 'c10', text: 'Restructure data with PROC TRANSPOSE', topic: 'manage-data' },
  { id: 'c11', text: 'Read the log (distinguish ERROR, WARNING, NOTE)', topic: 'error-handling' },
  { id: 'c12', text: 'Identify syntax errors vs logic errors', topic: 'error-handling' },
  { id: 'c13', text: 'OPTIONS OBS=0 syntax check', topic: 'error-handling' },
  { id: 'c14', text: 'Missing value handling and invalid data', topic: 'error-handling' },
  { id: 'c15', text: 'PROC PRINT, FREQ, MEANS, REPORT', topic: 'reports' },
  { id: 'c16', text: 'PROC SORT (NODUPKEY, NODUPREC)', topic: 'reports' },
  { id: 'c17', text: 'ODS HTML/PDF output', topic: 'reports' },
  { id: 'c18', text: 'PROC FORMAT, TITLE/FOOTNOTE', topic: 'reports' },
  { id: 'c19', text: 'PROC SQL basics (SELECT, WHERE, JOIN)', topic: 'reports' },
  { id: 'c20', text: 'Complete the official Practice Exam at least once', topic: 'data-structures' },
]

export const BASE_CERT: CertData = {
  id: 'base',
  shortName: 'Base',
  fullName: 'Base Programming Specialist',
  subtitle: 'SAS 9.4 · A00-231',
  color: '#0d6e6e',
  topics: TOPICS,
  questions: applyKoPatches(
    applyMcqUpgrades(
      [...QUESTIONS, ...BASE_EXTRA, ...TRICKY_BASE, ...PREMIUM_BASE, ...EXAM_GRADE_BASE],
      BASE_UPGRADES
    ),
    KO_PATCHES_BASE
  ),
  examInfo: EXAM_INFO,
  checklist: STUDY_CHECKLIST,
}
