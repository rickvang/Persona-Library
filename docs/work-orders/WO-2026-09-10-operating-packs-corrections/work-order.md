# Operating Packs corrective fixes Work Order

- Work Order ID: WO-2026-09-10-operating-packs-corrections
- Title: Fix Operating Pack relationship, source, reconciliation, and URL-state validation
- Status: active
- Created: 2026-09-10
- Last updated: 2026-09-10
- Requester: repository user
- Current owner: Codex
- Request mode: update
- GitHub issue: [#56](https://github.com/rickvang/Persona-Library/issues/56)
- Related Work Order: [WO-2026-09-10-operating-packs](../WO-2026-09-10-operating-packs/work-order.md)

## Outcome

Correct the four post-merge Operating Pack defects while preserving the existing first-class catalog model and static-first Site architecture.

## Scope

- Require normalized scoped applications to resolve the Persona, Skill, Persona workflow, Persona-Skill association, and Skill-workflow association together.
- Keep local Operating Pack entrypoints inside the repository before reading them; preserve external GitHub reference behavior.
- Add Operating Packs to the universal reconciliation dependency direction for related Persona, Skill, workflow, Playbook, Tool, and Tool-use changes.
- Repair the existing Operating Pack detail URL state handler so opening, closing, filtering, and reloading remain synchronized.
- Add focused validation fixtures for invalid relationships and entrypoint traversal.

## Non-goals and constraints

- Do not redesign the Operating Pack record or rename the space.
- Do not add transport, installation, runtime, or framework layers.
- Do not refactor unrelated Persona, Skill, Tool, or Playbook architecture.
- Preserve unrelated working-tree changes already present in the repository.

## Success criteria

- Normalization and validation reject unrelated Persona-Skill-workflow combinations.
- Local source entrypoints cannot escape the repository root.
- Universal reconciliation explicitly inspects Operating Pack dependents without recursive loops.
- The generated Operating Pack page preserves selected-pack URL state across open, close, reload, share, and filtering.
- Normal build, content validation, focused checks, diff checks, and required reconciliation pass.

## Current phase and next action

Phase: implementation and validation. Next action: run the normal build and focused validator, record results, create the corrective issue/PR, and merge the scoped commit.
