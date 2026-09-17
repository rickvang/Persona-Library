# Vercel generated-library publication Work Order

## Header

- Work Order ID: WO-2026-09-16-vercel-library-build
- Title: Build generated library data during Vercel deploy
- Status: review-ready
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository owner
- Current owner: Persona-Library deployment/publication maintenance
- Request mode: update
- Primary space: Templates / generated Site publication
- Issue: #129
- Artifact home: `docs/work-orders/WO-2026-09-16-vercel-library-build/`
- Explicit authorization and target: complete the requested Template catalog publication after PR #128 by making authored catalog changes regenerate into the deployed Site
- Stopping condition: preview proves the canonical build runs and the Evidence-Led Cover Letter is visible from generated Site data; merge under the requester’s current instruction to merge and add it to the catalog

## Placement and boundary

Mara placement result: this is an existing deployment/publication contract extension, not a new Template concept, registry, runtime, or artifact type.

- `content/library-data/catalogs.js` remains the authored Template catalog source.
- `scripts/build-library.mjs` remains the canonical generator for `dist/data/library-data.js` and other Site mirrors.
- Vercel is already configured with `dist` as the project root, so `vercel.json` invokes the generator from the repository parent and publishes the current project root.
- Canonical Template starter files remain in `rickvang/template-library`; no starter files are copied into Persona-Library.
- Generated files are not hand-edited.
- PR #123 is out of scope.

## Evidence before change

- `template-cover-letter-evidence-led` is present in `content/library-data/catalogs.js` on `main`.
- Production `data/library-data.js` did not contain that Template before this fix.
- Production `templates.html` loads `data/library-data.js` to render the catalog.
- Vercel production build for `main` commit `94384a7` ran only `vercel build`; repository build logs showed no `node scripts/build-library.mjs` execution.
- Repository guidance requires generated output freshness via `node scripts/build-library.mjs` and prohibits hand-editing generated files.

## Change

Add root `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "node ../scripts/build-library.mjs",
  "outputDirectory": "."
}
```

The first preview exposed the existing Vercel `dist` root because `node scripts/build-library.mjs` resolved under `dist`; the command was corrected to `node ../scripts/build-library.mjs`.

## Validation gates

- [x] Vercel preview build is READY.
- [x] Preview build logs show the canonical generator running successfully and building 15 authored library data sources into `dist/data/library-data.js`.
- [x] Preview `data/library-data.js` returns HTTP 200 and contains `template-cover-letter-evidence-led` with the Evidence-Led Cover Letter catalog record.
- [x] The same generated preview data also contains `template-job-application-notes`.
- [x] No generated `dist` file is committed by hand for this change.
- [x] Compare against the base showed only deployment configuration and this Work Order before validation recording.
- [ ] Direct preview-page browser verification is blocked by Vercel preview protection; the page’s generated data dependency is verified instead. Production verification follows merge.

## Completion

PR #130 is mergeable and the Vercel status is successful. Merge under the requester’s explicit instruction to merge and add the Template to the catalog, then verify the production generated data contains the Template record.