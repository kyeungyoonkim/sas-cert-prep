import { useMemo, useState } from 'react'
import type { CertData } from '../data/types'
import type { useProgress } from '../hooks/useProgress'
import type { StudySession } from './StudyMode'
import {
  generateStudyPlan,
  todayLocalISO,
  parseLocalDate,
  toLocalISO,
  type PlanDay,
  type PlanTask,
} from '../lib/studyPlan'
import { OFFICIAL_SAS_RESOURCES } from '../data/studyPath'
import { STRINGS } from '../i18n/strings'

const PHASE_LABEL: Record<string, string> = {
  learn: 'Learn',
  practice: 'Mock Exams',
  final: 'Final Review',
  exam: 'Exam Day',
}

const PHASE_COLOR: Record<string, string> = {
  learn: '#2563eb',
  practice: '#059669',
  final: '#d97706',
  exam: '#dc2626',
}

const ACTION_ICON: Record<string, string> = {
  module: '📖',
  exam: '🎯',
  review: '🔄',
  bookmarks: '⭐',
  checklist: '✅',
  official: '🔗',
  rest: '😴',
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function addDays(iso: string, n: number): string {
  const d = parseLocalDate(iso)
  d.setDate(d.getDate() + n)
  return toLocalISO(d)
}

export function StudyPlanView({
  cert,
  progress,
  onSetExamDate,
  onTogglePlanDay,
  onStartStudy,
  onOpenView,
}: {
  cert: CertData
  progress: ReturnType<typeof useProgress>['progress']
  onSetExamDate: (date: string | null) => void
  onTogglePlanDay: (dayId: string) => void
  onStartStudy: (session: StudySession) => void
  onOpenView: (view: 'exam' | 'review' | 'bookmarks' | 'checklist') => void
}) {
  const S = STRINGS.plan
  const today = todayLocalISO()
  const examDate = progress.examDate
  const planDone = progress.planDone ?? {}

  const guideUrl =
    cert.id === 'clinical'
      ? OFFICIAL_SAS_RESOURCES.contentGuideClinical
      : cert.id === 'advanced'
        ? OFFICIAL_SAS_RESOURCES.contentGuideAdvanced
        : OFFICIAL_SAS_RESOURCES.contentGuideBase

  const [draftDate, setDraftDate] = useState(examDate ?? addDays(today, 14))

  const plan = useMemo(
    () => (examDate ? generateStudyPlan(cert.id, examDate, today) : null),
    [cert.id, examDate, today]
  )

  // ── Setup screen (no exam date yet) ──
  if (!plan) {
    return (
      <>
        <div className="page-header">
          <div className="mode-banner mode-banner--study">{S.badge}</div>
          <h2>{S.title}</h2>
          <p>{S.setupHint}</p>
        </div>
        <div className="plan-setup-card">
          <label className="plan-date-label" htmlFor="exam-date">{S.examDateLabel}</label>
          <input
            id="exam-date"
            type="date"
            className="plan-date-input"
            min={today}
            value={draftDate}
            onChange={(e) => setDraftDate(e.target.value)}
          />
          <div className="plan-quick-dates">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDraftDate(addDays(today, 14))}>
              +2 {S.weeks}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDraftDate(addDays(today, 21))}>
              +3 {S.weeks}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDraftDate(addDays(today, 28))}>
              +4 {S.weeks}
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!draftDate || draftDate < today}
            onClick={() => onSetExamDate(draftDate)}
          >
            {S.createPlan}
          </button>
        </div>
      </>
    )
  }

  const studyDays = plan.days.filter((d) => !d.isExamDay)
  const doneCount = studyDays.filter((d) => planDone[d.id]).length
  const totalStudy = studyDays.length
  const examDay = plan.days.find((d) => d.isExamDay)
  const daysLeft = examDay ? examDay.daysUntilExam : 0
  const overdue = daysLeft < 0

  const handleTask = (task: PlanTask) => {
    switch (task.action) {
      case 'module':
        if (task.problemIds?.length) {
          onStartStudy({
            questionIds: task.problemIds,
            title: task.title,
            moduleId: task.moduleId,
            showConcept: true,
          })
        }
        break
      case 'exam':
        onOpenView('exam')
        break
      case 'review':
        onOpenView('review')
        break
      case 'bookmarks':
        onOpenView('bookmarks')
        break
      case 'checklist':
        onOpenView('checklist')
        break
      case 'official':
        window.open(OFFICIAL_SAS_RESOURCES.practiceExams, '_blank', 'noopener')
        break
      default:
        break
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="mode-banner mode-banner--study">{S.badge}</div>
        <h2>{S.title}</h2>
        <p>{cert.fullName} · {cert.examInfo.examId}</p>
      </div>

      <div className="plan-hero">
        <div className="plan-countdown">
          <span className="plan-countdown-num">{overdue ? '—' : `D-${daysLeft}`}</span>
          <span className="plan-countdown-label">
            {overdue ? S.overdue : `${S.examOn} ${examDate}`}
          </span>
        </div>
        <div className="plan-hero-body">
          <div className="plan-progress-row">
            <span>{S.daysDone}: <strong>{doneCount}/{totalStudy}</strong></span>
            <div className="plan-progress-bar">
              <div
                className="plan-progress-fill"
                style={{ width: `${totalStudy > 0 ? (doneCount / totalStudy) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="plan-hero-actions">
            <a href={guideUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
              🔗 {S.contentGuide}
            </a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSetExamDate(null)}>
              {S.changeDate}
            </button>
          </div>
        </div>
      </div>

      <div className="plan-timeline">
        {plan.days.map((day) => (
          <PlanDayCard
            key={day.id}
            day={day}
            isToday={day.dateISO === today}
            isPast={day.dateISO < today && !day.isExamDay}
            done={!!planDone[day.id]}
            onToggleDone={() => onTogglePlanDay(day.id)}
            onTask={handleTask}
          />
        ))}
      </div>
    </>
  )
}

function PlanDayCard({
  day,
  isToday,
  isPast,
  done,
  onToggleDone,
  onTask,
}: {
  day: PlanDay
  isToday: boolean
  isPast: boolean
  done: boolean
  onToggleDone: () => void
  onTask: (task: PlanTask) => void
}) {
  const S = STRINGS.plan
  const date = parseLocalDate(day.dateISO)
  const weekday = WEEKDAYS[date.getDay()]
  const monthDay = `${date.getMonth() + 1}/${date.getDate()}`
  const phaseColor = PHASE_COLOR[day.phase]

  return (
    <div
      className={`plan-day-card ${isToday ? 'plan-day-card--today' : ''} ${
        isPast && !done ? 'plan-day-card--past' : ''
      } ${done ? 'plan-day-card--done' : ''} ${day.isExamDay ? 'plan-day-card--exam' : ''}`}
    >
      <div className="plan-day-side">
        <span className="plan-day-num">Day {day.dayNumber}</span>
        <span className="plan-day-date">{weekday} {monthDay}</span>
        {isToday && <span className="plan-today-badge">{S.today}</span>}
        <span className="plan-phase-badge" style={{ background: phaseColor }}>
          {PHASE_LABEL[day.phase]}
        </span>
      </div>

      <div className="plan-day-main">
        <ul className="plan-task-list">
          {day.tasks.map((task, i) => {
            const clickable = task.action !== 'rest'
            return (
              <li key={i} className={`plan-task ${clickable ? 'plan-task--clickable' : ''}`}>
                <button
                  type="button"
                  className="plan-task-btn"
                  onClick={() => clickable && onTask(task)}
                  disabled={!clickable}
                >
                  <span className="plan-task-icon">{ACTION_ICON[task.action]}</span>
                  <span className="plan-task-body">
                    <span className="plan-task-title">{task.title}</span>
                    {task.detail && <span className="plan-task-detail">{task.detail}</span>}
                  </span>
                  {clickable && <span className="plan-task-go">→</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {!day.isExamDay && (
        <button
          type="button"
          className={`plan-done-toggle ${done ? 'plan-done-toggle--on' : ''}`}
          onClick={onToggleDone}
          title={done ? S.markUndone : S.markDone}
        >
          {done ? '✓' : ''}
        </button>
      )}
    </div>
  )
}
