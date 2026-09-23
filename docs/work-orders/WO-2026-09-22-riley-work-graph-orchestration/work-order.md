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
| 4. Recovery and resumption | partial; post-persistence interrupted resume pending | The first same-identity interruption/resumption preceded persistence of that identity. A fresh agent, `/root/cw44_recovery_rehydrate`, was launched without prior task turns and independently reconstructed the saved node, prior runtime identity, lifecycle, evidence gap, live issue state, and safe next action. This proves transcript-free source rehydration; it did not resume an interrupted runtime because the prior runtime was already completed. |
| 5. Validation and learning | planned | Run repository validation, a Riley conformance case, and change-impact reconciliation. |

## Non-goals

- Building another Herdr, Orca, Maestro, Vicoa, Vigilante, or Orloj.
- Adding a distributed queue, worker daemon, scheduler, model gateway, terminal multiplexer, or orchestration database.
- Mirroring volatile GitHub / CI / runtime state into Notion.
- Maximizing agent count.
- Self-learning model/runtime routing in this first implementation.

## Current checkpoint

[C08 | 2026-09-22] Current `main` checkpoint remains `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`; issue #197 is open. The first live runtime (`/root/cw44_runtime_eval`) supplied Phase 3 evidence and one interrupted-then-same-identity-continuation sequence, but its identity was not saved before that interruption. After saving it in the proof packet and Work Order, a fresh no-history child (`/root/cw44_recovery_rehydrate`) re-fetched the packet, Current Work, Skill, main, issue, and live runtime state. It reconstructed the prior execution and recommended treating the original runtime as completed. This verifies transcript-free recovery-decision reconstruction, not a live interrupted-resume.

## Next action

Run a controlled, bounded Phase 4 recovery test from the saved packet: define the recovery node and source checkpoint; start a fresh read-only child; persist its exact returned identity before interrupting it; then re-read Current Work, Work Order, Skill, current `main` / #197, and live runtime state. Resume the same identity if supported, or record its disposition before any new identity. Complete repository validation, change-impact reconciliation, and Riley conformance. Keep #197 open.
