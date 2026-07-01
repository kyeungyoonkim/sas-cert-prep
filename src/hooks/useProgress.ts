import { useState, useEffect, useCallback } from 'react'
import type { CertId } from '../data/types'

export interface Progress {
  answered: Record<string, { correct: boolean; attempts: number }>
  bookmarked: string[]
  checklist: Record<string, boolean>
  examHistory: ExamResult[]
  /** date (YYYY-MM-DD) → questions answered that day */
  dailyLog?: Record<string, number>
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

const STORAGE_KEY = 'sas-cert-progress-v2'
const LEGACY_KEY = 'sas-cert-progress'

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

function migrateLegacy(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const legacy = JSON.parse(raw)
    const stored = { ...defaultStored }
    stored.byCert.base = {
      answered: legacy.answered ?? {},
      bookmarked: legacy.bookmarked ?? [],
      checklist: legacy.checklist ?? {},
      examHistory: (legacy.examHistory ?? []).map((e: ExamResult) => ({
        ...e,
        topicBreakdown: e.topicBreakdown ?? {},
      })),
    }
    stored.streak = legacy.streak ?? 0
    stored.lastStudyDate = legacy.lastStudyDate ?? null
    localStorage.removeItem(LEGACY_KEY)
    return stored
  } catch {
    return null
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
  return migrateLegacy() ?? defaultStored
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

  const exportData = useCallback((): string => {
    return JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), data: stored }, null, 2)
  }, [stored])

  const importData = useCallback((raw: string): boolean => {
    try {
      const parsed = JSON.parse(raw)
      const incoming: Partial<StoredProgress> = parsed?.data ?? parsed
      if (!incoming || typeof incoming !== 'object' || !incoming.byCert) return false
      setStored({
        ...defaultStored,
        ...incoming,
        byCert: { ...defaultStored.byCert, ...incoming.byCert },
      })
      return true
    } catch {
      return false
    }
  }, [])

  return {
    progress,
    streak: stored.streak,
    recordAnswer,
    toggleBookmark,
    toggleChecklist,
    recordExam,
    resetProgress,
    exportData,
    importData,
  }
}
