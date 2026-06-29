import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { ProgressBar } from '@instructure/ui-progress/latest'
import { Spinner } from '@instructure/ui-spinner/latest'
import type { FrameCtx } from '../../../components/SpecSheet'

// Scan step. Before the migrate sheet opens, the tool scans the selected courses' quizzes
// to sort them into clean, with-submissions, and review groups. A short progress pass —
// the prototype runs it on a timer, then opens the migrate sheet.
export function scan({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="center" padding="large 0">
        <Spinner renderTitle="Scanning quizzes" size="medium" />
        <Heading level="h2" variant="titleSection" margin="0">Scanning quizzes…</Heading>
        <Text color="secondary">Checking 38 quizzes for content that needs a closer look.</Text>
        <View as="div" display="block" width="80%">
          <ProgressBar
            size="small"
            screenReaderLabel="Scan progress"
            valueNow={64}
            valueMax={100}
            renderValue={() => <Text size="legend">64%</Text>}
          />
        </View>
      </Flex>
    </View>
  )
}
