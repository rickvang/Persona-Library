# Persona Library

This repository contains the source and generated output for the Persona Library Site.

## What is included

- `content/` — the authored persona, skill, operating pack, Template, tool, playbook, and orientation data.
- `client/` — shared browser state and rendering helpers.
- `scripts/` — the build and content-validation scripts.
- `dist/` — the generated, dependency-free Site, including all public pages, the Operating Packs and Templates catalogs, and the onboarding guidance.
- `ARCHITECTURE.md` — the system boundary, source-of-truth rules, and maintenance invariants.
- `JOB_SEARCH_IMPLEMENTATION.md` — the job-search workspace scope and sequencing plan.
- `AGENTS.md` — the repository activation and orientation entry point.
- `content/site-orientation.json` — the machine-readable request, space, Skill-layer, artifact, and mutation routing map.

## Work tracking

- docs/work-orders.md — repository-wide active-work packet and progress-record convention.
- docs/work-orders/ — default repository home for non-trivial Work Order packages.
- docs/ux/ — Expert UX practice, Work Order, IA-to-UI traceability, project-context routing, and design references.
- docs/ux/project-context-and-reference-routing.md — project-aware routing method.
- docs/ux/project-context-template.md — project-scoped profile and evidence packet.
- docs/ux/design-reference-library.md — curated sources, examples, and failure exhibits.
- docs/job-search/ — Application packet Work Order and ATS/human version contract.
- `.agents/skills/` — repository-local callable Skill packages; each package declares its change contract and routing layer in `SKILL.md` frontmatter.
- eval/ — file-based conformance fixtures, normalized result checks, recorded-result adapter, isolated Persona–Skill matrix, and observation templates. It does not provide live provider access, but the `persona-skill-conformance` Skill can use exposed Codex task tools for bounded fresh-task runs.

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

The `dist` directory is the publishable Site output configured in `.openai/hosting.json`.
