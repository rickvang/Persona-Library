# Persona Library architecture

## Current boundary

The library remains a static Site. Persona content is the source of truth; the browser page is a renderer of that content.

```text
content/library-data.js
        |
        v
scripts/build-library.mjs
        |
        v
dist/data/library-data.js + dist/*.html
        |
        v
private Sites deployment
```

## Source of truth

- `content/library-data.js` owns personas, workflow maps, skill profiles, and resource trails.
- `dist/data/library-data.js` is generated output consumed by `dist/index.html`.
- `dist/index.html` owns presentation and interaction, not persona records.
- `dist/guide.html`, `dist/decisions.html`, `dist/activity-views.html`, and `dist/skill-views.html` remain documentation and exploration surfaces.

## Invariants

Run `node scripts/build-library.mjs` after changing content, then run `node scripts/validate-content.mjs` before publishing. Validation checks stable IDs, supported roles and flow tiers, complete workflow activity rows, skill-profile references, resource URLs, and stale generated output.

Counts and filters should be derived from the content module. Do not hand-edit persona totals or role totals as the library grows.

## When to expand the stack

Keep the static-first architecture while content is primarily authored in Git and the library is read-only. Add a database and authenticated authoring only when the product needs collaborative editing, comments, permissions, persistent user-created personas, or server-backed search.
