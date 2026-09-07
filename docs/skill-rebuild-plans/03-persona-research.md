# Rebuild plan: $persona-research

## Status and recovery basis

- Historical status: explicitly invoked throughout the branch and repeatedly claimed created, updated, and version-controlled.
- Current evidence: the Guide, Persona records, workflow maps, resource trails, confidence labels, and flow hierarchy in the repository.
- Exact package status: missing. Reconstruct behavior from the branch and current content schema.

## Build target

Create .agents/skills/persona-research/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: persona-research
description: Research and maintain evidence-backed persona models by connecting role context, workflows, activities, skills, tools, friction, needs, sources, and validation questions.
metadata:
  change_mode: source_update
  change_domain: personas
  reconciliation: persona-reconciliation
~~~

## Scope and routing

Activate for creating or researching a persona, checking a new source, expanding a role model, or updating evidence and workflow understanding.

Do not activate for generic market research, pure skill catalog maintenance, Tool catalog maintenance, or unrelated content writing.

## Operating modes

### Research-only

Produce evidence, synthesis, hypotheses, confidence, open questions, and a proposed persona structure without changing the library.

### Create persona

Research the role and prepare an authorized Persona record using the repository’s schema.

### Source update

Classify a new source as confirming, extending, qualifying, or contradicting existing claims. Update only supported claims.

### Recheck persona

Review an existing Persona for missing workflows, activities, resources, tools, skills, or validation gaps.

## Operating procedure

1. Define the role, industry, product context, geography, audience, timeframe, and decision the Persona supports.
2. If a missing context has materially different interpretations, ask a scoped multiple-choice question with an Other option; otherwise state the assumption.
3. Prioritize current authoritative, academic, government, professional, and reputable industry sources.
4. Compare sources and label evidence as observed, synthesized, or hypothesis.
5. Model lifecycle, operating context, operating state, journeys, foundational/supporting/edge-case workflows, and activity inventories.
6. For each workflow, capture trigger, outcome, steps, decisions, cadence, tools, collaborators, friction, priorities, and success signals.
7. Identify skills separately from tools, behaviors, credentials, and preferences.
8. Record product implications, resources, confidence, open questions, and validation activities.
9. For an authorized update, create the smallest source change and hand off to persona-reconciliation.
10. Return outcome, mode, evidence, limitations, and next action.

## Context contract

Inputs:

- Role and context.
- Research purpose and target decision.
- Existing Persona and related workflows.
- Source scope and date requirements.
- Authorized output destination.

Outputs:

- Research brief or Persona update proposal.
- Evidence/synthesis/hypothesis labels.
- Workflow and activity map.
- Skills and tool candidates.
- Resource metadata and confidence.
- Open questions and validation plan.

## Safety and authority

- Do not invent a fictional individual and present them as observed fact.
- Do not treat a representative tool hypothesis as observed usage.
- Do not generalize one source beyond its population or context.
- Do not silently replace an existing Persona.
- Do not write a live record without explicit authorization, target identification, and reconciliation.

## Dependencies and resources

Required:

- persona-library-orientation
- content/library-data.js
- content/library-model.js
- persona-skills for explicit capability modeling
- persona-reconciliation for authorized changes

Potential references:

- references/persona-record-contract.md
- references/evidence-status.md
- references/workflow-and-activity-contract.md

The references should mirror maintained repository rules rather than duplicate the entire Site data file.

## Build steps with $skill-creator

1. Initialize the package only after checking for an existing one.
2. Keep routing, evidence rules, and the four operating modes in SKILL.md.
3. Put schema details and source-classification examples in focused references.
4. Add scripts only if deterministic source or schema checks cannot be handled by existing repository validation.
5. Keep the skill automatically discoverable and require authorization at the write boundary.
6. Run quick validation and the behavior cases below.

## Validation cases

1. Create a Persona with role, industry, geography, and decision specified.
2. Create a Persona with industry missing; expected: scoped options rather than an open-ended question.
3. Research-only request; expected: no library changes.
4. New source confirms a claim; expected: resource entry and supported claim only.
5. New source contradicts a claim; expected: contradiction and open question, not invented reconciliation.
6. Persona with multiple workflows; expected: flow tiers and embedded activities.
7. Tool named only by role inference; expected: representative hypothesis label.

## Acceptance criteria

- Research is traceable to sources and confidence.
- Evidence, synthesis, and hypotheses remain distinct.
- Workflows and activities are modeled separately and connected.
- Skills are not conflated with tools or behaviors.
- The skill can produce a research-only result without mutation.
- Authorized changes hand off to Persona reconciliation.
- All validation cases pass and the package passes quick validation.

## Migration notes

Seed behavior from the current Guide and Persona data, but do not copy current records into the skill. The skill should explain how to produce records, not become a second content source.


