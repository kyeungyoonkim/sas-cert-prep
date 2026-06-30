import { useState, useCallback, useEffect } from 'react'
import { runSasCode } from '../lib/sasSimulator'
import type { BankProblem } from '../data/types'
import { STRINGS } from '../i18n/strings'

export function CodeProblemPanel({
  problem,
  selected,
  showResult,
  requireRun = true,
  onSelect,
  compact = false,
}: {
  problem: BankProblem
  selected: number | null
  showResult: boolean
  requireRun?: boolean
  onSelect: (index: number) => void
  compact?: boolean
}) {
  const S = STRINGS.codeChallenges
  const [code, setCode] = useState(problem.starterCode ?? '')
  const [log, setLog] = useState<string[]>([])
  const [listing, setListing] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [activeTab, setActiveTab] = useState<'output' | 'log'>('output')

  useEffect(() => {
    setCode(problem.starterCode ?? '')
    setHasRun(false)
    setLog([])
    setListing([])
    setErrors([])
  }, [problem.id, problem.starterCode])

  const handleRun = useCallback(() => {
    const result = runSasCode(code)
    setLog(result.log)
    setListing(result.listing)
    setErrors(result.errors)
    setHasRun(true)
    setActiveTab(result.errors.length ? 'log' : 'output')
  }, [code])

  const canAnswer = !requireRun || hasRun
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className={`code-problem-panel ${compact ? 'code-problem-panel--compact' : ''}`}>
      {problem.hint && <p className="challenge-hint">💡 {problem.hint}</p>}

      <div className="codelab-layout challenge-layout">
        <div className="codelab-editor-wrap">
          <div className="codelab-panel-header">
            <span>{STRINGS.codeLab.editor}</span>
            <div className="codelab-header-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCode(problem.starterCode ?? '')}>
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
          />
        </div>

        <div className="codelab-output-wrap">
          <div className="codelab-tabs">
            <button
              type="button"
              className={activeTab === 'output' ? 'active' : ''}
              onClick={() => setActiveTab('output')}
            >
              {STRINGS.codeLab.output}
            </button>
            <button
              type="button"
              className={activeTab === 'log' ? 'active' : ''}
              onClick={() => setActiveTab('log')}
            >
              {STRINGS.codeLab.log}
            </button>
          </div>
          <pre className="codelab-output">
            {activeTab === 'output'
              ? listing.length
                ? listing.join('\n')
                : hasRun
                  ? '(no listing — check Log tab)'
                  : S.runFirst
              : [...log, ...errors.map((e) => `ERROR: ${e}`)].join('\n') || S.runFirst}
          </pre>
        </div>
      </div>

      {!hasRun && requireRun && (
        <p className="code-run-reminder">{S.runBeforeAnswer}</p>
      )}

      <div className="options-grid" style={{ marginTop: 16 }}>
        {problem.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = i === problem.correctIndex
          let cls = 'option-btn'
          if (showResult && isCorrect) cls += ' correct'
          else if (showResult && isSelected && !isCorrect) cls += ' wrong'
          else if (isSelected) cls += ' selected'
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={!canAnswer || showResult}
              onClick={() => onSelect(i)}
            >
              <span className="option-letter">{letters[i]}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
