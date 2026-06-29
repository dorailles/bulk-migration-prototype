import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { DonutChart } from '../../bulk-migration/DonutChart'
import { quizSources, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// "How Quizzes were created" panel — the real donut. Provenance (created from scratch,
// course copy, blueprint sync, bulk migration, other imports) is a district-level
// aggregate scaled to the live quiz population, so the center total matches the data
// behind the banner and the New : Classic ratio.
export function creationDonut({ sharedTokens }: FrameCtx): React.ReactNode {
  const sources = quizSources(COURSES)
  const total = sources.reduce((s, x) => s + x.count, 0)
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
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
          <Flex direction="column" gap="xxx-small">
            <Heading level="h3" variant="titleCardRegular" margin="0">How Quizzes were created</Heading>
            <Text size="contentSmall" color="secondary">Origin of all {total} quizzes across active courses.</Text>
          </Flex>
          <View as="div" display="block" margin="small 0 0 0">
            <DonutChart segments={sources} centerLabel={String(total)} centerSub="quizzes" />
          </View>
        </Flex>
      </View>
    </View>
  )
}
