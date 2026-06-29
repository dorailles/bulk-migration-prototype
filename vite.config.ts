import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Standalone two-page app. base is set to the repo path at build time by the GitHub Pages
// workflow (BASE_URL=/<repo>/); defaults to '/' for local dev.
//   - index.html → the Bulk Migration prototype
//   - spec.html  → the Bulk Migration visual spec
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || '/',
  // Globals the SpecSheet source-handoff button reads. Point at this repo; an empty SHA
  // makes the button fall back to a "no remote configured" note rather than a dead link.
  define: {
    __SANDBOX_REPO__: JSON.stringify('dorailles/bulk-migration-prototype'),
    __SANDBOX_SHA__: JSON.stringify(''),
    __SANDBOX_DIRTY__: JSON.stringify(false),
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        spec: resolve(__dirname, 'spec.html'),
      },
    },
  },
})
