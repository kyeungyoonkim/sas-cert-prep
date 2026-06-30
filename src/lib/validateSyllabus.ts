import type { CertId } from '../data/types'
import { getBankProblems } from '../data/bank'
import { getStudyPath } from '../data/studyPath'
import { getSyllabus } from '../data/syllabus'
import { BASE_CERT } from '../data/base'
import { CLINICAL_CERT } from '../data/clinical'
import { ADVANCED_CERT } from '../data/advanced'
import { runSasCode } from './sasSimulator'
import { validateCodeChallenges, type ValidationIssue } from './validateBank'

function optionMatchesValue(option: string, value: string | number): boolean {
  const opt = option.toLowerCase().replace(/[^a-z0-9.]/g, '')
  const val = String(value).toLowerCase()
  if (opt === val) return true
  if (opt.includes(val) || val.includes(opt)) return true
  const numOpt = Number(option.replace(/[^\d.]/g, ''))
  if (!Number.isNaN(numOpt) && numOpt === value) return true
  return false
}

function parseObsCountFromLog(log: string[]): number | null {
  const notes = log.filter((l) => /has \d+ observations/i.test(l))
  if (!notes.length) return null
  const m = notes[notes.length - 1].match(/has (\d+) observations/i)
  return m ? Number(m[1]) : null
}

function countListingRows(listing: string[]): number {
  return listing.filter((l) => /^\s*\d+/.test(l)).length
}

export function validateMcqWithCode(certId?: CertId): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const certs: CertId[] = certId ? [certId] : ['base', 'clinical', 'advanced']

  for (const cert of certs) {
    for (const p of getBankProblems(cert)) {
      if (p.kind !== 'mcq' || !p.code) continue
      const q = `${p.question} ${p.title ?? ''}`.toLowerCase()
      const isObsCountQ =
        q.includes('how many observation') ||
        q.includes('observations are in') ||
        q.includes('observations does') ||
        q.includes('rows in work') ||
        q.includes('rows are in') ||
        (q.includes('how many rows') && !q.includes('value'))
      if (!isObsCountQ) continue
      if (!/datalines;/i.test(p.code)) continue
      if (/\bfirst\.\w+|\blast\.\w+/i.test(p.code)) continue

      const result = runSasCode(p.code)
      if (result.errors.length) {
        issues.push({
          id: p.id,
          severity: 'warn',
          message: `MCQ code simulator errors: ${result.errors.join('; ')}`,
        })
        continue
      }

      const expected = p.options[p.correctIndex]
      const obs = parseObsCountFromLog(result.log)
      const rows = countListingRows(result.listing)
      const count = obs ?? rows
      if (count !== null && count > 0 && !optionMatchesValue(expected, count)) {
        issues.push({
          id: p.id,
          severity: 'error',
          message: `MCQ obs count ${count} ≠ answer "${expected}" (index ${p.correctIndex})`,
        })
      }
    }
  }

  return issues
}

export function validateStudyPathIds(certId?: CertId): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const certs: CertId[] = certId ? [certId] : ['base', 'clinical', 'advanced']

  for (const cert of certs) {
    const bank = new Map(getBankProblems(cert).map((p) => [p.id, p]))
    for (const module of getStudyPath(cert)) {
      for (const id of module.problemIds) {
        const problem = bank.get(id)
        if (!problem) {
          issues.push({
            id: module.id,
            severity: 'error',
            message: `Missing problem "${id}" in ${cert} bank`,
          })
        } else if (problem.cert !== cert) {
          issues.push({
            id: module.id,
            severity: 'error',
            message: `"${id}" is ${problem.cert}, not ${cert}`,
          })
        }
      }
    }
  }

  return issues
}

export function validateSyllabusCoverage(certId: CertId): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const pathIds = new Set(getStudyPath(certId).flatMap((m) => m.problemIds))
  const bank = getBankProblems(certId)

  for (const domain of getSyllabus(certId).domains) {
    const topicSet = new Set(domain.topics)
    const domainTotal = bank.filter((p) => topicSet.has(p.topic)).length
    const pathTotal = bank.filter((p) => topicSet.has(p.topic) && pathIds.has(p.id)).length

    if (domainTotal < 3) {
      issues.push({
        id: `${certId}:${domain.id}`,
        severity: 'warn',
        message: `Only ${domainTotal} bank problems (want ≥3)`,
      })
    }
    if (pathTotal < 3) {
      issues.push({
        id: `${certId}:${domain.id}`,
        severity: 'warn',
        message: `Only ${pathTotal} study-path problems (want ≥3)`,
      })
    }
  }

  return issues
}

export function validateMcqStructure(certId?: CertId): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const certs: CertId[] = certId ? [certId] : ['base', 'clinical', 'advanced']

  for (const cert of certs) {
    for (const p of getBankProblems(cert)) {
      if (p.kind !== 'mcq') continue
      if (p.options.length !== 4) {
        issues.push({ id: p.id, severity: 'error', message: `Has ${p.options.length} options` })
      }
      if (p.correctIndex < 0 || p.correctIndex >= p.options.length) {
        issues.push({ id: p.id, severity: 'error', message: `Bad correctIndex ${p.correctIndex}` })
      }
    }
  }

  return issues
}

export function validateExamInfoAlignment(): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const pairs = [
    { cert: BASE_CERT, syllabus: getSyllabus('base') },
    { cert: CLINICAL_CERT, syllabus: getSyllabus('clinical') },
    { cert: ADVANCED_CERT, syllabus: getSyllabus('advanced') },
  ]

  for (const { cert, syllabus } of pairs) {
    if (cert.examInfo.examId !== syllabus.examId) {
      issues.push({
        id: cert.id,
        severity: 'error',
        message: `examId ${cert.examInfo.examId} ≠ ${syllabus.examId}`,
      })
    }
    const examTopics = new Set(cert.examInfo.topics.map((t) => t.topic))
    for (const d of syllabus.domains) {
      for (const t of d.topics) {
        if (!examTopics.has(t)) {
          issues.push({
            id: cert.id,
            severity: 'error',
            message: `Topic "${t}" missing from examInfo`,
          })
        }
      }
    }
  }

  return issues
}

export function runFullValidation(): ValidationIssue[] {
  return [
    ...validateCodeChallenges(),
    ...validateMcqWithCode(),
    ...validateStudyPathIds(),
    ...validateMcqStructure(),
    ...validateExamInfoAlignment(),
    ...validateSyllabusCoverage('base'),
    ...validateSyllabusCoverage('clinical'),
    ...validateSyllabusCoverage('advanced'),
  ]
}

export function formatSyllabusReport(certId: CertId): string {
  const syllabus = getSyllabus(certId)
  const bank = getBankProblems(certId)
  const pathIds = new Set(getStudyPath(certId).flatMap((m) => m.problemIds))
  const lines = [`\n=== ${syllabus.examId} Syllabus ===`]

  for (const domain of syllabus.domains) {
    const topicSet = new Set(domain.topics)
    const total = bank.filter((p) => topicSet.has(p.topic)).length
    const inPath = bank.filter((p) => topicSet.has(p.topic) && pathIds.has(p.id)).length
    lines.push(`  ${domain.label} (${domain.weight}): bank=${total}, path=${inPath}`)
  }

  return lines.join('\n')
}

export function formatAllIssues(issues: ValidationIssue[]): string {
  if (!issues.length) return 'All validations passed.'
  const errors = issues.filter((i) => i.severity === 'error')
  const warns = issues.filter((i) => i.severity === 'warn')
  return [
    `Errors: ${errors.length}, Warnings: ${warns.length}`,
    ...issues.map((i) => `[${i.severity.toUpperCase()}] ${i.id}: ${i.message}`),
  ].join('\n')
}
