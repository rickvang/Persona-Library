# Rebuild plan: $persona-reconciliation

## Status and recovery basis

- Historical status: explicitly created, version-controlled, validated, and run after Camille’s capability update.
- Current evidence: the Guide describes it as the shared Persona-specific final pass; ARCHITECTURE.md distinguishes it from the universal change-impact protocol.
- Exact package status: missing. Rebuild as a domain adapter, not as a replacement for the universal protocol.

## Build target

Create .agents/skills/persona-reconciliation/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: persona-reconciliation
description: Review the Persona-specific effects of a changed source, claim, skill, workflow, activity, tool requirement, or capability and return a scoped update without rewriting unrelated fields.
metadata:
  change_mode: reconciliation_adapter
  change_domain: personas
  reconciliation: change-impact-reconciliation
~~~

## Scope and routing

Activate after a material change to a Persona or to a reusable capability applied by a Persona.

Do not activate for a general repository-wide impact review, a pure research report, a Tool catalog operation, or an isolated prototype that has not been promoted.

## Operating procedure

1. Identify the changed input and the named Persona or Personas in scope.
2. Load the Persona record, affected workflows, activities, skills, tools, resources, priorities, needs, implications, confidence, and revision history.
3. Classify the input as confirms, extends, qualifies, contradicts, invalidates, or unrelated.
4. Map the changed input to affected Persona fields.
5. Separate required updates from optional improvements.
6. Preserve unchanged fields and existing uncertainty.
7. Add or revise evidence, confidence, open questions, and semantic revision notes when supported.
8. Check workflow tiers, activity rows, tool relationships, skill applications, and product implications for drift.
9. Return a scoped update set and an explicit unchanged-field report.
10. Run the universal change-impact pass once after this adapter when the initiating change requires it.

## Context contract

Inputs:

- Changed source, claim, skill, workflow, activity, tool requirement, or capability.
- Target Persona record.
- Existing relationships and evidence.
- Explicit authorization and output destination.

Outputs:

- Impact classification.
- Affected Persona fields.
- Required, optional, and unchanged updates.
- Evidence and confidence changes.
- Resource and revision entries.
- Open questions, blockers, and validation activity.

## Safety and authority

- Scoped review is not permission to rewrite the entire Persona.
- Never promote a hypothesis to observed evidence.
- Preserve contradictions and unresolved questions.
- Do not update unrelated Personas or shared Skills without a separate authorization.
- Do not recursively call persona-reconciliation or the universal pass.

## Dependencies and resources

Required:

- persona-library-orientation
- persona-research
- persona-skills
- change-impact-reconciliation
- content/library-model.js

Potential references:

- references/persona-impact-matrix.md
- references/persona-revision-contract.md

## Build steps with $skill-creator

1. Initialize only after checking for a historical package or existing equivalent.
2. Keep the adapter’s Persona field mapping and classification logic in SKILL.md.
3. Put the detailed field matrix and examples in references if needed.
4. Declare the universal reconciliation handoff in metadata.
5. Validate the adapter independently before wiring it into research and skills.

## Validation cases

1. Add a new Camille skill; expected: affected goals, workflows, tools, needs, evidence, and implications are identified.
2. Add a source that confirms one claim; expected: only supported claims and resource metadata change.
3. Add a source that contradicts a claim; expected: contradiction and open question remain visible.
4. Add a workflow; expected: flow tier, activities, priorities, tools, and skills are checked.
5. Change a shared skill used by two Personas; expected: both applications are reviewed without flattening them.
6. Unrelated field change; expected: unchanged report and no broad rewrite.

## Acceptance criteria

- The adapter has a clear Persona field impact map.
- It returns a bounded update proposal before any write.
- It preserves evidence status, uncertainty, and history.
- It leaves unrelated fields unchanged.
- It hands off to the universal protocol exactly once when required.
- It passes quick validation and the cases above.

## Migration notes

The historical branch used this skill as the final pass after persona research and skill updates. Preserve that relationship. Do not rename it to change-impact-reconciliation; the current repository explicitly treats it as the Persona-specific adapter.


