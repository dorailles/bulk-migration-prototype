import { Tray } from '@instructure/ui-tray/latest'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { Menu } from '@instructure/ui-menu/latest'
import { ChevronDownInstUIIcon } from '@instructure/ui-icons'
import { ISSUE_LABELS } from './migrationModel'
import type { IssueKey } from './migrationModel'

// One multi-select dropdown. Selections apply live (no Apply/Done) — the menu stays open
// while toggling, and the trigger summarizes the current selection.
function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: Set<string>
  onChange: (values: string[]) => void
}) {
  const count = selected.size
  const summary = count === 0 ? `All ${label.toLowerCase()}` : `${count} selected`
  return (
    <Flex direction="column" gap="xxx-small">
      <Text weight="bold" size="contentSmall">{label}</Text>
      <Menu
        placement="bottom stretch"
        shouldHideOnSelect={false}
        trigger={
          <Button display="block" textAlign="start">
            {summary} <ChevronDownInstUIIcon />
          </Button>
        }
      >
        <Menu.Group
          label={label}
          allowMultiple
          selected={[...selected]}
          onSelect={(_e, updated) => onChange(updated as string[])}
        >
          {options.map((o) => (
            <Menu.Item key={o.value} value={o.value}>{o.label}</Menu.Item>
          ))}
        </Menu.Group>
      </Menu>
    </Flex>
  )
}

// Filters tray for the courses table: educators, content flags, and terms — each a
// multi-select dropdown. Selections apply automatically and surface as tags under the
// search bar; there's no Apply/Done. (Term filter requested in interview 1.)
export function CourseFilterTray({
  open,
  onClose,
  educators,
  terms,
  selectedEducators,
  selectedFlags,
  selectedTerms,
  onEducatorsChange,
  onFlagsChange,
  onTermsChange,
}: {
  open: boolean
  onClose: () => void
  educators: string[]
  terms: string[]
  selectedEducators: Set<string>
  selectedFlags: Set<IssueKey>
  selectedTerms: Set<string>
  onEducatorsChange: (values: string[]) => void
  onFlagsChange: (values: IssueKey[]) => void
  onTermsChange: (values: string[]) => void
}) {
  const flagOptions = (Object.keys(ISSUE_LABELS) as IssueKey[]).map((k) => ({ value: k, label: ISSUE_LABELS[k] }))

  return (
    <Tray label="Filters" open={open} onDismiss={onClose} placement="end" size="small">
      <View as="div" padding="medium" display="block">
        <Flex direction="column" gap="large">
          <Flex justifyItems="space-between" alignItems="center">
            <Heading level="h2" variant="titleCardLarge" margin="0">Filters</Heading>
            <CloseButton onClick={onClose} screenReaderLabel="Close filters" />
          </Flex>

          <FilterDropdown
            label="Educators"
            options={educators.map((n) => ({ value: n, label: n }))}
            selected={selectedEducators}
            onChange={onEducatorsChange}
          />
          <FilterDropdown
            label="Content flags"
            options={flagOptions}
            selected={selectedFlags as Set<string>}
            onChange={(v) => onFlagsChange(v as IssueKey[])}
          />
          <FilterDropdown
            label="Terms"
            options={terms.map((t) => ({ value: t, label: t }))}
            selected={selectedTerms}
            onChange={onTermsChange}
          />
        </Flex>
      </View>
    </Tray>
  )
}
