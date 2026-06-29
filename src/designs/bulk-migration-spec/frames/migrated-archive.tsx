import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { ComparisonTable } from '../../bulk-migration/ComparisonTable'
import { allMigratedQuizzes, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// Migrated quizzes archive (fullscreen modal), reached from the "Quizzes migrated" banner
// stat. The same comparison table as the completion screen, plus a Migrated date column
// unique to this view, so admins can revisit and replace originals at any time — not only
// right after a migration run.
export function migratedArchive({ sharedTokens }: FrameCtx): React.ReactNode {
  const quizzes = allMigratedQuizzes(COURSES).slice(0, 8)
  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="large"
    >
      <Flex direction="column" gap="small" alignItems="stretch">
        <Heading level="h2" variant="titleCardLarge" margin="0">Migrated quizzes</Heading>
        <Text color="secondary">
          Every quiz already migrated to New Quizzes. Open each version to compare the Classic and New Quizzes
          in the builder, then replace the original Classic quiz once you're confident.
        </Text>
        <ComparisonTable quizzes={quizzes} showDate />
      </Flex>
    </View>
  )
}
