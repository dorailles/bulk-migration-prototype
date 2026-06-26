import { Text } from '@instructure/ui-text/latest'
import type { MigrationStatus } from './migrationModel'

// Informational "Content flags" cell: the specific issues that won't migrate cleanly
// (submissions, item banks, unsupported question types). Rows with nothing flagged show a
// muted em dash. No status word, no icon — this isn't a to-do, just a heads-up. Shared by
// every table that surfaces flags so they all read the same.
export function ContentFlags({ status }: { status: MigrationStatus }) {
  if (status.kind !== 'review' || !status.reasonLabel) {
    return <Text color="secondary">—</Text>
  }
  return <Text lineHeight="condensed">{status.reasonLabel}</Text>
}
