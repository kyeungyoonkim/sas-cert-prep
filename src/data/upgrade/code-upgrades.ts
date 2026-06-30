import type { CodeChallenge } from '../codeChallenges'

/**
 * Scenario-based upgrades for code challenges.
 * Merged onto base challenges via applyCodeUpgrades — correctIndex preserves original intent.
 */
export const CODE_UPGRADES: Record<string, Partial<CodeChallenge>> = {
  // ─── BASE (main file) ───
  'cc-b-01': {
    title: 'Student exam scores — dataset size',
    difficulty: 'medium',
    instruction:
      'A teacher enters five student exam scores into a SAS dataset using a DATALINES block. Run the program and check how many rows land in WORK.SCORES — use the Log NOTE or the PROC PRINT listing.',
    hint: 'Search the Log for "The data set WORK.SCORES has N observations" rather than counting DATALINES semicolons.',
    explanation:
      'Step 1: The DATA step reads id and score from five DATALINES rows.\nStep 2: Each dataline becomes one observation in WORK.SCORES.\nStep 3: Five input rows → five observations.',
  },
  'cc-b-02': {
    title: 'Regional sales — SET vertical stack',
    instruction:
      'East and West regional sales teams each maintain separate datasets. An analyst stacks them with SET to build a company-wide report. Run all steps and determine how many rows appear in WORK.COMBINED.',
    hint: 'SET concatenates vertically — add the row counts from EAST and WEST separately.',
    explanation:
      'Step 1: EAST has 2 observations (NYC, BOS).\nStep 2: WEST has 2 observations (LA, SEA).\nStep 3: SET east west stacks them → 2 + 2 = 4 observations in COMBINED.',
  },
  'cc-b-03': {
    title: 'Honor roll cutoff — IF subset',
    instruction:
      'A school keeps only students who scored 88 or above for an honor roll list. Run the filter step and determine how many students remain in WORK.HIGH.',
    hint: 'Walk through each score: does 85 qualify? What about exactly 88?',
    explanation:
      'Step 1: Scores are 85, 92, 71, 88, 95.\nStep 2: IF score >= 88 keeps rows where the condition is true.\nStep 3: id 2 (92), id 4 (88), and id 5 (95) pass → 3 observations.',
  },
  'cc-b-04': {
    title: 'Pass/Fail grading rule',
    instruction:
      'A grading program assigns STATUS based on whether each student\'s score meets the 80-point passing threshold. Run the code and find the STATUS value for the student with id=1.',
    hint: 'Check whether score 85 satisfies the >= 80 condition before the row is written.',
    explanation:
      'Step 1: For id=1, score=85.\nStep 2: 85 >= 80 is true, so STATUS is assigned "Pass".\nStep 3: The first observation in WORK.RESULT shows STATUS=Pass.',
  },
  'cc-b-05': {
    title: 'Daily deposits — running SUM total',
    instruction:
      'A finance clerk tracks cumulative daily deposit amounts using a SUM statement. Run the program and read the TOTAL value on the last observation in WORK.CALC.',
    hint: 'The SUM statement (total + amount;) retains TOTAL across rows — scan PROC PRINT for the final cumulative value.',
    explanation:
      'Step 1: Row 1: total = 10.\nStep 2: Row 2: total = 10 + 20 = 30.\nStep 3: Row 3: total = 30 + 30 = 60 — the last observation shows TOTAL=60.',
  },
  'cc-b-06': {
    title: 'Sensor readings with gaps — missing in IF',
    instruction:
      'Quality control filters sensor readings above 60, but some devices returned missing values. Run the subset step and determine how many valid readings remain in WORK.FILTERED.',
    hint: 'Missing (.) evaluates as false in numeric comparisons — those rows are dropped silently.',
    explanation:
      'Step 1: Values are 50, ., 75, ., 80.\nStep 2: IF value > 60 — missing fails the test; 50 and 75/80 are evaluated.\nStep 3: Only id 3 (75) and id 5 (80) pass → 2 observations.',
  },
  'cc-b-07': {
    title: '10% performance bonus calculation',
    instruction:
      'HR computes a 10% bonus from each employee\'s salary. Run the program and find the BONUS amount for the employee with id=2.',
    hint: 'Locate id=2 in PROC PRINT and verify bonus = salary × 0.1.',
    explanation:
      'Step 1: id=2 has salary=60000.\nStep 2: bonus = salary * 0.1 = 60000 × 0.1.\nStep 3: BONUS = 6000 on observation 2.',
  },
  'cc-b-08': {
    title: 'Fix the INPUT syntax error',
    instruction:
      'A junior programmer submitted this DATA step but it fails in the Log. Fix the syntax error, run successfully, then determine how many observations are created in WORK.FIXED.',
    hint: 'Read the Log ERROR line — SAS statements must end with a semicolon.',
    explanation:
      'Step 1: INPUT x y is missing its trailing semicolon, causing a syntax error.\nStep 2: After fixing to INPUT x y;, two datalines (1 2 and 3 4) are read.\nStep 3: Two observations are created in WORK.FIXED.',
  },
  'cc-b-09': {
    title: 'Team roster — PROC PRINT listing',
    difficulty: 'medium',
    instruction:
      'An HR analyst prints a three-person team roster with PROC PRINT. Run the program and count how many employee data rows appear in the Output window (exclude the column header row).',
    hint: 'PROC PRINT lists one row per observation — match the Output row count to the dataset size.',
    explanation:
      'Step 1: Three datalines create three observations in WORK.TEAM.\nStep 2: PROC PRINT outputs one row per observation.\nStep 3: Three data rows appear below the header.',
  },
  'cc-b-10': {
    title: 'Type A transactions with tax',
    instruction:
      'An accountant filters purchase records to type "A" only and computes a 10% tax on each. Run the pipeline and determine how many rows are written to WORK.FINAL.',
    hint: 'Count how many SOURCE rows have type = "A" — character comparison is case-sensitive.',
    explanation:
      'Step 1: SOURCE has five rows; types A appear at id 1, 3, and 5.\nStep 2: IF type = "A" subsets before TAX is computed.\nStep 3: Three observations with tax values land in WORK.FINAL.',
  },
  'cc-b-11': {
    title: 'Top scorers after 85-point filter',
    instruction:
      'A coach filters athletes scoring at least 85, then reviews the survivors. Run both DATA steps and determine the highest SCORE value still present in WORK.TOP.',
    hint: 'After filtering, compare the remaining SCORE values — two athletes tied at the top.',
    explanation:
      'Step 1: IF score >= 85 drops Amy (78).\nStep 2: Remaining scores: Ben 91, Cara 85, Dan 91.\nStep 3: The maximum SCORE among survivors is 91.',
  },
  'cc-b-12': {
    title: 'Complete the passing-score filter',
    instruction:
      'You inherit a program that should keep only students scoring above 70. Add the missing IF filter, run the code, and determine how many observations remain in WORK.PASS.',
    hint: 'Use IF score > 70; inside the PASS data step — strictly greater than 70, not equal.',
    explanation:
      'Step 1: Scores are 65, 72, 80, 58.\nStep 2: IF score > 70 keeps 72 and 80 only.\nStep 3: Two observations remain in WORK.PASS.',
  },

  // ─── BASE (cc-b-16 to cc-b-19 in main file) ───
  'cc-b-16': {
    title: 'MERGE trap — unmatched LEFT rows survive',
    instruction:
      'Dataset A holds four employee IDs; dataset B has flags for only IDs 1 and 2. After a MERGE BY id, determine how many observations appear in WORK.M — including employees with no match in B.',
    hint: 'MERGE is not SQL INNER JOIN — rows from A with no B match still appear with missing B variables.',
    explanation:
      'Step 1: A contributes ids 1, 2, 3, 4.\nStep 2: B matches ids 1 and 2; ids 3 and 4 get missing flag values.\nStep 3: All four BY groups from A appear → 4 observations.',
  },
  'cc-b-17': {
    title: 'Score filter drops missing values',
    instruction:
      'A recruiter filters candidates with scores above 80, but one applicant\'s score was not recorded. Run the subset step and determine how many candidates remain in WORK.KEEP.',
    hint: 'A missing score (.) is treated as false in IF score > 80 — that applicant is excluded.',
    explanation:
      'Step 1: Scores: 85, ., 90, 75.\nStep 2: Missing fails the > 80 test; 75 also fails.\nStep 3: id 1 (85) and id 3 (90) qualify → 2 observations.',
  },
  'cc-b-18': {
    title: 'WHERE age filter on CLASS data',
    instruction:
      'A summer program accepts students aged 14 and older. The program uses WHERE on the SET statement to subset CLASS records. Run the code and determine how many students qualify in WORK.SUB.',
    hint: 'WHERE age >= 14 includes students exactly 14 — check Ann and Cal.',
    explanation:
      'Step 1: Ages are 14, 13, 15, 12.\nStep 2: WHERE age >= 14 keeps Ann (14) and Cal (15).\nStep 3: Two observations in WORK.SUB.',
  },
  'cc-b-19': {
    title: 'One-to-many MERGE row expansion',
    instruction:
      'HR merges department assignments (one row per employee) with two salary records per employee. Run the MERGE and determine how many rows result in WORK.M.',
    hint: 'When both sides have duplicate BY values, MERGE creates a Cartesian product within each BY group.',
    explanation:
      'Step 1: id 1 has 1 dept row × 2 salary rows = 2 output rows.\nStep 2: id 2 has the same pattern → 2 more rows.\nStep 3: 2 + 2 = 4 observations total.',
  },

  // ─── BASE EXTRA ───
  'cc-b-20': {
    title: 'Team scores with missing — IF filter trap',
    instruction:
      'A manager filters employees with scores above 80 for a bonus list, but one team member has a missing score. Run the pipeline and determine how many employees qualify in WORK.VALID.',
    hint: 'Bob\'s missing score (.) fails IF score > 80 — do not count him even though his dept is listed.',
    explanation:
      'Step 1: Scores: Ann 88, Bob ., Cal 91, Deb 76, Eve 85.\nStep 2: Missing and scores ≤ 80 are dropped.\nStep 3: Ann, Cal, and Eve pass → 3 observations.',
  },
  'cc-b-21': {
    title: 'Three quarterly files — SET stack',
    difficulty: 'medium',
    instruction:
      'Three separate quarterly extracts (A, B, C) must be stacked into one dataset for year-end reporting. Run all steps and determine the final row count in WORK.ALL.',
    hint: 'Add observations from each dataset: A has 1, B has 2, C has 1.',
    explanation:
      'Step 1: Dataset A contributes 1 row.\nStep 2: Dataset B contributes 2 rows; C contributes 1.\nStep 3: SET a b c → 1 + 2 + 1 = 4 observations.',
  },
  'cc-b-22': {
    title: 'Elite tier — score >= 90 filter',
    instruction:
      'A gaming platform tags players scoring 90 or above as elite. Run the filter and determine how many players land in WORK.TOP.',
    hint: 'Only scores of 91 and 95 meet >= 90 — 88 and 82 do not.',
    explanation:
      'Step 1: Scores: 88, 91, 76, 95, 82.\nStep 2: IF score >= 90 keeps id 2 (91) and id 4 (95).\nStep 3: Two observations in WORK.TOP.',
  },
  'cc-b-23': {
    title: 'Pass/Fail at 60-point cutoff',
    instruction:
      'A certification program marks candidates Pass if score >= 60, otherwise Fail. Run the derivation and find the STATUS assigned to id=3.',
    hint: 'Find id=3 in PROC PRINT — score 88 clearly exceeds the 60-point threshold.',
    explanation:
      'Step 1: id=3 has score=88.\nStep 2: 88 >= 60 → STATUS = "Pass".\nStep 3: The third row shows Pass.',
  },
  'cc-b-24': {
    title: 'Three-day sales — cumulative TOTAL',
    instruction:
      'A store tracks running sales totals across three business days using a SUM statement. Run the program and read TOTAL on the last observation in WORK.CALC.',
    hint: 'Watch TOTAL grow row by row: 100, then +250, then +150.',
    explanation:
      'Step 1: Day 1: total = 100.\nStep 2: Day 2: total = 100 + 250 = 350.\nStep 3: Day 3: total = 350 + 150 = 500 on the last row.',
  },
  'cc-b-25': {
    title: 'Employee directory — 1:1 MERGE',
    difficulty: 'medium',
    instruction:
      'Names and ages are stored in separate files keyed by employee ID. Run the MERGE BY id and determine how many complete employee records appear in WORK.JOINED.',
    hint: 'When both datasets have matching BY values with no duplicates, output row count equals the number of shared IDs.',
    explanation:
      'Step 1: NAMES and AGES each have ids 1, 2, 3.\nStep 2: MERGE BY id combines matching rows one-to-one.\nStep 3: Three observations in WORK.JOINED.',
  },
  'cc-b-26': {
    title: 'Course pass list — score >= 60',
    difficulty: 'medium',
    instruction:
      'An instructor exports students who scored at least 60 to a pass list. Run the subset step and determine how many students remain in WORK.PASS.',
    hint: 'Compare each score to 60 — Ben (58) and Dan (45) should be excluded.',
    explanation:
      'Step 1: Scores: Amy 92, Ben 58, Cia 77, Dan 45, Eve 83.\nStep 2: IF score >= 60 keeps Amy, Cia, and Eve.\nStep 3: Three observations in WORK.PASS.',
  },
  'cc-b-27': {
    title: 'Male participants — character IF filter',
    instruction:
      'A study coordinator subsets the demographics file to male participants only. Run the filter and determine how many rows appear in WORK.MALES.',
    hint: 'Character comparison sex = "M" is case-sensitive — count rows where SEX equals capital M.',
    explanation:
      'Step 1: Five subjects: ids 1, 3, 5 are M; ids 2, 4 are F.\nStep 2: IF sex = "M" keeps three rows.\nStep 3: Three observations in WORK.MALES.',
  },
  'cc-b-28': {
    title: 'Generated multiples — DO loop with OUTPUT',
    instruction:
      'A program generates a series of values (i × 5) for i = 1 through 6, writing one row per iteration. Run it and determine how many observations land in WORK.SERIES.',
    hint: 'Each DO iteration hits OUTPUT once — count iterations from 1 TO 6.',
    explanation:
      'Step 1: DO i = 1 TO 6 runs six times.\nStep 2: Each iteration executes OUTPUT, creating one row.\nStep 3: Six observations in WORK.SERIES.',
  },
  'cc-b-29': {
    title: 'North and South city populations — SET',
    instruction:
      'Urban planners combine northern and southern city population tables into one regional dataset. Run the SET step and determine the row count in WORK.BOTH.',
    hint: 'North has 2 cities, South has 1 — SET stacks them vertically.',
    explanation:
      'Step 1: NORTH has 2 observations (Seoul, Busan).\nStep 2: SOUTH has 1 observation (Daegu).\nStep 3: SET north south → 2 + 1 = 3 observations.',
  },
  'cc-b-30': {
    title: '10% sales tax on orders',
    instruction:
      'An e-commerce pipeline computes TAX as 10% of each order amount. Run the program and find the TAX value on the observation where ID=2.',
    hint: 'id=2 has amount=500 — multiply by 0.1 for the tax.',
    explanation:
      'Step 1: id=2, amount=500.\nStep 2: tax = amount * 0.1 = 500 × 0.1.\nStep 3: TAX = 50.',
  },
  'cc-b-31': {
    title: 'Event log — observation counter with SUM',
    instruction:
      'An event-tracking program increments N with a SUM statement (n + 1) across six log entries. Run the code and read the N value on the last observation in WORK.COUNTED.',
    hint: 'The SUM statement accumulates across every row — the last row shows the total count.',
    explanation:
      'Step 1: n + 1 adds 1 on each of six input rows.\nStep 2: N grows 1, 2, 3, 4, 5, 6.\nStep 3: Last observation shows N=6.',
  },
  'cc-b-32': {
    title: 'Deduplicate by ID with FIRST.',
    instruction:
      'Duplicate transaction IDs need deduplication — keep only the first row per ID using BY-group processing. Run the code and determine how many unique IDs remain in WORK.UNIQUE.',
    hint: 'Sort is implicit when BY id is used — IF first.id fires once per new ID value.',
    explanation:
      'Step 1: DUP has ids 1, 1, 2, 2, 3.\nStep 2: IF first.id outputs the first row of each BY group.\nStep 3: Three unique IDs → 3 observations.',
  },
  'cc-b-33': {
    title: 'Full outer MERGE — non-matching keys from both sides',
    instruction:
      'Two tables share some IDs but each has keys the other lacks (id 3 only in LEFT, id 4 only in RIGHT). Run MERGE BY id and determine the total row count in WORK.M.',
    hint: 'MERGE outputs every BY-group value from either table — unmatched rows get missing values on the other side.',
    explanation:
      'Step 1: LEFT ids: 1, 2, 3; RIGHT ids: 1, 2, 4.\nStep 2: All four unique BY values produce output rows.\nStep 3: id 3 has missing B; id 4 has missing A → 4 observations.',
  },
  'cc-b-34': {
    title: 'Adult filter — WHERE age >= 18',
    instruction:
      'A voter-registration subset keeps only people aged 18 or older using WHERE on SET. Run the code and determine how many adults appear in WORK.ADULTS.',
    hint: 'Kim (17) and Park (15) fail; Lee (22), Choi (31), and Jung (19) pass.',
    explanation:
      'Step 1: Ages: 17, 22, 15, 31, 19.\nStep 2: WHERE age >= 18 filters before the DATA step loop.\nStep 3: Three observations in WORK.ADULTS.',
  },
  'cc-b-35': {
    title: 'Two-stage pipeline — dept A then sales cutoff',
    instruction:
      'Sales analysts first filter to department "A", then keep only rows with sales >= 150. Run both steps and determine the final row count in WORK.FINAL.',
    hint: 'Dept A has sales 100, 180, 220 — only the last two meet the 150 threshold.',
    explanation:
      'Step 1: STEP1 keeps dept A rows: 100, 180, 220.\nStep 2: FINAL applies IF sales >= 150 → 180 and 220 survive.\nStep 3: Two observations in WORK.FINAL.',
  },
  'cc-b-36': {
    title: 'Inventory SKU listing — PROC PRINT row count',
    difficulty: 'medium',
    instruction:
      'A warehouse team prints five SKU price records with PROC PRINT. Run the program and count data rows in the Output listing (excluding the header).',
    hint: 'One PROC PRINT row per observation — five datalines means five data rows.',
    explanation:
      'Step 1: Five datalines create five observations in WORK.ITEMS.\nStep 2: PROC PRINT lists each observation as one row.\nStep 3: Five data rows appear below the header.',
  },
  'cc-b-37': {
    title: 'Grade A assignment then subset',
    instruction:
      'Tests are graded A if score >= 90, then only A-grade students are exported. Run both derivation and filter steps and determine how many rows appear in WORK.A_GRADE.',
    hint: 'First derive GRADE, then filter grade = "A" — only Ann (91) and Eve (94) qualify.',
    explanation:
      'Step 1: GRADED assigns A to scores 91 and 94; others get OTHER.\nStep 2: A_GRADE keeps IF grade = "A".\nStep 3: Ann and Eve → 2 observations.',
  },
  'cc-b-38': {
    title: 'Positive readings only — missing fails IF',
    instruction:
      'A health monitor keeps readings strictly greater than zero, but some sensors returned missing values. Run the filter and determine how many rows remain in WORK.VALID.',
    hint: 'Missing (.) fails IF reading > 0 just like zero would — only numeric positives pass.',
    explanation:
      'Step 1: Readings: 120, ., 98, 110, .\nStep 2: Missing values fail the > 0 test.\nStep 3: ids 1, 3, 4 with values 120, 98, 110 pass → 3 observations.',
  },
  'cc-b-39': {
    title: 'Part-to-total percentage',
    instruction:
      'A report computes PCT = (part / total) × 100 for each row. Run the program and find the PCT value on the observation where PART=40.',
    hint: 'Locate PART=40 in PROC PRINT — total is 200 on that row.',
    explanation:
      'Step 1: Row with part=40, total=200.\nStep 2: pct = (40 / 200) * 100.\nStep 3: PCT = 20.',
  },

  // ─── CLINICAL (main file) ───
  'cc-cl-01': {
    title: 'Subject 102 — change from baseline CHG',
    instruction:
      'Subject 102 has two LB rows: baseline score 120 and follow-up 135. The program derives CHG = score − 120. Run the code and find CHG on the follow-up row (last observation).',
    hint: 'CHG is computed on every row — the last row uses score 135 minus the hard-coded baseline 120.',
    explanation:
      'Step 1: Row 1: score=120, chg=0.\nStep 2: Row 2: score=135, chg=135−120.\nStep 3: Last observation CHG = 15.',
  },
  'cc-cl-02': {
    title: 'Demographics DM — enrolled subject count',
    difficulty: 'medium',
    instruction:
      'A clinical trial DM domain lists one row per enrolled subject. Run the program and determine how many subject records exist in WORK.DM.',
    hint: 'Each DATALINES row is one DM observation — check Log NOTE or count PROC PRINT rows.',
    explanation:
      'Step 1: Five datalines (S001–S005) are read into WORK.DM.\nStep 2: One observation per subject.\nStep 3: Five subjects in DM.',
  },
  'cc-cl-03': {
    title: 'Serious adverse events — AE filter',
    instruction:
      'Safety analysts subset the AE domain to serious events only (SERIOUS = "Y"). Run the filter and determine how many AE records remain in WORK.AE.',
    hint: 'Compare each SERIOUS value — three terms are flagged Y in the raw data.',
    explanation:
      'Step 1: Raw AE has five records.\nStep 2: IF serious = "Y" keeps Nausea, Fever, and Fatigue rows.\nStep 3: Three observations in WORK.AE.',
  },
  'cc-cl-04': {
    title: 'Treatment arm revenue — SUM statement total',
    instruction:
      'A summary program accumulates TRT and PLACEBO revenues separately using SUM statements. Run the code and find the TRT_TOT value on the last observation in WORK.SUMS.',
    hint: 'TRT_TOT grows only when arm = "TRT" — trace rows 100, 150, and 50 on the final row.',
    explanation:
      'Step 1: TRT rows contribute 100, 150, 50.\nStep 2: SUM statement trt_tot + rev accumulates across TRT rows only.\nStep 3: Last row TRT_TOT = 100 + 150 + 50 = 300.',
  },
  'cc-cl-05': {
    title: 'Production vs validation row-count QC',
    instruction:
      'Before sign-off, you compare PROD and VAL datasets for row-count parity. Run both PROC PRINT steps and determine whether the datasets match in observation count.',
    hint: 'Count rows in each listing or check Log NOTES — both datasets have identical datalines.',
    explanation:
      'Step 1: PROD has three datalines → 3 observations.\nStep 2: VAL has the same three datalines → 3 observations.\nStep 3: Row counts match — QC passes.',
  },
  'cc-cl-06': {
    title: 'GLUC lab — HIGH flag derivation',
    instruction:
      'Lab values are flagged HIGH when LBVAL exceeds REFHIGH. Run the derivation and count how many observations receive FLAG="HIGH" in WORK.FLAGGED.',
    hint: 'Compare each LBVAL to refhigh 100 — S001 (110) and S003 (120) exceed the limit.',
    explanation:
      'Step 1: REFHIGH = 100 for all subjects.\nStep 2: LBVAL 110 and 120 exceed 100 → FLAG = HIGH.\nStep 3: Two observations flagged HIGH.',
  },

  // ─── CLINICAL EXTRA ───
  'cc-cl-07': {
    title: 'Screen failure subjects — SCRFL filter',
    instruction:
      'Screen failures (SCRFL = "Y") are flagged then exported to a separate dataset. Run the pipeline and determine how many screen-failure subjects appear in WORK.FAILS.',
    hint: 'Three subjects have SCRFL=Y — trace through FLAG derivation then the FAILS subset.',
    explanation:
      'Step 1: S001, S003, S005 have scrfl = "Y".\nStep 2: FLAG = "SCREEN FAIL" for those three.\nStep 3: FAILS keeps three observations.',
  },
  'cc-cl-08': {
    title: 'ALT liver enzyme — toxic grade filter',
    instruction:
      'ALT lab results exceeding REFHIGH are graded TOXIC, then exported. Run all steps and determine how many toxic rows appear in WORK.TOXIC.',
    hint: 'refhigh is 40 — compare ALT values 45, 38, 52, 35, 48 individually.',
    explanation:
      'Step 1: LBVAL > 40 → TOXIC for S001 (45), S003 (52), S005 (48).\nStep 2: S002 and S004 are NORMAL.\nStep 3: Three observations in WORK.TOXIC.',
  },
  'cc-cl-09': {
    title: 'DM enrollment — six-subject roster',
    difficulty: 'medium',
    instruction:
      'A study DM file lists enrolled subjects with age and sex. Run the program and determine how many subject records are in WORK.DM.',
    hint: 'Count PROC PRINT data rows or read the Log NOTE for observation count.',
    explanation:
      'Step 1: Six datalines (S001–S006) create six DM rows.\nStep 2: One row per subject.\nStep 3: Six observations in WORK.DM.',
  },
  'cc-cl-10': {
    title: 'Randomization — treatment arm A subset',
    instruction:
      'Subjects randomized to arm "A" are extracted for an analysis population. Run the filter and determine how many subjects appear in WORK.TRT_A.',
    hint: 'Scan ARM values — S001, S003, S005, S007 are arm A.',
    explanation:
      'Step 1: Seven subjects in RAND.\nStep 2: IF arm = "A" keeps four subjects.\nStep 3: Four observations in WORK.TRT_A.',
  },
  'cc-cl-11': {
    title: 'Visit schedule — running row counter',
    instruction:
      'A visit log tracks five visit records across two subjects. A SUM statement counts rows sequentially. Run the code and find N on the last observation in WORK.VISIT_N.',
    hint: 'n + 1 increments on every row — the fifth row shows the total count.',
    explanation:
      'Step 1: Five visit rows are read in order.\nStep 2: n + 1 accumulates: 1, 2, 3, 4, 5.\nStep 3: Last observation N = 5.',
  },
  'cc-cl-12': {
    title: 'Severe adverse events — two-step AE filter',
    instruction:
      'AE records are classified by severity, then only SEVERE events are exported. Run both steps and determine how many rows appear in WORK.SEV_ONLY.',
    hint: 'Three AEs have severity = "SEVERE" — Nausea, Vomiting, and Fever terms.',
    explanation:
      'Step 1: SEVERE derived for NAUSEA, VOMITING, FEVER rows.\nStep 2: SEV_ONLY subsets sev = "SEVERE".\nStep 3: Three observations.',
  },
  'cc-cl-13': {
    title: 'DM and EX merge — subject dosing records',
    instruction:
      'Demographics (DM) and exposure (EX) datasets share USUBJID. Run the 1:1 MERGE and determine how many combined records appear in WORK.DMEX.',
    hint: 'Three matching USUBJIDs with no duplicates → one output row per subject.',
    explanation:
      'Step 1: DM and EX each have S001, S002, S003.\nStep 2: MERGE BY usubjid combines one-to-one.\nStep 3: Three observations in WORK.DMEX.',
  },
  'cc-cl-14': {
    title: 'BMI obesity flag — subjects >= 30',
    instruction:
      'Vitals BMI is categorized; subjects with BMI >= 30 are flagged OBESE and exported. Run the pipeline and determine how many obese subjects appear in WORK.OBESE.',
    hint: 'Only one subject exceeds 30 — check S003 with BMI 31.2.',
    explanation:
      'Step 1: BMIs: 22.5, 27.8, 31.2, 24.1, 28.5.\nStep 2: Only 31.2 >= 30 → OBESE.\nStep 3: One observation in WORK.OBESE.',
  },
  'cc-cl-15': {
    title: 'First visit per subject — FIRST.usubjid',
    instruction:
      'Visit data has multiple rows per subject. Keep only each subject\'s first visit using BY-group processing. Run the code and determine how many rows appear in WORK.FIRSTVIS.',
    hint: 'IF first.usubjid fires once per USUBJID — S001 and S002 each contribute one row.',
    explanation:
      'Step 1: SV has 5 rows across 2 subjects.\nStep 2: IF first.usubjid keeps SCREEN visit for each subject.\nStep 3: Two observations in WORK.FIRSTVIS.',
  },
  'cc-cl-16': {
    title: 'Prod vs val WEIGHT QC — row-count match',
    difficulty: 'medium',
    instruction:
      'You QC production and validation WEIGHT datasets before submission. Run both listings and determine whether observation counts match.',
    hint: 'Both datasets have identical four-subject datalines — compare row counts side by side.',
    explanation:
      'Step 1: PROD has four WEIGHT records.\nStep 2: VAL has the same four records.\nStep 3: Both have 4 observations — QC passes.',
  },
  'cc-cl-17': {
    title: 'Dose adjustment flag — actual below planned',
    instruction:
      'Dosing records flag subjects whose actual dose fell below planned. Run the pipeline and determine how many dose-adjusted subjects appear in WORK.ADJUSTED.',
    hint: 'Compare actual to planned 100 — S002 (80) and S004 (60) received less than planned.',
    explanation:
      'Step 1: Planned dose is 100 for all subjects.\nStep 2: S002 (80) and S004 (60) get adjfl = "Y".\nStep 3: Two adjusted subjects in WORK.ADJUSTED.',
  },
  'cc-cl-18': {
    title: 'Multi-site enrollment — SET concatenate',
    instruction:
      'Two clinical sites submit separate subject lists that must be stacked for a pooled enrollment count. Run the SET step and determine the total subject count in WORK.ALLSITES.',
    hint: 'Site01 has 2 subjects; site02 has 3 — add the site row counts after SET.',
    explanation:
      'Step 1: SITE01 contributes 2 rows; SITE02 contributes 3 rows.\nStep 2: SET site01 site02 stacks them vertically.\nStep 3: 2 + 3 = 5 observations in WORK.ALLSITES.',
  },

  // ─── ADVANCED (main file) ───
  'cc-ad-01': {
    title: 'Direct assignment — read X2 from WORK.ARR',
    instruction:
      'A DATA step assigns three numeric variables without INPUT. Run the program and find the value of X2 on the single observation in WORK.ARR.',
    hint: 'No INPUT here — X2 is set directly in the DATA step body before RUN.',
    explanation:
      'Step 1: Three assignment statements run on one implicit observation.\nStep 2: x2 = 20 is set directly.\nStep 3: PROC PRINT shows X2 = 20.',
  },
  'cc-ad-02': {
    title: 'DO loop with explicit OUTPUT — row count',
    instruction:
      'A simulation generates five rows by looping i = 1 TO 5 and calling OUTPUT each iteration. Run the program and determine how many observations in WORK.MULTI.',
    hint: 'Each DO iteration calls OUTPUT once — count iterations, not the loop upper bound alone.',
    explanation:
      'Step 1: DO i = 1 TO 5 runs five times.\nStep 2: Each iteration writes one row via OUTPUT.\nStep 3: Five observations in WORK.MULTI.',
  },
  'cc-ad-03': {
    title: 'Demo and scores — MERGE BY id',
    instruction:
      'Student names and exam scores live in separate files keyed by ID. Run MERGE demo scores BY id and determine how many combined rows appear in WORK.MERGED.',
    hint: 'Both inputs share ids 1, 2, 3 with no duplicates — expect one row per matching ID.',
    explanation:
      'Step 1: DEMO has 3 rows; SCORES has 3 rows with matching ids.\nStep 2: MERGE BY id combines one-to-one.\nStep 3: Three observations in WORK.MERGED.',
  },
  'cc-ad-04': {
    title: 'Part-to-total percentage on last row',
    instruction:
      'A report computes PCT = (part / total) × 100 for three datalines. Run the program and find PCT on the last observation.',
    hint: 'Last dataline has part=15, total=60 — compute (15/60)×100.',
    explanation:
      'Step 1: Last row: part=15, total=60.\nStep 2: pct = (15 / 60) * 100.\nStep 3: PCT = 25 on the last observation.',
  },
  'cc-ad-05': {
    title: 'Event stream — global row counter N',
    instruction:
      'An event log uses n + 1 as a SUM statement to count rows as they are read. Run the program and find N on the last observation in WORK.COUNTED.',
    hint: 'N increments on every row — the final row shows the total number of events read.',
    explanation:
      'Step 1: Five event rows are processed sequentially.\nStep 2: n + 1 accumulates 1 through 5.\nStep 3: Last observation N = 5.',
  },
  'cc-ad-06': {
    title: 'First occurrence per ID — dedup with FIRST.',
    instruction:
      'Duplicate IDs in a transaction log should collapse to the first row per ID. Run the BY-group step and determine how many unique IDs remain in WORK.NODUP.',
    hint: 'IF first.id outputs one row per ID group — ids 1, 2, 3 each contribute one row.',
    explanation:
      'Step 1: DUP has ids 1, 1, 2, 2, 3.\nStep 2: IF first.id keeps the first row of each group.\nStep 3: Three observations in WORK.NODUP.',
  },
  'cc-ad-07': {
    title: '2×3 nested DO grid — OUTPUT count',
    instruction:
      'A nested DO loop builds a 2-row by 3-column grid, writing one observation per inner iteration. Run the program and determine how many rows are created in WORK.GRID.',
    hint: 'Multiply outer iterations (2) by inner iterations (3) — each inner loop hits OUTPUT.',
    explanation:
      'Step 1: Outer row = 1 TO 2; inner col = 1 TO 3.\nStep 2: Each inner iteration executes OUTPUT.\nStep 3: 2 × 3 = 6 observations in WORK.GRID.',
  },

  // ─── ADVANCED EXTRA ───
  'cc-ad-08': {
    title: 'Squares 1–5 — last SQ value',
    instruction:
      'A DO loop computes sq = n × n for n = 1 TO 5 with OUTPUT each time. Run the program and find SQ on the last observation in WORK.SQUARES.',
    hint: 'The last iteration has n=5 — sq = 5 × 5.',
    explanation:
      'Step 1: Iterations run n = 1, 2, 3, 4, 5.\nStep 2: Last iteration: n=5.\nStep 3: SQ = 25 on the last row.',
  },
  'cc-ad-09': {
    title: '3×2 nested loop grid size',
    instruction:
      'A nested DO loop (r = 1 TO 3, c = 1 TO 2) writes one row per inner iteration. Run the program and determine the row count in WORK.GRID.',
    hint: 'Total OUTPUT calls = outer count × inner count = 3 × 2.',
    explanation:
      'Step 1: Three outer × two inner = six OUTPUT calls.\nStep 2: Each OUTPUT creates one observation.\nStep 3: Six observations in WORK.GRID.',
  },
  'cc-ad-10': {
    title: 'Demographics and labs — MERGE BY id',
    instruction:
      'Gender and glucose lab results share employee/patient IDs. Run MERGE demo labs BY id and determine the combined row count in WORK.COMBINED.',
    hint: 'Four matching ids with no duplicates → one merged row per id.',
    explanation:
      'Step 1: DEMO and LABS each have ids 1–4.\nStep 2: MERGE BY id combines one-to-one.\nStep 3: Four observations in WORK.COMBINED.',
  },
  'cc-ad-11': {
    title: 'East region — running TOT on last row',
    instruction:
      'East-region amounts are accumulated with a SUM statement (tot + amount). Run the program and read TOT on the last observation in WORK.EAST_TOT.',
    hint: 'Trace TOT row by row: 100, then +150, then +50.',
    explanation:
      'Step 1: Row 1: tot = 100.\nStep 2: Row 2: tot = 250.\nStep 3: Row 3: tot = 300 on the last observation.',
  },
  'cc-ad-12': {
    title: 'DO x=10 TO 14 — explicit OUTPUT row count',
    instruction:
      'A loop generates squared values for x = 10 through 14, OUTPUTting each iteration. Run the program and determine how many rows land in WORK.MULTI.',
    hint: 'Count iterations from 10 TO 14 inclusive — five OUTPUT calls.',
    explanation:
      'Step 1: DO x = 10 TO 14 runs five times.\nStep 2: Each iteration creates one row.\nStep 3: Five observations in WORK.MULTI.',
  },
  'cc-ad-13': {
    title: 'Duplicate BY keys — many-to-many MERGE expansion',
    instruction:
      'Tables A and B both have duplicate id values. Run MERGE a b BY id and determine how many rows appear in WORK.EXPANDED.',
    hint: 'Within each id group, row count = rows in A × rows in B — id 1 has 2×2 combinations.',
    explanation:
      'Step 1: id 1 has 2 rows in A and 2 in B → 2×2 = 4 combinations.\nStep 2: id 2 has 1 row in each → 1 combination.\nStep 3: 4 + 1 = 5 observations in WORK.EXPANDED.',
  },
  'cc-ad-14': {
    title: 'Error log subset — STATUS = "ERR" filter',
    instruction:
      'A batch job log flags failed records with STATUS="ERR". Run the subset step and determine how many error rows remain in WORK.ERRS.',
    hint: 'Scan STATUS values — recnos 3, 5, and 6 are ERR.',
    explanation:
      'Step 1: Six log records; three have status = "ERR".\nStep 2: IF status = "ERR" subsets the dataset.\nStep 3: Three observations in WORK.ERRS.',
  },
  'cc-ad-15': {
    title: 'High earners — WHERE then bonus bump',
    instruction:
      'Payroll keeps employees with salary >= 50000 via WHERE, then computes a 5% bump. Run the step and determine how many rows appear in WORK.BONUS.',
    hint: 'WHERE filters before the DATA step loop — Ann, Cal, and Eve meet the salary cutoff.',
    explanation:
      'Step 1: Salaries: 55000, 42000, 68000, 39000, 72000.\nStep 2: WHERE salary >= 50000 keeps Ann, Cal, Eve.\nStep 3: Three observations in WORK.BONUS.',
  },
  'cc-ad-16': {
    title: 'Ratio from constants — single observation',
    instruction:
      'A DATA step assigns part=25 and whole=100, then computes ratio = (part/whole)×100 with no INPUT. Run the program and find RATIO on the single observation.',
    hint: 'One implicit observation — ratio = (25/100)×100.',
    explanation:
      'Step 1: part=25, whole=100 assigned directly.\nStep 2: ratio = (25 / 100) * 100.\nStep 3: RATIO = 25 on the one row.',
  },
  'cc-ad-17': {
    title: 'Three quarterly SET union — Q1+Q2+Q3 stack',
    difficulty: 'medium',
    instruction:
      'Three quarterly sales extracts (Q1, Q2, Q3) are stacked with SET for a year-end union. Run all steps and determine the row count in WORK.UNION.',
    hint: 'Add Q1 (2 rows) + Q2 (2 rows) + Q3 (1 row) after SET.',
    explanation:
      'Step 1: Q1 has 2 months; Q2 has 2; Q3 has 1.\nStep 2: SET q1 q2 q3 stacks vertically.\nStep 3: UNION has 2 + 2 + 1 = 5 observations.',
  },
}
