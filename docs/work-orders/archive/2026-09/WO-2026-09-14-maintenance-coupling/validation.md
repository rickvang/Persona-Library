# Validation evidence

## Before and after maintenance surface

| Representative change | Before extraction | After extraction | Result |
| --- | --- | --- | --- |
| Persona identity, workflow, or profile shape | Understand the shared loader, generated/page checks, and the 563-line validator | `scripts/validation/personas.mjs` plus shared context/index contract | Persona checks are isolated from presentation logic |
| Skill catalog or modular unit | Same central validator, including unrelated page assertions | `scripts/validation/skills.mjs` and `scripts/validation/relationships.mjs` | Skill shape and typed relationships have named owners |
| Operating Pack or Template source metadata | Central validator mixed external source rules with all other domains | `operating-packs.mjs` or `templates.mjs`; generated freshness remains in `generated.mjs` | External artifact semantics stay distinct and focused |
| Generated Site contract | Same central validator | `scripts/validation/generated.mjs` | Presentation checks are separated from domain data checks |

The change reduces the files that must be edited for a validator change from one central script plus its surrounding context to the focused owner module plus the shared context contract. It does not claim that every maintenance task touches only one file: generated output, canonical model changes, or reconciliation can still require their declared dependents.

## Checks run

- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, and 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: focused Persona, Skill, and cross-domain relationship cases.
- `node --check` for `scripts/validate-content.mjs` and all modules in `scripts/validation/` — pass.
- `git diff --check` — pass.

## Coverage and limits

The full command still covers orientation, generated freshness and Site contracts, all current domain records, normalized catalogs, cross-domain references, prototype isolation, external source boundaries, and semantic maintenance metadata. The focused tests intentionally cover representative failures and module isolation rather than mirroring every production assertion. Browser behavior and external runtime availability remain outside this change.
