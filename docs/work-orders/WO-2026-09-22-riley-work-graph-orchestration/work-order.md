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
| 4. Recovery and resumption | demonstrated at graph level; provider lifecycle remains opaque | `runtime-dispatch-proof.md` records same-identity continuation after interruption and a fresh low-reasoning agent taking over a separately interrupted WorkNode from the durable Work Order with no child transcript. Supervisor-assigned D2 became authoritative after D1 interruption. The adapter exposes no provider Dispatch/session UUID or runtime-level cancel/resume state. |
| 5. Validation and learning | conformance pass; final validation pending | Change Impact Reconciliation and lifecycle evidence are recorded. Riley's representative conformance response now has an independent Noor PASS; inspect the latest-head check after this checkpoint update, then merge and reconcile linked tracking. |

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


[C17 | 2026-09-22] A fresh no-history Dispatch D2 took over WorkNode CW44-P4-TAKEOVER-N1 after D1 was interrupted with its identity persisted. D2 re-read the Work Order, Skill, issue, and PR; reconstructed objective, dependencies, route, state, and next action without D1's transcript; and completed the bounded read-only audit. The proof records graph-level D1→D2 supersession; the runtime exposes no provider Dispatch UUID or lifecycle controls. PR #200 and issue #197 remain open. Final Riley conformance remains required.


[C18 | 2026-09-22] Repository validation run #115 passed on PR head `509eca48bc321c2e789ad235904a65c655e22d0d`, which contains the cross-agent recovery proof. The PR description and this Work Order now reflect the result; the latest-head workflow must include this checkpoint update. Issue #197 remains open. Riley conformance remains REVIEW and requires the prescribed archived projectless-task lifecycle.

[C19 | 2026-09-22] The recovery guidance now makes historical Dispatch identity, one-active-authority, graph disposition versus runtime cancellation permission, and post-dependency collision review explicit. Repository validation run #122 passed on current PR head `fbb97c23c229ddfef3ab8d0ee1a79656d4e4d0a9`. A fresh isolated Riley run using `gpt-6-luna` at low reasoning completed, received an independent Noor observation, and both projectless tasks were archived. Noor's overall result is REVIEW: the response did not explicitly state that the repository owner must inspect the old attempt's terminal CI state before approval is passed. PR #200 and issue #197 remain open; Chrome DevTools had only `about:blank`, with no target URL.

[C20 | 2026-09-22] The fresh projectless Riley conformance task `01a0cc74-146a-7d52-878c-7693e490fa4d` completed and was archived. It used the configured default model (exact model unavailable in task metadata) at low reasoning. Riley explicitly kept the approval Gate unsatisfied until the repository owner inspects evidence that the prior attempt can no longer act, its changed files, and its terminal CI state, then records approval; unknown or running CI is not terminal. A separate independent Noor observer child agent (`/root/noor_cw44_review`, `gpt-6-luna`, low reasoning) reviewed the captured response and returned PASS, resolving C19's REVIEW finding. No live repository, CI, runtime, or browser inspection was claimed; Chrome remained `about:blank` without a target URL. PR #200 and issue #197 remain open. Repository validation run #123 passed on pre-checkpoint head `914b70ee724e92ae0e03a16864f9c97f3d9af7f8`; this conformance-record update needs latest-head validation before merge.



[C21 | 2026-09-22] Repository validation run #125 passed on C20 head `3f78965f709dee3f4ccfc5af4eab4c1d0bc1597d`. This checkpoint records that result; inspect the validation triggered by C21 on the resulting branch head, then refresh review/linkage and merge #200 if all gates remain clear.

## Next action

Verify the latest-head repository validation triggered by C21, then refresh PR #200's current head/base, checks, reviews and linked issue state, and merge only if all gates remain clear. After merge, reconcile issue #197 and Current Work, then move this terminal Work Order into `docs/work-orders/archive/2026-09/`. Provider-level runtime lifecycle remains unobservable.