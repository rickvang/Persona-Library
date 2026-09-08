
# Expert UX Design Practice

Status: current docs-owned workflow and reference method for Persona Library work.

## Purpose

Use this practice when a product, feature, workflow, or interface needs information architecture and aesthetic design to carry through into interaction, responsive behavior, accessibility, evaluation, implementation handoff, and post-build QA.

The practice is designed to produce one useful design outcome, not a gallery of polished screens or a documentation exercise. It makes the reasoning behind structure and visual emphasis inspectable and keeps evidence separate from assumptions.

This is a workflow/reference guide applied through existing Persona records. It is not a replacement for Camille Ortiz, Jordan Lee, Layout Lab, the collaboration context, or the existing Skill catalog.

## Artifact decision and boundaries

The active work artifact is a project-scoped UX work order. It contains the request, scope, evidence, selected or generated participants, questions, decisions, phase status, gate results, handoffs, and next action.

The IA-to-UI traceability matrix remains a separate linked artifact. The work order records what happened and what needs to happen next; the matrix proves that the final design covers the important goals, content, structure, states, responsive rules, accessibility conditions, and acceptance criteria. Keeping them separate prevents a timeline from becoming a substitute for design coverage.

Use the existing repository layers as follows:

- Existing Persona records provide perspectives and routing, not automatic user evidence.
- Existing Skills and skill guidance provide portable capabilities; this practice composes them and does not redefine them.
- Layout Lab compares materially different IA or layout directions in an isolated prototype with identical content.
- The shared problem-context mechanism is used when multiple Personas genuinely need shared coordination.
- Decisions preserve durable alternatives, rationale, tradeoffs, affected surfaces, and revisit conditions.
- Change Impact Reconciliation checks downstream effects after a durable source, record, decision, prototype promotion, or generated artifact change.
- A work order records authorization constraints but never grants permission for a mutation, publication, account action, or external communication.

Relevant repository sources:

- [Repository activation](../../AGENTS.md)
- [Architecture and space boundaries](../../ARCHITECTURE.md)
- [Canonical Persona and Skill data](../../content/library-data.js)
- [Layout Lab](../../.agents/skills/layout-lab/SKILL.md)
- [Shared problem context](../collaboration/problem-context.md)
- [Collaboration Playbook](../collaboration/multi-persona-collaboration-playbook.md)
- [Change Impact Reconciliation](../../.agents/skills/change-impact-reconciliation/SKILL.md)
- [UX work order template](ux-work-order-template.md)
- [IA-to-UI traceability template](ia-to-ui-traceability-template.md)

## Project context and reference routing

Start non-trivial UX work with the [Project Context and Reference Routing method](project-context-and-reference-routing.md) and record the result in the [UX Work Order](ux-work-order-template.md).

The routing layer keeps the method adaptive:

1. Infer the smallest project profile from the request and available sources.
2. Select one primary project lens and only the conditional gates that fit.
3. Load the relevant Persona, Skill, reference, and example IDs into the Work Order.
4. Revise the route when evidence changes the project type, risk, uncertainty, or workflow.

The universal quality baseline still applies. A focused route may reduce artifact breadth, but it may not silently omit a relevant state, accessibility condition, evidence limitation, or authorization boundary.

Project classification is routing metadata, not proof of a user need or product requirement. Ask one focused question when ambiguity would materially change the route or safety boundary; otherwise proceed with a reversible, visibly labeled provisional classification.

The starter [Design Reference Library](design-reference-library.md) contains sourced principles and illustrative examples. Use references by ID, preserve their source scope and tradeoffs, and do not treat attractive product examples as user evidence. Keep project assumptions and synthetic participant responses project-scoped.

## When to use

Use the practice for:

- a new flow, feature, page, or product surface;
- a change where content grouping, navigation, terminology, or hierarchy is uncertain;
- a workflow with important loading, empty, error, permission, recovery, or confirmation behavior;
- a design where visual polish has previously hidden structural or implementation weaknesses;
- a high-consequence action, approval, publication, account, payment, privacy, or accessibility-sensitive flow.

Use only the affected slices for a small change in a well-understood workflow. Record why the broader practice was not warranted.

Do not use this practice to:

- claim that a synthetic Persona is a real participant;
- invent user research, tool usage, requirements, stakeholder agreement, or validation results;
- convert a prototype selection into a live change without authorization;
- replace product strategy, policy, legal review, security review, or domain expertise;
- create a permanent Persona merely because a temporary research proxy was useful.

## Evidence and uncertainty vocabulary

Every important observation, decision, or finding receives an evidence status.

| Status | Meaning | Allowed use |
| --- | --- | --- |
| sourced | Directly supported by a cited repository, standard, study, or provided artifact. | Grounds a recommendation within that source's scope. |
| observed | Collected from an actual user session, field observation, support record, analytics source, or implementation inspection. Include source, date or revision, and scope. | May describe what was observed; do not generalize beyond the evidence. |
| heuristic | Inference from an explicit usability, accessibility, content, or design-system principle. | Identifies a risk or recommendation, not user validation. |
| synthetic_assumption | Answer generated by a temporary synthetic participant or scenario model. | Surfaces questions, risks, and possible workflow needs only. |
| assumption | A supplied or inferred condition that is not verified. | May guide reversible exploration; must remain visible. |
| recommendation | A proposed design or process choice. | Must not be reported as evidence. |
| unknown | Required information is unavailable or unresolved. | Blocks a claim, not necessarily all progress; define the next validation step. |

An observed finding without a named source and session or revision context is not promoted to observed. A synthetic response is never promoted by repetition or agreement with another synthetic response.

## Persona routing

Do not merge Camille Ortiz and Jordan Lee into an invented Expert UX Designer record.

- Jordan Lee, ux-senior, leads when the problem, content model, terminology, task flow, navigation, or evaluation question is unsettled. Jordan owns the reasoning trail for why the structure serves the task.
- Camille Ortiz, ui-expert, leads once the task and sufficient structure are known. Camille owns visual hierarchy, contextual composition, interaction states, responsive behavior, UI accessibility, implementation notes, and built-versus-designed QA.
- Both review IA-to-UI coherence and accessibility when the change is material. Neither may invent research or make an unauthorized product decision.
- Use the smallest relevant Persona set. If several named Personas need shared state and handoffs, use the shared problem-context and collaboration Playbook.
- If no relevant Persona exists, generate a temporary project-scoped synthetic participant as described in Phase 2. Do not add it to canonical library data by implication.

Routing is conditional rather than a permanent lead assignment. A settled task may start with Camille; an unsettled task starts with Jordan. The work order records the actual owner and the reason.

## Proportionality

Choose a tier before design work begins.

| Tier | Typical case | Required minimum |
| --- | --- | --- |
| focused | Small change in a known workflow. | Goal and affected task; existing content/evidence check; affected IA, visual, state, responsive, and accessibility review; focused implementation QA; short work-order status. |
| feature | New feature, flow, or uncertain structure. | Full contextual discovery, content fixture, IA artifact, visual and state design, risk-based prototype, evaluation record, traceability matrix, handoff, and QA. |
| consequential | Irreversible, high-risk, multi-role, regulated, accessibility-sensitive, or system-wide change. | Feature tier plus real-user research when feasible, explicit permissions and recovery, Layout Lab for contested structure, broader accessibility and outcome checks, and named decision/reconciliation records. |

Proportionality reduces breadth and artifact count; it does not excuse missing minimum gates. A one-screen change can be valid with one affected screen if its states, content, interaction, and responsive behavior are covered. A breakpoint check is required when responsive behavior is affected or materially risky.

## Practice phases

### 1. Scope and frame

Start with the smallest useful statement of the work:

- user or operator goal and primary task;
- audience or target role;
- current workflow or product surface;
- decision the design must support;
- included and excluded scope;
- evidence already available and evidence missing;
- constraints, authorization boundary, and stopping condition;
- proportionality tier and responsible owner.

Deliver a work-order header and a one-paragraph problem frame. Name the outcome that will be handed off: a decision, IA model, prototype, design specification, implementation acceptance packet, or other concrete artifact.

Decision criteria:

- The task is specific enough to trace through design.
- Success and stop conditions are observable.
- Unknowns are visible rather than filled with invented detail.
- The work is small enough for the selected tier.

Anti-patterns:

- Starting with color, a component, or a screenshot before the task is known.
- Treating a stakeholder preference as a user goal without evidence.
- Expanding the work because a template contains more fields.
- Leaving authorization or the completion boundary implied.

Gate: pass only when the work order identifies the task, scope, evidence status, owner, stopping condition, and minimum deliverable. Otherwise pause for clarification or record a no-go.

### 2. Contextual workflow and tool discovery

Before final IA decisions, establish how the target role actually works when the workflow is new, unfamiliar, or consequential.

Ask about a recent real task where possible:

1. What was the goal and what steps occurred in practice?
2. Which tools, systems, documents, channels, or sources were used?
3. Where did handoffs, interruptions, permissions, re-entry, or context switching occur?
4. What workarounds or informal practices kept the task moving?
5. What information was needed at each step?
6. What happens when the normal path fails, data is missing, or recovery is required?
7. What does a successful outcome mean to the person doing the work?

Expected outputs:

- a compact workflow map from trigger to outcome;
- tool and system inventory, with known versus unverified usage;
- handoffs, dependencies, interruptions, and workarounds;
- content and information needed at each step;
- constraints and failure/recovery conditions;
- evidence labels, open questions, and IA implications.

Real-user path:

- Decide whether research is warranted for the selected tier and uncertainty.
- Define the target segment and context.
- Prepare a concise screener, interview or contextual-inquiry guide, or usability task script.
- Record actual sessions with source, date or revision, participant scope, and observed findings.
- Preserve contradictory observations instead of averaging them away.

Temporary synthetic-participant path:

- First check whether an existing Persona is relevant. Use the smallest relevant set; do not poll the library.
- If none is relevant, generate a project-scoped profile from the task, provided role, known context, available sources, and explicit constraints.
- Include only role, goal, task, environment, tools known or unknown, handoffs, interruptions, constraints, failure modes, evidence basis, assumptions, unknowns, and validation questions.
- Ask the synthetic participant context-specific questions about likely workflow, tools, terminology, priorities, and recovery.
- Require each answer to state its basis and label it synthetic_assumption, assumption, recommendation, or unknown.
- Use the answers to expose missing states, terminology risks, competing priorities, and questions for real users.
- Do not call the answers observed, validated, user feedback, demand, prevalence, satisfaction, task time, or stakeholder agreement.
- Keep the generated profile in the work order or a linked project artifact. A permanent Persona requires a separate authorized creation decision and evidence review.

A useful synthetic prompt has this shape:

~~~text
You are a temporary workflow participant for this project, not a real user.
Role and task:
Known context and sources:
Known tools or systems:
Unknown or unverified details:
Answer each question with:
- modeled answer;
- basis in provided evidence or explicit assumption;
- confidence or uncertainty;
- question to validate with a real user.
Do not claim personal experience or observed behavior.
~~~

Gate: pass when the workflow and tool implications are either evidence-backed or visibly marked as assumptions and unknowns. A small known workflow may skip this gate only with a written reason. A consequential unfamiliar workflow should not proceed to final IA with no participant perspective, even if that perspective is synthetic.

### 3. Content and information architecture

Build structure against a frozen content fixture. An approved existing content sample counts; do not manufacture a large dataset just to satisfy the template.

Deliverables:

- content inventory and source authority;
- taxonomy, labels, terminology, and grouping rationale;
- navigation model and task flows;
- screen and state map with stable IDs;
- content fixture and any long, short, empty, error, permission, or partial-data cases needed to test the structure;
- responsive structure rules where the information architecture changes across environments;
- alternative IA models when a material choice remains unresolved.

Stable IDs make later checks a join rather than a prose re-derivation. Example IDs are goal.invite, flow.invite, screen.invite.form, and state.invite.error.email.

Layout Lab branch:

- Invoke Layout Lab when two or more materially different IA, navigation, or layout models remain plausible.
- Use identical representative content and the same task and evaluation criteria for every option.
- Record alternatives, tradeoffs, evidence, and a valid no-selection outcome.
- Treat selection as a design decision, not authorization to edit a live page.
- On promotion, use the required decision and change-impact path.

Decision criteria:

- Every important user goal and content need maps to at least one IA item.
- Every important IA item maps to a task, content need, or explicitly unserved item.
- Labels are understandable in context and do not depend on visual styling alone.
- The chosen structure handles realistic content and known constraints.
- Unresolved alternatives are explored or explicitly parked.

Anti-patterns:

- Designing a single hero screen and inferring the rest of the system.
- Changing content between alternatives, making comparison invalid.
- Choosing a label because it sounds polished or matches a reference.
- Treating a selected prototype as a live update.
- Hiding unserved tasks inside a positive summary.

Gate: fail on orphaned goals, content, screens, or states; missing stable IDs; no suitable fixture; unexamined material IA alternatives; or an unsupported selection. Return to Phase 2 or record no-go.

### 4. Visual and interaction translation

Carry the agreed structure into a coherent interface. Aesthetic direction is an information decision, not a mood board.

Deliverables:

- visual principles tied to hierarchy, task consequence, context, readability, and brand;
- typography, color roles, spacing, grid, density, imagery, motion, and composition rules;
- representative screen or screen set using the same content and IA;
- component behavior and microcopy;
- state matrix for affected components and screens;
- responsive transforms across affected widths, content lengths, zoom levels, and input modes;
- accessibility decisions for semantic structure, keyboard order, focus, contrast, target size, motion, errors, and assistive technology where relevant;
- one rejected direction and its reason when more than one visual direction was considered.

For each major visual choice, record what information or action it helps the user notice, understand, compare, or complete. A reference may inform the direction but cannot be the rationale by itself.

State completeness:

At minimum consider initial, loading, empty, partial data, success, error, disabled, permission denied, stale or offline, validation, destructive confirmation, recovery, and interrupted states where applicable. Record irrelevant states as not applicable with a reason rather than silently omitting them.

Responsive and accessibility rule:

Preserve the user's task, content relationships, state meaning, and recovery path as the environment changes. Do not define responsive behavior only as device labels. Test semantic order, visual order, keyboard order, zoom, contrast, text expansion, narrow widths, long content, and input changes when affected.

Decision criteria:

- Visual emphasis follows task consequence and information hierarchy.
- The primary action and current state are clear without explanation.
- Visual, semantic, keyboard, responsive, and interaction order agree.
- Component reuse preserves the needs and limits of the problem.
- The design remains useful outside the polished happy path.

Anti-patterns:

- Everything has equal emphasis.
- A new palette is treated as a new information architecture.
- Mobile is a compressed desktop screenshot.
- Error or recovery behavior is left for implementation to infer.
- Accessibility is an appendix or a passing automated scan.
- “Feels better” is the only rationale.

Gate: fail when visual direction cannot be traced to the structure and task, when required states or responsive transforms are missing, or when a polished screen hides a structural or accessibility failure. For a multi-screen decision, use at least two representative screens or explicitly justify why one affected surface is sufficient.

### 5. Prototype, evaluate, hand off, and QA

Prototype the riskiest question, not every possible screen.

Evaluation options:

- Heuristic review tied to the actual IA, content, states, and accessibility risks.
- Synthetic participant review to generate hypotheses and adversarial questions.
- Real-user interview, contextual inquiry, or usability session when access and risk justify it.
- Implementation inspection against the acceptance criteria after the build exists.

Record the method, scope, evidence status, and what was not tested. A modeled or heuristic answer is not an observed user finding.

The traceability matrix must connect:

goal → content or IA item → task flow → screen region → component → state → responsive rule or breakpoint → accessibility condition → acceptance criterion.

Handoff deliverables:

- accepted IA and visual direction;
- stable content and state fixture;
- interaction, responsive, accessibility, and recovery rules;
- acceptance criteria with fail conditions;
- implementation questions and known limitations;
- owner, revision, and next validation action.

Post-build design QA:

- Compare the built experience with the approved structure and fixture.
- Inspect affected states, responsive conditions, accessibility conditions, overflow, content length, loading, empty, error, confirmation, and recovery behavior.
- Record findings and the scope that was not checked.
- Distinguish implementation defects from changed requirements or intentionally accepted tradeoffs.
- Return failed work to the smallest responsible phase; do not declare completion because handoff occurred.

Durable change handling:

- The workflow that performs product or repository work owns that mutation and its domain checks.
- After a durable source, record, Decision, prototype promotion, or generated artifact change, invoke Change Impact Reconciliation as required by the initiating contract.
- Reconciliation is read-only by default and does not authorize unrelated updates.

Final gate: pass only when there is one concrete deliverable or decision, the work is traceable to evidence and labeled assumptions, required states and affected responsive/accessibility conditions are covered, handoff does not require guessing, QA scope is visible, and the next action or completion boundary is explicit.

## Traceability matrix contract

Use stable row IDs and retain rows that are unserved or blocked. Do not delete a weak row to make the matrix pass.

Required columns:

- row ID;
- user goal and task;
- content or IA item;
- flow and screen/state ID;
- component or interaction;
- visual or hierarchy rationale;
- responsive transform or affected breakpoint;
- accessibility condition;
- acceptance criterion and fail condition;
- evidence status and source;
- owner;
- gate status;
- open question or next action.

Minimum checks:

- every important goal has a served row or an explicit unserved decision;
- every important IA item has a goal, task, or content rationale;
- every affected screen has its important states;
- every affected responsive condition has a transformation rule;
- every acceptance criterion is testable;
- every unknown has an owner or validation path;
- no visual claim is supported only by preference.

The matrix is not a substitute for the work order, and the work order is not a substitute for the matrix.

## Worked examples

All examples below are illustrative. They are not research findings.

### Example A: simple flow — invite a collaborator

Scenario: A product needs a single-goal invitation form. The user enters a name and email, optionally adds a message, submits, and needs to know whether the invitation was sent.

Context status: illustrative synthetic scenario. Actual tool usage, terminology, and user behavior are unknown until validated.

Frame:

- Goal: send one invitation with confidence.
- Primary task: complete and submit the form.
- Success: the user understands the recipient, submission result, and next action.
- Stop condition: the form and its important states are specified and implementable.
- Tier: focused or feature depending on whether the invitation workflow is new.

Context questions:

- Where does the user get the recipient information?
- Is invitation status visible elsewhere?
- What happens for an existing member, invalid address, expired invitation, or no permission?
- Which notification or directory system is authoritative?

IA:

- Entry point → invitation form → confirmation or recovery.
- Stable IDs: goal.invite, screen.invite.form, state.invite.initial, state.invite.invalid, state.invite.submitting, state.invite.success, state.invite.failure.
- No additional navigation is introduced unless the task requires it.
- Approved content fixture includes short and long names, valid and invalid email examples, and a message at its allowed length.

Visual and interaction decisions:

- The recipient and primary action receive the strongest emphasis because they define the task.
- Help text and optional message recede without becoming undiscoverable.
- Labels remain visible; validation is adjacent to the relevant field; focus moves to the first actionable error.
- Submit, submitting, success, duplicate, permission, and recovery behavior are specified.
- On narrow widths, fields stack without changing the task order or hiding the result.

Evaluation:

- A heuristic and synthetic review can ask what the participant expects to happen after submit.
- Any answer from the synthetic scenario is synthetic_assumption.
- No real-user success rate or preference is claimed.

Gate result:

Pass only after the matrix covers the goal, form states, error and recovery, responsive stacking, accessible labels and focus, and an acceptance criterion such as: “Given an invalid address, the user can identify the correction without losing entered content.”

### Example B: complex/high-risk flow — review and publish a report

Scenario: An editor prepares a report; an approver reviews it; publishing makes the current version available to others and may require an explicit confirmation.

Context status: illustrative. Roles, systems, permission rules, and recovery behavior must be verified for the actual product.

Frame:

- Goal: publish the intended report version with clear authority and recoverable failure.
- Primary tasks: review readiness, resolve issues, approve, publish, and verify status.
- Risks: wrong version, missing permission, stale data, partial save, accidental publication, unclear ownership, and inability to recover.
- Tier: consequential.

Context and tool discovery:

- Identify the real editor and approver workflows, content sources, review channels, publication system, audit trail, and handoffs.
- If no suitable Persona exists, generate separate temporary workflow participants only for the roles needed; record unknown tools rather than inventing them.
- Questions must include what “ready,” “approved,” “published,” and “reverted” mean in the actual context.

IA:

- Work queue → report detail → readiness checklist → preview/version comparison → approval → publish confirmation → status/history/recovery.
- Stable IDs distinguish draft, needs changes, approved, publishing, published, failed, stale, permission denied, and reverted states.
- Layout Lab is required if alternative queue/detail/version models materially change navigation or review comprehension.

Visual and interaction decisions:

- Status and version are more prominent than decorative branding.
- Review findings and required actions are grouped by consequence.
- Publish is visually and behaviorally distinct from reversible edits.
- The confirmation names the version and consequence; it does not rely on color alone.
- Responsive behavior preserves version identity, status, review findings, and the safe path to cancel or recover.

State and accessibility matrix:

- Include loading, partial data, stale/offline, permission denied, validation, unsaved changes, concurrent update, approval requested, approval rejected, publish confirmation, publishing, publish success, publish failure, and recovery where applicable.
- Specify keyboard order, focus after errors, announcement of status changes, contrast, zoom, and content overflow for the actual environment.

Failure exhibit:

A visually polished dashboard fails if an approver cannot tell which version is being published, if the review queue has no path to unresolved findings, or if a publish failure leaves status ambiguous. The correction is structural and behavioral, not a new palette.

Evaluation and handoff:

- Prototype the riskiest question: whether a reviewer can identify the correct version and consequence before approval.
- Use real sessions when possible; otherwise record heuristic and synthetic assumptions only.
- The handoff includes permission, status, recovery, responsive, accessibility, and post-build QA acceptance criteria.
- A final pass must state what was inspected and what remains untested.

### Compact proportionality example — content-heavy browse and compare

For a browse, filter, compare, and detail surface, the focused path may use the existing content fixture, a compact taxonomy and label review, one traceability slice, representative long and empty results, and a targeted built QA pass. It should still fail if filters, comparison state, or empty/recovery behavior cannot be explained. It does not require a full research program merely because the content is dense.

## Failure and recovery

- Missing user evidence: continue with labeled assumptions or synthetic participants where safe; create validation questions.
- No relevant Persona: generate a temporary project-scoped profile; do not add a canonical record by implication.
- Conflicting workflow accounts: preserve both, identify the decision affected, and choose a reversible next step.
- Missing tool or permission: record the requirement and safe fallback; do not claim execution.
- Layout Lab comparison invalid: freeze one content fixture and rerun only the affected comparison.
- Failed gate: return to the smallest responsible phase and update the work order.
- Unauthorized mutation: stop at proposal or draft and request the missing authorization and target.
- Interrupted work: resume from the last work-order revision and explicit next action.
- Historical comparison unavailable: mark parity unknown; do not downgrade current quality work solely because the old package is missing.

## Completion checklist

- [ ] Work order has goal, scope, evidence status, owner, tier, authorization boundary, and stopping condition.
- [ ] Contextual workflow and tool discovery was run, or skipped with a reason.
- [ ] Existing or generated participants are relevant and their evidence status is visible.
- [ ] Generated participants are project-scoped and not treated as real users.
- [ ] Content fixture and stable IA/screen/state IDs exist.
- [ ] Material IA alternatives used identical content and criteria.
- [ ] Visual choices explain the information or task decision they serve.
- [ ] State, responsive, accessibility, loading, empty, error, success, and recovery coverage is proportional and explicit.
- [ ] Prototype and evaluation claims distinguish observed, heuristic, synthetic, assumption, recommendation, and unknown.
- [ ] Traceability matrix has no unexplained orphaned or unserved critical items.
- [ ] Handoff acceptance criteria are testable and do not require guessing.
- [ ] Built QA records tested and untested scope.
- [ ] Durable changes have the required decision and reconciliation record.
- [ ] One concrete deliverable, decision, or next action is explicit.
