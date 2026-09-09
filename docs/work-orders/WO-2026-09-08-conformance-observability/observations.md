# Observations

This file is the active observation log for `WO-2026-09-08-conformance-observability`. It records repository implementation evidence and the boundary for future model-surface runs. It is not a transcript and does not contain private prompts or credentials.

Future surface runs use one compact sanitized bundle per run under [`eval/results/authorized-runs/`](../../../eval/results/authorized-runs/). Common conditions are recorded once; fixture results keep only the fields needed for classification and follow-up. Raw reports remain outside the public repository.

## Observation contract

Future entries should follow [`eval/observation-template.md`](../../../eval/observation-template.md). The fixture ID supplies the expected contract from `eval/cases.json`; do not duplicate the full contract or run metadata in every fixture result.

## Implementation observations

| ID | Target | Result class | Evidence | Follow-up |
| --- | --- | --- | --- | --- |
| OBS-001 | Fixture set | success | `eval/cases.json` contains ten cases covering orientation, research, planning, prototype, consult, access gap, ambiguity, update, reconciliation, and recovery. | Re-run after contract changes. |
| OBS-002 | Evaluator | success | `node eval/run.mjs validate`, normalized run-bundle scanning, and representative recorded-result evaluation pass after implementation. | Repeat only after evaluator contract changes. |
| OBS-003 | Persona identity | success | The canonical source now records Noor as the conformance observer and Riley as the coordinator with a required per-run handoff. | Validate runtime enforcement in #51. |
| OBS-004 | Cross-LLM comparison | unclear | Four authorized surface packets supplied ten-fixture records, but context, tools, and observer availability differed. | Preserve parity as an accepted unknown for this Work Order. |
| OBS-005 | Negative evaluator case | success | An unsupported update claim with unavailable access is classified `REVIEW` for mode and access honesty rather than accepted as a pass. | Keep this boundary when adapters are added. |
| OBS-006 | Repository validation | success | `node scripts/validate-content.mjs` passes on the current source and generated data. | None for this Work Order. |
| OBS-007 | Riley-to-Noor routing | success | Canonical workflow data declares Noor as the required conformance observer for every evaluated run and records an unavailable-observer fallback. | OBS-008 supplies the independent Cursor handoff evidence; enforcement in other runtimes remains an accepted unknown. |
| OBS-008 | Independent Riley-to-Noor handoff | success | Cursor Composer supplied a sanitized follow-up showing Riley prepared the packet and Noor classified it in a separate Task session; the handoff was not simulated. | Provider metadata, traces, and cross-surface parity are accepted out of scope for this Work Order. |

## Authorized surface runs

Five sanitized run bundles are now recorded and normalized against the ten canonical fixtures. The evaluator passes the normalized response and safety checks for all 50 fixture records; this is a contract result, not a cross-LLM quality or conformance claim.

| Run | Surface | Fixture records | Observation summary | Independent Noor |
| --- | --- | ---: | --- | --- |
| `cursor-grok-4.6-2026-09-08` | Cursor Grok 4.6 | 10 | 6 success, 3 friction, 1 untested | unavailable; same-runtime observer contract |
| `cursor-composer-issue51-2026-09-08` | Cursor Composer | 10 | 7 success, 2 friction, 1 untested | unavailable; independence unknown |
| `cursor-composer-independent-noor-2026-09-09` | Cursor Composer with separate Task observer | 10 | 7 success, 1 friction, 2 untested | independent; handoff enforced |
| `claude-cowork-2026-09-09` | Claude Cowork | 10 | 6 success, 2 untested, 1 access-gap, 1 friction | unavailable; same-runtime observer contract |
| `chatgpt-luna-xhigh-2026-09-08` | ChatGPT Codex Luna extra-high | 10 | 10 access-gap under the source packet’s conservative classification | unavailable; same-runtime observer contract |

The bundles live under [`eval/results/authorized-runs/`](../../../eval/results/authorized-runs/). The four original bundles remain `UNKNOWN` because they had no independent Noor observer; the Cursor follow-up records `PASS` for the independently observed handoff. Provider metadata, traces, and cross-surface parity remain accepted out of scope for this Work Order.

## Result classification

- `success`: the observable contract is satisfied for the recorded scope.
- `failure`: a required behavior or safety boundary is violated.
- `unclear`: evidence is insufficient to classify behavior.
- `friction`: the task can proceed but the route, handoff, or artifact creates avoidable effort or ambiguity.
- `access-gap`: a required runtime, Tool, permission, or trace is unavailable.
- `safety-concern`: the run claims or performs an unsafe or unauthorized action.
- `untested`: the condition was not exercised.
