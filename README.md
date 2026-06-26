# Bulk Migration prototype — Classic Quizzes to New Quizzes

An InstUI React prototype of the admin tool for migrating a district's Classic Quizzes to
New Quizzes (Analytics Hub → Quiz Migration). Standalone single-prototype app, carved out
of the InstUI sandbox.

## Run locally

```
npm install
npm run dev
```

Open the URL Vite prints (e.g. http://localhost:5173).

## Build

```
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app with the
correct base path and publishes it to the `gh-pages` branch (with a 404 SPA fallback). In
the repo, set **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root**. The
site is then live at `https://<owner>.github.io/<repo>/`.

## Structure

- `src/App.tsx` — renders the prototype under the InstUI theme provider with a light/dark toggle.
- `src/designs/bulk-migration/` — the prototype: dashboard, migrate flow, comparison, archive, filters.
- `src/designs/bulk-migration/migrationModel.ts` — the data model and helpers.
