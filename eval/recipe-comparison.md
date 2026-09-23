# Tool-use recipe experimentation and evidence learning loop

## Purpose

Use this contract when a stable Skill/workflow can be executed through two or more Tool-use recipes or execution strategies and the system needs evidence about which approach works better under named conditions.

This extends the existing evaluation and Tool-learning contracts. It does not create a new Skill, Tool identity, scoring system, or automatic preference engine.

## Stable unit

A comparison names the stable unit before any strategy is run:

- Skill ID;
- workflow/activity;
- task class and representative fixture;
- repository/source revision when relevant;
- expected validation gate;
- model/runtime/surface;
- Tool availability and permission conditions.

The comparison changes only the intended recipe/strategy dimension when practical. Material differences remain visible.

## Comparability

Classify the comparison as:

- **comparable** — material task, runtime, source, permission, and validation conditions are controlled closely enough for a direct evidence comparison;
- **qualified** — the runs remain informative, but named material differences limit the conclusion;
- **not-comparable** — confounds are large enough that the only supported conclusion is `insufficient-evidence`.

Do not attribute an outcome to a Tool or recipe when task, model, permissions, source revision, or validation conditions materially differ without qualification.

## Observation shape

Each candidate keeps:

- `strategy_id`;
- candidate type: Tool-use recipe or execution strategy;
- owning `recipe_id` and Tool;
- bounded procedure;
- result class;
- explicit validation pass/failure;
- friction/recovery evidence;
- evidence references;
- optional observable metrics such as remote-call count, payload size, latency, or cost.

Metrics are optional. Do not require values the runtime cannot observe reliably and do not combine metrics into a hidden score.

## Accumulation and contradiction

One strategy run is one observation, not canonical guidance.

Group future evidence by the stable unit and material conditions. Preserve contradictory observations rather than overwriting older evidence. A recipe may be preferred for one task/runtime condition and fallback for another.

Evidence becomes stale when a material Tool/runtime capability, recipe procedure, permission model, source revision, validation gate, or task class changes. Stale evidence remains historical evidence but is not treated as current proof without revalidation.

## Review and promotion gate

Every comparison ends with an explicit reviewed disposition:

- **preferred** — evidence supports one candidate for the reviewed scope;
- **conditional** — one candidate is preferred only under named conditions and another may remain fallback;
- **fallback** — a candidate remains useful primarily when the preferred route is unavailable or fails;
- **insufficient-evidence** — evidence is not comparable, is contradictory without resolution, or is too weak for a scoped preference.

A reviewed conclusion is still evidence. It does not update a Tool-use recipe, Persona Tool requirement, Operational Scenario, Tool record, or Skill automatically. Any canonical change follows the normal authorized repository update and reconciliation path.

## Persistence

Default to sanitized Git-backed evidence when comparisons are low-volume, review-oriented, non-private, and repository history is useful.

Create a Supabase implementation follow-up only when a proof identifies all four:

1. a real writer;
2. a real consumer;
3. a concrete repeated query or aggregation need;
4. a reason repository-reviewed evidence is insufficient (for example private/high-churn observations or many cross-time queries).

Do not create a generic observations table in advance.

## Proof from issue #171

The first proof compares two read-only GitHub retrieval strategies for resolving the Operational Scenario that applies to an issue implementation task at repository revision `20f40b2a98ec04200e837e216d4f33ce2cf8d089`.

Both strategies passed the same validation gate and used two remote calls. Manifest-first retrieval used the 4,037-byte routing index and selected one declared body. Code-search-first returned a 19,816-byte discovery payload with four candidates before selecting the same body.

Reviewed disposition: **conditional**. Use manifest-first when the Operational Scenario index exists and is current; keep code search as fallback when the index is unavailable, stale, or cannot represent the task. This is not a universal GitHub-search ranking.

The sanitized proof is in `eval/results/recipe-comparisons/github-operational-scenario-retrieval-2026-09-21.json`.


## Optional token-usage evidence

A strategy observation may include the normalized usage object from the token-usage evidence contract in usage-telemetry.md. Keep it as a separate evidence dimension; do not turn token count into a hidden composite score or universal Tool ranking. Comparisons and reports must keep measured runtime usage, estimated repository context, and unavailable usage separate. A comparison with an optional usage object must still satisfy the same provenance and arithmetic checks as an evaluation run.
