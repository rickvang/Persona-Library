# Runtime Dispatch Proof — CW-44

**Status:** Phase 3 runtime path demonstrated; Phase 4 durable recovery test in progress.  
**Work Order:** [WO-2026-09-22-riley-work-graph-orchestration](work-order.md)  
**Issue:** [#197 — Add Riley work-graph orchestration capability](https://github.com/rickvang/Persona-Library/issues/197) (open; keep open)

## Source checkpoint

- Persona-Library `main`: `577a830a6befc659f83844eaaa4fbe3c8cae9ef2`
- Current Work: [CW-44 — Riley — work graph orchestration capability](https://app.notion.com/p/3e3cd82535ff81829d1aefd3731f6788)
- Work Graph Skill: `.agents/skills/work-graph-orchestration/SKILL.md` (blob `e607621d1892a3cc62334d221dafc79611446905`)
- Work Order source at checkpoint: `docs/work-orders/WO-2026-09-22-riley-work-graph-orchestration/work-order.md` (blob `94d23d75d27b4671528bc8e2788032b97f19a3d2`)

## WorkNode packet

- **Node:** `CW44-P3-N1` (graph-local label; not a runtime-issued ID)
- **Objective:** independently verify a bounded read-only runtime dispatch and its durable recovery references.
- **Dependency:** Phases 1–2 merged, with current `main` and issue state rechecked before dispatch.
- **Route:** Codex child-agent runtime through `collaboration.spawn_agent`.
- **Returned runtime identity:** `/root/cw44_runtime_eval`. The collaboration API returned this agent name; it exposed no separate Dispatch UUID, thread/session ID, branch, or worktree for this read-only execution.
- **Gates:** source re-fetch; read-only; no issue, branch, repository, or Notion mutations by the child; keep #197 open.
- **Evidence expected:** current source refs, independent evaluation, lifecycle observation, and explicit limits/disposition.

## First live lifecycle

1. Spawned one bounded child. It fetched the Work Order, Skill, issue #197, and current `main`, then returned a source-grounded safe checkpoint without evaluating or mutating.
2. Continued the same returned agent identity with `collaboration.followup_task`; it re-fetched the durable sources and reported a safe boundary.
3. The supervisor interrupted that running turn. `collaboration.interrupt_agent` returned `previous_status: running`; the agent tree then showed the same identity as interrupted.
4. The supervisor re-read Current Work, current `main`, issue #197, Work Order, Skill, and related branches, then continued `/root/cw44_runtime_eval`. The child re-fetched sources and completed the evaluation. No replacement was created in this first lifecycle.

This proves a real supervised child-agent route and an interruption followed by continuation on the same agent identity. **It does not by itself prove transcript-independent recovery:** at the time of that interruption, CW-44 and the Work Order did not yet record the returned runtime identity. The supervisor supplied the identity from live context on continuation. That first recovery cycle is therefore a demonstration with this explicit evidence gap, not a passed durable-recovery gate.

## Durable recovery test

The returned runtime identity and lifecycle evidence are now being recorded here and in the Work Order before a fresh recovery attempt. The next test will read these saved records and live runtime state, then exercise an interrupted attempt and/or an explicit replacement. Any replacement must be a new returned agent identity, created only after the prior attempt is recorded interrupted/superseded. The test is pending; no result is claimed yet.

## Placement and disposition

Following the repository's Mara Okoye placement review and Architecture guidance, this evidence belongs in the existing CW-44 Work Order package. It adds no canonical Skill, Tool recipe, Persona, runtime package, or database.

The first read-only child result is accepted as bounded Phase 3 evidence. The WorkNode remains under review for Phase 4 recovery, repository validation, change-impact reconciliation, and final Riley conformance. Phase 3/4 evidence does not satisfy all of #197; keep the issue open.
