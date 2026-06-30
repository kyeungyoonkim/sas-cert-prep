/**
 * Educational SAS subset simulator — runs in the browser for practice.
 * Supports basic DATA steps, SET, IF/WHERE-style filters, and PROC PRINT.
 * Not a full SAS engine; for learning and cert prep only.
 */

export interface SasValue {
  type: 'num' | 'char'
  value: number | string | null
}

export type SasRow = Record<string, SasValue>

export interface SasDataset {
  name: string
  rows: SasRow[]
  labels: Record<string, string>
}

export interface SimulatorResult {
  log: string[]
  listing: string[]
  datasets: Record<string, SasDataset>
  errors: string[]
}

const SAS_EPOCH = new Date(1960, 0, 1).getTime()

function parseNum(s: string): number | null {
  const t = s.trim()
  if (t === '.' || t === '') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

function formatValue(v: SasValue): string {
  if (v.value === null) return '.'
  if (v.type === 'num') {
    const n = v.value as number
    if (Number.isInteger(n) && n > 10000) {
      const d = new Date(SAS_EPOCH + n * 86400000)
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      return `${String(d.getDate()).padStart(2, '0')}${months[d.getMonth()]}${d.getFullYear()}`
    }
    return String(n)
  }
  return String(v.value)
}

function rowToPrintable(row: SasRow, vars: string[]): string {
  return vars.map((v) => formatValue(row[v] ?? { type: 'char', value: '.' })).join('  ')
}

function evalExpr(expr: string, row: SasRow): SasValue {
  const e = expr.trim()

  if (/^["'].*["']$/.test(e)) {
    return { type: 'char', value: e.slice(1, -1) }
  }

  const num = parseNum(e)
  if (num !== null && /^-?\d+(\.\d+)?$/.test(e)) {
    return { type: 'num', value: num }
  }

  if (row[e]) return { ...row[e] }

  // simple arithmetic: a + b, total + value
  const sumMatch = e.match(/^(\w+)\s*\+\s*(.+)$/)
  if (sumMatch) {
    const left = evalExpr(sumMatch[1], row)
    const right = evalExpr(sumMatch[2], row)
    const ln = left.type === 'num' ? (left.value as number) : 0
    const rn = right.type === 'num' ? (right.value as number) : 0
    return { type: 'num', value: ln + rn }
  }

  // multiplication / division: a * b, a / b
  const mulMatch = e.match(/^(\w+)\s*\*\s*(.+)$/)
  if (mulMatch) {
    const left = evalExpr(mulMatch[1], row)
    const right = evalExpr(mulMatch[2], row)
    const ln = left.type === 'num' ? (left.value as number) : 0
    const rn = right.type === 'num' ? (right.value as number) : 0
    return { type: 'num', value: ln * rn }
  }
  const divMatch = e.match(/^(\w+)\s*\/\s*(.+)$/)
  if (divMatch) {
    const left = evalExpr(divMatch[1], row)
    const right = evalExpr(divMatch[2], row)
    const ln = left.type === 'num' ? (left.value as number) : 0
    const rn = right.type === 'num' ? (right.value as number) : 1
    return { type: 'num', value: rn !== 0 ? ln / rn : null }
  }

  // parenthesized arithmetic: (part / total) * 100
  const parenMatch = e.match(/^\((.+)\)\s*\*\s*(.+)$/)
  if (parenMatch) {
    const inner = evalExpr(parenMatch[1], row)
    const mult = evalExpr(parenMatch[2], row)
    const inN = inner.type === 'num' ? (inner.value as number) : 0
    const muN = mult.type === 'num' ? (mult.value as number) : 0
    return { type: 'num', value: inN * muN }
  }
  const innerDiv = e.match(/^\((\w+)\s*\/\s*(\w+)\)$/)
  if (innerDiv) {
    const a = evalExpr(innerDiv[1], row)
    const b = evalExpr(innerDiv[2], row)
    const an = a.type === 'num' ? (a.value as number) : 0
    const bn = b.type === 'num' ? (b.value as number) : 1
    return { type: 'num', value: bn !== 0 ? an / bn : null }
  }

  return { type: 'char', value: e }
}

function compareCondition(cond: string, row: SasRow): boolean {
  const c = cond.trim()
  const ops = ['>=', '<=', '>', '<', '=']
  for (const op of ops) {
    const idx = c.indexOf(op)
    if (idx > 0) {
      const left = evalExpr(c.slice(0, idx).trim(), row)
      const right = evalExpr(c.slice(idx + op.length).trim(), row)
      if (op === '=') {
        return String(left.value ?? '') === String(right.value ?? '')
      }
      const ln = left.value
      const rn = right.value
      if (ln === null || rn === null) return false
      const l = Number(ln)
      const r = Number(rn)
      switch (op) {
        case '>': return l > r
        case '<': return l < r
        case '>=': return l >= r
        case '<=': return l <= r
      }
    }
  }
  return false
}

function parseInputVars(inputLine: string): { name: string; informat?: string }[] {
  const tokens = inputLine
    .replace(/;/, '')
    .trim()
    .split(/\s+/)
    .filter((t) => !t.startsWith('@'))

  const vars: { name: string; informat?: string }[] = []
  for (const t of tokens) {
    if (t === '$') {
      if (vars.length > 0) vars[vars.length - 1].informat = 'char'
      continue
    }
    const isChar = t.endsWith('$')
    const name = t.replace(/\$?\d+.*/, '').replace(/\$$/, '')
    if (name.length > 0) {
      vars.push({ name, informat: isChar ? 'char' : 'num' })
    }
  }
  return vars
}

function parseDataline(line: string, vars: { name: string; informat?: string }[]): SasRow {
  const row: SasRow = {}
  const trimmed = line.trim()
  if (vars.length === 1 && vars[0].informat !== 'char') {
    row[vars[0].name] = { type: 'num', value: parseNum(trimmed) }
    return row
  }

  // fixed or list input — list style default
  const parts = trimmed.split(/\s+/)
  vars.forEach((v, i) => {
    const raw = parts[i] ?? '.'
    if (v.informat === 'char') {
      row[v.name] = { type: 'char', value: raw === '.' ? null : raw }
    } else {
      row[v.name] = { type: 'num', value: parseNum(raw) }
    }
  })
  return row
}

function executeDoOnlyStep(lines: string[]): SasRow[] {
  const output: SasRow[] = []

  function envToRow(env: Record<string, SasValue>): SasRow {
    return { ...env }
  }

  function evalInEnv(expr: string, env: Record<string, SasValue>): SasValue {
    const row = envToRow(env)
    return evalExpr(expr.replace(/\b(\w+)\b/g, (m) => (env[m] ? m : m)), row)
  }

  function runBlock(blockLines: string[], env: Record<string, SasValue>): void {
    let i = 0
    while (i < blockLines.length) {
      const line = blockLines[i]
      const doMatch = line.match(/^do\s+(\w+)\s*=\s*(\d+)\s+to\s+(\d+)\s*;/i)
      if (doMatch) {
        const [, v, startS, endS] = doMatch
        const body: string[] = []
        let depth = 1
        i++
        while (i < blockLines.length && depth > 0) {
          if (/^do\s+\w+/i.test(blockLines[i])) depth++
          if (/^end\s*;/i.test(blockLines[i])) {
            depth--
            if (depth === 0) {
              i++
              break
            }
          }
          if (depth > 0) body.push(blockLines[i])
          i++
        }
        for (let n = Number(startS); n <= Number(endS); n++) {
          runBlock(body, { ...env, [v]: { type: 'num', value: n } })
        }
        continue
      }
      if (/^output\s*;/i.test(line)) {
        output.push(envToRow(env))
        i++
        continue
      }
      const assign = line.match(/^(\w+)\s*=\s*(.+);$/i)
      if (assign) {
        env[assign[1]] = evalInEnv(assign[2], env)
      }
      const sumStmt = line.match(/^(\w+)\s*\+\s*(.+);$/i)
      if (sumStmt) {
        const add = evalInEnv(sumStmt[2], env)
        const prev = env[sumStmt[1]]?.value as number ?? 0
        const addN = add.type === 'num' ? (add.value as number) : 0
        env[sumStmt[1]] = { type: 'num', value: prev + addN }
      }
      i++
    }
  }

  runBlock(lines, {})
  return output
}

function runDataStep(
  block: string,
  datasets: Record<string, SasDataset>,
  log: string[],
  errors: string[]
): string | null {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
  const dataMatch = lines[0].match(/^data\s+(\w+)/i)
  if (!dataMatch) {
    errors.push('ERROR: Invalid DATA statement.')
    return null
  }
  const outName = dataMatch[1].toLowerCase()

  let inputVars: { name: string; informat?: string }[] = []
  const rows: SasRow[] = []
  let inDatalines = false
  let setNames: string[] = []
  let mergeNames: string[] = []
  let byVars: string[] = []
  const assignments: { var: string; expr: string; isSum?: boolean }[] = []
  let filterCond: string | null = null
  let whereCond: string | null = null
  let ifThenAssign: { cond: string; var: string; expr: string; elseVar?: string; elseExpr?: string } | null = null
  let doLoop: { var: string; start: number; end: number; body: string[] } | null = null

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const upper = line.toUpperCase()

    const doMatch = line.match(/do\s+(\w+)\s*=\s*(\d+)\s+to\s+(\d+)\s*;/i)
    if (doMatch) {
      doLoop = { var: doMatch[1], start: Number(doMatch[2]), end: Number(doMatch[3]), body: [] }
      continue
    }
    if (doLoop && /^end\s*;/i.test(line)) {
      doLoop = null
      continue
    }
    if (doLoop) {
      doLoop.body.push(line)
      continue
    }

    if (upper.startsWith('MERGE ')) {
      mergeNames = line.replace(/merge\s+/i, '').replace(/;/, '').trim().split(/\s+/).map((s) => s.toLowerCase())
      continue
    }
    if (upper.startsWith('BY ')) {
      byVars = line.replace(/by\s+/i, '').replace(/;/, '').trim().split(/\s+/).map((s) => s.toLowerCase())
      continue
    }
    if (upper.startsWith('SET ')) {
      const setLine = line.replace(/set\s+/i, '').replace(/;$/, '').trim()
      const whereMatch = setLine.match(/^(\w+)\s*\(\s*where\s*=\s*\((.+)\)\s*\)$/i)
      if (whereMatch) {
        setNames = [whereMatch[1].toLowerCase()]
        whereCond = whereMatch[2].trim()
      } else {
        setNames = setLine.split(/\s+/).map((s) => s.toLowerCase())
      }
      continue
    }
    if (upper.startsWith('INPUT ')) {
      inputVars = parseInputVars(line.slice(6))
      continue
    }
    if (upper === 'DATALINES;' || upper === 'CARDS;') {
      inDatalines = true
      continue
    }
    if (inDatalines) {
      if (line === ';') break
      rows.push(parseDataline(line, inputVars))
      continue
    }
    if (upper.startsWith('WHERE ')) {
      whereCond = line.replace(/where\s+/i, '').replace(/;/, '').trim()
      continue
    }
    if (upper.startsWith('IF ') && upper.includes(' THEN ')) {
      let extra = ''
      if (lines[i + 1] && /^else\b/i.test(lines[i + 1])) {
        extra = ' ' + lines[++i]
      }
      const full = line + extra
      const withElse = full.match(
        /if\s+(.+?)\s+then\s+(\w+)\s*=\s*('[^']*'|[^;]+);\s*else\s+(\w+)\s*=\s*('[^']*'|[^;]+);/i
      )
      if (withElse) {
        ifThenAssign = {
          cond: withElse[1],
          var: withElse[2],
          expr: withElse[3],
          elseVar: withElse[4],
          elseExpr: withElse[5],
        }
      } else {
        const m = line.match(/if\s+(.+?)\s+then\s+(\w+)\s*=\s*(.+);/i)
        if (m) ifThenAssign = { cond: m[1], var: m[2], expr: m[3] }
      }
      continue
    }
    if (upper.startsWith('IF ') && line.endsWith(';') && !upper.includes(' THEN ')) {
      filterCond = line.match(/if\s+(.+);/i)?.[1] ?? null
      continue
    }
    const assign = line.match(/^(\w+)\s*=\s*(.+);$/i)
    if (assign) assignments.push({ var: assign[1], expr: assign[2] })
    const sumStmt = line.match(/^(\w+)\s*\+\s*(.+);$/i)
    if (sumStmt && !assign) {
      assignments.push({ var: sumStmt[1], expr: `${sumStmt[1]} + ${sumStmt[2]}`, isSum: true })
    }
  }

  let outputRows: SasRow[] = []

  const bodyLines = lines.slice(1)
  const isDoOnly =
    setNames.length === 0 &&
    mergeNames.length === 0 &&
    rows.length === 0 &&
    bodyLines.some((l) => /^do\s+\w+/i.test(l))

  if (isDoOnly) {
    outputRows = executeDoOnlyStep(bodyLines)
  } else if (doLoop) {
    const hasOutput = doLoop.body.some((l) => /^output\s*;/i.test(l))
    for (let v = doLoop.start; v <= doLoop.end; v++) {
      const row: SasRow = { [doLoop.var]: { type: 'num', value: v } }
      for (const bl of doLoop.body) {
        const a = bl.match(/^(\w+)\s*=\s*(.+);$/i)
        if (a) {
          row[a[1]] = evalExpr(a[2].replace(new RegExp(doLoop.var, 'gi'), String(v)), row)
        }
      }
      if (hasOutput) outputRows.push(row)
    }
    if (!hasOutput && outputRows.length === 0) {
      errors.push('ERROR: DO loop without OUTPUT produced 0 observations.')
    }
  } else if (mergeNames.length >= 2 && byVars.length > 0) {
    const maps = mergeNames.map((n) => datasets[n]?.rows ?? [])
    const key = byVars[0]
    const keys = new Set<string>()
    maps.forEach((m) => m.forEach((r) => keys.add(String(r[key]?.value ?? ''))))

    function mergeCartesian(datasetsRows: SasRow[][], idx: number, base: SasRow): void {
      if (idx === datasetsRows.length) {
        if (Object.keys(base).length) outputRows.push({ ...base })
        return
      }
      const group = datasetsRows[idx]
      if (group.length === 0) {
        mergeCartesian(datasetsRows, idx + 1, base)
      } else {
        for (const r of group) {
          mergeCartesian(datasetsRows, idx + 1, { ...base, ...r })
        }
      }
    }

    for (const k of keys) {
      const perDs = maps.map((m) => m.filter((r) => String(r[key]?.value ?? '') === k))
      mergeCartesian(perDs, 0, {})
    }
  } else if (setNames.length > 0) {
    for (const sn of setNames) {
      if (datasets[sn]) outputRows.push(...datasets[sn].rows.map((r) => ({ ...r })))
    }
    if (whereCond) {
      outputRows = outputRows.filter((r) => compareCondition(whereCond!, r))
    }
  } else if (rows.length) {
    outputRows = rows.map((r) => ({ ...r }))
  }

  const accum: Record<string, number> = {}
  for (const row of outputRows) {
    for (const a of assignments) {
      if (a.isSum) {
        const rhs = a.expr.replace(new RegExp(`^${a.var}\\s*\\+\\s*`), '')
        const addVal = evalExpr(rhs, row)
        const add = addVal.type === 'num' ? (addVal.value as number) : 0
        accum[a.var] = (accum[a.var] ?? 0) + add
        row[a.var] = { type: 'num', value: accum[a.var] }
      } else {
        row[a.var] = evalExpr(a.expr, row)
      }
    }
    if (ifThenAssign) {
      if (compareCondition(ifThenAssign.cond, row)) {
        row[ifThenAssign.var] = evalExpr(ifThenAssign.expr, row)
      } else if (ifThenAssign.elseVar && ifThenAssign.elseExpr) {
        row[ifThenAssign.elseVar] = evalExpr(ifThenAssign.elseExpr, row)
      }
    }
  }

  if (filterCond) {
    const firstMatch = filterCond.match(/^first\.(\w+)$/i)
    if (firstMatch) {
      const byVar = firstMatch[1]
      outputRows = outputRows.filter((r, i, arr) => {
        if (i === 0) return true
        return arr[i - 1][byVar]?.value !== r[byVar]?.value
      })
    } else {
      outputRows = outputRows.filter((r) => compareCondition(filterCond!, r))
    }
  }

  const varNames = outputRows.length
    ? Object.keys(outputRows[0])
    : inputVars.map((v) => v.name)

  datasets[outName] = { name: outName, rows: outputRows, labels: {} }
  log.push(`NOTE: The data set WORK.${outName.toUpperCase()} has ${outputRows.length} observations and ${varNames.length} variables.`)
  log.push(`NOTE: DATA statement used (real time 0.01 seconds).`)

  return outName
}

function runProcPrint(
  block: string,
  datasets: Record<string, SasDataset>,
  listing: string[],
  log: string[],
  errors: string[]
): void {
  const dataMatch = block.match(/proc\s+print\s+data\s*=\s*(\w+)/i)
  const dataName = dataMatch?.[1]?.toLowerCase()
  if (!dataName || !datasets[dataName]) {
    errors.push(`ERROR: Dataset ${dataName ?? '?'} not found.`)
    return
  }
  const ds = datasets[dataName]
  const vars = Object.keys(ds.rows[0] ?? {})
  listing.push(`Obs  ${vars.join('  ')}`)
  ds.rows.forEach((row, i) => {
    listing.push(String(i + 1).padStart(3) + '  ' + rowToPrintable(row, vars))
  })
  log.push(`NOTE: PROCEDURE PRINT used (Total process time):`)
  log.push(`      real time           0.01 seconds`)
}

export function runSasCode(code: string): SimulatorResult {
  const log: string[] = ['1', 'NOTE: SAS Simulator (educational subset) — not full SAS 9.4']
  const listing: string[] = []
  const errors: string[] = []
  const datasets: Record<string, SasDataset> = {}

  const normalized = code.replace(/\r\n/g, '\n')
  const steps = normalized.split(/\nrun\s*;/i).map((s) => s.trim()).filter(Boolean)

  for (const step of steps) {
    const trimmed = step.trim()
    if (!trimmed) continue

    if (/^data\s+/i.test(trimmed)) {
      runDataStep(trimmed, datasets, log, errors)
    } else if (/^proc\s+print/i.test(trimmed)) {
      runProcPrint(trimmed, datasets, listing, log, errors)
    } else if (/^proc\s+/i.test(trimmed)) {
      log.push(`NOTE: ${trimmed.split('\n')[0]} — simulated (output not available in browser lab).`)
      log.push('NOTE: Try PROC PRINT after a DATA step, or use SAS OnDemand for full PROC support.')
    } else if (/^%macro/i.test(trimmed)) {
      log.push('NOTE: Macro code detected — expand macros in your head or use Study Mode explanations.')
      log.push('NOTE: Full macro execution requires SAS OnDemand for Academics.')
    } else if (/^proc\s+sql/i.test(trimmed)) {
      errors.push('ERROR: PROC SQL simulation not yet supported. Use DATA step + PROC PRINT for hands-on practice.')
    } else {
      errors.push(`ERROR: Unrecognized step: ${trimmed.split('\n')[0]}`)
    }
  }

  if (errors.length === 0 && listing.length === 0 && Object.keys(datasets).length > 0) {
    const last = Object.keys(datasets).pop()!
    listing.push(`(Dataset ${last.toUpperCase()} created — add "proc print data=${last}; run;" to view output)`)
  }

  return { log, listing, datasets, errors }
}
