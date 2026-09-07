---
name: persona-panel-orchestration
description: Consult one or more explicitly named Personas independently, compare their evidence and disagreements, and synthesize a concise recommendation without silently changing durable records.
metadata:
  change_mode: read_only
  change_domain: consultation
  reconciliation: skip
---

# Persona Panel Orchestration

## Recovery status

This is a repository-local reconstruction. The historical conversation described single-Persona and panel consultations, but the exact callable package was not recovered. Treat current Persona records, workflow maps, and repository boundaries as the source of truth and do not claim historical runtime parity.

## Use this skill when

Activate for a consultation using one explicitly named Persona, a panel of explicitly named Personas, or a named Playbook session where distinct perspectives must be compared.

Do not activate by inventing participants for an ambiguous request. Do not use this skill as a general autonomous multi-agent runtime, as permission to update the Site, or for a simple direct answer that needs no Persona perspective. A named participant that is unavailable must be reported as unavailable, not simulated as loaded.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Identify the user's goal, decision or artifact under review, constraints, requested output, and whether the destination is read-only advice or an explicitly authorized durable artifact.
3. Determine whether the request names one Persona, two to four Personas, or a named Playbook. Load only the selected records and relevant workflows, Skills, priorities, evidence, and boundaries.
4. If participant mode is ambiguous and the choice materially changes the work, ask one scoped choice: `one Persona`, `a panel`, `a named Playbook`, or `Other - describe`. Do not choose participants by inference.
5. Record unavailable records, missing context, and authorization as limitations. Do not silently fill them.

## Operating modes

### Single Persona

Process one named Persona against the requested goal. Return the relevant perspective, evidence, assumptions, risks, quality signals, and next action.

### Panel

Process each named Persona independently before comparing them. Preserve distinct priorities, workflow protections, evidence, disagreement, and uncertainty. Do not let one Persona's judgment stand in for the others.

### Named Playbook

Load the named Playbook and its explicitly defined participants, stages, shared state, artifacts, quality gates, and decision rights. Report missing participants, inputs, or stage evidence instead of inventing them.

## Operating procedure

1. Build a compact context packet: goal, decision/artifact, participants, relevant context, constraints, output destination, authorization, and success criteria.
2. Load each selected Persona independently. Use only the records and linked workflows actually available.
3. For each participant, summarize only relevant operating context, workflows, Skills, priorities, evidence, concerns, and proposed action. Keep facts, synthesis, hypotheses, and unknowns distinct.
4. Compare agreement, disagreement, tradeoffs, risks, assumptions, missing evidence, and consequences. Name which Persona supports each material point.
5. Synthesize a concise recommendation that explains the decision, preserves consequential disagreement, and states what would change the recommendation.
6. Return a concrete next action and focused validation question. Do not expose hidden chain-of-thought; provide evidence-backed reasoning summaries.
7. If the user asks to save a Draft, Doc, Proposed Decision, or Playbook Artifact, separate the read-only consultation from that artifact-generation action. Require explicit authorization, identify the target, and invoke `$change-impact-reconciliation` when the authorized artifact becomes durable.

## Perspective contract

Each selected Persona contribution should identify, when relevant:

- operating context, lifecycle, and state;
- affected workflows, activities, Skills, Tools, and constraints;
- priorities, protections, risks, and success signals;
- evidence status, confidence, assumptions, and unknowns;
- recommendation or concern tied to the user's goal.

The panel result should identify agreements, disagreements, tradeoffs, unresolved questions, recommendation, and next action. Similar wording is not agreement; absence of a statement is not disagreement.

## Output contract

Return:

- Outcome, mode, goal, artifact/decision, constraints, and assumptions.
- Selected participants and records actually loaded, plus unavailable items.
- One independent perspective section per selected Persona or Playbook stage.
- Evidence, confidence, hypotheses, unknowns, and relevant source or record links.
- Agreement, disagreement, risks, tradeoffs, and what remains unresolved.
- Recommendation, decision conditions, validation question, and next action.
- If a durable artifact was explicitly requested: target, authorization, handoff, checks, and limitations.

Keep the response concise and decision-useful. Do not fabricate a panel consensus or claim a participant contributed when its record was not loaded.

## Safety, permissions, and handoffs

- This skill is read-only. It may inspect records and synthesize advice, but it does not edit Personas, Skills, Tools, Docs, Decisions, Playbooks, prototypes, or generated files.
- Participant selection must be explicit. Never silently add a Persona, use a hidden panel, or treat a generic role as a loaded record.
- Do not expose hidden chain-of-thought. Summarize reasons, evidence, uncertainty, and tradeoffs.
- Do not treat a Tool record as availability or use a consultation as permission to execute Tools.
- Prototype content remains isolated from live truth.
- Saving a durable artifact is a separate explicitly authorized operation; if it occurs, use the universal reconciliation protocol once as required and do not recurse.
- If a record, Playbook, source, or downstream handoff is unavailable, state the exact limitation and continue only within the verified scope.

## Focused validation

Before handoff, confirm:

- The goal and mode are explicit and participant selection was not invented.
- Every selected Persona was actually loaded or marked unavailable.
- Perspectives were processed independently and material disagreement was preserved.
- Evidence, synthesis, hypotheses, assumptions, and unknowns remain distinct.
- The recommendation is concise, actionable, and tied to the stated goal.
- No durable mutation or Tool execution occurred without explicit authorization.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/persona-panel-orchestration.golden.md).
