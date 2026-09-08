# Project Context and Reference Routing — Implementation Plan

Status: proposed plan; implementation not started.

Related issue: [#27 — Add project-context routing for dynamic evidence and design references](https://github.com/rickvang/Persona-Library/issues/27)

Related layers:

- [Expert UX Design Practice](expert-ux-design-practice.md)
- [UX Work Order Template](ux-work-order-template.md)
- [Work Orders](../work-orders.md)
- [IA-to-UI Traceability Template](ia-to-ui-traceability-template.md)
- [Shared collaboration context](../collaboration/problem-context.md)
- [Collaboration Playbook](../collaboration/multi-persona-collaboration-playbook.md)

## 1. Decision

Build a Docs-owned project-context and reference-routing method first.

Do not add a new broad Persona, Skill, or Playbook in the first implementation. The method will select and compose existing Personas, Skills, evidence, examples, and quality gates. Reconsider a standalone routing Skill only after repeated use demonstrates a distinct, portable judgment capability.

The active project artifact is the existing Work Order. Add a small linked project-context section or template only if the Work Order becomes too crowded. Do not duplicate the full library inside every project.

## 2. Problem

Different projects require different design evidence and different levels of scrutiny. A marketing page, dashboard, mobile workflow, document/application, and high-risk approval flow should not receive the same research burden or Persona panel.

The system must:

- infer enough project context to choose a useful route;
- preserve uncertainty around inferred fields;
- apply a universal quality baseline plus conditional project-lens gates;
- keep project-specific evidence and assumptions isolated;
- return one concrete recommendation or artifact;
- promote reusable lessons only after review.

Inference is for routing only. It must never become invented user research, product requirements, tool usage, constraints, or stakeholder agreement.

## 3. Layer model

| Layer | Responsibility | Persistence |
| --- | --- | --- |
| Core quality baseline | Minimum standards for material design work. | Shared Docs |
| Project lens | Tagged profile selecting conditional guidance and gates. | Shared catalog |
| Project evidence pack | Sources, examples, anti-patterns, constraints, research, and open questions. | Linked reference plus project Work Order |
| Work Order | Active scope, decisions, evidence status, gates, handoffs, and next action. | Project-scoped |
| Decisions | Durable alternatives, rationale, tradeoffs, and revisit conditions. | Repository Decisions layer |
| Prototype | Isolated comparison or exploration. | Prototype space |
| Promotion review | Decides whether a project learning is reusable. | Append-only review |

Use stable reference IDs and links instead of copying complete documents into each project packet.

## 4. Project profile contract

Add a compact profile to the Work Order or a linked project-context template:

- project type and optional secondary type;
- primary user/operator job;
- platform and environment;
- content density and variability;
- risk or consequence level;
- uncertainty level;
- audience or role;
- known and missing evidence;
- constraints and authorization boundary;
- success criteria and stopping condition;
- selected lens, Personas, Skills, references, and gates;
- inferred fields with source, confidence, and confirmation state;
- revision history when new evidence changes the route.

Use the existing evidence vocabulary:

- sourced;
- observed;
- heuristic;
- synthetic_assumption;
- assumption;
- recommendation;
- unknown.

An internal inferred marker may identify routing fields, but it must not weaken the underlying evidence label.

## 5. Lens taxonomy

Start with a small taxonomy. Do not create a lens for every project:

- focused marketing or content surface;
- content-heavy find, browse, or compare;
- dashboard or data-dense workflow;
- mobile or constrained-input workflow;
- document or application output;
- multi-step operational workflow;
- consequential or high-risk action;
- accessibility-sensitive or broad-audience surface.

A project may use one primary lens and, only when justified, one secondary lens. Each lens must define:

- trigger and non-trigger conditions;
- minimum quality gates;
- conditional gates;
- relevant Persona and Skill references;
- recommended evidence and examples;
- common anti-patterns;
- stopping or escalation conditions.

Lenses are routing presets, not complete designs.

## 6. Reference and example contract

Each shared reference or example must record:

- stable ID and title;
- category: principle, standard, research, design-system guidance, product example, anti-pattern, or failure exhibit;
- applicable lens tags;
- source URL or repository path;
- access date or source revision;
- evidence status;
- supported claim and source scope;
- observable pattern;
- why it appears useful;
- tradeoffs and limits;
- what not to copy;
- related quality gates;
- confidence and unresolved unknowns.

A product example is not proof of user preference, business impact, usability, accessibility conformance, or universal best practice unless that claim has a cited source. Annotate observable patterns separately from outcome claims.

Start with five concise entries:

1. one simple flow;
2. one content-heavy browse/compare example;
3. one high-risk or consequential flow;
4. one responsive/state-completeness example;
5. one polished-but-failing anti-pattern.

Use authoritative standards and documented design systems where applicable. Keep external sources, repository-derived examples, and project observations visibly distinct.

## 7. Routing procedure

For each non-trivial design request:

1. Read the request, repository orientation, and relevant Work Order.
2. Infer the smallest viable project profile.
3. Record each inference, confidence, source, and unknown.
4. Ask one focused question only when ambiguity would materially change the route or safety boundary.
5. Select one primary lens and, only when justified, one secondary lens.
6. Select the minimum relevant Personas, Skills, references, and quality gates.
7. Choose focused, feature, or consequential proportionality.
8. Load selected references by ID into the Work Order; do not repeat the library.
9. Run the relevant UX practice phases and record skipped gates with reasons.
10. Reclassify when new evidence changes type, risk, uncertainty, or workflow.
11. Produce one concrete recommendation, artifact, decision, or action plan.
12. Validate against selected gates and success criteria.
13. Keep project assumptions and synthetic participant responses project-scoped.
14. Record promotion candidates separately from validated shared learnings.

Illustrative routing:

- A small, settled marketing change uses a focused visual/content route.
- A new dashboard activates content density, IA, states, responsive behavior, accessibility, traceability, and implementation QA.
- A consequential approval or payment flow activates recovery, permissions, error prevention, and real-user research when feasible.
- A resume/application request activates document constraints, requirement mapping, ATS/human parity, chronology/integrity, and human-readable presentation.
- An unsettled navigation problem routes to Jordan for IA/evaluation and Camille for interface translation; Layout Lab is required when materially different structures remain plausible.

## 8. Integration plan

### Phase 0 — choose the smallest structure

- Check existing UX docs and reference directories for overlap.
- Decide whether one tagged reference document or a small directory is easier to maintain.
- Record the decision in the implementation PR or a linked Decision.
- Confirm the method does not duplicate the shared-context contract in #22.

### Phase 1 — add context and routing guidance

Proposed files:

- docs/ux/project-context-and-reference-routing.md
- docs/ux/project-context-template.md

Define profile fields, lens taxonomy, routing rules, evidence vocabulary, inference boundaries, promotion rules, and focused/consequential examples.

### Phase 2 — curate the starter pack

Add the five starter entries with citations, lens tags, observable patterns, tradeoffs, anti-patterns, and unknowns. Keep them concise. Do not create a research archive or copy source material beyond what is necessary for commentary and attribution.

### Phase 3 — integrate existing UX artifacts

Update:

- docs/ux/ux-work-order-template.md with project profile, selected lens/reference IDs, routing rationale, profile revisions, and promotion disposition;
- docs/ux/expert-ux-design-practice.md with the routing entry point and conditional-gate rules;
- ARCHITECTURE.md or README.md only if discoverability requires it.

Do not modify canonical Persona or Skill data unless a separate evidence-based decision authorizes it.

### Phase 4 — validate the route

Use three concise scenario records:

- focused: a small, known interface/content adjustment;
- dynamic: a new dashboard or content-heavy browse workflow;
- boundary: an uncertain or consequential workflow with missing evidence.

Verify lens selection, Persona routing, references, gates, evidence labels, proportionality, concrete output, and mutation boundaries.

### Phase 5 — review maintenance and promotion

Check stale links, duplicate guidance, tag drift, unexplained route changes, and whether the method is reusable. Compare project assumptions with later real-user evidence when available. Promote only reviewed, generalizable lessons. Reassess whether a routing Skill is warranted.

## 9. Persona and collaboration boundaries

- Use the smallest relevant existing Persona set.
- Treat Personas as perspectives or modeled collaborators, never automatic user evidence.
- Keep generated synthetic participants project-scoped and hypothesis-labeled.
- Use #22 only when multiple Personas need shared context, attributable contributions, handoffs, or decision rights.
- Do not merge Camille and Jordan or create a generic expert-designer record to hide disagreements.
- Do not create a permanent Persona from an inferred project profile without a separate authorized decision.

## 10. Safety and authorization

The method may classify, recommend, compare, and document. It does not grant permission to:

- edit or publish a live Site;
- execute a Tool or contact users;
- change accounts, permissions, or external systems;
- modify canonical Personas, Skills, or Tool records;
- promote a prototype or project assumption into production.

Synthetic participants may expose risks and generate validation questions. They cannot establish observed behavior, demand, satisfaction, prevalence, task time, stakeholder agreement, or approval.

Durable changes follow repository change and reconciliation rules. Prototype selection remains separate from live-change authorization.

## 11. Concise acceptance criteria

The implementation passes when:

- a focused request receives a smaller route without silently dropping minimum quality checks;
- a content-heavy or dashboard request receives a materially different route with appropriate IA, content fixture, states, responsive, accessibility, and traceability gates;
- an uncertain or consequential request preserves unknowns, does not invent research, and escalates or asks when classification changes safety or scope;
- every selected reference has a stable ID, source, lens tags, evidence status, scope, and tradeoffs;
- project assumptions do not enter canonical library data by implication;
- the Work Order shows the routing decision, selected material, skipped gates, profile revisions, and next action;
- each scenario ends with a concrete recommendation or artifact;
- validation remains proportional and does not depend on the number of Personas or references loaded.

Record each scenario as PASS, REGRESSION, or UNKNOWN with a short evidence note. Do not claim historical parity; this is a new current-use capability.

## 12. Unknowns

Do not invent answers to these questions:

- Which external sources and product examples are most appropriate for the starter pack.
- How reliably project type can be inferred from natural-language requests.
- Whether the static Site should surface this method in navigation.
- Whether project context needs persistence beyond the Work Order/document boundary.
- Whether a shared reference directory is better than one tagged file after real maintenance use.
- Whether repeated routing work demonstrates a distinct Skill boundary.

## 13. Completion boundary

This plan is complete as a planning artifact when it is linked from Issue #27 and reviewed.

Issue #27 implementation is complete only after:

- approved docs and starter references are merged through a separate PR;
- the three concise scenario checks pass;
- no unresolved regression remains;
- unknowns, deferred work, and promotion candidates are recorded;
- the merge commit and validation result are recorded in Issue #27.
