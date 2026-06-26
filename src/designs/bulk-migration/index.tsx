import { useState } from 'react'
import type { ReactNode } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Link } from '@instructure/ui-link/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { List } from '@instructure/ui-list/latest'
import { Table } from '@instructure/ui-table/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { Tag } from '@instructure/ui-tag/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { Spinner } from '@instructure/ui-spinner/latest'
import { Alert } from '@instructure/ui-alerts/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  SettingsInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  SunInstUIIcon,
  MoonInstUIIcon,
  RocketSolidInstUIIcon,
  ChartColumnInstUIIcon,
  GraduationCapInstUIIcon,
  SparklesInstUIIcon,
  BadgeCheckInstUIIcon,
  ClipboardCheckInstUIIcon,
  DatabaseInstUIIcon,
  SearchInstUIIcon,
  FilterInstUIIcon,
  IconCanvasLogoSolid,
} from '@instructure/ui-icons'
import { MigrationBanner } from './MigrationBanner'
import { DonutChart } from './DonutChart'
import { MigrationRollout } from './MigrationRollout'
import { ContentFlags } from './MigrationStatus'
import { ScanModal } from './ScanModal'
import { MigrateModal } from './MigrateModal'
import { QuizzesRequireAttentionModal } from './QuizzesRequireAttentionModal'
import { CourseQuizzesModal } from './CourseQuizzesModal'
import { ItemBankInfoModal } from './ItemBankInfoModal'
import { ComparisonTable } from './ComparisonTable'
import type { ComparedQuiz } from './ComparisonTable'
import { CourseFilterTray } from './CourseFilterTray'
import { MigratedQuizzesModal } from './MigratedQuizzesModal'
import {
  COURSES,
  bannerStats,
  courseQuizzes,
  allMigratedQuizzes,
  migrationStatus,
  safeToMigrateCount,
  teacherName,
  ISSUE_LABELS,
  QUIZ_SOURCES,
} from './migrationModel'
import type { Course, IssueKey } from './migrationModel'
import type { PrototypeProps } from '../../registry'

type ViewName = 'hub' | 'dashboard' | 'migrating' | 'complete'
type SortKey = 'course' | 'educator' | 'status' | 'classic' | 'new'
type SortDir = 'ascending' | 'descending'

// Analytics Hub entry cards. Only the migration card is wired up; the rest mirror the
// Figma so the dashboard sits in its real home.
const HUB_CARDS: { key: string; title: string; desc: string; icon: ReactNode; active?: boolean }[] = [
  { key: 'ai', title: 'AI Assessment Insights', desc: 'Surface patterns across your assessments with AI.', icon: <SparklesInstUIIcon /> },
  { key: 'usage', title: 'Usage & Adoption', desc: 'Track how Canvas is used across the district.', icon: <ChartColumnInstUIIcon /> },
  { key: 'student', title: 'Student Success', desc: 'Spot students in need of attention earlier.', icon: <GraduationCapInstUIIcon /> },
  { key: 'course', title: 'Course Effectiveness', desc: 'Compare outcomes across courses and terms.', icon: <BadgeCheckInstUIIcon /> },
  { key: 'standards', title: 'Standards Proficiency', desc: 'Aggregate performance against standards.', icon: <ClipboardCheckInstUIIcon /> },
  { key: 'results', title: 'Assessment Results', desc: 'Benchmark, formative, and state results.', icon: <ChartColumnInstUIIcon /> },
  { key: 'data', title: 'Data Access', desc: 'Canvas Data 2 services and query APIs.', icon: <DatabaseInstUIIcon /> },
  { key: 'migration', title: 'Quiz Migration Progress', desc: 'Track and migrate Classic Quizzes to New Quizzes.', icon: <RocketSolidInstUIIcon />, active: true },
]

const SOURCE_TOTAL = QUIZ_SOURCES.reduce((s, x) => s + x.count, 0)

export default function BulkMigration({ isDark, onToggleTheme }: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()

  const [view, setView] = useState<ViewName>('hub')
  const [courses, setCourses] = useState<Course[]>(COURSES)

  // Table state
  const [sortKey, setSortKey] = useState<SortKey>('status')
  const [sortDir, setSortDir] = useState<SortDir>('descending')
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)

  // Search + filters
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterEducators, setFilterEducators] = useState<Set<string>>(new Set())
  const [filterFlags, setFilterFlags] = useState<Set<IssueKey>>(new Set())
  const [filterTerms, setFilterTerms] = useState<Set<string>>(new Set())

  // Migrate flow + modals
  const [migrateScope, setMigrateScope] = useState<Course[]>([])
  const [scanOpen, setScanOpen] = useState(false)
  const [migrateOpen, setMigrateOpen] = useState(false)
  const [attentionOpen, setAttentionOpen] = useState(false)
  const [migratedOpen, setMigratedOpen] = useState(false)
  const [courseModalId, setCourseModalId] = useState<string | null>(null)
  const [itemBankInfoOpen, setItemBankInfoOpen] = useState(false)
  const [lastResult, setLastResult] = useState<{ courses: number; migrated: number; review: number; quizzes: ComparedQuiz[] } | null>(null)

  const card = {
    background: 'primary' as const,
    themeOverride: { backgroundPrimary: sharedTokens.background.containerColor },
    borderRadius: sharedTokens.borderRadius.card.lg,
    shadow: 'resting' as const,
  }

  const stats = bannerStats(courses)
  const migratable = courses.filter((c) => c.classicQuizzes > 0)
  const courseModal = courses.find((c) => c.id === courseModalId) ?? null

  // --- Sorting ---------------------------------------------------------------

  const rows = courses.map((c) => ({
    course: c,
    status: migrationStatus(c),
    educator: teacherName(c.teacherId),
  }))

  const sortedRows = [...rows].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'course') cmp = a.course.name.localeCompare(b.course.name)
    else if (sortKey === 'educator') cmp = a.educator.localeCompare(b.educator)
    else if (sortKey === 'status') cmp = (a.status.kind === 'review' ? 1 : 0) - (b.status.kind === 'review' ? 1 : 0)
    else if (sortKey === 'classic') cmp = a.course.classicQuizzes - b.course.classicQuizzes
    else cmp = a.course.migratedQuizzes - b.course.migratedQuizzes
    return sortDir === 'ascending' ? cmp : -cmp
  })

  // Filter options + active filtering
  const educatorOptions = [...new Set(courses.map((c) => teacherName(c.teacherId)))].sort()
  const termOptions = [...new Set(courses.map((c) => c.term))].sort()
  const activeFilterCount = filterEducators.size + filterFlags.size + filterTerms.size

  const q = search.trim().toLowerCase()
  const filteredRows = sortedRows.filter((r) => {
    const matchesSearch = !q || r.course.name.toLowerCase().includes(q) || r.educator.toLowerCase().includes(q)
    const matchesEducator = filterEducators.size === 0 || filterEducators.has(r.educator)
    const matchesTerm = filterTerms.size === 0 || filterTerms.has(r.course.term)
    const matchesFlags = filterFlags.size === 0 || r.status.issues.some((k) => filterFlags.has(k))
    return matchesSearch && matchesEducator && matchesTerm && matchesFlags
  })
  const visibleRows = showSelectedOnly ? filteredRows.filter((r) => selectedCourses.includes(r.course.id)) : filteredRows

  const toggleInSet = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>) => (value: T) =>
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  const clearFilters = () => {
    setFilterEducators(new Set())
    setFilterFlags(new Set())
    setFilterTerms(new Set())
  }

  const onSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'ascending' ? 'descending' : 'ascending'))
    else {
      setSortKey(key)
      setSortDir('ascending')
    }
  }
  const headerSort = (key: SortKey) => (sortKey === key ? sortDir : 'none')

  // --- Selection -------------------------------------------------------------

  const toggleCourse = (id: string) =>
    setSelectedCourses((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const allMigratableSelected = migratable.length > 0 && migratable.every((c) => selectedCourses.includes(c.id))
  const toggleAll = () => setSelectedCourses(allMigratableSelected ? [] : migratable.map((c) => c.id))

  // --- Migrate flow ----------------------------------------------------------

  const launchMigrate = (scope: Course[]) => {
    if (scope.length === 0) return
    setMigrateScope(scope)
    setScanOpen(true)
  }

  const onScanComplete = () => {
    setScanOpen(false)
    setMigrateOpen(true)
  }

  const runMigration = () => {
    setMigrateOpen(false)
    const ids = migrateScope.map((c) => c.id)
    const migrated = migrateScope.reduce((s, c) => s + safeToMigrateCount(c), 0)
    const review = migrateScope.reduce((s, c) => s + migrationStatus(c).reviewQuizzes, 0)
    // The quizzes that actually migrated (the safe ones) become the old-vs-new comparison.
    const migratedList: ComparedQuiz[] = migrateScope.flatMap((c) =>
      courseQuizzes(c)
        .filter((q) => q.issues.length === 0)
        .map((q) => ({ id: q.id, name: q.name, courseName: c.name, educator: teacherName(c.teacherId), flags: q.issues, hasClassic: true })),
    )
    setLastResult({ courses: migrateScope.length, migrated, review, quizzes: migratedList })
    setView('migrating')
    setTimeout(() => {
      // Safe quizzes convert; flagged ones stay as Classic for individual review.
      setCourses((prev) =>
        prev.map((c) =>
          ids.includes(c.id)
            ? { ...c, migratedQuizzes: c.migratedQuizzes + safeToMigrateCount(c), classicQuizzes: migrationStatus(c).reviewQuizzes }
            : c,
        ),
      )
      setSelectedCourses([])
      setView('complete')
    }, 1900)
  }

  // --- Views -----------------------------------------------------------------

  const renderHub = () => (
    <Flex direction="column" gap="medium">
      <Breadcrumb label="Navigation">
        <Breadcrumb.Link>Washington School District</Breadcrumb.Link>
        <Breadcrumb.Link>Analytics Hub</Breadcrumb.Link>
      </Breadcrumb>

      <Flex direction="column" gap="x-small">
        <Heading level="h1" variant="titlePageDesktop" margin="0">Analytics Hub</Heading>
        <Text color="secondary">
          The Analytics Hub brings together core and upgrade features to help you improve student success,
          optimize course effectiveness, and better manage your teaching and learning ecosystem.
        </Text>
      </Flex>

      <Flex gap="medium" wrap="wrap" alignItems="stretch">
        {HUB_CARDS.map((c) => (
          <Flex.Item key={c.key} size="22rem" shouldGrow>
            <View
              as={c.active ? 'button' : 'div'}
              display="block"
              width="100%"
              height="100%"
              textAlign="start"
              padding="medium"
              {...card}
              cursor={c.active ? 'pointer' : 'auto'}
              onClick={c.active ? () => setView('dashboard') : undefined}
              themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
              borderWidth={c.active ? 'medium' : 'small'}
              borderColor={c.active ? 'brand' : 'primary'}
            >
              <Flex gap="small" alignItems="start">
                <View as="div" margin="xxx-small 0 0 0">
                  <Text color={c.active ? 'brand' : 'secondary'}>{c.icon}</Text>
                </View>
                <Flex.Item shouldGrow shouldShrink>
                  <Flex gap="x-small" alignItems="center" wrap="wrap">
                    <Heading level="h3" variant="titleCardRegular" margin="0">{c.title}</Heading>
                    {c.active ? <Pill color="info">Active</Pill> : null}
                  </Flex>
                  <View as="div" display="block" margin="xx-small 0 0 0">
                    <Text as="div" size="content" color="secondary">{c.desc}</Text>
                  </View>
                </Flex.Item>
              </Flex>
            </View>
          </Flex.Item>
        ))}
      </Flex>
    </Flex>
  )

  const panelCard = (title: string, body: string, content: ReactNode) => (
    <View as="div" display="block" height="100%" padding="medium" {...card}>
      <Flex direction="column" gap="small" height="100%">
        <Flex direction="column" gap="xxx-small">
          <Heading level="h3" variant="titleCardRegular" margin="0">{title}</Heading>
          <Text size="contentSmall" color="secondary">{body}</Text>
        </Flex>
        <View as="div" display="block" margin="small 0 0 0">{content}</View>
      </Flex>
    </View>
  )

  const renderDashboard = () => (
    <Flex direction="column" gap="medium">
      <Breadcrumb label="Navigation">
        <Breadcrumb.Link onClick={() => setView('hub')}>Washington School District</Breadcrumb.Link>
        <Breadcrumb.Link onClick={() => setView('hub')}>Analytics Hub</Breadcrumb.Link>
        <Breadcrumb.Link>Quiz Migration Progress</Breadcrumb.Link>
      </Breadcrumb>

      <Heading level="h1" variant="titlePageDesktop" margin="0">Quiz Migration</Heading>

      <MigrationBanner stats={stats} onViewAttention={() => setAttentionOpen(true)} onViewMigrated={() => setMigratedOpen(true)} />

      {/* Two panels: creation breakdown + rollout timeline */}
      <Flex gap="medium" alignItems="stretch" wrap="wrap">
        <Flex.Item size="26rem" shouldGrow shouldShrink>
          {panelCard(
            'How Quizzes were created',
            `Origin of all ${SOURCE_TOTAL} quizzes across active courses.`,
            <DonutChart segments={QUIZ_SOURCES} centerLabel={String(SOURCE_TOTAL)} centerSub="quizzes" />,
          )}
        </Flex.Item>
        <Flex.Item size="26rem" shouldGrow shouldShrink>
          {panelCard(
            'Migration rollout',
            'Where your institution stands on the New Quizzes rollout. Turn options on in your feature options when you’re ready.',
            <MigrationRollout />,
          )}
        </Flex.Item>
      </Flex>

      {/* All courses to migrate */}
      <View as="div" display="block" padding="medium" {...card}>
        <Flex direction="column" gap="small" alignItems="stretch">
          <Heading level="h2" variant="titleCardRegular" margin="0">All courses to migrate</Heading>
          <View as="div" display="block">
            <Text>Most quizzes migrate without issues. Before migrating, review courses with quizzes that have:</Text>
            <List margin="xx-small 0 0 0">
              <List.Item>Submissions — to protect graded student data.</List.Item>
              <List.Item>
                Question banks — when converting Classic Quizzes using Question Banks, your associated Question
                Banks migrate into New Quizzes as distinct, centralized Item Banks tied to your user account
                with default view-only access.{' '}
                <Link onClick={() => setItemBankInfoOpen(true)}>Learn more</Link>
              </List.Item>
            </List>
          </View>

          {/* Search + filter */}
          <Flex gap="small" alignItems="end" margin="x-small 0 0 0">
            <Flex.Item shouldGrow shouldShrink>
              <TextInput
                renderLabel="Search"
                placeholder="Type to search"
                value={search}
                onChange={(_e, value) => setSearch(value)}
                renderBeforeInput={<SearchInstUIIcon inline={false} />}
              />
            </Flex.Item>
            <Flex.Item>
              <Button renderIcon={<FilterInstUIIcon />} onClick={() => setFilterOpen(true)}>
                {activeFilterCount > 0 ? `Filter (${activeFilterCount})` : 'Filter'}
              </Button>
            </Flex.Item>
          </Flex>

          {/* Active filter tags */}
          {activeFilterCount > 0 ? (
            <Flex gap="x-small" alignItems="center" wrap="wrap">
              {[...filterEducators].map((name) => (
                <Tag key={`ed-${name}`} text={name} dismissible onClick={() => toggleInSet(setFilterEducators)(name)} />
              ))}
              {[...filterFlags].map((k) => (
                <Tag key={`fl-${k}`} text={ISSUE_LABELS[k]} dismissible onClick={() => toggleInSet(setFilterFlags)(k)} />
              ))}
              {[...filterTerms].map((t) => (
                <Tag key={`tm-${t}`} text={t} dismissible onClick={() => toggleInSet(setFilterTerms)(t)} />
              ))}
              <Link onClick={clearFilters}>Clear all</Link>
            </Flex>
          ) : null}

          <Flex width="100%" justifyItems="space-between" alignItems="center" wrap="wrap" gap="medium" margin="x-small 0 0 0">
            <View as="div" display="inline-block">
              <Checkbox
                variant="toggle"
                size="small"
                label={`Show selected only${selectedCourses.length ? ` (${selectedCourses.length})` : ''}`}
                checked={showSelectedOnly}
                onChange={(e) => setShowSelectedOnly(e.target.checked)}
              />
            </View>
            <Button
              color="primary"
              renderIcon={<RocketSolidInstUIIcon />}
              interaction={selectedCourses.length > 0 ? 'enabled' : 'disabled'}
              onClick={() => launchMigrate(courses.filter((c) => selectedCourses.includes(c.id)))}
            >
              Preview migration
            </Button>
          </Flex>

          <Table caption="Courses and migration status" layout="auto">
            <Table.Head renderSortLabel="Sort by">
              <Table.Row>
                <Table.ColHeader id="d-select" width="3rem">
                  <Checkbox
                    label={<ScreenReaderContent>Select all courses</ScreenReaderContent>}
                    checked={allMigratableSelected}
                    indeterminate={!allMigratableSelected && selectedCourses.length > 0}
                    onChange={toggleAll}
                  />
                </Table.ColHeader>
                <Table.ColHeader id="d-course" sortDirection={headerSort('course')} onRequestSort={() => onSort('course')}>Course</Table.ColHeader>
                <Table.ColHeader id="d-educator" sortDirection={headerSort('educator')} onRequestSort={() => onSort('educator')}>Educator</Table.ColHeader>
                <Table.ColHeader id="d-status" sortDirection={headerSort('status')} onRequestSort={() => onSort('status')}>Content flags</Table.ColHeader>
                <Table.ColHeader id="d-classic" sortDirection={headerSort('classic')} onRequestSort={() => onSort('classic')} textAlign="end">Classic Quizzes</Table.ColHeader>
                <Table.ColHeader id="d-new" sortDirection={headerSort('new')} onRequestSort={() => onSort('new')} textAlign="end">New Quizzes</Table.ColHeader>
                <Table.ColHeader id="d-action" textAlign="end" width="11rem">Action</Table.ColHeader>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {visibleRows.map((r) => (
                <Table.Row key={r.course.id}>
                  <Table.Cell>
                    <Checkbox
                      label={<ScreenReaderContent>Select {r.course.name}</ScreenReaderContent>}
                      checked={selectedCourses.includes(r.course.id)}
                      disabled={r.course.classicQuizzes === 0}
                      onChange={() => toggleCourse(r.course.id)}
                    />
                  </Table.Cell>
                  <Table.RowHeader>
                    <Text weight="bold">{r.course.name}</Text>
                    <Text as="div" size="contentSmall" color="secondary">{r.course.term}</Text>
                  </Table.RowHeader>
                  <Table.Cell>{r.educator}</Table.Cell>
                  <Table.Cell><ContentFlags status={r.status} /></Table.Cell>
                  <Table.Cell textAlign="end">{r.course.classicQuizzes}</Table.Cell>
                  <Table.Cell textAlign="end">{r.course.migratedQuizzes}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Button
                      size="small"
                      interaction={r.course.classicQuizzes > 0 ? 'enabled' : 'disabled'}
                      onClick={() => launchMigrate([r.course])}
                    >
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {r.course.classicQuizzes > 0 ? 'Preview migration' : 'Done'}
                      </span>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {visibleRows.length === 0 ? (
            <View as="div" display="block" padding="medium" textAlign="center">
              <Text color="secondary">No courses match your search and filters.</Text>
            </View>
          ) : null}
        </Flex>
      </View>
    </Flex>
  )

  const renderMigrating = () => (
    <Flex direction="column" gap="medium" alignItems="center" justifyItems="center" height="60vh">
      <Spinner renderTitle="Migrating quizzes to New Quizzes" size="large" />
      <Heading level="h2" variant="titleSection" margin="0">Migrating quizzes…</Heading>
      <Text color="secondary">This runs in the background. You can keep working while it finishes.</Text>
    </Flex>
  )

  const renderComplete = () => {
    return (
      <Flex direction="column" gap="medium">
        <Breadcrumb label="Navigation">
          <Breadcrumb.Link onClick={() => setView('hub')}>Analytics Hub</Breadcrumb.Link>
          <Breadcrumb.Link onClick={() => setView('dashboard')}>Quiz Migration</Breadcrumb.Link>
          <Breadcrumb.Link>Migration complete</Breadcrumb.Link>
        </Breadcrumb>

        <Heading level="h1" variant="titlePageDesktop" margin="0">Migration complete</Heading>

        <Alert variant="success" margin="0" hasShadow={false}>
          Migrated {lastResult?.migrated ?? 0} quizzes across {lastResult?.courses ?? 0}{' '}
          {lastResult?.courses === 1 ? 'course' : 'courses'} to New Quizzes.
        </Alert>

        {lastResult && lastResult.quizzes.length > 0 ? (
          <View as="div" padding="medium" display="block" {...card}>
            <Flex direction="column" gap="small">
              <Heading level="h3" variant="titleCardRegular" margin="0">Compare and confirm</Heading>
              <Text color="secondary">
                Open each version to compare the Classic and New Quizzes side by side in a new tab. Mark each as
                reviewed, then delete the original Classic quiz once you're confident.
              </Text>
              <ComparisonTable quizzes={lastResult.quizzes} />
            </Flex>
          </View>
        ) : null}

        <Flex gap="small" justifyItems="end">
          <Button color="primary" onClick={() => setView('dashboard')}>Back to dashboard</Button>
        </Flex>
      </Flex>
    )
  }

  const content =
    view === 'hub' ? renderHub()
    : view === 'dashboard' ? renderDashboard()
    : view === 'migrating' ? renderMigrating()
    : renderComplete()

  return (
    <View
      as="div"
      height="100vh"
      overflowX="hidden"
      overflowY="hidden"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
    >
      <Flex height="100%" width="100%" alignItems="stretch" padding="0 0 small 0">
        <View as="div" height="100%" padding="0 0 small 0" display="block">
          <SideNavBar
            label="Main navigation"
            toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}
          >
            <SideNavBar.Item
              icon={<IconCanvasLogoSolid size="medium" />}
              label={<ScreenReaderContent>Canvas</ScreenReaderContent>}
              href="#"
              themeOverride={{ contentPadding: '1em 0.375rem 1em 0.375rem' }}
            />
            <SideNavBar.Item icon={<Avatar name="Admin User" size="x-small" />} label="Account" href="#" />
            <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" selected />
            <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" />
            <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" />
            <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
            <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
            <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
            <SideNavBar.Item
              icon={isDark ? <SunInstUIIcon /> : <MoonInstUIIcon />}
              label="Theme"
              onClick={onToggleTheme}
            />
          </SideNavBar>
        </View>

        <Flex.Item shouldGrow shouldShrink overflowY="auto">
          <View as="div" height="100%" overflowY="auto" padding="large" display="block">
            <View as="div" maxWidth="1100px" display="block" margin="0 auto" width="100%">
              {content}
            </View>
          </View>
        </Flex.Item>
      </Flex>

      {/* Migrate flow */}
      <ScanModal
        open={scanOpen}
        total={Math.max(1, migrateScope.reduce((s, c) => s + c.classicQuizzes, 0))}
        onComplete={onScanComplete}
        onClose={() => setScanOpen(false)}
      />
      <MigrateModal
        open={migrateOpen}
        courses={migrateScope}
        onCancel={() => setMigrateOpen(false)}
        onMigrate={runMigration}
      />
      <QuizzesRequireAttentionModal
        open={attentionOpen}
        courses={courses}
        onClose={() => setAttentionOpen(false)}
        onOpenCourse={(id) => {
          setAttentionOpen(false)
          setCourseModalId(id)
        }}
      />
      <CourseQuizzesModal
        open={courseModal !== null}
        course={courseModal}
        onClose={() => setCourseModalId(null)}
      />
      <ItemBankInfoModal open={itemBankInfoOpen} onClose={() => setItemBankInfoOpen(false)} />
      <MigratedQuizzesModal open={migratedOpen} quizzes={allMigratedQuizzes(courses)} onClose={() => setMigratedOpen(false)} />
      <CourseFilterTray
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        educators={educatorOptions}
        terms={termOptions}
        selectedEducators={filterEducators}
        selectedFlags={filterFlags}
        selectedTerms={filterTerms}
        onEducatorsChange={(v) => setFilterEducators(new Set(v))}
        onFlagsChange={(v) => setFilterFlags(new Set(v))}
        onTermsChange={(v) => setFilterTerms(new Set(v))}
      />
    </View>
  )
}
