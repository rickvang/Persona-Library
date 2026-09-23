# Runtime Dispatch Proof — CW-44

**Status:** Phase 3 demonstrated; one post-persistence interrupt and same-identity continuation demonstrated; full Phase 4 remains partial.  
**Work Order:** [WO-2026-09-22-riley-work-graph-orchestration](work-order.md)  
**Issue:** [#197 — Add Riley work-graph orchestration capability](https://github.com/rickvang/Persona-Library/issues/197) (open; keep open)

## Source checkpoint

- Persona-Library `main`: `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`
- Current Work: [CW-44 — Riley — work graph orchestration capability](https://app.notion.com/p/3e3cd82535ff81829d1aefd3731f6788)
- Work Graph Skill: `.agents/skills/work-graph-orchestration/SKILL.md` (blob `e607621d1892a3cc62334d221dafc79611446905`)
- Durable recovery packet branch: `codex/cw44-runtime-dispatch-proof`

## Phase 3 WorkNode — `CW44-P3-N1`

- **Objective:** independently verify one bounded read-only runtime dispatch and its recovery references.
- **Dependency:** Phases 1–2 merged; fresh `main` and issue #197 checked before dispatch.
- **Route:** Codex child-agent runtime through `collaboration.spawn_agent`.
- **Returned runtime identity:** `/root/cw44_runtime_eval`. The tool exposed no separate Dispatch UUID, thread/session ID, branch, or worktree for this read-only execution.
- **Disposition:** accepted as bounded Phase 3 execution/evaluation evidence; this does not accept CW-44 or #197.

The child fetched the Work Order, Skill, issue, and current `main`, returned a source-grounded checkpoint, was followed under the same identity, and was interrupted while running. The supervisor re-read Current Work, main, issue, Work Order, and Skill, then continued that same identity; the child re-fetched sources and completed. No replacement was created. At the time of this first interruption, however, the identity was absent from the durable records, so the supervisor supplied it from live context. This first recovery is not transcript-independent.

## Context-free rehydration audit

After the Phase 3 identity and lifecycle were recorded, a separate child was started with `fork_turns: none` and only durable-source references. Its returned identity was `/root/cw44_recovery_rehydrate`; no separate dispatch/session UUID was exposed.

It re-fetched CW-44, this branch's Work Order and proof, the main Skill, live `main`, issue #197, and collaboration runtime state. It reconstructed the P3 node, dependency, route, prior runtime identity, lifecycle, evidence gap, current issue state, and safe next action. It found the original runtime completed and made no mutations.

This shows that a fresh agent can reconstruct the prior run and recovery decision without child transcripts. It did not itself resume an interrupted runtime.

## Phase 4 WorkNode — `CW44-P4-N1`

- **Objective:** test one controlled, read-only child interruption after its returned runtime identity has been persisted, then rehydrate and continue the same identity if supported.
- **Dependencies:** P3 evidence and the context-free rehydration audit above.
- **Source checkpoint:** `main` `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`; issue #197 open; Current Work at checkpoint C09; this packet and Work Order on `codex/cw44-runtime-dispatch-proof`.
- **Route / boundary:** Codex child-agent runtime; read-only source review; no repository, branch, issue, PR, or Notion mutations by the child.
- **Returned runtime identity:** `/root/cw44_phase4_recovery`. The collaboration API exposed the agent name only, with no separate Dispatch UUID, session, branch, or worktree.
- **Disposition:** accepted for this bounded recovery test. No replacement was created because the same identity resumed safely.

### Lifecycle evidence

1. Fresh source and live-state checks confirmed the node was ready. The child was spawned and observed running.
2. Before interruption, the returned identity was written to this packet (commit `c605a0bb6c38e35f04709983f252cc007e2bd08e`) and the Work Order (commit `81e877ad08f982a763d129760d9640d011c4d11b`).
3. `collaboration.interrupt_agent` returned `previous_status: running`; the next live agent listing showed `/root/cw44_phase4_recovery` interrupted.
4. The supervisor then re-read Current Work, the Work Order and packet, main Skill, current `main`, issue #197, and live runtime state. At this recovery checkpoint, the durable branch tip was `13bf836c9726d54fcf1de6ee4d409c40e833ac42`, main remained `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`, and #197 was open.
5. The supervisor continued only `/root/cw44_phase4_recovery`. The child was instructed to disregard earlier child messages, re-fetch the saved/current sources, and perform a bounded read-only audit. It confirmed the persisted identity and interruption checkpoint, judged same-identity continuation safe, re-fetched the sources, and made no mutations. No replacement was created.

This demonstrates a post-persistence interruption, source rehydration, and continuation of the same returned runtime identity. The collaboration API does not expose a separate stable Dispatch ID, so the proof can cite only the returned agent identity and observed lifecycle. The separate no-history audit demonstrated reconstruction by another fresh agent, but did not itself send the continuation.

## Change Impact Reconciliation

- **Status:** complete for the bounded CW-44 evidence change; the PR's repository validation and human review gates remain pending.
- **Initiating contract:** Work Graph Orchestration Skill (`external_execution`, `multi-agent-supervision`, reconciliation `change-impact-reconciliation`). One universal read-only reconciliation pass was run; no recursion.
- **Scope checked:** CW-44 Current Work, this Work Order, issue #197, the Work Graph Skill, Skills orientation route, Work Graph operational-scenario source and index, `content/library-model.js`, `ARCHITECTURE.md`, `scripts/validate-content.mjs`, and the generated scenario bundle. Search was bounded to the declared route, named owners, and repository dependency guidance; it was not a full repository-wide relationship graph audit.
- **Impacts:**
  - Work Graph operational scenario — **qualifies / extends**, high confidence: live dispatch and a persisted-identity same-agent interrupt/resume are now evidenced; fresh-agent reconstruction is also evidenced. The scenario confidence and evidence list were updated. Its `candidate` evidence status remains because repository validation and final conformance have not passed, and distinct-agent takeover/replacement remains unproven.
  - CW-44 Work Order and Current Work — **extends**, high confidence: durable checkpoints now link the proof and keep the work active.
  - Issue #197 — **qualifies**, high confidence: runtime proof advances Phases 3–4 but does not satisfy all acceptance criteria; it remains open.
  - Work Graph Skill, Skills route, scenario index, and canonical relationship model — **confirms / unrelated**, high confidence: no capability identity, route, owner, or typed relationship changed; no Skill or index update was needed.
- **Required updates:** updated the Work Graph scenario evidence/confidence and the generated `dist/data/library-data.js` bundle; updated the Work Order and CW-44 checkpoint.
- **Optional follow-up:** exercise a different-agent takeover and explicit runtime replacement/supersession only if a future live condition makes same-identity recovery unavailable or unsafe.
- **Unchanged checked:** Skill contract and relationships; Skills route and scenario index; issue acceptance checklist and open state; unrelated Persona, Tool, Operating Pack, and workflow sources were outside this bounded execution-record change.
- **Generated outputs:** the scenario's generated data bundle was refreshed with the authored scenario. No page/module outputs were affected. GitHub CI has not run yet; it is the required repository validation check.
- **Blockers and limits:** runtime returns an agent name but no separate stable Dispatch/session ID. The replacement path remains unproven. PR CI, review, and final Riley conformance are still required.
- **Next action:** open the reviewable PR, inspect CI/review evidence, complete the Riley conformance case, and keep #197 open until all criteria pass.

## Remaining limits and next gates

- A different agent taking over an interrupted runtime without any child transcript was not exercised; the fresh agent independently reconstructed the checkpoint and next action.
- Runtime replacement/supersession was not exercised because same-identity continuation was available and safe. The repository-level Phase 2 proof in PR #199 covers correction versus new Dispatch semantics, but that does not substitute for a runtime replacement test.
- Phase 3/4 proof does not complete CW-44 or #197. Repository validation, change-impact reconciliation, and final Riley conformance remain.

Following the repository's Mara Okoye placement review and Architecture guidance, keep this evidence in the existing CW-44 Work Order package. It adds no canonical Skill, Tool recipe, Persona, runtime package, or database. Keep #197 open.
