---
name: operating-pack-reconciliation
description: Review the downstream effects of a material Operating Pack change across Skills, Personas, workflows, Playbooks, Tool-use recipes, dependent packs, Docs, and generated output.
metadata:
  skill_layer: governance
  change_mode: reconciliation_adapter
  change_domain: operating-packs
  reconciliation: change-impact-reconciliation
---

# Operating Pack Reconciliation

## Role

Perform the Operating Pack-specific adapter pass after a material source, record, or compiled-file change. Determine whether the change confirms, extends, qualifies, contradicts, invalidates, or is unrelated to the scoped assumptions around it. This Skill is read-only and does not apply downstream updates.

## Procedure

1. Capture the changed pack or source, authority, revision, authorization constraints, and bounded scope.
2. Load explicit pack applications and declared relationships to Personas, Skills, workflows, Playbooks, Tool-use recipes, dependent packs, Docs, and generated Site output.
3. Check source/location, entrypoint, status, path resolution, evidence classification, file scope, stale links, duplicate guidance, and revision context.
4. For each dependent, classify the effect as `confirms`, `extends`, `qualifies`, `contradicts`, `invalidates`, or `unrelated`, with evidence and confidence. Do not manufacture a relationship from similar wording.
5. Apply the crucial boundary rule: an Operating Pack rule does not automatically become part of a Skill. “Use pnpm” remains project context. A recurring judgment such as assessing downstream compatibility before changing a public contract may be handed to `persona-skills` for review when evidence supports generalization.
6. Separate required updates, optional follow-ups, checked-unchanged records, unresolved gaps, and incomplete dependency visibility.
7. Return the adapter report to the initiating workflow and hand one universal `$change-impact-reconciliation` pass to the repository owner. Never invoke the universal pass recursively.

## Report contract

Return status; change observed; initiating contract; scope checked; direct and indirect impacts with relationship, class, evidence, confidence, and action; required updates; optional follow-ups; unchanged checked; generated-output freshness; blockers; incomplete visibility; and the smallest next action. State when a source is external, planned, unavailable, or not verified.

## Boundaries

Do not edit a Skill, Persona, Playbook, Tool, Doc, Decision, pack, or generated file. Do not execute or install a pack, fetch a repository, grant permissions, or treat a catalog record as proof of availability. Prototype records remain isolated and live records cannot depend on them. If the initiating contract or target is incomplete, report the gap and stay read-only.
