# Work Order — Riley work-graph orchestration

- Work Order ID: WO-2026-09-22-riley-work-graph-orchestration
- Status: active
- Requester: repository owner
- Orchestration owner: Riley Morgan / `ai-orchestrator`
- Current Work: CW-44 — Riley — work graph orchestration capability
- GitHub issue: #197 — Add Riley work-graph orchestration capability
- Phase 1 implementation branch: `feat/issue-197-riley-work-graph-orchestration`
- Current proof branch: `codex/cw44-runtime-dispatch-proof`
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
| 3. Runtime-aware dispatch | demonstrated / proof branch | A real supervised, read-only Codex child-agent path is recorded as supervisor-assigned graph Dispatch `CW44-P3-N1-D1` in [runtime-dispatch-proof.md](runtime-dispatch-proof.md); `/root/cw44_runtime_eval` is its runtime reference, and the collaboration API exposed no provider Dispatch UUID, session, branch, or worktree. |
| 4. Recovery and resumption | partial; post-persistence same-identity recovery demonstrated | Graph Dispatch `CW44-P4-N1-D1` maps to the persisted runtime reference `/root/cw44_phase4_recovery`; after interruption it re-read durable/live sources and continued the same identity. A separate no-history audit has its own graph Dispatch ID and reconstructed the earlier run and safe next action. A different agent taking over the interrupted runtime and runtime replacement/supersession were not exercised; the runtime exposes no provider Dispatch UUID. |
| 5. Validation and learning | in progress | Change Impact Reconciliation is complete. Repository validation run #107 passed on the prior checkpoint `f3a3520ae54ec7c89826f9d629107308bd0fe06b`; verify the identity-ledger update on the latest PR head and complete the representative Riley conformance case. |

## Non-goals

- Building another Herdr, Orca, Maestro, Vicoa, Vigilante, or Orloj.
- Adding a distributed queue, worker daemon, scheduler, model gateway, terminal multiplexer, or orchestration database.
- Mirroring volatile GitHub / CI / runtime state into Notion.
- Maximizing agent count.
- Self-learning model/runtime routing in this first implementation.

## Current checkpoint

[C12 | 2026-09-22] Phase 3 and the controlled post-persistence same-identity recovery are demonstrated. The runtime identity was saved before interruption; after fresh durable/live source checks, the same child continued and completed its read-only audit. A separate no-history agent reconstructed the earlier run. The Work Graph scenario evidence/confidence and generated data bundle were reconciled to this evidence while leaving its candidate status in place pending validation and conformance. Issue #197 remains open. Full Phase 4 is partial because a different agent did not take over the interrupted runtime and runtime replacement/supersession was not exercised.

[C13 | 2026-09-22] PR #200 is open for review. Repository validation run #103 passed on its then-current head `cffae1a3c5cc8c427432360107e3517ea2d06956`, including the generated-output check; the proof and Work Order checkpoint edits now need validation on the resulting PR head. The Cursor approval agent returned `APPROVED`, with no inline review threads at this checkpoint. Final Riley conformance remains pending, and issue #197 remains open. Phase 4 remains partial because no distinct-agent takeover or runtime replacement/supersession was exercised.

[C14 | 2026-09-22] PR #200 remains open. Repository validation run #104 passed on checkpoint commit `c23ade6ddfe51c349276e85922f7af842195eed7`, including the generated-output check. The Work Graph scenario confidence is being aligned to the successful repository validation result. Final Riley conformance remains pending; issue #197 remains open. Phase 4 remains partial because no distinct-agent takeover or runtime replacement/supersession was exercised.

[C15 | 2026-09-22] The Work Graph scenario confidence and generated bundle now reflect successful repository validation and the remaining conformance/recovery gaps. Repository validation run #106 passed on PR head `ba1436dcbcd568ae7bcec0ca18aa25b0d90de88d`. PR #200 and issue #197 remain open. Final Riley conformance and a distinct-agent takeover/runtime replacement remain unproven.

[C16 | 2026-09-22] The proof and Work Order now assign stable graph-level Dispatch IDs and map them to the actual runtime references; the IDs are supervisor-assigned because the adapter exposes no provider Dispatch UUID. Repository validation run #107 passed on the prior checkpoint `f3a3520ae54ec7c89826f9d629107308bd0fe06b`; the current identity-ledger update must be checked on the latest PR head. Final Riley conformance and distinct-agent takeover/runtime replacement remain outstanding; issue #197 stays open.

## Next action

The read-only change-impact reconciliation and PR validation evidence are recorded in `runtime-dispatch-proof.md`. Complete the representative Riley conformance review, address scoped findings, and inspect the latest checks and review feedback on open PR #200. Keep #197 open until all acceptance criteria pass; do not claim the untested runtime replacement path.
