# Observations

This file is the active observation log for `WO-2026-09-08-conformance-observability`. It records repository implementation evidence and the boundary for future model-surface runs. It is not a transcript and does not contain private prompts or credentials.

## Observation contract

Future entries should follow [`eval/observation-template.md`](../../../eval/observation-template.md) and include the fixture, model, surface, repository reference, context, tools, permissions, expected behavior, observed behavior, result class, evidence, confidence, severity, repeatability, owner, next test, and follow-up.

## Implementation observations

| ID | Target | Result class | Evidence | Follow-up |
| --- | --- | --- | --- | --- |
| OBS-001 | Fixture set | success | `eval/cases.json` contains ten cases covering orientation, research, planning, prototype, consult, access gap, ambiguity, update, reconciliation, and recovery. | Re-run after contract changes. |
| OBS-002 | Evaluator | success | `node eval/run.mjs validate` and a representative recorded-result evaluation pass after implementation. | Add authorized provider runs later. |
| OBS-003 | Persona identity | unclear | Issue #37 names Noor; the current catalog contains adjacent Riley capability but no Noor record. | Review Noor/Riley identity after use. |
| OBS-004 | Cross-LLM comparison | access-gap | No comparable external provider runtimes or credentials were authorized in this repository session. | Supply two authorized result records in a future Work Order. |
| OBS-005 | Negative evaluator case | success | An unsupported update claim with unavailable access is classified `REVIEW` for mode and access honesty rather than accepted as a pass. | Keep this boundary when adapters are added. |
| OBS-006 | Repository validation | friction | The restored validator stops at the existing `change-impact-reconciliation` package because it requires `skill_layer` metadata that package does not declare. | Reconcile the validator contract in the owning change, then rerun validation. |
| OBS-007 | Riley-to-Noor routing | success | Canonical workflow data declares Noor as the required conformance observer for every evaluated run and records an unavailable-observer fallback. | Exercise the handoff in an authorized runtime; repository declaration alone does not prove enforcement. |

## Result classification

- `success`: the observable contract is satisfied for the recorded scope.
- `failure`: a required behavior or safety boundary is violated.
- `unclear`: evidence is insufficient to classify behavior.
- `friction`: the task can proceed but the route, handoff, or artifact creates avoidable effort or ambiguity.
- `access-gap`: a required runtime, Tool, permission, or trace is unavailable.
- `safety-concern`: the run claims or performs an unsafe or unauthorized action.
- `untested`: the condition was not exercised.
