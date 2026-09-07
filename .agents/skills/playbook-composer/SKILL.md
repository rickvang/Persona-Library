---
name: playbook-composer
description: Compose reusable multi-stage operating models from Personas, Skills, Tools, workflows, artifacts, handoffs, shared state, decision rights, and quality gates toward a defined outcome.
metadata:
  change_mode: record_update
  change_domain: playbooks
  reconciliation: change-impact-reconciliation
---

# Playbook Composer

## Recovery status and role

This is a repository-local reconstruction. `playbook-composer` was explicitly proposed in the historical material, but the historical package was not created or recovered. The current Playbooks space, job-search playbook, skill-formation workflow, Guide, and architecture define the behavior to reconstruct. Do not claim exact historical parity.

This skill designs and maintains a reusable coordination model. A Playbook coordinates existing Personas, Skills, Tools, workflows, artifacts, evidence, shared state, owners, and quality gates toward an outcome; it is not a runtime executor and does not redefine the components it references.

## Use this skill when

Activate when a repeatable outcome needs multiple stages, participants, handoffs, shared state, decision rights, approvals, quality gates, failure recovery, or a learning loop, or when the user explicitly asks to create, revise, or evaluate a Playbook.

Do not activate for:

- a one-off task that can be completed directly;
- a single Persona consultation or simple panel synthesis;
- a standalone Skill definition or Persona record update;
- a Tool lookup or Tool execution without a multi-stage operating model;
- runtime execution of an already-defined Playbook;
- publishing or changing a durable Playbook without explicit authorization and a named target.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Define the outcome, users, constraints, risk, success measure, stopping condition, requested destination, and authorization.
3. Check for an existing Playbook before creating a new one. Consult [the current job-search implementation](../../../JOB_SEARCH_IMPLEMENTATION.md) when the request is analogous; treat it as a fixture and scope reference, not proof of runtime execution.
4. Load only explicitly named or justified Personas, Skills, workflows, Tools, recipes, artifacts, evidence, and decisions. Record unavailable items and incomplete dependency visibility.
5. Resolve Tool capability requirements through `$tool-discovery-and-safe-execution` when needed; do not assume a connector, credential, workspace, permission, or runtime is available.

## Operating modes

### Compose a new Playbook

Create a proposal for a reusable outcome whose stages and quality gates can be repeated. Reuse stable component identities and make the new coordination layer explicit.

### Update an existing Playbook

Compare the requested change with the current Playbook, identify affected stages, state, artifacts, participants, dependencies, gates, and learning records, then return the smallest change set. Preserve prior rationale and unresolved questions.

### Evaluate or repair a Playbook

Inspect whether the Playbook has a coherent outcome, stage contracts, ownership, state, evidence, decision rights, Tool fallbacks, gates, and recovery paths. Report defects and missing evidence without silently rewriting it.

## Operating procedure

1. **Frame the outcome.** State the result the Playbook is meant to produce, who uses it, what is out of scope, how success is recognized, and when the run stops or escalates.
2. **Select the parts.** Choose explicitly named or evidence-justified Personas, Skills, workflows, Tools, recipes, artifacts, and decisions. Reference canonical definitions rather than copying them.
3. **Decompose stages.** For each stage, define purpose, owner, supporting perspectives, entry conditions, inputs, decisions, observable actions, outputs, evidence, exit criteria, and handoff. Use [the stage contract](references/stage-handoff-and-gates.md).
4. **Define shared state and artifacts.** Identify the source of truth, artifact owner, version or revision context, allowed status changes, provenance, retention, and what later stages may rely on. Distinguish proposed, draft, reviewed, approved, and published states where relevant.
5. **Set decision rights.** Name who recommends, reviews, approves, can stop, can resolve ambiguity, and owns an exception. Do not add participants or authority by inference.
6. **Map capabilities and Tools.** Identify which Skill, Persona application, workflow method, Tool-use recipe, or Tool requirement supports each stage. Record prerequisites, availability status, safest path, fallback, verification, and permission needs; requirements never prove availability.
7. **Add quality gates.** Define evidence required, reviewer or decision owner, pass/fail or defer conditions, what is still unknown, and the next action. A gate must prevent an invalid stage transition, not merely repeat a status label.
8. **Design failure and learning paths.** Specify missing-input, unavailable-participant, Tool failure, contradiction, timeout, interrupted-stage, escalation, recovery, and rollback behavior. Record what the next run should learn and when the Playbook should be revised.
9. **Test the model.** Use one representative multi-stage case and one boundary/failure case. Check that stages, handoffs, state, decision rights, gates, and fallbacks are actionable without pretending the Playbook was executed.
10. **Prepare the change.** Return a bounded proposal, unchanged checked items, evidence, unknowns, and migration notes. For an explicitly authorized durable update, identify the target, apply the smallest change, then run `$change-impact-reconciliation` once. Do not execute the Playbook as part of composing it.

## Playbook contract

At minimum, a useful Playbook makes these items inspectable:

- identity, outcome, audience, scope, constraints, success measure, and stopping condition;
- participants and decision rights, with records actually loaded and unavailable items visible;
- ordered stages with entry/exit criteria, owners, inputs, decisions, actions, outputs, evidence, and handoffs;
- shared state and artifact provenance, revision/status rules, source of truth, and retention expectations;
- linked Personas, Skills, workflow methods, Tools, requirements, recipes, and explicit fallbacks;
- quality gates, approvals, validation checks, failure paths, escalation, recovery, and learning loop;
- evidence status, confidence, assumptions, unresolved questions, revision context, and next action.

Do not add fields merely to satisfy a checklist. The repository's existing Playbook record and validator remain the schema authority.

## Output contract

Return:

- outcome, scope, constraints, success, stopping condition, authorization, and assumptions;
- whether this is a new, update, evaluation, or repair mode and which existing Playbook was checked;
- participant/component map with loaded, unavailable, and inferred-but-unverified items separated;
- stage and handoff map, shared state/artifact contract, decision rights, capabilities, Tool requirements, fallbacks, and quality gates;
- failure, escalation, recovery, learning, validation, migration, and revision conditions;
- evidence, confidence, unknowns, blockers, checked-but-unchanged items, and the smallest next action;
- for an authorized update only: target, applied change, reconciliation handoff, and limitations.

Keep the Playbook model separate from runtime logs or claims that a stage actually ran. Give concise evidence-backed reasoning summaries rather than hidden chain-of-thought.

## Safety, permissions, and handoffs

- Default to a read-only proposal. `record_update` metadata routes post-change checks but never authorizes a live write.
- Do not invent participants, owners, authority, Tool availability, credentials, permissions, evidence, approvals, or successful execution.
- Do not duplicate or silently rewrite Persona, Skill, Tool, workflow, or Decision definitions inside the Playbook.
- Do not publish, execute, merge, grant access, install packages, or change live records without explicit authorization and a named target.
- Keep prototypes, drafts, and proposed Playbooks separate from current truth until the required decision and reconciliation pass occur.
- A Tool failure, missing participant, contradictory source, or interrupted stage is a visible state with a safe fallback, not a reason to continue as if it succeeded.
- If a dependency or downstream handoff is unavailable, report the exact gap and stop at the verified boundary.

## Focused validation

Before handoff, confirm:

- the outcome is reusable and the one-off/non-trigger boundary was considered;
- every stage has a purpose, owner, entry/exit, inputs, outputs, evidence, and handoff;
- shared state, artifact provenance, decision rights, gates, failure paths, and recovery are explicit;
- referenced components are stable identities and are not copied or assumed available;
- one representative and one boundary/failure case can be reasoned through;
- authorization, target, mutation scope, and one-time reconciliation handoff are explicit;
- no runtime execution or durable mutation was claimed without evidence.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/playbook-composer.golden.md).
