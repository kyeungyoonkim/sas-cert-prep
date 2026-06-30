import type { Question } from '../types'

/**
 * Scenario-based exam-quality upgrades for clinical certification questions.
 * Merged onto base questions via applyMcqUpgrades — correctIndex preserves original intent.
 */
export const CLINICAL_UPGRADES: Record<string, Partial<Question>> = {
  'cp-01': {
    title: 'Phase III trial design',
    question:
      'Your sponsor is planning the pivotal study for a new oncology drug. The biostatistician needs a large randomized trial to confirm efficacy and safety before an NDA submission. The protocol team asks you which clinical phase this study represents.\n\nWhich phase best describes this trial?',
    options: [
      'Phase I — initial safety evaluation in a small group of healthy volunteers',
      'Phase III — large-scale randomized controlled trial to confirm efficacy and safety',
      'Phase IV — post-marketing safety surveillance',
      'Preclinical — animal testing only',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: Identify the study goal — confirm efficacy and safety at scale before regulatory submission.\nStep 2: Phase III uses large RCTs for that purpose.\nStep 3: Phase I is first-in-human safety; Phase II explores dose/efficacy in smaller groups; Phase IV is post-approval.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Match phase to study size and purpose — Phase III = pivotal confirmation trial.',
    collections: ['exam-quality'],
    tags: ['clinical phases', 'GCP', 'trial design'],
  },
  'cp-02': {
    title: 'SAP before database lock',
    question:
      'Database lock is two weeks away. The stats lead sends you the finalized Statistical Analysis Plan (SAP) and asks you to build ADaM datasets and TLFs strictly per its specifications. A junior programmer asks what the SAP is actually for.\n\nWhich statement best describes the role of the SAP?',
    options: [
      'It designs raw CRF data collection forms for sites',
      'It pre-specifies statistical methods, endpoints, and analysis populations before unblinded analysis',
      'It contains only SDTM domain mapping rules and variable labels',
      'It lists the FDA eCTD submission folder structure',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: The SAP is finalized before analysis — it locks down methods and populations.\nStep 2: It defines primary/secondary endpoints, analysis sets (ITT, PP), and statistical procedures.\nStep 3: Clinical programmers use the SAP to derive ADaM variables and produce TLFs that match pre-specified analyses.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'SAP drives ADaM derivations and TLF specs — read it before writing analysis code.',
    collections: ['exam-quality'],
    tags: ['SAP', 'clinical process', 'ADaM'],
  },
  'cd-01': {
    title: 'SDTM submission package',
    question:
      'Regulatory affairs requests SDTM datasets for an FDA submission. Your manager assigns you to map CRF data into standard domains (DM, AE, LB, EX) so reviewers can tabulate study data consistently across trials.\n\nWhat is the primary purpose of SDTM in this context?',
    options: [
      'Storing derived analysis variables such as change from baseline',
      'Providing a standardized tabulation data structure for regulatory submission',
      'Holding macro catalog definitions for reusable programs',
      'Serving as a graph-only data format for CSR figures',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: SDTM organizes collected CRF data into CDISC standard domains for submission.\nStep 2: Domains like DM, AE, and LB use standard variable names and structures.\nStep 3: ADaM — not SDTM — holds analysis-ready derived datasets.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'SDTM = tabulation/submission; ADaM = analysis-ready derivations.',
    collections: ['exam-quality'],
    tags: ['SDTM', 'CDISC', 'regulatory submission'],
  },
  'cd-02': {
    title: 'DM domain variable QC',
    question:
      'You are QCing the SDTM DM domain before export to XPT. A colleague added several variables from an ADaM BDS dataset into DM, including AVAL (analysis value).\n\nWhich variable should NOT appear in the SDTM DM domain?',
    options: ['USUBJID', 'AGE', 'AVAL', 'SEX'],
    correctIndex: 2,
    explanation:
      'Step 1: DM stores subject-level demographics and trial enrollment variables.\nStep 2: Standard DM variables include USUBJID, AGE, SEX, and RACE.\nStep 3: AVAL is an ADaM BDS analysis variable — it belongs in analysis datasets, not SDTM DM.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'If you see AVAL, PARAM, or CHG — think ADaM BDS, not SDTM.',
    collections: ['exam-quality'],
    tags: ['SDTM', 'DM domain', 'ADaM'],
  },
  'cd-03': {
    title: 'ADaM derivation principles',
    question:
      'You are building ADaM datasets from locked SDTM. The lead programmer reviews your ADLB and notes that one dataset still stores raw CRF values with no derivations or traceability to source domains.\n\nWhich is NOT a core principle of ADaM?',
    options: [
      'Analysis-ready: immediately usable for statistical analysis',
      'Traceability: derivations traceable back to SDTM source data',
      'One row per subject per parameter (in BDS structure)',
      'Storing raw CRF data as-is without derivation',
    ],
    correctIndex: 3,
    explanation:
      'Step 1: ADaM datasets are derived for analysis — ADSL, BDS, and OCCDS structures.\nStep 2: They must be traceable to SDTM and ready for PROCs used in the SAP.\nStep 3: Raw as-is data belongs in SDTM; ADaM requires purposeful derivations.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'ADaM = derived + traceable + analysis-ready. Never dump raw CRF into ADaM.',
    collections: ['exam-quality'],
    tags: ['ADaM', 'CDISC', 'traceability'],
  },
  'cd-04': {
    title: 'AE domain mapping',
    question:
      'A safety programmer asks you to map verbatim adverse event terms, severity, and start dates from the CRF into the appropriate SDTM domain. The mapping spec references AETERM, AESEV, and AESTDTC.\n\nWhich SDTM domain should receive this data?',
    options: ['LB — Laboratory Test Results', 'AE — Adverse Events', 'EX — Exposure', 'DM — Demographics'],
    correctIndex: 1,
    explanation:
      'Step 1: Adverse event data maps to the AE domain.\nStep 2: Standard AE variables include AETERM (verbatim term), AESEV (severity), and AESTDTC (start date).\nStep 3: LB holds labs, EX holds drug exposure, DM holds demographics.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Match domain abbreviations to content — AE = adverse events.',
    collections: ['exam-quality'],
    tags: ['SDTM', 'AE domain'],
  },
  'rg-01': {
    title: 'XPT export for FDA',
    question:
      'Submission programming must deliver SDTM and ADaM datasets in SAS V5 Transport format (.xpt) to the regulatory folder. Your QC checklist notes constraints on variable name length and file structure.\n\nWhich statement correctly describes SAS V5 Transport files?',
    options: [
      'They support unlimited-length variable names and labels',
      'They are a standard binary format for FDA submission with constraints such as 8-character variable names',
      'They are Excel-compatible CSV files with CDISC headers',
      'They are XML-based define documents describing dataset metadata',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: XPT is the legacy transport format required for many FDA submissions.\nStep 2: It has known limits — 8-character names, label length caps, etc.\nStep 3: Use LIBNAME XPORT or PROC COPY to create XPT; define.xml is separate metadata.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'XPT = transport binary with 8-char name limit. define.xml = metadata, not data.',
    collections: ['exam-quality'],
    tags: ['XPT', 'regulatory submission'],
  },
  'rg-02': {
    title: 'define.xml for reviewers',
    question:
      'After creating submission datasets, you must produce a metadata document describing variable definitions, origins, codelists, and analysis methodology so FDA reviewers can interpret the data. Pinnacle 21 will validate it against the datasets.\n\nWhat is the role of define.xml?',
    options: [
      'Executing and scheduling SAS batch programs',
      'Describing metadata for SDTM/ADaM datasets (variables, codelists, origins, methods)',
      'Performing primary statistical hypothesis tests',
      'Generating SAS log files for validation review',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: define.xml is the CDISC metadata standard for submission datasets.\nStep 2: It documents variables, controlled terminology, derivation methods, and dataset structure.\nStep 3: Validators like Pinnacle 21 cross-check define.xml against the actual datasets.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'define.xml explains what is in the datasets — it does not run analysis.',
    collections: ['exam-quality'],
    tags: ['define.xml', 'CDISC', 'metadata'],
  },
  'md-01': {
    title: 'Metadata QC before merge',
    question:
      'Before merging production and validation copies of ADSL, you need a quick programmatic check of variable names, types, and lengths in both datasets without printing all rows.\n\nWhich PROC SQL dictionary table provides variable-level metadata?',
    options: [
      'dictionary.columns',
      'dictionary.macros',
      'dictionary.graphopts',
      'dictionary.licenses',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: SAS dictionary tables expose metadata via PROC SQL.\nStep 2: dictionary.columns returns name, type, length, format, and label per variable.\nStep 3: Related tables include dictionary.tables and dictionary.members for dataset-level info.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Metadata QC → dictionary.columns in PROC SQL before PROC COMPARE.',
    collections: ['exam-quality'],
    tags: ['DICTIONARY', 'PROC SQL', 'metadata QC'],
  },
  'md-02': {
    title: 'Missing vs zero in lab QC',
    question:
      'During LB data cleaning you find systolic blood pressure values of 0 and missing (.) in the same dataset. The medical monitor insists these must be handled differently in the QC report.\n\nWhy must clinical QC distinguish between missing (.) and zero (0)?',
    options: [
      'SAS treats them identically, so no clinical distinction is needed',
      'Not measured (missing) and an actual recorded value of 0 have different clinical meaning',
      'SAS always converts 0 to missing in numeric comparisons',
      'Missing values are automatically imputed to 0 during DATA step execution',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: Missing means the measurement was not taken or not reported.\nStep 2: Zero may indicate a data entry error for clinical measures like blood pressure.\nStep 3: QC rules must flag implausible zeros separately from legitimate missing data.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Ask "was it measured?" — missing ≠ zero in clinical data review.',
    collections: ['exam-quality'],
    tags: ['data cleaning', 'missing values', 'QC'],
  },
  'tr-01': {
    title: 'Change from baseline derivation',
    question:
      'The SAP specifies a secondary endpoint of change from baseline in HbA1c. You are building ADaM BDS with PARAM, AVAL, BASE, and CHG variables for each post-baseline visit.\n\nWhat is required to calculate change from baseline?',
    options: [
      'Post-baseline analysis value minus the baseline value for the same parameter',
      'The product of baseline and post-baseline values',
      'The last non-missing observation only, ignoring baseline',
      'PROC FREQ on the visit variable',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Identify the baseline value (BASE) for each subject and parameter.\nStep 2: Subtract baseline from the post-baseline analysis value (AVAL).\nStep 3: Store the result in CHG — typically CHG = AVAL - BASE in ADaM BDS.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'CHG = AVAL - BASE. Confirm baseline definition in the SAP first.',
    collections: ['exam-quality'],
    tags: ['change from baseline', 'ADaM', 'BDS'],
  },
  'tr-02': {
    title: 'ISO 8601 date conversion',
    question:
      'Your SDTM mapping program must populate AESTDTC and LBSTDTC as character variables. The data management spec requires dates like 2026-06-29 regardless of internal SAS numeric date storage.\n\nWhy does SDTM use ISO 8601 date format for --DTC variables?',
    options: [
      'It is the SAS internal numeric storage format for dates',
      'It provides a standardized character date/time representation for exchange and regulatory consistency',
      'It is required only for Excel export compatibility',
      'It improves macro compilation and execution speed',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: SDTM --DTC and --STDTC variables are character, not SAS numeric dates.\nStep 2: ISO 8601 (YYYY-MM-DD) ensures consistent exchange across systems and submissions.\nStep 3: Convert between SAS date values and ISO strings carefully during mapping.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'DTC variables are character ISO 8601 — convert from SAS dates with PUT/INPUT functions.',
    collections: ['exam-quality'],
    tags: ['ISO 8601', 'date handling', 'SDTM'],
  },
  'tr-03': {
    title: 'Analysis visit windowing',
    question:
      'Subjects did not always visit on exact protocol schedule days. The SAP defines ±3-day windows around target visit dates to assign lab results to analysis visits (AVISIT) for the primary efficacy table.\n\nWhat is the purpose of analysis visit windowing?',
    options: [
      'Encrypting datasets before regulatory transfer',
      'Mapping measurements within allowed date ranges around protocol visits to analysis visits',
      'Shortening variable names to 8 characters for XPT export',
      'Creating transport files from wide-format lab data',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: Actual visit dates often deviate from the protocol schedule.\nStep 2: Windowing assigns measurements to an AVISIT when the collection date falls within the SAP-defined range.\nStep 3: This standardizes analysis visits for summary tables and statistical models.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Windowing rules live in the SAP — never invent visit windows in code.',
    collections: ['exam-quality'],
    tags: ['windowing', 'AVISIT', 'SAP'],
  },
  'tr-04': {
    title: 'LB wide-to-long reshape',
    question:
      'Raw lab data arrives with one row per subject and columns LBTEST1–LBTEST10 for different analytes. You must produce SDTM LB with one row per subject per lab test (LBTESTCD, LBORRES, LBORRESU).\n\nWhich approach is commonly used for this wide-to-long conversion?',
    options: [
      'PROC SORT only',
      'ARRAY + OUTPUT or PROC TRANSPOSE',
      'PROC FREQ with CHISQ option',
      'LIBNAME XPORT engine',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: SDTM LB requires a long structure — one row per test per subject.\nStep 2: ARRAY with OUTPUT loops across wide columns to emit long rows.\nStep 3: PROC TRANSPOSE is an alternative when pivoting variables to rows.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Wide lab panels → ARRAY/OUTPUT or TRANSPOSE for SDTM long format.',
    collections: ['exam-quality'],
    tags: ['PROC TRANSPOSE', 'ARRAY', 'reshaping', 'LB'],
  },
  'st-01': {
    title: 'Categorical endpoint table',
    question:
      'The SAP requests a summary of treatment-emergent adverse events by System Organ Class and preferred term, with counts and percentages by treatment arm. The statistician confirms this is a categorical frequency analysis.\n\nWhich PROC is most appropriate?',
    options: ['PROC REG', 'PROC FREQ', 'PROC UNIVARIATE (default output)', 'PROC SQL only'],
    correctIndex: 1,
    explanation:
      'Step 1: Categorical summaries need frequency counts and cross-tabulations.\nStep 2: PROC FREQ produces counts, percentages, and supports CHISQ for association tests.\nStep 3: PROC UNIVARIATE and PROC MEANS target continuous variables.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Categorical counts and cross-tabs → PROC FREQ.',
    collections: ['exam-quality'],
    tags: ['PROC FREQ', 'statistics', 'TLF'],
  },
  'st-02': {
    title: 'Two-arm mean comparison',
    question:
      'A secondary endpoint compares mean change in LDL cholesterol between active drug and placebo at Week 12. The SAP specifies an independent two-sample t-test for two treatment groups.\n\nWhich PROC is most appropriate?',
    options: ['PROC FREQ', 'PROC TTEST', 'PROC PRINT', 'PROC CONTENTS'],
    correctIndex: 1,
    explanation:
      'Step 1: Comparing means between two groups calls for a t-test.\nStep 2: PROC TTEST handles independent samples and paired designs.\nStep 3: Three or more groups use PROC GLM; categorical endpoints use PROC FREQ.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Two groups, continuous mean → TTEST. Three+ groups → GLM.',
    collections: ['exam-quality'],
    tags: ['PROC TTEST', 'statistics'],
  },
  'st-03': {
    title: 'GLM OUTPUT dataset',
    question:
      'After running an ANOVA model in PROC GLM for a continuous endpoint across three dose groups, you need to save predicted values and residuals to a SAS dataset for further QC and custom reporting.\n\nWhat can be saved with the OUTPUT statement in PROC GLM?',
    options: [
      'An output dataset containing analysis result statistics, predicted values, and residuals',
      'An XPT transport file for FDA submission',
      'A define.xml metadata document',
      'Macro variables listing all CLASS levels',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: PROC GLM supports OUTPUT OUT=dataset to capture result statistics.\nStep 2: You can save predicted values, residuals, and other keyword statistics.\nStep 3: Similar OUTPUT syntax works in PROC REG and PROC TTEST.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Need model outputs in a dataset? Use OUTPUT OUT= in GLM, REG, or TTEST.',
    collections: ['exam-quality'],
    tags: ['PROC GLM', 'OUTPUT', 'statistics'],
  },
  'st-04': {
    title: 'Continuous variable distribution QC',
    question:
      'Before selecting a parametric test, the statistician asks you to produce descriptive statistics, quantiles, and normality tests for a continuous lab parameter across all subjects.\n\nWhich procedure is most appropriate?',
    options: [
      'PROC UNIVARIATE for distribution and descriptive statistics including normality tests',
      'PROC SORT with NODUPKEY for merging datasets',
      'A macro catalog search with %MACRO',
      'ODS HTML to generate define.xml',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Continuous variable exploration needs mean, median, std, quantiles, and distribution shape.\nStep 2: PROC UNIVARIATE provides comprehensive descriptive stats and normality tests.\nStep 3: PROC MEANS gives summaries but UNIVARIATE is richer for distribution analysis.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Distribution, quantiles, normality → UNIVARIATE for continuous variables.',
    collections: ['exam-quality'],
    tags: ['PROC UNIVARIATE', 'statistics', 'normality'],
  },
  'mc-01': {
    title: 'Macro variable in domain loop',
    question:
      'You are writing a macro that loops over SDTM domains. The program stores the current domain name in a macro variable created with %LET domain=AE; and you need to reference it inside a DATA step.\n\nWhich is the correct syntax for referencing a macro variable?',
    options: ['&varname', '%varname', '$varname', '#varname'],
    correctIndex: 0,
    explanation:
      'Step 1: Macro variables are defined with %LET name=value;.\nStep 2: Reference them with &name in SAS code — e.g., &domain resolves to AE.\nStep 3: %name invokes a macro or macro statement, not a variable reference.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: '& = macro variable value. % = macro call or macro statement.',
    collections: ['exam-quality'],
    tags: ['macro variables', '%LET'],
  },
  'mc-02': {
    title: 'Debugging a TLF macro',
    question:
      'Your ADaM-to-TLF macro produces unexpected row counts. The lead asks you to turn on macro debugging options so the log shows generated SAS code, conditional evaluation, and symbol resolution.\n\nWhich options help debug macro code? (Select the best answer.)',
    options: [
      'MPRINT only',
      'MLOGIC only',
      'SYMBOLGEN only',
      'All of the above — MPRINT, MLOGIC, and SYMBOLGEN together',
    ],
    correctIndex: 3,
    explanation:
      'Step 1: MPRINT shows the SAS code generated by the macro processor.\nStep 2: MLOGIC traces macro condition evaluation (%IF, %DO loops).\nStep 3: SYMBOLGEN shows how macro variables resolve — use all three together for clinical macro debugging.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'OPTIONS MPRINT MLOGIC SYMBOLGEN; is the standard macro debug trio.',
    collections: ['exam-quality'],
    tags: ['MPRINT', 'MLOGIC', 'debugging', 'macro'],
  },
  'mc-03': {
    title: 'Macro parameter in domain builder',
    question:
      'A reusable macro is defined as %MACRO create_lb(domain=, lib=); and called with %create_lb(domain=LB, lib=work); to build the SDTM LB domain.\n\nIn this macro call, what is domain?',
    options: [
      'A macro parameter passed at invocation time',
      'A DATA step variable created during execution',
      'A libref assigned with LIBNAME',
      'An informat applied to a character variable',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: The %MACRO statement declares parameters: domain= and lib=.\nStep 2: The call %create_lb(domain=LB, lib=work) passes LB and work as argument values.\nStep 3: Inside the macro, &domain and &lib reference these parameter values.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Macro call keyword=value pairs populate macro parameters, not DATA step variables.',
    collections: ['exam-quality'],
    tags: ['macro parameters', 'clinical macros'],
  },
  'mc-04': {
    title: '%SYSFUNC for date stamping',
    question:
      'Your validation macro needs today\'s date in an ISO 8601 string at macro compile/execution time — before any DATA step runs. The lead suggests using a macro function to call SAS data functions.\n\nWhat is the role of the %SYSFUNC function?',
    options: [
      'Calling SAS DATA step functions during macro execution',
      'Executing SQL-only functions inside PROC SQL',
      'Creating XPT transport files from macro code',
      'Closing ODS destinations after TLF output',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: %SYSFUNC bridges the macro facility and SAS functions.\nStep 2: Examples: %SYSFUNC(TODAY()), %SYSFUNC(UPCASE(&var)).\nStep 3: This lets you compute values at macro time without a DATA step.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Need PUT, UPCASE, or TODAY() in macro code? Wrap with %SYSFUNC().',
    collections: ['exam-quality'],
    tags: ['%SYSFUNC', 'macro functions'],
  },
  'rp-01': {
    title: 'Patient-level listing',
    question:
      'The CSR appendix requires a report showing every adverse event record for each subject with verbatim terms, dates, and severity — not summary counts. The document shell labels this output as a Listing.\n\nWhat characterizes a clinical Listing?',
    options: [
      'Summary statistics only — means and frequencies by treatment arm',
      'Detailed data at the individual subject/record level',
      'Graphical output only — no tabular data',
      'A define.xml metadata file',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: TLFs comprise Tables, Listings, and Figures.\nStep 2: Listings show patient-level detail — one row per record or event.\nStep 3: Tables summarize data; Figures are graphical (SGPLOT, SGPANEL).',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Listing = row-level detail. Table = aggregated summary. Figure = graph.',
    collections: ['exam-quality'],
    tags: ['TLF', 'listing', 'CSR'],
  },
  'rp-02': {
    title: 'GROUP variable in CSR table',
    question:
      'You are building Demographics Table 14.1.1 with rows for Age, Sex, and Race, and columns for Placebo and Active treatment arms. PROC REPORT needs to group rows and compute N and percentages within each category.\n\nWhat is the role of a GROUP variable in PROC REPORT?',
    options: [
      'Groups rows and displays summaries by group level',
      'Permanently deletes observations from the source dataset',
      'Invokes and executes stored macros',
      'Converts the dataset to XPT transport format',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: DEFINE var / GROUP; tells PROC REPORT to create row groups.\nStep 2: ANALYSIS variables with statistics (N, PCT) fill the column cells.\nStep 3: This pattern is standard for clinical summary tables by treatment arm.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Clinical tables in PROC REPORT: GROUP for row categories, ANALYSIS for stats.',
    collections: ['exam-quality'],
    tags: ['PROC REPORT', 'TLF', 'GROUP'],
  },
  'rp-03': {
    title: 'Efficacy line plot figure',
    question:
      'The SAP includes Figure 14.2.1 — a line plot of mean change from baseline over time by treatment arm. You need a single-panel statistical graph delivered as PDF via ODS.\n\nWhich procedure is appropriate for creating this figure?',
    options: [
      'PROC SGPLOT for single-panel statistical graphs',
      'PROC CONTENTS for SDTM domain mapping',
      'PROC COMPARE for validation',
      'PROC SQL for defining macro variables',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Clinical figures are typically produced with SGPLOT or SGPANEL.\nStep 2: SGPLOT creates single-panel graphs — ideal for line plots by visit.\nStep 3: Output via ODS PDF/RTF for inclusion in the TLF package.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Single-panel figure → SGPLOT. Multi-panel → SGPANEL.',
    collections: ['exam-quality'],
    tags: ['SGPLOT', 'figures', 'TLF'],
  },
  'vl-01': {
    title: 'Independent programming validation',
    question:
      'Your company follows SOP for clinical programming validation. A second programmer must independently recreate ADaM datasets and TLFs from the same specifications, then compare results to production output.\n\nWhat is the core principle of Independent Programming Validation?',
    options: [
      'The same programmer writes and validates their own code',
      'An independent programmer reproduces results with separate code and compares outputs',
      'Reviewing only the SAS log without comparing datasets',
      'Comparing a single sample record by visual inspection',
    ],
    correctIndex: 1,
    explanation:
      'Step 1: Independence means a different programmer writes validation code.\nStep 2: Validation code follows the same spec but is developed separately.\nStep 3: Results are compared programmatically — typically with PROC COMPARE.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Independent = different person + separate code + full output comparison.',
    collections: ['exam-quality'],
    tags: ['validation', 'independent programming'],
  },
  'vl-02': {
    title: 'PROC COMPARE after validation',
    question:
      'Validation programming has finished. You have production ADLB and independent validation ADLB datasets sorted by USUBJID, PARAMCD, and AVISIT. You need to identify any value differences between them.\n\nWhat is the primary use of PROC COMPARE in this context?',
    options: [
      'Comparing variable values between two datasets',
      'Creating Kaplan-Meier survival graphs',
      'Debugging macro symbol resolution',
      'Reading XPT files into SAS libraries',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: PROC COMPARE diffs two datasets variable by variable.\nStep 2: Use ID statement for key variables (USUBJID, PARAMCD, AVISIT).\nStep 3: Use VAR statement to list variables to compare; review the comparison report for discrepancies.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Validation compare: PROC COMPARE with ID= keys and VAR= analysis variables.',
    collections: ['exam-quality'],
    tags: ['PROC COMPARE', 'validation'],
  },
  'vl-03': {
    title: 'Validation log review checklist',
    question:
      'You are signing off validation for an ADaM program. The QA lead asks you to review the validation log before approving. The production run had a clean log with matching observation counts.\n\nWhat must be verified when reviewing logs during validation?',
    options: [
      'No ERROR/WARNING messages, matching observation counts, and expected variables present',
      'Program runtime in seconds only',
      'SAS display manager window dimensions',
      'Macro syntax highlighting color settings',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Check the log for ERROR and WARNING messages — the run must be clean.\nStep 2: Verify observation counts match expectations and production output.\nStep 3: Confirm variable count, names, types, and lengths; then run PROC COMPARE on key values.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Validation sign-off: clean log → obs count → metadata → PROC COMPARE.',
    collections: ['exam-quality'],
    tags: ['log review', 'validation', 'QC checklist'],
  },
  'vl-04': {
    title: 'Independent vs double programming',
    question:
      'Your validation SOP mentions both Independent Programming and Double Programming. A new team member asks how they differ in practice.\n\nWhat is the correct distinction?',
    options: [
      'Independent uses a different programmer with separate code; Double has the same team rewrite from the same spec and compare',
      'There is no practical difference between the two methods',
      'Double programming only reviews the SAS log without comparing results',
      'Independent programming does not require comparing outputs',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Both methods aim to verify correctness by comparing results.\nStep 2: Independent programming uses a separate programmer writing independent code.\nStep 3: Double programming typically involves two programmers implementing the same spec — independent is more common in regulated clinical settings.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Both compare results — the difference is who writes the validation code.',
    collections: ['exam-quality'],
    tags: ['validation methods', 'independent programming'],
  },
  'ex-cl-01': {
    title: 'AESEQ ordering in SDTM',
    question:
      'While building the SDTM AE domain, you need a variable to uniquely order multiple adverse event records per subject for submission and review. The mapping spec calls for AESEQ.\n\nWhat does the --SEQ variable (e.g., AESEQ) typically represent in SDTM?',
    options: [
      'Sequence number to order related records within a subject in a domain',
      'SQL query execution order in PROC SQL',
      'Macro %DO loop iteration counter',
      'Randomization seed for treatment assignment',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Each SDTM domain can have a --SEQ variable (AESEQ, LBSEQ, CMSEQ).\nStep 2: It provides a unique sequence number within USUBJID for that domain.\nStep 3: SEQ variables support consistent record ordering in listings and review.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: '--SEQ = within-subject record order in a domain. Not related to SQL or macros.',
    collections: ['exam-quality'],
    tags: ['SDTM', 'sequence variables', 'AESEQ'],
  },
  'ex-cl-02': {
    title: 'ADSL subject-level structure',
    question:
      'You are starting ADaM development. The statistician needs one row per subject with treatment arm, analysis flags (ITTFL, SAFFL), and key demographics merged from SDTM DM and DS for all BDS datasets.\n\nWhat is ADSL primarily used for?',
    options: [
      'Subject-level analysis dataset with one row per subject',
      'Laboratory results in BDS long format only',
      'Adverse event verbatim terms in OCCDS structure',
      'Define.xml metadata documentation',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: ADSL is the Subject-Level Analysis Dataset.\nStep 2: It contains one record per subject with demographics, treatment, and population flags.\nStep 3: All other ADaM datasets (ADLB, ADAE) merge to ADSL for analysis.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'ADSL = one row per subject. Start here before building BDS datasets.',
    collections: ['exam-quality'],
    tags: ['ADSL', 'ADaM', 'subject-level'],
  },
  'ex-cl-03': {
    title: 'PARAMCD in ADLB',
    question:
      'You are building ADLB from SDTM LB. Each row needs a short standard code identifying the lab analyte (e.g., ALT, GLUC) alongside the full parameter label in PARAM.\n\nWhat does PARAMCD store in ADaM BDS?',
    options: [
      'Short code identifying the analysis parameter',
      'Patient initials from the enrollment log',
      'Protocol amendment version number',
      'SAS format name applied to AVAL',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: BDS structure uses PARAMCD and PARAM as a code/decode pair.\nStep 2: PARAMCD is the short standard code (e.g., ALT); PARAM is the descriptive label.\nStep 3: This pairing is consistent across ADLB, ADVS, and other BDS datasets.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'PARAMCD = short code. PARAM = label. Both required in BDS.',
    collections: ['exam-quality'],
    tags: ['ADaM', 'BDS', 'PARAMCD'],
  },
  'ex-cl-04': {
    title: 'ANOVA across dose groups',
    question:
      'The SAP specifies an ANOVA for a continuous efficacy endpoint across four dose groups (Placebo, Low, Medium, High). You need a procedure that handles a CLASS variable with more than two levels.\n\nWhich procedure is appropriate for comparing means across 3+ treatment groups?',
    options: ['PROC GLM', 'PROC FREQ only', 'PROC PRINT', 'PROC CONTENTS'],
    correctIndex: 0,
    explanation:
      'Step 1: Three or more group means require ANOVA, not a two-sample t-test.\nStep 2: PROC GLM handles CLASS variables and multiple treatment levels.\nStep 3: PROC TTEST is limited to two groups; FREQ is for categorical data.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: '3+ group mean comparison → GLM. Two groups → TTEST.',
    collections: ['exam-quality'],
    tags: ['PROC GLM', 'ANOVA', 'statistics'],
  },
  'ex-cl-05': {
    title: '%SYSEVALF vs %EVAL in window calc',
    question:
      'Your macro calculates a visit window midpoint as 10/3 days. Using %EVAL(10/3) returns 3, but the SAP requires 3.3333 for the window boundary.\n\nWhy does %SYSEVALF(10/3) differ from %EVAL(10/3)?',
    options: [
      '%SYSEVALF performs floating-point evaluation; %EVAL truncates to integers',
      '%SYSEVALF only works on character strings',
      '%EVAL handles decimal arithmetic natively',
      'They produce identical results for all expressions',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: %EVAL performs integer arithmetic — 10/3 = 3 (truncated).\nStep 2: %SYSEVALF supports floating-point math — 10/3 = 3.3333.\nStep 3: Use %SYSEVALF when window calculations or decimal precision matter in macros.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Integer math in macros → %EVAL. Decimals → %SYSEVALF.',
    collections: ['exam-quality'],
    tags: ['%SYSEVALF', '%EVAL', 'macro'],
  },
  'ex-cl-06': {
    title: 'Pinnacle 21 before submission',
    question:
      'Before sending SDTM and ADaM datasets to the FDA, your team runs a validator that checks datasets against CDISC conformance rules and cross-references define.xml.\n\nWhat is Pinnacle 21 (CDISC Open Rules Engine) commonly used for?',
    options: [
      'Validating SDTM/ADaM datasets against CDISC standards before regulatory submission',
      'Running PROC REG for regression analysis',
      'Creating and cataloging SAS macros',
      'Scheduling clinical site monitoring visits',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: CDISC validators check dataset structure, variable attributes, and controlled terminology.\nStep 2: Pinnacle 21 (now part of the CDISC ecosystem) flags conformance issues before submission.\nStep 3: Resolve validator findings before packaging the eCTD submission.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Pre-submission QC: run the CDISC validator before burning XPT files.',
    collections: ['exam-quality'],
    tags: ['validation tools', 'CDISC', 'Pinnacle 21'],
  },
  'ex-cl-07': {
    title: 'ITT population flag',
    question:
      'The SAP defines the primary efficacy analysis on the Intent-to-Treat (ITT) population. You must set ITTFL in ADSL so all randomized subjects are analyzed according to their assigned treatment, regardless of compliance.\n\nWho does the ITT population typically include?',
    options: [
      'All randomized subjects analyzed by assigned treatment arm',
      'Only subjects who completed the full study protocol',
      'Only subjects with no protocol deviations of any kind',
      'Healthy volunteers from Phase I studies only',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: ITT includes all randomized subjects.\nStep 2: Analysis is by assigned treatment, not actual treatment received.\nStep 3: Per Protocol (PP) is a stricter subset excluding major protocol violations.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'ITT = all randomized, as assigned. PP = completers without major deviations.',
    collections: ['exam-quality'],
    tags: ['analysis populations', 'ITT', 'ADSL'],
  },
  'ex-cl-08': {
    title: 'CSR table numbering',
    question:
      'The medical writer provides shell tables labeled "Table 14.3.1" and "Table 14.3.2" for the Clinical Study Report efficacy section. You must match these numbers in your PROC REPORT output headers.\n\nIn clinical TLFs, what does "Table 14.x.x" usually refer to?',
    options: [
      'Numbered summary tables in the CSR following ICH document structure',
      'The SAS version number used for programming',
      'Laboratory panel codes from the central lab',
      'Macro catalog entry identifiers',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: CSR TLFs follow ICH E3 structure with standardized section numbering.\nStep 2: Section 14 contains efficacy and safety tables, listings, and figures.\nStep 3: Table 14.x.x identifies the table position within the CSR — not SAS or lab codes.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Table 14.x.x = CSR ICH numbering. Match shells exactly in titles.',
    collections: ['exam-quality'],
    tags: ['TLF', 'CSR', 'ICH E3'],
  },
  'ex-cl-09': {
    title: 'Validation documentation package',
    question:
      'QA is auditing the validation package for a primary efficacy table program. They request documentation beyond the SAS log showing what was compared and any discrepancies found.\n\nWhat should a validation log/document include?',
    options: [
      'Inputs, outputs, comparison results, and documented discrepancies with resolution',
      'Only the programmer\'s name and sign-off date',
      'Only total program runtime in seconds',
      'Only the color theme used in the SAS display manager',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Validation documentation must be traceable and complete.\nStep 2: Include specs, input datasets, programs, output files, and comparison results.\nStep 3: Document any discrepancies, root cause, and resolution before sign-off.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Audit-ready validation = inputs + programs + outputs + compare + issue log.',
    collections: ['exam-quality'],
    tags: ['validation', 'documentation', 'QA'],
  },
  'ex-cl-10': {
    title: 'Duplicate USUBJID in DM',
    question:
      'During SDTM DM QC you run a duplicate check and find two rows with the same USUBJID but different SITEID values. DM should have exactly one row per subject.\n\nWhat do duplicate USUBJID values in DM most likely indicate?',
    options: [
      'A data integrity issue requiring investigation — DM should be one row per subject',
      'Expected behavior for all multi-site trials',
      'A successful one-to-many MERGE by design',
      'Proof that randomization was performed correctly',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: SDTM DM is subject-level — one row per USUBJID.\nStep 2: Duplicates suggest a mapping error, bad merge, or incorrect source data.\nStep 3: Investigate and resolve before submission — do not accept duplicates as normal.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'DM duplicate USUBJID = red flag. Always investigate before proceeding.',
    collections: ['exam-quality'],
    tags: ['QC', 'DM', 'USUBJID', 'data integrity'],
  },
  'ex-cl-11': {
    title: 'AVISITN for sort and window logic',
    question:
      'Your windowing macro assigns analysis visits but sorts fail when using character AVISIT values like "Week 10" and "Week 2". The lead suggests adding AVISITN as a numeric visit code.\n\nWhy is AVISITN (numeric visit) often preferred over AVISIT (character)?',
    options: [
      'Numeric visit codes simplify sorting, windowing, and merge logic in analysis datasets',
      'AVISITN is required for all FDA XPT exports by regulation',
      'AVISITN automatically deletes subjects with protocol deviations',
      'Character AVISIT is prohibited in ADaM datasets',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: Character visit labels sort alphabetically — "Week 10" before "Week 2".\nStep 2: AVISITN provides a numeric order (1, 2, 10) for correct sorting.\nStep 3: Numeric codes simplify window comparisons and merge logic in ADaM programs.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Use AVISITN for sort/order logic; keep AVISIT for display in TLFs.',
    collections: ['exam-quality'],
    tags: ['AVISIT', 'AVISITN', 'windowing'],
  },
  'ex-cl-12': {
    title: 'Chi-square for treatment by response',
    question:
      'The SAP requests a chi-square test of association between treatment arm and responder status (Yes/No) for a secondary binary endpoint. You need cross-tabulation counts with a statistical test.\n\nWhat does PROC FREQ with the CHISQ option provide?',
    options: [
      'Chi-square test for association in cross-tabulations',
      'Independent two-sample t-test for means',
      'Regression coefficients from a linear model',
      'Kaplan-Meier survival curves with log-rank test',
    ],
    correctIndex: 0,
    explanation:
      'Step 1: PROC FREQ creates frequency tables for categorical variables.\nStep 2: The CHISQ option requests chi-square statistics for 2×2 and larger tables.\nStep 3: Use this for association between two categorical variables like treatment and response.',
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: 'Categorical association test → PROC FREQ / CHISQ. Means → TTEST or GLM.',
    collections: ['exam-quality'],
    tags: ['PROC FREQ', 'CHISQ', 'statistics'],
  },
}
