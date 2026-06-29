import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { TextArea } from '@instructure/ui-text-area/latest'
import type { FrameCtx } from '../../../components/SpecSheet'

// Two confirmations from the comparison table, shown stacked. Top: deleting a Classic quiz
// after migrating is irreversible, so it's always confirmed (single or bulk). Bottom:
// "Report migration issue" lets an admin describe what looked wrong after migrating; the
// report goes to the migration team.
export function postMigrationModals({ sharedTokens }: FrameCtx): React.ReactNode {
  const cardProps = {
    as: 'div' as const,
    display: 'block' as const,
    background: 'primary' as const,
    themeOverride: { backgroundPrimary: sharedTokens.background.containerColor },
    borderRadius: sharedTokens.borderRadius.card.lg,
    shadow: 'resting' as const,
    padding: 'medium' as const,
  }

  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <Flex direction="column" gap="large" alignItems="stretch">
        {/* Delete Classic Quiz confirm */}
        <View {...cardProps}>
          <Flex direction="column" gap="small">
            <Heading level="h2" variant="titleCardLarge" margin="0">Delete 3 Classic Quizzes?</Heading>
            <Text>These 3 Classic quizzes will be permanently deleted. The New Quizzes versions stay in place. This can't be undone.</Text>
            <Flex gap="small" justifyItems="end">
              <Button>Cancel</Button>
              <Button color="danger">Delete</Button>
            </Flex>
          </Flex>
        </View>

        {/* Report migration issue */}
        <View {...cardProps}>
          <Flex direction="column" gap="small">
            <Heading level="h2" variant="titleCardLarge" margin="0">Report a migration issue</Heading>
            <TextArea
              label="Describe what went wrong"
              placeholder="Tell us what looked off after migrating — wrong points, missing questions, broken formatting…"
              height="8rem"
            />
            <Flex gap="small" justifyItems="end">
              <Button>Cancel</Button>
              <Button color="primary">Send report</Button>
            </Flex>
          </Flex>
        </View>
      </Flex>
    </View>
  )
}
