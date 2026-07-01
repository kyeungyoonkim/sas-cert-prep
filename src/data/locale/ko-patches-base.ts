import type { KoPatch } from '../../lib/applyKoPatches'

export const KO_PATCHES_BASE: Record<string, KoPatch> = {
  'ex-ds-02': {
    explanationKo:
      'FILEREF(fileref)는 외부 파일 경로를 반환합니다. LIBNAME/libref는 라이브러리에 대응하는 개념입니다.',
  },
  'ex-ds-04': {
    explanationKo:
      'SAS date 값은 01JAN1960부터 일수를 셉니다. MDY(1,1,1960)은 0을 반환합니다.',
  },
  'ex-md-01': {
    explanationKo:
      'TRIM은 후행 blank를 제거합니다. STRIP은 앞뒤 blank 모두 제거하고, LEFT는 trim 후 왼쪽 정렬합니다.',
  },
  'ex-md-02': {
    explanationKo:
      'SUM statement는 RETAIN을 암시하고 누적 변수를 0으로 초기화합니다.',
  },
  'ex-md-03': {
    explanationKo:
      'FINDC는 첫 문자열에서 두 번째 인수의 문자 중 하나를 찾습니다. 수정자 "i"는 대소문자를 무시합니다.',
  },
  'ex-md-04': {
    explanationKo:
      'TODAY()는 현재 SAS date 숫자를 반환합니다. &SYSDATE는 macro 변수(문자)이지 DATA step 함수가 아닙니다.',
  },
  'ex-md-05': {
    explanationKo:
      'DROP statement 또는 dataset option은 output에서 변수를 제거합니다. step 앞부분에서는 I를 계속 사용할 수 있습니다.',
  },
  'ex-eh-01': {
    explanationKo:
      'WARNING: 실행은 계속됩니다. ERROR: step이 실패했을 가능성이 큽니다. NOTE: 참고 정보.',
  },
  'ex-eh-02': {
    explanationKo:
      'OBS=0은 step을 컴파일한 뒤 observation 0개만 처리합니다 — 대용량 job 문법 검사에 적합합니다.',
  },
  'ex-rp-01': {
    explanationKo:
      'CLASS는 그룹 열을 정의하고, VAR는 분석 변수를 나열합니다. 출력은 통합 요약 table입니다.',
  },
  'ex-rp-02': {
    explanationKo:
      'ODS PDF FILE=은 PDF destination을 엽니다. 완료 후 ODS PDF CLOSE;로 닫습니다.',
  },
  'ex-rp-03': {
    explanationKo:
      'WHERE는 GROUP BY 전에 원본 row를 필터링합니다. HAVING은 집계 후 group을 필터링합니다.',
  },
  'ex-rp-04': {
    explanationKo:
      'NODUPREC는 row의 모든 변수를 비교합니다. NODUPKEY는 BY 변수만 비교합니다.',
  },
  'ex-ds-05': {
    explanationKo:
      'numeric 변수 기본값은 8-byte floating point입니다. character 변수는 지정하지 않으면 length 8입니다.',
  },
  'ex-md-06': {
    explanationKo:
      'LAG(x)는 이전 observation의 x를 반환합니다. 첫 row는 missing입니다. BY-group 리셋은 명시적 logic이 필요합니다.',
  },
  'ex-eh-03': {
    explanationKo:
      '_ERROR_=1은 현재 row의 data 관련 문제(잘못된 input, 변환 오류)를 표시합니다. step은 계속 진행될 수 있습니다.',
  },
  'ex-rp-05': {
    explanationKo:
      'PROC SGPLOT은 VBAR, HBAR, SERIES, SCATTER 등 ODS Graphics plot을 지원합니다.',
  },
  'ex-md-07': {
    explanationKo:
      'CATX(delim, arg1, arg2, …)는 각 인수를 trim하고 non-missing 값 사이에 delimiter를 넣습니다.',
  },

  'trap-b-02': {
    explanationKo:
      'IF 비교에서 numeric 결측값은 false로 평가됩니다. 85와 90만 통과하고, score=.인 row는 제외됩니다.',
  },
  'trap-b-03': {
    explanationKo:
      '비교 전 SAS는 character 값을 저장 길이만큼 blank로 패딩합니다. $5 변수의 "US"는 "US   "이며 literal "US"와 같습니다.',
  },
  'trap-b-04': {
    explanationKo:
      'SUM statement `total + amount;`는 RETAIN을 암시하고 누적합니다. 일반 assignment `total = total + amount`는 RETAIN 없이 매 row total을 missing으로 리셋합니다.',
  },
  'trap-b-05': {
    explanationKo:
      'WHERE는 read 경로에서 더 일찍 subset할 수 있습니다(index/sort된 data에서 특히). IF는 observation이 PDV에 들어온 뒤 적용됩니다.',
  },
  'trap-b-06': {
    explanationKo:
      'IN= flag는 현재 BY group에 어떤 input dataset이 기여했는지 표시합니다. `if ina and inb`는 진짜 match만 유지(inner join)합니다.',
  },
  'trap-b-07': {
    explanationKo:
      'NODUPKEY는 BY 변수로만 중복을 제거하고 BY 조합당 첫 row를 유지합니다. NODUPREC는 모든 변수가 같은 row를 제거합니다.',
  },
  'trap-b-08': {
    explanationKo:
      '_ERROR_는 현재 observation의 data 관련 오류(예: 잘못된 변환)를 표시합니다. 모든 WARNING이나 결측값에서 발생하지는 않습니다.',
  },
  'trap-b-09': {
    explanationKo:
      'numeric date가 결측이어도 특별한 missing format을 쓰지 않으면 표준 결측 표시 "."가 출력됩니다.',
  },
  'trap-b-10': {
    explanationKo:
      '여러 dataset을 SET하면 세로로 연결됩니다: 3 + 3 = 6. MERGE는 BY 변수 기준 horizontal입니다.',
  },
  'trap-b-11': {
    explanationKo:
      'DROP은 output dataset에서 변수를 제외하지만, output 전 DATA step에서 계속 사용할 수 있습니다.',
  },
  'trap-b-12': {
    explanationKo:
      'OBS=0은 step을 컴파일하고 변수 구조를 읽지만 row 0개만 처리합니다 — 문법 검사에 유용합니다.',
  },
  'trap-b-13': {
    explanationKo:
      'PROC FREQ 기본 출력에는 각 category별 frequency, percent, 누적 frequency, 누적 percent가 포함됩니다.',
  },
  'trap-b-14': {
    explanationKo:
      'LAG(x)는 이전 observation의 x를 반환합니다. 첫 row는 이전 값이 없어 missing입니다. BY-group 리셋은 FIRST./LAST.로 명시적 logic이 필요합니다.',
  },
  'trap-b-15': {
    explanationKo:
      'RENAME는 현재 DATA 또는 PROC step에서 변수명을 바꿉니다. CHANGE는 유효한 SAS syntax가 아닙니다.',
  },

  'prem-b-01': {
    explanationKo:
      'Dept A: 100, 180, 220. Sales>=150: 180과 220 → 2 observations.',
  },
  'prem-b-02': {
    explanationKo:
      'MERGE 결과 id 1,1,2,3,4 (5행). FIRST.id는 id당 첫 row → 4 observations.',
  },
  'prem-b-03': {
    explanationKo:
      'WHERE는 read 단계에서 subset할 수 있습니다. IF는 observation이 PDV에 들어온 뒤 적용됩니다.',
  },
  'prem-b-04': {
    explanationKo:
      'FORMAT은 표시만 변경합니다. 기본 numeric 값은 그대로입니다.',
  },
  'prem-b-05': {
    explanationKo:
      '_N_는 DATA step iteration에서 현재 observation 번호입니다.',
  },
  'prem-b-06': {
    explanationKo:
      'NODUPREC는 완전히 같은 duplicate row를 제거합니다. NODUPKEY는 BY 변수만 기준으로 중복을 제거합니다.',
  },
  'prem-b-07': {
    explanationKo:
      'libref.dataset는 permanent library를 참조합니다. WORK dataset은 temporary입니다.',
  },
  'prem-b-08': {
    explanationKo:
      '각 row마다 리셋: total=10, 그다음 total=10+amount=15. 누적이 아닙니다 — SUM statement가 필요합니다.',
  },
  'prem-b-09': {
    explanationKo:
      'INFILE은 외부 파일을 가리킵니다. INPUT은 variable layout을 정의합니다.',
  },
  'prem-b-10': {
    explanationKo:
      'PROC FREQ 기본 출력에는 frequency, percent, 누적 frequency와 percent가 포함됩니다.',
  },
  'prem-b-11': {
    explanationKo:
      'SET A A는 A를 자기 자신과 연결합니다: 3+3=6 observations.',
  },
  'prem-b-12': {
    explanationKo:
      'task당 ~3분이면 여유 시간이 생깁니다. 불확실한 항목은 flag하고 확신 있는 것부터 끝내세요.',
  },

  'eg-b-01': {
    explanationKo:
      'LIBNAME의 libref(FIN.)만 permanent storage를 만듭니다. WORK와 일단계 이름은 temporary입니다. DATA step은 step 안에서 SET보다 앞에 와야 합니다 — Option D는 syntax 순서가 잘못되었습니다.',
  },
  'eg-b-02': {
    explanationKo:
      'PROC CONTENTS는 dataset metadata(변수, type, length, format, label)를 보여줍니다. PROC PRINT는 data 값을 보여주고, FREQ는 categorical summary, SORT는 data를 재정렬합니다.',
  },
  'eg-b-03': {
    explanationKo:
      'NOTE는 성공적으로 읽었음을 확인합니다: observation과 variable 개수. GUESSINGROWS는 import 중 type 추측에 영향을 주지, 읽는 row 수에는 영향을 주지 않습니다. WORK는 여전히 temporary입니다.',
    coachingTip: 'NOTE line = read success. GUESSINGROWS affects types, not row count.',
  },
  'eg-b-04': {
    explanationKo:
      'BY-group counter는 RETAIN, BY statement, FIRST.dept에서 reset이 필요합니다. 일반 assignment는 매 row 리셋됩니다. BY reset 없는 SUM은 파일 전체에 누적됩니다.',
  },
  'eg-b-05': {
    explanationKo:
      'DO loop 각 iteration이 OUTPUT에 도달해 observation 하나를 만듭니다. 3번 iteration → x=10, 20, 30인 3행.',
  },
  'eg-b-06': {
    explanationKo:
      'LENGTH는 첫 참조 전에 와야 character length를 정합니다. PUT은 numeric을 character로 변환합니다. FORMAT은 새 variable의 storage type/length가 아니라 표시를 바꿉니다.',
  },
  'eg-b-07': {
    explanationKo:
      'ERROR는 보통 step이 의도대로 완료되지 않게 합니다 — observation 0개 또는 valid dataset 없음이 흔합니다. WARNING은 실행을 계속 허용합니다. 항상 NOTE observation count를 확인하세요.',
    coachingTip: 'ERROR stops the step; WARNING continues — always check NOTE obs count.',
  },
  'eg-b-08': {
    explanationKo:
      'PROC FREQ는 categorical variable을 요약합니다: distinct value당 한 row와 frequency, percent, 누적 frequency, percent. 모든 input row를 나열하지는 않습니다.',
  },
  'eg-b-09': {
    explanationKo:
      'WHERE 비교에서 결측(.)은 false로 취급됩니다. id 1 (88)과 id 3 (91)만 score > 80을 통과합니다.',
  },
  'eg-b-10': {
    explanationKo:
      'MERGE는 BY group 기준 full outer join입니다. employee 6행 모두 출력되고 emp_id 105–106은 bonus 필드가 결측입니다. 흔한 오답은 4(match만 센 경우)입니다.',
  },
  'eg-b-11': {
    explanationKo:
      'total + amount는 implicit RETAIN이 있는 SUM statement입니다. Running total: 100, 350, 500. 마지막 row = 500.',
    coachingTip: 'var + expr; is SUM statement — implicit RETAIN accumulates.',
  },
  'eg-b-12': {
    explanationKo:
      'NODUPKEY는 BY 변수 중복을 제거하고 BY order에서 첫 row를 유지합니다. NODUPREC는 모든 변수가 같은 row를 제거합니다. PROC SORT에서 WHERE FIRST.는 유효하지 않습니다.',
    coachingTip: 'One row per key → NODUPKEY. Exact duplicate rows → NODUPREC.',
  },
  'eg-b-13': {
    explanationKo:
      'FORMAT은 표시만 변경합니다. 연산과 storage는 기본 numeric 값을 사용합니다.',
    coachingTip: 'FORMAT changes display only — stored value unchanged.',
  },
  'eg-b-14': {
    explanationKo:
      'IN= flag는 현재 row에 어떤 input이 기여했는지 표시합니다. if a and b는 두 dataset 모두에 있는 BY group만 유지합니다 — inner join logic.',
  },
  'eg-b-15': {
    explanationKo:
      'OPTIONS OBS=0은 compilation 후 data processing을 중단합니다 — 대용량 job 문법 검사에 유용합니다. DATA step은 여전히 compile되고 log에 error를 남깁니다.',
    coachingTip: 'OPTIONS OBS=0; = compile-only syntax check on big jobs.',
  },
  'eg-b-16': {
    explanationKo:
      'SAS는 character 값을 storage length까지 padding합니다. $5의 "NY"는 "NY   "이며 literal "NY"와 match됩니다. 첫·둘째 row는 통과하고 "NYC"는 아닙니다.',
    coachingTip: 'SAS pads char values — "NY" in $5 matches literal "NY".',
  },
  'eg-b-17': {
    explanationKo:
      'FIRST.region은 각 REGION group 첫 row에서 1입니다. region 3개 → 출력 observation 3개.',
    coachingTip: 'FIRST.region fires once per REGION group — count groups.',
  },
  'eg-b-18': {
    explanationKo:
      'INFILE은 외부 파일을 가리킵니다(종종 DLM= 또는 DSD). INPUT은 각 field를 읽는 방법을 정의합니다. SET는 기존 SAS dataset을 읽습니다.',
    coachingTip: 'INFILE = file path. INPUT = column layout.',
  },

  'cc-b-03': {
    explanationKo:
      'Step 1: score는 85, 92, 71, 88, 95입니다.\nStep 2: IF score >= 88은 조건이 true인 row만 유지합니다.\nStep 3: id 2 (92), id 4 (88), id 5 (95) 통과 → 3 observations.',
  },
  'cc-b-04': {
    explanationKo:
      'Step 1: id=1, score=85입니다.\nStep 2: 85 >= 80이 true이므로 STATUS에 "Pass"가 할당됩니다.\nStep 3: WORK.RESULT의 첫 observation은 STATUS=Pass입니다.',
  },
  'cc-b-05': {
    explanationKo:
      'Step 1: Row 1: total = 10.\nStep 2: Row 2: total = 10 + 20 = 30.\nStep 3: Row 3: total = 30 + 30 = 60 — 마지막 observation의 TOTAL=60.',
  },
  'cc-b-06': {
    explanationKo:
      'Step 1: 값은 50, ., 75, ., 80입니다.\nStep 2: IF value > 60 — missing은 test 실패; 50과 75/80이 평가됩니다.\nStep 3: id 3 (75)과 id 5 (80)만 통과 → 2 observations.',
  },
  'cc-b-07': {
    explanationKo:
      'Step 1: id=2, salary=60000입니다.\nStep 2: bonus = salary * 0.1 = 60000 × 0.1.\nStep 3: observation 2의 BONUS = 6000.',
  },
  'cc-b-08': {
    explanationKo:
      'Step 1: INPUT x y 뒤에 세미콜론이 없어 syntax error가 발생합니다.\nStep 2: INPUT x y;로 수정하면 dataline 2개(1 2, 3 4)를 읽습니다.\nStep 3: WORK.FIXED에 2 observations가 생성됩니다.',
  },
  'cc-b-09': {
    explanationKo:
      'Step 1: dataline 3개가 WORK.TEAM에 3 observations를 만듭니다.\nStep 2: PROC PRINT는 observation당 한 row를 출력합니다.\nStep 3: header 아래 data row 3개가 나타납니다.',
  },
  'cc-b-10': {
    explanationKo:
      'Step 1: SOURCE에 5행; type A는 id 1, 3, 5에 있습니다.\nStep 2: IF type = "A"는 TAX 계산 전에 subset합니다.\nStep 3: tax 값이 있는 3 observations가 WORK.FINAL에 기록됩니다.',
  },
  'cc-b-11': {
    explanationKo:
      'Step 1: IF score >= 85는 Amy (78)를 제외합니다.\nStep 2: 남은 score: Ben 91, Cara 85, Dan 91.\nStep 3: 생존자 중 최대 SCORE는 91입니다.',
  },
  'cc-b-12': {
    explanationKo:
      'Step 1: score는 65, 72, 80, 58입니다.\nStep 2: IF score > 70은 72와 80만 유지합니다.\nStep 3: WORK.PASS에 2 observations가 남습니다.',
  },
  'cc-b-16': {
    explanationKo:
      'Step 1: A는 id 1, 2, 3, 4를 기여합니다.\nStep 2: B는 id 1, 2와 match; id 3, 4는 flag 값이 missing입니다.\nStep 3: A의 BY group 4개 모두 출력 → 4 observations.',
  },
  'cc-b-17': {
    explanationKo:
      'Step 1: score: 85, ., 90, 75.\nStep 2: missing은 > 80 test 실패; 75도 실패합니다.\nStep 3: id 1 (85)과 id 3 (90)만 통과 → 2 observations.',
  },
  'cc-b-18': {
    explanationKo:
      'Step 1: age는 14, 13, 15, 12입니다.\nStep 2: WHERE age >= 14는 Ann (14)과 Cal (15)를 유지합니다.\nStep 3: WORK.SUB에 2 observations.',
  },
  'cc-b-19': {
    explanationKo:
      'Step 1: id 1은 dept row 1개 × salary row 2개 = output row 2개.\nStep 2: id 2도 같은 패턴 → row 2개 추가.\nStep 3: 2 + 2 = 4 observations.',
  },
  'cc-b-20': {
    explanationKo:
      'Step 1: score: Ann 88, Bob ., Cal 91, Deb 76, Eve 85.\nStep 2: missing과 score ≤ 80은 제외됩니다.\nStep 3: Ann, Cal, Eve 통과 → 3 observations.',
  },
  'cc-b-21': {
    explanationKo:
      'Step 1: dataset A는 1 row를 기여합니다.\nStep 2: dataset B는 2 row, C는 1 row.\nStep 3: SET a b c → 1 + 2 + 1 = 4 observations.',
  },
  'cc-b-22': {
    explanationKo:
      'Step 1: score: 88, 91, 76, 95, 82.\nStep 2: IF score >= 90은 id 2 (91)과 id 4 (95)를 유지합니다.\nStep 3: WORK.TOP에 2 observations.',
  },
  'cc-b-23': {
    explanationKo:
      'Step 1: id=3, score=88입니다.\nStep 2: 88 >= 60 → STATUS = "Pass".\nStep 3: 세 번째 row는 Pass입니다.',
  },
  'cc-b-24': {
    explanationKo:
      'Step 1: Day 1: total = 100.\nStep 2: Day 2: total = 100 + 250 = 350.\nStep 3: Day 3: total = 350 + 150 = 500 — 마지막 row.',
  },
  'cc-b-25': {
    explanationKo:
      'Step 1: NAMES와 AGES 모두 id 1, 2, 3을 가집니다.\nStep 2: MERGE BY id는 match row를 1:1로 결합합니다.\nStep 3: WORK.JOINED에 3 observations.',
  },
  'cc-b-26': {
    explanationKo:
      'Step 1: score: Amy 92, Ben 58, Cia 77, Dan 45, Eve 83.\nStep 2: IF score >= 60은 Amy, Cia, Eve를 유지합니다.\nStep 3: WORK.PASS에 3 observations.',
  },
  'cc-b-27': {
    explanationKo:
      'Step 1: 5명: id 1, 3, 5는 M; id 2, 4는 F.\nStep 2: IF sex = "M"은 3 row를 유지합니다.\nStep 3: WORK.MALES에 3 observations.',
  },
  'cc-b-28': {
    explanationKo:
      'Step 1: DO i = 1 TO 6은 6번 실행됩니다.\nStep 2: 각 iteration마다 OUTPUT이 실행되어 row 하나를 만듭니다.\nStep 3: WORK.SERIES에 6 observations.',
  },
  'cc-b-29': {
    explanationKo:
      'Step 1: NORTH에 2 observations (Seoul, Busan).\nStep 2: SOUTH에 1 observation (Daegu).\nStep 3: SET north south → 2 + 1 = 3 observations.',
  },
  'cc-b-30': {
    explanationKo:
      'Step 1: id=2, amount=500.\nStep 2: tax = amount * 0.1 = 500 × 0.1.\nStep 3: TAX = 50.',
  },
  'cc-b-31': {
    explanationKo:
      'Step 1: n + 1은 input row 6개마다 1을 더합니다.\nStep 2: N은 1, 2, 3, 4, 5, 6으로 증가합니다.\nStep 3: 마지막 observation의 N=6.',
  },
  'cc-b-32': {
    explanationKo:
      'Step 1: DUP의 id는 1, 1, 2, 2, 3.\nStep 2: IF first.id는 각 BY group의 첫 row를 출력합니다.\nStep 3: unique id 3개 → 3 observations.',
  },
  'cc-b-33': {
    explanationKo:
      'Step 1: LEFT id: 1, 2, 3; RIGHT id: 1, 2, 4.\nStep 2: 고유 BY 값 4개 모두 output row를 만듭니다.\nStep 3: id 3은 B missing; id 4는 A missing → 4 observations.',
  },
  'cc-b-34': {
    explanationKo:
      'Step 1: age: 17, 22, 15, 31, 19.\nStep 2: WHERE age >= 18은 DATA step loop 전에 필터링합니다.\nStep 3: WORK.ADULTS에 3 observations.',
  },
  'cc-b-35': {
    explanationKo:
      'Step 1: STEP1은 dept A row 유지: 100, 180, 220.\nStep 2: FINAL에서 IF sales >= 150 → 180과 220만 생존.\nStep 3: WORK.FINAL에 2 observations.',
  },
  'cc-b-36': {
    explanationKo:
      'Step 1: dataline 5개가 WORK.ITEMS에 5 observations를 만듭니다.\nStep 2: PROC PRINT는 observation당 한 row를 나열합니다.\nStep 3: header 아래 data row 5개.',
  },
  'cc-b-37': {
    explanationKo:
      'Step 1: GRADED는 score 91, 94에 A를 할당; 나머지는 OTHER.\nStep 2: A_GRADE는 IF grade = "A"만 유지합니다.\nStep 3: Ann과 Eve → 2 observations.',
  },
  'cc-b-38': {
    explanationKo:
      'Step 1: reading: 120, ., 98, 110, .\nStep 2: missing 값은 > 0 test를 실패합니다.\nStep 3: id 1, 3, 4 (120, 98, 110) 통과 → 3 observations.',
  },
  'cc-b-39': {
    explanationKo:
      'Step 1: part=40, total=200인 row.\nStep 2: pct = (40 / 200) * 100.\nStep 3: PCT = 20.',
  },
}
