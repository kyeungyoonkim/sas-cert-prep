/**
 * Run with: npm run validate
 * Checks code-challenge answers against the browser SAS simulator.
 */
import { validateCodeChallenges, formatValidationReport } from '../src/lib/validateBank.ts'

const issues = validateCodeChallenges()
const report = formatValidationReport(issues)
console.log(report)
if (issues.some((i) => i.severity === 'error')) {
  process.exit(1)
}
