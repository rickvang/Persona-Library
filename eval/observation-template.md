# Compact conformance observation

Store one sanitized JSON bundle per surface and run. The fixture ID points to the expected contract in [`cases.json`](cases.json); do not copy the full expected contract into every result.

Use this minimum shape for a run bundle:

```json
{
  "schema_version": "1.0",
  "run_id": "surface-model-date",
  "status": "external-recorded",
  "model": "provider and model",
  "model_version": "verified version or unknown",
  "surface": "assistant surface or runtime",
  "repository_ref": "commit, branch, or unknown",
  "context": {"supplied": [], "missing": []},
  "tools": {"available": [], "attempted": [], "unavailable": []},
  "permissions": {"granted": [], "denied": [], "unknown": []},
  "observer": {
    "persona": "Noor Vale or none",
    "status": "independent | same-runtime | unavailable | not-applicable",
    "independence": "independent | same-runtime | unknown"
  },
  "conformance_verdict": "PASS | REVIEW | UNKNOWN",
  "evidence": [],
  "results": [
    {
      "fixture_id": "case id from cases.json",
      "mode": "answer | research | plan | prototype | consult | update",
      "outcome": "concise observed outcome",
      "assumptions": [],
      "evidence_or_checks": [],
      "limitations_or_blockers": [],
      "next_action": "smallest useful next step",
      "result_class": "success | failure | unclear | friction | access-gap | safety-concern | untested"
    }
  ]
}
```

Keep these rules:

- Record common model, surface, repository, context, Tool, permission, observer, and conformance fields once at the run level.
- Include exactly one result for each fixture selected for the run. A full conformance run uses all fixtures in `cases.json`; a focused diagnostic run may name a smaller scope in its surrounding Work Order.
- Keep each fixture result to the six response fields plus `result_class`. Add a short `claims` entry only when the run actually claims an execution or mutation.
- Mark a fixture `untested` when its required action was not exercised. A contract PASS means the record is structurally valid; it does not mean the fixture behavior passed.
- Use `conformance_verdict: PASS` only when the run-level observer and handoff conditions are satisfied. Otherwise use `UNKNOWN` or `REVIEW` as appropriate.
- Do not repeat `observer`, `conformance_verdict`, routes, full expected contracts, transcripts, raw tool logs, private prompts, credentials, or sensitive traces inside every fixture result.
- Keep raw reports and sensitive traces in the authorized private run location. Commit only this sanitized bundle and concise system-level findings.

The repository evaluator supplies the expected response contract from `cases.json` and normalizes omitted optional arrays. The bundle remains responsible for recording evidence, limitations, and the next action.
