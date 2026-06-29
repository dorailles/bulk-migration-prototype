import type { ReactNode } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Text } from '@instructure/ui-text/latest'
import { List } from '@instructure/ui-list/latest'
import { SpecSheet } from '../../components/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { hubEntryCard } from './frames/hub-entry-card'
import { dashboardBanner } from './frames/dashboard-banner'
import { creationDonut } from './frames/creation-donut'
import { rolloutTimeline } from './frames/rollout-timeline'
import { coursesTable } from './frames/courses-table'
import { contentFlagsMatrix } from './frames/content-flags-matrix'
import { filters } from './frames/filters'
import { scan } from './frames/scan'
import { migrateSheet } from './frames/migrate-sheet'
import { attentionList } from './frames/attention-list'
import { complete } from './frames/complete'
import { migratedArchive } from './frames/migrated-archive'
import { postMigrationModals } from './frames/post-migration-modals'

const frameSources = import.meta.glob('./frames/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Behavior block for a board: a one-line summary followed by the numbered rules pulled
// from BEHAVIOR.md, so each artboard carries its own behavior spec.
function behavior(summary: string, rules: string[]): ReactNode {
  return (
    <View as="div" display="block">
      <Text size="content" color="secondary">{summary}</Text>
      <View as="div" display="block" margin="x-small 0 0 0">
        <List as="ol">
          {rules.map((r, i) => (
            <List.Item key={i}>
              <Text size="content" color="secondary">{r}</Text>
            </List.Item>
          ))}
        </List>
      </View>
    </View>
  )
}

export default function BulkMigrationSpec(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const ctx = { sharedTokens }

  return (
    <SpecSheet
      title="Bulk Migration — Visual Spec"
      description="The admin tool for moving a district's Classic Quizzes to New Quizzes in bulk. It lives on the Analytics Hub and walks an admin from a district-wide overview, through filtering and previewing what will migrate, to a before-and-after review of the results. Each board carries its behavior rules below it (full handoff: src/designs/bulk-migration/BEHAVIOR.md). Screens are shown inside the Canvas admin content area; global navigation is out of scope here."
      basePath="src/designs/bulk-migration-spec"
      frameSources={frameSources}
      sections={[
        {
          title: 'Entry and dashboard',
          description:
            'The tool opens from one active card on the district Analytics Hub. The dashboard leads with a banner: a short pitch, three headline stats, overall progress, and the migration due date.',
          boards: [
            {
              width: 460,
              caption: 'Analytics Hub — migration card',
              content: hubEntryCard(ctx),
              frame: 'hub-entry-card',
              notes: behavior(
                'One active card among the hub grid; the brand border and "Active" pill mark it as the only wired-up entry.',
                [
                  'Only the migration card is wired up — the rest mirror the Figma so the dashboard sits in its real home.',
                  'Clicking it opens the Quiz Migration dashboard.',
                  'Breadcrumbs at the top of every view navigate back up the chain (Hub → Dashboard → Complete).',
                ],
              ),
            },
            {
              width: 1100,
              caption: 'Dashboard banner',
              content: dashboardBanner(ctx),
              frame: 'dashboard-banner',
              notes: behavior(
                'Three headline stats derived live from course state, with overall progress and the due date.',
                [
                  'Stats: quizzes requiring migration, quizzes with content flags, and quizzes migrated.',
                  'The second and third stats are links — to the content-flags list and the migrated archive. The first is plain text.',
                  'The progress bar shows the share of the total quiz population already on New Quizzes.',
                  'Quiz population is conserved: migrating converts a Classic quiz into a New one, so the ratio shifts but the total holds.',
                ],
              ),
            },
          ],
        },
        {
          title: 'Insight panels',
          description:
            'Two panels sit below the banner: where every quiz came from, and where the institution stands on the New Quizzes rollout.',
          boards: [
            {
              width: 520,
              caption: 'How Quizzes were created',
              content: creationDonut(ctx),
              frame: 'creation-donut',
              notes: behavior(
                'A provenance donut: created from scratch, course copy, blueprint sync, bulk migration, and other imports.',
                [
                  'A district-level aggregate scaled to the live quiz population.',
                  'The center total matches the banner and ratio figures rather than drifting — everything derives from the same model.',
                ],
              ),
            },
            {
              width: 520,
              caption: 'Migration rollout',
              content: rolloutTimeline(ctx),
              frame: 'rollout-timeline',
              notes: behavior(
                'A status panel showing the New Quizzes feature options as On / Off — not a fixed sequence of steps.',
                [
                  'Options that are off link out to Canvas feature options.',
                  "The admin can't toggle features here — enabling a feature option isn't something this tool owns.",
                  'The internal R0–R5 rollout ladder is Instructure-internal phasing and must never appear in any admin or educator-facing surface.',
                ],
              ),
            },
          ],
        },
        {
          title: 'Courses table and filters',
          description:
            'The heart of the dashboard: every course split across three tabs, with search and filtering to narrow the list before migrating.',
          boards: [
            {
              width: 1100,
              caption: 'Courses table — Active tab',
              content: coursesTable(ctx),
              frame: 'courses-table',
              notes: behavior(
                'Courses split across three tabs — Blueprint and Template, Active, and All other — each backed by its own subset.',
                [
                  "Each tab has its own select-all, acting only on that tab's migratable courses (those with at least one Classic quiz).",
                  'Columns are sortable; the sort is shared state and applies across all tabs.',
                  "A course with no Classic quizzes can't be selected — its checkbox is disabled and its action reads \"Done\" instead of \"Preview migration.\"",
                  'Selection is tracked by course id and persists across tabs, so an admin can build a cross-tab batch.',
                  '"Show selected only" filters the visible tab to the current selection.',
                  'The bulk "Preview migration" button is disabled until at least one course is selected.',
                ],
              ),
            },
            {
              width: 720,
              caption: 'Search and filter tray',
              content: filters(ctx),
              frame: 'filters',
              notes: behavior(
                'Live search plus a tray of four single-select dropdowns; selections apply immediately and surface as dismissible tags.',
                [
                  'Search matches course name and educator, live as the admin types.',
                  'Dropdowns — Sub-account, Term, Educator, and Content flag — each default to "All". Sub-account leads because it\'s the broadest org filter.',
                  'No Apply or Done button: changing a dropdown filters the table right away.',
                  'Active filters show as dismissible tags under the search bar, with "Clear all". The Filter button shows a count (e.g. "Filter (2)").',
                  'Sub-account is derived: blueprint and template courses map to "District Programs," every other course to a school. So a school filter correctly shows no results on the Blueprint and Template tab.',
                  'Search, filters, and "Show selected only" stack — a row must pass all of them, or the table shows an empty state.',
                ],
              ),
            },
          ],
        },
        {
          title: 'Content flags',
          description:
            "The shared status system. Flags name what won't migrate cleanly so an admin can decide — they're informational, not a to-do.",
          boards: [
            {
              width: 760,
              caption: 'Content flags — all combinations',
              content: contentFlagsMatrix(ctx),
              frame: 'content-flags-matrix',
              notes: behavior(
                'Informational flags, not a to-do. No status word and no icon — a course either lists its flags or shows a muted em dash.',
                [
                  'Submissions — a quiz already has student submissions, so migrating would risk graded data; the original is kept.',
                  "Item banks — a quiz pulls from an item bank; the link doesn't carry over automatically.",
                  'A course with no flags shows a muted em dash; multiple flags list comma-separated. It\'s a yes/no heads-up, not a score — no percentage or ranking.',
                  "Blueprint and template courses never carry the Submissions flag — they aren't published, so they can't have submissions.",
                  'The same ContentFlags component renders in every table, so all surfaces read identically. Change it in one place.',
                ],
              ),
            },
          ],
        },
        {
          title: 'Migrate flow',
          description:
            'Selecting courses and choosing "Preview migration" scans the quizzes, then opens the migrate sheet. The banner also links to a read-only list of every flagged quiz.',
          boards: [
            {
              width: 620,
              caption: 'Scan step',
              content: scan(ctx),
              frame: 'scan',
              notes: behavior(
                "A short progress pass before the migrate sheet opens.",
                [
                  "Sorts the selected courses' quizzes into clean, with-submissions, and review groups.",
                  'The prototype runs it on a timer, then opens the migrate sheet.',
                ],
              ),
            },
            {
              width: 820,
              caption: 'Migrate sheet',
              content: migrateSheet(ctx),
              frame: 'migrate-sheet',
              notes: behavior(
                'A fullscreen modal listing the scoped quizzes grouped by how cleanly they migrate, carrying each quiz\'s course and educator.',
                [
                  'All three groups always show, even when empty, so the categories stay a consistent mental model — an empty group reads as "none of these," not "step missing."',
                  'Quizzes are checked by default; unchecking is presentational in this prototype.',
                  'Migration preferences live inside "Fully supported" because they only affect those quizzes. "Keep a copy of the original" defaults off.',
                  'With-submissions and review quizzes always keep their original and get a clean copy regardless, so a global preference would misrepresent them.',
                  'Confirming converts the safe quizzes to New Quizzes and leaves the flagged ones as Classic for individual review, then updates each course\'s counts.',
                ],
              ),
            },
            {
              width: 900,
              caption: 'Quizzes with content flags',
              content: attentionList(ctx),
              frame: 'attention-list',
              notes: behavior(
                'Reached from the banner stat: every flagged Classic quiz across the district in one list.',
                [
                  'Shows quiz, course, educator, and the same Content flags cell used everywhere else.',
                  "It's read-only. Migration happens from the dashboard, not here — don't add migrate or select actions.",
                ],
              ),
            },
          ],
        },
        {
          title: 'Completion and post-migration',
          description:
            'After a run, a before-and-after comparison lets the admin confirm each conversion. The same table is reachable any time from the migrated archive.',
          boards: [
            {
              width: 1100,
              caption: 'Migration complete',
              content: complete(ctx),
              frame: 'complete',
              notes: behavior(
                'A success summary plus the before/after comparison table (the migration log) for confirming each conversion.',
                [
                  'Each migrated quiz is shown as its Classic and New Quizzes versions side by side; the titles open the respective builders in a new tab.',
                  'Rows are selectable for a single or bulk "Delete Classic Quiz," which permanently removes the Classic original; the New Quizzes version stays in place.',
                  "Deleting is irreversible, so it's always confirmed — both the per-row and bulk paths route through the same confirmation.",
                  "A row with no Classic original can't be selected or deleted — there's nothing left to remove.",
                  'The toolbar also offers "Report migration issue" and an Export log to a print-ready PDF.',
                ],
              ),
            },
            {
              width: 1100,
              caption: 'Migrated quizzes archive',
              content: migratedArchive(ctx),
              frame: 'migrated-archive',
              notes: behavior(
                'The same comparison table opened from the "Quizzes migrated" stat, plus a Migrated date column unique to this view.',
                [
                  'Lets admins revisit and delete Classic originals at any time, not only right after a run.',
                  'Roughly one in four migrated quizzes was migrated without keeping the original; those rows show "No original" and can\'t be selected.',
                ],
              ),
            },
            {
              width: 620,
              caption: 'Delete and report confirmations',
              content: postMigrationModals(ctx),
              frame: 'post-migration-modals',
              notes: behavior(
                'The two confirmations from the comparison table, shown stacked.',
                [
                  'Deleting a Classic quiz is irreversible, so the dialog restates the count and warns it can\'t be undone.',
                  'The report dialog sends a written issue description to the migration team.',
                  "Rows with no Classic original can't be selected for deletion.",
                ],
              ),
            },
          ],
        },
      ]}
    />
  )
}
