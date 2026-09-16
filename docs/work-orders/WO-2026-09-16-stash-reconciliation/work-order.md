# Work Order: Reconcile historical stashes against current main

- **Status:** ready-for-review
- **GitHub issue:** [#115](https://github.com/rickvang/Persona-Library/issues/115)
- **Branch:** `codex/issue-115-stash-reconciliation`
- **Base:** `8f77c24ec63f063a801943fc6d5d4f3009b666c7` (`origin/main`)
- **Request mode:** update / recovery reconciliation
- **Authorized target:** `rickvang/Persona-Library`
- **Scope:** reconstruct `stash@{0}` and `stash@{1}` on their original parents, compare their logical intent with current `main`, and preserve only a reviewable reconciliation record.
- **Non-goals:** wholesale stash application, historical generated-output transplant, `.codex-tmp` recovery, merge, stash deletion, or changes to current routing, validator, package, or source ownership.

## Placement and boundary review

Mara Okoye’s placement gate resolves this as a project-scoped recovery report. The existing `docs/work-orders/<id>/` package is the correct destination; no new Persona, Skill, Tool, Playbook, Decision, space, or production workflow is warranted. The report remains separate from canonical library records and does not grant additional mutation permission.

## Progress

- [x] Confirm current `main` and issue #115 from the live GitHub surface.
- [x] Preserve both historical stashes without dropping, popping, rewriting, or branching from a stash.
- [x] Record both stash parent/base commits.
- [x] Reconstruct and inspect each stash on its original parent; both applications were clean.
- [x] Compare the stash snapshots and their divergent base histories.
- [x] Classify each substantive logical change against current `main`.
- [x] Decide whether any source change should be ported forward.
- [x] Check current focused validation and record the unrelated baseline validator limitation.
- [ ] Review and merge this report through the normal pull-request process, if approved.

## Result

No still-valid unique authored source change was identified. Current `main` already contains the recovered routing, Skill metadata, local `pl-skill-creator` identity, validator coverage, and Guide behavior in the newer route-group/modular architecture. Historical generated files and temporary plan files are intentionally not recovered.

The detailed evidence and classification are in [reconciliation.md](reconciliation.md).

## Stash disposition

Both original stashes remain intact and are not to be dropped as part of this Work Order. Since no recovery implementation is justified, stash deletion is not necessary for completion and remains an explicit future cleanup decision.

## Validation boundary

The focused validation suite passed all 6 tests. The top-level validator was attempted on the clean current baseline and stops at the pre-existing mismatch in `dist/data/library-data.js`; no stash-derived source change caused that failure, and no generated rebuild was run because no authored recovery survived reconciliation.

## Next action

Review the reconciliation report and, if accepted, preserve the stashes for any separately authorized cleanup rather than opening a source-recovery PR.
