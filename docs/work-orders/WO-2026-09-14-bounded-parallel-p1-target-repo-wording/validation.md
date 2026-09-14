# Validation evidence

Behavior-focused checks for the PR #87 post-merge P1. Merge is not authorized from this Work Order.

## Contract checks

| Required behavior | Where it is inspectable | Result |
| --- | --- | --- |
| Old unconditional sentence removed from route source | `content/orientation/playbooks.json` route `bounded-parallel-implementation` `next_handoff` | Present (verified absent by search) |
| Replacement matches Rick's exact wording | Same field | Present |
| External-target-repository scoping preserved (#86 intent not reversed) | Same field: "For external target repositories, Persona-Library is not an additional execution dependency." | Present |
| Persona-Library-as-target / local-instructions exception added | Same field: "If Persona-Library itself is the target repository, or target-repository local instructions require Persona-Library records, follow those local routing requirements." | Present |
| Generated mirror refreshed | `dist/data/orientation/playbooks.json` | Present |
| Playbook body left unchanged (already scoped) | `docs/bounded-parallel-implementation-playbook.md` | Unchanged (confirmed via `git diff --stat`) |
| Issue #86 not closed | This Work Order and PR body do not use a closing keyword for #86 | Present |
| PR #87 not reopened | No GitHub mutation performed against #87 | Present |
| Only the intended two files changed | `git diff --stat` | Present (2 files: `content/orientation/playbooks.json`, `dist/data/orientation/playbooks.json`) |

## Checks run

- `node -e "JSON.parse(...)"` — confirms `content/orientation/playbooks.json` is valid JSON after the edit.
- `grep -rn "Do not load Persona-Library records" dist/ content/ docs/` — confirms no remaining literal copy of the old sentence outside this Work Order's own historical quote.
- `node scripts/build-library.mjs` — refreshed `dist/data/orientation/playbooks.json` and all other generated copies.
- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: 5 tests, including the bounded-parallel role-count and Playbook-identity checks unaffected by this wording change.
- `git diff --check` — pass, no whitespace errors.
- `git diff --stat` — confirms exactly `content/orientation/playbooks.json` and `dist/data/orientation/playbooks.json` changed (plus this Work Order's new files).

## Coverage and limits

Existing validators check generated-output freshness, Playbook identity, and the bounded-parallel catalog card's role/stage counts; they do not assert the literal text of `next_handoff` strings, so this change is verified by direct inspection and search rather than an automated assertion. No new validator was added because the change is a scoped wording narrowing, not a structural or countable contract change.
