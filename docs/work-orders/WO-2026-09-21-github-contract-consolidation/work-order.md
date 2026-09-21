# Work Order — GitHub authorization contract consolidation

- Work Order ID: WO-2026-09-21-github-contract-consolidation
- Status: blocked
- Created: 2026-09-21
- Last updated: 2026-09-21
- Requester: repository user
- Current owner: ChatGPT
- Request mode: update
- GitHub issue: #165 — Consolidate GitHub authorization guidance onto tool-repo contract
- Upstream dependency: rickvang/tool-repo#9 / PR #10
- Branch: `feat/issue-165-github-contract-consolidation`
- Pull request: #166 — draft, dependency-blocked
- Provisional upstream Tool revision: `303e98d048ae689239f53eae309fd55c050fac38`
- Change domain: repository governance documentation, Playbook routing, focused validation
- Reconciliation: change-impact-reconciliation

## Goal

Consume one canonical GitHub authorization/completion contract from `rickvang/tool-repo` and remove reusable duplicate merge/issue-completion semantics from Persona-Library without rewriting historical Work Orders.

## Authorization and boundary

The requester authorized implementation of issue #165. This Work Order records that authorization but does not grant merge, issue-close, repository-settings, or unrelated mutation permission.

The consumer pin is provisional while tool-repo PR #10 is unmerged. The final Persona-Library implementation must pin the exact landed tool-repo revision before it can become review-ready.

## Scope

- update the root GitHub Tool pin and reduce duplicated GitHub mutation wording;
- keep `docs/work-orders.md` lifecycle-focused and point GitHub mutation semantics to the pinned Tool contract;
- keep Bounded Parallel implementation process/Authorizer gates while deferring GitHub merge/linked-issue semantics to the pinned Tool contract;
- update the Bounded Parallel orientation route and generated mirror;
- add focused regression validation preventing reusable GitHub policy duplication from returning;
- run bounded change-impact reconciliation and repository validation.

## Non-goals

- no rewrite of archived/historical Work Orders;
- no new Persona, Skill, Tool, or Playbook identity;
- no automatic merge;
- no weakening of current-state, review, CI, or preflight gates;
- no GitHub access or credential changes.

## Current phase and gate

Phase: draft consumer implementation complete.

Gate: upstream dependency pending. Persona-Library repository validation is green on PR #166, including build, authored/generated content, tests, whitespace, and generated-output freshness. tool-repo PR #10 is open and mergeable but not merged, so PR #166 remains blocked until the exact landed upstream revision is known.

## Success criteria

- one canonical reusable GitHub authorization/completion owner remains in tool-repo;
- Persona-Library activates that contract rather than restating it;
- Bounded Parallel retains process gates and Authorizer ownership;
- Work Orders retain lifecycle/progress ownership;
- route/generated parity and focused validation pass;
- historical evidence remains unchanged.

## Next action

Wait for authorized tool-repo PR #10 merge. After it lands, refresh the exact upstream revision, update the pin if needed, rerun final validation/reconciliation, and move Persona-Library PR #166 to review-ready.
