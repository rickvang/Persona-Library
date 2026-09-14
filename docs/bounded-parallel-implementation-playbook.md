# Bounded Parallel Implementation Playbook

- Playbook ID: `playbook-bounded-parallel-implementation`
- Status: Working model
- Audience: a coordinator dispatching a small number of independent repository implementation workstreams, plus the implementers and reviewers of those workstreams
- Canonical catalog identity: `content/library-data.js` `playbookCatalog`
- Orientation route: `bounded-parallel-implementation`
- Related collaboration contract: [`docs/collaboration/multi-persona-collaboration-playbook.md`](collaboration/multi-persona-collaboration-playbook.md)

This Playbook coordinates existing repository, GitHub, Work Order, and review practices. It is not a runtime executor and does not create an Agent, Coordinator, Runtime, Budget, Scheduler, or Orchestration entity.

## Outcome

Produce a small set of independent, reviewable implementation results—normally one branch and one pull request per workstream—with compact handoffs, independent review against current repository state, scoped correction only when needed, and merge only under separate authorization.

Implementer success is a reviewable PR or a bounded blocker for the assigned workstream. Run success is every dispatched workstream accepted after independent review or explicitly blocked or deferred, plus a compact coordinator packet that a reviewer can use to rehydrate from GitHub. Success is not merge, transcript completeness, nested-agent activity, or a recorded correction list that has not been applied and re-reviewed.

The run stops when every dispatched workstream is accepted after independent review or explicitly blocked or deferred, the compact handoffs are collected, and merge is either separately authorized and completed or explicitly left unmerged. Recording scoped corrections is not terminal: stages 4–5 require the named defects to be applied and the updated PR to be re-reviewed before that workstream can stop.

## When to use

Use this Playbook when:

- two or more implementation workstreams are independent enough to proceed in parallel;
- each workstream can be bounded to one repository, one issue or Work Order slice, one branch, and one PR;
- the cost to avoid is duplicated repository inspection, nested delegation, polling, or copying child transcripts into the coordinator;
- GitHub remains the source of current branch, PR, diff, review, and check state.

## When not to use

Do not use this Playbook when:

- the work is a Multi-Persona Collaboration run that must synthesize one solution from named Personas through a `problem-context`;
- a single implementer can finish one workstream without parallel dispatch;
- the request needs a new runtime, scheduler, worker pool, token meter, or model-selection engine;
- merge, publication, or access changes are being treated as implied by implementation completion;
- the work is still a one-off that does not need a reusable stage contract.

If named Personas must argue a shared problem before implementation, use the [Multi-Persona Collaboration Playbook](collaboration/multi-persona-collaboration-playbook.md) first. Do not copy its stages, solution-quality gate, or `problem-context` contract into this Playbook.

## Why this is a distinct Playbook

Multi-Persona Collaboration owns named Persona lenses, attributable contributions, synthesis, and one concrete solution for a bounded user problem.

This Playbook owns bounded parallel *implementation*: Coordinator, Implementer, Reviewer, and Authorizer roles, one-level delegation, compact GitHub-reference handoffs, independent PR review, and separately authorized merge.

Issue [#71](https://github.com/rickvang/Persona-Library/issues/71) still tracks canonical catalog identity for Multi-Persona Collaboration. That open question does not make this workflow an extension of collaboration. Extending collaboration here would mix solution synthesis with repository mutation gates.

## Required inputs

- named independent workstreams, each with a repository, issue or Work Order slice, scope, non-goals, success measure, and stop condition;
- authorization for implementation, pull request creation, and—separately, if requested—merge;
- current `main` or other agreed base for each target repository;
- the minimum validation each repository or issue requires;
- a coordinator context that can receive compact handoffs, plus a reviewer context that can reinspect GitHub.

A `problem-context` is not required unless the same run also uses Multi-Persona Collaboration. A Work Order records run-specific progress and authorization constraints; it never grants mutation permission.

## Roles

These are role names, not new library entities.

| Role | Owns | Does not own |
| --- | --- | --- |
| Coordinator | Bound the workstreams, dispatch one implementer per workstream, collect compact handoffs, stop. | Reimplementing a workstream, nested agents, polling as a substitute for handoff, implementation-code review during dispatch. |
| Implementer | Exactly one workstream in one repository: inspect fresh state, follow local instructions, produce one branch and one PR or a bounded blocker, then stop. | Other workstreams, sub-agents, merge, treating a missing capability as success. |
| Reviewer | Independent reinspection of current PR, diff, review threads, and checks; separate blockers from suggestions; send only scoped correction. | Treating the implementer handoff as GitHub truth; expanding scope; merging. |
| Authorizer | Merge and other consequential mutations after fresh preflight. | Implied by a green implementer stop or a compact callback. |

The same person or runtime may hold different roles in different stages. Holding the Coordinator role does not authorize Reviewer or Authorizer work during the coordinate stage.

## Shared state and artifacts

| Artifact | Owner | Source of truth | Status rule |
| --- | --- | --- | --- |
| Issue or Work Order | Coordinator / requester | Run-specific scope and progress | Records authorization constraints; does not grant mutation |
| Branch | Implementer | Git history for that workstream | One branch per workstream |
| Pull request | Implementer until review; Reviewer during review | Current GitHub PR, diff, threads, and checks | Reviewable or blocked; not merged by this stage |
| Compact handoff | Coordinator collects; Implementer writes | Notification packet only | Must not replace GitHub state |
| Completion callback | Coordinator, when the runtime supports returning to the originating conversation | Same schema as the compact handoff | Example transport, not Playbook identity |

Canonical library records, repository `AGENTS.md` files, and Tool contracts remain authoritative. Link them; do not copy them into handoffs.

## Stages

### 1. Bound and dispatch

- **Purpose:** Choose the minimum independent workstreams and dispatch one implementer to each.
- **Owner:** Coordinator.
- **Entry:** Independent workstreams, authorization for implementation and PR creation, and current repository bases are named.
- **Inputs:** Issues or Work Order slices, repository targets, constraints, required validation, stop conditions.
- **Actions:** Confirm the workstreams do not require a shared in-progress branch; dispatch one level only; give each implementer one workstream and the compact handoff schema.
- **Outputs:** Dispatch packet per workstream.
- **Evidence:** Each packet names repository, issue/workstream, base, branch naming, validation required, non-goals, and stop condition.
- **Exit:** No extra implementers, no nested-agent instruction, and no coordinator implementation plan that duplicates a workstream.
- **Handoff:** Each implementer receives only its packet. The coordinator does not keep a giant shared prompt of repository history.

### 2. Implement in parallel

- **Purpose:** Produce a reviewable result or a bounded blocker for one workstream.
- **Owner:** The assigned Implementer.
- **Entry:** A single dispatch packet and a fresh inspect of the target repository.
- **Inputs:** Current repository instructions, Tool contracts, issue scope, required validation.
- **Actions:** Inspect fresh state; stay in scope; run only required validation; open one PR or stop with a blocker; do not spawn sub-agents; do not merge.
- **Outputs:** Branch + PR, or a blocker that names the missing input, permission, or conflict.
- **Evidence:** GitHub references plus the validation actually run.
- **Exit:** Reviewable or blocked. The implementer stops.
- **Handoff:** Compact handoff only. Do not return the child transcript.

Normal implementer bounds:

```text
one issue/workstream
one repository target
one branch
one PR
required validation only
no merge
no sub-agents
stop when reviewable or blocked
```

### 3. Compact handoff

- **Purpose:** Return durable references the reviewer can use without absorbing child context.
- **Owner:** Implementer writes; Coordinator collects and, when the runtime supports it, forwards one completion callback.
- **Entry:** Each implementer has stopped at reviewable or blocked.
- **Inputs:** GitHub identities and validation/blocker notes from each workstream.
- **Actions:** Collect one packet per workstream. Do not poll as a substitute for handoff. Do not review implementation code in this stage.
- **Outputs:** Coordinator packet, optionally delivered as a completion callback to the originating conversation.
- **Evidence:** Every required handoff field is present or explicitly unknown.
- **Exit:** Coordinator has the packets and stops coordinating.
- **Handoff:** Reviewer receives the packets as pointers, not as proof of GitHub state.

Default handoff schema:

```text
repository
issue/workstream
branch
PR
validation performed
blockers / unresolved questions
```

### 4. Independent review

- **Purpose:** Judge current repository evidence, not the implementer narrative.
- **Owner:** Reviewer.
- **Entry:** Compact handoffs exist and GitHub is reachable, or unavailability is recorded.
- **Inputs:** Live PR, diff, review threads, and checks. Refresh current `main` and PR state before reasoning.
- **Actions:** Re-fetch GitHub state; separate blockers from suggestions; do not treat the handoff as current truth.
- **Outputs:** Pass, fail, or defer, with a scoped correction list when needed.
- **Evidence:** Named PR revision, check results, and review findings.
- **Exit:** Each workstream is accepted, blocked, or returned for scoped correction. A correction list continues the run at stage 5; it does not stop the workstream.
- **Handoff:** Authorizer for merge, Implementer for a named correction, or an explicit blocked/deferred remainder.

### 5. Scoped correction

- **Purpose:** Fix only the named review defects.
- **Owner:** The original Implementer when available; otherwise a newly dispatched implementer for that same workstream.
- **Entry:** Reviewer listed a bounded correction against a specific PR.
- **Inputs:** Current PR state plus the correction list.
- **Actions:** Stay inside the named defects; do not reopen unrelated scope; do not spawn sub-agents; do not merge.
- **Outputs:** Updated PR or a blocker.
- **Evidence:** New commits and re-run required validation.
- **Exit:** Correction is reviewable or blocked. The workstream does not stop until independent review accepts it or it is explicitly blocked or deferred.
- **Handoff:** Return to independent review with an updated compact handoff.

### 6. Authorized merge and stop

- **Purpose:** Apply a consequential mutation only with fresh authorization and preflight, then stop.
- **Owner:** Authorizer.
- **Entry:** Review passed for the PRs intended to merge, and merge was explicitly authorized.
- **Inputs:** Current PR, base branch, review, and check state.
- **Actions:** Refresh state; merge in an order that respects shared-file conflicts; do not infer authorization from a green PR or a completion callback.
- **Outputs:** Merge commits, or an explicit unmerged remainder.
- **Evidence:** GitHub merge records and remaining open PRs.
- **Exit:** Requested merges are done or explicitly declined; the run stops.
- **Handoff:** Close or update the issue/Work Order with outcomes, limitations, and next action.

## Usage containment

Usage containment is a quality property of this orchestration, not a pricing, token, or budget domain.

- Prefer references over copied context.
- Prefer repository instructions over giant prompts.
- Avoid duplicated repository inspection.
- Avoid nested delegation.
- Avoid repeated status polling.
- Return summaries, not child transcripts.
- Use the least-expensive capable runtime or model for each role.
- Stop agents at explicit completion boundaries.

Do not encode product prices or fixed token budgets in this Playbook.

## Runtime mapping examples

The durable contract is runtime-neutral. Product names below are adapters, not Playbook identity.

### Preferred current ChatGPT mapping

Proven in this project as a useful handoff, not as a requirement for every runtime:

```text
originating Chat
→ plan / select scoped issues
→ switch or hand off to Work
→ Work acts as thin coordinator
→ bounded implementation agents each produce one branch + PR, then stop
→ Work collects only the compact handoffs
→ Work writes a concise completion callback into the originating Chat
→ originating Chat independently reinspects GitHub and reviews the PRs
→ scoped correction if needed
→ separately authorized merge
```

The callback uses the compact handoff schema. It is notification transport. GitHub remains the source of PR, diff, check, and review state.

### Fallback

If the runtime cannot return to the originating conversation, surface the same compact packet in the coordinator context. The reviewer still rehydrates from GitHub references.

Cursor, Codex, or other implementation agents may fill the Implementer role. That does not make this a Work- or Codex-specific Tool package.

## Decision rights

- Coordinator may dispatch, collect handoffs, and stop the coordinate stage.
- Implementer may edit only the assigned workstream and may not merge.
- Reviewer may pass, fail, or defer and must name evidence or a correction.
- Authorizer alone may merge or approve other consequential mutations.
- Unavailable Tools, connectors, or permissions are reported; they are not simulated as success.

## Quality gates

**Dispatch gate.** Pass only when each implementer has one workstream, one repository, one stop condition, and no instruction to spawn sub-agents. Fail if the coordinator plans to reimplement, poll instead of awaiting handoff, or review code before the review stage.

**Implementer stop gate.** Pass only when the workstream has a reviewable PR or a bounded blocker, required validation was run or explicitly skipped with reason, and the implementer did not merge. Fail if nested agents were used or scope expanded.

**Handoff gate.** Pass only when the packet uses the compact schema and does not include child transcripts or large repository copies. Fail if GitHub identities are missing without being marked unknown.

**Review gate.** Pass only when the reviewer re-fetched current GitHub state and separated blockers from suggestions. Fail if the handoff was treated as proof of current PR/diff/check state. A fail with scoped corrections is an entry to stage 5, not a run-stop.

**Correction-loop gate.** Recording scoped corrections is not terminal. Pass only after the named defects are applied and the updated PR is re-reviewed to accept, or the workstream is explicitly blocked or deferred.

**Run-stop gate.** Pass only when every dispatched workstream is accepted after review or explicitly blocked or deferred, compact handoffs exist, and merge is either separately authorized and completed or explicitly left unmerged. Fail if the run closes with a known failed review that still needs apply and re-review.

**Merge gate.** Pass only with explicit authorization and fresh preflight. Implementation completion, a compact callback, or a passing review does not pass this gate by itself.

## Failure and recovery

- Missing or overlapping workstream: do not dispatch; split or serialize first.
- Shared-file collision discovered during review or merge: serialize remaining work; rebase the later PR; do not require both implementers to keep editing in parallel.
- Unavailable GitHub connector: report the limitation; do not infer remote state; use the documented fallback only when accepted.
- Implementer blocked: keep the workstream blocked; do not spawn a grandchild agent to bypass the blocker.
- Reviewer unavailable: leave PRs unmerged; do not have the coordinator silently review during the coordinate stage.
- Interrupted run: resume from GitHub identities in the last compact handoff, not from remembered transcripts.
- Unauthorized merge request: stop at reviewable PRs and ask for authorization.

## Capabilities and Tools

- Repository-local `AGENTS.md` and Operating Packs: follow them inside a workstream; do not copy them into the Playbook.
- GitHub operating contract: a Tool requirement for issue/PR/review/merge work. A pin or catalog mention does not prove connector availability.
- `$playbook-composer`: use when maintaining this Playbook, not when executing a run.
- `$change-impact-reconciliation`: use after durable Playbook, Docs, Decision, or generated-artifact changes.
- `$tool-discovery-and-safe-execution`: use when a workstream needs a Tool capability resolved; missing access is a blocker.

Do not add a Work/Codex-specific Tool package unless later evidence shows substantial runtime-specific procedure that belongs in `tool-repo`.

## Representative and boundary cases

**Representative case.** Two independent `tool-repo` workstreams: issue #3 / PR #6 (GitHub package split) and issue #4 / PR #5 (Figma package). Separate implementers produced one branch and one PR each. Merge was sequential after #6 landed, including a README rebase on #5. See the Work Order proof for what matched this contract and what the coordinator still duplicated.

**Boundary case.** Two workstreams that secretly share a file, or a coordinator that reviews diffs while still dispatching, fails the dispatch or merge gate. Nested sub-agents, transcript-as-truth review, and merge-by-callback also fail.

## Provenance

- Request: [Persona-Library #82](https://github.com/rickvang/Persona-Library/issues/82)
- Runtime-mapping amendment: [issue comment](https://github.com/rickvang/Persona-Library/issues/82#issuecomment-5663449934)
- Related: [#71](https://github.com/rickvang/Persona-Library/issues/71) collaboration identity, [#70](https://github.com/rickvang/Persona-Library/issues/70) ownership boundaries, `tool-repo` #3 and #4
- Confidence: contract is inspectable; one two-lane repository case exists; Chat→Work completion callback is a documented adapter, not yet a required proof for every runtime
- Assumptions: GitHub remains the default repository workflow; implementers can inspect fresh repository state; merge stays a separate authorization
- Unresolved: whether later cases need a second proof across two repositories; whether #71 later catalogs Multi-Persona Collaboration beside this identity
- Next action after an authorized update: bounded `$change-impact-reconciliation`, then reviewable PR, then separately authorized merge
