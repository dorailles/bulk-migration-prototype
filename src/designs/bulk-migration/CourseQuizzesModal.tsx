import { Modal } from '@instructure/ui-modal/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Link } from '@instructure/ui-link/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { Table } from '@instructure/ui-table/latest'
import { ContentFlags } from './MigrationStatus'
import { courseQuizzes, quizStatus, teacherName } from './migrationModel'
import type { Course } from './migrationModel'

// Per-course breakdown: every Classic quiz still to migrate, with its status. Opened by
// clicking a course name or a quiz in the attention list.
export function CourseQuizzesModal({
  open,
  course,
  onClose,
}: {
  open: boolean
  course: Course | null
  onClose: () => void
}) {
  if (!course) return null
  const quizzes = courseQuizzes(course)
  const educator = teacherName(course.teacherId)

  return (
    <Modal open={open} onDismiss={onClose} size="fullscreen" label={`${course.name} quizzes`}>
      <Modal.Header>
        <Flex justifyItems="space-between" alignItems="center">
          <Heading level="h2" variant="titleCardLarge" margin="0">{course.name}</Heading>
          <CloseButton onClick={onClose} screenReaderLabel="Close" />
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Table caption={`Quizzes in ${course.name}`} layout="auto">
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="cq-name">Quizzes</Table.ColHeader>
              <Table.ColHeader id="cq-educator">Educator</Table.ColHeader>
              <Table.ColHeader id="cq-flags">Content flags</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {quizzes.map((q) => (
              <Table.Row key={q.id}>
                <Table.Cell><Link onClick={onClose}>{q.name}</Link></Table.Cell>
                <Table.Cell>{educator}</Table.Cell>
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
