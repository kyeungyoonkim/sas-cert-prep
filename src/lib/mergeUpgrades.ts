import type { Question } from '../data/types'
import type { CodeChallenge } from '../data/codeChallenges'

const EXAM_META = { examStyle: true as const, qualityTier: 'exam' as const }

export function applyMcqUpgrades(
  questions: Question[],
  upgrades: Record<string, Partial<Question>>
): Question[] {
  return questions.map((q) => {
    const u = upgrades[q.id]
    if (!u) return normalizeQuestion(q)
    return normalizeQuestion({
      ...q,
      ...u,
      tags: u.tags ?? q.tags,
      collections: u.collections ?? q.collections,
    })
  })
}

function normalizeQuestion(q: Question): Question {
  if (q.qualityTier === 'exam' || q.examStyle) return q
  if (q.code || q.trap) {
    return { ...q, examStyle: q.examStyle ?? true, qualityTier: q.qualityTier ?? 'exam' }
  }
  if (/^What (is|does|are|was)/i.test(q.question.trim())) {
    return { ...q, qualityTier: q.qualityTier ?? 'foundational' }
  }
  return { ...q, qualityTier: q.qualityTier ?? 'standard' }
}

export function applyCodeUpgrades(
  challenges: CodeChallenge[],
  upgrades: Record<string, Partial<CodeChallenge>>
): CodeChallenge[] {
  return challenges.map((c) => {
    const u = upgrades[c.id]
    if (!u) return c
    return { ...c, ...u, tags: u.tags ?? c.tags }
  })
}

export { EXAM_META }
