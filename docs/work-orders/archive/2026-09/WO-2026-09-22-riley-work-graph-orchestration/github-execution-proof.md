# GitHub execution proof — PR #198

This is a **repository-level work-graph proof** for CW-44 Phase 2. It uses the actual Phase 1 implementation of Riley Work Graph Orchestration rather than a synthetic fixture.

It proves GitHub execution semantics, evidence gates, correction/review behavior, and durable reconciliation. It does **not** prove a child-agent runtime such as Codex or Work was supervised as a live executor; that remains a separate Phase 3 requirement.

## Proof identity

- Current Work: CW-44 — Riley — work graph orchestration capability
- GitHub issue: #197 — Add Riley work-graph orchestration capability
- Phase 1 pull request: #198 — Add Riley work graph orchestration foundation
- Authoritative Phase 1 branch: `feat/issue-197-riley-work-graph-orchestration`
- Accepted merge commit: `777144e3130f08b636ee231ec781696a18fe16a6`
- Final pre-merge validation: repository validation run #98 — success
- Review evidence: Cursor approval plus four Codex review threads, all addressed and resolved before merge

## WorkGraph reconstruction

### WorkNode WG197-N1 — Phase 1 foundation

**Objective:** add the portable Work Graph Orchestration capability, Riley integration, operational scenario, orientation route, focused validation, and durable Work Order checkpoint.

**Dependencies:** existing Riley orchestration capabilities, Current Work / Work Order authority contract, bounded-parallel implementation Playbook, pinned GitHub operating contract.

**Completion evidence:** authored content valid; focused tests pass; generated output fresh; review findings resolved; merge preflight fresh; PR merged; durable checkpoint reconciled.

**Final state:** accepted.

### Authoritative Dispatch WG197-N1-D1

- route: direct GitHub Tool-backed repository execution in the originating Chat;
- branch: `feat/issue-197-riley-work-graph-orchestration`;
- PR: #198;
- source checkpoint at dispatch: `c9b24363fd24ab63f7376fc4ff5a7106c6268ac2`;
- final dispatch head: `c942db233b510d0520e0ce3bbe629cefee41445d`;
- disposition: accepted / merged as `777144e3130f08b636ee231ec781696a18fe16a6`.

The branch and PR are references owned by this Dispatch; they are not the WorkNode identity.

## Gate trace

| Gate | Evidence | Result |
| --- | --- | --- |
| Source / placement | Existing Riley Skills, bounded-parallel Playbook, Current Work contract inspected before adding a new capability | passed |
| Collision / dependency | Phase 1 remained one serialized repository lane; no second implementation lane was created for overlapping canonical files | passed |
| Content validation | CI runs exposed successive schema/validator issues; each failure was inspected before correction | passed on run #98 |
| Generated-output freshness | Build output diff identified the exact missing separator; committed output matched a clean build | passed on run #98 |
| Review | Cursor approved; Codex produced four concrete findings | passed after all four were addressed and threads resolved |
| Merge authorization / freshness | Current PR head, base freshness, CI, reviews, threads, and mergeability were re-read immediately before merge | passed |
| Durable reconciliation | Work Order was corrected before merge; Current Work was checkpointed; premature post-merge issue closure was detected and #197 reopened | passed for Phase 1 |

## Read-before-retry evidence

The implementation encountered several repository validation failures. Riley did **not** create replacement branches or duplicate PRs.

1. CI run #90 failed on an overstrict catalog assertion. The failed job log was inspected, the validator boundary was corrected, and the same Dispatch continued.
2. CI run #91 failed because the new Operational Scenario used an unsupported evidence status. The failure was inspected and corrected in the same Dispatch.
3. CI run #93 exposed missing established Operational Scenario fields. Riley inspected the current schema and conformed the scenario instead of weakening validation.
4. CI run #94 showed the Skills route count was stale. Riley inspected the orientation validator/bootstrap and updated the canonical route count and expected route ID.
5. CI run #96 passed content/tests but failed generated-output freshness. Riley inspected the exact diff and committed only the missing generated separator.
6. CI run #97 passed all repository gates. Codex review then exposed durable Work Order drift; Riley reconciled the Work Order and run #98 passed.
7. After merge, GitHub linked-completion closed #197 although later CW-44 phases remained. Riley re-read live issue state and reopened #197 rather than assuming the intended state survived the merge.

These are **correction/recovery events inside one authoritative Dispatch**, not new Dispatches. A new Dispatch would have been required only if D1 were abandoned, superseded, reassigned to another execution attempt, or replaced by a new branch/task/session intended to own the WorkNode.

## GitHub mapping proven by this case

```text
GitHub issue / scoped phase
→ WorkNode
→ authoritative Dispatch
→ owned branch
→ PR
→ CI / review / authorization Gates
→ merge or explicit unmerged stop
→ Dispatch disposition
→ WorkNode state
→ Work Order / Current Work reconciliation
```

### Identity rules

- **WorkNode:** stable objective identity; survives retries, corrections, branch updates, CI reruns, and review cycles.
- **Dispatch:** one authoritative execution attempt. It may accumulate commits, CI reruns, review corrections, and PR updates without changing identity.
- **New Dispatch:** required when the current attempt is abandoned, superseded, reassigned, or replaced by a different execution route that will now own the node.
- **Branch / PR:** evidence and execution references owned by a Dispatch, not substitutes for node/dispatch identity.
- **CI run / review event:** evidence events inside a Dispatch, never Dispatch identity by themselves.

## Collision and sequential fallback rule

Parallel repository nodes may dispatch only when their dependency and mutation surfaces are independent enough to review and merge safely.

Serialize when:

- nodes edit the same canonical file or generated output;
- one node changes schema, architecture, or a contract consumed by another;
- a later node depends on a merge/base state created by an earlier node;
- the overlap is unknown or cannot be inspected before dispatch.

If a collision is discovered after dispatch, freeze the affected later node, re-read the new base after the earlier node settles, then resume/rebase or supersede explicitly. Do not keep both lanes editing conflicting authority in parallel.

## What remains unproven

- No child-agent runtime was created or resumed by Riley in this case.
- No runtime session/task ID exists beyond GitHub branch/PR identity.
- No abandoned Dispatch was replaced by a second live Dispatch.
- Cross-runtime callback/lease behavior remains unproven.

Therefore this proof satisfies the repository/GitHub semantics slice and a repository-level read-before-retry recovery case, but **does not satisfy Phase 3's live agent-runtime dispatch proof**.
