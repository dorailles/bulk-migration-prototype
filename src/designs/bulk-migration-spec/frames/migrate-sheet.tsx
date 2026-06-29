import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import type { FrameCtx } from '../../../components/SpecSheet'

// The migrate sheet (fullscreen modal body). Quizzes from the selected course(s) are
// grouped by how cleanly they migrate. All three groups always show, even when empty.
// Migration preferences live inside "Fully supported" because they only affect those
// quizzes — the others always keep their original and get a clean New Quizzes copy.
const GROUPS: { title: string; count: number; note?: string; quizzes: string[] }[] = [
  {
    title: 'Fully supported',
    count: 6,
    quizzes: ['Color Theory · Studio Art', 'Composition Basics · Studio Art', 'Art History · Studio Art'],
  },
  {
    title: 'With submissions',
    count: 4,
    note: "For these quizzes we'll keep a copy of the original quiz. Existing submission data will be available through this original quiz.",
    quizzes: ['Figure Drawing · Studio Art', 'Studio Critique · Studio Art'],
  },
  {
    title: 'Review needed',
    count: 2,
    note: 'These quizzes contain rich content. You can review the migrated quizzes to ensure all content has been converted successfully.',
    quizzes: ['Perspective Drawing · Studio Art', 'Light & Shadow · Studio Art'],
  },
]

export function migrateSheet({ sharedTokens }: FrameCtx): React.ReactNode {
  const sectionBg = {
    as: 'div' as const,
    display: 'block' as const,
    background: 'secondary' as const,
    themeOverride: { backgroundSecondary: sharedTokens.background.pageColor },
    borderRadius: sharedTokens.borderRadius.card.md,
    padding: 'small' as const,
  }

  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="stretch">
        <Heading level="h2" variant="titleCardLarge" margin="0">Migrate to New Quizzes</Heading>

        {GROUPS.map((g, gi) => (
          <React.Fragment key={g.title}>
            {gi > 0 ? <View as="div" display="block" borderWidth="small 0 0 0" borderColor="secondary" /> : null}
            <View as="div" display="block">
              <Text weight="bold">{g.title} ({g.count})</Text>
              <View as="div" display="block" padding="x-small 0 0 0">
                {/* Preferences live in the first group */}
                {gi === 0 ? (
                  <View {...sectionBg} margin="0 0 small 0">
                    <Checkbox variant="toggle" size="small" label="Keep a copy of the original Classic Quiz" onChange={() => {}} />
                  </View>
                ) : null}
                {g.note ? (
                  <View as="div" display="block" margin="0 0 small 0">
                    <Text size="contentSmall" color="secondary">{g.note}</Text>
                  </View>
                ) : null}
                <Flex direction="column" gap="x-small">
                  {g.quizzes.map((q) => (
                    <Flex key={q} gap="small" alignItems="center">
                      <Flex.Item size="1.5rem" shouldShrink={false}>
                        <Checkbox label={<ScreenReaderContent>Select {q}</ScreenReaderContent>} checked onChange={() => {}} />
                      </Flex.Item>
                      <Flex.Item shouldGrow shouldShrink>
                        <Text weight="bold" as="div">{q.split(' · ')[0]}</Text>
                        <Text size="contentSmall" color="secondary" as="div" lineHeight="condensed">{q.split(' · ')[1]} · 14 Questions</Text>
                      </Flex.Item>
                    </Flex>
                  ))}
                </Flex>
              </View>
            </View>
          </React.Fragment>
        ))}

        <Flex gap="small" justifyItems="end">
          <Button>Cancel</Button>
          <Button color="primary">Migrate selected</Button>
        </Flex>
      </Flex>
    </View>
  )
}
