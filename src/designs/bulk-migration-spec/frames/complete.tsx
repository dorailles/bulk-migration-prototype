import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Alert } from '@instructure/ui-alerts/latest'
import { ComparisonTable } from '../../bulk-migration/ComparisonTable'
import { allMigratedQuizzes, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// Migration complete. A success summary, then the real before/after comparison table:
// each migrated quiz as its Classic and New Quizzes versions (titles open the respective
// builders), selectable rows, and a "Replace original" action — single or bulk, always
// confirmed. Rows with no Classic original can't be selected. The toolbar also offers
// "Report migration issue" and an Export to PDF.
export function complete({ sharedTokens }: FrameCtx): React.ReactNode {
  const quizzes = allMigratedQuizzes(COURSES).slice(0, 5)
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="stretch">
        <Heading level="h1" variant="titlePageDesktop" margin="0">Migration complete</Heading>
        <Alert variant="success" margin="0" hasShadow={false}>
          Migrated 18 quizzes across 3 courses to New Quizzes.
        </Alert>
        <View
          as="div"
          display="block"
          padding="medium"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderRadius={sharedTokens.borderRadius.card.lg}
          shadow="resting"
        >
          <Flex direction="column" gap="small">
            <Heading level="h3" variant="titleCardRegular" margin="0">Compare and confirm</Heading>
            <Text color="secondary">You can use this list to compare the newly created quizzes to their Classic version.</Text>
            <ComparisonTable quizzes={quizzes} />
          </Flex>
        </View>
      </Flex>
    </View>
  )
}
