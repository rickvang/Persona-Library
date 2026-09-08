# Project Context and Reference Routing

Status: current Docs-owned method for selecting project-specific design guidance.

## Purpose

Use this method to choose the smallest useful set of UX/UI evidence, examples, Personas, Skills, and quality gates for a project.

The method adapts to different project types without creating a separate copy of the library for each project. It combines a universal design-quality baseline with a tagged project lens and a project-scoped evidence pack. The result should be one useful recommendation or artifact, not a larger pile of opinions.

This method routes work. It does not manufacture facts, user research, product requirements, stakeholder agreement, or permission to mutate an external system.

## Artifact boundary

Use the repository layers this way:

- The core quality baseline defines minimum expectations for material design work.
- A project lens selects conditional guidance and gates.
- A reference or example entry provides source, scope, observable pattern, tradeoffs, and limits.
- The UX Work Order records the project profile, selected material, decisions, gate results, and next action.
- The shared problem-context and collaboration Playbook coordinate multiple Personas only when shared state, attributable contributions, and handoffs are genuinely needed.
- Decisions preserve durable alternatives and rationale.
- Prototypes explore isolated alternatives.
- Personas and Skills remain canonical records; this method references them rather than copying or merging them.

A Work Order records authorization constraints. It never grants permission to edit, publish, execute a Tool, contact users, change access, or promote a prototype.

## Always-on quality baseline

Every material design run must address the affected parts of this baseline:

- the user or operator goal and primary task are explicit;
- information and visual hierarchy support that task;
- content, terminology, and structure are understandable;
- important interaction, loading, empty, partial, success, error, permission, recovery, and confirmation states are covered when applicable;
- responsive behavior preserves task and content relationships;
- accessibility is part of the design, not a late appendix;
- important claims have a source or an explicit evidence status;
- the output has a concrete acceptance criterion, handoff, or next action;
- skipped work is recorded with a reason;
- no recommendation is treated as user validation merely because several Personas agree.

The baseline is proportional. A focused change may inspect only affected slices, but it may not silently skip a relevant minimum.

## Project profile

Create a compact profile before non-trivial design work. Use the existing Work Order or the Project Context Template.

Required fields:

- project type and optional secondary type;
- primary user or operator job;
- platform and environment;
- content density and variability;
- risk or consequence level;
- uncertainty level;
- audience or role;
- known evidence and missing evidence;
- constraints and authorization boundary;
- success criteria and stopping condition;
- selected lens, Personas, Skills, references, and gates.

For each field, record its value, source, status, confidence, confirmation state, and revision when the route changes. Use the existing evidence vocabulary: supplied, sourced, observed, heuristic, synthetic_assumption, assumption, recommendation, or unknown.

The term inferred may be used for routing metadata. It does not upgrade an inference into evidence.

## Lens catalog

Start with a small set of reusable lenses. A project may use one primary lens and one secondary lens only when justified.

| Lens | Trigger conditions | Non-trigger or lighter route | Conditional emphasis |
| --- | --- | --- | --- |
| Focused marketing or content surface | Public page, known structure, low consequence, limited change | Small change in a well-understood surface | Content hierarchy, visual direction, responsive and accessibility slice |
| Content-heavy find, browse, or compare | Many items, search/filtering, taxonomy, comparison, variable content | Small static page with no meaningful discovery | Content model, labels, search, result states, comparison and scanning |
| Dashboard or data-dense workflow | Multiple metrics, tables, filters, monitoring, or operational decisions | One simple status view with little interaction | Data hierarchy, density, responsive tables, status messages, empty/partial/error states |
| Mobile or constrained-input workflow | Mobile-first use, narrow viewport, touch, intermittent input, or constrained environment | Desktop-only known surface with no responsive change | Reflow, touch targets, input recovery, content priority, alternate layouts |
| Document or application output | Resume, cover letter, report, application packet, or document judged by systems and people | Informal note with no submission or review constraint | Source ledger, format constraints, ATS or parser behavior, human scan path, parity |
| Multi-step operational workflow | Handoffs, interruptions, permissions, re-entry, dependencies, or several screens | Single action with no meaningful recovery | Workflow mapping, state completeness, recovery, handoff and acceptance criteria |
| Consequential or high-risk action | Approval, payment, privacy, publication, account, irreversible action, or regulated context | Reversible low-impact draft or exploration | Real-user research when feasible, permission, review, confirmation, recovery, auditability |
| Accessibility-sensitive or broad-audience surface | Broad audience, assistive technology risk, public service, or known access need | Internal experiment with a documented narrow audience | Semantic structure, keyboard, focus, contrast, reflow, status announcements, testing |

A lens is a route, not a claim that the project has every characteristic in its row. If a trigger is uncertain, record the uncertainty and either ask one focused question or use the safer route provisionally.

## Intake and classification procedure

1. Read the request, repository orientation, relevant Work Order, and existing project artifacts.
2. Identify the concrete user or operator job, intended output, and authorization boundary.
3. Infer the smallest profile needed to select a route.
4. Record inferred fields, sources, confidence, and unknowns.
5. Select one primary lens and any justified secondary lens.
6. Select the minimum relevant Personas, Skills, references, examples, and gates.
7. Choose focused, feature, or consequential proportionality.
8. Load selected reference IDs and routing rationale into the Work Order.
9. Run the relevant UX practice phases and record skipped gates with reasons.
10. Revise the profile when new evidence changes type, risk, uncertainty, or workflow.
11. Produce one concrete recommendation, decision, prototype, design packet, or action plan.
12. Check the output against the selected gates and success criteria.
13. Record what remains unknown and the smallest next validation step.

Ask one focused question when the answer would materially change the route, safety boundary, or deliverable. Otherwise use a reversible provisional classification and label it.

## Evidence and reference selection

Select material by relevance and source quality, not by volume.

Use this source distinction:

- project-provided facts and actual observations describe this project;
- authoritative standards define requirements or recognized guidance within their scope;
- documented design systems provide reusable patterns and implementation guidance;
- research sources support findings only within the population and method studied;
- product examples show observable design choices, not universal proof;
- heuristics and recommendations identify risks or choices but are not user validation;
- synthetic participant responses remain synthetic assumptions.

Every selected item must preserve its source, scope, status, and limits. A popular or attractive interface is not automatically a good example. Explain the observable pattern, the user or system consequence it is intended to support, the tradeoff, and what remains unverified.

Prefer stable source links and reference IDs. Do not copy entire external pages, private content, or copyrighted examples into project packets.

## Persona and Skill routing

Use the smallest relevant set.

- Jordan Lee and ux-senior lead when the problem, content model, terminology, task flow, navigation, or evaluation question is unsettled.
- Camille Ortiz and ui-expert lead when structure is sufficient and visual hierarchy, interaction states, responsive behavior, accessibility, interface craft, or built-versus-designed QA is the main work.
- Consult the knowledge-systems-architect only when taxonomy, labeling, dependency, or system-boundary questions exceed the design team’s scope.
- Use Layout Lab for materially different IA or layout alternatives, with identical content, task, and criteria. Selection is not live-change authorization.
- Use the shared problem-context and collaboration Playbook when multiple Personas need shared state and attributable handoffs, not merely because multiple opinions could be useful.
- Existing Personas are modeled collaborators or bounded perspectives. They are not automatic user evidence.

If no relevant Persona exists, use the synthetic-participant rules in the UX practice and keep the profile project-scoped. Do not create a permanent Persona by implication.

## Proportionality

Choose one tier:

| Tier | Use when | Required route |
| --- | --- | --- |
| Focused | Small change in a known workflow and low consequence | Goal, affected content/IA, visual, interaction/state, responsive, accessibility, and focused QA checks; record why broader discovery was skipped |
| Feature | New feature, uncertain structure, content-heavy flow, or several states | Context and tool discovery, content fixture, IA, visual and interaction design, risk-based prototype, evaluation record, traceability, handoff, and QA |
| Consequential | Irreversible, high-risk, multi-role, regulated, privacy-sensitive, or system-wide | Feature route plus real-user research when feasible, permission and recovery checks, explicit decision record, broader accessibility/outcome review, and reconciliation |

Proportionality reduces breadth. It does not make relevant safety, accessibility, evidence, or state obligations optional.

## Project evidence pack

The project pack may contain:

- selected shared references by stable ID;
- project-specific constraints and source artifacts;
- workflow and tool observations;
- real-user research when it occurred;
- synthetic assumptions and questions for later validation;
- examples and rejected directions relevant to the lens;
- open contradictions, decisions, and unknowns.

Keep project-specific observations in the Work Order or linked project artifact. Do not promote them to the shared library automatically.

## Synthetic participant boundary

When real participants are unavailable or the selected tier permits interim modeling:

- prefer the smallest relevant existing Persona;
- if none is relevant, create a temporary project-scoped profile from known task, role, sources, and constraints;
- ask context-specific questions about workflow, tools, terminology, priorities, handoffs, and recovery;
- label every response synthetic_assumption, assumption, recommendation, or unknown;
- use responses to surface design risks and real-user validation questions;
- never label synthetic responses observed, validated, user feedback, demand, prevalence, satisfaction, task time, or stakeholder agreement.

Repetition or agreement among synthetic participants does not upgrade the evidence.

## Output and quality gate

The final output must state:

- project profile and selected lens;
- evidence used and evidence limits;
- Personas, Skills, and references used, with the reason for each;
- concrete recommendation or artifact;
- alternatives and tradeoffs when material;
- quality gates run, skipped with reasons, or blocked;
- unresolved unknowns and next validation;
- authorization and mutation boundary.

Fail or stop when the classification would require unsupported facts, the selected route cannot cover a material risk, the content fixture is missing for a structural comparison, evidence is presented more strongly than supported, or the requested mutation is not authorized.

## Worked routing examples

### Small content change

Request: adjust the heading hierarchy on a known public page.

Route: Focused marketing/content lens. Read the affected page and content, use the UI Persona for hierarchy and accessibility, inspect responsive behavior if affected, and record a short QA result. Do not run full contextual research unless the structure or audience is actually uncertain.

### New operational dashboard

Request: design a dashboard for operators comparing many items and resolving exceptions.

Route: Dashboard plus multi-step operational lens. Jordan leads content model, task flow, labels, and evaluation questions. Camille translates the structure into data hierarchy and states. Use the table/search references, a realistic content fixture, partial/error/permission states, responsive behavior, accessibility checks, and a traceability matrix. Use Layout Lab only if materially different structures remain plausible.

### High-risk approval

Request: design an approval flow that publishes a consequential report.

Route: Consequential plus multi-step operational lens. Map roles, permissions, interruptions, recovery, review, confirmation, success, and failure. Use real-user research when feasible. A synthetic participant can surface questions but cannot validate the flow. Require explicit acceptance criteria, decision rights, and an authorized handoff.

## Promotion and maintenance

After a project:

1. Keep the Work Order and project evidence separate from the shared catalog.
2. Identify candidate lessons, examples, or anti-patterns.
3. Check whether each candidate is generalizable beyond the project.
4. Preserve source, scope, evidence status, tradeoffs, and limitations.
5. Promote only reviewed material through an explicit change and reconciliation path.
6. Do not promote synthetic responses, private project facts, or unsupported preferences.
7. Review for stale links, duplicate guidance, tag drift, and route changes.

## Completion checklist

- Profile and lens are recorded with evidence status and confidence.
- Routing is minimal and justified.
- Selected references and examples have stable IDs and source limits.
- Personas and Skills were used for bounded perspectives, not synthetic proof.
- Relevant UX gates were run or skipped with reasons.
- Output is concrete and traceable to the user job.
- Alternatives, tradeoffs, unknowns, and next action are visible.
- Project assumptions remain project-scoped.
- Any durable change has the required decision and reconciliation path.
