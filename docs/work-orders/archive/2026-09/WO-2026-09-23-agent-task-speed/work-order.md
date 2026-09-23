# Work Order — agent task speed: working copy and small-change lane

- Work Order ID: `WO-2026-09-23-agent-task-speed`
- Status: complete
- Completion boundary: this record applies only once its pull request merges. If that pull request closes unmerged, the package never lands.
- Created: 2026-09-23
- Last updated: 2026-09-23
- Requester: repository owner
- Orchestration owner: Riley Morgan / `ai-orchestrator`
- Operating route: Hermes desktop agent working in a clean working copy with the GitHub CLI
- Current Work: CW-47 — Persona-Library — agent task speed: working copy and small-change lane (#203)
- GitHub issue: #203
- Branch: `feat/issue-203-agent-task-speed`
- Base at start: `d93a4c7d561563d318ebb16167abbda49761b1be`; rebased onto `a1c2977daf2d08542057b1604e766470d47da07e` after #202 merged
- Request mode: update
- Artifact home: this single-file package. It is archived in its own pull request under the archive rule this change adds.

## Authorization and boundary

The requester asked to start the work that fixes the slowdown and to stop just before merging. That override narrows DEC-019 standing completion authorization: the branch, commits, and pull request are authorized, and merge is not.

Out of scope:

- the requester's own Codex reasoning-effort change;
- the #196 follow-ups;
- the #195 measurement.

## Outcome

Cut agent task time while GitHub stays the authority for remote state.

1. **`AGENTS.md` rule 12:** replace the local-checkout ban with a clean working copy created from freshly fetched `origin/main`.
   - Required GitHub checks still gate merge.
   - When no working copy exists, the GitHub integration is still the path.
2. **Work-Order necessity / small-change lane** in `docs/work-orders.md`: create a Work Order only when existing Current Work, issue/PR, and domain-specific artifacts do not already preserve enough durable execution/recovery state. One PR or one session are heuristics rather than gates; shared-schema, Decision, or governance changes may use the lighter lane when their authoritative surfaces already own the required state.
3. **Batched progress:**
   - Progress entries are committed with the related work.
   - Checkpoint-only commits are used only when an interruption would lose resumable state.
   - A completed package is archived in the pull request that finishes it.
4. **Record and guard:** DEC-024 records the rationale, and a validator plus a test guard the contract.

## Evidence

Observed at `d93a4c7` through the GitHub API on 2026-09-23:

- PR #200 has 50 commits, and each commit touches one Work Order file. Its branch triggered 30 CI runs: 24 succeeded, 5 failed, and 1 was cancelled.
- PR #198 has 26 commits, and PR #184 has 21.
- `main` has 10 one-page "Generate Applications navigation" commits from 2026-09-18.
- The 25 most recent CI runs took a median of 13 s (max 47 s).

Assumption: agent turns and round trips, not CI time, dominate task duration. This is not measured directly here; #195 owns token and context measurement.

## Mara placement and boundary review

This is a repository-defined review using Mara Okoye's placement contract, not a live consultation.

- **Placement:** the change extends existing surfaces. It adds no record type, space, or file type.
- **Ownership:**
  - `AGENTS.md` owns the repository operating rule.
  - `docs/work-orders.md` owns the lane and the lifecycle.
  - DEC-024 appends the rationale, qualifies DEC-018 and the earlier Work-Order assumptions in DEC-021 / DEC-022, and preserves Work Orders where they add unique recovery state.
  - The GitHub issue-implementation Operational Scenario keeps its owner recipe.
- **Pinned contract:** the `rickvang/tool-repo` GitHub contract is unchanged. Section 4 of its `ACCESS.md` already separates local truth from remote truth.

## Change-impact reconciliation

| Surface | Classification | Disposition |
|---|---|---|
| `AGENTS.md` rules 10–12 | Extends and qualifies | Updated |
| `docs/work-orders.md` use rule, recovery-state lane, Test Queue boundary, progress, archive | Extends | Updated |
| `docs/work-orders/README.md`, archive README, `ARCHITECTURE.md` | Qualifies the "trivial" wording | Updated |
| `content/orientation/docs.json` `work-order-start` non-trigger | Qualifies | Updated; mirror regenerated |
| GitHub issue-implementation Operational Scenario | Extends | Updated; `dist/data/library-data.js` regenerated |
| DEC-018 | Qualified by DEC-024 | Unchanged; listed in DEC-024 `qualifies` |
| DEC-021 / DEC-022 Work Order hierarchy | Qualified by DEC-024 | Current Work remains the durable cross-agent index; a Work Order is now explicitly optional when issue/PR/domain artifacts already preserve sufficient recovery state |
| DEC-019 standing authorization | Unrelated | Unchanged |
| Tool-use recipes that already allow a local checkout | Confirms | Unchanged |
| Archived Work Orders | Unrelated | Historical; unchanged |

## Validation

Before the recovery-state refinement, local validation on the implementation tree (rebased onto `a1c2977`) passed the build, content validation, 40-test CI set, and `git diff --check`. The contract was then corrected after #205 / TQ-40-001 exposed that the original one-session/no-shared-schema definition still over-created Work Orders.

The updated validator now also rejects an automatic non-trivial-work trigger and requires the recovery-state boundary plus Test Queue independence. **Latest-head GitHub CI is the required validation for this corrected revision; the earlier local result is historical evidence only.**

## Next action

The requester reviews the pull request and decides whether to merge it. After merge, reconcile CW-47 to Done.
