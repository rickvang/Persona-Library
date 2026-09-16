# Work Order — library-data modularization

- Status: active
- Issue: #106 — Behavior-preserving modularization of `content/library-data.js` after IA cleanup
- Repository: `rickvang/Persona-Library`
- Base: `main` at `b3814a18addd89393581902137e0e552e0ba28a3`
- Working branch: `refactor/issue-106-library-data-modules`
- Authorization: explicit user request to implement #106 on 2026-09-15
- Change mode: source update
- Change domain: canonical library data organization
- Reconciliation: change-impact reconciliation before handoff

## Outcome

Replace the 318 KB authored `content/library-data.js` monolith with real domain-owned source modules while preserving the existing `window.PersonaLibraryData` data shape, IDs, record meaning, ordering, normalization, and generated Site behavior.

This work is not satisfied by documentation pointers. The authored records themselves must move into owned source modules.

## Scope

1. Inventory the existing top-level data domains and their consumers.
2. Add `content/library-data/` as the source-owned module namespace under the existing `content/` authority.
3. Extract records into a small number of coherent modules rather than per-record fragments:
   - personas
   - skills and skill metadata
   - workflows
   - reusable catalogs
   - tool integration and handoffs
4. Keep `content/library-data.js` as a small compatibility aggregator.
5. Change the build so `dist/data/library-data.js` remains one classic-script bundle assembled from authored modules.
6. Update validator/eval loading only as needed to read the authored modular source without changing their behavioral contracts.
7. Update architecture truth to describe the new source boundary.
8. Validate source composition, data shape, generated parity, syntax, repository tests, and diff hygiene before merge.

## Non-goals

- no data-model redesign;
- no ID/schema/record-meaning changes;
- no new registry or runtime loader;
- no Site behavior redesign;
- no further filesystem-wide Docs cleanup;
- no change to the flat `.agents/skills/` namespace;
- no hand-editing generated `dist/` output.

## Current source inventory

The monolith currently defines these top-level keys in order:

1. `personas`
2. `skillLibrary`
3. `flowLibrary`
4. `playbookCatalog`
5. `operatingPacks`
6. `templates`
7. `personaToolRequirements`
8. `personaHandoffs`
9. `toolUseRecipes`
10. `skillGuidance`
11. `skillPractice`
12. `skillUnits`
13. `skillRelations`

Known direct consumers include `content/library-model.js`, `scripts/validation/context.mjs`, `eval/isolated-persona-skill.mjs`, the build pipeline, and generated Site pages via `dist/data/library-data.js`.

## Validation gate

Required before merge:

- `node scripts/build-library.mjs`
- `node scripts/validate-content.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node eval/isolated-persona-skill.mjs validate`
- syntax checks for changed JS modules
- generated source/bundle parity checks
- `git diff --check`

If the connected GitHub surface cannot execute these commands, the PR must record them as an external pre-merge gate rather than claiming they ran.

## Next action

Extract the first owned source domain, preserve the compatibility bundle contract, then continue domain-by-domain only while the changes remain mechanical and reviewable.
