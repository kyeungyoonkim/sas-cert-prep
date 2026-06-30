import { useMemo, useState } from 'react'
import type { CertData, BankProblem } from '../data/types'
import {
  getBankProblems,
  getProblemsByCollection,
  getRelatedProblems,
  bankStats,
  sortByExamQuality,
} from '../data/bank'
import { getCollectionsForCert, getCollectionLabel } from '../data/collections'
import type { useProgress } from '../hooks/useProgress'
import { STRINGS } from '../i18n/strings'

type StatusFilter = 'all' | 'unread' | 'correct' | 'wrong' | 'bookmarked'
type KindFilter = 'all' | 'mcq' | 'code'

export interface StudySessionInput {
  questionIds?: string[]
  topic?: string | 'all' | 'wrong'
  title?: string
  collection?: string
}

function getProblemStatus(
  p: BankProblem,
  progress: ReturnType<typeof useProgress>['progress']
): 'new' | 'correct' | 'wrong' {
  const rec = progress.answered[p.id]
  if (!rec) return 'new'
  return rec.correct ? 'correct' : 'wrong'
}

function diffLabel(d: BankProblem['difficulty']): string {
  return STRINGS.difficulty[d]
}

export function ProblemBank({
  cert,
  progress,
  onStartStudy,
}: {
  cert: CertData
  progress: ReturnType<typeof useProgress>['progress']
  onStartStudy: (s: StudySessionInput) => void
}) {
  const S = STRINGS
  const B = S.bank
  const allProblems = useMemo(() => getBankProblems(cert.id), [cert.id])
  const collections = useMemo(() => getCollectionsForCert(cert.id), [cert.id])
  const stats = useMemo(() => bankStats(cert.id), [cert.id])

  const [topicFilter, setTopicFilter] = useState('all')
  const [diffFilter, setDiffFilter] = useState<'all' | BankProblem['difficulty']>('all')
  const [kindFilter, setKindFilter] = useState<KindFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [collectionFilter, setCollectionFilter] = useState<string | null>('exam-quality')
  const [search, setSearch] = useState('')
  const [expandedRelated, setExpandedRelated] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const list = collectionFilter
      ? getProblemsByCollection(cert.id, collectionFilter)
      : allProblems

    return sortByExamQuality(list.filter((p) => {
      if (topicFilter !== 'all' && p.topic !== topicFilter) return false
      if (diffFilter !== 'all' && p.difficulty !== diffFilter) return false
      if (kindFilter === 'mcq' && p.kind !== 'mcq') return false
      if (kindFilter === 'code' && p.kind !== 'code') return false
      const status = getProblemStatus(p, progress)
      if (statusFilter === 'unread' && status !== 'new') return false
      if (statusFilter === 'correct' && status !== 'correct') return false
      if (statusFilter === 'wrong' && status !== 'wrong') return false
      if (statusFilter === 'bookmarked' && !progress.bookmarked.includes(p.id)) return false
      if (search) {
        const hay = `${p.title} ${p.question} ${p.tags.join(' ')} ${p.id}`.toLowerCase()
        if (!hay.includes(search.toLowerCase())) return false
      }
      return true
    }))
  }, [
    allProblems,
    cert.id,
    collectionFilter,
    topicFilter,
    diffFilter,
    kindFilter,
    statusFilter,
    search,
    progress,
  ])

  const statusIcon = (status: 'new' | 'correct' | 'wrong') => {
    if (status === 'correct') return '✓'
    if (status === 'wrong') return '✗'
    return '○'
  }

  return (
    <>
      <div className="page-header">
        <h2>{B.title}</h2>
        <p>
          {B.subtitle} · {cert.fullName}
        </p>
        <div className="bank-stats-row">
          <span className="bank-stat-pill">{stats.total} total</span>
          <span className="bank-stat-pill">{stats.mcq} MCQ</span>
          <span className="bank-stat-pill bank-stat-pill--code">{stats.code} run-code</span>
          <span className="bank-stat-pill bank-stat-pill--trap">{stats.traps} traps</span>
        </div>
      </div>

      <div className="collection-chips">
        <button
          type="button"
          className={`collection-chip ${collectionFilter === null ? 'active' : ''}`}
          onClick={() => setCollectionFilter(null)}
        >
          {B.allCollections}
        </button>
        {collections.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`collection-chip ${collectionFilter === c.id ? 'active' : ''}`}
            title={c.description}
            onClick={() => setCollectionFilter(collectionFilter === c.id ? null : c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {collectionFilter && (
        <p className="collection-desc">
          {collections.find((c) => c.id === collectionFilter)?.description}
        </p>
      )}

      <div className="bank-filters">
        <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as KindFilter)}>
          <option value="all">{B.kindAll}</option>
          <option value="mcq">{B.kindMcq}</option>
          <option value="code">{B.kindCode}</option>
        </select>
        <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
          <option value="all">{S.filters.allTopics}</option>
          {Object.entries(cert.topics).map(([key, t]) => (
            <option key={key} value={key}>
              {t.label}
            </option>
          ))}
        </select>
        <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value as typeof diffFilter)}>
          <option value="all">{S.difficulty.all}</option>
          <option value="easy">{S.difficulty.easy}</option>
          <option value="medium">{S.difficulty.medium}</option>
          <option value="hard">{S.difficulty.hard}</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
          <option value="all">{S.filters.all}</option>
          <option value="unread">{S.filters.unread}</option>
          <option value="correct">{S.filters.correct}</option>
          <option value="wrong">{S.filters.wrong}</option>
          <option value="bookmarked">{S.filters.bookmarked}</option>
        </select>
        <input
          type="search"
          placeholder={B.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bank-search"
        />
      </div>

      <div className="bank-toolbar">
        <span className="bank-count">
          {S.filters.showing} <strong>{filtered.length}</strong> {S.filters.of} {allProblems.length}
        </span>
        {filtered.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onStartStudy({
                questionIds: filtered.map((p) => p.id),
                title: `${S.modes.study.title} (${filtered.length})`,
                collection: collectionFilter ?? undefined,
              })
            }
          >
            {S.filters.startAll} ({filtered.length})
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <p>{S.study.noResults}</p>
        </div>
      ) : (
        <div className="problem-list-wrap">
          <div className="problem-list-header">
            <span className="problem-col-status">{B.colStatus}</span>
            <span className="problem-col-title">{B.colTitle}</span>
            <span className="problem-col-kind">{B.colKind}</span>
            <span className="problem-col-diff">{B.colDiff}</span>
            <span className="problem-col-topic">{B.colTopic}</span>
            <span className="problem-col-action" />
          </div>
          {filtered.map((p) => {
            const status = getProblemStatus(p, progress)
            const topicInfo = cert.topics[p.topic]
            const related = getRelatedProblems(cert.id, p)
            const isExpanded = expandedRelated === p.id
            const topicLabel = topicInfo?.label ?? p.topic

            return (
              <div key={p.id} className={`problem-list-group problem-list-group--${status}`}>
                <div className="problem-list-row">
                  <span
                    className={`problem-col-status problem-status problem-status--${status}`}
                    title={status}
                  >
                    {statusIcon(status)}
                  </span>

                  <div className="problem-col-title">
                    <div className="problem-title-row">
                      <span className="bank-id">{p.id}</span>
                      {p.trap && <span className="trap-badge">{B.trap}</span>}
                      {progress.bookmarked.includes(p.id) && <span className="bookmark-star">⭐</span>}
                    </div>
                    <span className="problem-title-text">{p.title}</span>
                    {p.collections.length > 0 && (
                      <div className="problem-tags">
                        {p.collections.slice(0, 3).map((c) => (
                          <span key={c} className="tag-mini">
                            {getCollectionLabel(c)}
                          </span>
                        ))}
                      </div>
                    )}
                    {related.length > 0 && (
                      <button
                        type="button"
                        className="problem-related-link"
                        onClick={() => setExpandedRelated(isExpanded ? null : p.id)}
                      >
                        {isExpanded ? '▾' : '▸'} {B.related} ({related.length})
                      </button>
                    )}
                  </div>

                  <span className="problem-col-kind">
                    <span className={`kind-badge kind-badge--${p.kind}`}>
                      {p.kind === 'code' ? '▶ Run' : 'MCQ'}
                    </span>
                  </span>

                  <span className="problem-col-diff">
                    <span className={`badge ${p.difficulty}`}>{diffLabel(p.difficulty)}</span>
                  </span>

                  <span className="problem-col-topic" title={topicLabel}>
                    {topicLabel}
                  </span>

                  <span className="problem-col-action">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm problem-solve-btn"
                      onClick={() => onStartStudy({ questionIds: [p.id], title: p.title })}
                    >
                      {B.studyOne}
                    </button>
                  </span>
                </div>

                {isExpanded && related.length > 0 && (
                  <div className="problem-related-panel">
                    <span className="related-label">{B.relatedDrills}</span>
                    <div className="related-drills">
                      {related.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className="related-drill-btn"
                          onClick={() =>
                            onStartStudy({
                              questionIds: [p.id, r.id],
                              title: `${B.relatedDrills}: ${p.title}`,
                            })
                          }
                        >
                          {r.kind === 'code' ? '▶' : '◆'} {r.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
