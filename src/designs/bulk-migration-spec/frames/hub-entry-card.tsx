import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { RocketSolidInstUIIcon } from '@instructure/ui-icons'
import type { FrameCtx } from '../../../components/SpecSheet'

// Entry point. The migration tool lives as one active card on the district Analytics Hub.
// Only this card is wired up; the rest of the hub grid mirrors Figma. Clicking it opens
// the Quiz Migration dashboard.
export function hubEntryCard({ sharedTokens }: FrameCtx): React.ReactNode {
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
        width="100%"
        textAlign="start"
        padding="medium"
        background="primary"
        themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
        borderRadius={sharedTokens.borderRadius.card.lg}
        shadow="resting"
        borderWidth="medium"
        borderColor="brand"
      >
        <Flex gap="small" alignItems="start">
          <View as="div" margin="xxx-small 0 0 0">
            <Text color="brand"><RocketSolidInstUIIcon /></Text>
          </View>
          <Flex.Item shouldGrow shouldShrink>
            <Flex gap="x-small" alignItems="center" wrap="wrap">
              <Heading level="h3" variant="titleCardRegular" margin="0">Quiz Migration Progress</Heading>
              <Pill color="info">Active</Pill>
            </Flex>
            <View as="div" display="block" margin="xx-small 0 0 0">
              <Text as="div" size="content" color="secondary">
                Track and migrate Classic Quizzes to New Quizzes.
              </Text>
            </View>
          </Flex.Item>
        </Flex>
      </View>
    </View>
  )
}
