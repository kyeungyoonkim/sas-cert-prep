import type { CertId } from './types'

export interface SyllabusObjective {
  id: string
  label: string
  topics: string[]
  weight: string
}

export interface CertSyllabus {
  cert: CertId
  examId: string
  examName: string
  sourceUrl: string
  domains: SyllabusObjective[]
}

/** SAS A00-231 Exam Content Guide */
export const BASE_SYLLABUS: CertSyllabus = {
  cert: 'base',
  examId: 'A00-231',
  examName: 'SAS Certified Specialist: Base Programming Using SAS 9.4',
  sourceUrl:
    'https://www.sas.com/content/dam/SAS/documents/technical/certification/content-guide/specialist-base-programming.pdf',
  domains: [
    {
      id: 'data-structures',
      label: 'Access and Create Data Structures',
      weight: '20-25%',
      topics: ['data-structures'],
    },
    {
      id: 'manage-data',
      label: 'Manage Data',
      weight: '35-40%',
      topics: ['manage-data'],
    },
    {
      id: 'error-handling',
      label: 'Error Handling',
      weight: '15-20%',
      topics: ['error-handling'],
    },
    {
      id: 'reports',
      label: 'Generate Reports and Output',
      weight: '15-20%',
      topics: ['reports'],
    },
  ],
}

/** SAS A00-282 Exam Content Guide */
export const CLINICAL_SYLLABUS: CertSyllabus = {
  cert: 'clinical',
  examId: 'A00-282',
  examName: 'SAS Certified Professional: Clinical Trials Programming Using SAS 9.4',
  sourceUrl:
    'https://www.sas.com/en_us/certification/credentials/foundation-tools/clinical-trials-programming.html',
  domains: [
    { id: 'clinical-process', label: 'Clinical Trials Process', weight: '5%', topics: ['clinical-process'] },
    { id: 'cdisc-structures', label: 'Clinical Trials Data Structures', weight: '10%', topics: ['cdisc-structures'] },
    { id: 'regulatory', label: 'Regulatory Submissions', weight: '5%', topics: ['regulatory'] },
    { id: 'manage-data', label: 'Manage Clinical Trials Data', weight: '5%', topics: ['manage-data'] },
    { id: 'transform-data', label: 'Transform/Summarize Data', weight: '15%', topics: ['transform-data'] },
    { id: 'statistics', label: 'Statistical Procedures', weight: '15%', topics: ['statistics'] },
    { id: 'macro', label: 'Macro Programming', weight: '15%', topics: ['macro'] },
    { id: 'reporting', label: 'Report Results', weight: '10%', topics: ['reporting'] },
    { id: 'validation', label: 'Validate Data Reporting', weight: '20%', topics: ['validation'] },
  ],
}

/** SAS A00-232 Exam Content Guide */
export const ADVANCED_SYLLABUS: CertSyllabus = {
  cert: 'advanced',
  examId: 'A00-232',
  examName: 'SAS Certified Professional: Advanced Programming Using SAS 9.4',
  sourceUrl:
    'https://www.sas.com/content/dam/sasdam/documents/20250124/advanced-programming-sas-94-exam-guide.pdf',
  domains: [
    { id: 'sql', label: 'Accessing Data Using SQL', weight: '35%', topics: ['sql'] },
    { id: 'macro', label: 'Macro Processing', weight: '35%', topics: ['macro'] },
    { id: 'advanced-techniques', label: 'Advanced Techniques', weight: '30%', topics: ['advanced-techniques'] },
  ],
}

const SYLLABI: Record<CertId, CertSyllabus> = {
  base: BASE_SYLLABUS,
  clinical: CLINICAL_SYLLABUS,
  advanced: ADVANCED_SYLLABUS,
}

export function getSyllabus(certId: CertId): CertSyllabus {
  return SYLLABI[certId]
}
