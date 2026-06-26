// Data model for the admin bulk-migration tool (Classic Quizzes → New Quizzes).
//
// A course is safe to migrate when none of its Classic quizzes carry content that needs a
// closer look first. Three conditions hold a quiz back for review:
//   - it already has student submissions (migrating would put graded data at risk),
//   - it pulls questions from an item bank (the link doesn't carry over automatically), or
//   - it uses a question type New Quizzes doesn't support yet (e.g. Formula, Hot Spot).
// A course with any flagged quizzes shows "Review needed" instead of "Safe to migrate".
// This is a yes/no status, not a score.

export type IssueKey = 'submissions' | 'itemBanks' | 'unsupportedTypes'

// Short labels used in status tags, the issue column, and quiz groups.
export const ISSUE_LABELS: Record<IssueKey, string> = {
  submissions: 'Submissions',
  itemBanks: 'Item banks',
  unsupportedTypes: 'Unsupported question types',
}

// Question types New Quizzes doesn't support yet — surfaced in the "Review needed" group.
export const UNSUPPORTED_TYPES = ['Formula', 'Hot Spot'] as const

export type CourseType = 'blueprint' | 'template' | 'active' | 'other'
export type SubjectKey = 'biology' | 'language' | 'art' | 'math' | 'history' | 'science'

export type Course = {
  id: string
  name: string
  teacherId: string
  term: string
  courseType: CourseType // groups the dashboard tabs
  subject: SubjectKey // drives the quiz name pool

  classicQuizzes: number // Classic quizzes still to migrate
  migratedQuizzes: number // already converted to New Quizzes
  // Counts of Classic quizzes flagged for each reason. Kept non-overlapping in seed data,
  // so their sum is the course's review count and stays <= classicQuizzes.
  quizzesWithSubmissions: number
  quizzesWithItemBanks: number
  quizzesWithUnsupportedTypes: number
}

export type Teacher = {
  id: string
  name: string
  email: string
}

export const TEACHERS: Teacher[] = [
  { id: 't-alex', name: 'Alex Smith', email: 'alex.smith@wsd.edu' },
  { id: 't-maria', name: 'Maria Gonzalez', email: 'maria.gonzalez@wsd.edu' },
  { id: 't-james', name: 'James Chen', email: 'james.chen@wsd.edu' },
  { id: 't-priya', name: 'Priya Patel', email: 'priya.patel@wsd.edu' },
  { id: 't-tom', name: "Tom O'Brien", email: 'tom.obrien@wsd.edu' },
  { id: 't-sarah', name: 'Sarah Johnson', email: 'sarah.johnson@wsd.edu' },
  { id: 't-david', name: 'David Park', email: 'david.park@wsd.edu' },
  { id: 't-nina', name: 'Nina Petrova', email: 'nina.petrova@wsd.edu' },
  { id: 't-omar', name: 'Omar Haddad', email: 'omar.haddad@wsd.edu' },
  { id: 't-lena', name: 'Lena Müller', email: 'lena.muller@wsd.edu' },
  { id: 't-grace', name: 'Grace Kim', email: 'grace.kim@wsd.edu' },
  { id: 't-raj', name: 'Raj Mehta', email: 'raj.mehta@wsd.edu' },
  { id: 't-ana', name: 'Ana Torres', email: 'ana.torres@wsd.edu' },
  { id: 't-ben', name: 'Ben Carter', email: 'ben.carter@wsd.edu' },
]

// Hand-authored "featured" courses used in walkthroughs — they lead each tab.
const FEATURED: Course[] = [
  { id: 'c-bp-sci', name: 'Science — Blueprint', teacherId: 't-alex', term: 'District', courseType: 'blueprint', subject: 'science', classicQuizzes: 9, migratedQuizzes: 4, quizzesWithSubmissions: 0, quizzesWithItemBanks: 3, quizzesWithUnsupportedTypes: 1 },
  { id: 'c-tmpl-hum', name: 'Humanities — Course Template', teacherId: 't-tom', term: 'District', courseType: 'template', subject: 'history', classicQuizzes: 6, migratedQuizzes: 2, quizzesWithSubmissions: 0, quizzesWithItemBanks: 2, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-tmpl-math', name: 'Algebra — Course Template', teacherId: 't-priya', term: 'District', courseType: 'template', subject: 'math', classicQuizzes: 5, migratedQuizzes: 3, quizzesWithSubmissions: 0, quizzesWithItemBanks: 0, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-bio101', name: 'Bio 101: Cellular Structure', teacherId: 't-alex', term: 'Fall 2026', courseType: 'active', subject: 'biology', classicQuizzes: 8, migratedQuizzes: 6, quizzesWithSubmissions: 3, quizzesWithItemBanks: 2, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-bio201', name: 'Biology 201 — Genetics', teacherId: 't-alex', term: 'Fall 2026', courseType: 'active', subject: 'biology', classicQuizzes: 7, migratedQuizzes: 5, quizzesWithSubmissions: 2, quizzesWithItemBanks: 0, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-anat', name: 'Human Anatomy', teacherId: 't-alex', term: 'Spring 2026', courseType: 'active', subject: 'biology', classicQuizzes: 5, migratedQuizzes: 0, quizzesWithSubmissions: 0, quizzesWithItemBanks: 2, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-span1', name: 'Spanish I', teacherId: 't-maria', term: 'Fall 2026', courseType: 'active', subject: 'language', classicQuizzes: 9, migratedQuizzes: 2, quizzesWithSubmissions: 3, quizzesWithItemBanks: 2, quizzesWithUnsupportedTypes: 1 },
  { id: 'c-span2', name: 'Spanish II', teacherId: 't-maria', term: 'Spring 2026', courseType: 'active', subject: 'language', classicQuizzes: 6, migratedQuizzes: 1, quizzesWithSubmissions: 2, quizzesWithItemBanks: 1, quizzesWithUnsupportedTypes: 1 },
  { id: 'c-art', name: 'Studio Art', teacherId: 't-james', term: 'Fall 2026', courseType: 'active', subject: 'art', classicQuizzes: 11, migratedQuizzes: 0, quizzesWithSubmissions: 4, quizzesWithItemBanks: 3, quizzesWithUnsupportedTypes: 2 },
  { id: 'c-alg', name: 'Algebra II', teacherId: 't-priya', term: 'Fall 2026', courseType: 'active', subject: 'math', classicQuizzes: 6, migratedQuizzes: 8, quizzesWithSubmissions: 0, quizzesWithItemBanks: 0, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-hist', name: 'World History', teacherId: 't-tom', term: 'Fall 2026', courseType: 'active', subject: 'history', classicQuizzes: 10, migratedQuizzes: 3, quizzesWithSubmissions: 0, quizzesWithItemBanks: 3, quizzesWithUnsupportedTypes: 2 },
  { id: 'c-chem', name: 'Chemistry', teacherId: 't-sarah', term: 'Fall 2026', courseType: 'active', subject: 'science', classicQuizzes: 12, migratedQuizzes: 0, quizzesWithSubmissions: 5, quizzesWithItemBanks: 3, quizzesWithUnsupportedTypes: 2 },
  { id: 'c-phys', name: 'Physics', teacherId: 't-sarah', term: 'Spring 2026', courseType: 'active', subject: 'science', classicQuizzes: 8, migratedQuizzes: 0, quizzesWithSubmissions: 0, quizzesWithItemBanks: 0, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-photo', name: 'Digital Photography (Sandbox)', teacherId: 't-james', term: 'Spring 2026', courseType: 'other', subject: 'art', classicQuizzes: 7, migratedQuizzes: 0, quizzesWithSubmissions: 3, quizzesWithItemBanks: 2, quizzesWithUnsupportedTypes: 1 },
  { id: 'c-calc', name: 'Pre-Calculus (2025)', teacherId: 't-priya', term: 'Fall 2025', courseType: 'other', subject: 'math', classicQuizzes: 4, migratedQuizzes: 5, quizzesWithSubmissions: 0, quizzesWithItemBanks: 0, quizzesWithUnsupportedTypes: 0 },
  { id: 'c-gov', name: 'US Government (2025)', teacherId: 't-tom', term: 'Fall 2025', courseType: 'other', subject: 'history', classicQuizzes: 5, migratedQuizzes: 1, quizzesWithSubmissions: 2, quizzesWithItemBanks: 0, quizzesWithUnsupportedTypes: 1 },
]

// --- Bulk course generation (deterministic, so each tab has 50+ courses) ------

const SUBJECTS: { key: SubjectKey; label: string }[] = [
  { key: 'biology', label: 'Biology' },
  { key: 'language', label: 'Spanish' },
  { key: 'art', label: 'Art' },
  { key: 'math', label: 'Algebra' },
  { key: 'history', label: 'History' },
  { key: 'science', label: 'Chemistry' },
]
const LEVELS = ['101', '102', '110', '201', '210', 'I', 'II', 'III', 'Honors', 'AP', 'Lab', 'Seminar']
const BP_TOPICS = ['Core', 'Foundations', 'Survey', 'Advanced', 'Standard', 'Applied', 'General', 'Accelerated', 'Honors', 'Regents']
const OTHER_TAGS = ['Sandbox', 'Archived', '2025', 'Draft', 'Pilot', 'Copy', 'Test', '2024']
const ACTIVE_TERMS = ['Fall 2026', 'Spring 2026']
const OTHER_TERMS = ['Fall 2025', 'Spring 2025', 'Summer 2025', 'Fall 2024']

function genCourse(group: 'blueprint' | 'active' | 'other', i: number): Course {
  const subject = SUBJECTS[i % SUBJECTS.length]
  const teacher = TEACHERS[(i * 3 + group.length) % TEACHERS.length]
  const classicQuizzes = 4 + ((i * 3) % 11) // 4–14
  const migratedQuizzes = (i * 5) % 9 // 0–8
  // Blueprint/template courses are never published, so they can't have submissions.
  let sub = group !== 'blueprint' && i % 4 === 0 ? 1 + (i % 3) : 0
  let bank = i % 3 === 0 ? 1 + (i % 2) : 0
  let unsup = i % 5 === 0 ? 1 : 0
  while (sub + bank + unsup > classicQuizzes) {
    if (unsup) unsup--
    else if (bank) bank--
    else sub--
  }

  let name: string
  let term: string
  let courseType: CourseType
  if (group === 'blueprint') {
    courseType = i % 2 === 0 ? 'blueprint' : 'template'
    name = `${subject.label} ${BP_TOPICS[i % BP_TOPICS.length]} — ${courseType === 'blueprint' ? 'Blueprint' : 'Template'}`
    term = 'District'
  } else if (group === 'active') {
    courseType = 'active'
    name = `${subject.label} ${LEVELS[i % LEVELS.length]} · Sec ${(i % 6) + 1}`
    term = ACTIVE_TERMS[i % ACTIVE_TERMS.length]
  } else {
    courseType = 'other'
    name = `${subject.label} ${LEVELS[i % LEVELS.length]} (${OTHER_TAGS[i % OTHER_TAGS.length]})`
    term = OTHER_TERMS[i % OTHER_TERMS.length]
  }

  return {
    id: `gen-${group}-${i}`,
    name,
    teacherId: teacher.id,
    term,
    courseType,
    subject: subject.key,
    classicQuizzes,
    migratedQuizzes,
    quizzesWithSubmissions: sub,
    quizzesWithItemBanks: bank,
    quizzesWithUnsupportedTypes: unsup,
  }
}

const generated = (['blueprint', 'active', 'other'] as const).flatMap((group) =>
  Array.from({ length: 50 }, (_, i) => genCourse(group, i)),
)

export const COURSES: Course[] = [...FEATURED, ...generated]

export function teacherName(teacherId: string): string {
  return TEACHERS.find((t) => t.id === teacherId)?.name ?? 'Unknown'
}

export const MIGRATION_DUE_DATE = 'September 1, 2027'

// --- Quiz-level data ---------------------------------------------------------

// Per-course themed name pools. Bio 101 leads with the names from the design; the rest
// reuse a subject pool. Quizzes are generated deterministically from the course's counts.
const BIOLOGY = ['Cell Structure', 'Intro to Genetics', 'Photosynthesis 101', 'Ecology Fundamentals', 'Evolutionary Concepts', 'Anatomy Overview', 'Physiology Principles', 'Microbiology Intro', 'Botany Basics', 'Cellular Respiration', 'Human Systems', 'Biodiversity']
const LANGUAGE = ['Greetings & Basics', 'Verb Conjugation', 'Past Tense', 'Vocabulary Builder', 'Listening Practice', 'Reading Comprehension', 'Cultural Notes', 'Dialogue Practice', 'Numbers & Dates', 'Travel Phrases']
const ART = ['Color Theory', 'Composition Basics', 'Figure Drawing', 'Art History', 'Studio Critique', 'Perspective Drawing', 'Media & Materials', 'Portfolio Review', 'Line & Form', 'Light & Shadow', 'Texture Studies']
const MATH = ['Linear Equations', 'Quadratics', 'Functions & Graphs', 'Polynomials', 'Trigonometry Basics', 'Logarithms', 'Sequences & Series', 'Probability', 'Rational Expressions', 'Systems of Equations']
const HISTORY = ['The Age of Empires', 'Fall of Rome', 'The Renaissance Era', 'Revolutions & Reform', 'Medieval Kingdoms', 'World Wars', 'The Cold War', 'Industrial Revolution', 'Ancient Civilizations', 'Modern Movements']
const SCIENCE = ['Atomic Structure', 'Chemical Bonds', 'Reactions & Equations', 'States of Matter', 'Thermodynamics', 'Periodic Trends', 'Stoichiometry', 'Acids & Bases', 'Kinematics', 'Forces & Motion', 'Energy & Work', 'Waves']

const SUBJECT_POOLS: Record<SubjectKey, string[]> = {
  biology: BIOLOGY,
  language: LANGUAGE,
  art: ART,
  math: MATH,
  history: HISTORY,
  science: SCIENCE,
}

export type Quiz = {
  id: string
  courseId: string
  name: string
  questionCount: number
  issues: IssueKey[] // empty = fully supported
}

// Generate the Classic quizzes still to migrate for a course, assigning each at most one
// issue so the per-issue counts add up exactly. Deterministic — no randomness.
export function courseQuizzes(c: Course): Quiz[] {
  const pool = SUBJECT_POOLS[c.subject]
  const { quizzesWithSubmissions: sub, quizzesWithItemBanks: bank, quizzesWithUnsupportedTypes: unsup } = c
  const out: Quiz[] = []
  for (let i = 0; i < c.classicQuizzes; i++) {
    let issues: IssueKey[] = []
    if (i < sub) issues = ['submissions']
    else if (i < sub + bank) issues = ['itemBanks']
    else if (i < sub + bank + unsup) issues = ['unsupportedTypes']
    const round = Math.floor(i / pool.length)
    const name = pool[i % pool.length] + (round > 0 ? ` ${round + 1}` : '')
    out.push({
      id: `${c.id}-q${i + 1}`,
      courseId: c.id,
      name,
      questionCount: 8 + ((i * 5 + 3) % 9) * 2, // 8–24, deterministic
      issues,
    })
  }
  return out
}

// The quizzes in a course that have already been migrated to New Quizzes. Generated from
// pool indices past the still-Classic ones so the names don't collide. No issues — they
// migrated cleanly.
export function courseMigratedQuizzes(c: Course): Quiz[] {
  const pool = SUBJECT_POOLS[c.subject]
  const out: Quiz[] = []
  for (let j = 0; j < c.migratedQuizzes; j++) {
    const i = c.classicQuizzes + j
    const round = Math.floor(i / pool.length)
    const name = pool[i % pool.length] + (round > 0 ? ` ${round + 1}` : '')
    out.push({ id: `${c.id}-m${j + 1}`, courseId: c.id, name, questionCount: 8 + ((i * 5 + 3) % 9) * 2, issues: [] })
  }
  return out
}

// Every quiz already on New Quizzes across the district, for the migrated-quizzes archive.
// hasClassic is false for roughly 1 in 4 — those were migrated without keeping the original,
// so there's no Classic quiz left to delete. flags note what each migrated quiz carried over
// (a reason to double-check it).
export type MigratedQuiz = { id: string; name: string; courseName: string; educator: string; flags: IssueKey[]; hasClassic: boolean; migratedAt: string }

const MIGRATION_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June']

export function allMigratedQuizzes(courses: Course[] = COURSES): MigratedQuiz[] {
  let i = 0
  return courses.flatMap((c) =>
    courseMigratedQuizzes(c).map((q) => {
      const idx = i++
      const flags: IssueKey[] = idx % 3 === 0 ? ['submissions'] : idx % 5 === 0 ? ['itemBanks'] : []
      const migratedAt = `${MIGRATION_MONTHS[idx % MIGRATION_MONTHS.length]} ${((idx * 5) % 27) + 1}, 2026`
      return { id: q.id, name: q.name, courseName: c.name, educator: teacherName(c.teacherId), flags, hasClassic: idx % 4 !== 3, migratedAt }
    }),
  )
}

// --- Migration status (safe / review) ----------------------------------------

export type MigrationStatusKind = 'safe' | 'review'

export type MigrationStatus = {
  kind: MigrationStatusKind
  label: string // 'Safe to migrate' | 'Review needed'
  color: 'success' | 'error' // InstUI Pill enum — green / red
  issues: IssueKey[] // distinct issue types present across the course's Classic quizzes
  reasonLabel: string // e.g. "Submissions, Item banks" (empty when safe)
  reviewQuizzes: number // Classic quizzes held back for review
}

export function migrationStatus(c: Course): MigrationStatus {
  const issues: IssueKey[] = []
  if (c.quizzesWithSubmissions > 0) issues.push('submissions')
  if (c.quizzesWithItemBanks > 0) issues.push('itemBanks')
  if (c.quizzesWithUnsupportedTypes > 0) issues.push('unsupportedTypes')

  const reviewQuizzes = Math.min(
    c.classicQuizzes,
    c.quizzesWithSubmissions + c.quizzesWithItemBanks + c.quizzesWithUnsupportedTypes,
  )
  const kind: MigrationStatusKind = issues.length > 0 ? 'review' : 'safe'

  return {
    kind,
    label: kind === 'safe' ? 'Safe to migrate' : 'Review needed',
    color: kind === 'safe' ? 'success' : 'error',
    issues,
    reasonLabel: issues.map((k) => ISSUE_LABELS[k]).join(', '),
    reviewQuizzes,
  }
}

// The status of a single quiz, used in the per-course drill-down.
export function quizStatus(q: Quiz): MigrationStatus {
  const kind: MigrationStatusKind = q.issues.length > 0 ? 'review' : 'safe'
  return {
    kind,
    label: kind === 'safe' ? 'Safe to migrate' : 'Review needed',
    color: kind === 'safe' ? 'success' : 'error',
    issues: q.issues,
    reasonLabel: q.issues.map((k) => ISSUE_LABELS[k]).join(', '),
    reviewQuizzes: kind === 'review' ? 1 : 0,
  }
}

// Quizzes that convert cleanly when this course migrates (everything not held for review).
export function safeToMigrateCount(c: Course): number {
  return Math.max(0, c.classicQuizzes - migrationStatus(c).reviewQuizzes)
}

// --- Banner stats ------------------------------------------------------------

export type BannerStats = {
  quizzesRequireAttention: number // flagged Classic quizzes across all courses
  quizzesRequireMigration: number // Classic quizzes still to migrate
  quizzesMigrated: number // already converted to New Quizzes
  progressPct: number // share of the total quiz population already on New Quizzes
}

export function bannerStats(courses: Course[] = COURSES): BannerStats {
  const quizzesRequireMigration = courses.reduce((s, c) => s + c.classicQuizzes, 0)
  const quizzesMigrated = courses.reduce((s, c) => s + c.migratedQuizzes, 0)
  const quizzesRequireAttention = courses.reduce((s, c) => s + migrationStatus(c).reviewQuizzes, 0)
  const total = quizzesRequireMigration + quizzesMigrated
  const progressPct = total > 0 ? Math.round((quizzesMigrated / total) * 100) : 0
  return { quizzesRequireAttention, quizzesRequireMigration, quizzesMigrated, progressPct }
}

// Every flagged Classic quiz across the district, for the "Quizzes require attention" modal.
export type AttentionQuiz = Quiz & { courseName: string; educator: string }

export function attentionQuizzes(courses: Course[] = COURSES): AttentionQuiz[] {
  return courses.flatMap((c) =>
    courseQuizzes(c)
      .filter((q) => q.issues.length > 0)
      .map((q) => ({ ...q, courseName: c.name, educator: teacherName(c.teacherId) })),
  )
}

// --- Quiz mix (New : Classic across all active courses) ----------------------

// Live snapshot of the New-vs-Classic split. Derived from course state, so it shifts
// toward New as the admin migrates. The total quiz population stays constant — migrating
// converts a Classic quiz into a New one, it doesn't add or remove quizzes.
export type QuizMix = {
  newCount: number
  classicCount: number
  total: number
  newShare: number // 0–100
  classicShare: number // 0–100
  ratioLabel: string // e.g. "1 : 3.2 (New : Classic)"
}

export function quizMix(courses: Course[] = COURSES): QuizMix {
  const newCount = courses.reduce((s, c) => s + c.migratedQuizzes, 0)
  const classicCount = courses.reduce((s, c) => s + c.classicQuizzes, 0)
  const total = newCount + classicCount
  const newShare = total > 0 ? Math.round((newCount / total) * 100) : 0
  const classicShare = total > 0 ? 100 - newShare : 0

  let ratioLabel: string
  if (newCount === 0) ratioLabel = 'All Classic Quizzes'
  else if (classicCount === 0) ratioLabel = 'All New Quizzes'
  else if (newCount >= classicCount) ratioLabel = `${(newCount / classicCount).toFixed(1)} : 1 (New : Classic)`
  else ratioLabel = `1 : ${(classicCount / newCount).toFixed(1)} (New : Classic)`

  return { newCount, classicCount, total, newShare, classicShare, ratioLabel }
}

// --- Quiz creation provenance ------------------------------------------------

// How every quiz across the active courses first came to exist. District-level aggregate
// (the prototype doesn't track provenance per course), with counts that sum to the same
// total quiz population the mix above reports. Illustrative numbers, not live data.
export type QuizSourceKey = 'scratch' | 'courseCopy' | 'blueprint' | 'bulkMigration' | 'import'

export type QuizSource = {
  key: QuizSourceKey
  label: string
  count: number
  color: string // InstUI dataVisualization palette (45-level primary)
}

export const QUIZ_SOURCES: QuizSource[] = [
  { key: 'scratch', label: 'Created from scratch', count: 44, color: '#2573DF' }, // ocean
  { key: 'courseCopy', label: 'Course copy', count: 38, color: '#BF5811' }, // copper
  { key: 'blueprint', label: 'Blueprint sync', count: 21, color: '#9E58BD' }, // violet
  { key: 'bulkMigration', label: 'Bulk migration', count: 18, color: '#00828E' }, // sea
  { key: 'import', label: 'Other imports', count: 8, color: '#6A7883' }, // grey
]

// Creation provenance scaled to the actual quiz population, keeping the proportions above,
// so the donut total matches the district's real quiz count.
export function quizSources(courses: Course[] = COURSES): QuizSource[] {
  const total = courses.reduce((s, c) => s + c.classicQuizzes + c.migratedQuizzes, 0)
  const base = QUIZ_SOURCES.reduce((s, x) => s + x.count, 0)
  return QUIZ_SOURCES.map((src) => ({ ...src, count: Math.round((total * src.count) / base) }))
}
