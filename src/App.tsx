import { useState } from 'react'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { light, dark } from '@instructure/ui-themes'
import BulkMigration from './designs/bulk-migration'

// Single-prototype app: render Bulk Migration directly under the InstUI theme provider,
// with a light/dark toggle wired to the prototype's theme button.
export default function App() {
  const [isDark, setIsDark] = useState(false)
  return (
    <InstUISettingsProvider theme={isDark ? dark : light}>
      <BulkMigration isDark={isDark} onToggleTheme={() => setIsDark((v) => !v)} />
    </InstUISettingsProvider>
  )
}
