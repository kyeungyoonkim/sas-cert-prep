import type { CertId } from './types'

export interface ProblemCollection {
  id: string
  label: string
  description: string
  icon: string
  /** Empty = all certs */
  certs: CertId[]
}

export const PROBLEM_COLLECTIONS: ProblemCollection[] = [
  {
    id: 'exam-quality',
    label: 'Exam Quality',
    description: 'Scenario-based questions with plausible distractors — closest to real exam feel.',
    icon: '✓',
    certs: [],
  },
  {
    id: 'exam-traps',
    label: 'Exam Traps',
    description: 'Commonly missed questions — subtle wording, missing values, merge quirks.',
    icon: '⚠️',
    certs: [],
  },
  {
    id: 'must-run',
    label: 'Run Code First',
    description: 'StrataScratch-style: run the program in the lab, then pick the answer.',
    icon: '▶',
    certs: [],
  },
  {
    id: 'merge-by',
    label: 'MERGE & BY',
    description: 'Match-merge, SET, sorting, FIRST./LAST., and observation counts.',
    icon: '🔗',
    certs: [],
  },
  {
    id: 'missing-values',
    label: 'Missing Values',
    description: 'How SAS treats . in IF, WHERE, arithmetic, and comparisons.',
    icon: '∅',
    certs: [],
  },
  {
    id: 'sum-retain',
    label: 'SUM & RETAIN',
    description: 'Running totals, counters, implicit RETAIN, and BY-group resets.',
    icon: 'Σ',
    certs: [],
  },
  {
    id: 'hard-picks',
    label: 'Hard Picks',
    description: 'Advanced difficulty — save for final review week.',
    icon: '🔥',
    certs: [],
  },
  {
    id: 'related-drills',
    label: 'Related Drills',
    description: 'Paired concept questions + runnable code problems on the same topic.',
    icon: '🎯',
    certs: [],
  },
  {
    id: 'clinical-qc',
    label: 'Clinical QC',
    description: 'Validation, CDISC-style derivations, and trial data checks.',
    icon: '🏥',
    certs: ['clinical'],
  },
  {
    id: 'sql-macro',
    label: 'SQL & Macros',
    description: 'PROC SQL, macro language, and advanced programming patterns.',
    icon: '⚙️',
    certs: ['advanced'],
  },
]

const TAG_COLLECTION_MAP: Record<string, string[]> = {
  MERGE: ['merge-by'],
  BY: ['merge-by'],
  SET: ['merge-by'],
  'FIRST.': ['merge-by', 'sum-retain'],
  'LAST.': ['merge-by', 'sum-retain'],
  RETAIN: ['sum-retain'],
  'SUM statement': ['sum-retain'],
  'missing value': ['missing-values'],
  'missing values': ['missing-values'],
  PROC: ['sql-macro'],
  SQL: ['sql-macro'],
  macro: ['sql-macro'],
  CDISC: ['clinical-qc'],
  LB: ['clinical-qc'],
  validation: ['clinical-qc'],
}

export function inferCollections(
  tags: string[],
  explicit: string[] = [],
  opts: { trap?: boolean; kind?: 'mcq' | 'code'; difficulty?: string; relatedIds?: string[] }
): string[] {
  const set = new Set<string>(explicit)
  for (const tag of tags) {
    const key = Object.keys(TAG_COLLECTION_MAP).find(
      (k) => k.toLowerCase() === tag.toLowerCase() || tag.toLowerCase().includes(k.toLowerCase())
    )
    if (key) TAG_COLLECTION_MAP[key].forEach((c) => set.add(c))
  }
  if (opts.trap) set.add('exam-traps')
  if (opts.kind === 'code') set.add('must-run')
  if (opts.difficulty === 'hard') set.add('hard-picks')
  if (opts.relatedIds && opts.relatedIds.length > 0) set.add('related-drills')
  return [...set]
}

export function getCollectionLabel(id: string): string {
  return PROBLEM_COLLECTIONS.find((c) => c.id === id)?.label ?? id
}

export function getCollectionsForCert(certId: CertId): ProblemCollection[] {
  return PROBLEM_COLLECTIONS.filter((c) => c.certs.length === 0 || c.certs.includes(certId))
}
