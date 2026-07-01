import { useState, useEffect, useMemo, useCallback, type CSSProperties } from 'react'
import {
  getCert,
  CERT_ORDER,
  CERTIFICATIONS,
  loadSelectedCert,
  saveSelectedCert,
  getBankProblems,
  buildExamSet,
  shuffleBank,
  bankStats,
  type CertId,
  type CertData,
  type Question,
  type BankProblem,
} from './data'
import { CodeLab } from './components/CodeLab'
import { CodeChallenges } from './components/CodeChallenges'
import { ProblemBank } from './components/ProblemBank'
import { CodeProblemPanel } from './components/CodeProblemPanel'
import { StudyPathView } from './components/StudyPathView'
import { useProgress } from './hooks/useProgress'
import { calculateReadiness, getDailyProgress } from './lib/readiness'
import { getStudyPath, getNextModule } from './data/studyPath'
import { STRINGS, formatScore } from './i18n/strings'
import './App.css'

type View = 'dashboard' | 'path' | 'bank' | 'study' | 'exam' | 'review' | 'flashcard' | 'bookmarks' | 'checklist' | 'codelab' | 'codechallenges'

interface StudySession {
  questionIds?: string[]
  topic?: string | 'all' | 'wrong'
  title?: string
  collection?: string
  moduleId?: string
  showConcept?: boolean
}

function bankToQuestion(p: BankProblem): Question {
  return {
    id: p.id,
    topic: p.topic,
    difficulty: p.difficulty,
    title: p.title,
    question: p.question,
    code: p.code,
    options: p.options,
    correctIndex: p.correctIndex,
    explanation: p.explanation,
    explanationKo: p.explanationKo,
    tags: p.tags,
    coachingTip: p.coachingTip,
    examStyle: p.examStyle,
    qualityTier: p.qualityTier,
  }
}


function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function calcExamScore(correct: number, total: number, certId: CertId): number {
  const pct = correct / total
  if (certId === 'clinical') return Math.round(pct * 100)
  return Math.round(200 + pct * 800)
}

function diffLabel(d: Question['difficulty']): string {
  return STRINGS.difficulty[d]
}

export default function App() {
  const [certId, setCertId] = useState<CertId>(loadSelectedCert)
  const [view, setView] = useState<View>('dashboard')
  const [studySession, setStudySession] = useState<StudySession>({ topic: 'all' })
  const [labCode, setLabCode] = useState<string | undefined>()
  const cert = getCert(certId)
  const { progress, streak, recordAnswer, toggleBookmark, toggleChecklist, recordExam, resetProgress } =
    useProgress(certId)

  const handleCertChange = (id: CertId) => {
    setCertId(id)
    saveSelectedCert(id)
    setView('dashboard')
    setStudySession({ topic: 'all' })
  }

  const startStudy = (session: StudySession) => {
    setStudySession(session)
    setView('study')
  }

  const stats = useMemo(() => {
    const { topics, checklist } = cert
    const bank = getBankProblems(certId)
    const total = bank.length
    const answered = Object.keys(progress.answered).length
    const correct = Object.values(progress.answered).filter((a) => a.correct).length
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0

    const byTopic = Object.keys(topics).map((topic) => {
      const topicQs = bank.filter((q) => q.topic === topic)
      const topicAnswered = topicQs.filter((q) => progress.answered[q.id])
      const topicCorrect = topicAnswered.filter((q) => progress.answered[q.id]?.correct)
      return {
        topic,
        total: topicQs.length,
        answered: topicAnswered.length,
        correct: topicCorrect.length,
      }
    })

    const wrongIds = bank
      .filter((q) => progress.answered[q.id] && !progress.answered[q.id].correct)
      .map((q) => q.id)

    const checklistDone = checklist.filter((c) => progress.checklist[c.id]).length
    const bStats = bankStats(certId)

    return { total, answered, correct, accuracy, byTopic, wrongIds, checklistDone, bStats }
  }, [progress, cert, certId])

  const navItems: { id: View; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '📊', label: STRINGS.nav.dashboard },
    { id: 'path', icon: '🎓', label: STRINGS.nav.studyPath },
    { id: 'bank', icon: '📚', label: STRINGS.nav.questionBank },
    { id: 'study', icon: '📖', label: STRINGS.nav.studyMode },
    { id: 'exam', icon: '🎯', label: STRINGS.nav.practiceExam },
    { id: 'review', icon: '🔄', label: STRINGS.nav.reviewMissed },
    { id: 'flashcard', icon: '🃏', label: STRINGS.nav.flashcards },
    { id: 'codechallenges', icon: '▶', label: STRINGS.nav.codeChallenges },
    { id: 'codelab', icon: '💻', label: STRINGS.nav.codeLab },
    { id: 'checklist', icon: '✅', label: STRINGS.nav.checklist },
    { id: 'bookmarks', icon: '⭐', label: STRINGS.nav.bookmarks },
  ]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div
            className="logo-icon"
            style={{ background: `linear-gradient(135deg, ${cert.color}, ${cert.color}99)` }}
          >
            SAS
          </div>
          <div>
            <h1>{cert.shortName} {STRINGS.appTitle}</h1>
            <span>{cert.subtitle}</span>
          </div>
        </div>

        <div className="cert-selector">
          <div className="cert-selector-label">{STRINGS.selectCert}</div>
          {CERT_ORDER.map((id) => {
            const c = CERTIFICATIONS[id]
            return (
              <button
                key={id}
                className={`cert-tab ${certId === id ? 'active' : ''}`}
                onClick={() => handleCertChange(id)}
                style={{ '--cert-color': c.color } as CSSProperties}
              >
                <span className="cert-tab-name">{c.shortName}</span>
                <span className="cert-tab-meta">
                  {bankStats(id).total} {STRINGS.questions} · {c.examInfo.examId}
                </span>
              </button>
            )
          })}
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'study') setStudySession({ topic: 'all' })
                if (item.id === 'review') setStudySession({ topic: 'wrong', title: STRINGS.modes.review.title })
                setView(item.id)
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="streak-badge">
          <div className="fire">🔥</div>
          <div className="count">{streak}</div>
          <div className="label">{STRINGS.dayStreak}</div>
        </div>
      </aside>

      <main className="main">
        {view === 'dashboard' && (
          <Dashboard
            cert={cert}
            certId={certId}
            stats={stats}
            progress={progress}
            onStartStudy={startStudy}
            onStartExam={() => setView('exam')}
            onStartFlashcard={() => setView('flashcard')}
            onOpenBank={() => setView('bank')}
            onOpenPath={() => setView('path')}
            onOpenLab={() => { setLabCode(undefined); setView('codelab') }}
            onOpenCodeChallenges={() => setView('codechallenges')}
            onReset={() => resetProgress(certId)}
          />
        )}
        {view === 'path' && (
          <StudyPathView
            cert={cert}
            progress={progress}
            onStartModule={(s) => {
              setStudySession({
                questionIds: s.questionIds,
                title: s.title,
                moduleId: s.moduleId,
                showConcept: s.showConcept,
              })
              setView('study')
            }}
            onStartExam={() => setView('exam')}
          />
        )}
        {view === 'bank' && (
          <ProblemBank
            cert={cert}
            progress={progress}
            onStartStudy={startStudy}
          />
        )}
        {view === 'study' && (
          <StudyMode
            cert={cert}
            session={studySession}
            progress={progress}
            onRecordAnswer={recordAnswer}
            onToggleBookmark={toggleBookmark}
            onOpenLab={(code) => { setLabCode(code); setView('codelab') }}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'exam' && (
          <ExamMode
            cert={cert}
            progress={progress}
            onRecordAnswer={recordAnswer}
            onRecordExam={recordExam}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'review' && (
          <StudyMode
            cert={cert}
            session={{ topic: 'wrong', title: STRINGS.modes.review.title }}
            progress={progress}
            onRecordAnswer={recordAnswer}
            onToggleBookmark={toggleBookmark}
            onOpenLab={(code) => { setLabCode(code); setView('codelab') }}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'codelab' && (
          <CodeLab initialCode={labCode} onBack={() => setView('dashboard')} />
        )}
        {view === 'codechallenges' && (
          <CodeChallenges certId={certId} onBack={() => setView('dashboard')} />
        )}
        {view === 'flashcard' && <FlashcardMode cert={cert} onBack={() => setView('dashboard')} />}
        {view === 'checklist' && (
          <ChecklistView cert={cert} progress={progress} onToggle={toggleChecklist} />
        )}
        {view === 'bookmarks' && (
          <BookmarkView
            cert={cert}
            progress={progress}
            onRecordAnswer={recordAnswer}
            onToggleBookmark={toggleBookmark}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  )
}

/* ─── Dashboard ─── */
interface DashboardStats {
  total: number
  answered: number
  correct: number
  accuracy: number
  byTopic: { topic: string; total: number; answered: number; correct: number }[]
  wrongIds: string[]
  checklistDone: number
}

function Dashboard({
  cert,
  certId,
  stats,
  progress,
  onStartStudy,
  onStartExam,
  onStartFlashcard,
  onOpenBank,
  onOpenPath,
  onOpenLab,
  onOpenCodeChallenges,
  onReset,
}: {
  cert: CertData
  certId: CertId
  stats: DashboardStats
  progress: ReturnType<typeof useProgress>['progress']
  onStartStudy: (s: StudySession) => void
  onStartExam: () => void
  onStartFlashcard: () => void
  onOpenBank: () => void
  onOpenPath: () => void
  onOpenLab: () => void
  onOpenCodeChallenges: () => void
  onReset: () => void
}) {
  const { topics, examInfo, checklist } = cert
  const S = STRINGS
  const SP = STRINGS.studyPath
  const readiness = useMemo(
    () => calculateReadiness(certId, progress, examInfo.passingScore, checklist.length),
    [certId, progress, examInfo.passingScore, checklist.length]
  )
  const daily = getDailyProgress(progress.dailyLog)
  const next = useMemo(() => getNextModule(certId, progress.answered), [certId, progress.answered])

  return (
    <>
      <div className="page-header">
        <h2>{S.dashboard.title}</h2>
        <p>{cert.fullName} {S.dashboard.subtitle}</p>
      </div>

      <div className="coach-hero coach-hero--compact">
        <div className="readiness-ring readiness-ring--sm" style={{ '--ring-color': readiness.color } as CSSProperties}>
          <svg viewBox="0 0 120 120" className="readiness-svg">
            <circle cx="60" cy="60" r="52" className="readiness-bg" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="readiness-fill"
              style={{ stroke: readiness.color, strokeDasharray: `${(readiness.score / 100) * 327} 327` }}
            />
          </svg>
          <div className="readiness-center">
            <span className="readiness-score">{readiness.score}%</span>
            <span className="readiness-label">{readiness.label}</span>
          </div>
        </div>
        <div className="coach-hero-body">
          <p className="coach-recommendation">{readiness.recommendation}</p>
          <div className="readiness-bars readiness-bars--compact">
            <DashboardReadinessBar label={SP.coverage} value={readiness.breakdown.coverage} />
            <DashboardReadinessBar label={SP.accuracy} value={readiness.breakdown.accuracy} />
            <DashboardReadinessBar label={SP.modules} value={readiness.breakdown.modules} />
            <DashboardReadinessBar label={SP.examSim} value={readiness.breakdown.examSim} />
          </div>
          <div className="daily-goal daily-goal--inline">
            <span>{SP.dailyGoal}: <strong>{daily.today}/{daily.goal}</strong></span>
            <div className="daily-goal-bar">
              <div className="daily-goal-fill" style={{ width: `${Math.min(100, (daily.today / daily.goal) * 100)}%` }} />
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={onOpenPath}>
          {SP.title} →
        </button>
      </div>

      {next && (
        <div className="coach-continue">
          <div>
            <span className="coach-continue-label">{SP.continue}</span>
            <h3>{next.module.title}</h3>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onStartStudy({
                questionIds: next.module.problemIds,
                title: next.module.title,
                moduleId: next.module.id,
                showConcept: true,
              })
            }
          >
            {SP.continueBtn} →
          </button>
        </div>
      )}

      {readiness.weakTopics.length > 0 && (
        <div className="weak-topics-panel">
          <h3>{SP.weakTopics}</h3>
          <p className="weak-topics-hint">{SP.weakTopicsHint}</p>
          <div className="weak-topics-chips">
            {readiness.weakTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="weak-topic-chip"
                onClick={() => onStartStudy({ topic, title: topics[topic]?.label })}
              >
                {topics[topic]?.label ?? topic}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="value">{stats.answered}/{stats.total}</div>
          <div className="label">{S.dashboard.completed}</div>
        </div>
        <div className="stat-card success">
          <div className="value">{stats.accuracy}%</div>
          <div className="label">{S.dashboard.accuracy}</div>
        </div>
        <div className="stat-card warning">
          <div className="value">{stats.wrongIds.length}</div>
          <div className="label">{S.dashboard.missed}</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.checklistDone}/{checklist.length}</div>
          <div className="label">{S.dashboard.checklistProgress}</div>
        </div>
      </div>

      <div className="page-header">
        <h2 style={{ fontSize: 20 }}>{S.dashboard.quickStart}</h2>
      </div>
      <div className="mode-grid">
        <button className="mode-card mode-card--featured" onClick={onOpenPath}>
          <div className="icon">🎓</div>
          <h3>{SP.title}</h3>
          <p>{SP.subtitle}</p>
        </button>
        <button className="mode-card" onClick={onOpenBank}>
          <div className="icon">📚</div>
          <h3>{S.modes.bank.title}</h3>
          <p>{S.modes.bank.desc}</p>
        </button>
        <button className="mode-card" onClick={() => onStartStudy({ topic: 'all', title: S.modes.study.title })}>
          <div className="icon">📖</div>
          <h3>{S.modes.study.title}</h3>
          <p>{stats.total} {S.questions} · {S.modes.study.desc}</p>
        </button>
        <button className="mode-card" onClick={onStartExam}>
          <div className="icon">🎯</div>
          <h3>{S.modes.exam.title}</h3>
          <p>{examInfo.questions} Q · {examInfo.minutes} {S.exam.minutes}</p>
        </button>
        <button className="mode-card" onClick={() => onStartStudy({ topic: 'wrong', title: S.modes.review.title })}>
          <div className="icon">🔄</div>
          <h3>{S.modes.review.title}</h3>
          <p>{S.modes.review.desc}</p>
        </button>
        <button className="mode-card" onClick={onOpenCodeChallenges}>
          <div className="icon">▶</div>
          <h3>{STRINGS.codeChallenges.title}</h3>
          <p>{STRINGS.codeChallenges.subtitle}</p>
        </button>
        <button className="mode-card" onClick={onOpenLab}>
          <div className="icon">💻</div>
          <h3>{STRINGS.nav.codeLab}</h3>
          <p>{STRINGS.codeLab.subtitle}</p>
        </button>
        <button className="mode-card" onClick={onStartFlashcard}>
          <div className="icon">🃏</div>
          <h3>{S.modes.flashcard.title}</h3>
          <p>{S.modes.flashcard.desc}</p>
        </button>
      </div>

      <div className="page-header">
        <h2 style={{ fontSize: 20 }}>{S.dashboard.topicProgress}</h2>
        <p>{S.dashboard.topicHint}</p>
      </div>
      <div className="topic-grid">
        {stats.byTopic.map((t) => {
          const pct = t.total > 0 ? Math.round((t.answered / t.total) * 100) : 0
          const acc = t.answered > 0 ? Math.round((t.correct / t.answered) * 100) : 0
          return (
            <button
              key={t.topic}
              className="topic-card"
              onClick={() =>
                onStartStudy({ topic: t.topic, title: topics[t.topic].label })
              }
            >
              <h3>{topics[t.topic].label}</h3>
              <div className="weight">Exam weight {topics[t.topic].weight}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${pct}%`, background: topics[t.topic].color }}
                />
              </div>
              <div className="progress-text">
                {t.answered}/{t.total} done · {acc}% accuracy
              </div>
            </button>
          )
        })}
      </div>

      {progress.examHistory.length > 0 && (
        <>
          <div className="page-header">
            <h2 style={{ fontSize: 20 }}>{S.dashboard.examHistory}</h2>
          </div>
          <div className="exam-info-box">
            {progress.examHistory.slice(0, 5).map((exam, i) => (
              <div key={i} className="result-row">
                <span>{new Date(exam.date).toLocaleDateString('en-US')}</span>
                <span>
                  {formatScore(exam.score, cert.id)} · {formatTime(exam.timeUsed)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button
          className="btn btn-ghost"
          onClick={() => {
            if (confirm(`${S.dashboard.resetConfirm} ${cert.shortName}?`)) onReset()
          }}
        >
          {S.dashboard.resetBtn} ({cert.shortName})
        </button>
      </div>
    </>
  )
}

/* ─── Dashboard helpers ─── */
function DashboardReadinessBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="readiness-bar-row readiness-bar-row--compact">
      <span className="readiness-bar-label">{label}</span>
      <div className="readiness-bar-track">
        <div className="readiness-bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="readiness-bar-pct">{value}%</span>
    </div>
  )
}

/* ─── Study Mode ─── */
function StudyMode({
  cert,
  session,
  progress,
  onRecordAnswer,
  onToggleBookmark,
  onOpenLab,
  onBack,
}: {
  cert: CertData
  session: StudySession
  progress: ReturnType<typeof useProgress>['progress']
  onRecordAnswer: (id: string, correct: boolean) => void
  onToggleBookmark: (id: string) => void
  onOpenLab?: (code: string) => void
  onBack: () => void
}) {
  const S = STRINGS
  const { topics } = cert
  const bank = useMemo(() => getBankProblems(cert.id), [cert.id])

  const [problemList, setProblemList] = useState<BankProblem[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [conceptDismissed, setConceptDismissed] = useState(!session.showConcept)

  const pathModule = useMemo(() => {
    if (!session.moduleId) return null
    return getStudyPath(cert.id).find((m) => m.id === session.moduleId) ?? null
  }, [session.moduleId, cert.id])

  useEffect(() => {
    setConceptDismissed(!session.showConcept)
  }, [session.moduleId, session.showConcept])

  useEffect(() => {
    let qs: BankProblem[]
    if (session.questionIds?.length) {
      const map = new Map(bank.map((q) => [q.id, q]))
      qs = session.questionIds.map((id) => map.get(id)).filter(Boolean) as BankProblem[]
    } else if (session.topic === 'wrong') {
      qs = bank.filter((q) => progress.answered[q.id] && !progress.answered[q.id].correct)
    } else if (session.topic && session.topic !== 'all') {
      qs = bank.filter((q) => q.topic === session.topic)
    } else {
      qs = [...bank]
    }
    setProblemList(shuffleBank(qs))
    setIndex(0)
    setSelected(null)
    setShowResult(false)
  }, [session, cert.id, bank, progress.answered])

  if (!conceptDismissed && pathModule) {
    const SP = STRINGS.studyPath
    return (
      <>
        <div className="page-header">
          <div className="mode-banner mode-banner--study">{pathModule.title}</div>
          <h2>{SP.conceptBanner}</h2>
        </div>
        <div className="concept-panel">
          <div className="module-concepts">
            <h4>{SP.keyConcepts}</h4>
            <ul>
              {pathModule.concepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="module-coach-tip">
            <strong>💡 {SP.coachTip}</strong>
            <p>{pathModule.coachingTip}</p>
          </div>
          <div className="concept-panel-actions">
            <button type="button" className="btn btn-secondary" onClick={onBack}>← {S.study.back}</button>
            <button type="button" className="btn btn-primary" onClick={() => setConceptDismissed(true)}>
              {SP.startQuiz} →
            </button>
          </div>
        </div>
      </>
    )
  }

  const reshuffle = () => {
    setProblemList(shuffleBank([...problemList]))
    setIndex(0)
    setSelected(null)
    setShowResult(false)
  }

  if (problemList.length === 0) {
    return (
      <>
        <div className="page-header">
          <h2>{session.title ?? S.modes.study.title}</h2>
        </div>
        <div className="empty-state">
          <div className="icon">🎉</div>
          <p>{session.topic === 'wrong' ? S.study.noMissed : S.study.noResults}</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onBack}>
            {S.study.back}
          </button>
        </div>
      </>
    )
  }

  const p = problemList[index]
  const isBookmarked = progress.bookmarked.includes(p.id)
  const title =
    session.title ??
    (session.topic === 'wrong'
      ? S.modes.review.title
      : session.topic && session.topic !== 'all'
        ? topics[session.topic]?.label
        : S.modes.study.title)

  const handleSelect = (optIdx: number) => {
    if (showResult) return
    setSelected(optIdx)
    setShowResult(true)
    onRecordAnswer(p.id, optIdx === p.correctIndex)
  }

  const handleNext = () => {
    if (index < problemList.length - 1) {
      setIndex(index + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="mode-banner mode-banner--study">{S.modes.study.title}</div>
        {p.kind === 'code' && <div className="mode-banner mode-banner--code">{S.codeChallenges.badge}</div>}
        <h2>{title}</h2>
        <p>
          {index + 1} / {problemList.length}
          <button className="btn btn-ghost" onClick={reshuffle} style={{ marginLeft: 12 }}>
            🔀 {S.study.shuffle}
          </button>
        </p>
      </div>

      <div className="quiz-container">
        {(p.coachingTip || pathModule?.coachingTip) && !showResult && (
          <div className="question-coach-tip">
            💡 <span>{p.coachingTip ?? pathModule?.coachingTip}</span>
          </div>
        )}
        {p.kind === 'code' ? (
          <div className="question-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className={`badge ${p.difficulty}`}>{diffLabel(p.difficulty)}</span>
                <span className="bank-id">{p.id}</span>
                <span className="kind-badge kind-badge--code">▶ Run</span>
              </div>
              <button className="btn btn-ghost" onClick={() => onToggleBookmark(p.id)}>
                {isBookmarked ? '⭐' : '☆'}
              </button>
            </div>
            <div className="question-text">{p.question}</div>
            <CodeProblemPanel
              problem={p}
              selected={selected}
              showResult={showResult}
              onSelect={handleSelect}
            />
            {showResult && (
              <div className="explanation">
                <h4>💡 {S.study.explanation}</h4>
                <p>{p.explanation}</p>
                {p.explanationKo && (
                  <div className="explanation-ko">
                    <h5>{S.study.explanationKo}</h5>
                    <p>{p.explanationKo}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <QuestionCard
            cert={cert}
            question={bankToQuestion(p)}
            selected={selected}
            showResult={showResult}
            onSelect={handleSelect}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => onToggleBookmark(p.id)}
            onTryInLab={p.code && onOpenLab ? () => onOpenLab(wrapCodeForLab(p.code!)) : undefined}
          />
        )}
        <div className="quiz-actions">
          <button className="btn btn-secondary" onClick={onBack}>← {S.study.back}</button>
          {showResult && index < problemList.length - 1 && (
            <button className="btn btn-primary" onClick={handleNext}>{S.study.next} →</button>
          )}
          {showResult && index === problemList.length - 1 && (
            <button className="btn btn-primary" onClick={onBack}>{S.study.done}</button>
          )}
        </div>
      </div>
    </>
  )
}

function wrapCodeForLab(snippet: string): string {
  if (/^\s*data\s+/im.test(snippet) || /^\s*proc\s+/im.test(snippet)) {
    return snippet.includes('run;') ? snippet : `${snippet}\nrun;`
  }
  return `/* Practice snippet */\n${snippet}\nrun;`
}

/* ─── Practice Exam Mode ─── */
function ExamMode({
  cert,
  progress,
  onRecordAnswer,
  onRecordExam,
  onBack,
}: {
  cert: CertData
  progress: ReturnType<typeof useProgress>['progress']
  onRecordAnswer: (id: string, correct: boolean) => void
  onRecordExam: ReturnType<typeof useProgress>['recordExam']
  onBack: () => void
}) {
  const S = STRINGS
  const { topics, examInfo } = cert
  const [phase, setPhase] = useState<'intro' | 'exam' | 'result'>('intro')
  const [examQuestions, setExamQuestions] = useState<BankProblem[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(examInfo.minutes * 60)

  const startExam = () => {
    setExamQuestions(buildExamSet(cert.id))
    setIndex(0)
    setAnswers({})
    setTimeLeft(examInfo.minutes * 60)
    setPhase('exam')
  }

  const finishExam = useCallback(() => {
    let correct = 0
    const topicBreakdown: Record<string, { correct: number; total: number }> = {}
    Object.keys(topics).forEach((t) => {
      topicBreakdown[t] = { correct: 0, total: 0 }
    })

    examQuestions.forEach((q) => {
      if (!topicBreakdown[q.topic]) topicBreakdown[q.topic] = { correct: 0, total: 0 }
      topicBreakdown[q.topic].total++
      const isCorrect = answers[q.id] === q.correctIndex
      if (isCorrect) {
        correct++
        topicBreakdown[q.topic].correct++
      }
      onRecordAnswer(q.id, isCorrect)
    })

    const timeUsed = examInfo.minutes * 60 - timeLeft
    onRecordExam({
      date: new Date().toISOString(),
      score: calcExamScore(correct, examQuestions.length, cert.id),
      total: examQuestions.length,
      timeUsed: timeUsed > 0 ? timeUsed : examInfo.minutes * 60,
      topicBreakdown,
    })
    setPhase('result')
  }, [examQuestions, answers, timeLeft, onRecordAnswer, onRecordExam, topics, examInfo, cert.id])

  useEffect(() => {
    if (phase !== 'exam') return
    if (timeLeft <= 0) {
      finishExam()
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [phase, timeLeft, finishExam])

  if (phase === 'intro') {
    return (
      <>
        <div className="page-header">
          <div className="mode-banner mode-banner--exam">{S.modes.exam.title}</div>
          <h2>{S.exam.title}</h2>
          <p>{S.exam.subtitle}</p>
        </div>
        <div className="exam-info-box">
          <h3>{S.exam.examInfo}</h3>
          <div className="exam-info-grid">
            <div className="exam-info-item">{S.exam.examId}: <strong>{examInfo.examId}</strong></div>
            <div className="exam-info-item">{S.exam.questionCount}: <strong>{examInfo.questions}</strong></div>
            <div className="exam-info-item">{S.exam.timeLimit}: <strong>{examInfo.minutes} {S.exam.minutes}</strong></div>
            <div className="exam-info-item">{S.exam.passing}: <strong>{examInfo.passingLabel}</strong></div>
            {examInfo.scoreRange && (
              <div className="exam-info-item">{S.exam.scoreRange}: <strong>{examInfo.scoreRange}</strong></div>
            )}
            {examInfo.prerequisite && (
              <div className="exam-info-item" style={{ gridColumn: '1 / -1' }}>
                {S.dashboard.prerequisite}: <strong>{examInfo.prerequisite}</strong>
              </div>
            )}
          </div>
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {S.exam.mixedNote}
            </p>
            <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-secondary)' }}>{S.exam.topicWeights}</h4>
            {examInfo.topics.map((t) => (
              <div key={t.topic} className="result-row">
                <span>{topics[t.topic]?.label ?? t.topic}</span>
                <span>{t.weight}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={startExam}>{S.exam.start}</button>
          <button className="btn btn-secondary" onClick={onBack}>{S.study.back}</button>
        </div>
      </>
    )
  }

  if (phase === 'result') {
    const correctCount = examQuestions.filter((q) => answers[q.id] === q.correctIndex).length
    const score = calcExamScore(correctCount, examQuestions.length, cert.id)
    const passed = score >= examInfo.passingScore

    return (
      <>
        <div className="page-header">
          <h2>{S.exam.results}</h2>
        </div>
        <div className="result-card">
          <div className={`result-score ${passed ? 'pass' : 'fail'}`}>
            {formatScore(score, cert.id)}
          </div>
          <div className="result-label">
            {passed ? `🎉 ${S.exam.passed}` : S.exam.failed} · {correctCount}/{examQuestions.length} {S.exam.correct}
          </div>
          <div className="result-breakdown">
            {Object.keys(topics).map((t) => {
              const topicQs = examQuestions.filter((q) => q.topic === t)
              if (topicQs.length === 0) return null
              const topicCorrect = topicQs.filter((q) => answers[q.id] === q.correctIndex).length
              return (
                <div key={t} className="result-row">
                  <span>{topics[t].label}</span>
                  <span>{topicCorrect}/{topicQs.length}</span>
                </div>
              )
            })}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={onBack}>
            {S.study.back}
          </button>
        </div>
      </>
    )
  }

  const q = examQuestions[index]

  return (
    <>
      <div className="quiz-header">
        <div className="quiz-meta">
          <span className="badge medium mode-banner--exam-inline">{S.modes.exam.title}</span>
          {q.kind === 'code' && <span className="kind-badge kind-badge--code">▶ Run</span>}
          <span>{index + 1} / {examQuestions.length}</span>
        </div>
        <div className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>⏱ {formatTime(timeLeft)}</div>
      </div>

      <div className="question-nav">
        {examQuestions.map((qq, i) => {
          const answered = answers[qq.id] !== undefined
          return (
            <button
              key={qq.id}
              className={`q-dot ${i === index ? 'current' : ''} ${
                answered ? 'answered-correct' : ''
              } ${qq.kind === 'code' ? 'q-dot--code' : ''}`}
              onClick={() => setIndex(i)}
              title={qq.kind === 'code' ? 'Run code' : undefined}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="quiz-container">
        {q.kind === 'code' ? (
          <div className="question-card">
            <div className="question-text">{q.question}</div>
            <CodeProblemPanel
              problem={q}
              selected={answers[q.id] ?? null}
              showResult={false}
              requireRun
              onSelect={(optIdx) => setAnswers({ ...answers, [q.id]: optIdx })}
            />
          </div>
        ) : (
          <QuestionCard
            cert={cert}
            question={bankToQuestion(q)}
            selected={answers[q.id] ?? null}
            showResult={false}
            onSelect={(optIdx) => setAnswers({ ...answers, [q.id]: optIdx })}
            isBookmarked={progress.bookmarked.includes(q.id)}
            onToggleBookmark={() => {}}
            hideExplanation
          />
        )}
        <div className="quiz-actions">
          <button className="btn btn-secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            ← {S.exam.previous}
          </button>
          {index < examQuestions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>{S.study.next} →</button>
          ) : (
            <button className="btn btn-primary" onClick={finishExam}>{S.exam.submit}</button>
          )}
        </div>
      </div>
    </>
  )
}

/* ─── Question Card ─── */
function QuestionCard({
  cert,
  question,
  selected,
  showResult,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  hideExplanation,
  onTryInLab,
}: {
  cert: CertData
  question: Question
  selected: number | null
  showResult: boolean
  onSelect: (idx: number) => void
  isBookmarked: boolean
  onToggleBookmark: () => void
  hideExplanation?: boolean
  onTryInLab?: () => void
}) {
  const S = STRINGS
  const letters = ['A', 'B', 'C', 'D']
  const topicInfo = cert.topics[question.topic]
  const paragraphs = question.question.split('\n\n')

  return (
    <div className="question-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {question.title && <span className="question-title">{question.title}</span>}
          <span className={`badge ${question.difficulty}`}>{diffLabel(question.difficulty)}</span>
          {question.examStyle && <span className="badge exam-style-badge">Exam</span>}
          {topicInfo && (
            <span className="badge" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
              {topicInfo.label}
            </span>
          )}
        </div>
        <button className="btn btn-ghost" onClick={onToggleBookmark}>
          {isBookmarked ? '⭐' : '☆'}
        </button>
      </div>

      <div className="question-text">
        {paragraphs.map((para, i) => (
          <p key={i} className={i < paragraphs.length - 1 ? 'question-scenario' : 'question-prompt'}>
            {para}
          </p>
        ))}
      </div>

      {question.code && (
        <div className="code-block">
          <pre>{question.code}</pre>
        </div>
      )}

      {question.code && onTryInLab && (
        <button className="btn btn-secondary btn-sm try-lab-btn" onClick={onTryInLab}>
          💻 {STRINGS.codeLab.tryInLab}
        </button>
      )}

      <div className="options">
        {question.options.map((opt, i) => {
          let className = 'option'
          if (selected === i) className += ' selected'
          if (showResult) {
            if (i === question.correctIndex) className += ' correct'
            else if (selected === i) className += ' incorrect'
          }
          return (
            <button key={i} className={className} onClick={() => onSelect(i)} disabled={showResult}>
              <span className="option-letter">{letters[i]}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {showResult && !hideExplanation && (
        <div className="explanation">
          <h4>💡 {S.study.explanation}</h4>
          <p>{question.explanation}</p>
          {question.explanationKo && (
            <div className="explanation-ko">
              <h5>{S.study.explanationKo}</h5>
              <p>{question.explanationKo}</p>
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            {S.study.tags}: {question.tags.join(', ')}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Flashcards ─── */
function FlashcardMode({ cert, onBack }: { cert: CertData; onBack: () => void }) {
  const S = STRINGS
  const cards = useMemo(
    () => shuffle(getBankProblems(cert.id).filter((p) => p.kind === 'mcq').map(bankToQuestion)),
    [cert.id]
  )
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = cards[index]
  const letters = ['A', 'B', 'C', 'D']

  return (
    <>
      <div className="page-header">
        <h2>{S.modes.flashcard.title}</h2>
        <p>{index + 1} / {cards.length} · {S.study.tapReveal}</p>
      </div>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h3>{S.study.question}</h3>
            <p>{card.question}</p>
            {card.code && (
              <div className="code-block" style={{ marginTop: 12 }}>
                <pre style={{ fontSize: 11 }}>{card.code}</pre>
              </div>
            )}
            <div className="flashcard-hint">{S.study.tapReveal}</div>
          </div>
          <div className="flashcard-back">
            <h3>{S.study.answer}: {letters[card.correctIndex]}</h3>
            <p>{card.options[card.correctIndex]}</p>
            <div className="explanation" style={{ marginTop: 16 }}>
              <p>{card.explanation}</p>
              {card.explanationKo && (
                <div className="explanation-ko">
                  <p>{card.explanationKo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="quiz-actions" style={{ maxWidth: 600, margin: '0 auto' }}>
        <button className="btn btn-secondary" onClick={() => { setFlipped(false); setIndex((index - 1 + cards.length) % cards.length) }}>
          ← {S.exam.previous}
        </button>
        <button className="btn btn-secondary" onClick={onBack}>{S.study.back}</button>
        <button className="btn btn-primary" onClick={() => { setFlipped(false); setIndex((index + 1) % cards.length) }}>
          {S.study.next} →
        </button>
      </div>
    </>
  )
}

/* ─── Checklist ─── */
function ChecklistView({
  cert,
  progress,
  onToggle,
}: {
  cert: CertData
  progress: ReturnType<typeof useProgress>['progress']
  onToggle: (id: string) => void
}) {
  const S = STRINGS
  const { checklist, topics } = cert
  const done = checklist.filter((c) => progress.checklist[c.id]).length

  return (
    <>
      <div className="page-header">
        <h2>{S.checklist.title}</h2>
        <p>{done}/{checklist.length} {S.checklist.done} · {cert.shortName}</p>
      </div>
      <div className="checklist">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`checklist-item ${progress.checklist[item.id] ? 'done' : ''}`}
            onClick={() => onToggle(item.id)}
          >
            <div className="checkbox">{progress.checklist[item.id] && '✓'}</div>
            <span className="check-text">{item.text}</span>
            <span className="check-topic">{topics[item.topic]?.label ?? item.topic}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Bookmarks ─── */
function BookmarkView({
  cert,
  progress,
  onRecordAnswer,
  onToggleBookmark,
  onBack,
}: {
  cert: CertData
  progress: ReturnType<typeof useProgress>['progress']
  onRecordAnswer: (id: string, correct: boolean) => void
  onToggleBookmark: (id: string) => void
  onBack: () => void
}) {
  const S = STRINGS
  const bookmarkedProblems = useMemo(
    () => getBankProblems(cert.id).filter((p) => progress.bookmarked.includes(p.id)),
    [cert.id, progress.bookmarked]
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  if (bookmarkedProblems.length === 0) {
    return (
      <>
        <div className="page-header"><h2>{S.bookmarks.title}</h2></div>
        <div className="empty-state">
          <div className="icon">⭐</div>
          <p>{S.bookmarks.empty}</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onBack}>
            {S.bookmarks.goStudy}
          </button>
        </div>
      </>
    )
  }

  const p = bookmarkedProblems[index]

  return (
    <>
      <div className="page-header">
        <h2>{S.bookmarks.title}</h2>
        <p>{index + 1} / {bookmarkedProblems.length}</p>
      </div>
      <div className="quiz-container">
        {p.kind === 'code' ? (
          <div className="question-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className={`badge ${p.difficulty}`}>{diffLabel(p.difficulty)}</span>
                <span className="kind-badge kind-badge--code">▶ Run</span>
              </div>
              <button className="btn btn-ghost" onClick={() => {
                onToggleBookmark(p.id)
                if (index >= bookmarkedProblems.length - 1) setIndex(Math.max(0, index - 1))
              }}>
                ⭐
              </button>
            </div>
            <div className="question-text">{p.question}</div>
            <CodeProblemPanel
              problem={p}
              selected={selected}
              showResult={showResult}
              onSelect={(optIdx) => {
                setSelected(optIdx)
                setShowResult(true)
                onRecordAnswer(p.id, optIdx === p.correctIndex)
              }}
            />
            {showResult && (
              <div className="explanation">
                <h4>💡 {S.study.explanation}</h4>
                <p>{p.explanation}</p>
                {p.explanationKo && (
                  <div className="explanation-ko">
                    <h5>{S.study.explanationKo}</h5>
                    <p>{p.explanationKo}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <QuestionCard
            cert={cert}
            question={bankToQuestion(p)}
            selected={selected}
            showResult={showResult}
            onSelect={(optIdx) => {
              setSelected(optIdx)
              setShowResult(true)
              onRecordAnswer(p.id, optIdx === p.correctIndex)
            }}
            isBookmarked
            onToggleBookmark={() => {
              onToggleBookmark(p.id)
              if (index >= bookmarkedProblems.length - 1) setIndex(Math.max(0, index - 1))
            }}
          />
        )}
        <div className="quiz-actions">
          <button className="btn btn-secondary" onClick={onBack}>← {S.study.back}</button>
          {index < bookmarkedProblems.length - 1 && showResult && (
            <button
              className="btn btn-primary"
              onClick={() => { setIndex(index + 1); setSelected(null); setShowResult(false) }}
            >
              {S.study.next} →
            </button>
          )}
        </div>
      </div>
    </>
  )
}
