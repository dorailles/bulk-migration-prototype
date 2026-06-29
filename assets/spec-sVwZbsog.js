import{$ as e,A as t,B as n,C as r,Ct as i,D as a,F as o,G as s,M as c,N as l,O as u,P as d,Rt as f,S as p,T as m,Tt as h,W as g,a as _,an as v,b as y,d as b,en as x,g as S,h as ee,i as te,j as C,k as w,l as T,m as E,n as D,nn as ne,nt as re,o as O,ot as ie,r as ae,rn as oe,s as se,t as k,tt as A,u as j,ut as M,v as N,vt as P,w as F,x as I,y as L,z as R}from"./ComparisonTable-CSJfd5s7.js";var z=v(oe(),1),B=ne(),V=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Table } from '@instructure/ui-table/latest'
import { ContentFlags } from '../../bulk-migration/MigrationStatus'
import { attentionQuizzes, quizStatus, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// "Quizzes with content flags" modal, reached from the banner. Every flagged Classic quiz
// across the district in one list — quiz, course, educator, and the same Content flags
// cell used everywhere else. This is a read-only heads-up view; the admin migrates from
// the dashboard, not here.
export function attentionList({ sharedTokens }: FrameCtx): React.ReactNode {
  const rows = attentionQuizzes(COURSES).slice(0, 7)
  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="large"
    >
      <Flex direction="column" gap="small" alignItems="stretch">
        <Heading level="h2" variant="titleCardLarge" margin="0">Quizzes with content flags</Heading>
        <Table caption="Quizzes with content flags" layout="auto">
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="a-quiz">Quiz</Table.ColHeader>
              <Table.ColHeader id="a-course">Course</Table.ColHeader>
              <Table.ColHeader id="a-ed">Educator</Table.ColHeader>
              <Table.ColHeader id="a-flags">Content flags</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((q) => (
              <Table.Row key={q.id}>
                <Table.RowHeader><Text weight="bold">{q.name}</Text></Table.RowHeader>
                <Table.Cell>{q.courseName}</Table.Cell>
                <Table.Cell>{q.educator}</Table.Cell>
                <Table.Cell><ContentFlags status={quizStatus(q)} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Flex>
    </View>
  )
}
`,H=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Alert } from '@instructure/ui-alerts/latest'
import { ComparisonTable } from '../../bulk-migration/ComparisonTable'
import { allMigratedQuizzes, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// Migration complete. A success summary, then the real before/after comparison table:
// each migrated quiz as its Classic and New Quizzes versions (titles open the respective
// builders), selectable rows, and a "Replace original" action — single or bulk, always
// confirmed. Rows with no Classic original can't be selected. The toolbar also offers
// "Report migration issue" and an Export to PDF.
export function complete({ sharedTokens }: FrameCtx): React.ReactNode {
  const quizzes = allMigratedQuizzes(COURSES).slice(0, 5)
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="stretch">
        <Heading level="h1" variant="titlePageDesktop" margin="0">Migration complete</Heading>
        <Alert variant="success" margin="0" hasShadow={false}>
          Migrated 18 quizzes across 3 courses to New Quizzes.
        </Alert>
        <View
          as="div"
          display="block"
          padding="medium"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderRadius={sharedTokens.borderRadius.card.lg}
          shadow="resting"
        >
          <Flex direction="column" gap="small">
            <Heading level="h3" variant="titleCardRegular" margin="0">Compare and confirm</Heading>
            <Text color="secondary">You can use this list to compare the newly created quizzes to their Classic version.</Text>
            <ComparisonTable quizzes={quizzes} />
          </Flex>
        </View>
      </Flex>
    </View>
  )
}
`,U=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { ContentFlags } from '../../bulk-migration/MigrationStatus'
import { ISSUE_LABELS } from '../../bulk-migration/migrationModel'
import type { IssueKey, MigrationStatus } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// The Content flags system. Flags are informational, not a to-do — they name what won't
// migrate cleanly so an admin can decide. No status word, no icon: a course either lists
// its flags or shows a muted em dash. The same ContentFlags component renders in every
// table (dashboard, attention list, comparison, archive) so they all read identically.
const mk = (issues: IssueKey[]): MigrationStatus => ({
  kind: issues.length ? 'review' : 'safe',
  label: issues.length ? 'Review needed' : 'Safe to migrate',
  color: issues.length ? 'error' : 'success',
  issues,
  reasonLabel: issues.map((k) => ISSUE_LABELS[k]).join(', '),
  reviewQuizzes: issues.length,
})

const ROWS: { status: MigrationStatus; rule: string }[] = [
  { status: mk([]), rule: 'No flags — every quiz converts cleanly. Shown as a muted em dash.' },
  { status: mk(['submissions']), rule: 'A quiz already has student submissions. Migrating would put graded data at risk, so the original is kept.' },
  { status: mk(['itemBanks']), rule: 'A quiz pulls from an item bank. The link does not carry over automatically.' },
  { status: mk(['unsupportedTypes']), rule: 'A quiz uses a question type New Quizzes does not support yet (e.g. Formula, Hot Spot).' },
  { status: mk(['submissions', 'itemBanks']), rule: 'More than one flag present — all are listed, comma-separated.' },
  { status: mk(['submissions', 'itemBanks', 'unsupportedTypes']), rule: 'All three flag types present on one course.' },
]

export function contentFlagsMatrix({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="medium"
    >
      <Flex direction="column" gap="0">
        {ROWS.map((r, i) => (
          <View
            key={i}
            as="div"
            display="block"
            borderWidth={i === ROWS.length - 1 ? '0' : '0 0 small 0'}
            borderColor="secondary"
            padding="small 0"
          >
            <Flex gap="large" alignItems="start" wrap="wrap">
              <Flex.Item size="14rem" shouldShrink={false}>
                <ContentFlags status={r.status} />
              </Flex.Item>
              <Flex.Item shouldGrow shouldShrink>
                <Text color="secondary" size="small">{r.rule}</Text>
              </Flex.Item>
            </Flex>
          </View>
        ))}
      </Flex>
    </View>
  )
}
`,W=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Table } from '@instructure/ui-table/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { ContentFlags } from '../../bulk-migration/MigrationStatus'
import { COURSES, migrationStatus, teacherName } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// The courses table (Active tab shown). Courses split across three tabs — Blueprint and
// Template, Active, and All other — each with its own select-all. Sortable columns, a
// per-row Content flags cell, and a per-row action: "Preview migration" when Classic
// quizzes remain, "Done" (disabled) when none do. Rows with no Classic quizzes can't be
// selected. Tabs and the bulk Preview migration control sit above this table.
export function coursesTable({ sharedTokens }: FrameCtx): React.ReactNode {
  const rows = COURSES.filter((c) => c.courseType === 'active').slice(0, 6)
  const tabLabels = ['Blueprint and Template Courses', 'Active Courses', 'All other Courses']

  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="medium"
    >
      <Flex direction="column" gap="small" alignItems="stretch">
        {/* Tabs (Active selected) */}
        <Flex gap="medium" alignItems="center">
          {tabLabels.map((t, i) => (
            <View
              key={t}
              as="div"
              display="block"
              padding="x-small 0"
              borderWidth={i === 1 ? '0 0 medium 0' : '0'}
              borderColor="brand"
            >
              <Text weight={i === 1 ? 'bold' : 'normal'} color={i === 1 ? 'primary' : 'secondary'}>{t}</Text>
            </View>
          ))}
        </Flex>

        <Table caption="Courses and migration status" layout="auto">
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="s-sel" width="3rem">
                <Checkbox label={<ScreenReaderContent>Select all</ScreenReaderContent>} onChange={() => {}} />
              </Table.ColHeader>
              <Table.ColHeader id="s-course">Course</Table.ColHeader>
              <Table.ColHeader id="s-ed">Educator</Table.ColHeader>
              <Table.ColHeader id="s-flags">Content flags</Table.ColHeader>
              <Table.ColHeader id="s-classic" textAlign="end">Classic Quizzes</Table.ColHeader>
              <Table.ColHeader id="s-new" textAlign="end">New Quizzes</Table.ColHeader>
              <Table.ColHeader id="s-action" textAlign="end" width="11rem">Action</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((c) => {
              const hasClassic = c.classicQuizzes > 0
              return (
                <Table.Row key={c.id}>
                  <Table.Cell>
                    <Checkbox
                      label={<ScreenReaderContent>Select {c.name}</ScreenReaderContent>}
                      disabled={!hasClassic}
                      onChange={() => {}}
                    />
                  </Table.Cell>
                  <Table.RowHeader>
                    <Text weight="bold">{c.name}</Text>
                    <Text as="div" size="contentSmall" color="secondary">{c.term}</Text>
                  </Table.RowHeader>
                  <Table.Cell>{teacherName(c.teacherId)}</Table.Cell>
                  <Table.Cell><ContentFlags status={migrationStatus(c)} /></Table.Cell>
                  <Table.Cell textAlign="end">{c.classicQuizzes}</Table.Cell>
                  <Table.Cell textAlign="end">{c.migratedQuizzes}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Button size="small" interaction={hasClassic ? 'enabled' : 'disabled'}>
                      <span style={{ whiteSpace: 'nowrap' }}>{hasClassic ? 'Preview migration' : 'Done'}</span>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Flex>
    </View>
  )
}
`,G=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { DonutChart } from '../../bulk-migration/DonutChart'
import { quizSources, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// "How Quizzes were created" panel — the real donut. Provenance (created from scratch,
// course copy, blueprint sync, bulk migration, other imports) is a district-level
// aggregate scaled to the live quiz population, so the center total matches the data
// behind the banner and the New : Classic ratio.
export function creationDonut({ sharedTokens }: FrameCtx): React.ReactNode {
  const sources = quizSources(COURSES)
  const total = sources.reduce((s, x) => s + x.count, 0)
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <View
        as="div"
        display="block"
        padding="medium"
        background="primary"
        themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
        borderRadius={sharedTokens.borderRadius.card.lg}
        shadow="resting"
      >
        <Flex direction="column" gap="small">
          <Flex direction="column" gap="xxx-small">
            <Heading level="h3" variant="titleCardRegular" margin="0">How Quizzes were created</Heading>
            <Text size="contentSmall" color="secondary">Origin of all {total} quizzes across active courses.</Text>
          </Flex>
          <View as="div" display="block" margin="small 0 0 0">
            <DonutChart segments={sources} centerLabel={String(total)} centerSub="quizzes" />
          </View>
        </Flex>
      </View>
    </View>
  )
}
`,K=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { MigrationBanner } from '../../bulk-migration/MigrationBanner'
import { bannerStats, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// The dashboard banner — the real component, fed live district stats. Three headline
// numbers; the last two are links (to the content-flags list and the migrated archive).
// A progress bar shows the share of the quiz population already on New Quizzes, with the
// district due date below.
export function dashboardBanner({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <MigrationBanner stats={bannerStats(COURSES)} onViewAttention={() => {}} onViewMigrated={() => {}} />
    </View>
  )
}
`,ce=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { Tag } from '@instructure/ui-tag/latest'
import { Link } from '@instructure/ui-link/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { SearchInstUIIcon, FilterInstUIIcon } from '@instructure/ui-icons'
import type { FrameCtx } from '../../../components/SpecSheet'

// Search + filters. A live search box sits next to a Filter button that opens a tray with
// four single-select dropdowns — Sub-account, Term, Educator, and Content flag, each
// defaulting to "All". Selections apply immediately (no Apply button) and surface as
// dismissible tags under the search bar, with "Clear all" to reset. The tray is shown here
// as a panel; in the prototype it slides in from the right.
export function filters({ sharedTokens }: FrameCtx): React.ReactNode {
  const panel = {
    as: 'div' as const,
    display: 'block' as const,
    background: 'primary' as const,
    themeOverride: { backgroundPrimary: sharedTokens.background.containerColor },
    borderRadius: sharedTokens.borderRadius.card.lg,
    shadow: 'resting' as const,
    padding: 'medium' as const,
  }

  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="stretch">
        {/* Search row + active tags */}
        <Flex gap="small" alignItems="end">
          <Flex.Item shouldGrow shouldShrink>
            <TextInput renderLabel="Search" placeholder="Type to search" renderBeforeInput={<SearchInstUIIcon inline={false} />} />
          </Flex.Item>
          <Flex.Item>
            <Button renderIcon={<FilterInstUIIcon />}>Filter (2)</Button>
          </Flex.Item>
        </Flex>
        <Flex gap="x-small" alignItems="center" wrap="wrap">
          <Tag text="Lincoln High School" dismissible onClick={() => {}} />
          <Tag text="Submissions" dismissible onClick={() => {}} />
          <Link>Clear all</Link>
        </Flex>

        {/* Filter tray contents */}
        <View {...panel} maxWidth="22rem">
          <Flex direction="column" gap="medium">
            <Heading level="h3" variant="titleCardRegular" margin="0">Filters</Heading>
            <SimpleSelect renderLabel="Sub-account" value="Lincoln High School">
              <SimpleSelect.Option id="f-sub-1" value="Lincoln High School">Lincoln High School</SimpleSelect.Option>
            </SimpleSelect>
            <SimpleSelect renderLabel="Term" value="">
              <SimpleSelect.Option id="f-term-1" value="">All</SimpleSelect.Option>
            </SimpleSelect>
            <SimpleSelect renderLabel="Educator" value="">
              <SimpleSelect.Option id="f-ed-1" value="">All</SimpleSelect.Option>
            </SimpleSelect>
            <SimpleSelect renderLabel="Content flag" value="Submissions">
              <SimpleSelect.Option id="f-flag-1" value="Submissions">Submissions</SimpleSelect.Option>
            </SimpleSelect>
          </Flex>
        </View>
      </Flex>
    </View>
  )
}
`,le=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { RocketSolidInstUIIcon } from '@instructure/ui-icons'
import type { FrameCtx } from '../../../components/SpecSheet'

// Entry point. The migration tool lives as one active card on the district Analytics Hub.
// Only this card is wired up; the rest of the hub grid mirrors Figma. Clicking it opens
// the Quiz Migration dashboard.
export function hubEntryCard({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <View
        as="div"
        display="block"
        width="100%"
        textAlign="start"
        padding="medium"
        background="primary"
        themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
        borderRadius={sharedTokens.borderRadius.card.lg}
        shadow="resting"
        borderWidth="medium"
        borderColor="brand"
      >
        <Flex gap="small" alignItems="start">
          <View as="div" margin="xxx-small 0 0 0">
            <Text color="brand"><RocketSolidInstUIIcon /></Text>
          </View>
          <Flex.Item shouldGrow shouldShrink>
            <Flex gap="x-small" alignItems="center" wrap="wrap">
              <Heading level="h3" variant="titleCardRegular" margin="0">Quiz Migration Progress</Heading>
              <Pill color="info">Active</Pill>
            </Flex>
            <View as="div" display="block" margin="xx-small 0 0 0">
              <Text as="div" size="content" color="secondary">
                Track and migrate Classic Quizzes to New Quizzes.
              </Text>
            </View>
          </Flex.Item>
        </Flex>
      </View>
    </View>
  )
}
`,ue=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import type { FrameCtx } from '../../../components/SpecSheet'

// The migrate sheet (fullscreen modal body). Quizzes from the selected course(s) are
// grouped by how cleanly they migrate. All three groups always show, even when empty.
// Migration preferences live inside "Fully supported" because they only affect those
// quizzes — the others always keep their original and get a clean New Quizzes copy.
const GROUPS: { title: string; count: number; note?: string; quizzes: string[] }[] = [
  {
    title: 'Fully supported',
    count: 6,
    quizzes: ['Color Theory · Studio Art', 'Composition Basics · Studio Art', 'Art History · Studio Art'],
  },
  {
    title: 'With submissions',
    count: 4,
    note: "For these quizzes we'll keep a copy of the original quiz. Existing submission data will be available through this original quiz.",
    quizzes: ['Figure Drawing · Studio Art', 'Studio Critique · Studio Art'],
  },
  {
    title: 'Review needed',
    count: 2,
    note: 'These quizzes contain rich content. You can review the migrated quizzes to ensure all content has been converted successfully.',
    quizzes: ['Perspective Drawing · Studio Art', 'Light & Shadow · Studio Art'],
  },
]

export function migrateSheet({ sharedTokens }: FrameCtx): React.ReactNode {
  const sectionBg = {
    as: 'div' as const,
    display: 'block' as const,
    background: 'secondary' as const,
    themeOverride: { backgroundSecondary: sharedTokens.background.pageColor },
    borderRadius: sharedTokens.borderRadius.card.md,
    padding: 'small' as const,
  }

  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="stretch">
        <Heading level="h2" variant="titleCardLarge" margin="0">Migrate to New Quizzes</Heading>

        {GROUPS.map((g, gi) => (
          <React.Fragment key={g.title}>
            {gi > 0 ? <View as="div" display="block" borderWidth="small 0 0 0" borderColor="secondary" /> : null}
            <View as="div" display="block">
              <Text weight="bold">{g.title} ({g.count})</Text>
              <View as="div" display="block" padding="x-small 0 0 0">
                {/* Preferences live in the first group */}
                {gi === 0 ? (
                  <View {...sectionBg} margin="0 0 small 0">
                    <Checkbox variant="toggle" size="small" label="Keep a copy of the original Classic Quiz" onChange={() => {}} />
                  </View>
                ) : null}
                {g.note ? (
                  <View as="div" display="block" margin="0 0 small 0">
                    <Text size="contentSmall" color="secondary">{g.note}</Text>
                  </View>
                ) : null}
                <Flex direction="column" gap="x-small">
                  {g.quizzes.map((q) => (
                    <Flex key={q} gap="small" alignItems="center">
                      <Flex.Item size="1.5rem" shouldShrink={false}>
                        <Checkbox label={<ScreenReaderContent>Select {q}</ScreenReaderContent>} checked onChange={() => {}} />
                      </Flex.Item>
                      <Flex.Item shouldGrow shouldShrink>
                        <Text weight="bold" as="div">{q.split(' · ')[0]}</Text>
                        <Text size="contentSmall" color="secondary" as="div" lineHeight="condensed">{q.split(' · ')[1]} · 14 Questions</Text>
                      </Flex.Item>
                    </Flex>
                  ))}
                </Flex>
              </View>
            </View>
          </React.Fragment>
        ))}

        <Flex gap="small" justifyItems="end">
          <Button>Cancel</Button>
          <Button color="primary">Migrate selected</Button>
        </Flex>
      </Flex>
    </View>
  )
}
`,de=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { ComparisonTable } from '../../bulk-migration/ComparisonTable'
import { allMigratedQuizzes, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// Migrated quizzes archive (fullscreen modal), reached from the "Quizzes migrated" banner
// stat. The same comparison table as the completion screen, plus a Migrated date column
// unique to this view, so admins can revisit and replace originals at any time — not only
// right after a migration run.
export function migratedArchive({ sharedTokens }: FrameCtx): React.ReactNode {
  const quizzes = allMigratedQuizzes(COURSES).slice(0, 8)
  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="large"
    >
      <Flex direction="column" gap="small" alignItems="stretch">
        <Heading level="h2" variant="titleCardLarge" margin="0">Migrated quizzes</Heading>
        <Text color="secondary">
          Every quiz already migrated to New Quizzes. Open each version to compare the Classic and New Quizzes
          in the builder, then replace the original Classic quiz once you're confident.
        </Text>
        <ComparisonTable quizzes={quizzes} showDate />
      </Flex>
    </View>
  )
}
`,fe=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { TextArea } from '@instructure/ui-text-area/latest'
import type { FrameCtx } from '../../../components/SpecSheet'

// Two confirmations from the comparison table, shown stacked. Top: replacing an original
// Classic quiz with its New Quizzes version is irreversible, so it's always confirmed
// (single or bulk). Bottom: "Report migration issue" lets an admin describe what looked
// wrong after migrating; the report goes to the migration team.
export function postMigrationModals({ sharedTokens }: FrameCtx): React.ReactNode {
  const cardProps = {
    as: 'div' as const,
    display: 'block' as const,
    background: 'primary' as const,
    themeOverride: { backgroundPrimary: sharedTokens.background.containerColor },
    borderRadius: sharedTokens.borderRadius.card.lg,
    shadow: 'resting' as const,
    padding: 'medium' as const,
  }

  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <Flex direction="column" gap="large" alignItems="stretch">
        {/* Replace original confirm */}
        <View {...cardProps}>
          <Flex direction="column" gap="small">
            <Heading level="h2" variant="titleCardLarge" margin="0">Replace 3 original quizzes?</Heading>
            <Text>These 3 Classic quizzes will be replaced by the New Quizzes versions. This can't be undone.</Text>
            <Flex gap="small" justifyItems="end">
              <Button>Cancel</Button>
              <Button color="danger">Replace</Button>
            </Flex>
          </Flex>
        </View>

        {/* Report migration issue */}
        <View {...cardProps}>
          <Flex direction="column" gap="small">
            <Heading level="h2" variant="titleCardLarge" margin="0">Report a migration issue</Heading>
            <TextArea
              label="Describe what went wrong"
              placeholder="Tell us what looked off after migrating — wrong points, missing questions, broken formatting…"
              height="8rem"
            />
            <Flex gap="small" justifyItems="end">
              <Button>Cancel</Button>
              <Button color="primary">Send report</Button>
            </Flex>
          </Flex>
        </View>
      </Flex>
    </View>
  )
}
`,pe=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { MigrationRollout } from '../../bulk-migration/MigrationRollout'
import type { FrameCtx } from '../../../components/SpecSheet'

// "Migration rollout" panel — the real component. Shows where the institution stands on
// the New Quizzes feature options (On / Off), NOT a fixed sequence of steps. Options that
// are off link out to Canvas feature options. Note: the internal R0–R5 rollout ladder is
// never surfaced here — admins only see content readiness and feature on/off state.
export function rolloutTimeline({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <View
        as="div"
        display="block"
        padding="medium"
        background="primary"
        themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
        borderRadius={sharedTokens.borderRadius.card.lg}
        shadow="resting"
      >
        <Flex direction="column" gap="small">
          <Flex direction="column" gap="xxx-small">
            <Heading level="h3" variant="titleCardRegular" margin="0">Migration rollout</Heading>
            <Text size="contentSmall" color="secondary">
              Where your institution stands on the New Quizzes rollout. Turn options on in your feature options
              when you’re ready.
            </Text>
          </Flex>
          <View as="div" display="block" margin="small 0 0 0">
            <MigrationRollout />
          </View>
        </Flex>
      </View>
    </View>
  )
}
`,me=`import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { ProgressBar } from '@instructure/ui-progress/latest'
import { Spinner } from '@instructure/ui-spinner/latest'
import type { FrameCtx } from '../../../components/SpecSheet'

// Scan step. Before the migrate sheet opens, the tool scans the selected courses' quizzes
// to sort them into clean, with-submissions, and review groups. A short progress pass —
// the prototype runs it on a timer, then opens the migrate sheet.
export function scan({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="center" padding="large 0">
        <Spinner renderTitle="Scanning quizzes" size="medium" />
        <Heading level="h2" variant="titleSection" margin="0">Scanning quizzes…</Heading>
        <Text color="secondary">Checking 38 quizzes for content that needs a closer look.</Text>
        <View as="div" display="block" width="80%">
          <ProgressBar
            size="small"
            screenReaderLabel="Scan progress"
            valueNow={64}
            valueMax={100}
            renderValue={() => <Text size="legend">64%</Text>}
          />
        </View>
      </Flex>
    </View>
  )
}
`;function he(e){let t=[],n=new Set;function r(e){let r=e.text.trim();if(!r)return;let i=`${e.kind}|${e.label}|${r}`;n.has(i)||(n.add(i),t.push({...e,text:r}))}function i(e){let t=window.getComputedStyle(e);return t.display===`none`||t.visibility===`hidden`}function a(e){let t=window.getComputedStyle(e);if(t.position!==`absolute`)return!1;let n=parseFloat(t.width),r=parseFloat(t.height);if(n<=1&&r<=1)return!0;let i=t.clip;return!!(i&&i.includes(`rect(0`))}function o(e){let t=e.getAttribute(`data-copy-label`);if(t)return t;let n=e.tagName.toLowerCase();if(/^h[1-6]$/.test(n))return`Heading (${n})`;if(n===`button`)return`Button`;if(n===`a`)return`Link`;if(n===`img`)return`Image`;if(n===`input`)return`Input`;if(n===`textarea`)return`Textarea`;if(n===`label`)return`Label`;if(n===`p`)return`Paragraph`;if(n===`li`)return`List item`;let r=e.getAttribute(`role`);if(r===`button`)return`Button`;if(r===`link`)return`Link`;if(r===`heading`)return`Heading`;let i=e.parentElement?.closest(`button, a, h1, h2, h3, h4, h5, h6, label, [role="button"], [role="link"], [role="heading"]`);return i?o(i):`Text`}function s(e,t){let n=e.getAttribute(t);if(!n)return``;let r=e.ownerDocument;return n.split(/\s+/).map(e=>r.getElementById(e)?.textContent?.trim()??``).filter(Boolean).join(` `)}function c(e){if(e.getAttribute(`aria-hidden`)===`true`||e.hasAttribute(`data-copy-skip`)||i(e))return;let t=a(e),n=o(e),l=e.getAttribute(`aria-label`);l&&r({kind:`screen-reader`,label:`${n}: aria-label`,text:l});let u=s(e,`aria-labelledby`);u&&u!==l&&r({kind:`screen-reader`,label:`${n}: aria-labelledby`,text:u});let d=s(e,`aria-describedby`);d&&r({kind:`screen-reader`,label:`${n}: aria-describedby`,text:d});let f=e.getAttribute(`title`);f&&r({kind:`visible`,label:`${n}: title`,text:f});let p=e.tagName.toLowerCase();if(p===`img`){let t=e.getAttribute(`alt`);t&&r({kind:`screen-reader`,label:`Image alt`,text:t})}if(p===`input`||p===`textarea`){let t=e.getAttribute(`placeholder`);t&&r({kind:`form`,label:`${n} placeholder`,text:t});let i=e.value;i&&r({kind:`form`,label:`${n} value`,text:i})}let m=[];for(let t of Array.from(e.childNodes))if(t.nodeType===Node.TEXT_NODE){let e=t.textContent?.trim();e&&m.push(e)}if(m.length>0){let e=m.join(` `);r({kind:t?`screen-reader`:`visible`,label:t?`${n}: screen reader text`:n,text:e})}for(let t of Array.from(e.children))c(t)}return c(e),t}var q=v(f(),1),J=window.parent!==window;function ge(e,t){return[`Screen	Kind	Label	Text`,...t.map(t=>`${e}\t${t.kind}\t${t.label}\t${t.text}`)].join(`
`)}function _e({specTitle:e,sectionTitle:t,sectionIndex:n,boardIndex:r,board:i,section:a,basePath:o,frameSources:s}){let c=`./frames/${i.frame}.tsx`,l=s[c]??`// Frame source not found: ${c}\n// Check that the file exists and that the spec's index.tsx passes\n// frameSources={import.meta.glob('./frames/*.tsx', { query: '?raw', import: 'default', eager: true })}\n`,u=`${o}/frames/${i.frame}.tsx`,d=[];d.push(`// Repo:    (no remote configured — run /sandbox-publish to enable permalinks)`);let f=a.boards.map((e,t)=>({b:e,i:t})).filter(({b:e,i:t})=>e.frame&&t!==r).map(({b:e,i:t})=>`//   ${n+1}.${t}  frames/${e.frame}.tsx${e.caption?` — ${e.caption}`:``}`),p=f.length>0?[`//`,`// Sibling boards in this section (read for full flow context):`,...f]:[];return[`// ─────────────────────────────────────────────────────────────────────`,`// InstUI Spec Sheet — Design Handoff`,`// ─────────────────────────────────────────────────────────────────────`,`// Spec:    ${e}`,`// Section: ${t}`,`// Board:   ${n+1}.${r}${i.caption?` — ${i.caption}`:``}`,`// Source:  ${u}`,...d,`//`,`// Read the source file before integrating — imports, helpers, and any`,`// cross-file references the snippet below relies on live in the file.`,...p,`// ─────────────────────────────────────────────────────────────────────`,``,``].join(`
`)+l}function Y(){let{sharedTokens:e}=x();return(0,q.jsx)(g,{as:`div`,display:`block`,borderWidth:`small 0 0 0`,borderColor:`primary`,themeOverride:{borderColorPrimary:e.stroke.mutedColor},margin:`large 0`})}function ve({title:t,description:r,sections:i,basePath:o,frameSources:s}){let{sharedTokens:c}=x(),[l,u]=(0,z.useState)(null),[f,p]=(0,z.useState)(null);return(0,z.useEffect)(()=>{J&&window.dispatchEvent(new CustomEvent(`spec-rendered`))},[]),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(g,{as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:c.background.containerColor},borderRadius:c.borderRadius.card.lg,shadow:`resting`,padding:`xx-large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`large`,children:[(0,q.jsxs)(a,{direction:`column`,gap:`x-small`,style:{maxWidth:`640px`},children:[(0,q.jsx)(d,{level:`h1`,variant:`titlePageDesktop`,margin:`0`,children:t}),r&&(0,q.jsx)(w,{size:`descriptionPage`,children:r})]}),(0,q.jsx)(Y,{}),i.map((r,l)=>(0,q.jsxs)(z.Fragment,{children:[(0,q.jsxs)(a,{direction:`column`,gap:`xx-large`,children:[(0,q.jsxs)(a,{direction:`column`,gap:`x-small`,style:{maxWidth:`640px`},children:[(0,q.jsx)(d,{level:`h2`,margin:`0`,children:r.title}),r.description&&(0,q.jsx)(w,{size:`content`,color:`secondary`,children:r.description})]}),(0,q.jsx)(a,{gap:`xx-large`,alignItems:`start`,children:r.boards.map((i,f)=>{let m=`${l}-${f}`;return(0,q.jsx)(a.Item,{shouldShrink:!1,overflowX:`visible`,overflowY:`visible`,children:(0,q.jsx)(`div`,{"data-board-id":m,children:(0,q.jsxs)(a,{direction:`column`,gap:`medium`,width:`${i.width}px`,children:[(0,q.jsxs)(d,{level:`h3`,margin:`0`,children:[l+1,`.`,f,i.caption?` ${i.caption}`:``]}),(0,q.jsx)(g,{as:`div`,display:`block`,width:`${i.width}px`,borderWidth:`small`,borderColor:`primary`,themeOverride:{borderColorPrimary:c.stroke.mutedColor},borderRadius:`0`,shadow:`resting`,overflowX:`hidden`,...i.height===void 0?{}:{height:`${i.height}px`,overflowY:`hidden`},children:(0,q.jsx)(`div`,{"data-copy-root":m,style:{width:`100%`,...i.height===void 0?{}:{height:`100%`}},children:i.content??(0,q.jsx)(g,{as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:c.background.inverseColor},...i.height===void 0?{minHeight:`200px`}:{height:`100%`}})})}),(0,q.jsxs)(a,{gap:`x-small`,children:[(0,q.jsx)(n,{size:`small`,withBackground:!1,renderIcon:(0,q.jsx)(ie,{}),onClick:()=>{let e=J?window.parent.location.href:window.location.href,t=new URL(e);t.searchParams.set(`board`,m),navigator.clipboard.writeText(t.toString())},children:`Link`}),i.content&&(0,q.jsx)(n,{size:`small`,withBackground:!1,renderIcon:(0,q.jsx)(A,{}),onClick:()=>{let e=`${l+1}.${f}${i.caption?` ${i.caption}`:``}`,t=document.querySelector(`[data-copy-root="${m}"]`),n=t?he(t):[];J?window.parent.postMessage({type:`embed:open-copy-modal`,caption:i.caption,screenLabel:e,copy:n},window.location.origin):p({caption:i.caption,screenLabel:e,copy:n})},children:`UX Copy`}),i.frame&&o&&s&&(0,q.jsx)(n,{size:`small`,withBackground:!1,renderIcon:(0,q.jsx)(e,{}),onClick:()=>{let e=_e({specTitle:t,sectionTitle:r.title,sectionIndex:l,boardIndex:f,board:i,section:r,basePath:o,frameSources:s});J?window.parent.postMessage({type:`embed:open-code-modal`,caption:i.caption,code:e},window.location.origin):u({caption:i.caption,code:e})},children:`Source`})]}),i.notes&&(typeof i.notes==`string`?(0,q.jsx)(w,{size:`content`,color:`secondary`,children:i.notes}):i.notes)]})})},f)})})]}),l<i.length-1&&(0,q.jsx)(Y,{})]},l))]})}),(0,q.jsxs)(m,{open:l!==null,onDismiss:()=>u(null),label:l?.caption?`Code: ${l.caption}`:`Code`,size:`large`,children:[(0,q.jsx)(m.Header,{children:(0,q.jsxs)(a,{alignItems:`center`,justifyItems:`space-between`,children:[(0,q.jsx)(d,{level:`h2`,margin:`0`,children:l?.caption??`Code`}),(0,q.jsx)(R,{screenReaderLabel:`Close`,onClick:()=>u(null)})]})}),(0,q.jsx)(m.Body,{children:(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:c.background.pageColor},borderRadius:`0`,padding:`medium`,children:(0,q.jsx)(`pre`,{style:{margin:0,fontFamily:`monospace`,fontSize:13,whiteSpace:`pre-wrap`,wordBreak:`break-word`},children:l?.code})})}),(0,q.jsx)(m.Footer,{children:(0,q.jsxs)(a,{justifyItems:`end`,gap:`small`,children:[(0,q.jsx)(n,{onClick:()=>navigator.clipboard.writeText(l?.code??``),children:`Copy`}),(0,q.jsx)(n,{color:`primary`,onClick:()=>u(null),children:`Done`})]})})]}),(0,q.jsxs)(m,{open:f!==null,onDismiss:()=>p(null),label:f?.caption?`Copy doc: ${f.caption}`:`Copy doc`,size:`medium`,children:[(0,q.jsx)(m.Header,{children:(0,q.jsxs)(a,{alignItems:`center`,justifyItems:`space-between`,children:[(0,q.jsx)(d,{level:`h2`,margin:`0`,children:f?.caption??`Copy doc`}),(0,q.jsx)(R,{screenReaderLabel:`Close`,onClick:()=>p(null)})]})}),(0,q.jsx)(m.Body,{children:(0,q.jsx)(a,{direction:`column`,gap:`none`,children:f?.copy.map((e,t)=>(0,q.jsxs)(z.Fragment,{children:[t>0&&(0,q.jsx)(g,{as:`div`,display:`block`,borderWidth:`small 0 0 0`,borderColor:`primary`,themeOverride:{borderColorPrimary:c.stroke.mutedColor}}),(0,q.jsxs)(a,{gap:`medium`,alignItems:`start`,padding:`small none`,children:[(0,q.jsx)(g,{as:`div`,display:`block`,minWidth:`100px`,children:(0,q.jsx)(w,{size:`x-small`,color:`secondary`,weight:`bold`,children:e.kind})}),(0,q.jsx)(g,{as:`div`,display:`block`,minWidth:`180px`,children:(0,q.jsx)(w,{size:`small`,color:`secondary`,children:e.label})}),(0,q.jsx)(w,{size:`small`,children:e.text})]})]},t))})}),(0,q.jsx)(m.Footer,{children:(0,q.jsxs)(a,{justifyItems:`end`,gap:`small`,children:[(0,q.jsx)(n,{onClick:()=>navigator.clipboard.writeText(ge(f?.screenLabel??``,f?.copy??[])),children:`Copy for Sheets`}),(0,q.jsx)(n,{color:`primary`,onClick:()=>p(null),children:`Done`})]})})]})]})}function ye({sharedTokens:e}){return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`large`,children:(0,q.jsx)(g,{as:`div`,display:`block`,width:`100%`,textAlign:`start`,padding:`medium`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},borderRadius:e.borderRadius.card.lg,shadow:`resting`,borderWidth:`medium`,borderColor:`brand`,children:(0,q.jsxs)(a,{gap:`small`,alignItems:`start`,children:[(0,q.jsx)(g,{as:`div`,margin:`xxx-small 0 0 0`,children:(0,q.jsx)(w,{color:`brand`,children:(0,q.jsx)(s,{})})}),(0,q.jsxs)(a.Item,{shouldGrow:!0,shouldShrink:!0,children:[(0,q.jsxs)(a,{gap:`x-small`,alignItems:`center`,wrap:`wrap`,children:[(0,q.jsx)(d,{level:`h3`,variant:`titleCardRegular`,margin:`0`,children:`Quiz Migration Progress`}),(0,q.jsx)(u,{color:`info`,children:`Active`})]}),(0,q.jsx)(g,{as:`div`,display:`block`,margin:`xx-small 0 0 0`,children:(0,q.jsx)(w,{as:`div`,size:`content`,color:`secondary`,children:`Track and migrate Classic Quizzes to New Quizzes.`})})]})]})})})}function be({sharedTokens:e}){return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`large`,children:(0,q.jsx)(_,{stats:b(O),onViewAttention:()=>{},onViewMigrated:()=>{}})})}function xe({sharedTokens:e}){let t=ee(O),n=t.reduce((e,t)=>e+t.count,0);return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`large`,children:(0,q.jsx)(g,{as:`div`,display:`block`,padding:`medium`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},borderRadius:e.borderRadius.card.lg,shadow:`resting`,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,children:[(0,q.jsxs)(a,{direction:`column`,gap:`xxx-small`,children:[(0,q.jsx)(d,{level:`h3`,variant:`titleCardRegular`,margin:`0`,children:`How Quizzes were created`}),(0,q.jsxs)(w,{size:`contentSmall`,color:`secondary`,children:[`Origin of all `,n,` quizzes across active courses.`]})]}),(0,q.jsx)(g,{as:`div`,display:`block`,margin:`small 0 0 0`,children:(0,q.jsx)(te,{segments:t,centerLabel:String(n),centerSub:`quizzes`})})]})})})}function Se({sharedTokens:e}){return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`large`,children:(0,q.jsx)(g,{as:`div`,display:`block`,padding:`medium`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},borderRadius:e.borderRadius.card.lg,shadow:`resting`,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,children:[(0,q.jsxs)(a,{direction:`column`,gap:`xxx-small`,children:[(0,q.jsx)(d,{level:`h3`,variant:`titleCardRegular`,margin:`0`,children:`Migration rollout`}),(0,q.jsx)(w,{size:`contentSmall`,color:`secondary`,children:`Where your institution stands on the New Quizzes rollout. Turn options on in your feature options when you’re ready.`})]}),(0,q.jsx)(g,{as:`div`,display:`block`,margin:`small 0 0 0`,children:(0,q.jsx)(ae,{})})]})})})}function Ce({sharedTokens:e}){let r=O.filter(e=>e.courseType===`active`).slice(0,6);return(0,q.jsx)(g,{as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},padding:`medium`,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,alignItems:`stretch`,children:[(0,q.jsx)(a,{gap:`medium`,alignItems:`center`,children:[`Blueprint and Template Courses`,`Active Courses`,`All other Courses`].map((e,t)=>(0,q.jsx)(g,{as:`div`,display:`block`,padding:`x-small 0`,borderWidth:t===1?`0 0 medium 0`:`0`,borderColor:`brand`,children:(0,q.jsx)(w,{weight:t===1?`bold`:`normal`,color:t===1?`primary`:`secondary`,children:e})},e))}),(0,q.jsxs)(I,{caption:`Courses and migration status`,layout:`auto`,children:[(0,q.jsx)(I.Head,{children:(0,q.jsxs)(I.Row,{children:[(0,q.jsx)(I.ColHeader,{id:`s-sel`,width:`3rem`,children:(0,q.jsx)(t,{label:(0,q.jsx)(P,{children:`Select all`}),onChange:()=>{}})}),(0,q.jsx)(I.ColHeader,{id:`s-course`,children:`Course`}),(0,q.jsx)(I.ColHeader,{id:`s-ed`,children:`Educator`}),(0,q.jsx)(I.ColHeader,{id:`s-flags`,children:`Content flags`}),(0,q.jsx)(I.ColHeader,{id:`s-classic`,textAlign:`end`,children:`Classic Quizzes`}),(0,q.jsx)(I.ColHeader,{id:`s-new`,textAlign:`end`,children:`New Quizzes`}),(0,q.jsx)(I.ColHeader,{id:`s-action`,textAlign:`end`,width:`11rem`,children:`Action`})]})}),(0,q.jsx)(I.Body,{children:r.map(e=>{let r=e.classicQuizzes>0;return(0,q.jsxs)(I.Row,{children:[(0,q.jsx)(I.Cell,{children:(0,q.jsx)(t,{label:(0,q.jsxs)(P,{children:[`Select `,e.name]}),disabled:!r,onChange:()=>{}})}),(0,q.jsxs)(I.RowHeader,{children:[(0,q.jsx)(w,{weight:`bold`,children:e.name}),(0,q.jsx)(w,{as:`div`,size:`contentSmall`,color:`secondary`,children:e.term})]}),(0,q.jsx)(I.Cell,{children:N(e.teacherId)}),(0,q.jsx)(I.Cell,{children:(0,q.jsx)(D,{status:E(e)})}),(0,q.jsx)(I.Cell,{textAlign:`end`,children:e.classicQuizzes}),(0,q.jsx)(I.Cell,{textAlign:`end`,children:e.migratedQuizzes}),(0,q.jsx)(I.Cell,{textAlign:`end`,children:(0,q.jsx)(n,{size:`small`,interaction:r?`enabled`:`disabled`,children:(0,q.jsx)(`span`,{style:{whiteSpace:`nowrap`},children:r?`Preview migration`:`Done`})})})]},e.id)})})]})]})})}var X=e=>({kind:e.length?`review`:`safe`,label:e.length?`Review needed`:`Safe to migrate`,color:e.length?`error`:`success`,issues:e,reasonLabel:e.map(e=>se[e]).join(`, `),reviewQuizzes:e.length}),Z=[{status:X([]),rule:`No flags — every quiz converts cleanly. Shown as a muted em dash.`},{status:X([`submissions`]),rule:`A quiz already has student submissions. Migrating would put graded data at risk, so the original is kept.`},{status:X([`itemBanks`]),rule:`A quiz pulls from an item bank. The link does not carry over automatically.`},{status:X([`unsupportedTypes`]),rule:`A quiz uses a question type New Quizzes does not support yet (e.g. Formula, Hot Spot).`},{status:X([`submissions`,`itemBanks`]),rule:`More than one flag present — all are listed, comma-separated.`},{status:X([`submissions`,`itemBanks`,`unsupportedTypes`]),rule:`All three flag types present on one course.`}];function we({sharedTokens:e}){return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`medium`,children:(0,q.jsx)(a,{direction:`column`,gap:`0`,children:Z.map((e,t)=>(0,q.jsx)(g,{as:`div`,display:`block`,borderWidth:t===Z.length-1?`0`:`0 0 small 0`,borderColor:`secondary`,padding:`small 0`,children:(0,q.jsxs)(a,{gap:`large`,alignItems:`start`,wrap:`wrap`,children:[(0,q.jsx)(a.Item,{size:`14rem`,shouldShrink:!1,children:(0,q.jsx)(D,{status:e.status})}),(0,q.jsx)(a.Item,{shouldGrow:!0,shouldShrink:!0,children:(0,q.jsx)(w,{color:`secondary`,size:`small`,children:e.rule})})]})},t))})})}function Te({sharedTokens:e}){let t={as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},borderRadius:e.borderRadius.card.lg,shadow:`resting`,padding:`medium`};return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`medium`,alignItems:`stretch`,children:[(0,q.jsxs)(a,{gap:`small`,alignItems:`end`,children:[(0,q.jsx)(a.Item,{shouldGrow:!0,shouldShrink:!0,children:(0,q.jsx)(c,{renderLabel:`Search`,placeholder:`Type to search`,renderBeforeInput:(0,q.jsx)(M,{inline:!1})})}),(0,q.jsx)(a.Item,{children:(0,q.jsx)(n,{renderIcon:(0,q.jsx)(re,{}),children:`Filter (2)`})})]}),(0,q.jsxs)(a,{gap:`x-small`,alignItems:`center`,wrap:`wrap`,children:[(0,q.jsx)(y,{text:`Lincoln High School`,dismissible:!0,onClick:()=>{}}),(0,q.jsx)(y,{text:`Submissions`,dismissible:!0,onClick:()=>{}}),(0,q.jsx)(l,{children:`Clear all`})]}),(0,q.jsx)(g,{...t,maxWidth:`22rem`,children:(0,q.jsxs)(a,{direction:`column`,gap:`medium`,children:[(0,q.jsx)(d,{level:`h3`,variant:`titleCardRegular`,margin:`0`,children:`Filters`}),(0,q.jsx)(C,{renderLabel:`Sub-account`,value:`Lincoln High School`,children:(0,q.jsx)(C.Option,{id:`f-sub-1`,value:`Lincoln High School`,children:`Lincoln High School`})}),(0,q.jsx)(C,{renderLabel:`Term`,value:``,children:(0,q.jsx)(C.Option,{id:`f-term-1`,value:``,children:`All`})}),(0,q.jsx)(C,{renderLabel:`Educator`,value:``,children:(0,q.jsx)(C.Option,{id:`f-ed-1`,value:``,children:`All`})}),(0,q.jsx)(C,{renderLabel:`Content flag`,value:`Submissions`,children:(0,q.jsx)(C.Option,{id:`f-flag-1`,value:`Submissions`,children:`Submissions`})})]})})]})})}function Ee({sharedTokens:e}){return(0,q.jsx)(g,{as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},padding:`large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`medium`,alignItems:`center`,padding:`large 0`,children:[(0,q.jsx)(p,{renderTitle:`Scanning quizzes`,size:`medium`}),(0,q.jsx)(d,{level:`h2`,variant:`titleSection`,margin:`0`,children:`Scanning quizzes…`}),(0,q.jsx)(w,{color:`secondary`,children:`Checking 38 quizzes for content that needs a closer look.`}),(0,q.jsx)(g,{as:`div`,display:`block`,width:`80%`,children:(0,q.jsx)(r,{size:`small`,screenReaderLabel:`Scan progress`,valueNow:64,valueMax:100,renderValue:()=>(0,q.jsx)(w,{size:`legend`,children:`64%`})})})]})})}var De=[{title:`Fully supported`,count:6,quizzes:[`Color Theory · Studio Art`,`Composition Basics · Studio Art`,`Art History · Studio Art`]},{title:`With submissions`,count:4,note:`For these quizzes we'll keep a copy of the original quiz. Existing submission data will be available through this original quiz.`,quizzes:[`Figure Drawing · Studio Art`,`Studio Critique · Studio Art`]},{title:`Review needed`,count:2,note:`These quizzes contain rich content. You can review the migrated quizzes to ensure all content has been converted successfully.`,quizzes:[`Perspective Drawing · Studio Art`,`Light & Shadow · Studio Art`]}];function Oe({sharedTokens:e}){let r={as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},borderRadius:e.borderRadius.card.md,padding:`small`};return(0,q.jsx)(g,{as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},padding:`large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`medium`,alignItems:`stretch`,children:[(0,q.jsx)(d,{level:`h2`,variant:`titleCardLarge`,margin:`0`,children:`Migrate to New Quizzes`}),De.map((e,n)=>(0,q.jsxs)(z.Fragment,{children:[n>0?(0,q.jsx)(g,{as:`div`,display:`block`,borderWidth:`small 0 0 0`,borderColor:`secondary`}):null,(0,q.jsxs)(g,{as:`div`,display:`block`,children:[(0,q.jsxs)(w,{weight:`bold`,children:[e.title,` (`,e.count,`)`]}),(0,q.jsxs)(g,{as:`div`,display:`block`,padding:`x-small 0 0 0`,children:[n===0?(0,q.jsx)(g,{...r,margin:`0 0 small 0`,children:(0,q.jsx)(t,{variant:`toggle`,size:`small`,label:`Keep a copy of the original Classic Quiz`,onChange:()=>{}})}):null,e.note?(0,q.jsx)(g,{as:`div`,display:`block`,margin:`0 0 small 0`,children:(0,q.jsx)(w,{size:`contentSmall`,color:`secondary`,children:e.note})}):null,(0,q.jsx)(a,{direction:`column`,gap:`x-small`,children:e.quizzes.map(e=>(0,q.jsxs)(a,{gap:`small`,alignItems:`center`,children:[(0,q.jsx)(a.Item,{size:`1.5rem`,shouldShrink:!1,children:(0,q.jsx)(t,{label:(0,q.jsxs)(P,{children:[`Select `,e]}),checked:!0,onChange:()=>{}})}),(0,q.jsxs)(a.Item,{shouldGrow:!0,shouldShrink:!0,children:[(0,q.jsx)(w,{weight:`bold`,as:`div`,children:e.split(` · `)[0]}),(0,q.jsxs)(w,{size:`contentSmall`,color:`secondary`,as:`div`,lineHeight:`condensed`,children:[e.split(` · `)[1],` · 14 Questions`]})]})]},e))})]})]})]},e.title)),(0,q.jsxs)(a,{gap:`small`,justifyItems:`end`,children:[(0,q.jsx)(n,{children:`Cancel`}),(0,q.jsx)(n,{color:`primary`,children:`Migrate selected`})]})]})})}function Q({sharedTokens:e}){let t=j(O).slice(0,7);return(0,q.jsx)(g,{as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},padding:`large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,alignItems:`stretch`,children:[(0,q.jsx)(d,{level:`h2`,variant:`titleCardLarge`,margin:`0`,children:`Quizzes with content flags`}),(0,q.jsxs)(I,{caption:`Quizzes with content flags`,layout:`auto`,children:[(0,q.jsx)(I.Head,{children:(0,q.jsxs)(I.Row,{children:[(0,q.jsx)(I.ColHeader,{id:`a-quiz`,children:`Quiz`}),(0,q.jsx)(I.ColHeader,{id:`a-course`,children:`Course`}),(0,q.jsx)(I.ColHeader,{id:`a-ed`,children:`Educator`}),(0,q.jsx)(I.ColHeader,{id:`a-flags`,children:`Content flags`})]})}),(0,q.jsx)(I.Body,{children:t.map(e=>(0,q.jsxs)(I.Row,{children:[(0,q.jsx)(I.RowHeader,{children:(0,q.jsx)(w,{weight:`bold`,children:e.name})}),(0,q.jsx)(I.Cell,{children:e.courseName}),(0,q.jsx)(I.Cell,{children:e.educator}),(0,q.jsx)(I.Cell,{children:(0,q.jsx)(D,{status:S(e)})})]},e.id))})]})]})})}function ke({sharedTokens:e}){let t=T(O).slice(0,5);return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`medium`,alignItems:`stretch`,children:[(0,q.jsx)(d,{level:`h1`,variant:`titlePageDesktop`,margin:`0`,children:`Migration complete`}),(0,q.jsx)(o,{variant:`success`,margin:`0`,hasShadow:!1,children:`Migrated 18 quizzes across 3 courses to New Quizzes.`}),(0,q.jsx)(g,{as:`div`,display:`block`,padding:`medium`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},borderRadius:e.borderRadius.card.lg,shadow:`resting`,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,children:[(0,q.jsx)(d,{level:`h3`,variant:`titleCardRegular`,margin:`0`,children:`Compare and confirm`}),(0,q.jsx)(w,{color:`secondary`,children:`You can use this list to compare the newly created quizzes to their Classic version.`}),(0,q.jsx)(k,{quizzes:t})]})})]})})}function Ae({sharedTokens:e}){let t=T(O).slice(0,8);return(0,q.jsx)(g,{as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},padding:`large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,alignItems:`stretch`,children:[(0,q.jsx)(d,{level:`h2`,variant:`titleCardLarge`,margin:`0`,children:`Migrated quizzes`}),(0,q.jsx)(w,{color:`secondary`,children:`Every quiz already migrated to New Quizzes. Open each version to compare the Classic and New Quizzes in the builder, then replace the original Classic quiz once you're confident.`}),(0,q.jsx)(k,{quizzes:t,showDate:!0})]})})}function je({sharedTokens:e}){let t={as:`div`,display:`block`,background:`primary`,themeOverride:{backgroundPrimary:e.background.containerColor},borderRadius:e.borderRadius.card.lg,shadow:`resting`,padding:`medium`};return(0,q.jsx)(g,{as:`div`,display:`block`,background:`secondary`,themeOverride:{backgroundSecondary:e.background.pageColor},padding:`large`,children:(0,q.jsxs)(a,{direction:`column`,gap:`large`,alignItems:`stretch`,children:[(0,q.jsx)(g,{...t,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,children:[(0,q.jsx)(d,{level:`h2`,variant:`titleCardLarge`,margin:`0`,children:`Replace 3 original quizzes?`}),(0,q.jsx)(w,{children:`These 3 Classic quizzes will be replaced by the New Quizzes versions. This can't be undone.`}),(0,q.jsxs)(a,{gap:`small`,justifyItems:`end`,children:[(0,q.jsx)(n,{children:`Cancel`}),(0,q.jsx)(n,{color:`danger`,children:`Replace`})]})]})}),(0,q.jsx)(g,{...t,children:(0,q.jsxs)(a,{direction:`column`,gap:`small`,children:[(0,q.jsx)(d,{level:`h2`,variant:`titleCardLarge`,margin:`0`,children:`Report a migration issue`}),(0,q.jsx)(L,{label:`Describe what went wrong`,placeholder:`Tell us what looked off after migrating — wrong points, missing questions, broken formatting…`,height:`8rem`}),(0,q.jsxs)(a,{gap:`small`,justifyItems:`end`,children:[(0,q.jsx)(n,{children:`Cancel`}),(0,q.jsx)(n,{color:`primary`,children:`Send report`})]})]})})]})})}var Me=Object.assign({"./frames/attention-list.tsx":V,"./frames/complete.tsx":H,"./frames/content-flags-matrix.tsx":U,"./frames/courses-table.tsx":W,"./frames/creation-donut.tsx":G,"./frames/dashboard-banner.tsx":K,"./frames/filters.tsx":ce,"./frames/hub-entry-card.tsx":le,"./frames/migrate-sheet.tsx":ue,"./frames/migrated-archive.tsx":de,"./frames/post-migration-modals.tsx":fe,"./frames/rollout-timeline.tsx":pe,"./frames/scan.tsx":me});function $(e,t){return(0,q.jsxs)(g,{as:`div`,display:`block`,children:[(0,q.jsx)(w,{size:`content`,color:`secondary`,children:e}),(0,q.jsx)(g,{as:`div`,display:`block`,margin:`x-small 0 0 0`,children:(0,q.jsx)(F,{as:`ol`,children:t.map((e,t)=>(0,q.jsx)(F.Item,{children:(0,q.jsx)(w,{size:`content`,color:`secondary`,children:e})},t))})})]})}function Ne(e){let{sharedTokens:t}=x(),n={sharedTokens:t};return(0,q.jsx)(ve,{title:`Bulk Migration — Visual Spec`,description:`The admin tool for moving a district's Classic Quizzes to New Quizzes in bulk. It lives on the Analytics Hub and walks an admin from a district-wide overview, through filtering and previewing what will migrate, to a before-and-after review of the results. Each board carries its behavior rules below it (full handoff: src/designs/bulk-migration/BEHAVIOR.md). Screens are shown inside the Canvas admin content area; global navigation is out of scope here.`,basePath:`src/designs/bulk-migration-spec`,frameSources:Me,sections:[{title:`Entry and dashboard`,description:`The tool opens from one active card on the district Analytics Hub. The dashboard leads with a banner: a short pitch, three headline stats, overall progress, and the migration due date.`,boards:[{width:460,caption:`Analytics Hub — migration card`,content:ye(n),frame:`hub-entry-card`,notes:$(`One active card among the hub grid; the brand border and "Active" pill mark it as the only wired-up entry.`,[`Only the migration card is wired up — the rest mirror the Figma so the dashboard sits in its real home.`,`Clicking it opens the Quiz Migration dashboard.`,`Breadcrumbs at the top of every view navigate back up the chain (Hub → Dashboard → Complete).`])},{width:1100,caption:`Dashboard banner`,content:be(n),frame:`dashboard-banner`,notes:$(`Three headline stats derived live from course state, with overall progress and the due date.`,[`Stats: quizzes requiring migration, quizzes with content flags, and quizzes migrated.`,`The second and third stats are links — to the content-flags list and the migrated archive. The first is plain text.`,`The progress bar shows the share of the total quiz population already on New Quizzes.`,`Quiz population is conserved: migrating converts a Classic quiz into a New one, so the ratio shifts but the total holds.`])}]},{title:`Insight panels`,description:`Two panels sit below the banner: where every quiz came from, and where the institution stands on the New Quizzes rollout.`,boards:[{width:520,caption:`How Quizzes were created`,content:xe(n),frame:`creation-donut`,notes:$(`A provenance donut: created from scratch, course copy, blueprint sync, bulk migration, and other imports.`,[`A district-level aggregate scaled to the live quiz population.`,`The center total matches the banner and ratio figures rather than drifting — everything derives from the same model.`])},{width:520,caption:`Migration rollout`,content:Se(n),frame:`rollout-timeline`,notes:$(`A status panel showing the New Quizzes feature options as On / Off — not a fixed sequence of steps.`,[`Options that are off link out to Canvas feature options.`,`The admin can't toggle features here — enabling a feature option isn't something this tool owns.`,`The internal R0–R5 rollout ladder is Instructure-internal phasing and must never appear in any admin or educator-facing surface.`])}]},{title:`Courses table and filters`,description:`The heart of the dashboard: every course split across three tabs, with search and filtering to narrow the list before migrating.`,boards:[{width:1100,caption:`Courses table — Active tab`,content:Ce(n),frame:`courses-table`,notes:$(`Courses split across three tabs — Blueprint and Template, Active, and All other — each backed by its own subset.`,[`Each tab has its own select-all, acting only on that tab's migratable courses (those with at least one Classic quiz).`,`Columns are sortable; the sort is shared state and applies across all tabs.`,`A course with no Classic quizzes can't be selected — its checkbox is disabled and its action reads "Done" instead of "Preview migration."`,`Selection is tracked by course id and persists across tabs, so an admin can build a cross-tab batch.`,`"Show selected only" filters the visible tab to the current selection.`,`The bulk "Preview migration" button is disabled until at least one course is selected.`])},{width:720,caption:`Search and filter tray`,content:Te(n),frame:`filters`,notes:$(`Live search plus a tray of four single-select dropdowns; selections apply immediately and surface as dismissible tags.`,[`Search matches course name and educator, live as the admin types.`,`Dropdowns — Sub-account, Term, Educator, and Content flag — each default to "All". Sub-account leads because it's the broadest org filter.`,`No Apply or Done button: changing a dropdown filters the table right away.`,`Active filters show as dismissible tags under the search bar, with "Clear all". The Filter button shows a count (e.g. "Filter (2)").`,`Sub-account is derived: blueprint and template courses map to "District Programs," every other course to a school. So a school filter correctly shows no results on the Blueprint and Template tab.`,`Search, filters, and "Show selected only" stack — a row must pass all of them, or the table shows an empty state.`])}]},{title:`Content flags`,description:`The shared status system. Flags name what won't migrate cleanly so an admin can decide — they're informational, not a to-do.`,boards:[{width:760,caption:`Content flags — all combinations`,content:we(n),frame:`content-flags-matrix`,notes:$(`Informational flags, not a to-do. No status word and no icon — a course either lists its flags or shows a muted em dash.`,[`Submissions — a quiz already has student submissions, so migrating would risk graded data; the original is kept.`,`Item banks — a quiz pulls from an item bank; the link doesn't carry over automatically.`,`Unsupported question types — a type New Quizzes doesn't support yet (e.g. Formula, Hot Spot).`,`A course with no flags shows a muted em dash; multiple flags list comma-separated. It's a yes/no heads-up, not a score — no percentage or ranking.`,`Blueprint and template courses never carry the Submissions flag — they aren't published, so they can't have submissions.`,`The same ContentFlags component renders in every table, so all surfaces read identically. Change it in one place.`])}]},{title:`Migrate flow`,description:`Selecting courses and choosing "Preview migration" scans the quizzes, then opens the migrate sheet. The banner also links to a read-only list of every flagged quiz.`,boards:[{width:620,caption:`Scan step`,content:Ee(n),frame:`scan`,notes:$(`A short progress pass before the migrate sheet opens.`,[`Sorts the selected courses' quizzes into clean, with-submissions, and review groups.`,`The prototype runs it on a timer, then opens the migrate sheet.`])},{width:820,caption:`Migrate sheet`,content:Oe(n),frame:`migrate-sheet`,notes:$(`A fullscreen modal listing the scoped quizzes grouped by how cleanly they migrate, carrying each quiz's course and educator.`,[`All three groups always show, even when empty, so the categories stay a consistent mental model — an empty group reads as "none of these," not "step missing."`,`Quizzes are checked by default; unchecking is presentational in this prototype.`,`Migration preferences live inside "Fully supported" because they only affect those quizzes. "Keep a copy of the original" defaults off.`,`With-submissions and review quizzes always keep their original and get a clean copy regardless, so a global preference would misrepresent them.`,`Confirming converts the safe quizzes to New Quizzes and leaves the flagged ones as Classic for individual review, then updates each course's counts.`])},{width:900,caption:`Quizzes with content flags`,content:Q(n),frame:`attention-list`,notes:$(`Reached from the banner stat: every flagged Classic quiz across the district in one list.`,[`Shows quiz, course, educator, and the same Content flags cell used everywhere else.`,`It's read-only. Migration happens from the dashboard, not here — don't add migrate or select actions.`])}]},{title:`Completion and post-migration`,description:`After a run, a before-and-after comparison lets the admin confirm each conversion. The same table is reachable any time from the migrated archive.`,boards:[{width:1100,caption:`Migration complete`,content:ke(n),frame:`complete`,notes:$(`A success summary plus the before/after comparison table for confirming each conversion.`,[`Each migrated quiz is shown as its Classic and New Quizzes versions side by side; the titles open the respective builders in a new tab.`,`Rows are selectable for a single or bulk "Replace original," which swaps the Classic quiz for its New Quizzes version.`,`Replacing is irreversible, so it's always confirmed — both the per-row and bulk paths route through the same confirmation.`,`A row with no Classic original can't be selected or replaced — there's nothing left to swap.`,`The toolbar also offers "Report migration issue" and Export to a print-ready PDF.`])},{width:1100,caption:`Migrated quizzes archive`,content:Ae(n),frame:`migrated-archive`,notes:$(`The same comparison table opened from the "Quizzes migrated" stat, plus a Migrated date column unique to this view.`,[`Lets admins revisit and replace originals at any time, not only right after a run.`,`Roughly one in four migrated quizzes was migrated without keeping the original; those rows show "No original" and can't be selected.`])},{width:620,caption:`Replace and report confirmations`,content:je(n),frame:`post-migration-modals`,notes:$(`The two confirmations from the comparison table, shown stacked.`,[`Replacing an original is irreversible, so the dialog restates the count and warns it can't be undone.`,`The report dialog sends a written issue description to the migration team.`,`Rows with no Classic original can't be selected for replacement.`])}]}]})}(0,B.createRoot)(document.getElementById(`root`)).render((0,q.jsx)(z.StrictMode,{children:(0,q.jsx)(i,{theme:h,children:(0,q.jsx)(`div`,{style:{minHeight:`100vh`,padding:`24px`},children:(0,q.jsx)(Ne,{isDark:!1,onToggleTheme:()=>{}})})})}));