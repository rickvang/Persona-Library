---
name: template-reconciliation
description: Review downstream effects after a Template is created, changed, promoted, deprecated, relocated, or materially restructured.
metadata:
  skill_layer: governance
  change_mode: reconciliation_adapter
  change_domain: templates
  reconciliation: change-impact-reconciliation
---

# Template Reconciliation

## Role

Perform the Template-specific adapter pass after a material Template source, record, or generated artifact change. This Skill is read-only and does not apply downstream updates.

## Procedure

1. Capture the changed Template, source authority, revision, authorization constraints, lifecycle event, and bounded scope.
2. Load explicit relationships and declared provenance to Personas, Skills, Persona–Skill–workflow applications, Operating Packs, Playbooks, Tool-use context, Docs, generated Site output, and any dependent Templates.
3. Check identity, category, purpose, use-when, source path, entrypoint, status, availability, evidence, revision, stale links, and planned-versus-verified claims.
4. Recheck scoped applications as a single relationship: Persona, Skill, workflow, Persona–Skill profile, and Skill ownership of that workflow must all remain valid.
5. Classify each checked dependent as `confirms`, `extends`, `qualifies`, `contradicts`, `invalidates`, or `unrelated`, with evidence and confidence. Do not manufacture relationships from similar wording.
6. Separate required updates, optional follow-ups, unchanged records, incomplete dependency visibility, and the smallest next action. Hand off once to universal `$change-impact-reconciliation`; never invoke it recursively.

## Boundaries

- A Template owns starting structure and provenance. It does not own reusable judgment, Operating Pack rules, Tool permissions, or Playbook orchestration.
- A verified external source does not prove runtime access, cloning, copying, rendering, or execution.
- Do not mutate Personas, Skills, workflows, Operating Packs, Playbooks, Tools, Docs, decisions, or generated files during this read-only pass.
- Prototype identities remain isolated; live Templates must not depend on prototype-only records.

## Report contract

Return status; change observed; initiating contract; scope checked; direct and indirect impacts with relationship, class, evidence, confidence, and action; required updates; optional follow-ups; unchanged checked; generated-output freshness; blockers; incomplete visibility; and next action.
