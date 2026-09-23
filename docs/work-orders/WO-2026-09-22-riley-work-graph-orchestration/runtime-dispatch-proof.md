# Runtime Dispatch Proof — CW-44

**Status:** Phase 3 demonstrated; Phase 4 includes same-identity continuation and a fresh-agent, transcript-free takeover of a bounded WorkNode. Provider-level runtime lifecycle remains opaque; final Riley conformance is pending.
**Work Order:** [WO-2026-09-22-riley-work-graph-orchestration](work-order.md)
**Issue:** [#197 — Add Riley work-graph orchestration capability](https://github.com/rickvang/Persona-Library/issues/197) (open; keep open)

## Source checkpoint

- Persona-Library `main`: `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`
- Current Work: [CW-44 — Riley — work graph orchestration capability](https://app.notion.com/p/3e3cd82535ff81829d1aefd3731f6788)
- Work Graph Skill: `.agents/skills/work-graph-orchestration/SKILL.md` (blob `e607621d1892a3cc62334d221dafc79611446905`)
- Durable recovery packet branch: `codex/cw44-runtime-dispatch-proof`

## Dispatch ID ledger

Dispatch IDs are supervisor-assigned work-graph identities. The Codex collaboration runtime exposed returned agent identities but no provider Dispatch UUID. This ledger maps each actual execution to a stable graph-level ID before its execution evidence is accepted in this packet; it does not claim the runtime returned these IDs. Any future retry or reassignment must allocate and persist the next Dispatch ID before dispatch. No retry or reassignment occurred for these completed attempts.

| WorkNode | Graph Dispatch ID | Runtime reference | Lifecycle / disposition |
| --- | --- | --- | --- |
| `CW44-P3-N1` | `CW44-P3-N1-D1` | `/root/cw44_runtime_eval` | One attempt; interrupted and continued under the same runtime identity; completed and accepted as bounded Phase 3 evidence. |
| `CW44-P3-REHYDRATE-N1` | `CW44-P3-REHYDRATE-N1-D1` | `/root/cw44_recovery_rehydrate` | Separate context-free reconstruction audit; completed; reconstructed the checkpoint but did not take over or resume an interrupted runtime. |
| `CW44-P4-N1` | `CW44-P4-N1-D1` | `/root/cw44_phase4_recovery` | Returned runtime identity was persisted before interruption; same identity resumed and completed; partial recovery evidence. |
| CW44-P4-TAKEOVER-N1 | CW44-P4-TAKEOVER-N1-D1 | `/root/cw44_cross_takeover_d1` | Interrupted after persisted identity; superseded at graph level by D2. |
| CW44-P4-TAKEOVER-N1 | CW44-P4-TAKEOVER-N1-D2 | `/root/cw44_cross_takeover_d2` | Fresh agent completed the read-only takeover audit from durable state; accepted for this WorkNode. |

## Phase 3 WorkNode — `CW44-P3-N1`

- **Objective:** independently verify one bounded read-only runtime dispatch and its recovery references.
- **Dependency:** Phases 1–2 merged; fresh `main` and issue #197 checked before dispatch.
- **Route:** Codex child-agent runtime through `collaboration.spawn_agent`.
- **Graph Dispatch ID:** `CW44-P3-N1-D1`, supervisor-assigned and mapped to this execution before accepting its evidence in this packet.
- **Returned runtime identity:** `/root/cw44_runtime_eval`. This is the runtime reference; the tool exposed no separate Dispatch UUID, thread/session ID, branch, or worktree for this read-only execution.
- **Disposition:** accepted as bounded Phase 3 execution/evaluation evidence under graph Dispatch `CW44-P3-N1-D1`; this does not accept CW-44 or #197.

The child fetched the Work Order, Skill, issue, and current `main`, returned a source-grounded checkpoint, was followed under the same identity, and was interrupted while running. The supervisor re-read Current Work, main, issue, Work Order, and Skill, then continued that same identity; the child re-fetched sources and completed. No replacement was created. At the time of this first interruption, however, the identity was absent from the durable records, so the supervisor supplied it from live context. This first recovery is not transcript-independent.

## Context-free rehydration audit

After the Phase 3 identity and lifecycle were recorded, a separate child was started with `fork_turns: none` and only durable-source references. This audit is recorded as graph Dispatch `CW44-P3-REHYDRATE-N1-D1` under WorkNode `CW44-P3-REHYDRATE-N1`; its returned runtime identity was `/root/cw44_recovery_rehydrate`, and no separate dispatch/session UUID was exposed.

It re-fetched CW-44, this branch's Work Order and proof, the main Skill, live `main`, issue #197, and collaboration runtime state. It reconstructed the P3 node, dependency, route, prior runtime identity, lifecycle, evidence gap, current issue state, and safe next action. It found the original runtime completed and made no mutations.

This shows that a fresh agent can reconstruct the prior run and recovery decision without child transcripts. It did not itself resume an interrupted runtime.

## Phase 4 WorkNode — `CW44-P4-N1`

- **Objective:** test one controlled, read-only child interruption after its returned runtime identity has been persisted, then rehydrate and continue the same identity if supported.
- **Dependencies:** P3 evidence and the context-free rehydration audit above.
- **Source checkpoint:** `main` `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`; issue #197 open; Current Work at checkpoint C09; this packet and Work Order on `codex/cw44-runtime-dispatch-proof`.
- **Route / boundary:** Codex child-agent runtime; read-only source review; no repository, branch, issue, PR, or Notion mutations by the child.
- **Graph Dispatch ID:** `CW44-P4-N1-D1`, supervisor-assigned and mapped to the run from its persisted runtime identity; the collaboration API exposed no provider Dispatch UUID.
- **Returned runtime identity:** `/root/cw44_phase4_recovery`. The collaboration API exposed the agent name only, with no separate session, branch, or worktree.
- **Disposition:** accepted as partial evidence under graph Dispatch `CW44-P4-N1-D1`. No replacement was created because the same identity resumed safely.

### Lifecycle evidence

1. Fresh source and live-state checks confirmed the node was ready. The child was spawned and observed running.
2. Before interruption, the returned identity was written to this packet (commit `c605a0bb6c38e35f04709983f252cc007e2bd08e`) and the Work Order (commit `81e877ad08f982a763d129760d9640d011c4d11b`).
3. `collaboration.interrupt_agent` returned `previous_status: running`; the next live agent listing showed `/root/cw44_phase4_recovery` interrupted.
4. The supervisor then re-read Current Work, the Work Order and packet, main Skill, current `main`, issue #197, and live runtime state. At this recovery checkpoint, the durable branch tip was `13bf836c9726d54fcf1de6ee4d409c40e833ac42`, main remained `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`, and #197 was open.
5. The supervisor continued only `/root/cw44_phase4_recovery`. The child was instructed to disregard earlier child messages, re-fetch the saved/current sources, and perform a bounded read-only audit. It confirmed the persisted identity and interruption checkpoint, judged same-identity continuation safe, re-fetched the sources, and made no mutations. No replacement was created.

This demonstrates a post-persistence interruption, source rehydration, and continuation of the same returned runtime identity. The collaboration API does not expose a provider-issued Dispatch ID. Supervisor-assigned graph Dispatch `CW44-P4-N1-D1` maps to the persisted runtime identity and observed lifecycle; it is not represented as a runtime-returned value. The separate no-history audit demonstrated reconstruction by another fresh agent, but did not itself send the continuation.


## Cross-agent takeover WorkNode — `CW44-P4-TAKEOVER-N1`

- **Objective:** demonstrate that a fresh agent can resume a bounded, read-only CW-44 recovery audit from the durable Work Order after its first Dispatch is interrupted, without the interrupted agent's transcript.
- **Dependency:** existing Phase 4 same-identity recovery evidence; this node does not mutate Persona-Library sources.
- **Route / boundary:** Codex collaboration child agents; read-only inspection of this Work Order, the Work Graph Skill, issue #197, and PR #200.
- **Graph Dispatch D1:** `CW44-P4-TAKEOVER-N1-D1`, allocated before dispatch; returned runtime identity `/root/cw44_cross_takeover_d1` persisted while running.
- **Graph Dispatch D2:** `CW44-P4-TAKEOVER-N1-D2`, allocated before dispatch; fresh runtime identity `/root/cw44_cross_takeover_d2` persisted while running.
- **Current state:** D1 `/root/cw44_cross_takeover_d1` is interrupted (interrupt call returned `previous_status: running`) and superseded at graph level. D2 `/root/cw44_cross_takeover_d2` was the sole authoritative active attempt and completed this bounded node.

### Lifecycle and recovery evidence

1. D1 was allocated and persisted as ready before dispatch (commit `ad477ef44c1374def9fc49567a8361e2c7890ccf`).
2. D1 `/root/cw44_cross_takeover_d1` was observed running. Its returned identity and running state were persisted before interruption (commit `686d23c50add9d3f6b1372fca4d5e66f4237324a`).
3. `collaboration.interrupt_agent` returned `previous_status: running`. The supervisor then marked D1 interrupted, allocated D2, and persisted that D2 was the next attempt (commit `8e1f9e5d47bb975c5ee8c381d274bc251273563e`).
4. D2 `/root/cw44_cross_takeover_d2` was started with `fork_turns: none` and only durable source references. Its identity was recorded while it was running (commit `df7ee5463c29bede0a2b0365e0db9fa392b4a25d`).
5. D2 re-fetched this Work Order/proof, the main Work Graph Skill, issue #197, and PR #200. It reconstructed the WorkNode objective, dependencies, read-only boundary, D1 interruption, and D2 authority without D1's transcript. It verified #197 and #200 remained open, run #113 succeeded on the then-current head, and both older review threads were resolved/outdated.
6. D2 completed the bounded audit without mutations and returned a source-grounded acceptance-gap report. Its WorkNode disposition is accepted; D1 is superseded at the work-graph level.

This demonstrates transcript-free, cross-agent recovery for the bounded WorkNode and graph-level replacement of D1 by D2. The collaboration API still exposes only agent names—not a provider Dispatch UUID, session ID, or runtime-level cancel/resume state—so the packet does not claim provider-level lifecycle control.

## Change Impact Reconciliation

- **Status:** complete for the bounded CW-44 evidence change, including the fresh-agent D1→D2 WorkNode takeover and alignment of the operational-scenario source/generated bundle. Repository validation run #119 passed on head `08c49d3dd8643a550bdd3abcdcc675f24d810e56`, including the scenario/bundle reconciliation. The PR has an existing Cursor `APPROVED` submission. Both earlier Codex review threads are resolved/outdated. Final Riley conformance remains pending.
- **Initiating contract:** Work Graph Orchestration Skill (`external_execution`, `multi-agent-supervision`, reconciliation `change-impact-reconciliation`). One universal read-only reconciliation pass was run; no recursion.
- **Scope checked:** CW-44 Current Work, this Work Order, issue #197, the Work Graph Skill, Skills orientation route, Work Graph operational-scenario source and index, `content/library-model.js`, `ARCHITECTURE.md`, `scripts/validate-content.mjs`, and the generated scenario bundle. Search was bounded to the declared route, named owners, and repository dependency guidance; it was not a full repository-wide relationship graph audit.
- **Impacts:**
  - Work Graph operational scenario — **qualifies / extends**, high confidence: live dispatch, persisted-identity same-agent continuation, and a fresh agent taking over a separate interrupted WorkNode from durable state are evidenced. Its `candidate` evidence status remains pending final Riley conformance; provider-level runtime identity/lifecycle remains unavailable.
  - CW-44 Work Order and Current Work — **extends**, high confidence: durable checkpoints now link the proof and keep the work active.
  - Issue #197 — **qualifies**, high confidence: runtime proof advances Phases 3–4 but does not satisfy all acceptance criteria; it remains open.
  - Work Graph Skill, Skills route, scenario index, and canonical relationship model — **confirms / unrelated**, high confidence: no capability identity, route, owner, or typed relationship changed; no Skill or index update was needed.
- **Required updates:** updated the Work Graph scenario evidence/confidence and the generated `dist/data/library-data.js` bundle; updated the Work Order and CW-44 checkpoint.
- **Optional follow-up:** probe provider-issued Dispatch/session identity or runtime-level cancellation/replacement only if a future adapter exposes those capabilities; graph-level D1→D2 supersession is now evidenced.
- **Unchanged checked:** Skill contract and relationships; Skills route and scenario index; issue acceptance checklist and open state; unrelated Persona, Tool, Operating Pack, and workflow sources were outside this bounded execution-record change.
- **Generated outputs:** the scenario's generated data bundle was refreshed with the authored scenario. No page/module outputs were affected. Repository validation run #104 passed its build, authored/generated-content validation, repository tests, PR whitespace check, and generated-output check on checkpoint commit `c23ade6ddfe51c349276e85922f7af842195eed7`; the PR's latest-head check remains the authority for subsequent edits.
- **Blockers and limits:** the runtime returns agent names but no provider Dispatch/session UUID or runtime-level cancel/resume state. Graph-level cross-agent takeover and D1→D2 supersession are evidenced for a bounded read-only WorkNode. Final Riley conformance remains required; inspect the latest PR-head checks and any new review feedback.
- **Next action:** complete the representative Riley conformance case, address any scoped review findings, and keep #197 open while checking the latest PR-head evidence.

## Remaining limits and next gates

- Fresh D2 took over this bounded WorkNode after D1 was interrupted. It reconstructed objective, dependencies, route, state, and evidence from the Work Order and live sources without D1's transcript. This demonstrates graph-level WorkNode recovery; D2 did not inspect hidden provider runtime state.
- Graph-level replacement/supersession was exercised: D2 became authoritative after D1 was interrupted. Provider-level cancellation or runtime replacement remains untested because the collaboration API exposes no provider Dispatch/session identifier or lifecycle introspection.
- Phase 3/4 evidence does not complete CW-44 or #197. Transcript-independent graph-level takeover is now demonstrated; the representative Riley conformance run remains outstanding.

Following the repository's Mara Okoye placement review and Architecture guidance, keep this evidence in the existing CW-44 Work Order package. It adds no canonical Skill, Tool recipe, Persona, runtime package, or database. Keep #197 open.


## Riley / Noor conformance checkpoint — 2026-09-22

- **Riley run:** fresh projectless Codex task `01a0cc74-146a-7d52-878c-7693e490fa4d`, archived after its response was captured. It used Riley Morgan / `ai-orchestrator` with Work Graph Orchestration at low reasoning; the configured default model was used without an override, and the exact model is not exposed in the task record.
- **Observed result:** WorkNode B stays blocked across distinct historical Dispatch attempts with at most one active authority. A/C are independent; B waits for A and requires a post-A collision review. The response separates graph disposition, runtime stop/cancel authority, and repository-owner approval. It makes approval contingent on inspecting the prior attempt's inactivity evidence, changed files, terminal CI state, and recording approval; unknown or running CI is not terminal.
- **Independent observer:** a separate low-reasoning Noor observer reviewed the captured response and returned PASS. It cited the explicit three-item repository-owner review condition that addressed the prior REVIEW finding. The observer made no repository or runtime claims.
- **Limits:** the Riley task inspected no live repository, CI, runtime, or browser state. Chrome had only `about:blank` and no target URL. Provider-issued Dispatch/session identity and runtime-level lifecycle controls remain unavailable; the demonstrated recovery contract is graph-level.
- **Disposition:** focused Riley/Noor conformance passes. Overall CW-44 remains pending the updated PR-head validation, merge, and tracker reconciliation.
