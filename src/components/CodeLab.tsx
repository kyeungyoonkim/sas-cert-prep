import { useState, useCallback, useMemo } from 'react'
import { runSasCode, type SasDataset } from '../lib/sasSimulator'
import {
  CODE_LAB_STARTERS,
  CODE_LAB_CATEGORIES,
  CODE_LAB_SNIPPETS,
} from '../data/codeLabStarters'
import { STRINGS } from '../i18n/strings'

const DEFAULT_CODE = `data demo;
  input name $ age score;
  datalines;
Alice 24 88
Bob 31 92
Carol 28 75
;
run;

proc print data=demo;
run;`

interface CodeLabProps {
  initialCode?: string
  onBack?: () => void
}

function formatDatasetPreview(ds: SasDataset): string {
  if (!ds.rows.length) return '(empty dataset)'
  const vars = Object.keys(ds.rows[0])
  const lines = [`Variables: ${vars.join(', ')}`, `Observations: ${ds.rows.length}`, '']
  lines.push(`Obs  ${vars.join('  ')}`)
  ds.rows.slice(0, 20).forEach((row, i) => {
    const vals = vars.map((v) => {
      const cell = row[v]
      if (!cell || cell.value === null) return '.'
      return String(cell.value)
    })
    lines.push(`${String(i + 1).padStart(3)}  ${vals.join('  ')}`)
  })
  if (ds.rows.length > 20) lines.push(`... and ${ds.rows.length - 20} more rows`)
  return lines.join('\n')
}

export function CodeLab({ initialCode, onBack }: CodeLabProps) {
  const [code, setCode] = useState(initialCode ?? DEFAULT_CODE)
  const [log, setLog] = useState<string[]>([])
  const [listing, setListing] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [datasets, setDatasets] = useState<Record<string, SasDataset>>({})
  const [activeTab, setActiveTab] = useState<'output' | 'log' | 'datasets'>('output')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [showSnippets, setShowSnippets] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)

  const handleRun = useCallback(() => {
    const result = runSasCode(code)
    setLog(result.log)
    setListing(result.listing)
    setErrors(result.errors)
    setDatasets(result.datasets)
    const names = Object.keys(result.datasets)
    setSelectedDataset(names.length ? names[names.length - 1] : null)
    if (result.errors.length) setActiveTab('log')
    else if (result.listing.length) setActiveTab('output')
    else if (names.length) setActiveTab('datasets')
  }, [code])

  const S = STRINGS.codeLab
  const lineCount = code.split('\n').length

  const filteredStarters = useMemo(() => {
    if (activeCategory === 'All') return CODE_LAB_STARTERS
    return CODE_LAB_STARTERS.filter((s) => s.category === activeCategory)
  }, [activeCategory])

  const insertSnippet = (snippet: string) => {
    setCode((prev) => (prev.trim() ? `${prev}\n${snippet}` : snippet))
  }

  return (
    <div className="codelab">
      <div className="page-header">
        <h2>{S.title}</h2>
        <p>{S.subtitle}</p>
        <p className="codelab-disclaimer">{S.disclaimer}</p>
      </div>

      <div className="codelab-templates">
        <div className="codelab-templates-header">
          <span className="codelab-templates-label">{S.templates}</span>
          <div className="codelab-category-tabs">
            <button
              type="button"
              className={`codelab-cat-tab ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => setActiveCategory('All')}
            >
              All
            </button>
            {CODE_LAB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`codelab-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="codelab-starters">
          {filteredStarters.map((s) => (
            <button
              key={s.name}
              type="button"
              className="btn btn-secondary btn-sm codelab-starter-btn"
              title={s.category}
              onClick={() => setCode(s.code)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="codelab-toolbar">
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${showSnippets ? 'active' : ''}`}
          onClick={() => setShowSnippets(!showSnippets)}
        >
          {S.snippets}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCode(DEFAULT_CODE)}>
          {S.reset}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCode('')}>
          {S.clear}
        </button>
      </div>

      {showSnippets && (
        <div className="codelab-snippets">
          {CODE_LAB_SNIPPETS.map((sn) => (
            <button
              key={sn.label}
              type="button"
              className="codelab-snippet-btn"
              onClick={() => insertSnippet(sn.code)}
            >
              + {sn.label}
            </button>
          ))}
        </div>
      )}

      <div className="codelab-layout">
        <div className="codelab-editor-wrap">
          <div className="codelab-panel-header">
            <span>{S.editor}</span>
            <div className="codelab-header-actions">
              <button type="button" className="btn btn-primary btn-sm" onClick={handleRun}>
                ▶ {S.run}
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
          <div className="codelab-hint">
            {S.shortcut} · {lineCount} {S.lines}
          </div>
        </div>

        <div className="codelab-output-wrap">
          <div className="codelab-tabs">
            <button
              type="button"
              className={`codelab-tab ${activeTab === 'output' ? 'active' : ''}`}
              onClick={() => setActiveTab('output')}
            >
              {S.output}
            </button>
            <button
              type="button"
              className={`codelab-tab ${activeTab === 'log' ? 'active' : ''}`}
              onClick={() => setActiveTab('log')}
            >
              {S.log}{' '}
              {errors.length > 0 && <span className="tab-error">({errors.length})</span>}
            </button>
            <button
              type="button"
              className={`codelab-tab ${activeTab === 'datasets' ? 'active' : ''}`}
              onClick={() => setActiveTab('datasets')}
            >
              {S.datasets}
              {Object.keys(datasets).length > 0 && (
                <span className="tab-count"> ({Object.keys(datasets).length})</span>
              )}
            </button>
          </div>

          {activeTab === 'datasets' ? (
            <div className="codelab-datasets-panel">
              {Object.keys(datasets).length === 0 ? (
                <pre className="codelab-panel codelab-listing">{S.datasetsEmpty}</pre>
              ) : (
                <>
                  <div className="codelab-dataset-tabs">
                    {Object.entries(datasets).map(([name, ds]) => (
                      <button
                        key={name}
                        type="button"
                        className={`codelab-dataset-tab ${selectedDataset === name ? 'active' : ''}`}
                        onClick={() => setSelectedDataset(name)}
                      >
                        {name.toUpperCase()} ({ds.rows.length})
                      </button>
                    ))}
                  </div>
                  <pre className="codelab-panel codelab-listing">
                    {selectedDataset && datasets[selectedDataset]
                      ? formatDatasetPreview(datasets[selectedDataset])
                      : S.runHint}
                  </pre>
                </>
              )}
            </div>
          ) : (
            <pre className={`codelab-panel ${activeTab === 'log' ? 'codelab-log' : 'codelab-listing'}`}>
              {activeTab === 'log'
                ? [...errors.map((e) => `ERROR: ${e}`), ...log].join('\n') || S.runHint
                : listing.join('\n') || S.runHint}
            </pre>
          )}
        </div>
      </div>

      <details className="codelab-syntax-ref">
        <summary>{S.syntaxRef}</summary>
        <div className="codelab-syntax-grid">
          <div><code>data name; ... run;</code><span>CREATE dataset</span></div>
          <div><code>set a b;</code><span>Concatenate vertically</span></div>
          <div><code>merge a b; by id;</code><span>Match-merge on BY</span></div>
          <div><code>if condition;</code><span>Subsetting IF</span></div>
          <div><code>where age &gt;= 18;</code><span>Filter on SET</span></div>
          <div><code>total + x;</code><span>SUM (running total)</span></div>
          <div><code>if first.id;</code><span>First row per BY group</span></div>
          <div><code>do i=1 to 10; output; end;</code><span>DO loop + OUTPUT</span></div>
          <div><code>proc print data=x; run;</code><span>Print listing</span></div>
        </div>
      </details>

      {onBack && (
        <div style={{ marginTop: 20 }}>
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            ← {STRINGS.study.back}
          </button>
        </div>
      )}
    </div>
  )
}
