---
name: template-research
description: Determine whether an existing reusable starting artifact fits a task and propose reuse, adaptation, local creation, or canonical cataloging when it does not.
metadata:
  skill_layer: library_management
  change_mode: source_update
  change_domain: templates
  reconciliation: template-reconciliation
---

# Template Research

## Role

Research reusable starting artifacts and scaffolds before a project creates one. A Template answers what to start from; it does not define general method, professional judgment, operating rules, Tool permissions, or Playbook orchestration.

## Procedure

1. Identify the task, project context, intended artifact, constraints, requested destination, and whether the need is reusable or project-specific.
2. Search the live Template catalog first. Compare candidates by purpose, category, use-when, source path, entrypoint, status, availability, provided structure, and evidence.
3. Verify an external candidate’s actual repository path, entrypoint, and revision before calling its source verified. Repository existence alone is not evidence that an individual Template exists or that the current runtime can access it.
4. Define the smallest starting structure the work actually needs. Separate reusable structure from project-specific content, examples, and later output.
5. Check scoped Persona–Skill–workflow applications as real relationships: the Persona, Skill profile, Persona workflow, and Skill ownership of that workflow must all resolve together.
6. Recommend reuse, adaptation, local creation, or a new planned/canonical Template identity. Keep the recommendation proposal-first and expose uncertainty.

## Output

Return the mode, task scope, candidate comparison, evidence ledger, source and availability findings, proposed boundary, relationships, recommendation, limitations, and next action. Do not silently create a Template record, starter files, or an external artifact.

## Boundaries

- Do not turn an Operating Pack rule into Template content; an Operating Pack governs how work is done.
- Do not turn Skill judgment, Tool capability or permission, or Playbook stages and gates into Template fields.
- Do not treat a catalog entry as proof that the external artifact is present or usable in the current runtime.
- Keep a project-specific Template local until evidence supports broader reuse and an authorized promotion.
- After a durable Template source or record update, hand off to `template-reconciliation`, then one universal `$change-impact-reconciliation` pass.
