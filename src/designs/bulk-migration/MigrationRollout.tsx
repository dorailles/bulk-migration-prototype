import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { Link } from '@instructure/ui-link/latest'
import { ArrowRightInstUIIcon } from '@instructure/ui-icons'

// The district's New Quizzes rollout, shown as the feature options an admin can turn on —
// NOT a fixed sequence of steps. Each row shows where the institution currently stands
// (On / Off); options that are off link out to Canvas feature options to enable them.
// (Validated in interview 1: admins know these options exist but not where their
// institution stands, and they want a way to jump to feature options from here.)

type Feature = { key: string; name: string; desc: string; enabled: boolean }

const FEATURES: Feature[] = [
  { key: 'available', name: 'New Quizzes available', desc: 'Educators can build and assign New Quizzes.', enabled: true },
  { key: 'shown', name: 'Migration shown at course copy', desc: 'Course copy offers to migrate Classic Quizzes to New Quizzes.', enabled: true },
  { key: 'prechecked', name: 'Migration pre-checked at copy', desc: 'That migration option is selected by default during course copy.', enabled: false },
  { key: 'default', name: 'New Quizzes is the default', desc: 'New assessments default to New Quizzes.', enabled: false },
]

export function MigrationRollout({ onManage = () => {} }: { onManage?: () => void }) {
  return (
    <Flex direction="column" gap="small">
      {FEATURES.map((f) => (
        <Flex key={f.key} justifyItems="space-between" alignItems="start" gap="medium">
          <Flex.Item shouldGrow shouldShrink>
            <Text weight="bold" as="div">{f.name}</Text>
            <Text size="contentSmall" color="secondary" as="div" lineHeight="condensed">{f.desc}</Text>
          </Flex.Item>
          <Flex.Item shouldShrink={false}>
            {f.enabled ? <Pill color="success">On</Pill> : <Text color="secondary">Off</Text>}
          </Flex.Item>
        </Flex>
      ))}

      <Flex.Item margin="x-small 0 0 0">
        <Link onClick={onManage} renderIcon={<ArrowRightInstUIIcon />} iconPlacement="end">
          Manage in feature options
        </Link>
      </Flex.Item>
    </Flex>
  )
}
