# Selective orientation loading reconciliation

- Work Order: WO-2026-09-13-orientation-selective-loading
- Status: complete
- Change observed: the canonical orientation manifest was split into a minimal bootstrap and nine generated route groups; activation, Skills, build, validator, Docs, and architecture references were updated.
- Initiating contract: repository architecture update authorized by issue #69; generated-output and documentation changes require one read-only universal impact review.
- Scope checked: `AGENTS.md`, `content/site-orientation.json`, `content/orientation/*.json`, repository-local orientation and route Skills, `scripts/build-library.mjs`, `scripts/validate-content.mjs`, `README.md`, `ARCHITECTURE.md`, `dist/guide.html`, generated orientation output, and the active Work Order.

## Impacts

| Dependent | Relationship | Class | Evidence | Confidence | Action |
| --- | --- | --- | --- | --- | --- |
| Repository activation | `AGENTS.md` is the preflight entry point | extends | It now points to the bootstrap, selected route group, and linked records while removing the duplicated full routing table | high | none required |
| Orientation Skill and known route Skills | Skills consume the routing contract before downstream work | qualifies | Preflights now load the bootstrap and only relevant route groups; route-specific handoffs remain in their existing packages | high | none required |
| Route semantics | Existing primary spaces and route contracts are distributed across group files | confirms | Validator checks all 29 pre-split route IDs exactly once and re-runs route dependency assertions | high | none required |
| Generated Site data | Site consumers need fresh bootstrap and route-group copies | extends | Build derives route copies from bootstrap declarations; generated equality checks pass | high | none required |
| Content validator | Structural validation must follow the source layout | extends | Validator checks group declarations, one-owner universal policy, route parity, package paths, and generated freshness | high | none required |
| Templates catalog and viewer from #68 | Orientation metadata is a preflight dependency; Template records and presentation remain downstream consumers | confirms | `node scripts/validate-content.mjs` passes; Template source/model/page files were not changed; inline Template page scripts parse | high | retain existing #68 evidence boundary |
| Canonical Personas, Skills, Tools, Operating Packs, Playbooks, Templates, and prototypes | Orientation routes describe ownership and retrieval, not domain records | confirms | No canonical library-data records, relationships, or external artifacts were changed | high | none required |

## Required updates

None identified. The selected route-group layout preserves the existing primary-space boundary and route IDs without adding a new domain concept or runtime dependency.

## Optional follow-ups

- Measure token counts in representative model runtimes if future onboarding evidence needs token-level rather than byte-level comparisons.
- Add a controlled forward Skill-runtime test when the reconstructed orientation package is registered in a test environment.

## Generated outputs and checks

`node scripts/build-library.mjs`, `node scripts/validate-content.mjs`, the relevant `node --check` commands, inline Template-page parsing, and `git diff --check` passed. The generated bootstrap and all nine generated route groups match their authored sources.

## Incomplete visibility

The review covers repository-local consumers found by the implementation audit. It cannot establish undocumented external consumers of the old monolithic manifest or exact historical Skill-loader behavior. No external repository, runtime router, credential, or artifact was changed.

## Next action

Commit and push the reviewed implementation, then close issue #69 with the validation and reconciliation links.
