# Work Order — Riley work-graph orchestration

- Work Order ID: WO-2026-09-22-riley-work-graph-orchestration
- Status: active
- Requester: repository owner
- Orchestration owner: Riley Morgan / `ai-orchestrator`
- Current Work: CW-44 — Riley — work graph orchestration capability
- GitHub issue: #197 — Add Riley work-graph orchestration capability
- Branch: `feat/issue-197-riley-work-graph-orchestration`
- Base at start: `c9b24363fd24ab63f7376fc4ff5a7106c6268ac2`
- Request mode: update
- Authorization: requester asked to kick off CW-44 with Riley; Persona-Library standing completion authorization applies to the scoped repository implementation unless later narrowed.

## Objective

Add the smallest provider-neutral supervisory capability Riley needs to decompose substantial outcomes into dependency-aware WorkNodes, create and supervise authoritative Dispatches through available runtimes, enforce explicit gates/evidence, recover interrupted work safely, and reconcile completion without becoming an agent runtime or creating a second orchestration database.

## Placement and boundary review

Current source already provides Riley with Agent Workflow Architecture, Task Decomposition and Routing, Tool and Context Design, Risk / Guardrails / Human Oversight, Failure Recovery and Operational Judgment, Current Work continuity, and the bounded-parallel implementation Playbook.

CW-44 adds a distinct **Work Graph Orchestration** Skill because the missing behavior is operational supervision across multiple live execution attempts rather than architecture design alone. The Skill composes those existing capabilities and references the Playbook for repository implementation stages.

Rejected placements:

- **New Persona:** Riley already owns general orchestration.
- **New orchestration database:** Current Work + Work Order + live-system hierarchy is already canonical.
- **New runtime / scheduler / terminal manager:** execution products and runtime surfaces remain replaceable adapters.
- **Vendor-specific Tool package:** provider-specific procedure is not yet stable enough; keep the first contract portable.

## Research basis

CW-44 compared Herdr, Maestro, Vicoa, Orca, Vigilante, Orloj, and FluxRoute. Reused concepts are limited to portable orchestration semantics: explicit lifecycle, stable dispatch identity, work isolation, supervised DAG/dependency behavior, decision gates, read-before-retry recovery, idempotent ownership, observable evidence, and bounded adaptation. No external code is copied.

## Phase status

| Phase | State | Evidence / next action |
| --- | --- | --- |
| 1. Capability and schema | implemented / PR #198 | Callable Skill, Riley application, workflow/guidance, relationships, Skills route, Operational Scenario, orientation registration, and focused validator are implemented. Repository validation run #97 passed all substantive gates on the corrected Phase 1 sources. |
| 2. GitHub execution semantics | implemented / PR #199 | `github-execution-proof.md` reconstructs PR #198 as a real WorkNode→Dispatch→branch/PR→CI/review Gate→disposition case. Skill distinguishes bounded corrections from new Dispatch identity and defines collision/sequential fallback. |
| 3. Runtime-aware dispatch | demonstrated / proof branch | A real supervised, read-only Codex child-agent path ran as `/root/cw44_runtime_eval`. Its bounded result and lifecycle are recorded in [runtime-dispatch-proof.md](runtime-dispatch-proof.md). The collaboration API exposed no separate Dispatch UUID, session, branch, or worktree for this run. |
| 4. Recovery and resumption | partial; controlled durable interruption/resume ready | The first same-identity interruption/resumption preceded persistence of its identity. A fresh no-history agent independently reconstructed the prior run and next action from durable/current sources. WorkNode `CW44-P4-N1` now defines a bounded read-only post-persistence interruption/resume test; its child identity must be saved before interruption. |
| 5. Validation and learning | planned | Run repository validation, a Riley conformance case, and change-impact reconciliation. |

## Non-goals

- Building another Herdr, Orca, Maestro, Vicoa, Vigilante, or Orloj.
- Adding a distributed queue, worker daemon, scheduler, model gateway, terminal multiplexer, or orchestration database.
- Mirroring volatile GitHub / CI / runtime state into Notion.
- Maximizing agent count.
- Self-learning model/runtime routing in this first implementation.

## Current checkpoint

[C09 | 2026-09-22] Main checkpoint remains `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`; issue #197 remains open. Phase 3 evidence and context-free rehydration are recorded in the proof packet. The packet now defines `CW44-P4-N1`, including its read-only boundary, dependencies, source checkpoint, evidence contract, and requirement to persist the returned runtime identity before interruption. No runtime identity or active Dispatch is recorded for this test yet.

## Next action

Re-fetch Current Work, Work Order, packet, Skill, current `main`, issue #197, and live runtime state. Then dispatch exactly one bounded `CW44-P4-N1` child, save its returned identity in both durable GitHub records, and only then test interruption and recovery. Resume the same identity if supported; otherwise explicitly dispose it before a new identity. Complete repository validation, change-impact reconciliation, and Riley conformance. Keep #197 open.
