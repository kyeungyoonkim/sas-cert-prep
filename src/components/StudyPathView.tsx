import { useMemo, useState, type CSSProperties } from 'react'
import type { CertData, CertId } from '../data/types'
import {
  getStudyPath,
  getModuleProgress,
  getNextModule,
  OFFICIAL_SAS_RESOURCES,
  type StudyModule,
} from '../data/studyPath'
import { calculateReadiness, getDailyProgress } from '../lib/readiness'
import type { useProgress } from '../hooks/useProgress'
import { STRINGS } from '../i18n/strings'

const PHASE_LABELS: Record<string, string> = {
  learn: 'Learn',
  practice: 'Practice',
  review: 'Review',
  'exam-prep': 'Exam Prep',
}

const PHASE_COLORS: Record<string, string> = {
  learn: '#2563eb',
  practice: '#059669',
  review: '#d97706',
  'exam-prep': '#7c3aed',
}

export interface StudySessionFromPath {
  questionIds: string[]
  title: string
  moduleId: string
  showConcept: boolean
}

export function StudyPathView({
  cert,
  progress,
  onStartModule,
  onStartExam,
}: {
  cert: CertData
  progress: ReturnType<typeof useProgress>['progress']
  onStartModule: (session: StudySessionFromPath) => void
  onStartExam: () => void
}) {
  const S = STRINGS.studyPath
  const path = useMemo(() => getStudyPath(cert.id), [cert.id])
  const readiness = useMemo(
    () => calculateReadiness(cert.id, progress, cert.examInfo.passingScore, cert.checklist.length),
    [cert, progress]
  )
  const daily = getDailyProgress(progress.dailyLog)
  const next = useMemo(() => getNextModule(cert.id, progress.answered), [cert.id, progress.answered])
  const [expandedId, setExpandedId] = useState<string | null>(next?.module.id ?? path[0]?.id ?? null)

  const modulesDone = path.filter((m, i) =>
    getModuleProgress(m, progress.answered, path, i).isComplete
  ).length

  return (
    <>
      <div className="page-header">
        <h2>{S.title}</h2>
        <p>{S.subtitle} · {cert.fullName}</p>
      </div>

      <div className="coach-hero">
        <div className="readiness-ring" style={{ '--ring-color': readiness.color } as CSSProperties}>
          <svg viewBox="0 0 120 120" className="readiness-svg">
            <circle cx="60" cy="60" r="52" className="readiness-bg" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="readiness-fill"
              style={{
                stroke: readiness.color,
                strokeDasharray: `${(readiness.score / 100) * 327} 327`,
              }}
            />
          </svg>
          <div className="readiness-center">
            <span className="readiness-score">{readiness.score}%</span>
            <span className="readiness-label">{readiness.label}</span>
          </div>
        </div>

        <div className="coach-hero-body">
          <p className="coach-recommendation">{readiness.recommendation}</p>
          <div className="readiness-bars">
            <ReadinessBar label={S.coverage} value={readiness.breakdown.coverage} />
            <ReadinessBar label={S.accuracy} value={readiness.breakdown.accuracy} />
            <ReadinessBar label={S.modules} value={readiness.breakdown.modules} />
            <ReadinessBar label={S.examSim} value={readiness.breakdown.examSim} />
          </div>
          <div className="daily-goal">
            <span>{S.dailyGoal}: <strong>{daily.today}/{daily.goal}</strong></span>
            <div className="daily-goal-bar">
              <div
                className="daily-goal-fill"
                style={{ width: `${Math.min(100, (daily.today / daily.goal) * 100)}%` }}
              />
            </div>
            {daily.met && <span className="daily-goal-met">✓ {S.dailyMet}</span>}
          </div>
        </div>
      </div>

      {next && (
        <div className="coach-continue">
          <div>
            <span className="coach-continue-label">{S.continue}</span>
            <h3>{next.module.title}</h3>
            <p>{next.module.subtitle}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => startModule(next.module, onStartModule, true)}
          >
            {S.continueBtn} →
          </button>
        </div>
      )}

      <div className="coach-progress-summary">
        {S.modulesComplete}: <strong>{modulesDone}</strong> / {path.length - 1}
      </div>

      <div className="module-timeline">
        {path.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            index={index}
            progress={progress}
            path={path}
            expanded={expandedId === module.id}
            onToggle={() => setExpandedId(expandedId === module.id ? null : module.id)}
            onStartLearn={() => startModule(module, onStartModule, true)}
            onStartPractice={() => startModule(module, onStartModule, false)}
            onStartExam={module.phase === 'exam-prep' ? onStartExam : undefined}
          />
        ))}
      </div>

      <OfficialResourcesPanel certId={cert.id} examId={cert.examInfo.examId} />
    </>
  )
}

function ReadinessBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="readiness-bar-row">
      <span className="readiness-bar-label">{label}</span>
      <div className="readiness-bar-track">
        <div className="readiness-bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="readiness-bar-pct">{value}%</span>
    </div>
  )
}

function ModuleCard({
  module,
  index,
  progress,
  path,
  expanded,
  onToggle,
  onStartLearn,
  onStartPractice,
  onStartExam,
}: {
  module: StudyModule
  index: number
  progress: ReturnType<typeof useProgress>['progress']
  path: StudyModule[]
  expanded: boolean
  onToggle: () => void
  onStartLearn: () => void
  onStartPractice: () => void
  onStartExam?: () => void
}) {
  const S = STRINGS.studyPath
  const mp = getModuleProgress(module, progress.answered, path, index)
  const phaseColor = PHASE_COLORS[module.phase] ?? '#6b7280'

  return (
    <div
      className={`module-card ${mp.isComplete ? 'module-card--done' : ''} ${!mp.isUnlocked ? 'module-card--locked' : ''}`}
    >
      <button type="button" className="module-card-header" onClick={onToggle}>
        <div className="module-order" style={{ background: phaseColor }}>
          {!mp.isUnlocked ? '🔒' : mp.isComplete ? '✓' : module.order}
        </div>
        <div className="module-card-titles">
          <span className="module-phase" style={{ color: phaseColor }}>
            {PHASE_LABELS[module.phase]} · {module.examWeight}
          </span>
          <h3>{module.title}</h3>
          <p>{module.subtitle}</p>
        </div>
        {module.problemIds.length > 0 && (
          <div className="module-card-stats">
            <span>{mp.attempted}/{mp.total}</span>
            <div className="module-mini-bar">
              <div className="module-mini-fill" style={{ width: `${mp.percentComplete}%` }} />
            </div>
          </div>
        )}
        <span className="module-chevron">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && mp.isUnlocked && (
        <div className="module-card-body">
          <div className="module-concepts">
            <h4>{S.keyConcepts}</h4>
            <ul>
              {module.concepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="module-coach-tip">
            <strong>💡 {S.coachTip}</strong>
            <p>{module.coachingTip}</p>
          </div>
          {module.problemIds.length > 0 ? (
            <div className="module-actions">
              <button type="button" className="btn btn-secondary" onClick={onStartLearn}>
                📖 {S.learnThenQuiz}
              </button>
              <button type="button" className="btn btn-primary" onClick={onStartPractice}>
                ▶ {S.practice} ({module.problemIds.length})
              </button>
            </div>
          ) : (
            <div className="module-actions">
              {onStartExam && (
                <button type="button" className="btn btn-primary" onClick={onStartExam}>
                  🎯 {S.takePracticeExam}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {expanded && !mp.isUnlocked && (
        <div className="module-card-body module-locked-msg">
          {S.unlockHint}
        </div>
      )}
    </div>
  )
}

function OfficialResourcesPanel({ certId, examId }: { certId: CertId; examId: string }) {
  const S = STRINGS.studyPath
  const guideUrl =
    certId === 'clinical'
      ? OFFICIAL_SAS_RESOURCES.contentGuideClinical
      : certId === 'advanced'
        ? OFFICIAL_SAS_RESOURCES.contentGuideAdvanced
        : OFFICIAL_SAS_RESOURCES.contentGuideBase
  return (
    <div className="official-resources">
      <h3>{S.officialTitle}</h3>
      <p className="official-disclaimer">{S.officialDisclaimer}</p>
      <div className="official-links">
        <a href={OFFICIAL_SAS_RESOURCES.practiceExams} target="_blank" rel="noopener noreferrer" className="official-link">
          <span className="official-link-icon">🎯</span>
          <div>
            <strong>{S.officialPractice}</strong>
            <span>{S.officialPracticeDesc}</span>
          </div>
        </a>
        <a href={OFFICIAL_SAS_RESOURCES.sampleQuestions} target="_blank" rel="noopener noreferrer" className="official-link">
          <span className="official-link-icon">📄</span>
          <div>
            <strong>{S.officialSample}</strong>
            <span>{examId}</span>
          </div>
        </a>
        <a href={guideUrl} target="_blank" rel="noopener noreferrer" className="official-link">
          <span className="official-link-icon">📋</span>
          <div>
            <strong>{S.officialGuide}</strong>
            <span>{S.officialGuideDesc}</span>
          </div>
        </a>
      </div>
      <p className="official-note">{S.noPirated}</p>
    </div>
  )
}

function startModule(
  module: StudyModule,
  onStart: (s: StudySessionFromPath) => void,
  showConcept: boolean
) {
  if (module.problemIds.length === 0) return
  onStart({
    questionIds: module.problemIds,
    title: module.title,
    moduleId: module.id,
    showConcept,
  })
}
