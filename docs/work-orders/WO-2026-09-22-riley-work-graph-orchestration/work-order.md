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
| 4. Recovery and resumption | running; identity persisted before controlled interruption | WorkNode `CW44-P4-N1` is running as `/root/cw44_phase4_recovery`. The returned runtime identity is now saved in the proof packet and Work Order before any interruption. Next: interrupt, rehydrate from current durable/live sources, then continue the same identity if supported. |
| 5. Validation and learning | planned | Run repository validation, a Riley conformance case, and change-impact reconciliation. |

## Non-goals

- Building another Herdr, Orca, Maestro, Vicoa, Vigilante, or Orloj.
- Adding a distributed queue, worker daemon, scheduler, model gateway, terminal multiplexer, or orchestration database.
- Mirroring volatile GitHub / CI / runtime state into Notion.
- Maximizing agent count.
- Self-learning model/runtime routing in this first implementation.

## Current checkpoint

[C10 | 2026-09-22] Main checkpoint remains `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`; issue #197 remains open. `CW44-P4-N1` is running as `/root/cw44_phase4_recovery`. Its exact returned agent identity is persisted in the proof packet and Work Order before interruption. No separate Dispatch/session ID was exposed by the runtime.

## Next action

After confirming the identity is saved, interrupt the running child. Re-fetch Current Work, Work Order, packet, Skill, current `main`, issue #197, and live runtime state. Resume `/root/cw44_phase4_recovery` from those saved identifiers if supported; do not create another identity unless the live state requires explicit supersession. Complete repository validation, change-impact reconciliation, and Riley conformance. Keep #197 open.
