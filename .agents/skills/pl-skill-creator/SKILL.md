---
name: pl-skill-creator
description: Create, update, evaluate, and package portable Agent Skills across agent runtimes while preserving Persona Library boundaries.
metadata:
  skill_layer: library_management
  change_mode: artifact_generation
  change_domain: skill-packages
  reconciliation: change-impact-reconciliation
---

# PL Skill Creator

## Role

Create or maintain a callable Skill package from an approved, reusable capability definition. This is the Persona Library's package-authoring layer for Skills intended to work across agent runtimes. It keeps the reusable Skill separate from Persona applications, workflows, and Tool-use recipes.

Use `pl-skill-creator` as the repository package ID and `PL Skill Creator` as the display name. `PL-Skill-Creator` is a documentation alias. Reserve `$skill-creator` for Codex's bundled package-authoring helper.

## Use this Skill when

- creating or updating a standalone callable Skill package;
- converting a bounded capability brief into `SKILL.md` and supporting resources;
- validating triggering, behavior, packaging, evaluation, or distribution readiness for a Skill.

Do not use it for discovering Persona capabilities (`persona-skills`), forming a capability from several Persona perspectives (`multi-perspective-skill-synthesis`), composing a multi-stage Playbook, executing a Tool, changing credentials or permissions, or writing one-off task instructions.

## Required preflight

1. Read the orientation manifest and repository contract. Identify the request mode, target package, authorization, success criteria, and affected surfaces.
2. Check the existing package, routes, aliases, capability catalog, related workflows, Tool-use recipes, and current runtime requirements before proposing a new identity.
3. Separate the canonical reusable capability from Persona-specific applications, workflow methods, and Tool recipes.
4. For a new durable package, file, or reference, run the Mara placement and boundary gate before mutation. The gate chooses the destination; it does not grant write authority.
5. Build a compact context packet containing the outcome, examples, constraints, target runtime(s), permissions, evidence, and validation plan.

## Operating procedure

1. **Frame the outcome.** State the concrete job, users, inputs, constraints, expected outputs, and what success makes inspectable.
2. **Resolve reuse and modularity.** Reuse an existing package or identity when it covers the job. Otherwise classify the proposed unit as a primitive, composed Skill, Persona application, workflow method, Tool-use recipe, reference, or new package.
3. **Define the Skill contract.** Record the purpose, boundary, triggers, inputs, prerequisites, decisions, observable actions, outputs, feedback, residual artifacts, quality signals, failure modes, and permission limits.
4. **Set the package target.** Record the intended agent runtime(s) and apply only the package conventions required by the requested target. Keep one Skill identity and one core workflow.
5. **Design the package.** Keep essential routing and workflow in `SKILL.md`; add references, scripts, or assets only when they materially improve repeatable work. Use progressive disclosure.
6. **Author the package.** Preserve user intent and scope. Keep automatic discovery enabled unless explicit-only invocation was requested. Do not turn documentation about a runtime into a claim that the runtime is configured or available.
7. **Validate and evaluate.** Run structural validation, then test positive and negative triggering, realistic outputs, edge cases, fallbacks, permissions, and regression cases for the requested runtime(s).
8. **Integrate and reconcile.** With authorization, update the package and source-of-truth route or documentation. Build generated output when source content changes, run repository validation, and perform the required change-impact reconciliation.

Use the operating procedure above as the consolidated process map. Keep runtime-specific details in the package only when they are required for the requested Skill to work.

## Output contract

Return the outcome, mode, authorization, canonical package ID and aliases, chosen artifact boundary, files created or changed, validation and evaluation evidence, limitations, unresolved questions, reconciliation status, and the smallest next action.

For a proposal, do not mutate live records or packages. For an authorized update, report changed and checked-unchanged scope separately.

## Safety and boundaries

- Never treat a Skill record, URL, issue, or documentation page as proof that a package, Tool, credential, permission, or runtime is available.
- Do not install, publish, send external messages, grant access, configure credentials, or change runtime settings unless separately authorized.
- Do not copy Persona-specific judgment into the portable package.
- Do not hand-edit generated `dist/` data; update its source and run the build.
- Keep tests and generated evaluation artifacts isolated from live library records.
