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
4. When reusable or canonical publication is claimed, verify the complete publication chain: the canonical source resolves; the Persona-Library Template catalog record exists and matches that source; a Persona-Library-local illustrative viewer representation exists, uses synthetic content, and clearly preserves the external-source boundary; generated Site data is fresh from authored catalog/source configuration; and the Template appears in the Persona-Library Templates tab and focused viewer with the intended identity, source, lifecycle, availability state, and `Illustrative concept available` state. Planned Templates may legitimately remain without a local viewer representation until publication. Treat a missing catalog record, missing required viewer representation, stale generated data, or missing Templates-tab/viewer state as an incomplete publication rather than a successful lifecycle completion.
5. Recheck scoped applications as a single relationship: Persona, Skill, workflow, Persona–Skill profile, and Skill ownership of that workflow must all remain valid.
6. Classify each checked dependent as `confirms`, `extends`, `qualifies`, `contradicts`, `invalidates`, or `unrelated`, with evidence and confidence. Do not manufacture relationships from similar wording.
7. Separate required updates, optional follow-ups, unchanged records, incomplete dependency visibility, and the smallest next action. Hand off once to universal `$change-impact-reconciliation`; never invoke it recursively.

## Boundaries

- A Template owns starting structure and provenance. It does not own reusable judgment, Operating Pack rules, Tool permissions, or Playbook orchestration.
- A verified external source does not prove runtime access, cloning, copying, rendering, or execution.
- The local illustrative viewer representation is Persona-Library-owned Site content, not a vendored or executed copy of the external Template.
- Templates-tab visibility and an illustrative viewer prove catalog/Site integration only; they do not prove runtime access or source availability beyond the recorded evidence.
- Do not mutate Personas, Skills, workflows, Operating Packs, Playbooks, Tools, Docs, decisions, catalog records, or generated files during this read-only pass.
- Prototype identities remain isolated; live Templates must not depend on prototype-only records.

## Report contract

Return status; change observed; initiating contract; scope checked; direct and indirect impacts with relationship, class, evidence, confidence, and action; required updates; optional follow-ups; unchanged checked; catalog/source alignment; local viewer representation status when reusable publication is in scope; generated-output freshness; Templates-tab and focused-viewer visibility when reusable publication is in scope; blockers; incomplete visibility; and next action.
