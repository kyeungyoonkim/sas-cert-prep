import { runSasCode } from './sasSimulator'
import { CODE_CHALLENGES } from '../data/codeChallenges'

export interface ValidationIssue {
  id: string
  severity: 'error' | 'warn'
  message: string
}

function runnableCode(solutionCode: string, starterCode: string, id: string): string {
  if (id === 'cc-b-08') return solutionCode
  if (/^\s*data\s+/im.test(solutionCode) && !solutionCode.trim().startsWith('/*')) {
    return solutionCode
  }
  return starterCode
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

function countFlagInListing(listing: string[], flagValue: string): number {
  const val = flagValue.toUpperCase()
  return listing.filter((l) => {
    if (!/^\s*\d+/.test(l)) return false
    const parts = l.trim().split(/\s+/)
    return parts.some((p) => p.toUpperCase() === val)
  }).length
}

function optionMatchesValue(option: string, value: string | number): boolean {
  const opt = option.toLowerCase().replace(/[^a-z0-9.]/g, '')
  const val = String(value).toLowerCase()
  if (opt === val) return true
  if (opt.includes(val) || val.includes(opt)) return true
  const numOpt = Number(option.replace(/[^\d.]/g, ''))
  if (!Number.isNaN(numOpt) && numOpt === value) return true
  return false
}

/** Validate code challenges against the browser simulator (solution code). */
export function validateCodeChallenges(): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const c of CODE_CHALLENGES) {
    const code = runnableCode(c.solutionCode, c.starterCode, c.id)
    const result = runSasCode(code)
    if (result.errors.length) {
      issues.push({
        id: c.id,
        severity: 'error',
        message: `Simulator errors: ${result.errors.join('; ')}`,
      })
      continue
    }

    const instr = `${c.instruction} ${c.title}`.toLowerCase()
    const expected = c.options[c.correctIndex]

    if (instr.includes('flag="') || instr.includes("flag='")) {
      const m = instr.match(/flag\s*=\s*["']([^"']+)["']/i)
      const val = m?.[1] ?? 'HIGH'
      const cnt = countFlagInListing(result.listing, val)
      if (!optionMatchesValue(expected, cnt)) {
        issues.push({
          id: c.id,
          severity: 'error',
          message: `FLAG=${val} count ${cnt} does not match answer "${expected}"`,
        })
      }
      continue
    }

    if (instr.includes('grade="') || instr.includes("grade='")) {
      const m = instr.match(/grade\s*=\s*["']([^"']+)["']/i)
      const val = m?.[1] ?? 'A'
      const cnt = countFlagInListing(result.listing, val)
      if (!optionMatchesValue(expected, cnt)) {
        issues.push({
          id: c.id,
          severity: 'error',
          message: `GRADE=${val} count ${cnt} does not match answer "${expected}"`,
        })
      }
      continue
    }

    if (instr.includes('sev="') || instr.includes("sev='")) {
      const m = instr.match(/sev\s*=\s*["']([^"']+)["']/i)
      const val = m?.[1] ?? 'SEVERE'
      const cnt = countFlagInListing(result.listing, val)
      if (!optionMatchesValue(expected, cnt)) {
        issues.push({
          id: c.id,
          severity: 'error',
          message: `SEV=${val} count ${cnt} does not match answer "${expected}"`,
        })
      }
      continue
    }

    if (instr.includes('adjfl="') || instr.includes("adjfl='")) {
      const m = instr.match(/adjfl\s*=\s*["']([^"']+)["']/i)
      const val = m?.[1] ?? 'Y'
      const cnt = countFlagInListing(result.listing, val)
      if (!optionMatchesValue(expected, cnt)) {
        issues.push({
          id: c.id,
          severity: 'error',
          message: `ADJFL=${val} count ${cnt} does not match answer "${expected}"`,
        })
      }
      continue
    }

    if (instr.includes('bmi_cat="') || instr.includes("bmi_cat='")) {
      const m = instr.match(/bmi_cat\s*=\s*["']([^"']+)["']/i)
      const val = m?.[1] ?? 'OBESE'
      const cnt = countFlagInListing(result.listing, val)
      if (!optionMatchesValue(expected, cnt)) {
        issues.push({
          id: c.id,
          severity: 'error',
          message: `BMI_CAT=${val} count ${cnt} does not match answer "${expected}"`,
        })
      }
      continue
    }

    if (
      instr.includes('how many observation') ||
      instr.includes('observation count') ||
      instr.includes('rows appear') ||
      instr.includes('remain')
    ) {
      const obs = parseObsCountFromLog(result.log)
      const printRows = countListingRows(result.listing)
      const count = obs ?? printRows
      if (count !== null && !optionMatchesValue(expected, count)) {
        issues.push({
          id: c.id,
          severity: 'error',
          message: `Obs count ${count} does not match answer "${expected}" (index ${c.correctIndex})`,
        })
      }
    }
  }

  return issues
}

export function formatValidationReport(issues: ValidationIssue[]): string {
  if (!issues.length) return 'All code challenges passed simulator validation.'
  return issues.map((i) => `[${i.severity.toUpperCase()}] ${i.id}: ${i.message}`).join('\n')
}
