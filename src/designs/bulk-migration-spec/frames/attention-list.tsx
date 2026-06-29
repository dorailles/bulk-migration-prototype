import React from 'react'
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
