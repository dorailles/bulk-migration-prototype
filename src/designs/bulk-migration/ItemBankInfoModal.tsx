import { Modal } from '@instructure/ui-modal/latest'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'

// Explainer for what happens to Question Banks when Classic Quizzes migrate. Opened from
// the "Learn more" link in the courses-table description.
const POINTS: { title: string; body: string }[] = [
  {
    title: 'Separated repositories',
    body: 'To ensure data integrity, the migration engine breaks apart legacy quiz structures. Standalone course banks, linked question groups, and individual Canvas questions will convert into separate, independent Item Banks that may require post-migration organization.',
  },
  {
    title: 'User-centric ownership',
    body: 'Unlike legacy banks that are bound to a course, New Quizzes Item Banks are owned by the individual creator. When these quizzes are copied into new courses or pushed via Blueprints, they default to View-Only access for protection; you can manually grant editing rights or duplicate the bank locally if unique modifications are needed.',
  },
  {
    title: 'Global editing impact',
    body: 'If you share an Item Bank with colleagues and grant them edit access, any change they make will instantly update that bank across all courses institution-wide where those questions are being used.',
  },
  {
    title: 'Outcomes alignment note',
    body: 'Legacy alignments mapped at the Question Group level do not migrate automatically and must be manually re-aligned at the question or quiz level after conversion.',
  },
]

export function ItemBankInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onDismiss={onClose} size="fullscreen" label="Migrating to Item Banks">
      <Modal.Header>
        <Flex justifyItems="space-between" alignItems="center">
          <Heading level="h2" variant="titleCardLarge" margin="0">Migrating to Item Banks</Heading>
          <CloseButton onClick={onClose} screenReaderLabel="Close" />
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Flex direction="column" gap="medium">
          <Text>
            When converting Classic Quizzes using Question Banks, your associated question banks will migrate
            into New Quizzes as distinct, centralized Item Banks tied to your user account with default
            view-only access.
          </Text>
          <Flex direction="column" gap="small">
            <Heading level="h3" variant="titleCardRegular" margin="0">What to know about migrating to Item Banks</Heading>
            {POINTS.map((p) => (
              <View as="div" key={p.title} display="block">
                <Text as="div" weight="bold">{p.title}</Text>
                <Text as="div" color="secondary">{p.body}</Text>
              </View>
            ))}
          </Flex>
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Button color="primary" onClick={onClose}>Got it</Button>
      </Modal.Footer>
    </Modal>
  )
}
