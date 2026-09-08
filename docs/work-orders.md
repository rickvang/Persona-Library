
# Work Orders

Status: repository-wide active-work packet and progress-record convention.

## Definition

A Work Order is the current, project-scoped record for non-trivial work that is in progress. It combines the request, scope, responsible owner, evidence, decisions, phase status, gate results, handoffs, blockers, and next action so work can be resumed without replaying the entire conversation.

Use a Work Order for design, research, content, Persona, Skill, Tool, prototype, documentation, repository, and implementation work when the work has more than one meaningful step or can be interrupted and resumed.

A Work Order is not a transcript. Update it at the points that change what another person or agent needs to know.

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

A Work Order records authorization boundaries; it never grants permission for a repository, Site, Tool, account, publication, installation, registry, or external communication change.

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
- A research record or source trail preserves actual participant, field, analytics, or document evidence.
- A domain-specific template may extend the Work Order contract; see the [UX Work Order template](ux/ux-work-order-template.md).

Do not rename a specialized artifact to Work Order merely because it is linked from one. The names describe different responsibilities.

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
- the next action or explicit completion boundary is recorded.

A polished artifact, a handoff, or a full-looking checklist is not completion by itself.
