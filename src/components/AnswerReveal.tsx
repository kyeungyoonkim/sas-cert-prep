import { STRINGS } from '../i18n/strings'

const LETTERS = ['A', 'B', 'C', 'D']

export function AnswerReveal({
  options,
  correctIndex,
  selected,
}: {
  options: string[]
  correctIndex: number
  selected: number | null
}) {
  const S = STRINGS.study
  const isCorrect = selected === correctIndex

  return (
    <div className={`answer-reveal ${isCorrect ? 'answer-reveal--correct' : 'answer-reveal--wrong'}`}>
      <div className="answer-reveal-status">
        {isCorrect ? `✓ ${S.correct}` : `✗ ${S.incorrect}`}
      </div>

      {!isCorrect && selected !== null && (
        <div className="answer-reveal-row answer-reveal-row--yours">
          <span className="answer-reveal-label">{S.yourAnswer}</span>
          <span className="answer-reveal-letter">{LETTERS[selected]}</span>
          <span className="answer-reveal-text">{options[selected]}</span>
        </div>
      )}

      <div className="answer-reveal-row answer-reveal-row--correct">
        <span className="answer-reveal-label">{isCorrect ? S.answer : S.correctAnswer}</span>
        <span className="answer-reveal-letter answer-reveal-letter--ok">{LETTERS[correctIndex]}</span>
        <span className="answer-reveal-text">{options[correctIndex]}</span>
      </div>
    </div>
  )
}
