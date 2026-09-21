# Work Order — merge on completion authorization

## Header

- Work Order ID: `WO-2026-09-21-merge-on-completion`
- Status: complete
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

## Validation

- PR #173 opened from `feat/issue-172-merge-on-completion`.
- Repository validation run #38 passed on head `0880ff4a7799d4bcab89d45a1dfaa17f6304ea26`.
- Final PR validation run #39 passed on head `f639fe504997ef214610033684fda06d145f7392`.
- Main push validation run #40 passed on merge commit `98346d06246152fe1dfa310ea70fb819278da7b8`.
- Current PR diff is scoped to repository governance, Bounded Parallel routing/process, Work Order guidance, DEC-019, generated mirrors, and focused regression validation.
- Historical Work Orders are unchanged.
- The pinned GitHub Tool contract is unchanged.

## Change-impact reconciliation

- **Root repository instructions — extends:** now define Persona-Library-specific standing completion authorization while retaining the pinned GitHub Tool contract for reusable mutation semantics and fresh preflight.
- **Bounded Parallel Playbook — qualifies:** Reviewer/Authorizer separation remains; the Authorizer gate may be satisfied by a current requester instruction or repository-level standing authorization. Green status alone still does not create permission.
- **Playbooks route — extends:** activates the same repository-standing-authorization handoff; authored and generated route files remain identical.
- **Work Order lifecycle — qualifies:** Work Orders continue to record rather than grant permission and now record standing authorization plus explicit task-level overrides.
- **Decisions — extends:** DEC-019 records the new repository authorization choice and qualifies DEC-010 without rewriting its historical rationale.
- **GitHub Tool contract — unchanged:** mutation classes, linked-issue completion semantics, and merge preflight remain owned by the pinned tool-repo revision.
- **Archived Work Orders — unchanged:** historical evidence is not rewritten.
- **External repositories and non-GitHub consequential actions — unchanged:** no standing authorization is created.

## Completion

- PR #173 merged to `main` as `98346d06246152fe1dfa310ea70fb819278da7b8` on 2026-09-21;
- GitHub automatically closed issue #172 from the existing in-scope closing keyword;
- DEC-019 is applied and the standing completion authorization is now part of the root repository contract;
- the new behavior was exercised in the issue #96 completion path while preserving fresh preflight, review, validation, and linked-issue boundaries;
- no external active-work tracker was linked to this Work Order, so no cross-system reconciliation was required;
- this terminal Work Order package was moved to the September 2026 archive.

## Current phase

Complete and archived.

## Next action

Reference only. Open a new GitHub issue and Work Order if the standing completion authorization model needs to change.
