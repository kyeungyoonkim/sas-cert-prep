import { useState } from 'react'
import { getChallengesForCert, type CodeChallenge } from '../data/codeChallenges'
import type { CertId } from '../data/types'
import type { useProgress } from '../hooks/useProgress'
import { STRINGS } from '../i18n/strings'
import { ChallengePlayer } from './ChallengePlayer'

interface CodeChallengesProps {
  certId: CertId
  progress: ReturnType<typeof useProgress>['progress']
  onRecordAnswer: (id: string, correct: boolean) => void
  onToggleBookmark: (id: string) => void
  onBack?: () => void
}

export function CodeChallenges({
  certId,
  progress,
  onRecordAnswer,
  onToggleBookmark,
  onBack,
}: CodeChallengesProps) {
  const challenges = getChallengesForCert(certId)
  const [activeId, setActiveId] = useState<string | null>(null)

  if (challenges.length === 0) {
    return (
      <div className="empty-state">
        <p>No code challenges for this certification yet.</p>
      </div>
    )
  }

  const challenge = activeId ? challenges.find((c) => c.id === activeId) : null

  if (!challenge) {
    return (
      <ChallengeList
        challenges={challenges}
        progress={progress}
        onSelect={setActiveId}
        onBack={onBack}
      />
    )
  }

  return (
    <ChallengePlayer
      challenge={challenge}
      challenges={challenges}
      progress={progress}
      onRecordAnswer={onRecordAnswer}
      onToggleBookmark={onToggleBookmark}
      onSelect={setActiveId}
      onBack={() => setActiveId(null)}
      onExit={onBack}
    />
  )
}

function ChallengeList({
  challenges,
  progress,
  onSelect,
  onBack,
}: {
  challenges: CodeChallenge[]
  progress: ReturnType<typeof useProgress>['progress']
  onSelect: (id: string) => void
  onBack?: () => void
}) {
  const S = STRINGS.codeChallenges
  const doneCount = challenges.filter((c) => progress.answered[c.id]?.correct).length
  return (
    <>
      <div className="page-header">
        <div className="mode-banner mode-banner--code">{S.badge}</div>
        <h2>{S.title}</h2>
        <p>{S.subtitle} · {doneCount}/{challenges.length} solved</p>
      </div>
      <div className="bank-list">
        {challenges.map((c) => {
          const rec = progress.answered[c.id]
          const status = !rec ? 'new' : rec.correct ? 'correct' : 'wrong'
          return (
            <button
              key={c.id}
              type="button"
              className={`bank-item bank-item--${status} challenge-item`}
              onClick={() => onSelect(c.id)}
            >
              <div className="bank-item-main">
                <div className="bank-item-meta">
                  <span className="bank-id">{c.id}</span>
                  <span className={`badge ${c.difficulty}`}>{c.difficulty}</span>
                  <span className="run-badge">▶ Run code</span>
                  {status === 'correct' && <span className="challenge-status challenge-status--ok">✓</span>}
                  {status === 'wrong' && <span className="challenge-status challenge-status--bad">✗</span>}
                  {progress.bookmarked.includes(c.id) && <span className="bookmark-star">⭐</span>}
                </div>
                <p className="challenge-item-title">{c.title}</p>
                <p className="bank-item-text">{c.instruction}</p>
              </div>
            </button>
          )
        })}
      </div>
      {onBack && (
        <button type="button" className="btn btn-secondary" style={{ marginTop: 20 }} onClick={onBack}>
          ← {STRINGS.study.back}
        </button>
      )}
    </>
  )
}
