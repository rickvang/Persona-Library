# Rebuild plan: Multi-perspective skill synthesis

## Status and recovery basis

- Historical status: described as the reusable reasoning capability inside the skill-formation Playbook and later claimed added as a Skill.
- Current evidence: it appears as a site-level capability record in library-data.js and is referenced in the Guide and Persona records.
- Exact package status: no exact dollar-prefixed invocation or callable package was found.

## Build target

Do not create a standalone package automatically. First implement the method inside persona-skills and persona-panel-orchestration. Create .agents/skills/multi-perspective-skill-synthesis/SKILL.md only if repeated direct invocation proves that the method needs independent discovery, versioning, or validation.

If standalone creation is approved, use:

~~~yaml
name: multi-perspective-skill-synthesis
description: Synthesize a reusable capability from distinct Persona perspectives while preserving role-specific applications, evidence, uncertainty, and existing-skill boundaries.
metadata:
  change_mode: artifact_generation
  change_domain: skill-formation
  reconciliation: persona-reconciliation
~~~

## Scope and routing

Activate when a proposed capability spans several roles or when it is unclear whether the answer is a new Skill, a composition, a relationship, or a workflow.

Do not activate for ordinary panel consultation, simple disagreement, or a request that can be handled by an existing Skill relationship.

## Operating procedure

1. Define the proposed capability and the decision it should support.
2. Select only Personas whose work adds a distinct perspective.
3. Compare triggers, decisions, observable actions, tools, outputs, and quality signals.
4. Identify shared capability, role-specific application, and unresolved difference.
5. Check the canonical Skill catalog, aliases, primitives, and related relationships.
6. Decide whether a new Skill is justified or whether a relationship, workflow, recipe, or application is enough.
7. Formalize the reusable core with boundaries, operation, quality signals, evidence, and validation.
8. Preserve Persona-specific context outside the canonical Skill.
9. Return the proposal and hand off authorized changes to persona-skills and reconciliation.

## Context contract

Inputs:

- Proposed capability.
- Selected Personas and their records.
- Existing Skill catalog and relationships.
- Sources and evidence.
- Desired output destination.

Outputs:

- Shared capability definition.
- Role-specific applications.
- Duplicate/overlap analysis.
- Evidence and uncertainty.
- Validation plan.
- Proposed Skill artifact or recommendation not to create one.

## Safety and authority

- Do not average perspectives into a vague capability.
- Do not allow the most articulate Persona to dominate.
- Do not erase meaningful differences.
- Do not create a new Skill merely because several records mention similar words.
- Do not modify live records without explicit authorization.

## Dependencies and resources

Required:

- persona-library-orientation
- persona-panel-orchestration
- persona-skills
- system skill-creator
- persona-reconciliation

Potential references:

- references/synthesis-comparison-matrix.md
- references/skill-duplication-test.md

## Build steps with $skill-creator

If standalone creation is approved:

1. Confirm the method is independently invoked and not adequately covered by persona-skills.
2. Initialize the package with $skill-creator.
3. Keep selection, comparison, duplicate checks, and boundary rules in SKILL.md.
4. Add a comparison-matrix reference only if it is reused across multiple workflows.
5. Test independent contributions, reusable output, and the no-new-skill path.

## Validation cases

1. Synthesize a capability from Camille, Mara, and Riley; expected: distinct contributions and preserved differences.
2. Existing Skill already covers the capability; expected: recommend reuse or relationship.
3. Only one Persona contributes; expected: use persona-skills rather than this method.
4. Proposed capability is too vague; expected: narrow definition and validation needs.
5. Apply the synthesized Skill in a new context; expected: boundaries and quality signals remain useful.

## Acceptance criteria

- A standalone package is created only when independent reuse is demonstrated.
- The shared core is concrete and observable.
- Role-specific context remains linked but separate.
- Duplicate and overbuilding risks are explicit.
- Evidence, uncertainty, and validation remain visible.

## Migration notes

The existing site record is valuable as a specification seed, but it is not proof that a historical callable package existed. Keep the site-level record even if no standalone package is created.

