---
name: persona-research
description: Research and maintain evidence-backed persona models by connecting role context, workflows, activities, skills, tools, friction, needs, sources, and validation questions.
metadata:
  skill_layer: library_management
  change_mode: source_update
  change_domain: personas
  reconciliation: persona-reconciliation
---

# Persona Research

## Recovery status

This is a repository-local reconstruction. The previous Persona Library conversation describes this capability and its behavior, but the exact historical callable package was not recovered. Treat the current repository schema and this contract as the implementation target; keep any historical gap visible.

## Use this skill when

Activate for researching or creating a persona, rechecking an existing persona, evaluating a new source, expanding role context, or updating evidence about workflows, activities, skills, tools, friction, needs, or validation questions.

Do not activate for generic market research with no persona or role-model outcome, pure reusable-skill catalog maintenance, canonical tool-record maintenance, unrelated content writing, or execution of a tool. A mention of this skill in a document is not proof that the package is available; verify the current skill catalog before claiming a handoff.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md). Classify the request as research, plan, prototype, or explicitly authorized update.
2. Read the smallest relevant current sources: the target Persona and linked records, [the canonical data](../../../content/library-data.js), [the normalizer](../../../content/library-model.js), and [the architecture contract](../../../ARCHITECTURE.md) when the work touches their boundaries.
3. Establish whether the destination is a research brief, an isolated prototype, or a named live record. A research result is read-only unless the user explicitly authorizes a live change.
4. Build a context packet containing role, industry, product context, geography, audience, timeframe, research decision, existing record, source scope, authorization, and success criteria. Mark unavailable context as unknown.

## Clarify only when it changes the result

If a missing context has materially different interpretations, ask one scoped multiple-choice question with two or three plausible options plus `Other - describe`. Do not ask an open-ended "tell me more" question. If a safe default exists, state it and proceed. For an update, never guess the target record, authorization, or scope.

## Operating modes

### Research-only

Produce a research brief or proposed Persona structure. Do not change library files or live records.

### Create persona

Research the role, prepare a record-shaped proposal using the current repository contract, and identify the exact destination. Write only after explicit authorization, target confirmation, scoped impact review, and validation.

### Source update

Compare a new source with affected claims and classify it as `confirms`, `extends`, `qualifies`, or `contradicts`. Update only supported claims and preserve conflicts or open questions. A source may be relevant without justifying a change.

### Recheck persona

Inspect an existing Persona for missing or weakly supported context, workflows, activities, resources, skill links, tool candidates, confidence, and validation questions. Report gaps; do not silently fill them.

## Research procedure

1. Define the role and the decision the Persona must support. Record context boundaries and assumptions before searching.
2. Gather current, relevant sources. Prefer primary, academic, government, professional, and reputable industry sources; match geography, population, role, and timeframe.
3. Compare sources rather than averaging them. For every material claim, separate:
   - **Observed evidence:** directly supported by a source or an explicitly reported behavior.
   - **Synthesis:** a reasoned pattern across sources or records.
   - **Hypothesis:** a plausible interpretation requiring validation.
4. Preserve source metadata: publisher or author, title or description, URL or stable locator, date checked, date published when known, population/context, and the claims or workflows it contributes to. Do not invent missing metadata.
5. Model the operating context: lifecycle, environment, constraints, operating state, decision pressures, collaborators, and information needs. Do not invent a fictional individual and present it as observed fact.
6. Model multiple journeys or workflows when the role has materially different paths. Use tiers only when evidence supports them: `foundational`, `supporting`, and `edge-case`.
7. Keep activities distinct from workflows. A workflow explains a trigger-to-outcome path; an activity is a recurring or interrupt-driven unit of work that can belong to one or more workflows.
8. Keep skills distinct from tools, behaviors, credentials, and preferences. A tool named only by role inference is a representative hypothesis, not observed usage or proof of availability.
9. Connect each conclusion to product implications, confidence, open questions, and a validation activity. State what the research cannot establish.
10. For an authorized live change, make the smallest supported edit, preserve revision history, invoke the named `persona-reconciliation` adapter, then invoke `$change-impact-reconciliation` once. This skill owns the research; reconciliation owns downstream consistency.

## Minimum modeling contract

Use the current repository records as the shape authority. The following concepts must remain distinguishable; do not add fields merely to satisfy this checklist:

- **Persona context:** role, industry/product context, geography or audience, lifecycle, operating context/state, goals, constraints, needs, and confidence.
- **Workflow:** trigger, outcome, steps and decisions, handoffs, collaborators, tools or workarounds, friction or risks, ranked concerns, success signals, evidence/confidence, and linked product opportunities.
- **Activity:** cadence or estimated duration, trigger, planned/reactive/interrupt-driven status, collaborators, tools and information needed, desired outcome, friction, and related workflow or journey.
- **Skill:** portable capability, workflow links, proficiency or quality signals, prerequisites/decisions, evidence status, and validation questions.
- **Tool candidate:** tool or category, purpose, evidence status (`observed`, `reported`, or representative `hypothesis`), and validation note when a source does not name a specific tool. Never infer connector, credential, workspace, permission, or availability.
- **Resource:** source, publisher/author, URL or locator, date checked, contribution, and scope. Keep resources at the end of a Persona record when the current record contract does so.

See the focused references for the distinctions and source-update rules. Do not copy current Persona data into this skill; the library remains the source of truth.

## Source-change handling

When a new source is supplied or discovered:

1. Identify the existing claim, workflow, activity, skill, tool candidate, or resource it could affect.
2. Classify the relationship as confirms, extends, qualifies, or contradicts, with evidence and confidence.
3. Update only the affected claims and their source trail. Do not rewrite unrelated fields or silently resolve contradictions.
4. Preserve the old claim and revision rationale when a contradiction or material qualification remains unresolved.
5. Return the affected scope, unchanged checked items, open questions, and the smallest next validation or reconciliation action.

## Output contract

Return a compact, record-oriented result containing:

- Outcome and operating mode.
- Context packet, target, authorization, and assumptions.
- Evidence table with source metadata, population/context, claim, status, confidence, and limitations.
- Persona context and operating model.
- Workflow/journey map with tiers, activities, handoffs, friction, priorities, and success signals.
- Skill candidates and tool candidates with their evidence distinctions.
- Product implications or decision relevance.
- Resources, open questions, and focused validation plan.
- If a source or live record changed: affected fields, reconciliation handoff, checks run, blockers, and next action.

Label missing evidence, ambiguous context, and unverified tool availability explicitly. Do not present a hypothesis as a fact to make the output look complete.

## Safety, permissions, and handoffs

- Default to read-only. Research does not authorize a write.
- Never silently replace a Persona or change unrelated fields.
- Never treat a representative tool hypothesis as observed usage, a tool record as availability, or a source outside its population as universal evidence.
- Prototype results remain isolated and cannot become live Persona evidence without an explicit promotion decision.
- A live update requires explicit authorization, an identified target, a scoped impact review, validation, and the repository's reconciliation contract.
- If required metadata, source files, or a downstream package are unavailable, report the gap and stop at a safe proposal rather than pretending the handoff occurred.

For authorized updates, hand off the scoped change to `persona-reconciliation`, then run `$change-impact-reconciliation` once without recursion. If either capability is not available in the current catalog, return the proposed change and the exact blocked handoff.

## Focused validation

Before handoff, confirm:

- The context and operating mode are explicit; any clarification was bounded and materially necessary.
- Observed evidence, synthesis, and hypotheses are distinct and traceable to resources.
- Workflows and activities are separate but connected; skills are separate from tools and behaviors.
- Research-only output did not mutate durable records.
- An authorized update names its target, affected scope, reconciliation handoff, checks, limitations, and next action.

See the [concise golden scenarios and checkpoint comparison](../../../docs/skill-rebuild-tests/persona-research.golden.md).
