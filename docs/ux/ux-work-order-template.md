
# UX Work Order Template

Use this template as the active work packet for a non-trivial UX practice run. It combines the initial request with concise progress records so another person or agent can resume the work. It is not a transcript, a research result, or permission to mutate an external system.

For a trivial change, a short note may state that a full work order was not warranted and why.

## Header

- Work-order ID:
- Title:
- Status: draft / active / blocked / ready-for-review / complete / no-go
- Created:
- Last updated:
- Requester:
- Current owner:
- Request mode: answer / research / plan / prototype / update / consult
- Proportionality tier: focused / feature / consequential
- Change mode and domain:
- Reconciliation requirement:
- Explicit authorization and target:
- Stopping condition:

Authorization is a constraint to record, not a permission granted by this document. Do not infer repository, Site, Tool, publication, account, or external communication authorization.

## Project context and reference routing

Use the [Project Context and Reference Routing method](project-context-and-reference-routing.md) before non-trivial design work. It infers the smallest project profile, selects a primary lens, and routes only the relevant Personas, Skills, references, examples, and conditional gates.

### Project profile

- Primary project type:
- Secondary project type:
- Primary user or operator job:
- Platform and environment:
- Content density and variability:
- Risk or consequence level:
- Uncertainty level:
- Audience or role:
- Evidence available and missing:
- Constraints and authorization boundary:
- Success criteria:
- Stopping condition:

### Routing decision

- Primary lens:
- Secondary lens, if any:
- Why this route fits:
- Classification confidence:
- Provisional assumptions:
- Proportionality tier:
- Selected Personas and Skills:
- Selected reference IDs and examples:
- Minimum gates:
- Conditional gates:
- Gates skipped with reason:
- Question that would materially change the route:

### Profile revisions

| Revision | Date | Field or lens changed | New evidence | Impact on route | Decision or next action |
| --- | --- | --- | --- | --- | --- |
| R-001 |  |  |  |  |  |

### Promotion disposition

| Candidate | Generalizable beyond this project? | Evidence status | Proposed shared location | Decision |
| --- | --- | --- | --- | --- |
|  | yes / no / unknown |  |  | retain project-only / propose / reject / deferred |

Routing metadata may be inferred, but it must not be presented as verified user research, product requirements, tool usage, or stakeholder agreement. Keep project-specific assumptions in this Work Order or a linked context artifact.

## 1. Scope and frame

### User or operator goal

Write the outcome the person needs, not a screen description.

### Primary task

State the task that must be traceable through content, IA, interaction, and acceptance.

### Included scope

-

### Excluded scope

-

### Success criteria

-

### Known constraints

-

### Evidence already available

| Evidence ID | Description | Status | Source or revision | Scope and limitation |
| --- | --- | --- | --- | --- |
| E-001 |  | sourced / observed / heuristic / synthetic_assumption / assumption / recommendation / unknown |  |  |

### Unknowns and validation questions

| Unknown ID | Unknown | Why it matters | Next validation method | Owner |
| --- | --- | --- | --- | --- |
| U-001 |  |  |  |  |

## 2. Contextual workflow and tool discovery

Complete this section for new, unfamiliar, or consequential workflows. For a known small change, record a skip reason.

### Research decision

- Why contextual discovery is or is not warranted:
- Target role or segment:
- Real-user research available: yes / no / partial
- Proposed session, interview, observation, or usability task:
- Access, consent, and safety constraints:

### Workflow map

| Step ID | Trigger or action | Information needed | Tool/system | Handoff or interruption | Failure/recovery | Evidence status |
| --- | --- | --- | --- | --- | --- | --- |
| W-001 |  |  |  |  |  |  |

### Tool and system inventory

| Tool/system | What it appears to support | Known or unverified | Source | Permission or access question |
| --- | --- | --- | --- | --- |
| T-001 |  | known / unverified |  |  |

### Participant records

| Participant ID | Type | Role/task | Source or construction basis | Evidence status | Open validation |
| --- | --- | --- | --- | --- | --- |
| P-001 | existing Persona / generated synthetic |  |  |  |  |

Existing Personas are modeled collaborators or user archetypes, not automatic evidence. If a generated synthetic participant is used, keep it project-scoped and state the evidence basis and unknowns.

### Synthetic participant prompt and responses

Use only when real participants are unavailable or the selected tier permits interim modeling.

Prompt context:

- Role and task:
- Known context and sources:
- Known tools:
- Unknown or unverified details:
- Constraints:

Question and response record:

| Question ID | Question | Modeled answer | Basis | Status | Real-user validation question |
| --- | --- | --- | --- | --- | --- |
| Q-001 |  |  |  | synthetic_assumption / assumption / recommendation / unknown |  |

Never label these responses observed, validated, user feedback, demand, prevalence, satisfaction, task time, or stakeholder agreement.

## 3. Content and information architecture

### Content fixture

- Fixture ID or source revision:
- Why this content is representative:
- Long-content case:
- Short-content case:
- Empty or partial-data case:
- Error, permission, stale/offline, or recovery case:

### Content inventory and terminology

| Content ID | Content or concept | Source authority | Label | Grouping or taxonomy rationale | Evidence status |
| --- | --- | --- | --- | --- | --- |
| C-001 |  |  |  |  |  |

### IA alternatives

| Alternative ID | Structure or navigation model | Strength | Risk or tradeoff | Evidence status | Selected / parked / no-go |
| --- | --- | --- | --- | --- | --- |
| IA-001 |  |  |  |  |  |

If materially different alternatives exist, link the Layout Lab comparison and confirm that every option used the same fixture, task, and criteria. Selection is not authorization for a live change.

### Screen and state map

| Stable ID | Goal/task served | Content or IA item | Screen/region | State | Responsive rule | Accessibility condition | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| screen.example.initial |  |  |  |  |  |  |  |

## 4. Visual and interaction translation

### Visual direction

- Hierarchy principle:
- Context and product rationale:
- Typography and readability:
- Color roles and contrast:
- Spacing, grid, density:
- Motion and transition:
- Rejected direction and reason:

For every major visual choice, state the information or task decision it supports. “Feels better” is not sufficient rationale.

### Component and state matrix

| Component/screen ID | Initial | Loading | Empty | Partial data | Success | Error/validation | Disabled | Permission/stale/offline | Confirmation/recovery | Evidence/status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| component.example |  |  |  |  |  |  |  |  |  |  |

Mark an irrelevant state not applicable with a reason. Do not silently omit it.

### Responsive and accessibility checks

| Condition | Expected transformation or requirement | Checked? | Evidence/status | Finding or open question |
| --- | --- | --- | --- | --- |
| Narrow width |  |  |  |  |
| Long content |  |  |  |  |
| Zoom or text expansion |  |  |  |  |
| Keyboard or alternate input |  |  |  |  |
| Semantic order and focus |  |  |  |  |
| Contrast or motion |  |  |  |  |

## 5. Prototype and evaluation

- Risky question:
- Prototype or test artifact:
- Method: heuristic / synthetic participant / real-user session / implementation inspection
- Scope tested:
- Scope not tested:
- Evidence status:
- Findings:
- Assumptions and unknowns:
- Next validation action:

Real-user findings require an actual session or source. Synthetic and heuristic findings remain clearly labeled.

## 6. IA-to-UI traceability

Link the separate [IA-to-UI traceability matrix](ia-to-ui-traceability-template.md).

- Matrix ID:
- Revision:
- Coverage result:
- Unserved or blocked rows:
- Orphan check:
- Owner:
- Next correction:

The matrix proves coverage; this work order records the matrix decision and status.

## 7. Decisions and tradeoffs

| Decision ID | Question | Options considered | Decision | Rationale and evidence | Owner | Revisit condition |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 |  |  |  |  |  |  |

Put durable consequential decisions in the repository Decisions layer and link them here rather than copying the complete record.

## 8. Phase progress and gates

Update this table only at phase transitions, decisions, failed gates, material assumptions, handoffs, or validation events.

| Phase | Owner | Status | Output or link | Evidence status | Gate result | Smallest next action |
| --- | --- | --- | --- | --- | --- | --- |
| Scope and frame |  | not started / active / blocked / complete |  |  |  |  |
| Context and tool discovery |  |  |  |  |  |  |
| Content and IA |  |  |  |  |  |  |
| Visual and interaction |  |  |  |  |  |  |
| Prototype and evaluation |  |  |  |  |  |  |
| Handoff and QA |  |  |  |  |  |  |

Gate values are pass, fail, skipped with reason, blocked, or no-go. A failed gate returns work to the smallest responsible phase.

## 9. Handoffs and recovery

| From | To | Revision | Accepted evidence/decisions | Open questions | Blocker or fallback | Required output | Next action | Acknowledged |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

An interrupted run resumes from the last revision and next action. Do not replay completed work silently.

## 10. Handoff, implementation QA, and reconciliation

### Handoff packet

- Approved structure and visual direction:
- Content and state fixture:
- Acceptance criteria and fail conditions:
- Responsive rules:
- Accessibility requirements:
- Implementation questions:
- Known limitations:
- Owner and revision:

### Built-versus-designed QA

- Build or revision checked:
- Screens and states checked:
- Widths, inputs, zoom, or environments checked:
- Content and overflow checked:
- Findings:
- What was not checked:
- Corrections required:
- Recheck status:

### Reconciliation

- Durable change observed:
- Initiating contract:
- Direct dependents:
- Required updates:
- Optional follow-ups:
- Reconciliation status:
- Link:

## 11. Close or no-go

- Concrete deliverable, decision, prototype, implementation, or action plan:
- Success criterion addressed:
- Contribution or decision dispositions:
- Evidence limitations:
- Remaining unknowns:
- What was not tested:
- Final gate: pass / fail / no-go / blocked
- Next action or explicit completion boundary:
- Closed by:
- Closed at:

A work order is complete only when the concrete outcome, evidence limits, gate result, and next action are inspectable. It is not complete merely because a design file or handoff exists.
