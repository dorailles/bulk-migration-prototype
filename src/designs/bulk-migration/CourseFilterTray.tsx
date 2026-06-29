import { Tray } from '@instructure/ui-tray/latest'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { CloseButton } from '@instructure/ui-buttons/latest'
import { ISSUE_LABELS } from './migrationModel'
import type { IssueKey } from './migrationModel'

// Filters tray for the courses table: Sub-account, Term, Educator, and Content flag — each
// a single "All"-default dropdown. Selections apply live and surface as tags under the
// search bar.
export function CourseFilterTray({
  open,
  onClose,
  educators,
  terms,
  subAccounts,
  term,
  educator,
  flag,
  subAccount,
  onTermChange,
  onEducatorChange,
  onFlagChange,
  onSubAccountChange,
}: {
  open: boolean
  onClose: () => void
  educators: string[]
  terms: string[]
  subAccounts: string[]
  term: string
  educator: string
  flag: string
  subAccount: string
  onTermChange: (value: string) => void
  onEducatorChange: (value: string) => void
  onFlagChange: (value: string) => void
  onSubAccountChange: (value: string) => void
}) {
  const flagKeys = Object.keys(ISSUE_LABELS) as IssueKey[]

  return (
    <Tray label="Filters" open={open} onDismiss={onClose} placement="end" size="small">
      <View as="div" padding="medium" display="block">
        <Flex direction="column" gap="medium">
          <Flex justifyItems="end" alignItems="center">
            <CloseButton onClick={onClose} screenReaderLabel="Close filters" />
          </Flex>

          <SimpleSelect renderLabel="Sub-account" value={subAccount} onChange={(_e, { value }) => onSubAccountChange(String(value))}>
            <SimpleSelect.Option id="sub-all" value="">All</SimpleSelect.Option>
            {subAccounts.map((s) => (
              <SimpleSelect.Option key={s} id={`sub-${s}`} value={s}>{s}</SimpleSelect.Option>
            ))}
          </SimpleSelect>

          <SimpleSelect renderLabel="Term" value={term} onChange={(_e, { value }) => onTermChange(String(value))}>
            <SimpleSelect.Option id="term-all" value="">All</SimpleSelect.Option>
            {terms.map((t) => (
              <SimpleSelect.Option key={t} id={`term-${t}`} value={t}>{t}</SimpleSelect.Option>
            ))}
          </SimpleSelect>

          <SimpleSelect renderLabel="Educator" value={educator} onChange={(_e, { value }) => onEducatorChange(String(value))}>
            <SimpleSelect.Option id="ed-all" value="">All</SimpleSelect.Option>
            {educators.map((name) => (
              <SimpleSelect.Option key={name} id={`ed-${name}`} value={name}>{name}</SimpleSelect.Option>
            ))}
          </SimpleSelect>

          <SimpleSelect renderLabel="Content flag" value={flag} onChange={(_e, { value }) => onFlagChange(String(value))}>
            <SimpleSelect.Option id="flag-all" value="">All</SimpleSelect.Option>
            {flagKeys.map((k) => (
              <SimpleSelect.Option key={k} id={`flag-${k}`} value={k}>{ISSUE_LABELS[k]}</SimpleSelect.Option>
            ))}
          </SimpleSelect>
        </Flex>
      </View>
    </Tray>
  )
}
