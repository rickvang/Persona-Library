# Template viewer Work Order

- Work Order ID: WO-2026-09-11-template-viewer
- Title: Add a focused viewer for cataloged Templates
- Status: ready-for-review
- Created: 2026-09-11
- Last updated: 2026-09-11
- Requester: repository user
- Current owner: Codex
- Request mode: update
- GitHub issue: to be created for this implementation
- Artifact home: `docs/work-orders/WO-2026-09-11-template-viewer/`

## Goal

Give a person a focused, shareable way to inspect one cataloged Template without making the catalog card carry every detail or implying that an unverified external artifact is available to render.

## Scope

- Add `dist/template.html` as the focused Template viewer.
- Link each cataloged Template from `dist/templates.html` into the viewer with a stable `?template=<id>` URL.
- Show purpose, applicability, provided structure, source and availability, revision, known relationships, and a visible artifact-preview state.
- Support a missing or unknown Template ID with a recoverable catalog link.
- Preserve the existing library source boundary: the viewer does not fetch, execute, or render external Template artifacts.

## Placement and boundary review

This is an extension of the existing Templates space and its generated Site output. No new canonical Template record, space, Skill, Tool, Playbook, or external artifact is created. The viewer owns presentation of the normalized `templateCatalog` record; the catalog remains the source of Template identity and relationships.

## Success criteria

- A catalog card exposes an obvious `Open viewer` action.
- A direct viewer URL opens the selected Template and preserves its identity in the page title, heading, and URL.
- A planned Template clearly communicates that no verified artifact preview is available and provides the source evidence and repository link.
- Empty, unknown, and long-content states remain usable at narrow widths and with keyboard navigation.
- Existing catalog search, filters, expandable details, and unrelated working-tree changes remain intact.

## Evidence and assumptions

- observed: `dist/templates.html` is the live Templates catalog and reads `window.PersonaLibraryData.templateCatalog`.
- observed: all three current Template seeds have `source.availability: planned`, `path: null`, and `entrypoint: null`.
- assumption: a focused metadata viewer is the useful first capability while the external Template artifacts remain unverified.
- unknown: whether a later source revision will provide a renderable artifact entrypoint; the viewer must remain honest when that changes.

## Validation plan

- Run `node scripts/validate-content.mjs`.
- Run `node --check` against the inline viewer/catalog scripts through temporary extracted scripts or a browser smoke check.
- Check `git diff --check`.
- Exercise catalog link, direct selection, unknown selection, source link, and responsive layout in a local browser when available.

## Current phase and next action

Phase: implementation, validation, and reconciliation complete. Next action: repository owner reviews the viewer and submits the prepared GitHub issue for implementation tracking.
