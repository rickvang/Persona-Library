---
name: layout-lab
description: Compare materially different information architectures or interface layouts in an isolated prototype before changing the main experience.
metadata:
  skill_layer: persona_applied
  change_mode: prototype
  change_domain: prototyping
  reconciliation: change-impact-reconciliation
---

# Layout Lab

## Recovery status

This is a repository-local reconstruction. The prior conversation described Layout Lab as a way to compare Persona, Skill, and Tool layouts, but the exact historical callable package was not recovered. The existing prototype pages and Decisions records are evidence for the workflow, not permanent truth or a recovered package.

## Use this skill when

Activate when information architecture, layout, navigation, or interaction direction is unsettled and the user wants alternatives before commitment.

Do not activate for a direct live-page edit when no comparison is requested, cosmetic tweaks that do not test a meaningful direction, or a request to apply a selected layout without explicit authorization. Do not treat a prototype selection as permission to change the live experience.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Identify the layout decision, audience, current surface, content/workflow boundary, constraints, success criteria, and requested output.
3. Select stable representative content and the same content contract for every option. If one option uses different content, mark the comparison invalid rather than attributing the difference to layout.
4. Establish prototype scope and an isolated identifier. Record whether the user merely wants exploration, has selected a direction, or explicitly authorizes promotion.
5. Read current layout/prototype examples and relevant Decisions only as references. Do not copy an option into live content by implication.

## Operating modes

### Explore

Create or describe a reversible comparison surface with three to six materially different directions. Vary hierarchy, navigation, information grouping, density, or interaction model; do not present cosmetic color changes as independent directions.

### Compare and select

Show each direction with identical sample content, tradeoffs, limitations, and focused checks. Ask for or record the user's explicit selection. A selection is a decision signal, not implementation authorization.

### Promote and validate

After an explicit Decision or selected direction and explicit implementation authorization, identify the affected pages, Docs, Skills, records, and generated outputs. Apply only the authorized change, validate responsive/accessibility/realistic-content behavior, and run one universal `$change-impact-reconciliation` review for the resulting durable artifact or source change.

## Operating procedure

1. State the layout decision, audience, constraints, content boundary, and success criteria.
2. Freeze stable sample content, states, labels, and task goals across alternatives.
3. Design three to six materially different directions and name the hypothesis each tests.
4. Render or describe every direction in the same isolated prototype context. Label prototypes as non-live and reversible.
5. Compare hierarchy, findability, task flow, density, responsive behavior, accessibility, realistic content, tradeoffs, and known limitations.
6. Return a structured choice. Preserve "no selection" as a valid outcome and do not infer a winner.
7. If the user selects a direction, record the selected option, rationale, evidence, open questions, and affected surfaces for a Decision when a durable choice is requested.
8. If the user authorizes application, prepare the smallest change set and separate the live implementation from the prototype. Validate affected pages and generated outputs.
9. On promotion, hand off the durable change to `$change-impact-reconciliation`; during exploration, check isolation only and do not reconcile prototype content as live truth.

## Comparison contract

Every option should use the same:

- source content and realistic states;
- audience, task, and success criteria;
- relevant device sizes and accessibility expectations;
- labels, data density, and known constraints.

Every comparison should report:

- the structural hypothesis and what materially differs;
- observed checks, tradeoffs, limitations, and open questions;
- the user's selection or explicit no-selection result;
- whether a Decision or live authorization exists;
- affected surfaces and the next reversible action.

If content, data, or task difficulty differs between options, flag the result as an invalid comparison and request a corrected fixture.

## Output contract

Return:

- Outcome and mode: explore, compare/select, or promote/validate.
- Layout decision, audience, constraints, stable content fixture, and success criteria.
- Isolated prototype identifier and option list with material differences.
- Side-by-side tradeoffs, accessibility/responsive/realistic-content checks, limitations, and evidence.
- Selection status, Decision proposal if requested, authorization status, affected surfaces, and next action.
- On promotion: validation results, reconciliation handoff, blockers, and remaining uncertainty.

## Safety, permissions, and handoffs

- Prototype records and files remain isolated, reversible, and clearly non-live.
- Do not change live Personas, Skills, Tools, Playbooks, Docs, production workflows, counts, filters, or generated truth during exploration.
- Do not compare options using hidden content or task changes.
- Do not claim the user selected an option when they have not, and do not treat selection as authorization.
- Do not publish, merge, grant access, execute Tools, or modify live content without explicit authorization.
- On explicit promotion, preserve the Decision rationale and run the universal impact review once. Prototype isolation checks do not turn prototype content into live evidence.
- If a required source, target, decision, or permission is missing, report the exact gap and stop at a safe prototype or proposal.

Optional handoffs are named Persona panel consultation for an explicitly requested design review and universal impact reconciliation on authorized promotion. Verify availability before claiming either was invoked.

## Focused validation

Before handoff, confirm:

- Alternatives are materially different and use identical stable content and task criteria.
- The prototype is isolated, reversible, and clearly labeled non-live.
- Selection, Decision, authorization, promotion, and validation are distinct states.
- Responsive, accessibility, realistic-content, tradeoff, and limitation checks are reported.
- No live record or generated truth changed during exploration.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/layout-lab.golden.md).
