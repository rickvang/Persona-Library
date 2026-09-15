# Persona-Library maintenance coupling Work Order

- Work Order ID: WO-2026-09-14-maintenance-coupling
- Title: Reduce maintenance coupling with focused validation ownership
- Status: complete
- Created: 2026-09-13
- Last updated: 2026-09-14
- Requester: repository user
- Current owner: Codex
- Explicit collaborator: Mara Okoye, knowledge systems architect
- Request mode: update
- GitHub issue: [#70 — Reduce Persona-Library maintenance coupling with domain-owned contracts and focused validators](https://github.com/rickvang/Persona-Library/issues/70)
- GitHub pull request: [#76 — Reduce Persona-Library maintenance coupling](https://github.com/rickvang/Persona-Library/pull/76) (merged)
- Merge commit: `fc3af861ec5fd9b20e605e713f647d3249580e26`
- Follow-up: [#78 — Restore validator checks lost in #70 extraction](https://github.com/rickvang/Persona-Library/issues/78) owns two post-merge validator regressions; this packet does not implement that correction
- Artifact home: `docs/work-orders/archive/2026-09/WO-2026-09-14-maintenance-coupling/`
- Concrete deliverable: [`scripts/validation/`](../../../../../scripts/validation) and the thin [`scripts/validate-content.mjs`](../../../../../scripts/validate-content.mjs)
- Specialized evidence: [`ownership.md`](ownership.md), [`validation.md`](validation.md), and [`reconciliation.md`](reconciliation.md)

## Goal

Reduce the unrelated repository knowledge and central editing required for routine Persona-Library maintenance while preserving the Git-first, file-based, static-first architecture and the existing top-level validation command.

## Scope

- Audit the current validation and documentation ownership boundaries.
- Extract existing validation behavior into focused modules without changing the canonical data/model files.
- Keep cross-domain relationship checks explicit.
- Add minimal focused regression cases for representative domain failures.
- Clarify the validation ownership model in `ARCHITECTURE.md`.
- Record evidence, limitations, and the required universal reconciliation result.

## Non-goals and constraints

- No runtime, plugin system, package manager, database, registry, generic validation framework, or new first-class domain concept.
- No split of `content/library-data.js` or `content/library-model.js` without evidence that it reduces coupling.
- No migration or external repository write.
- No generated `dist/` authoring or user-facing behavior change.
- Preserve useful failure messages, validation coverage, semantic revision fields, and existing source/output boundaries.

## Authorization and boundary

The repository user explicitly authorized implementation of issue #70 in this isolated worktree. The authorized mutation target is this repository’s validation scripts, focused regression cases, architecture guidance, and this Work Order package. The Work Order records scope and evidence; it does not grant additional permissions or authorize external communication.

## Mara placement and boundary review

Mara’s canonical Persona record, the `docs` `work-order-start` route, `docs/work-orders.md`, the completed #60 external-artifact audit, and the `creation_gate` in `content/site-orientation.json` were checked before creating this package and the focused modules.

- Selected placement: keep the implementation in the existing `scripts/` command and add the smallest coherent `scripts/validation/` responsibility units; keep rationale and progress in this Work Order package; update the existing `ARCHITECTURE.md` boundary section.
- Rejected alternative: create a new validation framework or registry. It would add a concept and lifecycle that issue #70 explicitly excludes.
- Rejected alternative: split each domain into new authored data files. The audit found shared `content/library-data.js` and `content/library-model.js` are coherent canonical sources, and issue #70 says semantic ownership does not require one file per domain.
- Rejected alternative: move cross-domain checks into an arbitrary domain validator. Typed relationships remain explicit in `relationships.mjs`.
- Boundary result: placement is clear; the review does not authorize generated output edits, external writes, or unrelated refactors.

## Current phase and gate

Phase: implementation merged to `main` through PR #76 at `fc3af861ec5fd9b20e605e713f647d3249580e26`; issue #70 is closed.

Gate: complete for the authorized #70 extraction. The top-level command remains runnable, focused modules are independently importable, representative failures recorded during implementation are covered, and no canonical authored data was duplicated or moved. This gate does not claim that every pre-extraction validator assertion survived; two later regressions are tracked in #78.

## Evidence and uncertainty

- Observed: baseline `node scripts/validate-content.mjs` passed before extraction with 20 Personas and 20 workflow maps.
- Observed: the old command combined source loading, generated freshness, orientation, Persona, Skill, relationship, Operating Pack, Template, and maintenance checks in one 563-line file.
- Observed: the completed #60 audit already resolved external artifact ownership; issue #70 consumes that result and does not reopen migration.
- Assumption: six focused responsibility units plus shared context are the smallest useful split for the current checks; future domains may extend the directory only when they own a distinct contract.
- Unknown: future validator runtime needs and whether more granular extraction will reduce actual maintenance effort.

## Completion boundary and next action

Status changed to complete because PR #76 merged the authorized #70 implementation and closed the issue. The linked implementation, focused tests, historical local validation in [`validation.md`](validation.md), `git diff --check`, and reconciliation report remain inspectable.

Those recorded commands are implementation-worktree evidence; they are not restated as CI evidence.

Completion boundary: no further action on this packet. Follow-up #78 owns the two validator regressions discovered after merge and must not be folded into this Work Order.
