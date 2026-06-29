import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { MigrationBanner } from '../../bulk-migration/MigrationBanner'
import { bannerStats, COURSES } from '../../bulk-migration/migrationModel'
import type { FrameCtx } from '../../../components/SpecSheet'

// The dashboard banner — the real component, fed live district stats. Three headline
// numbers; the last two are links (to the content-flags list and the migrated archive).
// A progress bar shows the share of the quiz population already on New Quizzes, with the
// district due date below.
export function dashboardBanner({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="large"
    >
      <MigrationBanner stats={bannerStats(COURSES)} onViewAttention={() => {}} onViewMigrated={() => {}} />
    </View>
  )
}
