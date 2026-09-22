# Operational knowledge contract

## Purpose

Operational knowledge turns abstract guidance such as “batch calls,” “use the simplest architecture,” or “validate at the cheapest layer” into concrete, reusable examples of what good and bad execution look like.

The canonical scenario bodies live one-per-file under `content/library-data/operational-scenarios/`. `index.json` in that directory is the small routing manifest. The scenario records remain **relationships owned by an existing Skill or Tool-use recipe**, not a new top-level Persona-Library space.

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
2. Read `content/library-data/operational-scenarios/index.json`. This is the routing surface; it contains only ID, title, owner, status, match hints, and the body path.
3. Match the task against the index entry's owner and `match` hints.
4. Load only the selected scenario file from its declared `path`.
5. Prefer one primary scenario; load another body only when it covers a distinct material boundary.
6. Load a relevant Operating Pack when project/domain context narrows the generic scenario.
7. Stop retrieving when the selected owner + scenario + local context answer the execution question.

Do not fetch every scenario body in order to choose one.

The build still combines all scenario bodies into `dist/data/library-data.js` for browser/runtime use. That generated bundle is not the agent retrieval surface. `window.PersonaLibraryModel.findOperationalScenarios(query, options)` provides lightweight deterministic matching for consumers that already loaded the generated runtime model.

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
