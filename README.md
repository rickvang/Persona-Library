# Persona Library

This repository contains the source and generated output for the Persona Library Site.

## What is included

- `content/` — the authored persona, skill, tool, playbook, and orientation data.
- `client/` — shared browser state and rendering helpers.
- `scripts/` — the build and content-validation scripts.
- `dist/` — the generated, dependency-free Site, including all public pages and the onboarding guidance.
- `ARCHITECTURE.md` — the system boundary, source-of-truth rules, and maintenance invariants.
- `JOB_SEARCH_IMPLEMENTATION.md` — the job-search workspace scope and sequencing plan.
- `AGENTS.md` — the repository activation and orientation entry point.

## Work tracking

- docs/work-orders.md — repository-wide active-work packet and progress-record convention.
- docs/ux/ — Expert UX practice, work-order, and IA-to-UI traceability templates.
- docs/job-search/ — Application packet Work Order and ATS/human version contract.

## Run locally

Open `dist/index.html` directly in a browser, or serve the `dist` folder with any static web server. The Site has no package install or build dependency.

To regenerate and validate the generated output after changing source content:

```text
node scripts/build-library.mjs
node scripts/validate-content.mjs
```

The `dist` directory is the publishable Site output configured in `.openai/hosting.json`.
