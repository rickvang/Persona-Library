# Runtime Dispatch Proof — CW-44

**Status:** Phase 3 runtime path demonstrated; context-free record reconstruction demonstrated; live durable interrupted-resume test remains.  
**Work Order:** [WO-2026-09-22-riley-work-graph-orchestration](work-order.md)  
**Issue:** [#197 — Add Riley work-graph orchestration capability](https://github.com/rickvang/Persona-Library/issues/197) (open; keep open)

## Source checkpoint

- Persona-Library `main`: `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`
- Current Work: [CW-44 — Riley — work graph orchestration capability](https://app.notion.com/p/3e3cd82535ff81829d1aefd3731f6788)
- Work Graph Skill: `.agents/skills/work-graph-orchestration/SKILL.md` (blob `e607621d1892a3cc62334d221dafc79611446905`)
- Work Order at this checkpoint: `docs/work-orders/WO-2026-09-22-riley-work-graph-orchestration/work-order.md` (on this branch)

## WorkNode packet

- **Node:** `CW44-P3-N1` (graph-local label; not runtime-issued)
- **Objective:** independently verify one bounded read-only runtime dispatch and its recovery references.
- **Dependency:** Phases 1–2 merged; fresh `main` and issue #197 checked before dispatch.
- **Route:** Codex child-agent runtime through `collaboration.spawn_agent`.
- **Returned runtime identity:** `/root/cw44_runtime_eval`. The tool exposed no separate Dispatch UUID, thread/session ID, branch, or worktree for this read-only execution.
- **Gates:** source re-fetch; read-only; no issue, branch, repository, or Notion mutations by the child; keep #197 open.
- **Disposition:** accepted as bounded Phase 3 execution/evaluation evidence; this does not accept CW-44 or #197.

## First live lifecycle

1. Spawned one bounded child. It fetched the Work Order, Skill, issue #197, and current `main`, then returned a source-grounded checkpoint without evaluation or mutation.
2. Continued the same returned identity with `collaboration.followup_task`; it re-fetched sources and reported a safe boundary.
3. The supervisor interrupted that running turn. `collaboration.interrupt_agent` returned `previous_status: running`; the agent tree then showed the same identity as interrupted.
4. The supervisor re-read Current Work, current `main`, issue #197, Work Order, Skill, and related branches, then continued `/root/cw44_runtime_eval`. The child re-fetched sources and completed the evaluation. No replacement was created.

This proves a live supervised child-agent route and an interruption followed by continuation on the same agent identity. **That first recovery was not transcript-independent:** CW-44 and the Work Order did not yet record the returned identity at the time of interruption, so the supervisor supplied it from live context.

## Context-free rehydration

After the runtime identity and first lifecycle were saved in this packet and the Work Order, a fresh child was started with `fork_turns: none` and only durable-source references. Its returned identity was `/root/cw44_recovery_rehydrate`; no separate dispatch/session UUID was exposed.

The child independently re-fetched CW-44, this branch's Work Order and proof, the main Skill, live `main`, issue #197, and collaboration runtime state. It reconstructed node `CW44-P3-N1`, its dependency and route, the prior runtime identity, the interruption/continuation history, the first cycle's evidence gap, current issue state, and the safe next action. It reported the original runtime as completed and did not mutate any source.

This demonstrates that a separate, transcript-free agent can reconstruct the prior run and its next recovery decision from Current Work, the Work Order, and live GitHub/runtime sources. It does **not** demonstrate resuming an interrupted runtime from the durable identifier: the original runtime was already completed when this audit ran.

## Remaining Phase 4 gate

A controlled durable-interruption test remains. It must:
1. define a bounded recovery WorkNode and source checkpoint;
2. start a fresh read-only child and persist its exact returned identity before interrupting it;
3. interrupt only after the durable record is saved;
4. re-read Current Work, Work Order, Skill, current `main` / issue, and live runtime state;
5. resume the same identity if the live runtime supports it, or explicitly disposition it before creating a new identity.

No new attempt should be created until the read-before-retry check passes. The test has not yet run.

## Placement and disposition

Following the repository's Mara Okoye placement review and Architecture guidance, this evidence belongs in the existing CW-44 Work Order package. It adds no canonical Skill, Tool recipe, Persona, runtime package, or database.

Phase 3 is demonstrated. Phase 4 is partial: another fresh agent reconstructed the saved run, but a post-persistence interrupted resume is still unproven. Repository validation, change-impact reconciliation, and final Riley conformance remain; keep #197 open.
