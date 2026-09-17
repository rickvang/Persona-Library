# Vercel generated-library publication Work Order

## Header

- Work Order ID: WO-2026-09-16-vercel-library-build
- Title: Build generated library data during Vercel deploy
- Status: active
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
- `vercel.json` only tells the existing Vercel deployment to run that canonical generator and serve `dist`.
- Canonical Template starter files remain in `rickvang/template-library`; no starter files are copied into Persona-Library.
- Generated files are not hand-edited.
- PR #123 is out of scope.

## Evidence before change

- `template-cover-letter-evidence-led` is present in `content/library-data/catalogs.js` on `main`.
- Production `data/library-data.js` does not contain that Template.
- Production `templates.html` loads `data/library-data.js` to render the catalog.
- Vercel production build for `main` commit `94384a7` ran only `vercel build`; repository build logs showed no `node scripts/build-library.mjs` execution.
- Repository guidance requires generated output freshness via `node scripts/build-library.mjs` and prohibits hand-editing generated files.

## Change

Add root `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "node scripts/build-library.mjs",
  "outputDirectory": "dist"
}
```

## Validation gates

- [ ] Vercel preview build is READY.
- [ ] Preview build logs show `node scripts/build-library.mjs` running successfully.
- [ ] Preview `data/library-data.js` contains `template-cover-letter-evidence-led`.
- [ ] Preview Templates page is reachable and derives its catalog from the refreshed data.
- [ ] No generated `dist` file is committed by hand for this change.
- [ ] Compare branch to current `main` confirms only deployment configuration and this Work Order are changed.

## Completion

After validation, merge the publication fix under the requester’s explicit instruction to merge and add the Template to the catalog, then verify the production Site contains the Template record.