# GitHub default repository workflow Work Order

- Work Order ID: WO-2026-09-14-github-default-workflow
- Title: Make GitHub the default repository workflow for Persona-Library work
- Status: complete
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: repository user
- Current owner: Codex
- Explicit collaborators: driver task 01a09e06-1a61-78e3-8c62-6da56142cb20; SkillRepo follow-up agent after this change lands
- Request mode: update
- GitHub issue: [#75 — Make GitHub the default repository workflow for Persona-Library work](https://github.com/rickvang/Persona-Library/issues/75)
- GitHub pull request: [#77 — Make GitHub the default repository workflow](https://github.com/rickvang/Persona-Library/pull/77) (merged)
- Merge commit: `1e65ca6bc0795f3e487e2449744e45448bbdb587`
- Artifact home: `docs/work-orders/archive/2026-09/WO-2026-09-14-github-default-workflow/`
- Concrete deliverable: root [`AGENTS.md`](../../../../../AGENTS.md) rule pointing to the pinned external GitHub operating contract
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

Give fresh Persona-Library sessions a small always-on repository rule that identifies the canonical remote, prefers the connected GitHub integration for supported operations, refreshes live state before repository reasoning, keeps fallback and mutation boundaries explicit, and points to the reusable operating contract in `tool-repo`.

## Scope

- Add one concise rule to the existing root repository contract.
- Pin the external `tools/github/AGENTS.md` entrypoint to verified `tool-repo` commit `94acc6082e941439d2ee532f1b1b091cd42eb923`.
- Validate the root guidance against the landed Persona-Library #70 baseline and the live GitHub issue, repository, and external package state.
- Record downstream impact and unchanged surfaces before handoff.

## Non-goals and constraints

- Do not copy the detailed GitHub operating procedure into Persona-Library.
- Do not add a generic Tool registry, standalone Tool source model, runtime, credential store, or permission configuration.
- Do not change `content/library-data.js`, `content/library-model.js`, route groups, generated `dist/` output, or Work Order semantics.
- Do not mutate GitHub issues, labels, assignments, credentials, settings, or access as part of this change.
- Preserve unrelated repository changes and do not force-push or bypass review protections.

## Authorization and boundary

The repository user authorized the coordinated implementation sequence, including the new Persona-Library integration, push, pull request, and normal merge path. The authorized mutation targets were this repository's root guidance and the scoped Work Order evidence. That merge path completed through PR #77; later GitHub inspection still does not by itself authorize comments, edits, or further mutation.

## Mara placement and boundary review

The placement review follows Mara Okoye's knowledge-systems boundary: the durable project-specific activation rule belongs in the existing root `AGENTS.md`; the reusable GitHub procedure belongs in `rickvang/tool-repo/tools/github/AGENTS.md`; progress and evidence belong in this existing `docs/work-orders/<work-order-id>/` home. A new Tool record or catalog field is not justified because the current model owns Persona Tool requirements and Tool-use recipes, not a standalone external Tool-source registry.

Rejected alternatives:

- Copy the reusable GitHub procedure into `AGENTS.md`: duplicates the external canonical owner and creates drift.
- Add a new GitHub Tool record or `toolCatalog` field: expands the current model without a demonstrated need and is explicitly out of scope for #75.
- Update `ARCHITECTURE.md`, route groups, or generated Site output: no ownership, route, canonical data, or client behavior changes are required.

## Current phase and gate

Phase: implementation merged to `main` through PR #77 at `1e65ca6bc0795f3e487e2449744e45448bbdb587`; issue #75 is closed.

Gate: complete. The landed rule is based on Persona-Library `main` at `fc3af861ec5fd9b20e605e713f647d3249580e26` (merged #70) and references `tool-repo` commit `94acc6082e941439d2ee532f1b1b091cd42eb923` (merged #1 through PR #2).

## Evidence and uncertainty

- Observed (implementation): issue #75 defined the minimal `AGENTS.md` integration boundary.
- Observed (implementation): Persona-Library PR #76 merged #70 at `fc3af861ec5fd9b20e605e713f647d3249580e26`.
- Observed (post-merge, 2026-09-14): PR #77 merged into `main` at `1e65ca6bc0795f3e487e2449744e45448bbdb587` and closed #75.
- Observed: `tool-repo` PR #2 merged #1 at `94acc6082e941439d2ee532f1b1b091cd42eb923`, and `tools/github/AGENTS.md` resolves at that exact revision.
- Observed: the implementing runtime exposed the GitHub plugin and successfully supported read-only repository, issue, branch, file, and pull request inspection.
- Observed: current Persona-Library data has Tool-use recipes and Persona Tool requirements but no standalone canonical Tool-source array.
- Unknown: connector availability, account permissions, and mutation approval in a future session remain runtime-specific and are not supplied by this repository rule.

## Success criteria and stopping condition

- A fresh session can identify `rickvang/Persona-Library` as the default remote for current repository work.
- The rule prefers direct GitHub integration and names browser/computer use as a bounded fallback.
- The rule requires current-state refresh and preserves the inspection-versus-mutation boundary.
- The detailed contract is referenced at an explicit verified revision.
- Full validation, focused tests, diff checks, fresh PR review, and normal integration complete without unrelated changes.

## Completion boundary and next action

Status changed to complete because PR #77 merged the authorized #75 implementation and closed the issue. Historical local checks remain in [`validation.md`](validation.md) and are not restated as CI evidence.

Completion boundary: no further action on this packet. Connector availability in a later session remains unknown and is not supplied by this rule.
