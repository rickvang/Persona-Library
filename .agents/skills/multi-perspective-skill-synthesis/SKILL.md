---
name: multi-perspective-skill-synthesis
description: Synthesize distinct Persona perspectives into a concrete reusable capability and decide whether to reuse, relate, compose, or form a new Skill without erasing evidence or role-specific context.
metadata:
  change_mode: artifact_generation
  change_domain: skill-formation
  reconciliation: persona-reconciliation
---

# Multi-Perspective Skill Synthesis

## Recovery status and role

This is a repository-local reconstruction. The historical conversation described this method and later referred to it as a Skill, but the exact callable package and its runtime outputs were not recovered. Treat the current library, issue plan, and linked records as evidence; do not claim historical parity.

This skill is the shared-capability identifier and formation gate between Persona consultation and Skill construction. It prepares a defensible capability definition and a handoff brief for `$persona-skills`; it does not silently create a live Skill or replace the system `$skill-creator` package builder.

## Use this skill when

Activate when a proposed capability spans several roles, workflows, or Persona applications, or when it is unclear whether the right result is a new Skill, an existing Skill relationship, a composed Skill, a workflow method, a Persona application, or a Tool-use recipe.

Do not activate for:

- an ordinary one-Persona or panel consultation with no reusable-capability decision;
- simple disagreement that does not require capability formation;
- a capability already fully covered by an identified Skill relationship;
- a single-Persona capability discovery better handled by `$persona-skills`;
- live record mutation, Tool execution, credential setup, or package installation.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. State the proposed capability, the decision it should support, desired destination, authorization, constraints, and success measure.
3. Select only Personas whose records contribute distinct evidence. Record which records and linked workflows, Skills, Tools, applications, priorities, and sources were actually loaded; report unavailable items.
4. Read the canonical Skill catalog, aliases, primitive units, composed Skills, relationships, and relevant Tool-use recipes before proposing a new identity. Use [the formation decision rules](references/formation-decision-rules.md).
5. If fewer than two materially distinct evidence-bearing perspectives are available, hand the work to `$persona-skills` or return a limitation rather than manufacturing a panel.
6. If synthesis is part of a live multi-Persona build, load the named [shared problem-context contract](../../../docs/collaboration/problem-context.md). Return a bounded, attributable contribution to that context; do not turn the context into a new Skill merely because several participants collaborated.

## Operating procedure

1. **Frame the decision.** Define the proposed capability in observable terms and identify the context in which it should be reusable. Reject vague labels until the decision, trigger, or outcome is concrete enough to test.
2. **Build independent perspective records.** For each selected Persona, capture only relevant triggers, decisions, actions, outputs, quality signals, constraints, Tool or recipe needs, evidence, confidence, and unresolved questions. Keep facts, interpretation, and hypotheses separate.
3. **Compare before synthesizing.** Use the [comparison matrix](references/synthesis-comparison-matrix.md) to identify shared judgment, role-specific application, meaningful disagreement, and evidence that is missing or too weak. Similar wording is not proof of a shared capability.
4. **Check identity and overlap.** Compare the proposed core against existing Skills, aliases, primitives, composed Skills, relationships, workflow methods, Persona applications, and recipes. Decide the smallest stable representation:
   - reuse an existing Skill when its trigger, decisions, outputs, quality signals, and boundary already fit;
   - add a relationship or Persona application when the portable core exists but context differs;
   - define a primitive or composed Skill only when the shared judgment is independently reusable;
   - keep it as a workflow method when sequencing or ownership is the reusable part;
   - keep it as a Tool-use recipe when the reusable content is tool-specific procedure and verification;
   - recommend no new Skill when the action is one-off, merely relational, or unsupported by distinct evidence.
5. **Formalize the shared core.** For a justified candidate, state a stable name, definition, boundary, trigger, inputs, decisions, observable actions, outputs, feedback, quality signals, failure modes, evidence, confidence, and validation questions. Do not average away a difference that changes use or quality.
6. **Preserve applications separately.** Record how each Persona uses the shared core, including local priorities, protections, proficiency, workflow reach, and context. Link to the core instead of copying Persona-specific judgment into it.
7. **Prepare the handoff.** Return a compact build brief for `$persona-skills` containing the identity decision, core profile, role-specific applications, duplicate analysis, source trail, unknowns, validation cases, and proposed change scope. When a problem context is active, also include `context_id`, stage, the distinct synthesis finding, evidence status, tradeoffs, recommended action, and a provisional disposition for the coordinator to record. If a durable update is explicitly authorized, identify the named target and hand off to `$persona-reconciliation`; run `$change-impact-reconciliation` after the domain adapter when the initiating contract requires it.
8. **Validate proportionally.** Test one representative multi-Persona synthesis and one no-new-Skill or insufficient-evidence boundary. Add a case only when a distinctive risk is not covered. Do not present a draft proposal as a changed library record.

## Output contract

Return:

- outcome, decision, scope, authorization, assumptions, and records actually loaded;
- one independent evidence summary per selected Persona and an unavailable/missing-context list;
- comparison of shared capability, role-specific applications, disagreements, tradeoffs, and unknowns;
- classification as existing Skill, relationship, primitive, composed Skill, Persona application, workflow method, Tool-use recipe, or new Skill candidate, with reasons;
- the reusable core profile and validation plan when a new or revised Skill is justified;
- a `$persona-skills` handoff brief, or an explicit recommendation not to create a Skill;
- when a shared context is active: one attributable synthesis contribution, its disposition reason, the concrete solution/decision it supports, and the next handoff action;
- affected scope, unchanged checked items, evidence status, confidence, blockers, and next action.

Give evidence-backed reasoning summaries, not hidden chain-of-thought. Mark unknowns when the source does not establish a claim.

## Safety, permissions, and handoffs

- Default to a read-only proposal even though this skill can generate a draft artifact. Metadata routes behavior; it never authorizes mutation.
- Do not let the most articulate Persona stand in for the others or treat silence as agreement.
- Do not invent a shared core from similar words, merge contradictory claims into a compromise, or erase role-specific protections.
- Do not create a new Skill merely because several records mention the same activity or Tool.
- Do not infer Tool availability, credentials, permission, workspace, or runtime execution from a requirement or recipe.
- Do not edit live Personas, Skills, Tools, Playbooks, Decisions, generated files, or user-level registries without explicit authorization and a named target.
- Preserve historical rationale and unresolved contradictions; use the reconciliation handoff for authorized durable changes.
- Do not close a shared collaboration context from synthesis alone. The coordinator must preserve the contribution, disposition, solution-quality gate, and final deliverable separately.
- If a dependency or selected record is unavailable, report the exact gap and continue only within verified scope.

## Focused validation

Before handoff, confirm:

- each selected perspective contributed distinct evidence or was excluded with a reason;
- the shared core is observable and its boundary is narrower than a vague theme;
- existing identities and aliases were checked before proposing a new one;
- role-specific context, evidence, uncertainty, and disagreements remain visible;
- the no-new-Skill path is considered;
- when a shared context is active, the output is attributable, distinct from other contributions, and useful toward a concrete solution rather than a generic synthesis;
- authorization, target, mutation boundary, and reconciliation handoff are explicit;
- no live mutation, Tool execution, or installation occurred during proposal work.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/multi-perspective-skill-synthesis.golden.md) and [shared problem-context contract](../../../docs/collaboration/problem-context.md).

