import React from 'react'
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
