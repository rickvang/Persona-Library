# External artifact boundary audit Work Order

- Work Order ID: WO-2026-09-14-external-artifact-boundary-audit
- Title: Audit Persona-Library boundaries for external artifact libraries
- Status: complete
- Created: 2026-09-13
- Last updated: 2026-09-13
- Requester: repository user
- Current owner: Codex
- Explicit collaborator: Mara Okoye, knowledge systems architect
- Request mode: research
- GitHub issue: [#60 — Audit Persona-Library boundaries for external artifact libraries](https://github.com/rickvang/Persona-Library/issues/60)
- Artifact home: `docs/work-orders/WO-2026-09-14-external-artifact-boundary-audit/`

## Goal

Produce a current, evidence-backed ownership map for the major Persona-Library spaces and candidate external artifact repositories. Record what Persona-Library owns, what an external repository would own when justified, the smallest source contract, and the migration/reconciliation implications without migrating content or creating repositories.

## Scope

- Reinspect the post-#69 Persona-Library architecture and current authored data.
- Audit Personas, Skills, Operating Packs, Templates, Tools, Playbooks, Docs, Decisions, Prototyping, and Work Orders.
- Inspect the live candidate/reference repositories `rickvang/SkillRepo`, `rickvang/tool-repo`, `rickvang/operating-packs`, and `rickvang/template-library` through GitHub.
- Record the boundary audit in [`audit.md`](audit.md) for #70 and any later focused implementation issue.

## Non-goals and constraints

- Do not migrate content, create repositories, or change external repositories.
- Do not add a registry, installer, package manager, synchronization service, database, runtime dependency, or new first-class domain concept.
- Do not move canonical identity, applicability, relationships, evidence, lifecycle context, permissions, or runtime-availability semantics out of Persona-Library.
- Prefer no change when independent reuse, maintenance, or versioning evidence is weak.

## Authorization and boundary

The repository user explicitly authorized implementation of issue #60. The issue authorizes a read-and-record architecture audit only. It authorizes this Work Order and linked audit document in the existing `docs/work-orders/` home; it does not authorize artifact migration, new repository creation, external writes, or schema changes.

## Placement and boundary review

Mara Okoye’s placement review was performed from her canonical Persona record, the `docs` route group, `docs/work-orders.md`, and the `creation_gate` in `content/site-orientation.json`.

- Finding: this deliverable is a scoped architecture audit and belongs as a specialized `audit.md` artifact indexed by its Work Order under `docs/work-orders/`. It does not create a new Persona-Library space, canonical domain record, source registry, or external repository.
- Selected placement: keep the Work Order as the active coordination/index record and place the evidence-backed boundary map in the same package.
- Rejected alternative: add a new top-level `boundaries` or `external-artifacts` space. That would create a new domain concept for an audit concern already covered by Docs, Decisions, Work Orders, and source fields.
- Rejected alternative: create a new canonical registry or synchronization record. The existing Operating Pack and Template source contracts already represent verified external ownership without a registry or runtime dependency.
- Rejected alternative: write directly into canonical Skill or Tool records. The audit recommends future boundaries and must not silently promote a candidate repository or invent missing Tool records.
- Boundary result: placement is clear; the review does not authorize migration or external mutation.

## Baseline evidence

- Post-#69 bootstrap: `content/site-orientation.json` is schema `2.0` and routes the audit through the Docs space and cross-space reconciliation contract.
- Current authored data contains 20 Personas, 20 workflow maps, 4 canonical Template records, 1 Operating Pack record, 2 Playbook identities, 13 Tool-use recipes, and 13 Persona Tool requirements. The data module has no standalone `toolCatalog` or canonical Tool-record array; the Tools Site surface contains seven static catalog cards plus the recipe and requirement projections.
- The repository contains 20 local Skill package directories under `.agents/skills/`, with package contracts, runtime metadata, and supporting references.
- Live GitHub evidence: `rickvang/SkillRepo` contains one `codex/primitives/open-new-chat/SKILL.md` package and its `agents/openai.yaml`; `rickvang/tool-repo` contains only `README.md`; `rickvang/operating-packs` contains a validated `packs/design-system/` Markdown pack plus repository scripts/tests; `rickvang/template-library` contains three Template paths with README and starter boundaries.
- External repository state was inspected through the GitHub plugin on 2026-09-13. Repository existence, permissions, or a README alone do not establish runtime availability or justify migration.

## Success criteria

- Every required space has an explicit keep, confirmed hybrid, hybrid candidate, or no-change classification.
- Skills and Tools have evidence-backed decisions that distinguish current local material from candidate external implementation artifacts.
- Established Operating Pack and Template boundaries are confirmed without reopening them.
- Each proposed hybrid boundary states the continuing Persona-Library ownership and minimum source contract.
- Migration and reconciliation implications are recorded while no migration is performed.
- The audit is clear enough for #70 or a later focused issue to consume without repeating this architecture question.

## Current phase and next action

Phase: current-state inspection, live candidate-repository inspection, Mara placement review, audit, validation, and reconciliation complete.

Next action: commit and push the audit package, close #60, and hand any justified implementation follow-up to #70 or a new focused issue.

## Evidence and limitations

GitHub repository contents are direct live observations through the connected GitHub plugin. Persona and architecture interpretations are repository evidence; Mara’s perspective is a synthetic canonical Persona record. Tool runtime availability, credentials, permissions, and undocumented external consumers remain unknown. No external artifacts were copied, executed, or modified.
