import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { Tag } from '@instructure/ui-tag/latest'
import { Link } from '@instructure/ui-link/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { SearchInstUIIcon, FilterInstUIIcon } from '@instructure/ui-icons'
import type { FrameCtx } from '../../../components/SpecSheet'

// Search + filters. A live search box sits next to a Filter button that opens a tray with
// four single-select dropdowns — Sub-account, Term, Educator, and Content flag, each
// defaulting to "All". Selections apply immediately (no Apply button) and surface as
// dismissible tags under the search bar, with "Clear all" to reset. The tray is shown here
// as a panel; in the prototype it slides in from the right.
export function filters({ sharedTokens }: FrameCtx): React.ReactNode {
  const panel = {
    as: 'div' as const,
    display: 'block' as const,
    background: 'primary' as const,
    themeOverride: { backgroundPrimary: sharedTokens.background.containerColor },
    borderRadius: sharedTokens.borderRadius.card.lg,
    shadow: 'resting' as const,
    padding: 'medium' as const,
  }

  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <Flex direction="column" gap="medium" alignItems="stretch">
        {/* Search row + active tags */}
        <Flex gap="small" alignItems="end">
          <Flex.Item shouldGrow shouldShrink>
            <TextInput renderLabel="Search" placeholder="Type to search" renderBeforeInput={<SearchInstUIIcon inline={false} />} />
          </Flex.Item>
          <Flex.Item>
            <Button renderIcon={<FilterInstUIIcon />}>Filter (2)</Button>
          </Flex.Item>
        </Flex>
        <Flex gap="x-small" alignItems="center" wrap="wrap">
          <Tag text="Lincoln High School" dismissible onClick={() => {}} />
          <Tag text="Submissions" dismissible onClick={() => {}} />
          <Link>Clear all</Link>
        </Flex>

        {/* Filter tray contents */}
        <View {...panel} maxWidth="22rem">
          <Flex direction="column" gap="medium">
            <Heading level="h3" variant="titleCardRegular" margin="0">Filters</Heading>
            <SimpleSelect renderLabel="Sub-account" value="Lincoln High School">
              <SimpleSelect.Option id="f-sub-1" value="Lincoln High School">Lincoln High School</SimpleSelect.Option>
            </SimpleSelect>
            <SimpleSelect renderLabel="Term" value="">
              <SimpleSelect.Option id="f-term-1" value="">All</SimpleSelect.Option>
            </SimpleSelect>
            <SimpleSelect renderLabel="Educator" value="">
              <SimpleSelect.Option id="f-ed-1" value="">All</SimpleSelect.Option>
            </SimpleSelect>
            <SimpleSelect renderLabel="Content flag" value="Submissions">
              <SimpleSelect.Option id="f-flag-1" value="Submissions">Submissions</SimpleSelect.Option>
            </SimpleSelect>
          </Flex>
        </View>
      </Flex>
    </View>
  )
}
