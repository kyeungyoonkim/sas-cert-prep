import { useState, useCallback, useEffect } from 'react'
import { runSasCode } from '../lib/sasSimulator'
import type { CodeChallenge } from '../data/codeChallenges'
import type { useProgress } from '../hooks/useProgress'
import { STRINGS } from '../i18n/strings'
import { AnswerReveal } from './AnswerReveal'

export function ChallengePlayer({
  challenge,
  challenges,
  progress,
  onRecordAnswer,
  onToggleBookmark,
  onSelect,
  onBack,
  onExit,
}: {
  challenge: CodeChallenge
  challenges: CodeChallenge[]
  progress: ReturnType<typeof useProgress>['progress']
  onRecordAnswer: (id: string, correct: boolean) => void
  onToggleBookmark: (id: string) => void
  onSelect: (id: string) => void
  onBack: () => void
  onExit?: () => void
}) {
  const S = STRINGS.codeChallenges
  const [code, setCode] = useState(challenge.starterCode)
  const [log, setLog] = useState<string[]>([])
  const [listing, setListing] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [activeTab, setActiveTab] = useState<'output' | 'log'>('output')

  const idx = challenges.findIndex((c) => c.id === challenge.id)

  const solutionDisplay =
    challenge.solutionCode.trim().startsWith('/*') ||
    !/^\s*data\s+/im.test(challenge.solutionCode)
      ? challenge.starterCode
      : challenge.solutionCode

  useEffect(() => {
    setCode(challenge.starterCode)
    setSelected(null)
    setShowResult(false)
    setHasRun(false)
    setLog([])
    setListing([])
    setErrors([])
  }, [challenge.id, challenge.starterCode])

  const handleRun = useCallback(() => {
    const result = runSasCode(code)
    setLog(result.log)
    setListing(result.listing)
    setErrors(result.errors)
    setHasRun(true)
    setActiveTab(result.errors.length ? 'log' : 'output')
  }, [code])

  const handleAnswer = (i: number) => {
    if (!hasRun || showResult) return
    setSelected(i)
    setShowResult(true)
    onRecordAnswer(challenge.id, i === challenge.correctIndex)
  }

  const handleRetry = () => {
    setSelected(null)
    setShowResult(false)
  }

  const handleNext = () => {
    if (idx < challenges.length - 1) onSelect(challenges[idx + 1].id)
  }

  const isCorrect = selected !== null && selected === challenge.correctIndex
  const isBookmarked = progress.bookmarked.includes(challenge.id)
  const letters = ['A', 'B', 'C', 'D']

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div className="mode-banner mode-banner--code">{S.badge}</div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onToggleBookmark(challenge.id)}
            title="Bookmark"
          >
            {isBookmarked ? '⭐' : '☆'}
          </button>
        </div>
        <h2>{challenge.title}</h2>
        <p>{challenge.instruction}</p>
        {challenge.hint && <p className="challenge-hint">💡 Hint: {challenge.hint}</p>}
        <p className="challenge-progress">{idx + 1} / {challenges.length}</p>
      </div>

      <div className="codelab-layout challenge-layout">
        <div className="codelab-editor-wrap">
          <div className="codelab-panel-header">
            <span>{STRINGS.codeLab.editor}</span>
            <div className="codelab-header-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCode(challenge.starterCode)}>
                Reset
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleRun}>
                ▶ {STRINGS.codeLab.run}
              </button>
            </div>
          </div>
          <textarea
            className="codelab-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                handleRun()
              }
            }}
          />
          <div className="codelab-hint">{STRINGS.codeLab.shortcut}</div>
        </div>

        <div className="codelab-output-wrap">
          <div className="codelab-tabs">
            <button
              type="button"
              className={`codelab-tab ${activeTab === 'output' ? 'active' : ''}`}
              onClick={() => setActiveTab('output')}
            >
              {STRINGS.codeLab.output}
            </button>
            <button
              type="button"
              className={`codelab-tab ${activeTab === 'log' ? 'active' : ''}`}
              onClick={() => setActiveTab('log')}
            >
              {STRINGS.codeLab.log}
            </button>
          </div>
          <pre className={`codelab-panel ${activeTab === 'log' ? 'codelab-log' : 'codelab-listing'}`}>
            {activeTab === 'log'
              ? [...errors, ...log].join('\n') || STRINGS.codeLab.runHint
              : listing.join('\n') || STRINGS.codeLab.runHint}
          </pre>
        </div>
      </div>

      <div className="challenge-answer-section">
        <h3>{S.answerPrompt}</h3>
        {!hasRun && <p className="run-first-msg">⚠️ {S.runFirst}</p>}
        <div className="options">
          {challenge.options.map((opt, i) => {
            let cls = 'option'
            if (!hasRun) cls += ' option--locked'
            if (selected === i) cls += ' selected'
            if (showResult) {
              if (i === challenge.correctIndex) cls += ' correct'
              else if (selected === i) cls += ' incorrect'
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onClick={() => handleAnswer(i)}
                disabled={!hasRun || showResult}
              >
                <span className="option-letter">{letters[i]}</span>
                <span>{opt}</span>
              </button>
            )
          })}
        </div>

        {showResult && (
          <AnswerReveal
            options={challenge.options}
            correctIndex={challenge.correctIndex}
            selected={selected}
          />
        )}

        {showResult && (
          <div className="explanation">
            <h4>💡 {STRINGS.study.explanation}</h4>
            <p>{challenge.explanation}</p>
            {challenge.explanationKo && (
              <div className="explanation-ko">
                <h5>{STRINGS.study.explanationKo}</h5>
                <p>{challenge.explanationKo}</p>
              </div>
            )}
            <details className="solution-details">
              <summary>{S.showSolution}</summary>
              <pre className="code-block">{solutionDisplay}</pre>
            </details>
          </div>
        )}
      </div>

      <div className="quiz-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>← {S.allChallenges}</button>
        <div className="quiz-actions-right">
          {showResult && !isCorrect && (
            <button type="button" className="btn btn-secondary" onClick={handleRetry}>
              🔄 {STRINGS.study.retry}
            </button>
          )}
          {showResult && idx < challenges.length - 1 && (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              {isCorrect ? `${S.nextChallenge} →` : STRINGS.study.continueAfterReview}
            </button>
          )}
          {showResult && idx === challenges.length - 1 && onExit && (
            <button type="button" className="btn btn-primary" onClick={onExit}>{STRINGS.study.done}</button>
          )}
        </div>
      </div>
    </>
  )
}
