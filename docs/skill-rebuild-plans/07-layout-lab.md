# Rebuild plan: $layout-lab

## Status and recovery basis

- Historical status: claimed created and version-controlled; used for Persona, Skill, and Tools / Integrations layout comparisons.
- Current evidence: activity-views.html, skill-views.html, prototyping.html, Decisions records, and Guide instructions.
- Exact package status: missing. The prototype pages are evidence of the workflow, not the package itself.

## Build target

Create .agents/skills/layout-lab/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: layout-lab
description: Compare materially different information architectures or interface layouts in an isolated prototype before changing the main experience.
metadata:
  change_mode: prototype
  change_domain: prototyping
  reconciliation: change-impact-reconciliation
~~~

During exploration, reconciliation checks isolation only. On explicit promotion, the change becomes an artifact or source update and receives the universal impact review.

## Scope and routing

Activate when the information architecture, layout, navigation, or interaction direction is unsettled and the user wants alternatives before commitment.

Do not activate for a direct live-page edit when no comparison is requested. Do not treat a prototype selection as authorization to apply it.

## Operating procedure

1. State the layout decision, audience, constraints, and success criteria.
2. Select stable sample content and keep it identical across alternatives.
3. Create three to six materially different directions, not cosmetic color variations.
4. Show each direction in a throwaway comparison surface with tradeoffs and known limitations.
5. Provide a structured choice and preserve the user’s selection.
6. Record the exploration and selected direction in Decisions when the user makes it durable.
7. Apply the selected direction only after explicit authorization.
8. Update related Docs or Skills only when affected and authorized.
9. Validate responsive, accessibility, and realistic-content behavior after application.

## Context contract

Inputs:

- Content or workflow to organize.
- Current page or system boundary.
- Layout decision and constraints.
- Stable sample content.
- User selection and authorization.

Outputs:

- Isolated prototype.
- Option comparison and tradeoffs.
- Selected direction.
- Decision record proposal.
- Authorized implementation change and validation report.

## Safety and authority

- Prototype identifiers and records remain isolated.
- Do not change live Personas, Skills, Tools, Playbooks, Docs, or production workflows during exploration.
- Do not compare options using different content or hidden changes.
- Do not claim a user selected an option when they have not.
- A prototype cannot become live truth without an explicit Decision and promotion.

## Dependencies and resources

Required:

- persona-library-orientation
- Prototyping and Decisions boundaries
- current Site layout and generated-output conventions

Optional:

- persona-panel-orchestration for a named design review
- change-impact-reconciliation on promotion

No scripts or assets are required initially; retain the existing Site’s prototype surfaces as examples only.

## Build steps with $skill-creator

1. Initialize the package after checking for the historical package.
2. Put comparison rules, stable-content rules, selection, promotion, and validation in SKILL.md.
3. Add a prototype reference only if the live Site paths remain stable.
4. Keep prototype mode read-only with respect to live records.
5. Test the exploration and promotion paths separately.

## Validation cases

1. Compare three Persona-page structures with identical content.
2. Compare Skill index and deep-dive directions.
3. User views options but chooses none; expected: no live changes.
4. User chooses an option but does not authorize application; expected: Decision proposal only.
5. Authorized application; expected: affected pages, Docs, and responsive behavior are validated.
6. Different content supplied to one option; expected: comparison flagged as invalid.

## Acceptance criteria

- Alternatives are materially different and comparable.
- The prototype is isolated and reversible.
- User choice and authorization are distinct.
- Promotion records rationale and affected surfaces.
- Applied changes receive impact review and validation.
- No prototype content leaks into live counts, filters, or records.

## Migration notes

The branch used this workflow for activity, Skill, and Tools layouts. Preserve Layout Lab as a general prototyping method rather than encoding any particular Option A–F as permanent truth.


