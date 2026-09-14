# Validation evidence

Behavior-focused checks for the PR #87 post-merge P1 (round 1) and the follow-up Codex P1 on PR #88 (round 2). Merge is not authorized from this Work Order.

## Contract checks — round 1 (route sentence)

| Required behavior | Where it is inspectable | Result |
| --- | --- | --- |
| Old unconditional sentence removed from route source | `content/orientation/playbooks.json` route `bounded-parallel-implementation` `next_handoff` | Present (verified absent by search) |
| Replacement matches Rick's exact wording | Same field | Present |
| External-target-repository scoping preserved (#86 intent not reversed) | Same field: "For external target repositories, Persona-Library is not an additional execution dependency." | Present |
| Persona-Library-as-target / local-instructions exception added | Same field: "If Persona-Library itself is the target repository, or target-repository local instructions require Persona-Library records, follow those local routing requirements." | Present |
| Generated mirror refreshed | `dist/data/orientation/playbooks.json` | Present |

## Contract checks — round 2 (Playbook body, Codex P1 on PR #88)

| Required behavior | Where it is inspectable | Result |
| --- | --- | --- |
| Codex claim verified against the PR branch | `docs/bounded-parallel-implementation-playbook.md` lines 12 and 204 read on branch `cursor/bounded-parallel-p1-target-repo-wording-581c` | Confirmed correct: both lines stated the no-Persona-Library-records rule with no external-repo qualifier |
| Line 12 narrowed to match the route exception | "For an external target repository, execution does not require loading Persona-Library records. If Persona-Library itself is the target repository, or target-repository local instructions require Persona-Library records, follow those local routing requirements." | Present |
| Line 204 (Stage 2 Inputs) narrowed to match the route exception | "For an external target repository, Persona-Library records are not required after Playbook selection; if Persona-Library itself is the target repository, or target-repository local instructions require Persona-Library records, follow those local routing requirements." | Present |
| Already-correctly-scoped lines left unchanged | Line 49 ("work in another repository"), line 330 ("agent that starts inside the target repository skips Persona-Library loading") | Unchanged (confirmed via `git diff`) |
| Historical case statement left unchanged (factual, not a rule) | Line ~385 `template-library` case | Unchanged |
| Issue #86 not closed | This Work Order and PR do not use a closing keyword for #86 | Present |
| PR #87 not reopened, PR #88 not merged | No GitHub mutation performed against #87; no merge performed on #88 | Present |
| Only the intended file changed in round 2 | `git status --porcelain` | Present (1 file: `docs/bounded-parallel-implementation-playbook.md`) |

## Checks run

Round 1:
- `node -e "JSON.parse(...)"` — confirms `content/orientation/playbooks.json` is valid JSON after the edit.
- `grep -rn "Do not load Persona-Library records" dist/ content/ docs/` — confirms no remaining literal copy of the old sentence outside this Work Order's own historical quote.
- `node scripts/build-library.mjs` — refreshed `dist/data/orientation/playbooks.json` and all other generated copies.

Round 2:
- `grep -n "Persona-Library" docs/bounded-parallel-implementation-playbook.md` — enumerated every mention before and after editing, confirming lines 12 and 204 were the only unconditional statements and lines 49/330/385 already scope correctly or are historical fact.
- `node scripts/build-library.mjs` — re-run; confirms `docs/` is not part of the generated-output copy list, so no dist mirror needed refreshing for this edit.

Both rounds:
- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: 5 tests, including the bounded-parallel role-count and Playbook-identity checks unaffected by this wording change.
- `git diff --check` — pass, no whitespace errors.

## Coverage and limits

Existing validators check generated-output freshness, Playbook identity, and the bounded-parallel catalog card's role/stage counts; they do not assert the literal text of `next_handoff` strings or Playbook-body prose, so both rounds of this change were verified by direct inspection and search rather than an automated assertion. No new validator was added because the change is a scoped wording narrowing, not a structural or countable contract change. This manual-inspection approach is also why round 1 missed lines 12 and 204 — a lesson for any future similar wording change: search for every mention of the term being scoped, not just the primary route field.
