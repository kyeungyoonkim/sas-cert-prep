import { useState, useEffect, useCallback } from 'react'
import type { CertId } from '../data/types'

export interface Progress {
  answered: Record<string, { correct: boolean; attempts: number }>
  bookmarked: string[]
  checklist: Record<string, boolean>
  examHistory: ExamResult[]
  /** date (YYYY-MM-DD) → questions answered that day */
  dailyLog?: Record<string, number>
  /** Target exam date (YYYY-MM-DD) for the day-by-day Study Plan */
  examDate?: string
  /** Study Plan day id → completed */
  planDone?: Record<string, boolean>
}

export interface ExamResult {
  date: string
  score: number
  total: number
  timeUsed: number
  topicBreakdown: Record<string, { correct: number; total: number }>
}

interface StoredProgress {
  byCert: Record<CertId, Progress>
  streak: number
  lastStudyDate: string | null
}

// Bump this version to reset all stored progress on next load (fresh start).
const STORAGE_KEY = 'sas-cert-progress-v3'
const LEGACY_KEYS = ['sas-cert-progress-v2', 'sas-cert-progress']

const emptyProgress = (): Progress => ({
  answered: {},
  bookmarked: [],
  checklist: {},
  examHistory: [],
})

const defaultStored: StoredProgress = {
  byCert: {
    base: emptyProgress(),
    clinical: emptyProgress(),
    advanced: emptyProgress(),
  },
  streak: 0,
  lastStudyDate: null,
}

// Remove progress saved under previous storage keys so a version bump yields a
// genuinely clean slate instead of migrating stale (test) data forward.
function clearLegacy(): void {
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

function loadStored(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...defaultStored,
        ...parsed,
        byCert: {
          ...defaultStored.byCert,
          ...parsed.byCert,
        },
      }
    }
  } catch {
    /* ignore */
  }
  clearLegacy()
  return defaultStored
}

export function useProgress(certId: CertId) {
  const [stored, setStored] = useState<StoredProgress>(loadStored)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  }, [stored])

  const progress = stored.byCert[certId] ?? emptyProgress()

  const recordAnswer = useCallback(
    (questionId: string, correct: boolean) => {
      setStored((prev) => {
        const certProgress = prev.byCert[certId] ?? emptyProgress()
        const existing = certProgress.answered[questionId]
        const today = new Date().toISOString().split('T')[0]
        let streak = prev.streak
        const dailyLog = { ...(certProgress.dailyLog ?? {}) }
        dailyLog[today] = (dailyLog[today] ?? 0) + 1

        if (prev.lastStudyDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          streak = prev.lastStudyDate === yesterdayStr ? prev.streak + 1 : 1
        }

        return {
          ...prev,
          streak,
          lastStudyDate: today,
          byCert: {
            ...prev.byCert,
            [certId]: {
              ...certProgress,
              dailyLog,
              answered: {
                ...certProgress.answered,
                [questionId]: {
                  correct: existing?.correct || correct,
                  attempts: (existing?.attempts ?? 0) + 1,
                },
              },
            },
          },
        }
      })
    },
    [certId]
  )

  const toggleBookmark = useCallback(
    (questionId: string) => {
      setStored((prev) => {
        const certProgress = prev.byCert[certId] ?? emptyProgress()
        const bookmarked = certProgress.bookmarked.includes(questionId)
          ? certProgress.bookmarked.filter((id) => id !== questionId)
          : [...certProgress.bookmarked, questionId]
        return {
          ...prev,
          byCert: {
            ...prev.byCert,
            [certId]: { ...certProgress, bookmarked },
          },
        }
      })
    },
    [certId]
  )

  const toggleChecklist = useCallback(
    (itemId: string) => {
      setStored((prev) => {
        const certProgress = prev.byCert[certId] ?? emptyProgress()
        return {
          ...prev,
          byCert: {
            ...prev.byCert,
            [certId]: {
              ...certProgress,
              checklist: {
                ...certProgress.checklist,
                [itemId]: !certProgress.checklist[itemId],
              },
            },
          },
        }
      })
    },
    [certId]
  )

  const recordExam = useCallback(
    (result: ExamResult) => {
      setStored((prev) => {
        const certProgress = prev.byCert[certId] ?? emptyProgress()
        return {
          ...prev,
          byCert: {
            ...prev.byCert,
            [certId]: {
              ...certProgress,
              examHistory: [result, ...certProgress.examHistory].slice(0, 20),
            },
          },
        }
      })
    },
    [certId]
  )

  const resetProgress = useCallback(
    (target?: CertId) => {
      if (target) {
        setStored((prev) => ({
          ...prev,
          byCert: { ...prev.byCert, [target]: emptyProgress() },
        }))
      } else {
        setStored(defaultStored)
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    []
  )

  const setExamDate = useCallback(
    (date: string | null) => {
      setStored((prev) => {
        const certProgress = prev.byCert[certId] ?? emptyProgress()
        return {
          ...prev,
          byCert: {
            ...prev.byCert,
            [certId]: {
              ...certProgress,
              examDate: date ?? undefined,
              // Reset day completion when the target date changes.
              planDone: {},
            },
          },
        }
      })
    },
    [certId]
  )

  const togglePlanDay = useCallback(
    (dayId: string) => {
      setStored((prev) => {
        const certProgress = prev.byCert[certId] ?? emptyProgress()
        const planDone = { ...(certProgress.planDone ?? {}) }
        planDone[dayId] = !planDone[dayId]
        return {
          ...prev,
          byCert: {
            ...prev.byCert,
            [certId]: { ...certProgress, planDone },
          },
        }
      })
    },
    [certId]
  )

  return {
    progress,
    streak: stored.streak,
    recordAnswer,
    toggleBookmark,
    toggleChecklist,
    recordExam,
    resetProgress,
    setExamDate,
    togglePlanDay,
  }
}
