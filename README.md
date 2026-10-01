# Persona Library

This repository contains the source and generated output for the Persona Library Site.

## Human orientation

Persona-Library is the **system-knowledge repository** inside the wider Persona Workspace. It owns detailed Persona-system meaning, relationships, routing, documentation, Decisions, Playbooks, repository-local callable Skills, and the generated Site contract.

For the whole Workspace mental model—**Place → Work → Truth → Coordination**—start with [How Persona Workspace works](https://github.com/rickvang/persona-workspace/blob/main/docs/HOW-IT-WORKS.md). You do **not** need to understand route groups, activation metadata, reconciliation adapters, Operational Scenarios, or harness internals to decide where ordinary work belongs.

Use this repository's README, architecture, Guide, and agent instructions only when you need Persona-Library-specific detail.


## What is included

- `content/` — the authored persona, skill, operating pack, Template, tool, playbook, and orientation data.
- `client/` — shared browser state and rendering helpers.
- `scripts/` — the build and content-validation scripts.
- `dist/` — the generated, dependency-free Site, including all public pages, the Operating Packs and Templates catalogs, the focused Template viewer, and the onboarding guidance.
- `ARCHITECTURE.md` — the system boundary, source-of-truth rules, and maintenance invariants.
- `docs/job-search/implementation.md` — the job-search workspace scope and sequencing plan.
- `AGENTS.md` — the repository activation and orientation entry point.
- `content/site-orientation.json` — maintainer/agent machine-readable routing bootstrap; it is not required for basic human Workspace orientation.
- `content/orientation/` — selectively loaded agent/maintainer route groups keyed by the existing primary spaces.

## Documentation and placement

- docs/README.md — concise placement, lifecycle, and generated-output guidance.
- docs/playbooks/ — current reusable Playbook guidance.
- docs/internal/skill-rebuild/ — concise reconstruction history plus preserved golden/comparison evidence; completed implementation plans are not current guidance.
- docs/work-orders/ — active Work Order packages; terminal packages are archived below docs/work-orders/archive/YYYY-MM/.

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

Open `dist/index.html` directly in a browser, or serve the `dist` folder with any static web server. The Site has no package install or build dependency.

To regenerate and validate the generated output after changing source content:

```text
node scripts/build-library.mjs
node scripts/validate-content.mjs
```

To inspect the current isolated Persona–Skill matrix:

```text
node eval/isolated-persona-skill.mjs validate
node eval/isolated-persona-skill.mjs matrix --personas all --skills all
```

The `dist` directory is generated publishable Site output configured in `.openai/hosting.json`; never hand-edit it. Install the pinned build-only Markdown dependency with `npm ci --include=dev --ignore-scripts`, then rebuild from authored `content/`, `client/`, and published source docs with `node scripts/build-library.mjs`. Static Site page shells live in `content/site-pages/`. `content/site-publication.json` explicitly binds existing Playbook identities and selects current Docs for the catalogs, static readers, and map projection. Editing a selected source and rebuilding refreshes each surface; adding a document requires curation, not a custom page. Three existing job-search Markdown URLs under `dist/docs/` remain compatibility copies. No work archives, internal notes, or Prototyping content are automatically included.
