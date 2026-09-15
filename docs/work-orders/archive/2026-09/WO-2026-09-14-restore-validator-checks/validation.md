# Validation evidence

## Restored contracts

| Contract | Pre-#70 owner | Post-#76 gap | Restored owner | Result |
| --- | --- | --- | --- | --- |
| Tool-use recipe `steps` must be a non-empty array | monolithic `validate-content.mjs` | omitted from `relationships.mjs` | `scripts/validation/relationships.mjs` | missing/empty `steps` throw `Tool-use recipe has no steps: <id>` |
| Playbook catalog `id` unique and `name`/`status` present | same file, before `playbookIds` use | `Set(playbookCatalog.map(id))` collapsed duplicates | `buildValidationIndexes()` in `context.mjs` | malformed or duplicate identities throw `Invalid or duplicate Playbook catalog identity: <id>` |

The focused-module architecture from #70 is unchanged. No canonical authored data, generated Site output, or Playbook/Tool schema changed.

## Checks run

- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, and 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: 4 tests, including restored recipe-steps and Playbook-identity cases.
- `node --check` for `scripts/validate-content.mjs` and all modules in `scripts/validation/` — pass.
- `git diff --check` — pass.

## Coverage and limits

Focused tests cover a valid recipe with steps, missing/empty `steps`, a valid Playbook identity, a duplicate ID, and missing `id`/`name`/`status`. They do not mirror every production assertion. Browser behavior and external runtime availability remain outside this change.
