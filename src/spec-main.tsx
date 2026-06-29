import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { light } from '@instructure/ui-themes'
import './index.css'
import BulkMigrationSpec from './designs/bulk-migration-spec'

// Standalone spec page: render the Bulk Migration visual spec on its own URL (spec.html),
// separate from the prototype (index.html). The spec ignores the prototype props, so the
// values here are placeholders to satisfy the shared contract.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InstUISettingsProvider theme={light}>
      <div style={{ minHeight: '100vh', padding: '24px' }}>
        <BulkMigrationSpec isDark={false} onToggleTheme={() => {}} />
      </div>
    </InstUISettingsProvider>
  </StrictMode>,
)
