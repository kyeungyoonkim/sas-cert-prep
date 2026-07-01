import type { KoPatch } from '../../lib/applyKoPatches'

export const KO_PATCHES_CLINICAL: Record<string, KoPatch> = {
  // ─── MCQ: ex-cl-01 – ex-cl-12 ───
  'ex-cl-01': {
    explanationKo:
      'Step 1: 각 SDTM domain에는 --SEQ 변수(AESEQ, LBSEQ, CMSEQ)가 있을 수 있습니다. Step 2: USUBJID 내에서 해당 domain의 고유 순번을 제공합니다. Step 3: SEQ 변수는 listing과 review에서 일관된 record ordering을 지원합니다.',
  },
  'ex-cl-02': {
    explanationKo:
      'Step 1: ADSL은 Subject-Level Analysis Dataset입니다. Step 2: subject당 one record로 demographics, treatment, population flags를 포함합니다. Step 3: 다른 모든 ADaM 데이터셋(ADLB, ADAE)은 분석을 위해 ADSL에 merge합니다.',
  },
  'ex-cl-03': {
    explanationKo:
      'Step 1: BDS 구조는 PARAMCD와 PARAM을 code/decode pair로 사용합니다. Step 2: PARAMCD는 짧은 표준 코드(예: ALT)이고, PARAM은 descriptive label입니다. Step 3: 이 pairing은 ADLB, ADVS 및 다른 BDS 데이터셋 전체에서 일관됩니다.',
  },
  'ex-cl-04': {
    explanationKo:
      'Step 1: 세 개 이상 그룹의 mean 비교에는 two-sample t-test가 아니라 ANOVA가 필요합니다. Step 2: PROC GLM은 CLASS 변수와 여러 treatment level을 처리합니다. Step 3: PROC TTEST는 두 그룹에 한정되고, FREQ는 categorical data용입니다.',
  },
  'ex-cl-05': {
    explanationKo:
      'Step 1: %EVAL은 integer 연산을 수행합니다 — 10/3 = 3 (truncated). Step 2: %SYSEVALF는 floating-point math를 지원합니다 — 10/3 = 3.3333. Step 3: macro에서 window calculations나 decimal precision이 중요할 때 %SYSEVALF를 사용합니다.',
  },
  'ex-cl-06': {
    explanationKo:
      'Step 1: CDISC validator는 dataset structure, variable attributes, controlled terminology를 확인합니다.\nStep 2: Pinnacle 21(CDISC ecosystem 일부)은 submission 전 conformance issue를 flag합니다.\nStep 3: eCTD submission을 package하기 전에 validator findings를 해결합니다.',
  },
  'ex-cl-07': {
    explanationKo:
      'Step 1: ITT는 모든 randomized subject를 포함합니다.\nStep 2: 분석은 실제 투여 treatment가 아니라 assigned treatment 기준입니다.\nStep 3: Per Protocol(PP)은 major protocol violation을 제외하는 더 엄격한 subset입니다.',
  },
  'ex-cl-08': {
    explanationKo:
      'Step 1: CSR TLF는 ICH E3 structure의 표준 section numbering을 따릅니다.\nStep 2: Section 14에는 efficacy와 safety tables, listings, figures가 포함됩니다.\nStep 3: Table 14.x.x는 CSR 내 table 위치를 식별합니다 — SAS나 lab code가 아닙니다.',
  },
  'ex-cl-09': {
    explanationKo:
      'Step 1: Validation documentation은 traceable하고 complete해야 합니다.\nStep 2: specs, input datasets, programs, output files, comparison results를 포함합니다.\nStep 3: sign-off 전 discrepancy, root cause, resolution을 문서화합니다.',
  },
  'ex-cl-10': {
    explanationKo:
      'Step 1: SDTM DM은 subject-level — USUBJID당 one row입니다.\nStep 2: duplicate는 mapping error, bad merge, incorrect source data를 시사합니다.\nStep 3: submission 전 조사하고 해결합니다 — duplicate를 정상으로 받아들이지 마세요.',
  },
  'ex-cl-11': {
    explanationKo:
      'Step 1: character visit label은 alphabetically 정렬됩니다 — "Week 10"이 "Week 2"보다 앞에 옵니다.\nStep 2: AVISITN은 올바른 sorting을 위해 numeric order(1, 2, 10)를 제공합니다.\nStep 3: numeric code는 ADaM program의 window comparison과 merge logic을 단순화합니다.',
  },
  'ex-cl-12': {
    explanationKo:
      'Step 1: PROC FREQ는 categorical variable의 frequency table을 생성합니다.\nStep 2: CHISQ option은 2×2 및 더 큰 table에 chi-square statistics를 요청합니다.\nStep 3: treatment와 response처럼 두 categorical variable 간 association에 사용합니다.',
  },

  // ─── Exam-grade MCQ: eg-cl-01 – eg-cl-12 (short form) ───
  'eg-cl-01': {
    explanationKo:
      'USUBJID는 study 내 모든 SDTM domain에서 subject를 연결하는 고유 subject identifier입니다.',
  },
  'eg-cl-02': {
    explanationKo:
      'study drug를 투여받지 않은 randomized subject는 RFSTDTC가 missing입니다. numeric date/time variable에는 missing()을 사용하세요.',
  },
  'eg-cl-03': {
    explanationKo: '3×40=120. 125>120 → flag Y. 경계값 120은 N입니다.',
  },
  'eg-cl-04': {
    explanationKo:
      'PROC COMPARE에서 value diff가 적어도 row-count 불일치는 조사가 필요합니다. filter logic과 sort order를 추적하세요.',
  },
  'eg-cl-05': {
    explanationKo:
      'TRTEMFL logic 전에 ISO 8601 DTC string을 비교 가능한 SAS date value로 parse해야 합니다.',
  },
  'eg-cl-06': {
    explanationKo:
      'define.xml은 submission dataset의 variable metadata, codelist, origin, method를 문서화합니다.',
  },
  'eg-cl-07': {
    explanationKo:
      'baseline visit에서는 보통 CHG가 missing이고, BASE에 이후 visit에 사용할 baseline value가 저장됩니다.',
  },
  'eg-cl-08': {
    explanationKo:
      'submission을 위해 efficacy와 safety를 확인하는 대규모 RCT는 Phase III trial입니다.',
  },
  'eg-cl-09': {
    explanationKo:
      'missing은 측정되지 않음을 의미하고, zero는 임상적 의미가 있는 값입니다(여기서는 비현실적). QC에서 data management에 flag해야 합니다.',
  },
  'eg-cl-10': {
    explanationKo:
      'SAP와 mock shell이 population, method, layout을 정의합니다. program은 해당 spec을 구현합니다.',
  },
  'eg-cl-11': {
    explanationKo:
      'SYMBOLGEN(MPRINT/MLOGIC과 함께)은 debugging 시 macro variable resolution을 추적합니다.',
  },
  'eg-cl-12': {
    explanationKo:
      'LIBNAME XPORT를 통한 SAS V5 transport(XPT)는 tabulation dataset의 classic FDA submission format입니다.',
  },

  // ─── Code challenges: cc-cl-02 – cc-cl-18 ───
  'cc-cl-02': {
    explanationKo:
      'Step 1: 다섯 datalines(S001–S005)가 WORK.DM에 read됩니다.\nStep 2: subject당 one observation.\nStep 3: DM에 5명의 subject.',
  },
  'cc-cl-03': {
    explanationKo:
      'Step 1: raw AE에 5개 record.\nStep 2: IF serious = "Y"는 Nausea, Fever, Fatigue row를 유지.\nStep 3: WORK.AE에 3개 observation.',
  },
  'cc-cl-04': {
    explanationKo:
      'Step 1: TRT row가 100, 150, 50을 기여.\nStep 2: SUM statement trt_tot + rev는 TRT row에서만 누적.\nStep 3: 마지막 row TRT_TOT = 100 + 150 + 50 = 300.',
  },
  'cc-cl-05': {
    explanationKo:
      'Step 1: PROD에 3 datalines → 3 observations.\nStep 2: VAL에 동일한 3 datalines → 3 observations.\nStep 3: row count 일치 — QC pass.',
  },
  'cc-cl-06': {
    explanationKo:
      'Step 1: 모든 subject에 REFHIGH = 100.\nStep 2: LBVAL 110과 120이 100 초과 → FLAG = HIGH.\nStep 3: 2개 observation이 HIGH로 flag.',
  },
  'cc-cl-07': {
    explanationKo:
      'Step 1: S001, S003, S005의 scrfl = "Y".\nStep 2: 세 subject에 FLAG = "SCREEN FAIL".\nStep 3: FAILS에 3개 observation.',
  },
  'cc-cl-08': {
    explanationKo:
      'Step 1: LBVAL > 40 → S001(45), S003(52), S005(48)가 TOXIC.\nStep 2: S002와 S004는 NORMAL.\nStep 3: WORK.TOXIC에 3개 observation.',
  },
  'cc-cl-09': {
    explanationKo:
      'Step 1: 6 datalines(S001–S006)가 6 DM row 생성.\nStep 2: subject당 one row.\nStep 3: WORK.DM에 6 observations.',
  },
  'cc-cl-10': {
    explanationKo:
      'Step 1: RAND에 7 subject.\nStep 2: IF arm = "A"가 4 subject 유지.\nStep 3: WORK.TRT_A에 4 observations.',
  },
  'cc-cl-11': {
    explanationKo:
      'Step 1: 5 visit row가 순서대로 read.\nStep 2: n + 1 누적: 1, 2, 3, 4, 5.\nStep 3: 마지막 observation N = 5.',
  },
  'cc-cl-12': {
    explanationKo:
      'Step 1: NAUSEA, VOMITING, FEVER row에 SEVERE 파생.\nStep 2: SEV_ONLY가 sev = "SEVERE" subset.\nStep 3: 3 observations.',
  },
  'cc-cl-13': {
    explanationKo:
      'Step 1: DM과 EX 모두 S001, S002, S003.\nStep 2: MERGE BY usubjid가 one-to-one 결합.\nStep 3: WORK.DMEX에 3 observations.',
  },
  'cc-cl-14': {
    explanationKo:
      'Step 1: BMI: 22.5, 27.8, 31.2, 24.1, 28.5.\nStep 2: 31.2만 >= 30 → OBESE.\nStep 3: WORK.OBESE에 1 observation.',
  },
  'cc-cl-15': {
    explanationKo:
      'Step 1: SV에 2 subject에 걸쳐 5 row.\nStep 2: IF first.usubjid가 각 subject의 SCREEN visit 유지.\nStep 3: WORK.FIRSTVIS에 2 observations.',
  },
  'cc-cl-16': {
    explanationKo:
      'Step 1: PROD에 4 WEIGHT record.\nStep 2: VAL에 동일한 4 record.\nStep 3: 둘 다 4 observations — QC pass.',
  },
  'cc-cl-17': {
    explanationKo:
      'Step 1: 모든 subject의 planned dose는 100.\nStep 2: S002(80)와 S004(60)가 adjfl = "Y".\nStep 3: WORK.ADJUSTED에 2 adjusted subject.',
  },
  'cc-cl-18': {
    explanationKo:
      'Step 1: SITE01이 2 row, SITE02가 3 row 기여.\nStep 2: SET site01 site02가 vertically stack.\nStep 3: 2 + 3 = 5 observations in WORK.ALLSITES.',
  },
}
