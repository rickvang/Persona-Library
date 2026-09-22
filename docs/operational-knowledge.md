# Operational knowledge contract

## Purpose

Operational knowledge turns abstract guidance such as “batch calls,” “use the simplest architecture,” or “validate at the cheapest layer” into concrete, reusable examples of what good and bad execution look like.

The canonical records are `operationalScenarios` in `content/library-data/operational-knowledge.js`. They are **relationships owned by an existing Skill or Tool-use recipe**, not a new top-level Persona-Library space.

## Ownership boundary

- **Persona** — who applies judgment.
- **Skill** — reusable judgment and quality model.
- **Operational Scenario** — concrete good/bad execution example, routing cues, freshness/stop/recovery rules, and evidence state for an existing owner.
- **Tool-use recipe** — capability-to-Tool procedure, permission/fallback boundary, and vendor-specific action path.
- **Operating Pack** — project/domain-specific rules that may narrow generic practice.
- **Playbook** — multi-stage, multi-participant coordination and quality gates.
- **Tool** — actual execution capability and runtime-dependent availability.

An Operational Scenario never grants permission, changes source authority, or creates a new Skill/Tool identity.

## Smallest relevant context

1. Resolve the task to the Persona / Skill / Tool-use recipe that owns the decision or execution.
2. Load active Operational Scenarios attached to that owner.
3. Match the task against scenario phrases, keywords, situation, and route.
4. Prefer one primary scenario; add another only for a distinct material boundary.
5. Load a relevant Operating Pack when project/domain context narrows the generic scenario.
6. Stop retrieving when the selected owner + scenario + local context answer the execution question.

Do not load the whole scenario catalog for every task.

`window.PersonaLibraryModel.findOperationalScenarios(query, options)` provides lightweight deterministic matching and owner filters.

## Precedence and safety

Operational Scenarios are guidance, not authority. Precedence is: explicit requester scope/authorization → repository/system contract and current source of truth → applicable Operating Pack → canonical Skill or Tool-use recipe → matching Operational Scenario → generic fallback practice.

Volatile runtime exposure, permissions, branch/check/review state, deployment status, and similar facts still refresh at their declared freshness boundaries.

## Evidence lifecycle

- **Usage note** — one observed attempt; not shared guidance by itself.
- **Candidate** — plausible reusable lesson awaiting review.
- **Reviewed** — accepted with stated scope and evidence.
- **Validated** — repeated evidence or explicit validation supports broader reuse.

A run never silently promotes itself into reviewed or validated guidance.

## Relationship to existing `.golden.md` files

Files under `docs/internal/skill-rebuild/tests/*.golden.md` are focused test fixtures for callable Skill packages. They remain validation examples, not the canonical operational knowledge store or a general agent knowledge base.

## Change and reconciliation

Confirm the owner, keep vendor procedure in Tool-use recipes, project conventions in Operating Packs, cross-role coordination in Playbooks, evidence state conservative, relationships/retrieval validated, and reconciliation complete.

Create a new top-level space only if scenario volume, lifecycle, retrieval, or user navigation can no longer be expressed coherently as relationships to existing owners.
