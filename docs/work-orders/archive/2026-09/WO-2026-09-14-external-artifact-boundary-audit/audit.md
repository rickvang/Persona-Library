# Persona-Library external artifact boundary audit

- Issue: [#60](https://github.com/rickvang/Persona-Library/issues/60)
- Work Order: [WO-2026-09-14-external-artifact-boundary-audit](work-order.md)
- Audit date: 2026-09-13
- Scope: post-#69 `main`, current authored records and packages, and live candidate/reference repositories inspected through GitHub
- Outcome: confirm established boundaries; recommend a hybrid boundary for portable Skill packages as a future incremental option; keep Tool knowledge and runtime semantics internal until actual implementation artifacts exist

## Decision summary

| Space | Classification | Current decision |
| --- | --- | --- |
| Personas | Keep fully internal | Confirmed. Identity, context, workflows, relationships, evidence, and lifecycle belong in Persona-Library. |
| Skills | Hybrid candidate | Keep Skill identity, judgment, applicability, relationships, evidence, and lifecycle internal. A portable callable package may live in `rickvang/SkillRepo` when its independent reuse and maintenance contract is verified. Do not migrate the current package set in this audit. |
| Operating Packs | Hybrid, established | Confirmed. Persona-Library catalogs and relates the pack; `rickvang/operating-packs` owns reusable Markdown artifacts. |
| Templates | Hybrid, established | Confirmed. Persona-Library catalogs and relates the Template; `rickvang/template-library` owns reusable starter artifacts. |
| Tools | Keep internal for now; hybrid only if implementation appears | Current evidence shows Tool requirements and recipes, but no canonical Tool-record data or substantial implementation in `rickvang/tool-repo`. Preserve Tool runtime and permission semantics internally. |
| Playbooks | Keep fully internal | Current records are orchestration models; no independent executable artifact boundary was found. |
| Docs | Keep fully internal | Docs describe current truth, instructions, and boundaries; no independent external artifact lifecycle is needed. |
| Decisions | Keep fully internal | Decisions preserve rationale, tradeoffs, affected surfaces, and revisit conditions. |
| Prototyping | Keep fully internal | Prototypes are isolated experiments and must remain separate from live records until explicit promotion. |
| Work Orders | Keep fully internal | Work Orders are scoped progress and evidence packets for this repository’s work. |

The audit recommends no migration and no new repository. Only the Skill package boundary merits a future focused implementation decision, and even there the evidence supports incremental package publication rather than moving the current catalog or bulk-migrating `.agents/skills/`.

## Personas — keep fully internal

Current classification: confirmed internal.

Current evidence: the repository models 20 Personas with role context, operating state, workflow maps, activities, Skill applications, Tool requirements, evidence, confidence, priorities, and handoffs. Mara’s own architecture workflow treats identity, concept placement, relationships, and retrieval as library responsibilities.

Persona-Library owns the complete canonical Persona record, its workflow and activity context, relationship graph, evidence status, revision history, and the decision about when the Persona applies. No candidate external repository contains Persona artifacts, and there is no independent reusable artifact lifecycle to justify one.

Canonical source contract: none beyond the existing Persona record and relationship model.

Relationships and reconciliation: Persona changes continue through Persona-specific reconciliation and one universal impact pass when the initiating contract requires it. No external source reconciliation is needed.

Do not extract role identity, lifecycle context, workflow maps, evidence, priorities, Skill applications, or Tool requirements merely because they may be consumed by an external package.

Confidence: high. Unresolved question: none material to this audit.

## Skills — hybrid candidate, no migration now

Current classification: hybrid candidate for portable callable implementation packages; canonical Skill knowledge remains internal.

Current evidence: Persona-Library contains 20 local Skill package directories under `.agents/skills/`, including `SKILL.md`, runtime metadata, and supporting references. The live [`rickvang/SkillRepo`](https://github.com/rickvang/SkillRepo) describes itself as a repository for Skills and LLM variations and currently contains one package, [`codex/primitives/open-new-chat/SKILL.md`](https://github.com/rickvang/SkillRepo/blob/main/codex/primitives/open-new-chat/SKILL.md), with `agents/openai.yaml`. This proves a real external package shape, but the repository is still sparse and no migration/adoption contract for the current local packages is documented.

Persona-Library owns Skill identity and purpose, triggers, applicability, reusable judgment, quality signals, Persona and workflow relationships, Tool-use relationships, lifecycle, evidence, revision context, and the decision to reuse or form a Skill. A future external Skill repository may own portable package artifacts such as `SKILL.md`, runtime metadata, examples, scripts, tests, and runtime-specific packaging when those artifacts have an independently maintained lifecycle.

Minimum source contract for a future hybrid record:

```text
repository: rickvang/SkillRepo
path: <skill-package-path>
entrypoint: SKILL.md
revision: <verified Git commit>
availability: repo_local | documentation_only | unavailable | planned
verification: path, entrypoint, package contents, and boundary evidence
```

Relationships and reconciliation: a package move or revision change must reconcile the Skill route/package path, Persona applications, workflow reach, Tool-use recipes, Playbook references, generated Site output, and any package conformance fixtures. A package being externally hosted must not change the canonical Skill identity or imply runtime availability.

Migration implication: no migration is justified now. Keep the current local packages and route paths stable. Open a focused implementation issue only when a package set, ownership decision, publication workflow, and validation contract are agreed. Migrate package-by-package with pinned revisions; do not create a bulk mirror or synchronization layer.

Do not extract Skill identity, reusable judgment, triggers, quality model, Persona/workflow relationships, evidence, or Tool permission semantics into the external repository as the canonical source.

Confidence: medium-high for the boundary direction; medium for the future repository target because the candidate contains only one small package.

## Operating Packs — hybrid, established

Current classification: confirmed hybrid.

Current evidence: the canonical record `operating-pack-design-system` points to `rickvang/operating-packs/packs/design-system/AGENTS.md`. Live inspection found the repository architecture and README plus a real Design System pack with `AGENTS.md`, architecture, tokens, components, accessibility, testing, and workflows, backed by repository validation scripts/tests.

Persona-Library owns pack identity, purpose, applicability, relationships to Personas, Skills, workflows, Tools, and Playbooks, source and revision evidence, availability state, and lifecycle. The external repository owns the reusable Markdown pack files, pack-local instructions, references, workflows, and validation guidance.

Canonical source contract:

```text
repository: rickvang/operating-packs
path: packs/<pack-id>
entrypoint: AGENTS.md
revision: <verified Git commit>
availability: documentation_only until current runtime access is separately verified
verification: path, entrypoint, and pack-local boundary evidence
```

Relationships and reconciliation: path, entrypoint, scope, authority, or lifecycle changes require reconciliation of affected Persona, Skill, workflow, Playbook, Tool-use, Template, Docs, and generated references. No redesign or migration is needed.

Do not move Persona identity, portable Skill judgment, Tool permissions, Playbook orchestration, or project-specific implementation state into a pack.

Confidence: high.

## Templates — hybrid, established

Current classification: confirmed hybrid.

Current evidence: the canonical catalog contains four Template records. Live [`rickvang/template-library`](https://github.com/rickvang/template-library) contains three real Template paths with README entrypoints and `starter/` boundaries: Web App Design System, Resume Document Design System, and Classic Single-Column Resume. The planned Multi-Product Design System record remains correctly unverified because its path is absent from the current external tree.

Persona-Library owns Template identity, purpose, applicability, Persona/Skill/workflow relationships, Operating Pack and Playbook relationships, provenance, evidence, lifecycle, and source/runtime/viewer display states. The external repository owns reusable starter files, scaffold structure, examples, and artifact-specific documentation.

Canonical source contract:

```text
repository: rickvang/template-library
path: templates/<category>/<template-id>
entrypoint: README.md
revision: <verified Git commit>
availability: documentation_only until runtime access is separately verified
verification: path, entrypoint, starter boundary, and artifact evidence
```

Relationships and reconciliation: path, entrypoint, starter boundary, lifecycle, or source evidence changes require Template-specific reconciliation and one universal impact pass when required. No migration is needed; the established boundary should be preserved.

Do not move professional judgment, Operating Pack rules, Tool permissions, Playbook orchestration, candidate evidence, or project output into a Template artifact.

Confidence: high.

## Tools — keep internal for now; hybrid only with real implementation evidence

Current classification: no change yet; a future hybrid boundary remains conditional.

Current evidence: the authored data contains 13 Persona Tool requirements and 13 Tool-use recipes, and the Site Tools page presents seven tool cards and recipe relationships. The current data module does not expose a standalone `toolCatalog` or canonical Tool-record array. The live [`rickvang/tool-repo`](https://github.com/rickvang/tool-repo) contains only a README stating that it is for Tool definitions; no adapters, integration code, SDK wrappers, executable connectors, harnesses, or runtime package artifacts were found.

Persona-Library owns Tool identity and capability descriptions, scope and applicability, availability/runtime-access distinctions, permission and approval context, Persona/Skill/Playbook relationships, Tool-use recipes, reviewed usage evidence, and source pointers. If a future external repository contains independently maintained adapters or executable packages, it may own those implementation artifacts while these semantics remain internal.

Conditional source contract if evidence changes:

```text
repository: rickvang/tool-repo
path: <adapter-or-package-path>
entrypoint: <documented manifest or README>
revision: <verified Git commit>
availability: documentation_only until runtime capability is verified
verification: implementation path, boundary, and safe-use evidence
```

Relationships and reconciliation: any future implementation boundary must preserve explicit capability, scope, permission, approval, fallback, verification, and runtime-availability semantics. Source changes would reconcile Tool-use recipes, Persona requirements, Skill relationships, Playbooks, generated Site pages, and usage evidence.

Migration implication: no change now. Do not move the current Tool requirements or recipes into `tool-repo`, and do not treat the candidate repository name or README as proof of an implementation boundary.

Do not extract credentials, secrets, user-specific access, live authorization state, or the distinction between documented capability and actual runtime availability.

Confidence: high for the no-change decision; low for future external implementation because no such artifact currently exists.

## Playbooks — keep fully internal

Current classification: confirmed internal.

Current evidence: the repository has two Playbook identities, including the evidence-led job search and reusable Skill integration models. Their value is orchestration: stages, participants, handoffs, shared state, decision rights, quality gates, recovery, and learning. No external executable or independently versioned Playbook artifact was found or required.

Persona-Library owns Playbook identity, outcome, participants, stages, handoffs, shared context, decision rights, quality gates, recovery, learning, and relationships to Personas, Skills, Tools, Operating Packs, Templates, and Docs.

Canonical source contract: none beyond the internal Playbook record and Work Order/problem-context artifacts used by a run.

Relationships and reconciliation: Playbook changes reconcile all named participants, dependencies, shared state, quality gates, source contracts, and downstream outputs.

Do not create an external Playbook repository for taxonomy symmetry or move orchestration into a package artifact without evidence of an independent executable lifecycle.

Confidence: high.

## Docs — keep fully internal

Current classification: confirmed internal.

Current evidence: `AGENTS.md`, `ARCHITECTURE.md`, README, Guide pages, orientation bootstrap/route groups, and current Work Orders describe the system’s current truth, boundaries, and entry paths. #69 established selective loading for these repository-local contracts.

Persona-Library owns current definitions, instructions, route contracts, architecture explanations, examples, and onboarding. External references can be cited as evidence, but they do not become canonical Docs merely because they are useful.

Canonical source contract: repository-local source paths and generated `dist/` copies as already defined by the build system.

Relationships and reconciliation: update current Docs and generated output when current architecture changes; preserve historical records unless they contain current instructions that must be superseded.

Do not externalize current truth, repository activation, route contracts, or validation rules for symmetry.

Confidence: high.

## Decisions — keep fully internal

Current classification: confirmed internal.

Current evidence: Decisions preserve choices, rationale, alternatives, affected surfaces, status, and revisit conditions for this library. External repositories can provide source evidence or their own local architecture, but they do not own Persona-Library’s cross-space rationale.

Persona-Library owns durable architecture decisions and supersession history. An external repository owns only decisions about its own artifacts and repository operation.

Canonical source contract: existing internal Decision record/location conventions.

Relationships and reconciliation: a changed decision must link affected Docs, records, prototypes, Work Orders, and source contracts and preserve the prior rationale.

Do not copy external repository architecture history into the canonical library or rewrite the library’s decision history to mirror it.

Confidence: high.

## Prototyping — keep fully internal

Current classification: confirmed internal.

Current evidence: current prototypes are isolated persona, layout, contract, and workflow-canvas experiments. Their value is reversible exploration before promotion. No independently reusable external artifact lifecycle is required by the current prototypes.

Persona-Library owns prototype identity, isolation, test scenarios, observed behavior, open questions, selection status, and promotion gates. A promoted artifact can later be placed through the normal creation gate; promotion is not externalization by default.

Canonical source contract: existing `proto-*` records and repository-local prototype files.

Relationships and reconciliation: prototype promotion requires a deliberate change set and downstream reconciliation; archived prototypes leave live records unchanged.

Do not make live records depend on prototype artifacts or create a prototype repository merely to host reversible experiments.

Confidence: high.

## Work Orders — keep fully internal

Current classification: confirmed internal.

Current evidence: Work Orders are the repository’s project-scoped active-work packets with authorization boundaries, evidence, gate results, handoffs, blockers, and next actions. This audit itself uses that existing home.

Persona-Library owns the Work Order index and package, while GitHub issues or pull requests track implementation status externally as coordination surfaces. A GitHub issue is not a replacement for the Work Order’s evidence or authorization record.

Canonical source contract: `docs/work-orders/<work-order-id>/work-order.md` plus linked specialized artifacts.

Relationships and reconciliation: update the Work Order as scope, evidence, gate, handoff, or next action changes; link focused implementation issues without duplicating their code-plan content.

Do not move authorization constraints, evidence ledgers, or active-work state into a generic external artifact repository.

Confidence: high.

## Cross-space implications for #70

- #70 should consume this audit’s Skill and Tool decisions rather than repeat the externalization question.
- The next Skill-focused implementation issue, if one is opened, should first define package ownership, source verification, pinned revisions, package validation, generated/reference consumers, and incremental migration boundaries.
- The next Tool-focused issue should first establish whether a canonical Tool-record source is needed in Persona-Library; it should not infer one from the empty candidate `tool-repo`.
- Operating Pack and Template implementations should preserve their existing hybrid source contracts and continue to distinguish source verification from runtime access.
- No registry, synchronization layer, installer, package manager, or new domain concept is justified by this audit.

## Evidence limits

- GitHub live inspection established the current visible trees and README/architecture contracts of the four candidate/reference repositories. Private repository access and current branch contents were available through the connected GitHub plugin; runtime use of any artifact was not tested.
- The current Persona-Library data module has explicit Tool requirements and Tool-use recipes but no standalone canonical Tool catalog object; the Site Tool cards are static current presentation material. This is an observed schema gap, not a reason to create a new external Tool repository.
- The audit does not measure reuse frequency, maintainer capacity, package release cadence, or runtime adoption. Those are prerequisites for a future Skill package migration decision.
