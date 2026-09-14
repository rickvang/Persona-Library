# Persona-Library maintenance coupling Work Order

- Work Order ID: WO-2026-09-14-maintenance-coupling
- Title: Reduce maintenance coupling with focused validation ownership
- Status: ready-for-review
- Created: 2026-09-13
- Last updated: 2026-09-13
- Requester: repository user
- Current owner: Codex
- Explicit collaborator: Mara Okoye, knowledge systems architect
- Request mode: update
- GitHub issue: [#70 — Reduce Persona-Library maintenance coupling with domain-owned contracts and focused validators](https://github.com/rickvang/Persona-Library/issues/70)
- Artifact home: `docs/work-orders/WO-2026-09-14-maintenance-coupling/`
- Concrete deliverable: [`scripts/validation/`](../../../scripts/validation/) and the thin [`scripts/validate-content.mjs`](../../../scripts/validate-content.mjs)
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

Phase: ownership audit and behavior-preserving validator extraction complete; focused regression coverage and full validation complete; universal reconciliation recorded.

Gate: ready for review. The top-level command remains runnable, focused modules are independently importable, representative failures are covered, and no canonical authored data was duplicated or moved.

## Evidence and uncertainty

- Observed: baseline `node scripts/validate-content.mjs` passed before extraction with 20 Personas and 20 workflow maps.
- Observed: the old command combined source loading, generated freshness, orientation, Persona, Skill, relationship, Operating Pack, Template, and maintenance checks in one 563-line file.
- Observed: the completed #60 audit already resolved external artifact ownership; issue #70 consumes that result and does not reopen migration.
- Assumption: six focused responsibility units plus shared context are the smallest useful split for the current checks; future domains may extend the directory only when they own a distinct contract.
- Unknown: future validator runtime needs and whether more granular extraction will reduce actual maintenance effort.

## Completion boundary and next action

The Work Order is complete when the linked implementation, focused tests, full validation, `git diff --check`, and reconciliation report are inspectable. Next action: reviewer inspects the focused module boundaries and validation evidence, then merges or requests a scoped correction.
