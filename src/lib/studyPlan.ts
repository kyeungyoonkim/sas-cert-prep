import type { CertId } from '../data/types'
import { getStudyPath, type StudyModule } from '../data/studyPath'

export type PlanAction = 'module' | 'exam' | 'review' | 'bookmarks' | 'checklist' | 'official' | 'rest'
export type PlanPhase = 'learn' | 'practice' | 'final' | 'exam'

export interface PlanTask {
  action: PlanAction
  title: string
  detail?: string
  moduleId?: string
  problemIds?: string[]
  count?: number
}

export interface PlanDay {
  id: string
  dateISO: string
  dayNumber: number
  daysUntilExam: number
  isExamDay: boolean
  phase: PlanPhase
  tasks: PlanTask[]
}

export interface StudyPlan {
  days: PlanDay[]
  totalStudyDays: number
  examDateISO: string
}

/** Parse a YYYY-MM-DD string as a local-midnight Date (avoids UTC drift). */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function toLocalISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayLocalISO(): string {
  return toLocalISO(new Date())
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function diffDays(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / 86400000)
}

/** Split learning modules into `dayCount` buckets, balanced by problem count, order preserved. */
function packModules(modules: StudyModule[], dayCount: number): StudyModule[][] {
  if (dayCount <= 1) return [modules]
  const total = modules.reduce((s, m) => s + m.problemIds.length, 0)
  const target = total / dayCount
  const buckets: StudyModule[][] = []
  let current: StudyModule[] = []
  let currentCount = 0

  modules.forEach((m, i) => {
    current.push(m)
    currentCount += m.problemIds.length
    const remainingModules = modules.length - (i + 1)
    const remainingBuckets = dayCount - buckets.length - 1
    const mustSplitToFill = remainingModules === remainingBuckets && remainingBuckets > 0
    if ((currentCount >= target && remainingBuckets > 0) || mustSplitToFill) {
      buckets.push(current)
      current = []
      currentCount = 0
    }
  })
  if (current.length) buckets.push(current)
  return buckets
}

const OFFICIAL_TASK: PlanTask = {
  action: 'official',
  title: 'Official SAS Practice Exam (optional)',
  detail: 'Closest to the real exam — link in Study Path',
}

/**
 * Build a date-by-date plan from today (or start) to the exam date.
 * Learning modules are front-loaded, followed by timed mock exams, then final review.
 */
export function generateStudyPlan(
  certId: CertId,
  examDateISO: string,
  startISO: string = todayLocalISO()
): StudyPlan {
  const today = parseLocalDate(startISO)
  const exam = parseLocalDate(examDateISO)
  const span = diffDays(today, exam) // day offset of the exam from today

  const modules = getStudyPath(certId).filter((m) => m.problemIds.length > 0)
  const days: PlanDay[] = []

  const pushDay = (offset: number, phase: PlanPhase, tasks: PlanTask[]) => {
    const date = addDays(today, offset)
    days.push({
      id: `plan-${certId}-${toLocalISO(date)}`,
      dateISO: toLocalISO(date),
      dayNumber: offset + 1,
      daysUntilExam: span - offset,
      isExamDay: offset === span,
      phase,
      tasks,
    })
  }

  // Exam today or already past → just the exam day entry.
  if (span <= 0) {
    pushDay(Math.max(0, span), 'exam', [
      { action: 'rest', title: 'Exam day', detail: 'Stay calm, manage time, verify Log output on code items.' },
    ])
    return { days, totalStudyDays: 0, examDateISO }
  }

  const studyDayCount = span // days before the exam

  // Reserve final review + mock-exam days based on how much time is available.
  let desiredLearnDays = Math.min(
    studyDayCount,
    modules.length,
    Math.max(1, Math.round(studyDayCount * 0.55))
  )
  const buckets = packModules(modules, desiredLearnDays)
  const learnDaysUsed = buckets.length
  desiredLearnDays = learnDaysUsed

  const remaining = studyDayCount - learnDaysUsed
  const finalDays = remaining >= 3 ? 2 : remaining >= 1 ? 1 : 0
  const practiceDays = Math.max(0, remaining - finalDays)

  let offset = 0

  // Phase 1 — Learn / practice each module in order.
  buckets.forEach((bucket, i) => {
    const tasks: PlanTask[] = bucket.map((m) => ({
      action: 'module',
      title: m.title,
      detail: `${m.examWeight} · ${m.problemIds.length} problems`,
      moduleId: m.id,
      problemIds: m.problemIds,
      count: m.problemIds.length,
    }))
    if (i > 0) {
      tasks.push({ action: 'review', title: 'Review yesterday\u2019s missed', detail: 'Quick 오답 복습 warm-up' })
    }
    pushDay(offset, 'learn', tasks)
    offset += 1
  })

  // Phase 2 — Timed mock exams + review.
  for (let i = 0; i < practiceDays; i++) {
    const tasks: PlanTask[] = [
      { action: 'exam', title: 'Full timed practice exam', detail: 'Exam conditions — no hints until submit' },
      { action: 'review', title: 'Review every missed question', detail: 'Understand why, not just the answer' },
    ]
    if (i === practiceDays - 1) tasks.push(OFFICIAL_TASK)
    pushDay(offset, 'practice', tasks)
    offset += 1
  }

  // Phase 3 — Final review before exam.
  for (let i = 0; i < finalDays; i++) {
    const isLastBeforeExam = i === finalDays - 1
    if (isLastBeforeExam) {
      pushDay(offset, 'final', [
        { action: 'bookmarks', title: 'Review bookmarked + trap questions', detail: 'Only the tricky ones' },
        { action: 'checklist', title: 'Finish the study checklist', detail: 'Confirm every topic covered' },
        { action: 'rest', title: 'Rest early — no cramming', detail: 'Sleep well before exam day' },
      ])
    } else {
      pushDay(offset, 'final', [
        { action: 'exam', title: 'Final practice exam', detail: 'Target 80%+ and readiness 85%+' },
        { action: 'review', title: 'Review missed + weak topics', detail: 'Focus dashboard weak areas' },
      ])
    }
    offset += 1
  }

  // Exam day.
  pushDay(span, 'exam', [
    {
      action: 'rest',
      title: 'Exam day 🎯',
      detail: 'No new material. Manage time (~3 min/question), run code before answering.',
    },
  ])

  return { days, totalStudyDays: studyDayCount, examDateISO }
}
