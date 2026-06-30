import type { CertId, BankProblem, Question } from './types'
import { BASE_CERT } from './base'
import { CLINICAL_CERT } from './clinical'
import { ADVANCED_CERT } from './advanced'
import { CODE_CHALLENGES } from './codeChallenges'
import { inferCollections } from './collections'

const CERT_MAP = {
  base: BASE_CERT,
  clinical: CLINICAL_CERT,
  advanced: ADVANCED_CERT,
} as const

function getCertData(certId: CertId) {
  return CERT_MAP[certId]
}

function titleFromQuestion(q: Question): string {
  if (q.title) return q.title
  const line = q.question.split('\n')[0].trim()
  return line.length > 72 ? `${line.slice(0, 69)}…` : line
}

function questionToBank(q: Question, cert: CertId): BankProblem {
  return {
    id: q.id,
    kind: 'mcq',
    cert,
    topic: q.topic,
    difficulty: q.difficulty,
    title: titleFromQuestion(q),
    question: q.question,
    code: q.code,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    explanationKo: q.explanationKo,
    tags: q.tags,
    collections: inferCollections(q.tags, q.collections ?? [], {
      trap: q.trap,
      kind: 'mcq',
      difficulty: q.difficulty,
      relatedIds: q.relatedIds,
    }),
    trap: q.trap ?? false,
    relatedIds: q.relatedIds ?? [],
    coachingTip: q.coachingTip,
    examStyle: q.examStyle,
    qualityTier: q.qualityTier,
  }
}

export function getBankProblems(certId: CertId): BankProblem[] {
  const cert = getCertData(certId)
  const mcq = cert.questions.map((q) => questionToBank(q, certId))
  const code = CODE_CHALLENGES.filter((c) => c.cert === certId).map((c): BankProblem => ({
    id: c.id,
    kind: 'code',
    cert: c.cert,
    topic: c.topic,
    difficulty: c.difficulty,
    title: c.title,
    question: c.instruction,
    starterCode: c.starterCode,
    solutionCode: c.solutionCode,
    hint: c.hint,
    options: c.options,
    correctIndex: c.correctIndex,
    explanation: c.explanation,
    explanationKo: c.explanationKo,
    tags: c.tags,
    collections: inferCollections(c.tags, [], {
      kind: 'code',
      difficulty: c.difficulty,
    }),
    trap: c.difficulty === 'hard',
    relatedIds: [],
    examStyle: true,
    qualityTier: 'exam',
    coachingTip: c.hint,
  }))
  return [...mcq, ...code]
}

function examPriority(p: BankProblem): number {
  let score = 0
  if (p.qualityTier === 'exam') score += 12
  if (p.examStyle) score += 10
  if (p.trap) score += 8
  if (p.difficulty === 'hard') score += 5
  if (p.difficulty === 'medium') score += 2
  if (p.code || p.kind === 'code') score += 4
  if (p.collections.includes('exam-quality')) score += 6
  if (p.qualityTier === 'foundational') score -= 10
  if (p.difficulty === 'easy' && p.kind === 'mcq' && !p.code && !p.examStyle) score -= 4
  return score
}

function pickByPriority(pool: BankProblem[], count: number): BankProblem[] {
  const ranked = [...pool].sort((a, b) => examPriority(b) - examPriority(a))
  const top = ranked.slice(0, Math.max(count * 2, count))
  return shuffleBank(top).slice(0, count)
}

export function sortByExamQuality(problems: BankProblem[]): BankProblem[] {
  return [...problems].sort((a, b) => examPriority(b) - examPriority(a))
}

export function getBankProblem(certId: CertId, id: string): BankProblem | undefined {
  return getBankProblems(certId).find((p) => p.id === id)
}

export function shuffleBank<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Exam-style mix: high-quality MCQ + ~15% runnable code problems. */
export function buildExamSet(certId: CertId): BankProblem[] {
  const all = getBankProblems(certId)
  const mcqPool = all.filter((p) => p.kind === 'mcq')
  const codePool = all.filter((p) => p.kind === 'code' && p.difficulty !== 'easy')
  const target = getCertData(certId).examInfo.questions
  const codeCount = Math.min(
    codePool.length || all.filter((p) => p.kind === 'code').length,
    Math.max(1, Math.round(target * 0.15))
  )
  const code = pickByPriority(
    codePool.length > 0 ? codePool : all.filter((p) => p.kind === 'code'),
    codeCount
  )
  const mcqCount = Math.min(mcqPool.length, target - code.length)
  const mcq = pickByPriority(mcqPool, mcqCount)
  return shuffleBank([...mcq, ...code]).slice(0, target)
}

export function getProblemsByCollection(certId: CertId, collectionId: string): BankProblem[] {
  return getBankProblems(certId).filter((p) => p.collections.includes(collectionId))
}

export function getRelatedProblems(certId: CertId, problem: BankProblem): BankProblem[] {
  const bank = getBankProblems(certId)
  const byId = new Map(bank.map((p) => [p.id, p]))
  const related = problem.relatedIds.map((id) => byId.get(id)).filter(Boolean) as BankProblem[]
  const reverse = bank.filter((p) => p.relatedIds.includes(problem.id))
  const seen = new Set<string>()
  return [...related, ...reverse].filter((p) => {
    if (p.id === problem.id || seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

export function bankStats(certId: CertId) {
  const all = getBankProblems(certId)
  return {
    total: all.length,
    mcq: all.filter((p) => p.kind === 'mcq').length,
    code: all.filter((p) => p.kind === 'code').length,
    traps: all.filter((p) => p.trap || p.collections.includes('exam-traps')).length,
    hard: all.filter((p) => p.difficulty === 'hard').length,
  }
}
