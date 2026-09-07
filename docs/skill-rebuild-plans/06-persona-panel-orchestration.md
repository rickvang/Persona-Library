# Rebuild plan: $persona-panel-orchestration

## Status and recovery basis

- Historical status: explicitly invoked with single and multi-Persona tests; claimed created, version-controlled, and validated.
- Current evidence: the Guide contains single-Persona, panel, and playbook prompts; ARCHITECTURE.md describes independent processing and disagreement preservation.
- Exact package status: missing. Reconstruct from the tested behavior rather than from the Site’s rendered copy alone.

## Build target

Create .agents/skills/persona-panel-orchestration/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: persona-panel-orchestration
description: Consult one or more explicitly named Personas independently, compare their evidence and disagreements, and synthesize a concise recommendation without silently changing durable records.
metadata:
  change_mode: read_only
  change_domain: consultation
  reconciliation: skip
~~~

If the user asks to save a durable artifact, route that operation as an authorized artifact-generation change and invoke the universal reconciliation protocol.

## Scope and routing

Activate for a named Persona consultation, named panel, or named playbook session.

Do not activate by inventing participants for an ambiguous request. Do not use it as a general autonomous multi-agent runtime or as permission to update the Site.

## Operating procedure

1. Identify the user’s goal, artifact, decision, constraints, and requested output.
2. Determine whether the request names one Persona, two to four Personas, or a named playbook.
3. If the mode is ambiguous, ask a short scoped choice: one Persona, a panel, a playbook, or Other.
4. Load each selected Persona’s context, workflows, skills, priorities, evidence, and boundaries.
5. Process each perspective independently and summarize only the relevant judgment.
6. Compare agreements, disagreements, risks, assumptions, missing evidence, and tradeoffs.
7. Synthesize a recommendation that does not erase material disagreement.
8. Return evidence status and a concrete next action.
9. Offer Draft, Doc, Proposed Decision, or Playbook Artifact only as explicit output destinations.

## Context contract

Inputs:

- Goal or question.
- Artifact or decision under review.
- Explicit Persona or playbook names.
- Relevant context, constraints, and evidence.
- Requested output destination.

Outputs:

- Recommendation.
- Independent Persona perspectives.
- Agreement and disagreement summary.
- Risks, assumptions, evidence, and hypotheses.
- Next action and optional authorized artifact proposal.

## Safety and authority

- Never silently select a panel.
- Never claim a Persona contributed when its record was not loaded.
- Do not expose hidden chain-of-thought; provide concise reasoning summaries and evidence.
- Preserve uncertainty and disagreement.
- Do not update Personas, Skills, Docs, Decisions, or Playbooks without explicit authorization.

## Dependencies and resources

Required:

- persona-library-orientation
- persona-research and persona-skills records
- selected Persona records and workflow maps

Optional:

- Multi-perspective skill synthesis as an internal method
- change-impact-reconciliation when saving a durable artifact

No scripts are required initially. A response-format reference may be added only if the entrypoint becomes too large.

## Build steps with $skill-creator

1. Initialize the package after checking for an existing equivalent.
2. Put mode selection, participant rules, independent processing, synthesis, and output contract in SKILL.md.
3. Add the historical test prompts as validation fixtures, not as instructions that force a particular conclusion.
4. Keep automatic discovery enabled but make participant selection explicit.
5. Validate behavior independently before any artifact-saving integration.

## Validation cases

1. Single Persona: Camille evaluates current navigation. Expected: one perspective, quality signals, assumptions, evidence, and next action.
2. Panel: Camille, Mara, and Riley evaluate navigation. Expected: independent perspectives, synthesis, and preserved disagreement.
3. Ambiguous: “Use the panel skill to improve the system.” Expected: bounded clarification, no invented panel, no Site update.
4. Named playbook: expected stage, participants, evidence gaps, and next action.
5. Unavailable Persona: expected explicit limitation rather than fabricated participation.

## Acceptance criteria

- Explicit participant selection is enforced.
- Each selected Persona contributes a distinct, grounded perspective.
- Facts, synthesis, and hypotheses are separated.
- Disagreement is retained when consequential.
- The response is concise, actionable, and evidence-aware.
- No durable mutation occurs without authorization.
- The package and all behavior cases pass validation.

## Migration notes

The branch’s tests are the strongest available behavioral specification. Preserve those tests while avoiding hardcoded conclusions about the navigation or any specific artifact.


