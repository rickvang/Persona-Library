---
name: persona-skills
description: Identify, define, expand, deduplicate, and validate the reusable skills behind a Persona's activities and workflows.
metadata:
  change_mode: source_update
  change_domain: skills
  reconciliation: persona-reconciliation
---

# Persona Skills

## Recovery status

This is a repository-local reconstruction. The prior Persona Library conversation and current site model describe the behavior, but the historical callable package was not recovered. Treat the current skill catalog, normalization model, and Persona records as evidence and keep historical gaps visible.

## Use this skill when

Activate when the user asks what reusable skills a Persona needs, wants to expand or validate a capability, wants triggers or quality signals, or wants a capability connected to workflows and Persona applications.

Do not activate for Tool execution, credential or access work, canonical Tool catalog maintenance, generic standalone skill creation with no Persona/workflow context, or a one-off behavior that is not independently reusable. A Tool procedure may be a recipe or relationship rather than a new core Skill.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Load the target Persona's workflows, activities, existing skill applications, and relevant evidence. Read [the canonical data](../../../content/library-data.js) and [the normalizer](../../../content/library-model.js) when identity, relationships, or normalized reach is involved.
3. Check the canonical skill catalog, aliases, primitive units, composed skills, and related recipes before proposing a new identity.
4. Establish the mode, requested scope, output destination, authorization, and success criteria. Default to a proposal; metadata never grants write authority.

## Operating modes

### Identify skills

Read the Persona's activities and workflows and propose a deduplicated inventory of portable capabilities. Explain why each item is independently reusable and which existing identity it matches or extends.

### Expand a skill

Create or improve a capability profile with boundaries, operation, triggers, inputs, decisions, observable actions, outputs, feedback, quality signals, failure modes, evidence, workflow reach, tools, and Persona applications.

### Modularize a skill

Classify the requested unit as a primitive capability, composed Skill, contextual Persona application, workflow method, relationship, or Tool-use recipe. Keep reusable judgment in the Skill and context-specific behavior in the application or workflow.

### Skill source update

Compare new evidence with affected capability claims and classify it as `confirms`, `extends`, `qualifies`, or `contradicts`. Change only supported claims, preserve uncertainty, and report affected and unchanged scope.

## Operating procedure

1. Define the Persona, activity or workflow, decision, and desired outcome.
2. Separate a portable capability from a workflow name, task step, behavior, credential, preference, Tool, or recipe.
3. Search the current catalog and aliases. Reuse a stable identity when one already covers the capability; do not fork an alias into a duplicate.
4. Identify the smallest useful abstraction and its boundary. A capability that is too narrow belongs in an application or workflow; a capability that only binds a vendor belongs in a Tool-use recipe.
5. Describe how it operates: trigger, inputs, context, decisions, observable actions, outputs, feedback, and what it leaves behind.
6. Describe how quality is recognized: inspectable signals, review method, realistic test variation, and failure or misuse indicators.
7. Link the capability to relevant workflows, activities, evidence, Persona applications, Tools, and recipes without copying Persona-specific judgment into the canonical Skill.
8. Record proficiency signals, prerequisites, quality standards, validation questions, confidence, and open gaps.
9. For several Personas, use multi-perspective synthesis only when each contributes distinct evidence. Preserve role-specific applications and disagreement.
10. For an authorized live change, produce the smallest change set, hand it to `persona-reconciliation`, and then run `$change-impact-reconciliation` once. Do not update records by implication.

## Capability profile contract

Use the current repository record as the exact schema authority. At minimum, keep these concepts inspectable:

- **Definition and boundary:** what the capability enables, what it does not cover, and why it is reusable.
- **Trigger and inputs:** conditions, context, information, constraints, and prerequisites.
- **Operating model:** decisions, heuristics, observable actions, outputs, feedback, and residual artifacts.
- **Quality signals:** what a reviewer can inspect, how realistic performance is tested, and what failure looks like.
- **Workflow reach:** linked workflows and activities, with foundational/supporting/edge-case distinctions only when supported.
- **Applications:** Persona-specific use, proficiency, protections, priorities, and context remain linked but separate from the portable core.
- **Relationships:** primitive/composed/application/workflow/recipe and related or replacement links, backed by explicit evidence.
- **Tools and evidence:** Tool or category, purpose, source status, and recipe links. Never infer availability, credentials, permission, or workspace.
- **Validation:** evidence, confidence, open questions, validation activities, and revision context.

Do not add fields merely to satisfy this list. Do not copy the site's current capability records into the package; the site remains the content source of truth.

## Modularity and duplication rules

Use this decision order:

1. Existing Skill identity: reuse it and add an application or relationship.
2. Shared primitive: define it only when multiple composed capabilities genuinely depend on the same portable judgment.
3. Composed Skill: define the reusable combination and reference its primitives.
4. Persona application or workflow method: keep context, priorities, and protections here when they are not portable.
5. Tool-use recipe: use when the reusable content is a capability-to-Tool procedure with prerequisites, mode, fallback, and verification.
6. No new Skill: keep a one-off action, relationship, or simple reference in its existing space.

Similar wording is not proof of duplication. Compare triggers, decisions, outputs, quality signals, workflow reach, and boundary before merging or splitting identities.

## Source-change handling

For a new source or changed record:

1. Identify affected capability claims, applications, relationships, and resource trail.
2. Classify each affected claim as confirms, extends, qualifies, or contradicts with evidence and confidence.
3. Update only supported claims; preserve old rationale and unresolved contradiction where needed.
4. Recheck aliases, stable IDs, relationship reach, applications, and recipes for drift.
5. Return the proposed change, unchanged checked items, open questions, and reconciliation handoff.

## Output contract

Return:

- Outcome, mode, Persona/workflow scope, authorization, and assumptions.
- Proposed inventory or capability profile with stable identity and aliases.
- Modular classification and duplicate/overlap reasoning.
- Trigger, operation, outputs, quality signals, failure modes, and validation.
- Workflow reach, Persona applications, Tool/recipe relationships, and evidence status.
- Source trail, confidence, open questions, affected fields, blockers, and next action.

Mark an unknown rather than inventing a quality signal, Tool, relationship, or proficiency level.

## Safety, permissions, and handoffs

- Default to read-only proposal behavior. Creating or changing a live Skill or Persona application requires explicit authorization and a named target.
- Do not make every small action a standalone Skill.
- Do not copy Persona-specific judgment into the canonical capability.
- Do not treat a Tool record as a Skill or proof of availability.
- Do not configure credentials, grant access, execute Tools, publish, merge, or silently rewrite unrelated records.
- Keep prototypes isolated from live Skill and Persona records.
- If a downstream package is unavailable, report the blocked handoff rather than pretending it ran.

For an authorized update, hand off to `persona-reconciliation` and then `$change-impact-reconciliation` once. The adapter runs before the universal pass; do not recurse.

## Focused validation

Before handoff, confirm:

- The inventory is deduplicated and each proposed Skill is portable and independently reusable.
- A profile includes operation and inspectable quality signals, not vague traits.
- Persona applications remain distinct from the canonical core.
- Tool procedures are recipes or relationships when appropriate, not forced into a new Skill.
- Evidence, uncertainty, target, authorization, affected scope, and reconciliation are explicit.
- No live mutation occurred in proposal or research-only mode.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/persona-skills.golden.md).

