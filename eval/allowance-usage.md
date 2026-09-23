# Subscription allowance usage measurement

Status: primary resource-consumption evidence contract for included ChatGPT Work / Codex usage.

## Purpose

This contract answers a different question from token telemetry:

> How much of the user's included Work / Codex allowance did a real task consume?

The primary evidence is the allowance state exposed by the subscription-backed product surface before and after a task. Preserve the unit the product exposes. A percentage stays a percentage; credits stay credits. Do not translate either into tokens.

The token/context subsystem in `usage-telemetry.md`, `context-usage.mjs`, and `adapters/openai-responses.mjs` remains useful secondary diagnostic evidence. It may help explain context footprint or runtime behavior, but it is not a substitute for subscription allowance consumption and no paid API request is required by this contract.

## Supported observation sources

The first implementation accepts normalized observations from:

- Codex `/status`, when it exposes allowance/limit state;
- ChatGPT Settings → Usage, recorded as a structured manual/reference observation;
- later first-party surfaces through new adapters that produce the same snapshot shape.

The repository does not scrape private account UI. Adapters normalize captured values and provenance; they do not sign in, navigate settings, buy credits, use banked resets, or make API calls.

OpenAI documents that included Work/Codex usage can depend on model, task complexity, context, reasoning, speed, and tools, and that applicable surfaces may share an allowance in [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan%28.pdf). It also documents that the usage dashboard can take a short time to update in [How banked Codex resets work](https://help.openai.com/en/articles/20001498-how-banked-codex-resets-work). Those product facts are reasons to record model/task metadata, update-lag caveats, and concurrent-usage caveats rather than infer a hidden exact ledger.

## Snapshot shape

Each snapshot contains a source, an observation time, and one or more independently comparable windows:

```json
{
  "source": "Codex /status",
  "observed_at": "2026-09-23T19:00:00Z",
  "windows": [
    {
      "window_id": "five_hour",
      "unit": "percent",
      "mode": "remaining",
      "value": 72,
      "reset_at": "2026-09-23T23:00:00Z",
      "resolution": 1
    },
    {
      "window_id": "weekly",
      "unit": "percent",
      "mode": "remaining",
      "value": 41,
      "reset_at": "2026-09-28T00:00:00Z",
      "resolution": 1
    }
  ]
}
```

`mode` is either `used` or `remaining`. Consumption is `after - before` for a used meter and `before - after` for a remaining meter, so normal consumption is positive in both cases.

`resolution` is optional and describes the smallest visible meter increment when known. It is evidence about the display, not a guessed provider accounting unit.

## Task observation shape

```json
{
  "schema_version": "1.0",
  "record_type": "allowance-task-observation",
  "task": {
    "task_id": "cw-50-c02",
    "issue": 195,
    "current_work_id": "CW-50",
    "task_class": "implementation",
    "surface": "codex",
    "model": "model-as-observed",
    "reasoning_level": "medium",
    "speed": null,
    "orchestration": "riley",
    "route_id": "skill-package-maintenance",
    "skill_id": null,
    "started_at": "2026-09-23T19:00:00Z",
    "completed_at": "2026-09-23T19:10:00Z"
  },
  "before": { "source": "Codex /status", "observed_at": "...", "windows": [] },
  "after": { "source": "Codex /status", "observed_at": "...", "windows": [] },
  "flags": {
    "concurrent_usage_possible": false,
    "update_lag_possible": false
  }
}
```

Raw prompts, account identifiers, credentials, conversation text, and full tool traces are not required.

## Outcome classes

Each comparable window is classified independently:

- `measured` — a comparable before/after meter yields a non-negative observable delta and no material caveat is recorded;
- `measured_with_caveat` — a delta exists, but concurrent usage or product update lag may contribute;
- `below_resolution` — a meter with known coarse resolution did not visibly move;
- `reset_crossed` — the allowance reset during the observation interval, so normal subtraction is invalid;
- `unavailable` — before/after state is missing, units or modes are incompatible, the meter moved in an unexplained direction, or comparable state is otherwise unavailable.

Do not coerce an unavailable or reset-crossing observation into a number. Do not treat `below_resolution` as zero consumption.

## Commands

Create a local session from task metadata and a sanitized pre-task snapshot, then finish it with a post-task snapshot:

```text
node eval/allowance-usage.mjs start <task.json> <before-snapshot.json> <session.json>
node eval/allowance-usage.mjs finish <session.json> <after-snapshot.json> <observation.json>
```

The session/observation paths are caller-selected; keeping them outside Git is appropriate until the final observation has been reviewed and explicitly authorized for repository evidence.

Validate and classify one sanitized observation:

```text
node eval/allowance-usage.mjs check <observation.json>
```

Aggregate one or more files/directories:

```text
node eval/allowance-usage.mjs report eval/results/allowance-usage/
```

The reporter keeps each `window_id + unit` separate. Core mean, median, and nearest-rank p90 statistics use only uncaveated `measured` deltas. Caveated deltas and nonnumeric outcomes remain visible as separate counts.

Reports also break comparable evidence down by task class, surface/model, reasoning level, orchestration mode, and Persona-Library route when present.

## Adapter boundary

`adapters/codex-status.mjs` and `adapters/settings-usage.mjs` accept structured observations rather than unstable screen text. For each window they accept either the normalized `value + unit + mode` form or exactly one convenience field such as `remaining_percent`, `used_percent`, `remaining_credits`, or `used_credits`.

A changed product display should require only an adapter update when the underlying observable semantics remain the same.

## Concurrency, lag, and resets

Work/Codex allowance can be shared across supported agentic surfaces. If another Work/Codex task may have consumed the same allowance between snapshots, set `concurrent_usage_possible: true`. The resulting delta remains observed but is classified `measured_with_caveat` rather than attributed solely to the named task.

If the post-task usage display may not have refreshed yet, set `update_lag_possible: true`. Prefer a later observation when practical; never invent the expected change.

If a reset timestamp falls between snapshots, or the reset boundary visibly advances after it is crossed, classify the window `reset_crossed`. Do not subtract across the reset.

## Secondary token/context evidence

The #202 token/context subsystem can be joined later by task/run identity to investigate whether larger Persona-Library context tends to correlate with higher allowance consumption. That correlation is not assumed, and a token count cannot fill in a missing allowance observation.

API request usage and subscription allowance are different scopes. No OpenAI API key, API charge, or token-calibration run is an acceptance requirement for this contract.

## Evidence storage

Only explicitly authorized, sanitized observations suitable for Git belong under `eval/results/allowance-usage/`. Keep screenshots, private account details, raw `/status` transcripts that contain unrelated private material, and other sensitive traces outside Git. Prefer the minimal structured values needed to reproduce the calculation.
