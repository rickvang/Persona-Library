---
name: multi-perspective-skill-synthesis
description: Synthesize distinct evidence-bearing perspectives into a concrete reusable capability and decide whether to reuse, relate, compose, or form a new Skill without erasing evidence or context-specific differences.
metadata:
  skill_layer: orchestration
  change_mode: artifact_generation
  change_domain: skill-formation
  reconciliation: change-impact-reconciliation
---

# Multi-Perspective Skill Synthesis

## Recovery status and role

This is a repository-local reconstruction. The historical conversation described this method and later referred to it as a Skill, but the exact callable package and its runtime outputs were not recovered. Treat the current library, issue plan, and linked records as evidence; do not claim historical parity.

This skill is the shared-capability identifier and formation gate between distinct evidence and Skill construction. Evidence may come from workflows, domain sources, project records, existing Skills/methods, evaluations, Tools/recipes, or Persona applications when they are actually relevant. It prepares a defensible capability definition and a handoff brief for the existing Skill authoring path; it does not silently create a live Skill or replace `pl-skill-creator`, which uses the system `$skill-creator` package helper when available.

## Use this skill when

Activate when a proposed capability is supported by two or more materially distinct evidence sources or applications, or when it is unclear whether the right result is a new Skill, an existing Skill relationship, a composed Skill, a workflow method, a contextual application, or a Tool-use recipe.

Do not activate for:

- an ordinary consultation or comparison with no reusable-capability decision;
- simple disagreement that does not require capability formation;
- a capability already fully covered by an identified Skill relationship;
- a single-source capability claim that lacks independent evidence for synthesis;
- live record mutation, Tool execution, credential setup, or package installation.

## Required preflight

1. Read [the orientation bootstrap](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md), then load the smallest relevant route group and owning evidence sources.
2. State the proposed capability, the decision it should support, desired destination, authorization, constraints, and success measure.
3. Select only sources or applications that contribute materially distinct evidence. Record which records, workflows, Skills/methods, Tools/recipes, domain/project sources, evaluations, or Persona applications were actually loaded; report unavailable items.
4. Read the canonical Skill catalog, aliases, primitive units, composed Skills, relationships, and relevant Tool-use recipes before proposing a new identity. Use [the formation decision rules](references/formation-decision-rules.md).
5. If fewer than two materially distinct evidence-bearing sources are available, return a limitation or use the appropriate single-source authoring path rather than manufacturing a panel or claiming synthesis.
6. If synthesis is part of a live multi-Persona build, load the named [shared problem-context contract](../../../docs/collaboration/problem-context.md). Return a bounded, attributable contribution to that context; do not turn the context into a new Skill merely because several participants collaborated.

## Operating procedure

1. **Frame the decision.** Define the proposed capability in observable terms and identify the context in which it should be reusable. Reject vague labels until the decision, trigger, or outcome is concrete enough to test.
2. **Build independent evidence records.** For each selected source or application, capture only relevant triggers, decisions, actions, outputs, quality signals, constraints, Tool or recipe needs, evidence, confidence, and unresolved questions. Keep facts, interpretation, and hypotheses separate.
3. **Compare before synthesizing.** Use the [comparison matrix](references/synthesis-comparison-matrix.md) to identify shared judgment, role-specific application, meaningful disagreement, and evidence that is missing or too weak. Similar wording is not proof of a shared capability.
4. **Check identity and overlap.** Compare the proposed core against existing Skills, aliases, primitives, composed Skills, relationships, workflow methods, Persona applications, and recipes. Decide the smallest stable representation:
   - reuse an existing Skill when its trigger, decisions, outputs, quality signals, and boundary already fit;
   - add a relationship or Persona application when the portable core exists but context differs;
   - define a primitive or composed Skill only when the shared judgment is independently reusable;
   - keep it as a workflow method when sequencing or ownership is the reusable part;
   - keep it as a Tool-use recipe when the reusable content is tool-specific procedure and verification;
   - recommend no new Skill when the action is one-off, merely relational, or unsupported by distinct evidence.
5. **Formalize the shared core.** For a justified candidate, state a stable name, definition, boundary, trigger, inputs, decisions, observable actions, outputs, feedback, quality signals, failure modes, evidence, confidence, and validation questions. Do not average away a difference that changes use or quality.
6. **Preserve applications separately.** Record how each materially different context or application uses the shared core, including local priorities, protections, thresholds, workflow reach, and constraints. Persona applications may be retained when relevant, but they are optional evidence—not a prerequisite for synthesis. Link applications to the core instead of copying context-specific judgment into it.
7. **Prepare the handoff.** Return a compact build brief containing the identity decision, core profile, context-specific applications, duplicate analysis, source trail, unknowns, validation cases, and proposed change scope. For a standalone reusable Skill/package, hand off to `pl-skill-creator` and use `$change-impact-reconciliation` for an authorized durable update. Use `$persona-skills` / `$persona-reconciliation` only when an actual Persona application is in scope. When a problem context is active, also include `context_id`, stage, the distinct synthesis finding, evidence status, tradeoffs, recommended action, and a provisional disposition for the coordinator to record.
8. **Validate proportionally.** Test one representative multi-source synthesis that does not require Persona records, plus one no-new-Skill or insufficient-evidence boundary. Add a Persona-based case only when Persona applications are materially relevant. Do not present a draft proposal as a changed library record.

## Output contract

Return:

- outcome, decision, scope, authorization, assumptions, and records actually loaded;
- one independent evidence summary per selected source/application and an unavailable/missing-context list;
- comparison of shared capability, role-specific applications, disagreements, tradeoffs, and unknowns;
- classification as existing Skill, relationship, primitive, composed Skill, Persona application, workflow method, Tool-use recipe, or new Skill candidate, with reasons;
- the reusable core profile and validation plan when a new or revised Skill is justified;
- a handoff brief for `pl-skill-creator` / the existing Skill authoring path, or an explicit recommendation not to create a Skill; use Persona-specific handoffs only for an actual Persona application;
- when a shared context is active: one attributable synthesis contribution, its disposition reason, the concrete solution/decision it supports, and the next handoff action;
- affected scope, unchanged checked items, evidence status, confidence, blockers, and next action.

Give evidence-backed reasoning summaries, not hidden chain-of-thought. Mark unknowns when the source does not establish a claim.

## Safety, permissions, and handoffs

- Default to a read-only proposal even though this skill can generate a draft artifact. Metadata routes behavior; it never authorizes mutation.
- Do not let one source, application, or perspective stand in for the others or treat missing evidence as agreement.
- Do not invent a shared core from similar words, merge contradictory claims into a compromise, or erase role-specific protections.
- Do not create a new Skill merely because several records mention the same activity or Tool.
- Do not infer Tool availability, credentials, permission, workspace, or runtime execution from a requirement or recipe.
- Do not edit live Personas, Skills, Tools, Playbooks, Decisions, generated files, or user-level registries without explicit authorization and a named target.
- Preserve historical rationale and unresolved contradictions; use the reconciliation handoff for authorized durable changes.
- Do not close a shared collaboration context from synthesis alone. The coordinator must preserve the contribution, disposition, solution-quality gate, and final deliverable separately.
- If a dependency or selected record is unavailable, report the exact gap and continue only within verified scope.

## Focused validation

Before handoff, confirm:

- each selected source/application contributed distinct evidence or was excluded with a reason;
- the shared core is observable and its boundary is narrower than a vague theme;
- existing identities and aliases were checked before proposing a new one;
- role-specific context, evidence, uncertainty, and disagreements remain visible;
- the no-new-Skill path is considered;
- when a shared context is active, the output is attributable, distinct from other contributions, and useful toward a concrete solution rather than a generic synthesis;
- authorization, target, mutation boundary, and reconciliation handoff are explicit; standalone Skill work uses the universal change-impact path, while Persona reconciliation is conditional on a real Persona application;
- no live mutation, Tool execution, or installation occurred during proposal work.

See the [concise golden scenarios and comparison](../../../docs/internal/skill-rebuild/tests/multi-perspective-skill-synthesis.golden.md) and [shared problem-context contract](../../../docs/collaboration/problem-context.md).

