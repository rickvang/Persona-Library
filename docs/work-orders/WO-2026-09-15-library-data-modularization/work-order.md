# Work Order — library-data modularization

- Status: ready-for-review
- Issue: #106 — Behavior-preserving modularization of `content/library-data.js` after IA cleanup
- Repository: `rickvang/Persona-Library`
- Base: `main` at `b3814a18addd89393581902137e0e552e0ba28a3`
- Working branch: `refactor/issue-106-library-data-modules`
- Authorization: explicit user request to implement #106 on 2026-09-15
- Change mode: source update
- Change domain: canonical library data organization
- Reconciliation: completed at repository/dependency level; executable validation remains pre-merge

## Outcome

Replace the 318 KB authored `content/library-data.js` monolith with real domain-owned source modules while preserving the existing `window.PersonaLibraryData` data shape, IDs, record meaning, ordering, normalization, and generated Site behavior.

This work is not satisfied by documentation pointers. The authored records themselves have moved into owned source modules under `content/library-data/`.

## Implemented source structure

The source now has actual record owners for:

- Personas: core, career, and systems modules;
- Persona Skill profiles: core and specialist modules;
- Persona workflow maps: core, operations, career, and systems modules;
- reusable catalogs: Playbooks, Operating Packs, and Templates;
- Tool integration: requirements, handoffs, and recipes;
- Skill guidance, practice, primitive units, and typed relationships.

`content/library-data.js` is now only a compatibility assembler. It requires the same 13 top-level data keys, restores them in their original order, assigns `window.PersonaLibraryData`, and clears the temporary fragment namespace.

## Consumer updates

- `scripts/build-library.mjs` composes the ordered authored modules and assembler into the single generated `dist/data/library-data.js` browser bundle.
- `scripts/validation/context.mjs` loads the same authored source sequence before validation and generated-parity checks.
- `eval/isolated-persona-skill.mjs` loads the same modular source by default while retaining explicit single-file fixture support.
- `content/library-model.js` remains unchanged because the `window.PersonaLibraryData` compatibility contract remains unchanged.
- current architecture, Persona Skills guidance, Template lifecycle guidance, and the current internal source-evidence index now point to the real modular source boundary.

## Boundaries preserved

- no data-model redesign;
- no ID/schema/record-meaning change intended;
- no new registry or runtime loader;
- no Site behavior redesign;
- no further filesystem-wide Docs cleanup;
- no change to the flat `.agents/skills/` namespace;
- no hand-editing generated `dist/` output;
- archived Work Orders and historical issue/PR text remain untouched as historical evidence.

## Structural audit

- `main` remained at `b3814a18addd89393581902137e0e552e0ba28a3` during implementation.
- Branch is based directly on that commit and is not behind `main`.
- The old `content/library-data.js` changed from a 1,190-line mixed-domain record source to a 29-line compatibility assembler.
- Fourteen authored module files now live under `content/library-data/` and contain the actual records rather than redirect stubs.
- The build source order, validation source order, and isolated-eval source order are aligned.
- Generated `dist/data/library-data.js` was not hand-edited and therefore remains intentionally stale until the build runs.

See `ia.md` for placement and ownership and `reconciliation.md` for the dependency review.

## Validation gate

Required before merge:

- `node scripts/build-library.mjs`
- `node scripts/validate-content.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node eval/isolated-persona-skill.mjs validate`
- syntax checks for changed JS modules
- generated source/bundle parity checks
- `git diff --check`

The connected GitHub surface exposes no repository command runner for these checks. They have **not** been claimed as run or passed. The PR must remain unmerged until this executable gate is satisfied or the user explicitly supplies/accepts equivalent validation evidence.

## Repository-side incident note

During implementation, two accidental temporary issues (#107 and #108) were created by invoking the issue-creation action instead of the file-creation action. Both were immediately renamed `Accidental temporary issue — closed` and closed as `not_planned`. They do not authorize or own work and no source change depends on them.

## Next action

Open the implementation PR against current `main`, run the executable validation gate in an environment with repository command execution, regenerate `dist/` through the normal build, then review the resulting generated diff before any merge decision.
