import type { CertData, Question } from '../data/types'
import { STRINGS } from '../i18n/strings'
import { AnswerReveal } from './AnswerReveal'

function diffLabel(d: Question['difficulty']): string {
  return STRINGS.difficulty[d]
}

export function QuestionCard({
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

      {showResult && (
        <AnswerReveal
          options={question.options}
          correctIndex={question.correctIndex}
          selected={selected}
        />
      )}

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
