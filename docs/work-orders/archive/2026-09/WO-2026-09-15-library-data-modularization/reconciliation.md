# Reconciliation — library data modularization

## Initiating change

Issue #106 replaced the authored `content/library-data.js` monolith with owned source modules under `content/library-data/` while preserving the existing normalized model and generated browser contract. PR #109 merged that implementation into `main` at `968b5db8823e3de2a61cd5d4036409d85c87dd2f`.

The post-merge follow-up on `followup/mara-modular-source-guidance` aligns Mara Okoye’s architecture workflow and the relevant Persona/reconciliation Skills with the modular source boundary. It does not add a new Skill or change Mara’s substantive IA capability set.

## Original executable evidence

Before PR #109 merged, the repository owner reported a fresh-checkout validation run on the final branch state with these results:

- build: PASS;
- content validation: PASS;
- validation tests: PASS — 6/6;
- isolated Persona/Skill validation: PASS — 97 cases;
- syntax checks: PASS;
- module syntax loop: PASS;
- `git diff --check`: PASS;
- exact runtime data parity with baseline: PASS;
- all 13 required `PersonaLibraryData` domains present: PASS;
- no runtime loader introduced: PASS;
- no unrelated files changed: PASS.

That was user-reported local execution evidence, not a GitHub Actions run.

## Follow-up Persona adapter review

The changed Persona scope is Mara Okoye’s `knowledge-systems-architect` workflow. Her existing Skill applications remain sufficient and unchanged: information architecture/concept modeling, boundary design, taxonomy/navigation, dependency/change impact, rationale documentation, facilitation, and multi-perspective synthesis.

The workflow now makes three repository-operating expectations explicit:

1. begin architecture work from the current orientation and authored source owner;
2. treat the relevant `content/library-data/*.js` module as the record owner and `content/library-data.js` as the compatibility assembler;
3. invoke `$change-impact-reconciliation` after authorized durable source or structural changes when the change contract requires it.

No unrelated Persona fields, Skills, Tool requirements, resources, evidence claims, or role responsibilities were changed.

## Universal impact review

| Surface | Result |
| --- | --- |
| `content/site-orientation.json` | Mara-owned creation gate now resolves the current canonical source owner and explicitly points canonical library work at `content/library-data/`. |
| `content/library-data/workflows-career.js` | Mara’s workflow now starts from orientation/source ownership and names the universal reconciliation handoff. |
| `.agents/skills/persona-research/SKILL.md` | Preflight now reads owning authored modules and treats `content/library-data.js` only as the compatibility assembler. |
| `.agents/skills/persona-reconciliation/SKILL.md` | Persona adapter now reads owning authored modules before normalized relationship review. |
| `.agents/skills/change-impact-reconciliation/SKILL.md` | Universal dependency source and repository-dependency guidance now use `content/library-data/` as authored source and the assembler only as compatibility contract. |
| `content/library-model.js` | Unchanged; continues to consume the assembled `window.PersonaLibraryData` contract. |
| `ARCHITECTURE.md` | Already states the modular authored-source boundary from #106; no follow-up edit required. |
| historical Work Orders | Unchanged as historical evidence. |

A bounded repository search found current modular-source guidance already correct in the Persona Skills profile contract, architecture contract, build/validation loaders, and current #106 records. Historical records that describe the old monolith remain historical evidence and are not rewritten merely to chase current paths.

## Generated-output boundary

This follow-up changes authored source that feeds generated output:

- `content/library-data/workflows-career.js` → `dist/data/library-data.js`;
- `content/site-orientation.json` → `dist/data/site-orientation.json`.

Those generated files must be refreshed by `node scripts/build-library.mjs`. They must not be hand-edited.

## Follow-up executable validation gate

The connected GitHub surface does not expose a repository command runner, so this reconciliation does not claim the follow-up build or tests have run. Before the follow-up PR is merge-ready, run:

- `node scripts/build-library.mjs`
- `node scripts/validate-content.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node eval/isolated-persona-skill.mjs validate`
- syntax check for `content/library-data/workflows-career.js`
- `git diff --check`

The build should refresh only the generated outputs attributable to the changed sources, and generated parity must pass.

## Reconciliation result

The follow-up is a narrow **extension** of the #106 operating contract: Mara keeps her existing capability set, but her repository workflow and the Skills she routes through now resolve the real authored module owner instead of the compatibility assembler. No new first-class concept, runtime, registry, schema, Tool permission model, or Site contract is introduced. Remaining risk is limited to executable validation and generated-output freshness before merge.