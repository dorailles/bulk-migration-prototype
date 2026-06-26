import { Modal } from '@instructure/ui-modal/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { ComparisonTable } from './ComparisonTable'
import type { ComparedQuiz } from './ComparisonTable'

// Archive of every quiz already migrated to New Quizzes. Opened from the "Quizzes migrated"
// banner stat. Reuses the before/after comparison so admins can open the Classic and New
// versions in the builder and confirm or delete the originals at any time.
export function MigratedQuizzesModal({
  open,
  quizzes,
  onClose,
}: {
  open: boolean
  quizzes: ComparedQuiz[]
  onClose: () => void
}) {
  return (
    <Modal open={open} onDismiss={onClose} size="fullscreen" label="Migrated quizzes">
      <Modal.Header>
        <Flex justifyItems="space-between" alignItems="center">
          <Heading level="h2" variant="titleCardLarge" margin="0">Migrated quizzes</Heading>
          <CloseButton onClick={onClose} screenReaderLabel="Close" />
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Flex direction="column" gap="small">
          <Text color="secondary">
            Every quiz already migrated to New Quizzes. Open each version to compare the Classic and New Quizzes
            in the builder, then delete the original Classic quiz once you're confident.
          </Text>
          {quizzes.length > 0 ? (
            <ComparisonTable quizzes={quizzes} showDate />
          ) : (
            <Text color="secondary">No quizzes have been migrated yet.</Text>
          )}
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Button color="primary" onClick={onClose}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}
