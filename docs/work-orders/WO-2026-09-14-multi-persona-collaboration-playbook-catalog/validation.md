# Validation evidence

Behavior-focused checks for issue #71.

## Playbook contract

| Required behavior | Where it is inspectable | Result |
| --- | --- | --- |
| `playbookCatalog` contains one canonical Multi-Persona Collaboration identity | `content/library-data.js` `playbookCatalog` | Present |
| Identity resolves cleanly to the existing route without copying its full definition | `content/orientation/playbooks.json` route `multi-persona-collaboration` unchanged; catalog id links by the `playbook-` prefix convention | Present |
| Existing `multi-persona-collaboration` routing remains intact | `git diff content/orientation/playbooks.json` is empty | Present |
| Playbook Site/catalog and generated data show the identity | `dist/playbooks.html` catalog card + compact `#collaboration` section with a direct canonical-contract link, `dist/guide.html` example callout, `dist/data/library-data.js` refreshed | Present |
| Validation catches a missing/duplicate identity | `scripts/validation/context.mjs` duplicate/missing id-name-status check (unchanged, exercised by existing test) | Present |
| No collaboration contract is duplicated in the Site overview | `dist/playbooks.html#collaboration` is a compact summary with a direct link to `docs/collaboration/multi-persona-collaboration-playbook.md`; the canonical contract is unchanged | Present |
| No Persona, Skill, Tool, Template, Operating Pack, or `problem-context` semantics changed | `git diff --stat` shows no changes to those files | Present |
| Reconciliation records dependent Docs/routes/Skills/relationships | See [`reconciliation.md`](reconciliation.md) | Present |

## Checks run

- `node scripts/build-library.mjs` — copied `content/library-data.js` and other content sources into `dist/data/`.
- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: 5 tests, including the existing Playbook-identity duplicate/missing-field test.
- `git diff content/orientation/playbooks.json content/site-orientation.json docs/collaboration/` — pass: no changes, confirming the existing route and collaboration contract are untouched.

## Coverage and limits

Validators prove catalog identity uniqueness/shape, generated-data freshness, and orientation route inventory. They do not execute the Playbook or verify a live multi-Persona run; that remains out of scope per the issue's boundaries.
