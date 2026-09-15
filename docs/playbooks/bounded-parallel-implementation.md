# Bounded Parallel Implementation Playbook

- Playbook ID: `playbook-bounded-parallel-implementation`
- Status: Working model
- Audience: a coordinator dispatching a small number of independent repository implementation workstreams, plus the implementers and reviewers of those workstreams
- Canonical catalog identity: `content/library-data.js` `playbookCatalog`
- Orientation route: `bounded-parallel-implementation`
- Related collaboration contract: [`docs/collaboration/multi-persona-collaboration-playbook.md`](../collaboration/multi-persona-collaboration-playbook.md)

This Playbook coordinates existing repository, GitHub, Work Order, and review practices. It is not a runtime executor and does not create an Agent, Coordinator, Runtime, Budget, Scheduler, or Orchestration entity.

Persona-Library may select, catalog, and explain this Playbook. After selection, the repository being changed owns implementation truth. For an external target repository, execution does not require loading Persona-Library records. If Persona-Library itself is the target repository, follow its own `AGENTS.md` → bootstrap → selected route contract; if another target repository requires Persona-Library records, follow that local requirement.

## Core principle

> The repository being changed owns implementation truth. Persona-Library may help select who, what capability, or what Playbook applies, but it does not override the target repository's current source, instructions, architecture, issue state, tests, or validation contract.

Prior conversation context, coordinator memory, Persona-Library records, and implementer handoffs are pointers and context; they are not substitutes for fresh target-repository inspection.

## Implementation-truth precedence

This order is about implementation truth, not permission expansion. A repository file or Playbook never grants a mutation the user did not authorize.

```text
explicit user request / authorization
        ↓
target-repository issue / scoped task
        ↓
target-repository AGENTS / architecture / local instructions
        ↓
target-repository canonical source + tests / validators
        ↓
reusable Playbook / Operating Pack guidance
        ↓
general practice
```

## Execution path

The reusable contract must work when an agent starts directly inside the target repository.

```text
open target repo
→ determine Implementer context state
→ follow the target repository's orientation path when required
→ source-ground workstream
→ apply Bounded Parallel contract
```

Persona-Library remains optional discovery, applicability, relationships, and provenance. Do not treat it as an execution hub for work in another repository.

## Outcome

Produce a small set of independent, reviewable implementation results—normally one branch and one pull request per workstream—after each workstream is source-grounded against current target-repository truth, with compact handoffs, independent review against current repository state, scoped correction only when needed, and merge only under separate authorization.

Implementer success is a reviewable PR or a bounded blocker for the assigned workstream. Run success is every dispatched workstream accepted after independent review or explicitly blocked or deferred, plus a compact coordinator packet that a reviewer can use to rehydrate from GitHub. Success is not merge, transcript completeness, nested-agent activity, or a recorded correction list that has not been applied and re-reviewed.

The run stops when every dispatched workstream is accepted after independent review or explicitly blocked or deferred, the compact handoffs are collected, and merge is either separately authorized and completed or explicitly left unmerged. Recording scoped corrections is not terminal: stages 5–6 require the named defects to be applied and the updated PR to be re-reviewed before that workstream can stop. A contradicted candidate is re-scoped or dropped before dispatch; it is not a dispatched workstream.

## When to use

Use this Playbook when:

- two or more implementation workstreams are independent enough to proceed in parallel after source-grounding;
- each workstream can be bounded to one repository, one issue or Work Order slice, one branch, and one PR;
- the cost to avoid is dispatching from stale assumptions, duplicated repository inspection, nested delegation, polling, or copying child transcripts into the coordinator;
- GitHub remains the source of current branch, PR, diff, review, and check state.

## When not to use

Do not use this Playbook when:

- the work is a Multi-Persona Collaboration run that must synthesize one solution from named Personas through a `problem-context`;
- a single implementer can finish one workstream without parallel dispatch;
- the request needs a new runtime, scheduler, worker pool, token meter, or model-selection engine;
- merge, publication, or access changes are being treated as implied by implementation completion;
- the work is still a one-off that does not need a reusable stage contract.

If named Personas must argue a shared problem before implementation, use the [Multi-Persona Collaboration Playbook](../collaboration/multi-persona-collaboration-playbook.md) first. Do not copy its stages, solution-quality gate, or `problem-context` contract into this Playbook.

## Why this is a distinct Playbook

Multi-Persona Collaboration owns named Persona lenses, attributable contributions, synthesis, and one concrete solution for a bounded user problem.

This Playbook owns bounded parallel *implementation*: Coordinator, Implementer, Reviewer, and Authorizer roles, source-grounding before dispatch, one-level delegation, compact GitHub-reference handoffs, independent PR review, and separately authorized merge.

Issue [#71](https://github.com/rickvang/Persona-Library/issues/71) still tracks canonical catalog identity for Multi-Persona Collaboration. That open question does not make this workflow an extension of collaboration. Extending collaboration here would mix solution synthesis with repository mutation gates.

Do not add a second “Source-Grounded Parallel Implementation” identity. Source grounding is a required stage of this Playbook.

## Required inputs

- candidate workstreams, each naming a repository, issue or requested outcome, and an initial scope;
- authorization for implementation, pull request creation, and—separately, if requested—merge;
- current `main` or other agreed base for each target repository, refreshed before grounding;
- enough access to inspect repo-local instructions, relevant source, and the local validation contract;
- a coordinator context that can receive compact handoffs, plus a reviewer context that can reinspect GitHub.

Named independent workstreams are an *output* of source-grounding, not a substitute for it. A `problem-context` is not required unless the same run also uses Multi-Persona Collaboration. A Work Order records run-specific progress and authorization constraints; it never grants mutation permission.

## Roles

These are role names, not new library entities.

| Role | Owns | Does not own |
| --- | --- | --- |
| Coordinator | Determine and verify Implementer orientation state, source-ground candidate workstreams, dispatch only confirmed or qualified packets, collect compact handoffs, stop. | Reimplementing a workstream, nested agents, polling as a substitute for handoff, implementation-code review during dispatch, silently rewriting a contradicted request. |
| Implementer | Exactly one workstream in one repository: follow the target repository's orientation path from the packet's references, re-open current source, produce one branch and one PR or a bounded blocker/defer outcome, then stop. | Other workstreams, sub-agents, merge, treating a missing capability as success, treating the dispatch packet as copied repository history. |
| Reviewer | Independent reinspection of current PR, diff, review threads, and checks; problem-correctness against current repository owner and source; separate blockers from suggestions; send only scoped correction. | Treating the implementer handoff as GitHub truth; expanding scope; merging. |
| Authorizer | Merge and other consequential mutations after fresh preflight. | Implied by a green implementer stop or a compact callback. |

The same person or runtime may hold different roles in different stages. Holding the Coordinator role does not authorize Reviewer or Authorizer work during the coordinate stage.

## Shared state and artifacts

| Artifact | Owner | Source of truth | Status rule |
| --- | --- | --- | --- |
| Issue or Work Order | Coordinator / requester | Run-specific scope and progress | Records authorization constraints; does not grant mutation |
| Orientation preflight | Coordinator / Implementer | Target repository's current instructions and orientation entrypoint | `fresh`, `previously_oriented`, or `unknown`; separate from grounding and not an authorization |
| Source-grounding result | Coordinator | Current target-repository source vs requested work | `confirmed`, `qualified`, or `contradicted`; contradicted work is not dispatched |
| Branch | Implementer | Git history for that workstream | One branch per workstream |
| Pull request | Implementer until review; Reviewer during review | Current GitHub PR, diff, threads, and checks | Reviewable or blocked; not merged by this stage |
| Compact handoff | Coordinator collects; Implementer writes | Notification packet only | Must not replace GitHub state |
| Completion callback | Coordinator, when the runtime supports returning to the originating conversation | Same schema as the compact handoff | Example transport, not Playbook identity |

Canonical library records, repository `AGENTS.md` files, and Tool contracts remain authoritative. Link them; do not copy them into handoffs or dispatch packets.

## Stages

### 0. Orientation preflight

- **Purpose:** Establish whether the assigned Implementer has reliable current orientation context before source-grounding or implementation.
- **Owner:** Coordinator verifies; the Implementer follows the target repository's path.
- **Entry:** A candidate workstream names a repository and an issue or requested outcome. Authorization for inspection exists.
- **Inputs:** Target repository, current base reference, repo-local `AGENTS.md` or scoped instructions, and any documented bootstrap or orientation entrypoint.
- **Actions:** Record the Implementer context as `fresh`, `previously_oriented`, or `unknown`. Treat `fresh` and `unknown` as requiring the target repository's current orientation path before source-grounding. A `previously_oriented` Implementer still refreshes the current base and relevant scoped instructions/source. Record references and completion status only; do not copy instruction bodies or infer orientation from coordinator memory.
- **Outputs:** Orientation status, entrypoint reference, completion evidence, and any reason an entrypoint does not exist.
- **Evidence:** Target repository and base reference, orientation entrypoint or explicit `none`, and the Implementer's recorded orientation status.
- **Exit:** The Orientation gate passes. A missing required orientation step stops the workstream before grounding; an absent formal bootstrap is recorded and the smallest applicable local instruction/source path is used.
- **Handoff:** Stage 1 receives only workstreams whose orientation preflight passed.

The Implementer context states are:

- **fresh** — no reliable evidence the Implementer has read the target repository's current orientation/instructions in this run;
- **previously_oriented** — the Implementer completed the repository's orientation path, but must still refresh current base and relevant scoped instructions/source;
- **unknown** — orientation cannot be established; treat it conservatively like `fresh`.

Orientation state is independent of workstream grounding state. A workstream may be `fresh + confirmed`, `previously_oriented + contradicted`, or `unknown + qualified`.

### 1. Ground candidate workstreams in target-repository source

- **Purpose:** Establish current implementation truth in each target repository before any workstream is dispatched.
- **Owner:** Coordinator, or an implementer starting directly in the target repository.
- **Entry:** A candidate workstream names a repository and an issue or requested outcome. Authorization for inspection exists.
- **Inputs:** Current base branch/revision; repo-local `AGENTS.md` or scoped instructions; architecture/ownership docs when present; relevant canonical source; relevant tests/validators; known shared-file or dependency constraints.
- **Actions:** Refresh current branch/`main`. Read local instructions and the relevant source and validation surfaces. Compare the requested work with current source. Classify the result. Record qualifications. Do not copy full instruction files, architecture docs, source, or transcripts into the later packet.
- **Outputs:** One comparison result per candidate: `confirmed`, `qualified`, or `contradicted`, with owner/path and validation notes.
- **Evidence:** Named repository, base revision, inspected instruction/source/validation paths, and the comparison class.
- **Exit:** Every candidate is classified. Contradicted work has stopped for re-scope. Qualified adjustments are written into the dispatch packet. Shared-file collisions are removed from parallel scope or explicitly serialized.
- **Handoff:** Stage 2 receives only confirmed or qualified candidates.

The stage must answer:

```text
What is actually true in this repository now?
Which file/module/repository owns the behavior being changed?
Does the requested implementation still match current source truth?
What validation contract applies here?
Is the workstream genuinely independent enough to dispatch in parallel?
```

Comparison classes:

- **confirmed** — current source supports the requested workstream as framed;
- **qualified** — the request is valid but scope, owner, dependency, or implementation shape must be adjusted;
- **contradicted** — current source shows that the requested workstream is based on a stale/wrong assumption or wrong owner.

A contradicted workstream must **STOP and be re-scoped before implementation**. Do not silently reinterpret the request and proceed.

Minimum grounding record:

```text
repository
base branch / revision
issue or requested outcome
repo-local AGENTS / scoped instructions
architecture / ownership docs when present
relevant canonical source
relevant tests / validators
known dependencies or shared-file constraints
```

### 2. Bound and dispatch

- **Purpose:** Choose the minimum independent *confirmed or qualified* workstreams and dispatch one implementer to each.
- **Owner:** Coordinator.
- **Entry:** Orientation and source-grounding passed. Independent workstreams, authorization for implementation and PR creation, and current repository bases are named.
- **Inputs:** Grounded issues or Work Order slices, repository targets, qualifications, constraints, required validation, stop conditions.
- **Actions:** Confirm the workstreams do not require a shared in-progress branch; dispatch one level only; give each implementer one workstream and the compact handoff schema. Carry qualifications into the packet. Do not dispatch contradicted work.
- **Outputs:** Dispatch packet per workstream.
- **Evidence:** Each packet names repository, base revision, issue/workstream, Implementer context state, orientation entrypoint/status, source-grounding result (`confirmed` or `qualified`), canonical owner/relevant paths, branch naming, required validation, non-goals, and stop condition.
- **Exit:** No extra implementers, no nested-agent instruction, no contradicted dispatch, and no coordinator implementation plan that duplicates a workstream.
- **Handoff:** Each implementer receives only its packet. The coordinator does not keep a giant shared prompt of repository history.

Dispatch packet (references, not copied repository history):

```text
repository
base revision
issue / workstream
agent context: fresh | previously_oriented | unknown
orientation entrypoint / references
source-grounding result: confirmed | qualified
canonical owner / relevant paths
branch
required validation
non-goals
stop condition
```

The implementer must re-open current repository state itself.

### 3. Implement in parallel

- **Purpose:** Produce a reviewable result or a bounded blocker for one workstream.
- **Owner:** The assigned Implementer.
- **Entry:** A single dispatch packet and a fresh inspect of the target repository.
- **Inputs:** Current repository orientation/instructions, Tool contracts, issue scope, required validation. For an external target repository, Persona-Library records are not required after Playbook selection unless the target repository requires them; if Persona-Library itself is the target repository, follow its local bootstrap and selected route requirements.
- **Actions:** Inspect fresh state; stay in the grounded scope; run only required validation; open one PR, or transition to `blocked` or `deferred` when the bounded stop condition applies; do not spawn sub-agents; do not merge.
- **Outputs:** Branch + PR, or a compact blocker/defer handoff that names the missing input, permission, conflict, or scoped dependency.
- **Evidence:** GitHub references plus the validation actually run.
- **Exit:** `review_ready`, `blocked`, or `deferred`. The Implementer transitions to `deferred` when an explicit, scoped dependency makes continued work inappropriate for this run but gives a concrete re-entry condition—for example, a named upstream PR/base revision, required user decision, or unavailable approved capability. A current contradiction or an unresolved permission/source conflict is `blocked`; a correctable in-scope defect remains implementation work. The Implementer records the dependency, owner/reference, reason, and re-entry condition, then stops.
- **Handoff:** Compact handoff only. For `deferred`, include the dependency and re-entry condition; the same packet is used for a supported callback or coordinator fallback. Do not return the child transcript.

Normal implementer bounds:

```text
one issue/workstream
one repository target
one branch
one PR
required validation only
no merge
no sub-agents
stop when reviewable, blocked, or deferred
```

### 4. Compact handoff

- **Purpose:** Return durable references the reviewer can use without absorbing child context.
- **Owner:** Implementer writes; Coordinator collects and, when the runtime supports it, forwards one completion callback.
- **Entry:** Each implementer has stopped at `review_ready`, `blocked`, or `deferred`.
- **Inputs:** GitHub identities and validation/blocker notes from each workstream.
- **Actions:** Collect one packet per workstream. Do not poll as a substitute for handoff. Do not review implementation code in this stage.
- **Outputs:** Coordinator packet, optionally delivered as one completion callback to the originating conversation.
- **Evidence:** Every required handoff field is present or explicitly unknown.
- **Exit:** Coordinator has the packets and stops coordinating.
- **Handoff:** Reviewer receives the packets as pointers, not as proof of GitHub state.

Default handoff schema:

```text
workstream status: review_ready | blocked | deferred
repository
issue/workstream
branch
PR
validation performed
blocker / dependency / re-entry condition
```

When the runtime supports returning to the originating conversation, the Coordinator sends one callback after all workstreams reach a bounded terminal state: `review_ready`, `blocked`, or `deferred`. The callback includes one terminal status for each workstream plus an aggregate `run status`. For one or more dispatched workstreams, the aggregate is `review_ready` only when every workstream is `review_ready`; it is `blocked` when any workstream is `blocked`; otherwise it is `deferred` when at least one workstream is `deferred`. Thus `review_ready + blocked` is `blocked`, `review_ready + deferred` is `deferred`, and `blocked + deferred` is `blocked`. The callback uses the compact handoff fields above and may include one concise coordinator note. It is notification and routing only; it does not assert current GitHub PR, diff, review, check, or merge state.

If callback transport is unavailable, surface the same compact packet in the coordinator context, record the transport limitation, and stop. Do not simulate callback delivery or keep the originating conversation in an indefinite polling loop.

### 5. Independent review

- **Purpose:** Judge current repository evidence, not the implementer narrative.
- **Owner:** Reviewer.
- **Entry:** Compact handoffs exist and GitHub is reachable, or unavailability is recorded.
- **Inputs:** Live PR, diff, review threads, and checks. Refresh current `main` and PR state before reasoning. Re-check the target repository’s authoritative source and owner.
- **Actions:** Re-fetch GitHub state; verify both implementation correctness against the current PR/diff/checks and problem correctness against current repository source and owner; separate blockers from suggestions; do not treat the handoff as current truth.
- **Outputs:** Pass, fail, or defer, with a scoped correction list when needed.
- **Evidence:** Named PR revision, check results, current owner/source reading, and review findings.
- **Exit:** Each workstream is accepted, blocked, or returned for scoped correction. A correction list continues the run at stage 6; it does not stop the workstream.
- **Handoff:** Authorizer for merge, Implementer for a named correction, or an explicit blocked/deferred remainder.

### 6. Scoped correction

- **Purpose:** Fix only the named review defects.
- **Owner:** The original Implementer when available; otherwise a newly dispatched implementer for that same workstream.
- **Entry:** Reviewer listed a bounded correction against a specific PR.
- **Inputs:** Current PR state plus the correction list.
- **Actions:** Stay inside the named defects; do not reopen unrelated scope; do not spawn sub-agents; do not merge.
- **Outputs:** Updated PR or a blocker.
- **Evidence:** New commits and re-run required validation.
- **Exit:** Correction is reviewable or blocked. The workstream does not stop until independent review accepts it or it is explicitly blocked or deferred.
- **Handoff:** Return to independent review with an updated compact handoff.

### 7. Authorized merge and stop

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
- Ground work in current target-repository source before dispatch.
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
→ determine Implementer context state
→ target-repository orientation preflight
→ source-ground each candidate in the target repository
→ bound and dispatch only confirmed / qualified workstreams
→ bounded implementation agents each produce one branch + PR, then stop
→ Work collects only the compact handoffs
→ Work sends one concise completion callback into the originating Chat when supported
→ originating Chat independently reinspects GitHub and reviews the PRs
→ scoped correction if needed
→ separately authorized merge
```

### Completion callback adapter

The callback fires once the Coordinator has collected compact handoffs, required implementation-stage validation has completed or is explicitly recorded as skipped/blocked, and every dispatched workstream is `review_ready`, `blocked`, or `deferred`. It fires for bounded failure and defer outcomes as well as review-ready outcomes. The originating Chat is released while Work runs and resumes as the review/decision entry point after the callback.

Default callback packet:

```text
run status: review_ready | blocked | deferred
workstreams:
  - status: review_ready | blocked | deferred
    repository
    issue / workstream
    branch
    PR
    validation summary
    blocker / dependency / re-entry condition, if any
coordinator note: optional one concise sentence
```

The callback carries references and status, not child transcripts, copied diffs, repository instructions, long reasoning, review verdicts, or merge authorization. The originating Chat must refresh GitHub independently before review.

### Fallback

If the runtime cannot return to the originating conversation, surface the same compact packet in the coordinator context, state that callback transport is unsupported, and stop. The reviewer still rehydrates from GitHub references.

Cursor, Codex, or other implementation agents may fill the Implementer role. That does not make this a Work- or Codex-specific Tool package.

An agent that starts inside an external target repository does not load Persona-Library after Playbook selection unless the target repository requires it. It follows the target repository's own orientation path, refreshes local instructions/source, and applies this contract. An agent working in Persona-Library follows Persona-Library's `AGENTS.md` → bootstrap → selected route path before grounding.

## Decision rights

- Coordinator may verify orientation, source-ground, dispatch confirmed or qualified workstreams, collect handoffs, send a supported completion callback or compact fallback, and stop the coordinate stage.
- Coordinator may not silently reinterpret a contradicted request as a different implementation and proceed.
- Implementer may edit only the assigned workstream and may not merge.
- Reviewer may pass, fail, or defer and must name evidence or a correction.
- Authorizer alone may merge or approve other consequential mutations.
- Unavailable Tools, connectors, or permissions are reported; they are not simulated as success.

## Quality gates

**Orientation gate.** Pass only when the Implementer context is recorded as `fresh`, `previously_oriented`, or `unknown`; `fresh` and `unknown` Implementers followed the target repository's current orientation entrypoint or an explicit `none` path was recorded; previously oriented Implementers refreshed current base and relevant scoped instructions/source; target-repository instructions were not overridden by coordinator memory; and the packet carries references/status rather than copied repository context. Fail when orientation is assumed without evidence, a fresh/unknown Implementer edits before applicable local orientation, a previously oriented Implementer skips freshness checks, or Persona-Library is made an unnecessary external-repository prerequisite.

**Source-grounding gate.** Pass only when the target repository and base revision are known; repo-local instructions and the relevant orientation path were inspected; relevant canonical source and validation surfaces were inspected; the requested work was classified as confirmed or qualified; qualifications are reflected in the dispatch packet; and known shared-file/dependency collisions are either removed from parallel scope or explicitly serialized. Fail when the workstream is framed only from conversation memory or Persona-Library context; canonical ownership is unknown; current source contradicts the requested implementation; local instructions or required validation were skipped without an explicit reason; or the workstreams are not actually independent. A contradicted result fails this gate and must be re-scoped before dispatch.

**Dispatch gate.** Pass only when each implementer has one recorded orientation state, one confirmed or qualified workstream, one repository, one stop condition, and no instruction to spawn sub-agents. Fail if a contradicted workstream is dispatched, the coordinator plans to reimplement, poll instead of awaiting handoff, or review code before the review stage.

**Implementer stop gate.** Pass only when the workstream has a reviewable PR, a bounded blocker, or a bounded defer with a named dependency and re-entry condition; required validation was run or explicitly skipped with reason; and the Implementer did not merge. Fail if nested agents were used, scope expanded, or `deferred` is used without an explicit scoped dependency and re-entry condition.

**Handoff gate.** Pass only when the packet uses the compact schema, includes one terminal status per workstream and the aggregate status rule, and does not include child transcripts or large repository copies. A supported callback has an aggregate terminal state from `review_ready`, `blocked`, or `deferred` plus each workstream's terminal state; an unsupported callback is surfaced as the same compact coordinator fallback. Fail if GitHub identities are missing without being marked unknown, a defer lacks its dependency/re-entry condition, or callback transport is simulated.

**Review gate.** Pass only when the reviewer re-fetched current GitHub state, checked problem correctness against current repository source and owner, and separated blockers from suggestions. Fail if the handoff or callback was treated as proof of current PR/diff/check state. A fail with scoped corrections is an entry to stage 6, not a run-stop.

**Correction-loop gate.** Recording scoped corrections is not terminal. Pass only after the named defects are applied and the updated PR is re-reviewed to accept, or the workstream is explicitly blocked or deferred.

**Run-stop gate.** Pass only when every dispatched workstream is accepted after review or explicitly blocked or deferred, compact handoffs exist, and merge is either separately authorized and completed or explicitly left unmerged. Fail if the run closes with a known failed review that still needs apply and re-review.

**Merge gate.** Pass only with explicit authorization and fresh preflight. Implementation completion, a compact callback, or a passing review does not pass this gate by itself.

## Failure and recovery

- Missing or overlapping workstream: do not dispatch; split or serialize first.
- Missing orientation evidence: stop before source-grounding; record the target entrypoint, required local reads, and the smallest safe recovery.
- Contradicted workstream: stop and re-scope; do not dispatch; do not silently reinterpret.
- Stale issue or remembered architecture: treat as contradicted or qualified from current source, not from conversation memory.
- Shared-file collision discovered during grounding, review, or merge: serialize remaining work; rebase the later PR; do not require both implementers to keep editing in parallel.
- Unavailable GitHub connector: report the limitation; do not infer remote state; use the documented fallback only when accepted.
- Implementer blocked: keep the workstream blocked; do not spawn a grandchild agent to bypass the blocker.
- Reviewer unavailable: leave PRs unmerged; do not have the coordinator silently review during the coordinate stage.
- Interrupted run: resume from GitHub identities in the last compact handoff, not from remembered transcripts.
- Unauthorized merge request: stop at reviewable PRs and ask for authorization.
- Unsupported callback transport: surface the compact packet in the coordinator context, record the limitation, and stop without simulating delivery or polling indefinitely.

## Capabilities and Tools

- Repository-local `AGENTS.md` and Operating Packs: follow them inside a workstream; do not copy them into the Playbook.
- GitHub operating contract: a Tool requirement for issue/PR/review/merge freshness and authorization. Reuse that contract; do not duplicate Tool instructions here. A pin or catalog mention does not prove connector availability.
- `$playbook-composer`: use when maintaining this Playbook, not when executing a run.
- `$change-impact-reconciliation`: use after durable Playbook, Docs, Decision, or generated-artifact changes.
- `$tool-discovery-and-safe-execution`: use when a workstream needs a Tool capability resolved; missing access is a blocker.

Do not add a Work/Codex-specific Tool package unless later evidence shows substantial runtime-specific procedure that belongs in `tool-repo`.

## Representative and boundary cases

**Representative case.** Two independent `tool-repo` workstreams: issue #3 / PR #6 (GitHub package split) and issue #4 / PR #5 (Figma package). Separate implementers produced one branch and one PR each. Merge was sequential after #6 landed, including a README rebase on #5. See the original Work Order proof for what matched this contract and what the coordinator still duplicated.

**Source-grounding case.** `template-library` issue #1 remains open as a 2026-09-11 plan that audited an empty repository. Current `main` already contains `ARCHITECTURE.md` and three Templates. Dispatching the issue’s “first PR as written” is **contradicted**. A remaining repository-contract slice (root `AGENTS.md`, `CONTRIBUTING.md`, validator/tests) would be **qualified** only after re-scope. Persona-Library records were not required after Playbook selection. See this issue’s Work Order proof.

**Boundary case.** Two workstreams that secretly share a file, a coordinator that reviews diffs while still dispatching, or a workstream framed only from conversation memory without inspecting target-repository source, fails the source-grounding, dispatch, or merge gate. Nested sub-agents, transcript-as-truth review, and merge-by-callback also fail.

## Provenance

- Request: [Persona-Library #82](https://github.com/rickvang/Persona-Library/issues/82)
- Source-grounding amendment: [Persona-Library #86](https://github.com/rickvang/Persona-Library/issues/86)
- Runtime-mapping amendment: [issue comment](https://github.com/rickvang/Persona-Library/issues/82#issuecomment-5663449934)
- Related: [#71](https://github.com/rickvang/Persona-Library/issues/71) collaboration identity, [#75](https://github.com/rickvang/Persona-Library/issues/75) GitHub/current-repository workflow, [#70](https://github.com/rickvang/Persona-Library/issues/70) ownership boundaries, [#60](https://github.com/rickvang/Persona-Library/issues/60) external-artifact boundary, `tool-repo` #3 and #4, `template-library` #1
- Confidence: contract is inspectable; one two-lane repository case exists; one external-repository source-grounding case exists; Chat→Work completion callback is a documented adapter, not yet a required proof for every runtime
- Assumptions: GitHub remains the default repository workflow; implementers can inspect fresh repository state; merge stays a separate authorization; Persona-Library stays catalog/discovery rather than an execution dependency
- Unresolved: whether later cases need a second live parallel-run proof across two repositories; whether #71 later catalogs Multi-Persona Collaboration beside this identity; whether substantial Playbook artifacts should later move to an independent library
- Next action after an authorized update: bounded `$change-impact-reconciliation`, then reviewable PR, then separately authorized merge
