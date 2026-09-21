# Work Order — merge on completion authorization

## Header

- Work Order ID: `WO-2026-09-21-merge-on-completion`
- Status: active
- Created: 2026-09-21
- Last updated: 2026-09-21
- Requester: Rick Vang
- Current owner: ChatGPT implementation agent
- Request mode: update
- GitHub issue: #172
- Branch: `feat/issue-172-merge-on-completion`

## Outcome

Make a scoped Persona-Library request to implement, fix, build, or complete work carry standing authorization through the normal merge path after the repository's completion gates pass, unless the requester explicitly narrows the stopping boundary.

## Authorization and boundary

The requester authorized this governance implementation. This Work Order records authorization; it does not create permission. Under the current repository contract, the implementation branch and PR are authorized. The requested policy change itself will define standing completion authorization for future scoped Persona-Library implementation requests once that change is on the default branch.

Issue #96 merge is separately and explicitly authorized by the requester in the same conversation.

No standing authorization is created for unrelated issue mutation, repository settings/access, external repositories, publication outside the normal repository merge path, or external communications/actions.

## Mara placement and boundary review

Repository-defined review using Mara Okoye's knowledge-systems placement contract; this is not a claim of a live human consultation.

**Placement:** extend the existing repository governance surfaces rather than create a second GitHub policy source.

- `AGENTS.md` owns Persona-Library-specific standing completion authorization.
- `docs/playbooks/bounded-parallel-implementation.md` owns the Authorizer/process gate and recognizes valid repository-level standing authorization.
- `content/orientation/playbooks.json` carries the route handoff; its generated mirror must remain identical.
- `docs/work-orders.md` owns how Work Orders record, but do not grant, standing authorization and task-level overrides.
- `docs/decisions/records.json` receives the durable rationale as a new Decision that qualifies the older bounded-parallel separate-merge rationale without rewriting history.
- focused validation guards the current reusable contract.
- the pinned `rickvang/tool-repo` GitHub package remains the reusable owner of mutation classes, fresh preflight, merge procedure, and linked-issue completion semantics.

**Closest alternatives rejected:** change the GitHub Tool package globally; rewrite archived Work Orders; create a standalone merge-policy document; or make green CI itself authorization. Those respectively broaden the change beyond Persona-Library, rewrite historical evidence, create a duplicate policy source, or collapse authorization into validation.

## Success criteria

- `AGENTS.md` explicitly defines standing completion authorization for scoped Persona-Library implementation requests.
- explicit “do not merge”, “PR only”, “leave for review”, or equivalent instructions override the standing rule.
- fresh PR/head/base/check/review/mergeability/linked-completion preflight remains mandatory.
- Bounded Parallel preserves Reviewer/Authorizer separation while allowing repository standing authorization to satisfy the merge gate.
- Work Orders may record repository standing authorization without inventing a second confirmation gate.
- DEC-019 records the durable choice and qualifies DEC-010 rather than rewriting it.
- focused validation catches regression to an unconditional second-confirmation rule.
- required repository validation is green.

## Current phase

Implementation in progress.

## Next action

Apply the scoped governance and validation changes, open a PR, run repository validation, and reconcile the affected current surfaces. After issue #172 is dispositioned under the authorization in force, refresh PR #170 and merge issue #96 if its preflight remains clean.
