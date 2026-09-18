# Validation — Candidate Baseline Resume workflow repair

Status: ready-for-review with explicit pre-merge execution gap.

## Checks completed

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate Baseline is distinct from evidence and reusable Template ownership | pass | Persona-Library Candidate Context/implementation contracts and Operating Pack AGENTS/CONTEXT agree on the boundary |
| Standing decisions resolve the exact baseline before composition | pass | application route, Work Order gate, implementation private-source gate, and Operating Pack resolution sequence |
| Unresolved baseline blocks secondary-source substitution | pass | all three contract layers explicitly prohibit stale/secondary profile substitution |
| Protected career spine is defined | pass | identity/contact, employer/title/date/location chronology, employer/client hierarchy, recent employers, education, certifications, and candidate-confirmed historical grouping are named |
| Material deviations are dispositioned | pass | protected changes require evidence/decision support; material omissions use `omitted_with_reason` |
| Semantic mapping does not supersede baseline | pass | mapping contract and callable Skill now require baseline resolution and baseline-aware composition |
| Template starter instantiation is baseline-aware | pass | unconditional resume starter-copy language removed from implementation, Work Order, and Candidate Context sequence |
| Docs route source/generated parity | pass | `content/orientation/docs.json` exactly equals `dist/data/orientation/docs.json` on the branch |
| DEC-015 source/generated presence | pass | authored Decision exists and generated Decisions page contains the new record |
| DEC-015 exact renderer parity | pass | generated `dist/decisions.html` was recomputed with the repository renderer logic and matched exactly |
| Focused regression guard present | pass | route validator requires baseline/standing-decision/career-spine/secondary-profile terms; implementation validator requires private-source and baseline-integrity terms |
| Focused regression tests updated | pass by source inspection | test fixtures include baseline route/integrity invariants and negative cases |
| Candidate private data leak | pass by scope inspection | no private contact/history values were added to reusable repositories |
| Template-library mutation | pass | no changes in `rickvang/template-library` |
| Persona-Library preview deployment | pass | Vercel combined status is success on branch head `d5f72852679a11eb42c352693f2f201cb0f8465a` |
| Pull-request Actions validation | not available | no pull-request workflow runs are attached to the branch head and repository search shows no pull-request Actions runner |

## Required pre-merge commands not executed in this runtime

These remain required; do not report them as passed:

- [ ] `node scripts/build-library.mjs`
- [ ] `node scripts/validate-content.mjs`
- [ ] `node --test scripts/validation/validation.test.mjs`
- [ ] `node eval/isolated-persona-skill.mjs validate`
- [ ] `git diff --check`

The connected GitHub surface exposes file/PR/status operations but no repository command runner. The repository also has no pull-request Actions workflow that can execute the Node suite from this branch. The PR remains draft until an execution-capable environment runs these checks.

## Pull requests

- Persona-Library: https://github.com/rickvang/Persona-Library/pull/149
- Candidate Application Context Operating Pack: https://github.com/rickvang/operating-packs/pull/6

No merge is authorized by this validation record.
