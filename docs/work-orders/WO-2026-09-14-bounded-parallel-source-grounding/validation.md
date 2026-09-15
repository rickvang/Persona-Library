# Validation evidence

Behavior-focused checks for issue #86. The implementation-stage record stopped before merge; post-merge reconciliation records the final merge and live proof.

## Contract checks

| Required behavior | Where it is inspectable | Result |
| --- | --- | --- |
| Pre-dispatch source-grounding stage | Playbook stage 0 | Present |
| Source-grounding gate; contradicted work cannot dispatch | Quality gates; stage 1 entry; failure/recovery | Present |
| confirmed / qualified / contradicted | Stage 0 comparison classes | Present |
| Qualified scope carried in dispatch packet | Stage 1 dispatch packet fields | Present |
| Target-repository instructions/source/tests outrank catalog/memory | Implementation-truth precedence; core principle | Present |
| Persona-Library not required after Playbook selection | Execution path; implementer stage inputs; proof.md | Present |
| One canonical Playbook identity | Playbook ID unchanged; no second catalog row | Present |
| Root `AGENTS.md` has no bounded-parallel procedure | Rules 1–12 only; no rule 13 restored | Present |
| Compact handoff schema unchanged in role | Stage 3 still six notification fields | Present |
| Independent review includes problem correctness | Stage 4 actions; review gate | Present |
| Merge remains separately authorized | Stage 6; merge gate | Present |
| Site summary is not dispatch-first | Catalog card shows `7 stages`; stage `01 / GROUND` | Present |

## External-repository case

See [`proof.md`](proof.md). `template-library` #1 first PR as written is **contradicted** by current `main` @ `a275a48`. No sibling-repo mutation.

## Checks run

- `node scripts/build-library.mjs` — copied catalog and orientation sources into `dist/data/`.
- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, and 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: 5 tests; bounded-parallel card still scoped, fixture now also asserts `7 stages`.
- `git diff --check` — pass for the committed change set.
- Root `AGENTS.md` inspected: no bounded-parallel always-on rule.

## Coverage and limits

Validators lock the bounded-parallel catalog card to `4 roles` and `7 stages`, and require the Playbooks page to present `01 / GROUND`. They do not execute the Playbook. The `template-library` case remains source-grounding plus stop/re-scope; the later ai-job-search lane supplies the real external implementation proof and PR #98 records it for #86/#82.
