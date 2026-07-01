import type { KoPatch } from '../../lib/applyKoPatches'

export const KO_PATCHES_ADVANCED: Record<string, KoPatch> = {
  // ─── MCQ extra (ex-ad-*) ───
  'ex-ad-01': {
    explanationKo:
      'LEFT JOIN은 왼쪽 테이블의 모든 행을 유지합니다. 오른쪽에 매칭되지 않은 열은 결측값입니다.',
  },
  'ex-ad-02': {
    explanationKo:
      'PROC SQL summary function(CORR, STD, VAR 등)은 숫자 열에 작용하며 GROUP BY와 함께 그룹별 통계를 계산합니다.',
  },
  'ex-ad-03': {
    explanationKo:
      'SELECT ... INTO :macvar는 쿼리 결과를 macro variable에 저장합니다. Advanced 시험의 핵심 SQL/macro 연동 패턴입니다.',
  },
  'ex-ad-04': {
    explanationKo:
      '%NRSTR는 macro quoting function으로, &와 %를 리터럴로 유지하여 macro compile time에 해석되지 않게 합니다. %STR보다 &와 % 처리에 강합니다.',
  },
  'ex-ad-05': {
    explanationKo:
      'CALL SYMPUTX는 선행/후행 공백을 제거하고 macro variable scope(예: LOCAL)를 제어할 수 있어 SYMPUT보다 권장됩니다.',
  },
  'ex-ad-06': {
    explanationKo:
      'automatic macro variable은 실행 컨텍스트를 알려줍니다. &SYSMACRONAME은 현재 실행 중인 macro 이름이며, &SYSDATE, &SYSTIME 등이 있습니다.',
  },
  'ex-ad-07': {
    explanationKo:
      '기본적으로 hash.add()는 중복 key에서 실패(rc≠0)합니다. replace= dataset option이나 .replace() method로 덮어쓰기를 허용할 수 있습니다.',
  },
  'ex-ad-08': {
    explanationKo:
      'PROC FCMP는 catalog에 저장해 재사용할 사용자 정의 function과 subroutine을 정의하는 고급 프로그래밍 기법입니다.',
  },
  'ex-ad-09': {
    explanationKo:
      'UNION은 결과 집합을 연결하고 중복을 제거합니다. UNION ALL은 중복 제거 없이 모든 행을 연결합니다.',
  },
  'ex-ad-10': {
    explanationKo:
      'PROC CONTENTS의 OUT=는 변수 metadata(이름, type, length, label 등)를 데이터셋으로 저장해 프로그래밍 방식으로 처리할 수 있게 합니다.',
  },
  'ex-ad-11': {
    explanationKo:
      'macro %DO loop는 실행 전 SAS 소스 코드를 생성합니다. DATA step DO loop(런타임 반복)와는 다릅니다.',
  },
  'ex-ad-12': {
    explanationKo:
      'correlated subquery는 outer query 열에 의존하며 outer 행마다 평가됩니다. uncorrelated subquery와는 다릅니다.',
  },

  // ─── Exam-grade MCQ (eg-ad-*) ───
  'eg-ad-01': {
    explanationKo:
      'INNER JOIN은 매칭되는 key만 유지합니다. customer가 없는 order는 제외됩니다(약 200건 손실).',
  },
  'eg-ad-02': {
    explanationKo:
      'WHERE는 집계 전 행을 필터링하고, HAVING은 GROUP BY 후 그룹을 필터링합니다.',
  },
  'eg-ad-03': {
    explanationKo:
      'macro variable은 DATA step 컴파일 전에 치환됩니다. 문장은 interest = 1000 * 0.05;가 됩니다.',
  },
  'eg-ad-04': {
    explanationKo:
      'SELECT ... INTO :macvar는 쿼리 결과를 macro variable에 저장합니다.',
  },
  'eg-ad-05': {
    explanationKo:
      'hash object는 작은 table을 한 번 로드하고 transaction 행마다 O(1) lookup을 수행합니다. many-to-one enrichment에 적합합니다.',
  },
  'eg-ad-06': {
    explanationKo:
      '%NRSTR는 macro trigger 문자(&, %)가 macro compile time에 해석되지 않도록 합니다.',
  },
  'eg-ad-07': {
    explanationKo:
      'CALCULATED는 같은 query 내 ORDER BY 등에서 계산된 열을 참조할 수 있게 합니다.',
  },
  'eg-ad-08': {
    explanationKo:
      'EXCEPT는 첫 번째 query에만 있고 두 번째에는 없는 행을 반환합니다(minus 연산).',
  },
  'eg-ad-09': {
    explanationKo:
      '2D array는 m{i,j} 형태입니다. 대각선은 행과 열에 같은 index(i=j)를 사용합니다.',
  },
  'eg-ad-10': {
    explanationKo:
      'SYMPUTX는 값의 공백을 제거하고 symbol table scope option을 지원하며 SYMPUT보다 권장됩니다.',
  },

  // ─── Code challenges (cc-ad-*) ───
  'cc-ad-01': {
    explanationKo:
      'Step 1: 세 개의 assignment statement가 하나의 implicit observation에서 실행됩니다.\nStep 2: x2 = 20이 직접 설정됩니다.\nStep 3: PROC PRINT에서 X2 = 20을 확인합니다.',
  },
  'cc-ad-02': {
    explanationKo:
      'Step 1: DO i = 1 TO 5가 다섯 번 실행됩니다.\nStep 2: 각 iteration에서 OUTPUT으로 한 행을 씁니다.\nStep 3: WORK.MULTI에 5개 observation이 생성됩니다.',
  },
  'cc-ad-03': {
    explanationKo:
      'Step 1: DEMO 3행, SCORES 3행(id 일치).\nStep 2: MERGE BY id로 one-to-one 결합.\nStep 3: WORK.MERGED에 3개 observation.',
  },
  'cc-ad-04': {
    explanationKo:
      'Step 1: 마지막 행: part=15, total=60.\nStep 2: pct = (15 / 60) * 100.\nStep 3: 마지막 observation의 PCT = 25.',
  },
  'cc-ad-05': {
    explanationKo:
      'Step 1: 5개 event 행을 순차 처리합니다.\nStep 2: n + 1이 1부터 5까지 누적됩니다.\nStep 3: 마지막 observation의 N = 5.',
  },
  'cc-ad-06': {
    explanationKo:
      'Step 1: DUP의 id는 1, 1, 2, 2, 3.\nStep 2: IF first.id로 각 BY group의 첫 행만 유지.\nStep 3: WORK.NODUP에 3개 observation.',
  },
  'cc-ad-07': {
    explanationKo:
      'Step 1: 바깥 row = 1 TO 2, 안쪽 col = 1 TO 3.\nStep 2: 안쪽 iteration마다 OUTPUT 실행.\nStep 3: WORK.GRID에 2 × 3 = 6개 observation.',
  },
  'cc-ad-08': {
    explanationKo:
      'Step 1: n = 1, 2, 3, 4, 5로 iteration 실행.\nStep 2: 마지막 iteration에서 n=5.\nStep 3: 마지막 행의 SQ = 25.',
  },
  'cc-ad-09': {
    explanationKo:
      'Step 1: 바깥 3 × 안쪽 2 = OUTPUT 6회.\nStep 2: OUTPUT마다 observation 1개 생성.\nStep 3: WORK.GRID에 6개 observation.',
  },
  'cc-ad-10': {
    explanationKo:
      'Step 1: DEMO와 LABS 모두 id 1–4.\nStep 2: MERGE BY id로 one-to-one 결합.\nStep 3: WORK.COMBINED에 4개 observation.',
  },
  'cc-ad-11': {
    explanationKo:
      'Step 1: 1행: tot = 100.\nStep 2: 2행: tot = 250.\nStep 3: 3행(마지막 observation): tot = 300.',
  },
  'cc-ad-12': {
    explanationKo:
      'Step 1: DO x = 10 TO 14가 다섯 번 실행.\nStep 2: iteration마다 한 행 생성.\nStep 3: WORK.MULTI에 5개 observation.',
  },
  'cc-ad-13': {
    explanationKo:
      'Step 1: id 1은 A 2행, B 2행 → 2×2 = 4 조합.\nStep 2: id 2는 각각 1행 → 1 조합.\nStep 3: WORK.EXPANDED에 4 + 1 = 5개 observation.',
  },
  'cc-ad-14': {
    explanationKo:
      'Step 1: 로그 6건, 3건의 status = "ERR".\nStep 2: IF status = "ERR"로 subset.\nStep 3: WORK.ERRS에 3개 observation.',
  },
  'cc-ad-15': {
    explanationKo:
      'Step 1: 급여: 55000, 42000, 68000, 39000, 72000.\nStep 2: WHERE salary >= 50000 → Ann, Cal, Eve 유지.\nStep 3: WORK.BONUS에 3개 observation.',
  },
  'cc-ad-16': {
    explanationKo:
      'Step 1: part=25, whole=100 직접 할당.\nStep 2: ratio = (25 / 100) * 100.\nStep 3: 한 행의 RATIO = 25.',
  },
  'cc-ad-17': {
    explanationKo:
      'Step 1: Q1 2행, Q2 2행, Q3 1행.\nStep 2: SET q1 q2 q3으로 세로 결합.\nStep 3: UNION에 2 + 2 + 1 = 5개 observation.',
  },
}
