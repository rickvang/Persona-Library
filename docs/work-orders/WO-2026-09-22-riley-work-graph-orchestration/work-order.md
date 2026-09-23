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
| 2. GitHub execution semantics | implemented / proof branch | `github-execution-proof.md` reconstructs PR #198 as a real WorkNode→Dispatch→branch/PR→CI/review Gate→disposition case. Skill now distinguishes bounded corrections and CI/review events from a genuinely new Dispatch identity and defines collision/sequential fallback. |
| 3. Runtime-aware dispatch | planned | Prove at least one current execution adapter without embedding provider syntax in the portable Skill. |
| 4. Recovery and resumption | partial repository proof | PR #198 demonstrates read-before-retry through successive CI/review failures without duplicate branch/PR creation, plus post-merge issue-state reconciliation. A true interrupted child-runtime Dispatch replacement/resume remains unproven. |
| 5. Validation and learning | planned | Run repository validation, a Riley conformance case, and change-impact reconciliation. |

## Non-goals

- Building another Herdr, Orca, Maestro, Vicoa, Vigilante, or Orloj.
- Adding a distributed queue, worker daemon, scheduler, model gateway, terminal multiplexer, or orchestration database.
- Mirroring volatile GitHub / CI / runtime state into Notion.
- Maximizing agent count.
- Self-learning model/runtime routing in this first implementation.

## Current checkpoint

[C03 | 2026-09-22] Phase 1 merged in PR #198 as `777144e3130f08b636ee231ec781696a18fe16a6`; final run #98 passed and all review threads were resolved. GitHub linked-completion closed #197 prematurely; Riley re-read live issue state and reopened it. Phase 2 now uses that real run as `github-execution-proof.md`, clarifying that commits/CI/review corrections stay inside one Dispatch while abandonment/supersession/reassignment creates a new Dispatch.

## Next action

Land the Phase 2 proof/contract refinement after repository validation and review. Then continue #197 / CW-44 with the remaining Phase 3–4 evidence: at least one live supervised child-runtime Dispatch when a suitable runtime is actually exposed, followed by a true interrupted/stale runtime resume or explicit supersession case from durable identifiers rather than transcript memory.
