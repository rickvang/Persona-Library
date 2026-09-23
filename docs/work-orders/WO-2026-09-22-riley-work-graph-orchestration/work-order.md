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
| 4. Recovery and resumption | partial; post-persistence same-identity recovery demonstrated | `CW44-P4-N1` persisted `/root/cw44_phase4_recovery` before interruption, re-read durable and live sources, and continued the same identity. A separate no-history agent reconstructed the earlier run and safe next action. A different agent taking over the interrupted runtime and runtime replacement/supersession were not exercised; the runtime exposes no separate Dispatch ID. |
| 5. Validation and learning | pending | Run repository validation through the PR flow, change-impact reconciliation, and a representative Riley conformance case. |

## Non-goals

- Building another Herdr, Orca, Maestro, Vicoa, Vigilante, or Orloj.
- Adding a distributed queue, worker daemon, scheduler, model gateway, terminal multiplexer, or orchestration database.
- Mirroring volatile GitHub / CI / runtime state into Notion.
- Maximizing agent count.
- Self-learning model/runtime routing in this first implementation.

## Current checkpoint

[C11 | 2026-09-22] Phase 3 is demonstrated. The controlled Phase 4 node returned `/root/cw44_phase4_recovery`; that identity was recorded in the proof packet and Work Order before interruption. The supervisor observed `previous_status: running`, then the runtime as interrupted; after re-reading Current Work, durable Work Order/proof, Skill, current main, issue #197, and live runtime state, the supervisor continued the same identity. The child re-fetched sources and completed a read-only recovery audit. A second child started without prior task turns independently reconstructed the earlier saved run. Issue #197 remains open. Full Phase 4 is partial because the different-agent takeover and runtime replacement/supersession path were not exercised.

## Next action

Complete the read-only change-impact reconciliation and representative Riley conformance review. Open a reviewable PR for this scoped proof, then use the repository's PR checks/review as validation evidence. Fix scoped review findings if any; keep #197 open while any acceptance criteria remain. Do not claim full recovery or close the issue from this checkpoint.
