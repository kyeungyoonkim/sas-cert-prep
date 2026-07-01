import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  getBankProblems,
  shuffleBank,
  type CertData,
  type BankProblem,
  type Question,
} from '../data'
import { getStudyPath } from '../data/studyPath'
import type { useProgress } from '../hooks/useProgress'
import { STRINGS } from '../i18n/strings'
import { CodeProblemPanel } from './CodeProblemPanel'
import { QuestionCard } from './QuestionCard'

export interface StudySession {
  questionIds?: string[]
  topic?: string | 'all' | 'wrong'
  title?: string
  collection?: string
  moduleId?: string
  showConcept?: boolean
}

type StudyPhase = 'concept' | 'setup' | 'quiz' | 'summary'

const SESSION_SIZES = [10, 15, 20, 30] as const

function buildStudyPool(
  session: StudySession,
  bank: BankProblem[],
  answered: Record<string, { correct: boolean }>
): BankProblem[] {
  if (session.questionIds?.length) {
    const map = new Map(bank.map((q) => [q.id, q]))
    return session.questionIds.map((id) => map.get(id)).filter(Boolean) as BankProblem[]
  }
  if (session.topic === 'wrong') {
    return bank.filter((q) => answered[q.id] && !answered[q.id].correct)
  }
  if (session.topic && session.topic !== 'all') {
    return bank.filter((q) => q.topic === session.topic)
  }
  return [...bank]
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

function wrapCodeForLab(snippet: string): string {
  if (/^\s*data\s+/im.test(snippet) || /^\s*proc\s+/im.test(snippet)) {
    return snippet.includes('run;') ? snippet : `${snippet}\nrun;`
  }
  return `/* Practice snippet */\n${snippet}\nrun;`
}

function diffLabel(d: Question['difficulty']): string {
  return STRINGS.difficulty[d]
}

export function StudyMode({
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
  const letters = ['A', 'B', 'C', 'D']

  const sourcePool = useMemo(
    () => buildStudyPool(session, bank, progress.answered),
    // Snapshot pool when session changes — NOT when each answer is recorded
    [session, bank, progress.answered]
  )

  const pathModule = useMemo(() => {
    if (!session.moduleId) return null
    return getStudyPath(cert.id).find((m) => m.id === session.moduleId) ?? null
  }, [session.moduleId, cert.id])

  const [phase, setPhase] = useState<StudyPhase>(() => {
    if (session.showConcept && session.moduleId) return 'concept'
    if (session.questionIds?.length) return 'quiz'
    return 'setup'
  })
  const [sessionSize, setSessionSize] = useState(15)
  const [problemList, setProblemList] = useState<BankProblem[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({})

  const title =
    session.title ??
    (session.topic === 'wrong'
      ? S.modes.review.title
      : session.topic && session.topic !== 'all'
        ? topics[session.topic]?.label
        : S.modes.study.title)

  const beginSession = useCallback(
    (size: number, pool: BankProblem[] = sourcePool) => {
      let qs = shuffleBank([...pool])
      if (size > 0 && qs.length > size) qs = qs.slice(0, size)
      setProblemList(qs)
      setSessionResults({})
      setIndex(0)
      setSelected(null)
      setShowResult(false)
      setPhase('quiz')
    },
    [sourcePool]
  )

  useEffect(() => {
    if (session.showConcept && session.moduleId) {
      setPhase('concept')
      return
    }
    if (session.questionIds?.length) {
      beginSession(0)
      return
    }
    if (session.topic === 'wrong') {
      const pool = buildStudyPool(session, bank, progress.answered)
      if (pool.length > 0) {
        beginSession(0, pool)
      } else {
        setPhase('setup')
      }
      return
    }
    setPhase('setup')
    setProblemList([])
    setSessionResults({})
    setIndex(0)
    setSelected(null)
    setShowResult(false)
  }, [session, cert.id, bank, progress.answered, beginSession])

  const sessionCorrect = Object.values(sessionResults).filter(Boolean).length
  const sessionWrong = Object.values(sessionResults).filter((v) => !v).length
  const sessionAnswered = Object.keys(sessionResults).length

  const handleSelect = (optIdx: number) => {
    if (showResult || !problemList[index]) return
    const p = problemList[index]
    const isCorrect = optIdx === p.correctIndex
    setSelected(optIdx)
    setShowResult(true)
    setSessionResults((prev) => ({ ...prev, [p.id]: isCorrect }))
    onRecordAnswer(p.id, isCorrect)
  }

  const handleRetry = () => {
    setSelected(null)
    setShowResult(false)
  }

  const goToQuestion = (i: number) => {
    setIndex(i)
    setSelected(null)
    setShowResult(false)
  }

  const handleNext = () => {
    if (index < problemList.length - 1) {
      setIndex(index + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setPhase('summary')
    }
  }

  const retryMissed = () => {
    const missed = problemList.filter((p) => sessionResults[p.id] === false)
    if (missed.length === 0) return
    setProblemList(shuffleBank(missed))
    setSessionResults({})
    setIndex(0)
    setSelected(null)
    setShowResult(false)
    setPhase('quiz')
  }

  if (phase === 'concept' && pathModule) {
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
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              ← {S.study.back}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => beginSession(0)}>
              {SP.startQuiz} →
            </button>
          </div>
        </div>
      </>
    )
  }

  if (phase === 'setup') {
    if (sourcePool.length === 0) {
      return (
        <>
          <div className="page-header">
            <h2>{title}</h2>
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

    return (
      <>
        <div className="page-header">
          <div className="mode-banner mode-banner--study">{S.modes.study.title}</div>
          <h2>{title}</h2>
          <p>{S.study.sessionSetupHint}</p>
        </div>
        <div className="study-setup-card">
          <div className="study-setup-meta">
            <span className="study-setup-count">{sourcePool.length}</span>
            <span>{S.study.questionsAvailable}</span>
          </div>
          <div className="study-size-grid">
            {SESSION_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                className={`study-size-btn ${sessionSize === n ? 'active' : ''}`}
                onClick={() => setSessionSize(n)}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              className={`study-size-btn ${sessionSize === 0 ? 'active' : ''}`}
              onClick={() => setSessionSize(0)}
            >
              {S.study.allQuestions}
            </button>
          </div>
          <div className="study-setup-actions">
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              ← {S.study.back}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => beginSession(sessionSize)}
            >
              {S.study.startSession} →
            </button>
          </div>
        </div>
      </>
    )
  }

  if (phase === 'summary') {
    const total = problemList.length
    const pct = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    const missed = problemList.filter((p) => sessionResults[p.id] === false)

    return (
      <>
        <div className="page-header">
          <div className="mode-banner mode-banner--study">{S.study.sessionComplete}</div>
          <h2>{title}</h2>
        </div>
        <div className="study-summary-card">
          <div className={`study-summary-score ${pct >= 70 ? 'pass' : ''}`}>
            {sessionCorrect}/{total}
          </div>
          <p className="study-summary-label">
            {S.study.sessionScore} · {pct}%
          </p>
          <div className="study-summary-breakdown">
            <span className="study-summary-stat study-summary-stat--ok">✓ {sessionCorrect}</span>
            <span className="study-summary-stat study-summary-stat--bad">✗ {sessionWrong}</span>
          </div>
          {missed.length > 0 && (
            <div className="study-missed-list">
              <h4>{S.modes.review.title}</h4>
              <ul>
                {missed.map((p) => (
                  <li key={p.id}>
                    <span className="bank-id">{p.id}</span> {p.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="study-setup-actions">
            {missed.length > 0 && (
              <button type="button" className="btn btn-secondary" onClick={retryMissed}>
                🔄 {S.study.retryMissed} ({missed.length})
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={() => setPhase('setup')}>
              {S.study.newSession}
            </button>
            <button type="button" className="btn btn-primary" onClick={onBack}>
              {S.study.done}
            </button>
          </div>
        </div>
      </>
    )
  }

  if (problemList.length === 0) {
    return (
      <>
        <div className="page-header">
          <h2>{title}</h2>
        </div>
        <div className="empty-state">
          <p>{S.study.noResults}</p>
          <button className="btn btn-primary" onClick={onBack}>{S.study.back}</button>
        </div>
      </>
    )
  }

  const p = problemList[index]
  const isBookmarked = progress.bookmarked.includes(p.id)
  const isCorrect = selected !== null && selected === p.correctIndex

  return (
    <>
      <div className="page-header">
        <div className="mode-banner mode-banner--study">{S.modes.study.title}</div>
        {p.kind === 'code' && <div className="mode-banner mode-banner--code">{STRINGS.codeChallenges.badge}</div>}
        <h2>{title}</h2>
        <div className="study-session-stats">
          <span>{index + 1} / {problemList.length}</span>
          <span className="study-session-stats__sep">·</span>
          <span className="study-stat-ok">✓ {sessionCorrect}</span>
          <span className="study-stat-bad">✗ {sessionWrong}</span>
          {sessionAnswered > 0 && (
            <>
              <span className="study-session-stats__sep">·</span>
              <span>{Math.round((sessionCorrect / sessionAnswered) * 100)}%</span>
            </>
          )}
        </div>
      </div>

      <div className="study-progress-bar">
        <div
          className="study-progress-fill study-progress-fill--ok"
          style={{ width: `${(sessionCorrect / problemList.length) * 100}%` }}
        />
        <div
          className="study-progress-fill study-progress-fill--bad"
          style={{
            width: `${(sessionWrong / problemList.length) * 100}%`,
            marginLeft: `${(sessionCorrect / problemList.length) * 100}%`,
          }}
        />
      </div>

      <div className="question-nav study-question-nav">
        {problemList.map((qq, i) => {
          const result = sessionResults[qq.id]
          const answered = result !== undefined
          return (
            <button
              key={qq.id}
              type="button"
              className={`q-dot ${i === index ? 'current' : ''} ${
                answered ? (result ? 'answered-correct' : 'answered-wrong') : ''
              } ${qq.kind === 'code' ? 'q-dot--code' : ''}`}
              onClick={() => goToQuestion(i)}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="quiz-container">
        {(p.coachingTip || pathModule?.coachingTip) && !showResult && (
          <div className="question-coach-tip">
            💡 <span>{p.coachingTip ?? pathModule?.coachingTip}</span>
          </div>
        )}

        {showResult && (
          <div className={`study-feedback ${isCorrect ? 'study-feedback--correct' : 'study-feedback--incorrect'}`}>
            <div className="study-feedback-title">
              {isCorrect ? `✓ ${S.study.correct}` : `✗ ${S.study.incorrect}`}
            </div>
            {!isCorrect && (
              <div className="study-feedback-answer">
                {S.study.correctAnswer}: <strong>{letters[p.correctIndex]}</strong>
                {' — '}
                {p.options[p.correctIndex]}
              </div>
            )}
            <p className="study-feedback-hint">{S.study.reviewExplanation}</p>
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
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            ← {S.study.back}
          </button>
          <div className="quiz-actions-right">
            {showResult && !isCorrect && (
              <button type="button" className="btn btn-secondary" onClick={handleRetry}>
                🔄 {S.study.retry}
              </button>
            )}
            {showResult && (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                {index < problemList.length - 1 ? `${S.study.next} →` : S.study.done}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
