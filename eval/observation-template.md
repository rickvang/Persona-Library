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

## Optional token-usage evidence

Usage is optional and backward compatible. Add a run-level object when the runtime returns an aggregate for the run, or add a result-level object only when that fixture maps to one directly observed turn. Do not copy a run total into every result. The reporter keeps run, turn, and static-context scopes separate.

When a runtime does not expose exact usage, record unavailable with a reason, or omit the optional field. Do not substitute a static estimate for measured runtime usage.

Example of unavailable run-level evidence:

    "usage": {
      "measurement": "unavailable",
      "scope": "run",
      "input_tokens": null,
      "cached_input_tokens": null,
      "output_tokens": null,
      "reasoning_tokens": null,
      "total_tokens": null,
      "source": "runtime usage metadata",
      "reason": "This execution surface did not expose per-run token counts."
    }

A measured per-turn object must include a stable turn_id and a named source. An estimated context object must use context scope, name its estimator, list its artifact paths, and pin a full repository revision. Cached input is a subset of input and reasoning is a subset of output when the provider defines them that way; never add these subcategories again when reconciling total_tokens. See the token-usage evidence contract in usage-telemetry.md.

Keep these rules:

- Record common model, surface, repository, context, Tool, permission, observer, and conformance fields once at the run level.
- Include exactly one result for each fixture selected for the run. A full conformance run uses all fixtures in `cases.json`; a focused diagnostic run may name a smaller scope in its surrounding Work Order.
- Keep each fixture result to the six response fields plus `result_class`. Add a short `claims` entry only when the run actually claims an execution or mutation.
- Mark a fixture `untested` when its required action was not exercised. A contract PASS means the record is structurally valid; it does not mean the fixture behavior passed.
- Use `conformance_verdict: PASS` only when the run-level observer and handoff conditions are satisfied. Otherwise use `UNKNOWN` or `REVIEW` as appropriate.
- Do not repeat `observer`, `conformance_verdict`, routes, full expected contracts, transcripts, raw tool logs, private prompts, credentials, or sensitive traces inside every fixture result.
- Keep raw reports and sensitive traces in the authorized private run location. Commit only this sanitized bundle and concise system-level findings.

The repository evaluator supplies the expected response contract from `cases.json` and normalizes omitted optional arrays. The bundle remains responsible for recording evidence, limitations, and the next action.


## Tool-use recipe / execution-strategy comparisons

Do not overload the conformance run bundle when the question is whether one Tool-use recipe or execution strategy should be preferred under a named condition. Use [the recipe comparison contract](recipe-comparison.md) and `validateRecipeComparison()` from `eval/contract.mjs`.

A comparison keeps the stable Skill/workflow/task separate from the execution strategy, records material context differences, preserves each strategy run as an observation, and requires an explicit review gate before a conclusion can affect shared guidance. One observation never silently becomes canonical preference.
