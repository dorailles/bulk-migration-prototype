import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { MigrationRollout } from '../../bulk-migration/MigrationRollout'
import type { FrameCtx } from '../../../components/SpecSheet'

// "Migration rollout" panel — the real component. Shows where the institution stands on
// the New Quizzes feature options (On / Off), NOT a fixed sequence of steps. Options that
// are off link out to Canvas feature options. Note: the internal R0–R5 rollout ladder is
// never surfaced here — admins only see content readiness and feature on/off state.
export function rolloutTimeline({ sharedTokens }: FrameCtx): React.ReactNode {
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
            <Heading level="h3" variant="titleCardRegular" margin="0">Migration rollout</Heading>
            <Text size="contentSmall" color="secondary">
              Where your institution stands on the New Quizzes rollout. Turn options on in your feature options
              when you’re ready.
            </Text>
          </Flex>
          <View as="div" display="block" margin="small 0 0 0">
            <MigrationRollout />
          </View>
        </Flex>
      </View>
    </View>
  )
}
