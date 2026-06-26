import { Modal } from '@instructure/ui-modal/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Link } from '@instructure/ui-link/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { Table } from '@instructure/ui-table/latest'
import { ContentFlags } from './MigrationStatus'
import { attentionQuizzes, quizStatus } from './migrationModel'
import type { Course } from './migrationModel'

// Read-only list of every Classic quiz across the district that needs attention before it
// can migrate. Opened from the banner stat. The quiz name links to its course's breakdown.
export function QuizzesRequireAttentionModal({
  open,
  courses,
  onClose,
  onOpenCourse,
}: {
  open: boolean
  courses: Course[]
  onClose: () => void
  onOpenCourse: (courseId: string) => void
}) {
  const rows = attentionQuizzes(courses)

  return (
    <Modal open={open} onDismiss={onClose} size="fullscreen" label="Quizzes with content flags">
      <Modal.Header>
        <Flex justifyItems="space-between" alignItems="center">
          <Heading level="h2" variant="titleCardLarge" margin="0">Quizzes with content flags</Heading>
          <CloseButton onClick={onClose} screenReaderLabel="Close" />
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Table caption="Quizzes that need attention before migrating" layout="auto">
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="a-name">Name</Table.ColHeader>
              <Table.ColHeader id="a-course">Course</Table.ColHeader>
              <Table.ColHeader id="a-educator">Educator</Table.ColHeader>
              <Table.ColHeader id="a-flags">Content flags</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((q) => (
              <Table.Row key={q.id}>
                <Table.Cell>
                  <Link onClick={() => onOpenCourse(q.courseId)}>{q.name}</Link>
                </Table.Cell>
                <Table.Cell>{q.courseName}</Table.Cell>
                <Table.Cell>{q.educator}</Table.Cell>
                <Table.Cell><ContentFlags status={quizStatus(q)} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} margin="0 x-small 0 0">Cancel</Button>
        <Button color="primary" onClick={onClose}>Back to dashboard</Button>
      </Modal.Footer>
    </Modal>
  )
}
