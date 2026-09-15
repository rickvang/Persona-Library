# Work Order: Unified onboarding and routing map

- **Work Order ID:** WO-2026-09-08-onboarding-routing
- **GitHub issue:** [#41](https://github.com/rickvang/Persona-Library/issues/41)
- **Status:** Complete pending merge
- **Scope:** Add a unified request-to-system map and distinguish Persona-applied, library-management, orchestration, governance, and tool-safety Skill layers.

## Authorization and boundaries

The repository owner authorized implementation of Issue #41. This Work Order covers repository documentation, orientation metadata, local Skill frontmatter, generated orientation data, and validation. It does not create or install a new Skill, move package directories, change Persona records, change Tool access, or publish external work.

## Context and decisions

- `content/site-orientation.json` remains the canonical machine-readable routing source.
- `AGENTS.md` remains the compact repository activation entry point.
- Repository-local Skill packages remain flat under `.agents/skills/<skill-name>/`.
- `skill_layer` classifies callable local packages; `artifact_kind` classifies workflows, templates, references, Decisions, prototypes, and Work Orders.
- Package availability must be verified in the current repository or runtime catalog; documentation and historical plans do not prove availability.

## Planned and completed artifacts

- `content/site-orientation.json` — taxonomy, route definitions, artifact kinds, and availability sources.
- `.agents/skills/*/SKILL.md` — layer metadata for the eleven repository-local packages.
- `AGENTS.md` — compact layer and request routing map.
- `ARCHITECTURE.md` — layer and boundary explanation.
- `README.md` — onboarding links and local package description.
- `dist/guide.html` — human-readable routing map.
- `scripts/validate-content.mjs` — route, package-path, and frontmatter checks.
- `dist/data/site-orientation.json` — generated manifest copy.

## Progress

- [x] Read the orientation manifest and repository operating contract.
- [x] Confirm the existing flat package layout and current local package set.
- [x] Add the taxonomy and routes to the manifest.
- [x] Add `skill_layer` metadata to local packages.
- [x] Update onboarding, architecture, and README guidance.
- [x] Add concise validator checks and refresh generated orientation data.
- [x] Run the repository build and content validator.
- [x] Complete the universal reconciliation report and final review.
- [ ] Open the implementation pull request, merge it, and close Issue #41 after review.

## Validation and limitations

- `node scripts/build-library.mjs` passes.
- `node scripts/validate-content.mjs` passes: 18 Personas and 18 workflow maps validated.
- The system `quick_validate.py` was attempted for all local packages but could not start because the available Python runtime does not include `PyYAML`.
- The repository validator independently checks the required frontmatter boundary, supported `skill_layer` values, route completeness, repository package paths, generated manifest freshness, and existing content relationships.

## Reconciliation report

- **Change observed:** Orientation manifest, repository-local Skill metadata, onboarding documentation, generated orientation data, and content validation.
- **Initiating contract:** Repository update authorized by Issue #41; local packages retain their existing change modes, domains, and reconciliation fields.
- **Confirms:** Existing source-of-truth, flat package-layout, prototype-isolation, Tool-availability, Work Order, and reconciliation boundaries.
- **Extends:** Manifest routing, `AGENTS.md` onboarding, architecture guidance, package discoverability metadata, generated orientation data, and validator coverage.
- **Unchanged checked:** Persona records, Persona `skillLibrary` relationships, Tool records, Tool-use recipes, Playbooks, UX and job-search content, prototypes, and generated catalog data.
- **Limitation:** The system `quick_validate.py` remains unexecutable in this runtime because `PyYAML` is unavailable. The repository validator covers the changed package metadata and all route/package joins.
- **Unknown:** Whether all external runtimes preserve the new metadata or expose every repository-local package.

## Open questions

- Whether the Skill loader preserves additional frontmatter metadata and supports nested namespaces.
- Whether the final routing map should be surfaced beyond the existing Agent orientation page.
- Whether Work Orders should become a first-class manifest space or remain a Docs subspace.
- Whether the broader conformance work in Issue #37 will consume these route fixtures.

## Next action

Run the change-impact reconciliation pass over the manifest, local packages, onboarding docs, generated orientation data, and validator; then review the diff and prepare the Issue #41 pull request.
