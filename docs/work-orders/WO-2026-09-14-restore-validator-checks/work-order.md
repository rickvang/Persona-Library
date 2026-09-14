# Restore validator checks lost in #70 extraction Work Order

- Work Order ID: WO-2026-09-14-restore-validator-checks
- Title: Restore validator checks lost in #70 extraction
- Status: ready-for-review
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: Rick Vang
- Current owner: Cursor cloud agent
- Explicit collaborator: Mara Okoye, knowledge systems architect
- Request mode: update
- GitHub issue: [#78 — Restore validator checks lost in #70 extraction](https://github.com/rickvang/Persona-Library/issues/78)
- Pull request: [#80 — Restore validator checks lost in #70 extraction](https://github.com/rickvang/Persona-Library/pull/80)
- Artifact home: `docs/work-orders/WO-2026-09-14-restore-validator-checks/`
- Concrete deliverable: restored Tool-use recipe `steps` check in [`scripts/validation/relationships.mjs`](../../../scripts/validation/relationships.mjs) and Playbook identity check in [`scripts/validation/context.mjs`](../../../scripts/validation/context.mjs)
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

Restore two validation contracts that existed before Persona-Library #70 / PR #76 and were dropped during the validator extraction, without rolling back the focused-module architecture.

## Scope

- Reject Tool-use recipes whose `steps` field is missing, not an array, or empty.
- Validate every canonical Playbook catalog identity for present unique `id`, `name`, and `status` before the shared Playbook ID index is trusted.
- Add the smallest focused regression cases for both contracts.
- Record Work Order progress, validation evidence, and a read-only reconciliation pass.

## Non-goals and constraints

- No rollback of #70 or new validation framework.
- No split of `content/library-data.js` or `content/library-model.js`.
- No new `playbooks.mjs` module or Playbook/Tool schema redesign.
- No unrelated validator cleanup, generated Site edits, or external repository writes.
- Preserve the original failure messages where practical.

## Authorization and boundary

Rick Vang explicitly authorized implementation of issue #78. The authorized mutation target is this repository’s focused validation modules, focused regression tests, validation README ownership line, and this Work Order package. The Work Order records scope and evidence; it does not grant additional permissions, merge authority, or authorization to work issue #79.

## Mara placement and boundary review

Mara’s canonical Persona record, the `docs` `work-order-start` route, `docs/work-orders.md`, the #70 ownership packet, and the `creation_gate` in `content/site-orientation.json` were checked before creating this package.

- Classification: existing-contract restoration in the current validator modules, plus a project-scoped Work Order package.
- Selected placement: restore recipe `steps` in `relationships.mjs`, the owner of Tool-use recipes; restore Playbook identity in `buildValidationIndexes()` because that is where the shared Playbook ID `Set` is constructed and later trusted by Operating Pack and Template checks.
- Rejected alternative: add `scripts/validation/playbooks.mjs` for symmetry. Issue #78 forbids a new module unless a dedicated Playbook validator is justified; identity uniqueness is an index-construction concern.
- Rejected alternative: roll back #70 into a single validator file. That would undo the authorized modularization.
- Rejected alternative: keep Playbook IDs as an unvalidated `Set` map. Duplicate or incomplete identities would continue to collapse silently.
- Boundary result: placement is clear; the review does not authorize generated output edits, Playbook catalog data changes, or issue #79.

## Current phase and gate

Phase: implementation, focused tests, full validation, and reconciliation complete on `cursor/restore-validator-checks-a1a9`; PR #80 is open against `main`.

Gate: ready for review. Tool-use recipes without steps fail closed, incomplete or duplicate Playbook identities fail closed, focused regression tests cover both defects, and current canonical data still passes the top-level validator. #70's focused-module architecture remains intact.

## Evidence and uncertainty

- Observed: pre-#70 `scripts/validate-content.mjs` rejected `!Array.isArray(recipe.steps) || !recipe.steps.length` and required unique Playbook `id`/`name`/`status` before adding to `playbookIds`.
- Observed: post-#76 `relationships.mjs` omitted the `steps` check; `buildValidationIndexes()` mapped `playbookCatalog` through `Set` without identity validation.
- Assumption: restoring those two exact contracts in the current owners is sufficient; no broader recipe or Playbook schema is required.
- Unknown: whether later Playbook catalog growth will justify a dedicated module. Not in this scope.

## Completion boundary and next action

The Work Order is complete when the restored checks, focused tests, full validation, `git diff --check`, and reconciliation report are inspectable on an open pull request. Next action: reviewer inspects PR #80 and merges only after review. Do not merge from this packet.
