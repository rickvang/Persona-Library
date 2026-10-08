---
name: persona-library-orientation
description: Orient Persona-Library semantic requests from the generated system-orientation context bundle when valid, with a canonical bootstrap/route-group fallback, then return a bounded read-only handoff packet.
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
2. Prefer `dist/data/agent-context/system-orientation.json` as the bounded activation packet.
3. Use that bundle only when all of these are true:
   - `schema_version` is `persona-library.agent-context/v0.1`;
   - `route_id` is `system-orientation`;
   - `primary_space` is `docs`;
   - `package_path` is `.agents/skills/persona-library-orientation`;
   - the graph fragment includes the explicit `system-orientation → persona-library-orientation` route edge;
   - every included graph node/edge has provenance;
   - the retained exception fields are present.
4. When the bundle is valid, use its compact `space_index` to choose the smallest primary semantic space, then load only that space's declared `route_file` when a downstream route must be selected. Use the bundle's `exceptions.first_reads`, mutation boundary, non-triggers, next handoff, space `do_not`, and graph-declared change contract. Do **not** reread the full semantic bootstrap or the complete Docs route group merely to reconstruct `system-orientation`.
5. If the bundle is missing, unreadable, malformed, route/package-mismatched, provenance-incomplete, or lacks a usable space index, fall back to the canonical current path: read `content/site-orientation.json`, select Docs, read `content/orientation/docs.json`, then select `system-orientation`. Stay read-only while falling back.
6. Read the selected route's minimum `first_reads` and linked records after either path resolves the route. For a new durable placement question, also read `docs/README.md` and apply its direct-placement versus qualified architecture-review gate.
7. Verify actual Tool/Skill/runtime availability when execution depends on it. A generated bundle, documentation, URL, or catalog record is not proof of runtime access.
8. If both the bundle and canonical fallback sources are unavailable, report the gap and stay read-only rather than inventing missing taxonomy or capability.

The generated bundle is a derived context projection, not a source of truth. Canonical route, Skill, policy, validation, and live-runtime sources continue to govern behavior.

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
- For new durable placement, follow `docs/README.md`; request qualified architecture review only under the bootstrap's placement escalation conditions.
- For authorized semantic changes, follow the selected Skill's `change_mode`, `change_domain`, and `reconciliation` metadata.
- If a downstream package is unavailable, return the packet and limitation instead of pretending to invoke it.

## Handoff

Choose the smallest available downstream capability named by the selected route. Do not load unrelated route groups or repeat repository-wide policy that already has a canonical owner in `docs/policy-ownership.md`.

Before handoff, confirm the mode, primary space, scope, permission boundary, success criteria, evidence limits, and next action are explicit.
