import { useState } from 'react'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Link } from '@instructure/ui-link/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { Table } from '@instructure/ui-table/latest'
import { Modal } from '@instructure/ui-modal/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { TextArea } from '@instructure/ui-text-area/latest'
import { Alert } from '@instructure/ui-alerts/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { ExternalLinkInstUIIcon, DownloadInstUIIcon, FlagInstUIIcon } from '@instructure/ui-icons'
import { ISSUE_LABELS } from './migrationModel'
import type { IssueKey } from './migrationModel'

// Post-migration comparison: each migrated quiz shown as its Classic and New Quizzes
// versions, with its educator and the content flags it carried over (reasons to double-
// check). Rows are selectable (like the courses table) — delete originals one at a time or
// in bulk, always with confirmation. Quizzes with no Classic original can't be selected.
// Admins can also report a migration issue and export the table as a PDF to share.

export type ComparedQuiz = {
  id: string
  name: string
  courseName: string
  educator: string
  flags: IssueKey[]
  hasClassic?: boolean
  migratedAt?: string
}

const flagsLabel = (flags: IssueKey[]) => (flags.length ? flags.map((k) => ISSUE_LABELS[k]).join(', ') : '—')

// Prototype stand-in for the real builder: opens a labelled placeholder tab.
function openBuilder(kind: 'Classic Quiz' | 'New Quizzes', name: string) {
  const w = window.open('', '_blank')
  if (w) {
    w.document.title = `${kind} — ${name}`
    w.document.body.style.cssText = 'font-family: sans-serif; padding: 2rem; color: #2d3b45'
    w.document.body.innerHTML = `<h1>${kind} builder</h1><p>${name}</p><p style="color:#6a7883">Prototype placeholder — the real ${kind} builder would open here.</p>`
  }
}

// Open a print-ready page of the table; the admin saves it as a PDF from the print dialog.
function exportPdf(quizzes: ComparedQuiz[], deleted: Set<string>, showDate: boolean) {
  const rows = quizzes
    .map((q) => {
      const classic = deleted.has(q.id) ? 'Original deleted' : (q.hasClassic ?? true) ? q.name : 'No original'
      const date = showDate ? `<td>${q.migratedAt ?? ''}</td>` : ''
      return `<tr><td>${q.courseName}</td><td>${q.educator}</td>${date}<td>${flagsLabel(q.flags)}</td><td>${classic}</td><td>${q.name}</td></tr>`
    })
    .join('')
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Migrated quizzes</title>
    <style>
      body{font-family:'Helvetica Neue',Arial,sans-serif;color:#2d3b45;padding:32px}
      h1{font-size:20px;margin:0 0 4px}
      p.sub{color:#6a7883;margin:0 0 20px;font-size:13px}
      table{border-collapse:collapse;width:100%;font-size:13px}
      th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #e8eaec;vertical-align:top}
      th{background:#f5f5f0;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#576773}
    </style></head><body>
    <h1>Migrated quizzes — Classic vs New Quizzes</h1>
    <p class="sub">${quizzes.length} quizzes · generated for review</p>
    <table><thead><tr><th>Course</th><th>Educator</th>${showDate ? '<th>Migrated</th>' : ''}<th>Content flags</th><th>Classic Quiz</th><th>New Quiz</th></tr></thead>
    <tbody>${rows}</tbody></table>
    </body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 300)
}

export function ComparisonTable({ quizzes, showDate = false }: { quizzes: ComparedQuiz[]; showDate?: boolean }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleted, setDeleted] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<string[] | null>(null) // ids awaiting delete confirmation
  const [reportOpen, setReportOpen] = useState(false)
  const [reportText, setReportText] = useState('')
  const [reportSent, setReportSent] = useState(false)

  const hasOriginal = (q: ComparedQuiz) => (q.hasClassic ?? true) && !deleted.has(q.id)
  const selectable = quizzes.filter(hasOriginal)
  const allSelected = selectable.length > 0 && selectable.every((q) => selected.has(q.id))

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(selectable.map((q) => q.id)))

  const confirmDelete = () => {
    if (!pending) return
    setDeleted((prev) => new Set([...prev, ...pending]))
    setSelected((prev) => {
      const next = new Set(prev)
      pending.forEach((id) => next.delete(id))
      return next
    })
    setPending(null)
  }

  const closeReport = () => {
    setReportOpen(false)
    setReportText('')
    setReportSent(false)
  }
  const submitReport = () => {
    setReportSent(true)
    setTimeout(closeReport, 1400)
  }

  const pendingCount = pending?.length ?? 0

  return (
    <Flex direction="column" gap="small" alignItems="stretch">
      {/* Toolbar */}
      <Flex justifyItems="space-between" alignItems="center" wrap="wrap" gap="small">
        <Flex gap="small" alignItems="center">
          <Button renderIcon={<FlagInstUIIcon />} onClick={() => setReportOpen(true)}>Report migration issue</Button>
          <Button renderIcon={<DownloadInstUIIcon />} onClick={() => exportPdf(quizzes, deleted, showDate)}>Export</Button>
        </Flex>
        <Button
          color="danger"
          interaction={selected.size > 0 ? 'enabled' : 'disabled'}
          onClick={() => setPending([...selected])}
        >
          Delete originals
        </Button>
      </Flex>

      <Table caption="Compare Classic and New Quizzes versions" layout="auto">
        <Table.Head>
          <Table.Row>
            <Table.ColHeader id="cmp-select" width="3rem">
              <Checkbox
                label={<ScreenReaderContent>Select all</ScreenReaderContent>}
                checked={allSelected}
                indeterminate={!allSelected && selected.size > 0}
                onChange={toggleAll}
              />
            </Table.ColHeader>
            <Table.ColHeader id="cmp-course">Course</Table.ColHeader>
            <Table.ColHeader id="cmp-educator">Educator</Table.ColHeader>
            {showDate ? <Table.ColHeader id="cmp-date">Migrated</Table.ColHeader> : null}
            <Table.ColHeader id="cmp-flags">Content flags</Table.ColHeader>
            <Table.ColHeader id="cmp-classic">Classic Quiz</Table.ColHeader>
            <Table.ColHeader id="cmp-new">New Quiz</Table.ColHeader>
            <Table.ColHeader id="cmp-action" textAlign="end">Action</Table.ColHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {quizzes.map((q) => {
            const isDeleted = deleted.has(q.id)
            const noOriginal = !(q.hasClassic ?? true)
            const canAct = hasOriginal(q)
            return (
              <Table.Row key={q.id}>
                <Table.Cell>
                  <Checkbox
                    label={<ScreenReaderContent>Select {q.name}</ScreenReaderContent>}
                    checked={selected.has(q.id)}
                    disabled={!canAct}
                    onChange={() => toggle(q.id)}
                  />
                </Table.Cell>
                <Table.Cell>{q.courseName}</Table.Cell>
                <Table.Cell>{q.educator}</Table.Cell>
                {showDate ? <Table.Cell>{q.migratedAt}</Table.Cell> : null}
                <Table.Cell>
                  {q.flags.length ? <Text>{flagsLabel(q.flags)}</Text> : <Text color="secondary">—</Text>}
                </Table.Cell>
                <Table.Cell>
                  {isDeleted ? (
                    <Text color="secondary">Original deleted</Text>
                  ) : noOriginal ? (
                    <Text color="secondary">No original</Text>
                  ) : (
                    <Link onClick={() => openBuilder('Classic Quiz', q.name)} renderIcon={<ExternalLinkInstUIIcon />} iconPlacement="end">
                      {q.name}
                    </Link>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Link onClick={() => openBuilder('New Quizzes', q.name)} renderIcon={<ExternalLinkInstUIIcon />} iconPlacement="end">
                    {q.name}
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  {canAct ? (
                    <Button size="small" color="danger" onClick={() => setPending([q.id])}>
                      <span style={{ whiteSpace: 'nowrap' }}>Delete original</span>
                    </Button>
                  ) : null}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>

      {/* Delete confirmation */}
      <Modal open={pending !== null} onDismiss={() => setPending(null)} size="small" label="Delete original Classic quizzes">
        <Modal.Header>
          <Flex justifyItems="space-between" alignItems="center">
            <Heading level="h2" variant="titleCardLarge" margin="0">
              Delete {pendingCount === 1 ? 'original quiz' : `${pendingCount} original quizzes`}?
            </Heading>
            <CloseButton onClick={() => setPending(null)} screenReaderLabel="Close" />
          </Flex>
        </Modal.Header>
        <Modal.Body>
          <Text>
            {pendingCount === 1 ? 'This Classic quiz' : `These ${pendingCount} Classic quizzes`} will be permanently
            deleted. The New Quizzes {pendingCount === 1 ? 'version stays' : 'versions stay'} in place. This can't be undone.
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setPending(null)} margin="0 x-small 0 0">Cancel</Button>
          <Button color="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Report migration issue */}
      <Modal open={reportOpen} onDismiss={closeReport} size="fullscreen" label="Report a migration issue">
        <Modal.Header>
          <Flex justifyItems="space-between" alignItems="center">
            <Heading level="h2" variant="titleCardLarge" margin="0">Report a migration issue</Heading>
            <CloseButton onClick={closeReport} screenReaderLabel="Close" />
          </Flex>
        </Modal.Header>
        <Modal.Body>
          {reportSent ? (
            <Alert variant="success" margin="0" hasShadow={false}>Thanks — your report was sent to the migration team.</Alert>
          ) : (
            <TextArea
              label="Describe what went wrong"
              placeholder="Tell us what looked off after migrating — wrong points, missing questions, broken formatting…"
              height="10rem"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeReport} margin="0 x-small 0 0">Cancel</Button>
          <Button color="primary" interaction={reportText.trim() && !reportSent ? 'enabled' : 'disabled'} onClick={submitReport}>
            Send report
          </Button>
        </Modal.Footer>
      </Modal>
    </Flex>
  )
}
