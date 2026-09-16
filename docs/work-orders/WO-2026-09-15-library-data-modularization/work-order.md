# Work Order — library-data modularization

- Status: active
- Issue: #106 — Behavior-preserving modularization of `content/library-data.js` after IA cleanup
- Repository: `rickvang/Persona-Library`
- Base: `main` at `968b5db8823e3de2a61cd5d4036409d85c87dd2f` after PR #109 merged
- Working branch: `followup/mara-modular-source-guidance`
- Authorization: explicit user request to implement #106 on 2026-09-15, plus explicit 2026-09-15 follow-up request to integrate Mara Okoye with the modular source boundary
- Change mode: source update
- Change domain: canonical library data organization and architecture-governance routing
- Reconciliation: Persona adapter and universal impact review completed for the follow-up; executable validation and generated refresh remain pre-merge

## Outcome

Replace the former 318 KB authored `content/library-data.js` monolith with real domain-owned source modules while preserving the existing `window.PersonaLibraryData` data shape, IDs, record meaning, ordering, normalization, and generated Site behavior.

This work is not satisfied by documentation pointers. The authored records themselves live in owned source modules under `content/library-data/`.

PR #109 merged the behavior-preserving modularization. The current follow-up makes the new boundary operational for Mara Okoye and the Persona/reconciliation Skills she relies on: architecture work resolves the owning authored module rather than treating `content/library-data.js` as record authority.

## Implemented source structure

The source has actual record owners for:

- Personas: core, career, and systems modules;
- Persona Skill profiles: core and specialist modules;
- Persona workflow maps: core, operations, career, and systems modules;
- reusable catalogs: Playbooks, Operating Packs, and Templates;
- Tool integration: requirements, handoffs, and recipes;
- Skill guidance, practice, primitive units, and typed relationships.

`content/library-data.js` is only a compatibility assembler. It requires the same 13 top-level data keys, restores them in their original order, assigns `window.PersonaLibraryData`, and clears the temporary fragment namespace.

## Post-merge Mara integration

The follow-up keeps Mara’s existing substantive Skill set unchanged and adds explicit repository-operating linkage:

- `content/site-orientation.json`: Mara’s creation gate now resolves canonical source ownership and points canonical record work to the owning `content/library-data/*.js` module;
- `content/library-data/workflows-career.js`: Mara’s architecture workflow starts from current orientation/source ownership and names `$change-impact-reconciliation` after durable high-impact changes;
- `.agents/skills/persona-research/SKILL.md`: Persona maintenance reads owning authored modules plus the compatibility assembler contract;
- `.agents/skills/persona-reconciliation/SKILL.md`: Persona-specific reconciliation uses the modular authored source boundary;
- `.agents/skills/change-impact-reconciliation/SKILL.md`: universal dependency review uses `content/library-data/` for authored records and `content/library-data.js` only for compatibility assembly.

No new Skill, first-class library space, runtime, registry, schema, Tool permission model, or Site behavior is introduced.

## Consumer contract

- `scripts/build-library.mjs` composes the ordered authored modules and assembler into the single generated `dist/data/library-data.js` browser bundle.
- It also copies `content/site-orientation.json` to `dist/data/site-orientation.json`.
- `scripts/validation/context.mjs` loads the same authored source sequence before validation and generated-parity checks.
- `eval/isolated-persona-skill.mjs` loads the same modular source by default while retaining explicit single-file fixture support.
- `content/library-model.js` remains unchanged because the `window.PersonaLibraryData` compatibility contract remains unchanged.

## Boundaries preserved

- no data-model redesign;
- no ID/schema/record-meaning change intended outside the explicit Mara workflow guidance update;
- no new registry or runtime loader;
- no Site behavior redesign;
- no further filesystem-wide Docs cleanup;
- no change to the flat `.agents/skills/` namespace;
- no hand-editing generated `dist/` output;
- archived Work Orders and historical issue/PR text remain untouched as historical evidence.

## Original validation evidence

Before PR #109 merged, the repository owner reported fresh-checkout validation on the final branch state with build, content validation, 6/6 validation tests, 97 isolated Persona/Skill cases, syntax checks, module syntax loop, `git diff --check`, runtime parity, all 13 domains, no runtime loader, and no unrelated-file changes passing.

That evidence was user-reported local execution, not a GitHub Actions run. PR #109 then merged into `main` at `968b5db8823e3de2a61cd5d4036409d85c87dd2f`.

## Follow-up validation gate

The current follow-up changes authored inputs to generated files, so before its PR can merge run:

- `node scripts/build-library.mjs`
- `node scripts/validate-content.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node eval/isolated-persona-skill.mjs validate`
- `node --check content/library-data/workflows-career.js`
- `git diff --check`

Expected generated refresh from the normal build:

- `dist/data/library-data.js`
- `dist/data/site-orientation.json`

The connected GitHub surface exposes no repository command runner for these checks. Generated outputs must be produced by the normal build and not hand-edited.

## Repository-side incident note

During the original #106 implementation, two accidental temporary issues (#107 and #108) were created by invoking the issue-creation action instead of the file-creation action. Both were immediately renamed `Accidental temporary issue — closed` and closed as `not_planned`. They do not authorize or own work and no source change depends on them.

## Next action

Run the follow-up executable validation gate in a fresh checkout, keep the generated changes produced by the build, confirm the branch diff remains scoped to the Mara/source-boundary integration plus generated outputs, then open or finalize the follow-up PR against current `main`.