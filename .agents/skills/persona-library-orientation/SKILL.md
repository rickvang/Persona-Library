---
name: persona-library-orientation
description: Orient Persona-Library semantic requests by loading the compact bootstrap and one relevant route group, then return a bounded read-only handoff packet.
metadata:
  skill_layer: library_management
  change_mode: read_only
  change_domain: personas-system
  reconciliation: skip
---

# Persona Library Orientation

## Use this Skill when

Use for an explicit `$persona-library-orientation` request or when the user needs help navigating Persona-Library's semantic system: Personas, Skills, Tools, Templates, Operating Packs, Playbooks, Docs, Decisions, prototypes, or their relationships.

Do not use it merely for repository plumbing whose target is already clear. Root `AGENTS.md` owns that short-path decision.

## Preflight

1. Treat root `AGENTS.md` as already activated; do not reread it just to run this Skill.
2. Read `content/site-orientation.json`.
3. Classify the requested mode and choose the smallest primary space.
4. Read only that space's declared `route_file`, then the selected route's minimum `first_reads` and linked records.
5. Verify actual Tool/Skill/runtime availability when execution depends on it. Documentation, a URL, or a catalog record is not proof of runtime access.
6. If the bootstrap, route group, or required source is unavailable, report the gap and stay read-only rather than inventing missing taxonomy or capability.

## Orientation packet

Return only what downstream work needs:

```text
Goal:
Mode: answer | research | plan | prototype | update | consult
Primary space:
Secondary space(s), if required:
Artifacts in scope:
Boundary / permission:
Success criteria:
Material assumptions or unknowns:
Next action / smallest available handoff:
```

Keep the packet compact. Orientation routes work; it does not perform the downstream research or implementation.

## Boundaries

- This Skill is read-only. An `update` mode describes user intent; it does not grant mutation authority.
- Prototypes remain isolated from live records until separately promoted.
- Preserve sourced, observed, synthesized, assumed, and unknown distinctions.
- For new durable placement, follow `docs/README.md`; escalate to Mara only under the bootstrap's placement escalation conditions.
- For authorized semantic changes, follow the selected Skill's `change_mode`, `change_domain`, and `reconciliation` metadata.
- If a downstream package is unavailable, return the packet and limitation instead of pretending to invoke it.

## Handoff

Choose the smallest available downstream capability named by the selected route. Do not load unrelated route groups or repeat repository-wide policy that already has a canonical owner in `docs/policy-ownership.md`.

Before handoff, confirm the mode, primary space, scope, permission boundary, success criteria, evidence limits, and next action are explicit.
