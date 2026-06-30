export type CertId = 'base' | 'clinical' | 'advanced'

export type ProblemKind = 'mcq' | 'code'

export interface Question {
  id: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  /** Short label for problem-bank tables (defaults to first line of question). */
  title?: string
  code?: string
  options: string[]
  correctIndex: number
  explanation: string
  explanationKo?: string
  tags: string[]
  /** Curated collection ids — see collections.ts */
  collections?: string[]
  /** High miss-rate / exam trap — surfaced in "Exam Traps" track */
  trap?: boolean
  /** Related problem ids for paired drills (concept + code-run). */
  relatedIds?: string[]
  /** Coach tip shown before answering (Study Path / guided mode). */
  coachingTip?: string
  /** Aligned to exam objectives — premium quality tier */
  examStyle?: boolean
  /** foundational = glossary-style; exam = scenario/performance-style */
  qualityTier?: 'foundational' | 'standard' | 'exam'
}

export interface BankProblem {
  id: string
  kind: ProblemKind
  cert: CertId
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  title: string
  question: string
  code?: string
  starterCode?: string
  solutionCode?: string
  hint?: string
  options: string[]
  correctIndex: number
  explanation: string
  explanationKo?: string
  tags: string[]
  collections: string[]
  trap: boolean
  relatedIds: string[]
  coachingTip?: string
  examStyle?: boolean
  qualityTier?: 'foundational' | 'standard' | 'exam'
}

export interface TopicInfo {
  label: string
  weight: string
  color: string
}

export interface ExamInfo {
  name: string
  examId: string
  questions: number
  minutes: number
  passingScore: number
  passingLabel: string
  scoreRange?: string
  prerequisite?: string
  topics: { topic: string; weight: string }[]
}

export interface ChecklistItem {
  id: string
  text: string
  topic: string
}

export interface CertData {
  id: CertId
  shortName: string
  fullName: string
  subtitle: string
  color: string
  topics: Record<string, TopicInfo>
  questions: Question[]
  examInfo: ExamInfo
  checklist: ChecklistItem[]
}
