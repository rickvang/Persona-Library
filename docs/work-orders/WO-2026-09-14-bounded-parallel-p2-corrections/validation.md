# Validation evidence

Behavior-focused checks for the three PR #83 P2s. The correction-stage validation intentionally left issue #82 open until a live proof existed.

## Contract checks

| Required behavior | Where it is inspectable | Result |
| --- | --- | --- |
| Run-stop requires accepted-after-review or explicit blocked/deferred | Playbook outcome and run-stop gate | Present |
| Recording scoped corrections is not terminal | Stages 4–5, correction-loop gate | Present |
| Catalog names four roles including Authorizer | Bounded-parallel card `data-playbook-id="playbook-bounded-parallel-implementation"` shows `<span>4 roles</span>`; detail participants include Authorizer | Present |
| DEC-010 names four roles without dropping Authorizer | Summary plus appended Correction line | Present |
| Root `AGENTS.md` has no bounded-parallel always-on rule | Rule 13 removed; rules 1–12 remain | Present |
| Playbooks route group owns activation | `bounded-parallel-implementation` `next_handoff` | Present |

## Checks run

- `node scripts/build-library.mjs` — copied catalog and orientation sources into `dist/data/`.
- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, and 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: 5 tests.
- `git diff --check` — pass for the staged P2 change set.

## Coverage and limits

Validators prove the bounded-parallel catalog card, selected by `data-playbook-id="playbook-bounded-parallel-implementation"`, shows `4 roles`. The assertion is card-scoped, so another playbook may legitimately show `3 roles`. Generated orientation copies are fresh, and existing Site/route contracts still hold. They do not execute the Playbook. The later integrated run in PR #98 supplies the previously missing live proof for issue #82.
