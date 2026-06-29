# Bulk Migration — behavior rules.

Engineering handoff for the Bulk Migration prototype — the admin tool for moving a district's Classic Quizzes to New Quizzes in bulk. These rules describe how the feature should behave, not how the prototype happens to be coded. Where a rule exists to prevent a real bug or a confusing state, the reason is called out.

The prototype lives in `src/designs/bulk-migration/`. It's a Canvas-styled prototype built with InstUI. A companion visual spec lives in `src/designs/bulk-migration-spec/` (the artboard catalog of every screen and state).

---

## Structure.

The tool is one of several cards on a district's Analytics Hub. It has four sequential views, tracked by a single `view` state (`hub` → `dashboard` → `migrating` → `complete`):

- **Analytics Hub** — the entry grid. Only the "Quiz Migration Progress" card is wired up; the rest mirror the Figma so the dashboard sits in its real home.
- **Dashboard** — the working surface: a stats banner, two insight panels, and the courses table.
- **Migrating** — a brief progress screen shown while a run completes.
- **Migration complete** — the before-and-after review of what just migrated.

Breadcrumbs sit at the top of every view and navigate back up the chain. The left side nav and the migrate/scan/info modals are global chrome that layer over whichever view is active.

---

## The data model.

The model is the source of truth. Everything on screen derives from it, so the banner, donut, ratio, and tables always agree.

1. A **course** has a type, a term, an educator, a subject, a count of Classic quizzes still to migrate, a count already migrated, and per-reason counts of flagged Classic quizzes.
2. A **quiz** is generated deterministically from its course's counts — no randomness — so the same course always produces the same quizzes across renders.
3. Course **types** drive the dashboard tabs: `blueprint`, `template`, `active`, and `other`.
4. Quiz population is conserved. Migrating converts a Classic quiz into a New one; it never adds or removes quizzes, so the New : Classic ratio shifts but the total holds.

---

## Content flags.

This is the shared status system, used by every table. Flags are **informational, not a to-do** — they name what won't migrate cleanly so an admin can decide. There's no status word and no icon.

1. There are three flag types:
   - **Submissions** — a quiz already has student submissions. Migrating would put graded data at risk, so the original is kept.
   - **Item banks** — a quiz pulls questions from an item bank. The link doesn't carry over automatically.
   - **Unsupported question types** — a quiz uses a type New Quizzes doesn't support yet (for example, Formula or Hot Spot).
2. A course with no flags renders a muted em dash, never a "Safe" word. A course with one or more flags lists them, comma-separated.
3. Flags are a yes/no heads-up, **not a score**. Don't reintroduce a readiness score, a percentage, or a ranking.
4. **Blueprint and template courses never carry the Submissions flag.** They aren't published, so they can't have student submissions. The course generator enforces this; keep it enforced anywhere flags are assigned.
5. The same `ContentFlags` component renders in the dashboard table, the content-flags list, the comparison table, and the archive, so every surface reads identically. Change it in one place.
6. **Readiness means content compatibility only.** The internal R0–R5 feature-flag rollout ladder is Instructure-internal phasing and must never appear in any admin or educator-facing surface.

---

## Dashboard — banner and panels.

1. The **banner** shows three headline stats derived live from course state: quizzes requiring migration, quizzes with content flags, and quizzes migrated.
2. The second and third stats are links. "Quizzes with content flags" opens the content-flags list; "Quizzes migrated" opens the migrated archive. The first stat is plain text.
3. A progress bar shows the share of the total quiz population already on New Quizzes, with the district due date below it.
4. **How Quizzes were created** is a provenance donut (created from scratch, course copy, blueprint sync, bulk migration, and other imports). It's a district-level aggregate scaled to the live quiz population, so the center total matches the banner and ratio figures rather than drifting.
5. **Migration rollout** shows the New Quizzes feature options as On / Off — it's a status panel, **not a fixed sequence of steps**. Options that are off link out to Canvas feature options; the admin can't toggle them here, because enabling a feature option isn't something this tool owns.

---

## Courses table.

The table splits courses across three tabs, each backed by its own subset of the course list:

- **Blueprint and Template Courses**
- **Active Courses**
- **All other Courses**

1. Each tab has its own select-all checkbox that acts only on that tab's migratable courses (those with at least one Classic quiz).
2. Columns are sortable: Course, Educator, Content flags, Classic Quizzes, and New Quizzes. The sort applies across all tabs (it's shared state).
3. **A course with no Classic quizzes can't be selected.** Its checkbox is disabled, and its action reads "Done" (disabled) instead of "Preview migration." There's nothing left to migrate.
4. The per-row action opens the migrate flow scoped to that single course.
5. Selection is tracked by course id and **persists across tabs**, so an admin can build a cross-tab batch. The "Show selected only" toggle filters the visible tab to the current selection.
6. The bulk "Preview migration" button is disabled until at least one course is selected. It opens the migrate flow scoped to every selected course across all tabs.

---

## Search and filters.

A search field and a Filter button sit above the tabs. The Filter button opens a tray.

1. **Search** matches course name and educator, live as the admin types.
2. The tray holds four single-select dropdowns, each defaulting to "All": **Sub-account**, **Term**, **Educator**, and **Content flag**. Sub-account leads because it's the broadest org filter.
3. **Filters apply immediately.** There's no Apply or Done button — changing a dropdown filters the table right away.
4. Active filters surface as dismissible tags under the search bar, with a "Clear all" link. Dismissing a tag clears that one filter; "Clear all" resets every filter at once.
5. The Filter button shows a count of active filters (for example, "Filter (2)").
6. Sub-account is derived deterministically from the course: blueprint and template courses map to "District Programs"; every other course maps to one of the schools. Because blueprint/template courses all sit in "District Programs," selecting a school sub-account on the Blueprint and Template tab correctly shows no results.
7. Search, filters, and the "Show selected only" toggle stack — a row must pass all of them to show. When nothing passes, the table shows a "No courses match your search and filters." empty state.

---

## Migrate flow.

Choosing "Preview migration" (single-course or bulk) runs a three-step flow: scan, then the migrate sheet, then the run.

1. **Scan** is a short progress pass that sorts the selected courses' quizzes into clean, with-submissions, and review groups. The prototype runs it on a timer, then opens the migrate sheet.
2. The **migrate sheet** is a fullscreen modal listing the scoped quizzes grouped by how cleanly they migrate. It carries each quiz's course and educator, because in a bulk run quizzes from several courses are interleaved and the admin needs to know which is which.
3. **All three groups always show, even when empty.** This keeps the three categories — Fully supported, With submissions, and Review needed — visible as a consistent mental model, so an empty group reads as "none of these," not "this step is missing."
4. Quizzes are **checked by default**. Unchecking is presentational in this prototype.
5. **Migration preferences live inside the "Fully supported" group**, because they only affect those quizzes. The "Keep a copy of the original Classic Quiz" toggle defaults off. The with-submissions and review quizzes always keep their original and get a clean copy regardless, so a global preference would misrepresent them.
6. Each group states what happens to its quizzes:
   - **With submissions** — "we'll keep a copy of the original quiz. Existing submission data will be available through this original quiz."
   - **Review needed** — "these quizzes contain rich content. You can review the migrated quizzes to ensure all content has been converted successfully."
7. Confirming with "Migrate selected" runs the migration: the **safe quizzes convert** to New Quizzes, and the **flagged ones stay as Classic** for individual review. The tool then shows the migrating screen, updates each course's counts, clears the selection, and lands on the complete view.

---

## Migration complete.

1. A success alert summarizes the run ("Migrated N quizzes across M courses").
2. Below it, a **comparison table** lists each migrated quiz as its Classic and New Quizzes versions side by side, so the admin can confirm each conversion.
3. The Classic and New titles each open the respective builder in a new tab (a labelled placeholder in this prototype).
4. Rows are selectable for a **single or bulk "Replace original."** Replacing swaps the original Classic quiz for its New Quizzes version.
5. **Replacing is irreversible, so it's always confirmed.** The confirmation restates the count and warns it can't be undone. Both the per-row and bulk paths route through the same confirmation.
6. **A row with no Classic original can't be selected or replaced.** Its checkbox is disabled — there's no original left to swap.
7. The toolbar also offers **Report migration issue** (a dialog where the admin describes what looked wrong; the report goes to the migration team) and **Export** (a print-ready page the admin saves as a PDF).

---

## Migrated archive.

1. The "Quizzes migrated" banner stat opens a fullscreen archive of every quiz already on New Quizzes across the district.
2. It reuses the comparison table, plus a **Migrated date column unique to this view**, so admins can revisit and replace originals at any time — not only right after a run.
3. Roughly one in four migrated quizzes was migrated without keeping the original. Those rows show "No original" and can't be selected, matching the rule above.

---

## Quizzes with content flags.

1. Reached from the banner stat. It lists every flagged Classic quiz across the district — quiz, course, educator, and the same Content flags cell.
2. It's **read-only.** Migration happens from the dashboard, not here. Don't add migrate or select actions to this list.

---

## Implementation notes (InstUI).

These are traps we hit. They'll save you time.

1. **Verify with `npm run build`, not `tsc --noEmit`.** The root `tsconfig.json` has `files: []`, so `tsc --noEmit` compiles nothing and passes on broken code. The real build runs `tsc -b` against `tsconfig.app.json`, which enforces `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax`. Unused imports and value-vs-type import mistakes only surface there.
2. **`Checkbox` takes `disabled`, not `interaction`.** Passing `interaction` is silently ignored, so a checkbox you meant to disable stays clickable. (`Button` uses `interaction`; the two components differ.)
3. **`Button` has no `iconPlacement` prop.** Use `renderIcon` for a leading icon, or put the icon in the children for a trailing one. `Link` does support `iconPlacement`.
4. **A `variant="toggle"` Checkbox renders full-width** and will push a sibling button to the next line inside a `space-between` Flex. Wrap the toggle in `<View as="div" display="inline-block">` so the row lays out correctly.
5. **`Text` has no `margin` prop.** Wrap it in a `View` for spacing.
6. **Modals render through a portal**, so a `<Modal>` won't sit inside a spec artboard. For documentation, reconstruct the modal body as a plain card; for the app, the real `<Modal>` is fine.

---

## Files.

- `index.tsx` — the four views, the courses table, search/filter state, and the migrate flow orchestration.
- `migrationModel.ts` — types, seed courses (hand-authored featured + generated), and every derived helper (statuses, banner stats, quiz mix, provenance, sub-accounts, migrated quizzes).
- `MigrationBanner.tsx` — the dashboard stats banner.
- `DonutChart.tsx` — the hand-built SVG provenance donut.
- `MigrationRollout.tsx` — the feature-options status panel.
- `MigrationStatus.tsx` — the shared `ContentFlags` cell.
- `ScanModal.tsx` — the pre-migrate scan step.
- `MigrateModal.tsx` — the grouped migrate sheet with preferences.
- `QuizzesRequireAttentionModal.tsx` — the read-only content-flags list.
- `CourseQuizzesModal.tsx` — the per-course quiz drill-down.
- `ItemBankInfoModal.tsx` — the "Learn more" explainer for item banks.
- `ComparisonTable.tsx` — the before/after table with replace, report, and export.
- `MigratedQuizzesModal.tsx` — the migrated archive (wraps `ComparisonTable`).
- `CourseFilterTray.tsx` — the Sub-account / Term / Educator / Content flag filter tray.
- `BEHAVIOR.md` — this spec.
