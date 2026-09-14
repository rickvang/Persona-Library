# Multi-Persona Collaboration Playbook catalog identity Work Order

- Work Order ID: WO-2026-09-14-multi-persona-collaboration-playbook-catalog
- Title: Catalog Multi-Persona Collaboration as a canonical Playbook identity
- Status: ready for review
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: repository user
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#71 — Catalog Multi-Persona Collaboration as a canonical Playbook](https://github.com/rickvang/Persona-Library/issues/71)
- GitHub pull request: [#91 — Catalog Multi-Persona Collaboration as a canonical Playbook](https://github.com/rickvang/Persona-Library/pull/91)
- Artifact home: `docs/work-orders/WO-2026-09-14-multi-persona-collaboration-playbook-catalog/`
- Concrete deliverable: `content/library-data.js` `playbookCatalog` entry `playbook-multi-persona-collaboration`
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

Give the already-implemented Multi-Persona Collaboration Playbook the same first-class canonical `playbookCatalog` identity treatment as the other cataloged Playbooks, without duplicating its stages, gates, or `problem-context` contract.

## Scope

- Add `{id:'playbook-multi-persona-collaboration', name:'Multi-Persona Collaboration', status:'Working model'}` to `content/library-data.js` `playbookCatalog`.
- Add a catalog card and a condensed detail overview for the identity on the Site Playbooks page, referencing (not copying) `docs/collaboration/multi-persona-collaboration-playbook.md`.
- Add one Docs (`guide.html`) example callout, matching the existing per-Playbook pattern.
- Append a Correction to Decision DEC-010, which explicitly named "#71 catalogs collaboration identity" as a revisit condition.
- Rebuild generated `dist/data/**` and run repository validation.

## Non-goals and constraints

- Do not rewrite `docs/collaboration/multi-persona-collaboration-playbook.md`, `problem-context.md`, or its schema.
- Do not duplicate the full stage table, solution-quality gate text, or `problem-context` fields into `playbookCatalog` or elsewhere.
- Do not change the existing `multi-persona-collaboration` orientation route; the catalog id links to it by the same naming convention already used for `playbook-bounded-parallel-implementation` → `bounded-parallel-implementation`.
- Do not create a new Skill, Persona, Tool, runtime, or a second orchestration framework.
- Do not start a live #82 bounded-parallel proof or update `tool-repo` pins; unrelated to this change.
- Do not reopen or edit the historical scope of issue #22.

## Authorization and boundary

The requester authorized implementation of issue #71 as a new PR against current `origin/main`, explicitly not to be merged from this run. Authorized mutation targets are this repository's Playbook catalog identity, Site Playbooks/Docs/Decisions surfaces, generated `dist/data/**`, and this Work Order.

## Mara placement and boundary review

- Canonical identity: `content/library-data.js` `playbookCatalog` — the same array that already holds the other two Playbook identities; no new array or schema field needed.
- Route linkage: existing `content/orientation/playbooks.json` route `multi-persona-collaboration` — unchanged; the `playbook-` prefix convention already links catalog id to route id for `playbook-bounded-parallel-implementation`.
- Site presentation: authored `dist/playbooks.html` (new catalog card + `#collaboration` detail section) and `dist/guide.html` (one example callout), following the exact structure used for the other three Playbooks.
- Durable rationale: append-only Correction on existing `dist/decisions.html` DEC-010, which already names this as a revisit condition; no new Decision record required.
- Run evidence: this Work Order.

Rejected alternatives:

- Adding a new orientation route: rejected because `multi-persona-collaboration` already exists and is intact; issue #71 explicitly requires it to remain so.
- Adding a `catalog_id` cross-reference field to the orientation schema: rejected as inventing a field solely for symmetry; no other Playbook route uses one, and the naming convention already resolves the identity to the route.
- Rewriting or restructuring `docs/collaboration/*`: rejected; the issue requires reuse, not a rewrite, and no defect was found.

## Current phase and gate

Phase: reviewable PR [#91](https://github.com/rickvang/Persona-Library/pull/91) against `origin/main`. Gate: repository validation must pass; PR stays open (not merged) per explicit instruction.

## Success criteria and stopping condition

- `playbookCatalog` contains one canonical `playbook-multi-persona-collaboration` identity with no duplicate or missing fields.
- `node scripts/validate-content.mjs` and `node --test scripts/validation/validation.test.mjs` pass.
- Existing `multi-persona-collaboration` orientation route, `problem-context` contract, and collaboration Playbook markdown are unchanged.
- Site Playbooks/Docs surfaces show the identity; Decisions records the reconciliation note.

Stopping condition: draft PR [#91](https://github.com/rickvang/Persona-Library/pull/91) opened against `origin/main` for issue #71; explicitly not merged from this run.
