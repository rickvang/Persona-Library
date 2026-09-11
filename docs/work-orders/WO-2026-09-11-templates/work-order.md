# Templates first-class library space Work Order

- Work Order ID: WO-2026-09-11-templates
- Title: Add Templates as a first-class library space with a distinct ownership boundary
- Status: complete; PR #61 open for review
- Created: 2026-09-11
- Last updated: 2026-09-11
- Requester: repository user
- Current owner: Codex
- Request mode: update
- GitHub issue: #62 — [Track Templates first-class library implementation](https://github.com/rickvang/Persona-Library/issues/62)
- Artifact home: `docs/work-orders/WO-2026-09-11-templates/`

## Tracking history

- Initial implementation was recorded with issue tracking pending because the environment did not expose a GitHub issue CLI or connector.
- Focused issue [#62](https://github.com/rickvang/Persona-Library/issues/62) now owns the implementation plan, scope, status, and next actions; PR #61 is the implementation vehicle.

## Outcome

Persona-Library now catalogs reusable starting artifacts as Templates beside Personas, Skills, Operating Packs, Tools, Playbooks, Docs, Decisions, and Prototyping. The library owns Template identity, applicability, relationships, source metadata, evidence, lifecycle context, and revision context; the reusable artifact remains in its canonical external or project source.

## Scope

- Add the Templates space to `content/site-orientation.json`, with proposal-first research, composition, and reconciliation routes.
- Add canonical `templates` source data and normalized `templateCatalog` data through `content/library-model.js`.
- Validate scoped Persona–Skill–workflow applications as actual relationships, plus source/path, Operating Pack, Playbook, prototype, placeholder, and generated-data invariants.
- Add `$template-research`, `$template-composer`, and `$template-reconciliation`.
- Add `dist/templates.html`, update Site navigation and Docs, and append the durable IA rationale to the Decisions archive.
- Seed three planned design-system Template identities after inspecting `rickvang/template-library`.

## Placement review

Mara Okoye’s knowledge-systems placement gate is recorded in [ia.md](ia.md). Templates are a new first-class space because starting artifacts have a stable identity, applicability, source boundary, lifecycle, evidence, and cross-space relationships that cannot be reduced to a Skill, Operating Pack, Tool-use recipe, Playbook, Doc, or project Work Order. The actual artifact stays outside Persona-Library.

## External source evidence

- Repository: `rickvang/template-library`
- Branch: `main`
- Revision inspected: `f88a4011902b58b2f192305f5a731f1a71263965`
- Observed tree: `README.md` only
- Proposed paths checked: `templates/design-systems/resume-document`, `templates/design-systems/web-app`, and `templates/design-systems/multi-product`
- Entrypoint result: no Template artifact entrypoint exists at any proposed path; each seed keeps `entrypoint: null`, while root `README.md` is recorded separately as the repository documentation entrypoint
- Catalog state: all three seeds are `Planned external reference` with `availability: planned`, `path: null`, and `entrypoint: null`

## Non-goals and constraints

- Do not copy, vendor, fetch, sync, install, clone, render, execute, publish, or upgrade external Template artifacts.
- Do not create Template Family, Variant, Platform, Distribution, Version, or package-manager concepts.
- Do not make Templates depend on Operating Packs by definition, grant Tool permissions, or own Skill judgment or Playbook orchestration.
- Do not attach every Template globally to a Persona; applicability remains scoped to a task/workflow relationship.
- Preserve unrelated working-tree changes already present in the repository.

## Validation and reconciliation

The implementation and review fixes were built and validated with the required commands. Focused checks cover invalid Persona–Skill–workflow relationships, unknown Operating Pack and Playbook references, duplicate Template IDs, local entrypoints that escape their declared source directory, valid nested local entrypoints, external repo-local availability, planned artifact entrypoint handling, prototype identity leakage, and Template fragment selection. The Template adapter and one universal change-impact review are recorded in [reconciliation.md](reconciliation.md).

## Current phase and next action

Phase: implementation, review fixes, validation, and reconciliation complete. Next action: merge PR #61 after current-head checks and review state are green; no external Template artifact is ready for reuse until a later source verification finds a real path and entrypoint.
