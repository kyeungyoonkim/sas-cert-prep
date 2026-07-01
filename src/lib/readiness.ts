import type { CertId } from '../data/types'
import { getStudyPath, getModuleProgress } from '../data/studyPath'
import { getBankProblems } from '../data/bank'

export interface ReadinessReport {
  score: number
  label: string
  color: string
  breakdown: {
    coverage: number
    accuracy: number
    modules: number
    examSim: number
    checklist: number
  }
  weakTopics: string[]
  recommendation: string
}

export function calculateReadiness(
  certId: CertId,
  progress: {
    answered: Record<string, { correct: boolean; attempts: number }>
    checklist: Record<string, boolean>
    examHistory: { score: number }[]
  },
  examPassingScore: number,
  checklistTotal: number
): ReadinessReport {
  const bank = getBankProblems(certId)
  const total = bank.length
  const answered = Object.keys(progress.answered).length
  const correct = Object.values(progress.answered).filter((a) => a.correct).length

  const coverage = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0

  const path = getStudyPath(certId)
  let modulesComplete = 0
  path.forEach((m, i) => {
    const mp = getModuleProgress(m, progress.answered, path, i)
    if (mp.isComplete) modulesComplete++
  })
  const modules =
    path.length > 0 ? Math.round((modulesComplete / Math.max(1, path.length - 1)) * 100) : 0

  const bestExam = progress.examHistory.length
    ? Math.max(...progress.examHistory.map((e) => e.score))
    : 0
  const examSim =
    progress.examHistory.length > 0
      ? Math.min(100, Math.round((bestExam / examPassingScore) * 85))
      : 0

  const checklistDone = Object.values(progress.checklist).filter(Boolean).length
  const checklist =
    checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : 0

  const score = Math.round(
    coverage * 0.25 + accuracy * 0.25 + modules * 0.3 + examSim * 0.15 + checklist * 0.05
  )

  const byTopic: Record<string, { total: number; correct: number; answered: number }> = {}
  bank.forEach((p) => {
    if (!byTopic[p.topic]) byTopic[p.topic] = { total: 0, correct: 0, answered: 0 }
    byTopic[p.topic].total++
    if (progress.answered[p.id]) {
      byTopic[p.topic].answered++
      if (progress.answered[p.id].correct) byTopic[p.topic].correct++
    }
  })

  const weakTopics = Object.entries(byTopic)
    .filter(([, v]) => v.answered >= 3 && v.correct / v.answered < 0.6)
    .sort(([, a], [, b]) => a.correct / a.answered - b.correct / b.answered)
    .map(([t]) => t)

  let label: string
  let color: string
  let recommendation: string

  if (score >= 85) {
    label = 'Exam Ready'
    color = '#059669'
    recommendation = 'Take the free official SAS practice exam, then schedule your real exam.'
  } else if (score >= 65) {
    label = 'Almost There'
    color = '#d97706'
    recommendation = 'Finish remaining study path modules and retake a timed practice exam.'
  } else if (score >= 40) {
    label = 'Building Skills'
    color = '#2563eb'
    recommendation = "Follow the Study Path in order — don't skip the Learn modules."
  } else {
    label = 'Getting Started'
    color = '#6b7280'
    recommendation = 'Start Module 1 on the Study Path. Aim for 15 questions per day.'
  }

  return {
    score,
    label,
    color,
    breakdown: { coverage, accuracy, modules, examSim, checklist },
    weakTopics,
    recommendation,
  }
}

export const DAILY_GOAL_DEFAULT = 15

export function getDailyProgress(
  dailyLog: Record<string, number> | undefined,
  goal: number = DAILY_GOAL_DEFAULT
): { today: number; goal: number; met: boolean } {
  const todayStr = new Date().toISOString().split('T')[0]
  const today = dailyLog?.[todayStr] ?? 0
  return { today, goal, met: today >= goal }
}
