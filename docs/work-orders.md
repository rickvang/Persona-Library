
# Work Orders

Status: repository-wide active-work packet and progress-record convention.

## Definition

A Work Order is an optional, project-scoped execution/recovery packet for work that needs durable state beyond its existing authoritative surfaces. It combines the request, scope, responsible owner, evidence, decisions, phase status, gate results, handoffs, blockers, and next action so work can be resumed without replaying the entire conversation.

Use a Work Order when interruption, cross-agent handoff, multi-phase execution, or complex gates/evidence would otherwise require reconstructing state. Do **not** create one merely because work is non-trivial, semantically important, touches a shared schema or governance surface, or has more than one meaningful step when Current Work plus the relevant issue/PR and domain-specific artifact already preserve the state needed to resume it.

A Work Order is not a transcript. Update it at the points that change what another person or agent needs to know.

## Artifact home and storage

When a Work Order is warranted for work whose authorized target is this repository, use the project-scoped artifact home:

docs/work-orders/<work-order-id>/

The directory keeps the active Work Order and its project-specific artifacts together without turning the shared library into a project dump. The Work Order remains the index and progress record; specialized artifacts remain separate files.

A typical package may contain:

- work-order.md — the active Work Order and current next action;
- context.md — a project context or routing snapshot when one is warranted;
- evidence.md — project evidence ledger or source trail when one is warranted;
- ia.md — content and information-architecture artifact;
- design.md — design direction, states, responsive rules, accessibility, and handoff;
- traceability.md — the linked IA-to-UI coverage matrix;
- validation.md — concise evaluation and QA findings;
- prototype links — references to isolated prototype records or external design files.

This is a recommended layout, not a requirement to create every file. Use only the artifacts the project needs. Keep large or specialized material in the appropriate linked system when that system is the source of truth.

When the authorized target is another repository or external project, use that target’s workspace and record its path or URL in the Work Order. Do not copy project artifacts into this repository by default.

Do not create a package directory when the work does not need a unique execution/recovery packet; see the small-change lane below. Do not invent a Work Order ID or target path when the destination is unclear.

## Small-change lane

A change qualifies for the small-change lane when its **existing authoritative surfaces already hold the durable state needed to resume and finish it**, so a separate Work Order would only duplicate that state. "Small" refers to the tracking/recovery footprint, not semantic importance, risk, file count, or whether the work touches a shared schema, Decision, or governance surface.

A qualifying change often fits in one pull request or one session, but those are heuristics rather than hard gates. Shared-schema or governance changes may still use the lane when the relevant Current Work row, GitHub issue/PR, Decision, Test Queue record, or other domain artifact already contains the plan, state, evidence boundary, and next action. Placement review, authorization, impact reconciliation, validation, and review requirements still apply.

The lane needs **no separate Work Order package**. It also does not require creating a duplicate GitHub issue or Current Work row merely to compensate for the missing Work Order. Preserve an existing issue, Current Work row, WorkNode, or domain-specific record when that surface has its own reason to exist. The pull request may be the active repository record for a bounded change; a domain-specific record such as Test Queue may own a longer-lived lifecycle independently.

Small-change status reduces duplicate tracking artifacts; it does not remove existing orchestration. If the change is already a WorkNode in an active Riley Work Graph, keep that WorkNode and its authoritative Dispatch, dependencies and Gates, evidence requirements, and final disposition. If it is part of an existing Current Work workstream, keep that relationship until the active implementation work reaches its own completion boundary.

Move to a dedicated Work Order as soon as the existing surfaces no longer carry enough recovery state—for example, interrupted cross-agent work with non-obvious accepted evidence, multi-phase execution whose gates cannot be reconstructed from the issue/PR/domain record, or a handoff that needs durable decisions and a resumable next action.

## Minimum contract

Every non-trivial Work Order should identify:

- Work Order ID and title;
- status: draft, active, blocked, ready-for-review, complete, no-go, or cancelled;
- created and last-updated dates;
- requester, current owner, and any explicit collaborators;
- request mode: answer, research, plan, prototype, update, or consult;
- scope, non-goals, constraints, and affected surface;
- evidence and uncertainty status;
- explicit authorization and target for any mutation;
- success criteria and stopping condition;
- current phase, gate result, blocker or fallback, and one next action;
- links to the concrete deliverable and specialized artifacts.
- artifact home or an explicit reason a project directory is not warranted;

A Work Order records authorization boundaries; it never grants permission for a repository, Site, Tool, account, publication, installation, registry, or external communication change.

When the repository contract defines **standing completion authorization** for a scoped implementation request, the Work Order may record that repository-level authorization as the applicable source instead of inventing a second confirmation gate. Record any explicit requester override such as `do not merge`, `PR only`, `leave for review`, or an equivalent narrower stopping boundary; the override wins for that Work Order.

For GitHub-specific mutation classes, merge authorization, and linked-issue completion semantics, follow the repository's pinned GitHub Tool contract rather than restating those rules in a Work Order.

## Lifecycle

Use the smallest lifecycle that makes status unambiguous:

1. Draft: scope and outcome are being defined.
2. Active: authorized work is in progress.
3. Blocked: a named dependency, evidence gap, decision, permission, or user input prevents the next safe step.
4. Ready for review: the concrete output and evidence limits are ready for a named reviewer.
5. Complete: the concrete outcome and completion boundary are inspectable.
6. No-go: the work should stop because the outcome is not justified, safe, or within scope.
7. Cancelled: the requester intentionally stopped the work without claiming completion.

A status change should state the reason and the next action or completion boundary.

## Progress updates

Keep entries concise. Add or revise an entry when one of these occurs:

- a phase starts or completes;
- a material assumption or unknown appears;
- a question is asked or answered;
- a decision or rejected alternative is recorded;
- a gate passes, fails, is skipped with reason, or becomes blocked;
- a handoff occurs;
- a prototype, implementation, or validation result changes the next action.

Do not log invented activity, synthetic answers as real observations, or repeated status messages that add no information.

Commit progress entries with the related work rather than as separate commits. Push a checkpoint-only commit only when an interruption would otherwise lose resumable state.

## Remote-tool efficiency and visible checkpoints

For Tool-heavy Work Orders, use the reusable Tool-use guidance rather than treating every intermediate step as a new remote checkpoint. Gather the minimum sufficient remote state, record what would invalidate it, reuse it while still valid, batch related work, and validate at the cheapest layer that can answer the question. Refresh freshness-sensitive state before consequential mutations.

A reduction in calls must not hide meaningful progress from the requester. For visual, interaction, routing, environment, or deployed integration work, record a user-reviewable checkpoint when there is materially new state to inspect. Vendor-specific GitHub, Vercel, browser, document, or other execution procedure belongs in the applicable Tool-use recipe rather than being duplicated in each Work Order.

## Evidence and uncertainty

Use explicit status labels appropriate to the work. At minimum distinguish sourced, observed, heuristic, synthetic_assumption, assumption, recommendation, and unknown.

An observed claim requires a real source and enough context to understand its scope. A synthetic participant or generated Persona is a modeled perspective and remains synthetic_assumption or assumption. Repetition, agreement among generated profiles, or a completed Work Order does not promote it to user evidence.

## Specialized artifacts

The Work Order is the active coordination layer. Link, rather than duplicate, the specialized artifact that answers a different question:

- A problem-context records shared multi-Persona state, contributions, handoffs, and solution-quality gates.
- A traceability matrix proves that goals, content, IA, screens, components, states, responsive rules, accessibility conditions, and acceptance criteria remain connected.
- A Decision records a durable choice, alternatives, rationale, tradeoffs, affected surfaces, and revisit condition.
- A prototype explores a reversible alternative and remains isolated until explicit promotion.
- An issue, pull request, or project tracker records implementation status and code review.
- A Test Queue or equivalent domain-specific verification record may own deferred validation after implementation Current Work closes; queued or unavailable verification does not by itself reopen or block completed implementation work, and a failed result creates or links new remediation work only when active coordination is needed.
- A research record or source trail preserves actual participant, field, analytics, or document evidence.
- A domain-specific template may extend the Work Order contract; see the [UX Work Order template](ux/ux-work-order-template.md).

Do not rename a specialized artifact to Work Order merely because it is linked from one. The names describe different responsibilities.

## Riley cross-agent continuity

For every substantial workstream, treat Riley Morgan / `ai-orchestrator` as the default durable orchestration owner unless the requester explicitly establishes another orchestration boundary. The selected Persona, Skill, Playbook, Tool path, or execution runtime may operate directly without an unnecessary Riley execution hop. Use the user's existing **Notion Current Work** database as the cross-thread/cross-agent index when that tracker is available. Do not create a second orchestration database for the same purpose. One Current Work row represents one substantial workstream. A linked Work Order is optional and exists only when it adds unique detailed execution/recovery state that the issue/PR and domain artifacts do not already preserve.

Use this state hierarchy:

1. **Current Work** — concise cross-agent index: Work ID, current objective, owner or agent, Operating Route, optional Parent Work ID, next action, blocker, last checkpoint, and links to the authoritative work surfaces.
2. **Work Order or authoritative domain artifact** — use a Work Order for unique detailed execution/recovery state; otherwise resume from the relevant issue/PR, Test Queue record, Decision, project artifact, or other authoritative record that already owns that state.
3. **Live systems** — freshness-sensitive operational authority: GitHub branch/PR head, CI, review threads, mergeability, deployments, permissions, and other state that can change independently of the checkpoint.

**Resume order:** Current Work → linked Work Order when one exists, otherwise the smallest authoritative issue/PR/domain artifact → selectively refresh live systems whose state may have been invalidated. Reuse still-valid evidence instead of reconstructing the conversation or broadly refetching every source.

**Riley reconciliation points:** workstream creation, material rerouting, cross-agent handoff, major blocker, and completion. At these boundaries, update the durable route and next action in Current Work; do not require an extra Riley runtime call when the selected operating route can continue directly.

Update Current Work at material lifecycle or ownership transitions and whenever the next safe action materially changes. Do not use it as a mirror of every commit, check, review count, current SHA, mergeability result, or deployment event. **Do not mirror volatile live state** merely to make the tracker look complete; the Last Checkpoint should record the last proven state and the Next Action should name what must be refreshed before a consequential mutation.

If an agent is interrupted, the next agent should be able to resume from the Current Work row plus the linked Work Order **or** authoritative issue/PR/domain artifact without replaying completed phases. Create a Work Order at that point only if the existing surfaces are insufficient for reliable recovery. Historical checkpoint facts remain reusable unless a named invalidation event makes them stale; current external state must still be refreshed at the boundary where freshness matters.

## Handoff and recovery

A handoff records:

- Work Order ID and revision;
- from and to owner or phase;
- accepted evidence and decisions;
- open questions;
- blocker or safe fallback;
- required output;
- one next action;
- acknowledgement status.

An interrupted Work Order resumes from its last revision and next action. Do not silently replay completed phases or erase disagreement.

## Completion gate

A Work Order is complete only when:

- one concrete deliverable, decision, prototype, implementation, or action plan is linked;
- the original success criterion or an explicit no-go reason is addressed;
- evidence, assumptions, unknowns, and untested scope remain visible;
- material gate failures and corrections have dispositions;
- authorization and mutation boundaries were respected;
- the next action or explicit completion boundary is recorded;
- when the Work Order or linked GitHub issue is already mirrored in an external active-work tracker, that linked tracker has been reconciled to the material lifecycle change and both systems have been verified before completion is reported.

This reconciliation requirement applies only to an already-linked active-work tracker; it does not require creating one for otherwise lightweight standalone work or for deferred Test Queue verification after the implementation workstream has closed. Treat blocked, ready-for-review, complete, no-go, and cancelled transitions as material when stale mirrored state would misrepresent the work. GitHub-specific merge authorization and linked-issue completion semantics remain governed by the repository's pinned GitHub Tool contract.

A polished artifact, a handoff, or a full-looking checklist is not completion by itself.

## Archive lifecycle

Active packages stay directly under `docs/work-orders/<work-order-id>/`. When a Work Order reaches a terminal status — `complete`, `no-go`, or `cancelled` — move the package to `docs/work-orders/archive/YYYY-MM/<work-order-id>/` using the month of the reliable terminal update. Archival is lifecycle classification, not deletion; archived packages are read-only historical evidence unless a later issue explicitly reopens or corrects them. Do not archive draft, active, blocked, or ready-for-review work.

When merging the pull request is the last remaining repository step, record the terminal status and move the package in that pull request instead of opening an archive-only pull request; the archived record lands only when the work does.
