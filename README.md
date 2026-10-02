# Persona Library

This repository contains the source and generated output for the Persona Library Site.

## Human orientation

Persona-Library is the **system-knowledge repository** inside the wider Persona Workspace. It owns detailed Persona-system meaning, relationships, routing, documentation, Decisions, Playbooks, repository-local callable Skills, and the generated Site contract.

For the whole Workspace mental model—**Place → Work → Truth → Coordination**—start with [How Persona Workspace works](https://github.com/rickvang/persona-workspace/blob/main/docs/HOW-IT-WORKS.md). You do **not** need to understand route groups, activation metadata, reconciliation adapters, Operational Scenarios, or harness internals to decide where ordinary work belongs.

Use this repository's README, architecture, Guide, and agent instructions only when you need Persona-Library-specific detail.

## Find the right source

| What you want to do | Start here | Where to make the change |
| --- | --- | --- |
| Understand repository ownership and source-of-truth rules | [ARCHITECTURE.md](ARCHITECTURE.md) | The existing owner identified there |
| Find current guidance or decide where a document belongs | [Docs task index and placement guide](docs/README.md) | Its current canonical document |
| Update Persona or Skill catalog records | [Authored library data](content/library-data/) | The matching `personas-*.js` or `skills-*.js` record owner; [AGENTS.md](AGENTS.md) governs semantic changes |
| Update a Tool's catalog record or recipe | [tool-integration.js](content/library-data/tool-integration.js) | That record owner; reusable Tool instructions stay in tool-repo |
| Update a Playbook, Template, or Operating Pack catalog record | [catalogs.js](content/library-data/catalogs.js) | That catalog owner; reusable package files stay in their owning repositories |
| Update a published Playbook or reference document | [Docs task index](docs/README.md) and [publication bindings](content/site-publication.json) | The bound Markdown source; rebuild to refresh catalogs, readers, and map data |
| Change page presentation or map interactions | [Site authoring guide](content/site-pages/README.md) | The named page shell in `content/site-pages/` and relevant shared module in `client/` |
| Change a repository-local callable Skill | [Local Skill packages](.agents/skills/) | The selected package's `SKILL.md` and its referenced supporting files |
| Fix build or validation plumbing | [Build script](scripts/build-library.mjs) and [CI check list](.github/workflows/repository-validation.yml) | The existing script, validator, or focused test |

For portable Skill packages, reusable Tool instructions, Operating Packs, and Template starter files, use the [workspace repository map](https://github.com/rickvang/persona-workspace/blob/main/REPOSITORIES.md) to enter the owning repository. Catalog edits here do not automatically modify or install those external packages.

The Site and map describe the system's recorded structure and documented processes. They do not prove that a particular conversation loaded a record or followed a workflow; that claim needs observed execution evidence.

## What is included

- `content/` — the authored persona, skill, operating pack, Template, tool, playbook, and orientation data.
- `client/` — shared browser state and rendering helpers.
- `scripts/` — the build and content-validation scripts.
- `dist/` — the generated, dependency-free Site, including all public pages, the Operating Packs and Templates catalogs, the focused Template viewer, and the onboarding guidance.
- `ARCHITECTURE.md` — the system boundary, source-of-truth rules, and maintenance invariants.
- `docs/playbooks/evidence-led-job-search.md` - the job-search process, workspace scope, and sequencing plan.
- `AGENTS.md` — the repository activation and orientation entry point.
- `content/site-orientation.json` — maintainer/agent machine-readable routing bootstrap; it is not required for basic human Workspace orientation.
- `content/orientation/` — selectively loaded agent/maintainer route groups keyed by the existing primary spaces.

## Documentation and placement

- [docs/README.md](docs/README.md) — task index, placement, lifecycle, and generated-output guidance.
- [docs/playbooks/](docs/playbooks/) — current reusable Playbook guidance; the Docs index also routes to collaboration and domain-owned processes.
- [docs/internal/skill-rebuild/](docs/internal/skill-rebuild/) — concise reconstruction history plus preserved golden/comparison evidence; completed implementation plans are not current guidance.
- [docs/work-orders/README.md](docs/work-orders/README.md) — active Work Order index; terminal packages live below `docs/work-orders/archive/YYYY-MM/`.

## Work tracking

- docs/work-orders.md — repository-wide active-work packet and progress-record convention.
- docs/work-orders/ — default repository home for non-trivial Work Order packages.
- docs/ux/ — Expert UX practice, Work Order, IA-to-UI traceability, project-context routing, and design references.
- docs/ux/project-context-and-reference-routing.md — project-aware routing method.
- docs/ux/project-context-template.md — project-scoped profile and evidence packet.
- docs/ux/design-reference-library.md — curated sources, examples, and failure exhibits.
- docs/job-search/ — Application packet Work Order and ATS/human version contract.
- `.agents/skills/` — repository-local callable Skill packages; each package declares its change contract and routing layer in `SKILL.md` frontmatter.
- eval/ — file-based conformance fixtures, normalized result checks, recorded-result and opt-in usage adapters, isolated Persona–Skill matrix, context estimation/reporting, and sanitized observation evidence. It does not make provider requests or imply that a runtime exposes usage; exact telemetry is accepted only when returned directly.

## Run locally

The generated Site has no runtime package dependency. Serve `dist/` with a static HTTP server and open its local URL. Module- and fetch-based pages, including the map and source projections, need HTTP; opening an HTML file directly is not a reliable way to exercise the whole Site.

Rebuilding requires Node.js 20 or newer and the pinned build-only Markdown parser. From this repository's Git root, install before building:

```text
npm ci --include=dev --ignore-scripts
node scripts/build-library.mjs
node scripts/validate-content.mjs
```

For completion, run the affected validation tests and the remaining gates in [repository-validation.yml](.github/workflows/repository-validation.yml). That workflow is the executable check list, including generated-output freshness; the commands above are the basic build and content checks.

To inspect the current isolated Persona–Skill matrix:

```text
node eval/isolated-persona-skill.mjs validate
node eval/isolated-persona-skill.mjs matrix --personas all --skills all
```

The `dist` directory is generated publishable Site output configured in `.openai/hosting.json`; never hand-edit it. Rebuild from authored `content/`, `client/`, and published source docs. [content/site-publication.json](content/site-publication.json) explicitly binds existing Playbook identities and selects current Docs for catalogs, static readers, and map data. Editing a selected source and rebuilding refreshes those surfaces; a newly authored document needs an explicit publication selection. See the [Site authoring guide](content/site-pages/README.md) for page shells, generated readers, and compatibility copies. Work archives, internal notes, and Prototyping content are not automatically selected as published references.
