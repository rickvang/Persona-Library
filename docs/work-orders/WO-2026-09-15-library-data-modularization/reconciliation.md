# Reconciliation — library data modularization

## Initiating change

Issue #106 replaces the authored `content/library-data.js` monolith with owned source modules under `content/library-data/` while preserving the existing normalized model and generated browser contract.

## Direct dependents checked

| Surface | Result |
| --- | --- |
| `content/library-model.js` | Unchanged contract: continues to consume `window.PersonaLibraryData` after the compatibility assembler runs. |
| `scripts/build-library.mjs` | Updated to compose the ordered authored module set plus assembler into one generated `dist/data/library-data.js`. |
| `scripts/validation/context.mjs` | Updated to load the same ordered authored source sequence before the assembler so existing validators continue to inspect the canonical source shape. |
| `eval/isolated-persona-skill.mjs` | Updated to load the modular authored sequence by default while retaining explicit single-file fixture input support. |
| `dist/data/library-data.js` | Remains generated output. It was not hand-edited; regeneration is part of the executable pre-merge gate. |
| `ARCHITECTURE.md` | Updated to make `content/library-data/*.js` the authored record owners and `content/library-data.js` the compatibility assembler. |
| Persona Skills package | Current preflight/profile guidance updated so maintainers read the modular authored sources rather than treating the assembler as the record owner. |
| Template lifecycle Playbook | Canonical catalog identity updated to `content/library-data/catalogs.js`; assembler role remains explicit. |
| Skill-rebuild internal index | Current source-evidence pointer updated to the modular source directory plus assembler. |

## Source-boundary check

The original top-level `PersonaLibraryData` contract had 13 keys. The compatibility assembler requires those same keys and reconstructs them in the same order:

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

The module directory contains actual authored records for each domain; it is not a set of reference documents or redirect stubs.

## Historical evidence boundary

Archived Work Orders and historical issue/PR text were not rewritten merely to chase the new source paths. Their recorded paths remain evidence of the repository state in which those runs occurred.

## Executable validation boundary

The connected GitHub surface does not expose a repository command runner for this repository. Therefore this reconciliation does **not** claim that the following commands ran:

- `node scripts/build-library.mjs`
- `node scripts/validate-content.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node eval/isolated-persona-skill.mjs validate`
- syntax checks for the changed JavaScript sources
- `git diff --check`

Those checks remain required before merge. In particular, the build must regenerate `dist/data/library-data.js` from the modular sources and the generated-parity validator must pass before the branch can be treated as behavior-preserving.

## Reconciliation result

No new first-class library concept, runtime, registry, Tool permission model, or Site contract was introduced. The affected source/build/validation/evaluation/current-documentation surfaces have been reconciled. Historical evidence remains untouched. Remaining risk is concentrated in executable syntax, semantic parity, generated-output parity, and repository tests, all of which remain an explicit pre-merge gate.
