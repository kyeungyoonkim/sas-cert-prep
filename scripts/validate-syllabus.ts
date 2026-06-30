import {
  runFullValidation,
  formatAllIssues,
  formatSyllabusReport,
} from '../src/lib/validateSyllabus.ts'

const issues = runFullValidation()
console.log(formatAllIssues(issues))
console.log(formatSyllabusReport('base'))
console.log(formatSyllabusReport('clinical'))
console.log(formatSyllabusReport('advanced'))

if (issues.some((i) => i.severity === 'error')) {
  process.exit(1)
}
