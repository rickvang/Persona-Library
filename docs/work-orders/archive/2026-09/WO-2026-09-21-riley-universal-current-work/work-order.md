# Work Order — Riley universal Current Work orchestration

- Work Order ID: `WO-2026-09-21-riley-universal-current-work`
- Status: complete
- Created: 2026-09-21
- Last updated: 2026-09-21
- Issue: https://github.com/rickvang/Persona-Library/issues/180
- Repository: `rickvang/Persona-Library`
- Base: `main`
- Branch: `feat/issue-180-riley-universal-current-work`
- Requester: `rickvang`
- Owner: Riley Morgan / current implementation agent
- Request mode: update
- Authorization: requester explicitly asked to implement the scoped change using the updated workflow; Persona-Library standing completion authorization applies through merge unless narrowed.
- Current Work: https://app.notion.com/p/3e2cd82535ff81809709e27630f77e72
- Current Work ID: `CW-26`

## Objective

Make Riley Morgan / `ai-orchestrator` the default durable orchestration owner for every substantial Current Work workstream while preserving direct execution by the selected Persona, Skill, Playbook, Tool path, or runtime.

## Placement and boundary review

Mara placement result: extend existing boundaries rather than create a new orchestration system.

- Extend Riley's existing `ai-orchestrator` record and `Operate and improve the system` workflow.
- Extend root `AGENTS.md` and `docs/work-orders.md`.
- Append one durable Decision and one Riley semantic revision.
- Extend the user's existing Notion Current Work schema with only `Operating Route` and optional `Parent Work ID`.
- Extend existing Shared Collaboration Governance and product-specific agent contracts.
- Do not create a second orchestration database, new Persona, Skill, Tool, Playbook, or runtime service.

## Invariant

1. Every substantial Current Work workstream is Riley-governed for continuity and orchestration unless the requester explicitly establishes another orchestration boundary.
2. The selected Persona, Skill, Playbook, Tool path, or runtime may execute directly; do not add an unnecessary Riley execution hop.
3. Riley reconciles durable orchestration state at workstream creation, material rerouting, cross-agent handoff, major blocker, and completion.
4. Current Work remains the concise cross-agent index.
5. Work Orders remain detailed execution/recovery state.
6. Live systems remain freshness-sensitive authority and are refreshed selectively when freshness matters.

## Success criteria

- Riley Persona and workflow state the universal durable-orchestration invariant.
- Root repository and Work Order guidance use "every substantial workstream" rather than only "Riley-operated work".
- Regression validation fails if the universal invariant or direct-execution boundary drifts.
- Current Work exposes `Operating Route` and optional `Parent Work ID`.
- Shared Collaboration Governance and Current ChatGPT, Codex, Claude, Cursor, and Hermes contracts enforce the invariant.
- No duplicate orchestration database or mandatory Riley execution hop is introduced.

## Completion evidence

- PR #181 contains the Riley Persona/workflow change, root repository and Work Order contract updates, DEC-022, regression coverage, and refreshed generated mirrors.
- Repository validation run #59 passed the build, authored/generated content validation, all repository validation tests, whitespace checks, and generated-output freshness.
- Notion Current Work now includes `Operating Route` and `Parent Work ID`; CW-26 carries the live orchestration checkpoint.
- Shared Collaboration Governance contains the Riley orchestration invariant.
- ChatGPT, Codex, Claude, Cursor, and Hermes each have exactly one Current contract containing the invariant, with blank version-record bodies.
- No second orchestration database or mandatory Riley execution hop was introduced.

## Current phase and next action

Phase: implementation and structural validation complete.

Next action: perform the repository-required fresh merge preflight on PR #181 and merge if the current head/base, checks, reviews, mergeability, and linked issue-closing effect remain clear.
