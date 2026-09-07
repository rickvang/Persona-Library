# Rebuild plan: playbook-composer

## Status and recovery basis

- Historical status: explicitly proposed, with the branch stating that it was not created yet.
- Current evidence: the Playbooks space, job-search playbook, skill-formation workflow, Guide, and architecture boundaries.
- Exact package status: not implemented and not referenced as a callable package.

## Build target

Defer creation until the foundation skills have repeated usage. If approved later, create .agents/skills/playbook-composer/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: playbook-composer
description: Compose reusable multi-stage operating models from Personas, Skills, Tools, workflows, artifacts, handoffs, shared state, and quality gates toward a defined outcome.
metadata:
  change_mode: record_update
  change_domain: playbooks
  reconciliation: change-impact-reconciliation
~~~

## Scope and routing

Activate when a repeatable outcome requires multiple stages, participants, handoffs, shared state, decision rights, or quality gates.

Do not activate for one-off tasks, a single Persona consultation, a simple Skill definition, or runtime execution.

## Operating procedure

1. Define the outcome, users, constraints, success measure, and stopping condition.
2. Check for an existing Playbook before creating a new one.
3. Select explicitly named Personas and reusable Skills.
4. Decompose the work into stages with inputs, outputs, owner, supporting lenses, and decision rights.
5. Define shared state, artifacts, evidence, approvals, quality gates, and learning loop.
6. Map required capabilities to Tools or Tool-use recipes without assuming availability.
7. Specify handoffs, failure paths, escalation, and recovery.
8. Keep Persona and Skill definitions referenced rather than copied.
9. Test the playbook with representative, ambiguous, failed, and interrupted cases.
10. Record the durable Playbook and run universal reconciliation after authorization.

## Context contract

Inputs:

- Desired outcome.
- Existing Personas, Skills, Tools, recipes, and artifacts.
- Participants and constraints.
- Success criteria and risk level.
- Requested output destination.

Outputs:

- Playbook definition.
- Stage and handoff map.
- Shared state and artifact contract.
- Quality gates and decision rights.
- Tool capability requirements and fallbacks.
- Failure paths, learning loop, and revision conditions.

## Safety and authority

- Do not add participants automatically.
- Do not duplicate Persona or Skill definitions.
- Do not treat a Playbook as runtime execution.
- Do not publish or change live records without authorization.
- Do not make a prototype or working model appear validated.

## Dependencies and resources

Required:

- persona-library-orientation
- persona-panel-orchestration
- persona-research and persona-skills
- tool-discovery-and-safe-execution
- change-impact-reconciliation

Potential references:

- references/playbook-schema.md
- references/stage-and-handoff-contract.md
- references/quality-gates.md

## Build steps with $skill-creator

1. Wait until at least one repeated multi-stage workflow demonstrates the need.
2. Check whether the existing Playbooks documentation already covers the required behavior.
3. Initialize the package with $skill-creator.
4. Keep outcome framing, stage decomposition, shared state, handoffs, and gates in SKILL.md.
5. Add schema references only when multiple Playbooks need the same contract.
6. Validate with both outcome and system-maintenance Playbooks.

## Validation cases

1. Evidence-led job search; expected: stages, participant roles, shared evidence, and quality gates.
2. Create-and-integrate-a-skill workflow; expected: research, synthesis, formalization, validation, and reconciliation.
3. One-off task; expected: recommend direct work rather than a new Playbook.
4. Missing participant or Tool; expected: explicit gap and fallback.
5. Interrupted stage; expected: recovery path and preserved state.
6. Authorized durable Playbook update; expected: impact review and revision record.

## Acceptance criteria

- A Playbook is created only for a reusable multi-stage operating model.
- Stages have owners, handoffs, inputs, outputs, and decision rights.
- Shared state and quality gates are explicit.
- Tool requirements do not imply availability.
- Failure, escalation, and learning paths are testable.
- References prevent duplication of Persona and Skill content.

## Migration notes

The branch’s job-search and skill-formation models are strong candidates for test fixtures, not automatic package content. Keep the Playbooks Site as the canonical workflow documentation and create the skill only when its reusable behavior is proven.

