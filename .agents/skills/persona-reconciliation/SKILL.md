---
name: persona-reconciliation
description: Review the Persona-specific effects of a changed source, claim, skill, workflow, activity, tool requirement, or capability and return a scoped update without rewriting unrelated fields.
metadata:
  change_mode: reconciliation_adapter
  change_domain: personas
  reconciliation: change-impact-reconciliation
---

# Persona Reconciliation

## Recovery status

This is a repository-local reconstruction of the Persona-specific adapter described by the historical Persona Library conversation and current repository contract. The exact historical callable package was not recovered. This adapter is not a replacement for the universal `$change-impact-reconciliation` protocol.

## Use this skill when

Activate after a material change to a Persona or to a reusable capability applied by a Persona, including a changed source claim, Skill, workflow, activity, Tool requirement, need, priority, or product implication.

Do not activate for a general repository-wide impact review, a pure research brief with no changed Persona scope, canonical Tool catalog maintenance, or an isolated prototype that has not been promoted. The initiating workflow owns research or mutation; this adapter checks Persona-specific consequences.

## Adapter preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Read the initiating contract and record its `change_mode`, `change_domain`, and `reconciliation`. Missing metadata means safest read-only behavior and an explicit contract gap; it is never permission.
3. Identify the actual changed input, source authority, revision, changed fields, named Persona or Personas, requested scope, authorization, and destination. Do not infer a change from a URL, a mention, or a historical claim.
4. Load only the affected Persona records and their workflows, activities, Skills, Tool requirements, resources, priorities, needs, implications, confidence, open questions, and revision history. Read [the current data](../../../content/library-data.js) and [normalizer](../../../content/library-model.js) when relationships or normalized reach are involved.
5. If the target, authority, or affected scope is missing, return a blocked or partial read-only report instead of broadening the review by guesswork.

## Impact classification

Classify each affected claim, field, relationship, or Persona as one of these when evidence allows:

- **Confirms:** supports the existing Persona claim or application without changing scope.
- **Extends:** adds supported context, behavior, workflow, activity, Skill application, or Tool requirement.
- **Qualifies:** narrows, dates, conditions, or lowers confidence in the existing claim.
- **Contradicts:** conflicts with an existing claim; preserve the conflict and open a question.
- **Invalidates:** removes support for a claim, relationship, status, or implication.
- **Unrelated:** checked within scope and has no material Persona consequence.

If a classification is uncertain, say why and preserve the uncertainty. Do not invent a compromise between contradictory sources.

## Operating procedure

1. Capture the change event, initiating contract, source, authority, target Personas, requested scope, and evidence.
2. Map the changed input to affected Persona fields using the current record as the schema authority. Use the [impact matrix](references/persona-impact-matrix.md) as a reasoning aid, not as permission to edit every listed field.
3. Inspect the affected workflows and activities for tier, trigger, outcome, steps, handoffs, tools, friction, priorities, success signals, and linked Skills.
4. Inspect Skill applications for workflow reach, proficiency, quality signals, prerequisites, evidence, and local Persona protections. Keep the portable Skill separate from the application.
5. Inspect Tool requirements for capability, preferred path, mode, scope, fallback, status, rationale, recipe links, and evidence. A requirement is not proof of availability.
6. Compare source and record evidence. Add or revise resources, confidence, open questions, and semantic revision notes only when supported.
7. Separate required updates from optional improvements and from checked-but-unchanged fields or Personas.
8. Preserve unrelated fields, existing uncertainty, contradictions, and append-only revision history. Never silently replace a Persona.
9. Return a bounded update set before any write. If the initiating workflow has explicit authorization and a named target, identify what may be applied; this adapter still does not grant authority or apply unrelated changes.
10. When the initiating change requires downstream review, run the universal `$change-impact-reconciliation` pass once, at most once, after this adapter. Never invoke this adapter or the universal pass recursively.

## Field-impact contract

Use the exact current property names and validation rules from the repository. The following mapping defines what to inspect, not what must always change:

- **Source or claim:** evidence status, confidence, resource trail, affected context, workflow/activity claims, open questions, and revision note.
- **Skill or capability:** linked Persona applications, workflow/activity reach, proficiency and quality signals, prerequisites, needs, Tool/recipe relationships, and product implications.
- **Workflow or activity:** tier, trigger, outcome, decisions, handoffs, cadence, collaborators, tools/information, friction, priorities, success signals, linked Skills, and related journeys.
- **Tool requirement or recipe:** capability need, preferred path, mode, scope, fallback, status, rationale, and affected activity or workflow; never connector availability or permission.
- **Need, priority, or product implication:** affected context, goals, constraints, workflow concerns, evidence, confidence, and validation questions.

See the [revision contract](references/persona-revision-contract.md). Do not copy current Persona data into this package; the library remains the source of truth.

## Output contract

Return a compact reconciliation report containing:

- Status: complete, partial, or blocked.
- Change observed, authority, initiating contract, target, authorization, and scope.
- Classification for each affected item with evidence and confidence.
- Persona fields and relationships checked, with direct or indirect reach where known.
- Required updates, optional follow-ups, and checked-but-unchanged items.
- Resource, confidence, open-question, and semantic-revision changes.
- Validation checks, blockers, incomplete visibility, and the smallest next action.
- Universal reconciliation handoff status, including whether it was required and whether it ran exactly once.

Do not report a successful handoff unless the named package is actually available and invoked. Do not claim exhaustive dependency visibility when only declared relationships and a bounded search were inspected.

## Safety, permissions, and handoffs

- This is a scoped, read-only adapter by default. A review is not permission to rewrite an entire Persona.
- Do not promote a hypothesis to observed evidence or a Tool requirement to availability, credentials, or permission.
- Do not update unrelated Personas, shared Skills, Tools, Docs, Decisions, or Playbooks without separate authorization.
- Do not delete history. Preserve prior rationale and use a new revision or superseding record when the current contract requires it.
- Prototype records are not live Persona evidence until an explicit promotion decision and deliberate change set exist.
- Do not execute Tools, grant access, publish, merge, or install packages.
- If required records, metadata, or the universal handoff are unavailable, report the exact gap and stop safely.

The order is: Persona-specific adapter first, then one universal `$change-impact-reconciliation` pass when required. The universal pass must not call this adapter again for the same event.

## Focused validation

Before handoff, confirm:

- The actual change, authority, target, scope, and initiating contract are identified.
- Classification is evidence-backed or explicitly uncertain.
- Only affected Persona fields and relationships were proposed; unrelated fields are reported unchanged.
- Workflows, activities, Skill applications, Tool requirements, evidence, confidence, and revision history were checked where relevant.
- Required, optional, unchanged, blockers, and incomplete visibility are separated.
- No mutation, Tool execution, access change, or recursive handoff occurred.
- The universal pass is named as zero or one invocation, never repeated.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/persona-reconciliation.golden.md).
