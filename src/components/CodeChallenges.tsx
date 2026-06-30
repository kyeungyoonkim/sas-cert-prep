import { useState } from 'react'
import { getChallengesForCert, type CodeChallenge } from '../data/codeChallenges'
import type { CertId } from '../data/types'
import { STRINGS } from '../i18n/strings'
import { ChallengePlayer } from './ChallengePlayer'

interface CodeChallengesProps {
  certId: CertId
  onBack?: () => void
}

export function CodeChallenges({ certId, onBack }: CodeChallengesProps) {
  const challenges = getChallengesForCert(certId)
  const [activeId, setActiveId] = useState<string | null>(null)

  if (challenges.length === 0) {
    return (
      <div className="empty-state">
        <p>No code challenges for this certification yet.</p>
      </div>
    )
  }

  if (!activeId) {
    return (
      <ChallengeList challenges={challenges} onSelect={setActiveId} onBack={onBack} />
    )
  }

  const challenge = challenges.find((c) => c.id === activeId)
  if (!challenge) {
    setActiveId(null)
    return null
  }

  return (
    <ChallengePlayer
      challenge={challenge}
      challenges={challenges}
      onSelect={setActiveId}
      onBack={() => setActiveId(null)}
      onExit={onBack}
    />
  )
}

function ChallengeList({
  challenges,
  onSelect,
  onBack,
}: {
  challenges: CodeChallenge[]
  onSelect: (id: string) => void
  onBack?: () => void
}) {
  const S = STRINGS.codeChallenges
  return (
    <>
      <div className="page-header">
        <div className="mode-banner mode-banner--code">{S.badge}</div>
        <h2>{S.title}</h2>
        <p>{S.subtitle} · {challenges.length} challenges</p>
      </div>
      <div className="bank-list">
        {challenges.map((c) => (
          <button
            key={c.id}
            type="button"
            className="bank-item bank-item--new challenge-item"
            onClick={() => onSelect(c.id)}
          >
            <div className="bank-item-main">
              <div className="bank-item-meta">
                <span className="bank-id">{c.id}</span>
                <span className={`badge ${c.difficulty}`}>{c.difficulty}</span>
                <span className="run-badge">▶ Run code</span>
              </div>
              <p className="challenge-item-title">{c.title}</p>
              <p className="bank-item-text">{c.instruction}</p>
            </div>
          </button>
        ))}
      </div>
      {onBack && (
        <button type="button" className="btn btn-secondary" style={{ marginTop: 20 }} onClick={onBack}>
          ← {STRINGS.study.back}
        </button>
      )}
    </>
  )
}
