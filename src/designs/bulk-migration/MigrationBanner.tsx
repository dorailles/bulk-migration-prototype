import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Link } from '@instructure/ui-link/latest'
import { ProgressBar } from '@instructure/ui-progress/latest'
import { RocketSolidInstUIIcon } from '@instructure/ui-icons'
import { MIGRATION_DUE_DATE } from './migrationModel'
import type { BannerStats } from './migrationModel'

// The "Quiz migration process" banner: a short pitch, three headline stats (the first
// links out to the quizzes that need attention), a progress bar, and the due date.
export function MigrationBanner({
  stats,
  onViewAttention,
  onViewMigrated,
}: {
  stats: BannerStats
  onViewAttention: () => void
  onViewMigrated: () => void
}) {
  const { sharedTokens } = useComputedTheme()

  const Divider = () => (
    <View as="div" height="3rem" borderWidth="0 small 0 0" borderColor="secondary" />
  )

  return (
    <View
      as="div"
      display="block"
      padding="medium"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.lg}
      borderWidth="small"
      borderColor="primary"
    >
      <Flex direction="column" gap="medium">
        <Flex gap="large" alignItems="center" justifyItems="space-between" wrap="wrap">
          <Flex.Item shouldGrow shouldShrink size="22rem">
            <Flex direction="column" gap="x-small">
              <Flex gap="small" alignItems="center">
                <Text color="brand"><RocketSolidInstUIIcon /></Text>
                <Heading level="h2" variant="titleCardRegular" margin="0">Quiz migration process</Heading>
              </Flex>
              <Text color="secondary" size="contentSmall">
                Canvas is moving to New Quizzes. Please migrate your quizzes and make sure everything works
                as expected.
              </Text>
            </Flex>
          </Flex.Item>

          <Flex gap="medium" alignItems="center" justifyItems="end">
            <Flex direction="column" alignItems="center" gap="xxx-small">
              <Text size="x-large" weight="bold" lineHeight="fit">{stats.quizzesRequireMigration}</Text>
              <Text size="contentSmall" color="secondary">Quizzes require migration</Text>
            </Flex>
            <Divider />
            <Flex direction="column" alignItems="center" gap="xxx-small">
              <Text size="x-large" weight="bold" color="brand" lineHeight="fit">{stats.quizzesRequireAttention}</Text>
              <Link onClick={onViewAttention}>Quizzes with content flags</Link>
            </Flex>
            <Divider />
            <Flex direction="column" alignItems="center" gap="xxx-small">
              <Text size="x-large" weight="bold" color="brand" lineHeight="fit">{stats.quizzesMigrated}</Text>
              <Link onClick={onViewMigrated}>Quizzes migrated</Link>
            </Flex>
          </Flex>
        </Flex>

        <ProgressBar
          size="x-small"
          screenReaderLabel="Overall migration progress"
          valueNow={stats.progressPct}
          valueMax={100}
          renderValue={() => <Text size="legend">{stats.progressPct}%</Text>}
        />

        <Text size="legend" color="secondary">Due date: {MIGRATION_DUE_DATE}</Text>
      </Flex>
    </View>
  )
}
