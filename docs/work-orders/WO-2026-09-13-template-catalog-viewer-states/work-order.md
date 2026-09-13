# Template catalog and viewer evidence states Work Order

- Work Order ID: WO-2026-09-13-template-catalog-viewer-states
- Title: Make Template catalog and viewer evidence states explicit
- Status: complete
- Created: 2026-09-13
- Last updated: 2026-09-13
- Requester: repository user
- Current owner: Codex
- Request mode: update
- GitHub issue: [#68 — Make Template catalog and viewer evidence states explicit](https://github.com/rickvang/Persona-Library/issues/68)
- Artifact home: `docs/work-orders/WO-2026-09-13-template-catalog-viewer-states/`

## Goal

Make the Templates catalog and focused viewer answer whether a Template fits the task, what source evidence supports it, and whether the viewer is showing the external artifact or a local illustrative concept.

## Scope

- Extend the normalized Template model with lifecycle, source-path evidence, runtime-access, and viewer-representation states.
- Add revision-pinned source links and human-readable state labels.
- Refine `dist/templates.html` as a starting-point finder.
- Refine `dist/template.html` as a focused decision record while preserving existing illustrative compositions.
- Update stale Template guidance in `dist/guide.html` and any directly affected Docs.
- Validate generated data, page scripts, responsive/accessibility states, and the Template boundary.

## Authorization and boundary

The repository user explicitly authorized implementation of GitHub issue #68. This Work Order covers the local Persona-Library repository and its generated Site output. It does not authorize fetching, cloning, executing, rendering, changing, or publishing external Template artifacts, nor promoting candidate Templates.

The existing Templates placement review remains authoritative: Persona-Library owns Template identity, applicability, relationships, provenance, evidence, and lifecycle context; the reusable artifact remains in its declared source.

## Selected guidance

- Template catalog and viewer records and generated Site surfaces.
- Riley Morgan’s AI orchestrator perspective: use the simplest workflow and make boundaries, evidence, handoffs, and recovery visible.
- Template reconciliation followed by one universal change-impact reconciliation pass after implementation.

## Acceptance criteria

- Catalog cards expose fit, source state, viewer state, and a clear inspection action before expanded metadata.
- Viewer separates lifecycle, source verification, runtime access, and local illustrative content.
- Verified source links resolve to recorded revisions and paths.
- Planned, unknown, empty, missing-query, and not-found states remain recoverable and accessible.
- Existing Template identities, relationships, and external ownership remain intact.
- Content validation, JavaScript syntax checks, focused browser smoke checks, responsive/accessibility checks, and `git diff --check` pass.

## Implementation completed

- Added explicit lifecycle, source revision, runtime access, and viewer representation metadata to all four Template records.
- Added normalized human-readable state objects to the canonical Template catalog model.
- Refined the catalog with fit-first cards, source/lifecycle/viewer filters, catalog counts, revision-pinned source links, and a clear `Inspect Template →` action.
- Refined the focused viewer with a four-signal decision panel and a data-driven `previewRenderers` registry while preserving the existing local illustrative compositions.
- Updated Template guidance in the Site Docs and architecture contract.
- Refreshed generated data and expanded validator coverage for the new metadata and page contracts.

## Validation

- `node scripts/build-library.mjs` passed.
- `node scripts/validate-content.mjs@@ passed: 20 Personas, 2 Operators, 2 Leaders, 16 Specialists, and 20 workflow maps.
- Inline JavaScript in `dist/templates.html` and `dist/template.html` parsed with `new Function`.
- Loopback browser smoke checks passed for source-state filtering, planned-record recovery, missing-query recovery, illustrative preview rendering, four decision states, pinned revision links, and console warnings.
- `git diff --check` passed.

## Current phase and next action

Phase: complete.

Next action: repository owner reviews the working-tree diff and commits or merges it through the normal repository review path.
