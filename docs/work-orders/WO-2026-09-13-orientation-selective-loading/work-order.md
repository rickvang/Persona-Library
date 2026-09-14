# Selective orientation loading Work Order

- Work Order ID: WO-2026-09-13-orientation-selective-loading
- Title: Split Persona-Library orientation into a minimal bootstrap and selective route groups
- Status: complete
- Created: 2026-09-13
- Last updated: 2026-09-13
- Requester: repository user
- Current owner: Codex
- Explicit collaborator: Mara Okoye, knowledge systems architect
- Request mode: update
- GitHub issue: [#69 — Split Persona-Library orientation into a minimal bootstrap and selectively loaded routes](https://github.com/rickvang/Persona-Library/issues/69)
- Artifact home: `docs/work-orders/WO-2026-09-13-orientation-selective-loading/`

## Goal

Reduce always-on orientation context while preserving the current Persona-Library concepts, routing semantics, mutation boundaries, availability distinctions, and evidence discipline.

## Scope

- Preserve `content/site-orientation.json` as the minimal machine-readable bootstrap and route-group index.
- Add selectively loadable route-group files under `content/orientation/`, grouped by the existing primary-space IDs.
- Update the repository activation contract, orientation Skill, known-route Skill preflights, build output, validator, current Docs, and architecture wording.
- Measure the current monolith against `AGENTS.md + bootstrap + selected route group` for representative routes.
- Re-run the orientation golden/conformance checks that are applicable to the repository and record limitations.

## Non-goals and constraints

- Do not add a routing service, database, vector store, runtime dependency, or deterministic keyword router.
- Do not create a new first-class Persona-Library domain or change existing route IDs, primary spaces, artifact kinds, mutation boundaries, availability sources, or reconciliation semantics.
- Keep generated `dist/` files as build outputs and preserve historical Work Orders, Decisions, and reconstruction reports unless they contain current-state instructions that must change.
- Classification remains separate from mutation authorization; documented package presence remains separate from runtime availability.

## Authorization and boundary

The repository user explicitly authorized implementation by requesting that issue #69 be built. This Work Order covers the local Persona-Library repository, its generated Site output, and repository-local Skill contracts. It does not authorize changes to external repositories, user-level Skill installation, external publication, or runtime routing infrastructure.

## Placement and boundary review

Mara Okoye’s placement review was performed from her canonical Persona record, the `creation_gate` in `content/site-orientation.json`, and `ARCHITECTURE.md`.

- Finding: route-group files are an extension of the existing orientation manifest’s routing record and belong under `content/orientation/`, a flat repository-local support directory; they do not constitute a new library space or canonical domain object.
- Selected placement: `content/site-orientation.json` remains the bootstrap; `content/orientation/personas.json`, `skills.json`, `operating-packs.json`, `templates.json`, `tools.json`, `playbooks.json`, `docs.json`, `decisions.json`, and `prototyping.json` hold route details grouped by current `primary_space`.
- Closest rejected alternative: one file per route. It preserves semantics but adds 29 files and increases retrieval and validation overhead without evidence that route groups are too large.
- Closest rejected alternative: a new top-level routing or orientation domain. It would create a first-class concept for an implementation detail and duplicate the existing Docs-owned system orientation boundary.
- Closest rejected alternative: retaining the monolith. It preserves compatibility but does not solve the eager-loading problem identified in issue #69.
- Boundary result: placement review identifies the destination and alternatives; it does not itself authorize mutation.

## Baseline evidence

- `content/site-orientation.json`: 43,676 bytes, 622 physical lines, 14 top-level fields, 9 spaces, and 29 routes.
- Current route detail is already naturally grouped by primary space: docs 6, personas 3, skills 4, operating-packs 4, templates 5, playbooks 2, tools 2, decisions 1, and prototyping 2.
- `AGENTS.md` is the repository activation point and currently repeats a full quick-routing table in addition to the manifest pointer.
- Known consumers include repository activation, the orientation Skill, repository-local Skill preflights, the build script, content validation, current architecture/README guidance, and generated Site data.

## Success criteria

- The bootstrap can be read without loading route-specific contracts.
- A representative request can identify mode and primary space from the bootstrap, then select a route from one group file.
- Every current route remains present exactly once with its semantics intact.
- Universal policy fields have one canonical owner and are not silently lost or duplicated.
- Generated bootstrap and route-group copies are fresh and read-only.
- Existing orientation behavior, safety boundaries, and applicable golden/conformance cases remain covered.
- Before/after context evidence shows materially less unrelated routing detail for a selected route.

## Current phase and next action

Phase: implementation, validation, and reconciliation complete; integration pending.

Next action: implementation is committed and pushed to `main`; close the linked implementation issue.

## Evidence and limitations

The baseline is repository-observed. Mara’s perspective is a canonical synthetic Persona record, not an interview or user study. The issue plan is the authorized implementation brief; external runtime consumers and historical exact package behavior are unknown until validation exposes them.
