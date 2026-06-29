import React from 'react'
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
  { status: mk(['submissions', 'itemBanks']), rule: 'Both flags present — all are listed, comma-separated.' },
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
