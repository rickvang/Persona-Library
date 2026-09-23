# WO-2026-09-23-token-usage-telemetry

- Status: complete
- Created: 2026-09-23
- Last updated: 2026-09-23
- Requester: Rick
- Current owner: Riley Morgan / ai-orchestrator
- Request mode: update
- Authorized target: Persona-Library issue #195
Artifact home: docs/work-orders/archive/2026-09/WO-2026-09-23-token-usage-telemetry/

## Request and outcome

Implement the evaluation-layer usage contract and context-cost reporting for [Persona-Library issue #195](https://github.com/rickvang/Persona-Library/issues/195). Keep direct runtime usage, static repository-context estimates, and unavailable evidence distinct. Preserve compatibility with existing run bundles and keep private prompts, credentials, and raw traces out of Git.

## Scope

- Extend eval/contract.mjs with optional normalized measured, estimated, and unavailable usage; run/turn/context scope; provenance, arithmetic, and current orientation taxonomy checks; and a controlled calibration-pair contract.
- Add eval/context-usage.mjs for explicit path estimates, a seven-route baseline, sanitized aggregation, and calibration error reporting.
- Add the OpenAI Responses usage normalizer only for a response object supplied by a caller; it performs no request or credential access.
- Update the observation template, recipe-comparison contract docs, eval adapter guidance, README, and architecture boundary.
- Add focused Node tests under scripts/validation for the normalized contract, adapter behavior, report separation/percentiles, and calibration metrics.
- Record a pinned static routing baseline at eval/results/token-usage/routing-baseline-d93a4c7.json.
- Do not add a database, production UI, billing estimate, or hard regression budget.

## Placement review

A read-only repository-defined Mara placement review was completed against current main. It placed this work in eval/ and recommended:
- keep the existing usage and conformance contract in eval/contract.mjs;
- put the estimator/reporter in eval/context-usage.mjs;
- add a focused eval/usage-telemetry.md contract;
- keep direct-usage normalization under eval/adapters/ and only read provider metadata returned directly;
- store authorized, sanitized evidence under eval/results/;
- do not add a canonical Persona, Skill, Tool, database, or new top-level taxonomy.

This was a source-grounded placement review, not a live consultation with a human Mara record.

## Evidence and limits

- Issue #195 and the repository's current orientation/evaluation contracts are the implementation sources.
- The OpenAI Responses API reference documents an optional response usage object with input/output/total counts, cached-input detail, and reasoning-output detail.
- The current Codex execution surface does not expose exact per-turn token metadata to this implementation. The OpenAI adapter accepts a supplied direct response object, but no metered API request was made and no measured sample was fabricated.
- The pinned initial route baseline is an approximate UTF-8 byte-count divided by four over named repository files. It does not represent complete prompts or runtime usage.
- The issue's end-to-end measured-runtime sample remains outstanding; this Work Order cannot claim issue #195 complete until a real response record is produced or the acceptance boundary is revised.

## Decisions

- Canonical estimate field: input_tokens with measurement estimated; estimated_input_tokens is not a parallel field.
- Scope distinguishes run totals, direct turns, and static context. Aggregation never mixes evidence class or scope.
- cached_input_tokens and reasoning_tokens are explanatory subcategories; the provider adapter documents their semantics and the shared arithmetic check uses only input + output = total.
- Calibration signed error is estimate minus measured input. Zero measured input is excluded from percentage-error statistics.
- The operational calibration review gate is 20 pairs, 3 task classes, no class above half the samples, and pinned revision/surface/model. The report flags eligibility; it does not create issues or apply correction factors.

## Phases and gates

1. Placement — complete; destinations and non-goals resolved.
2. Contract, adapter, static estimate/report, documentation, tests, and pinned route baseline — included in the review branch.
3. Validation — review the PR checks and conduct targeted code review. No local checkout or shell execution is used under Persona-Library repository instructions.
4. Runtime proof — blocked pending an authorized, metered API response or another directly observable usage surface. The adapter is not proof of a captured runtime sample.
5. Reconciliation — after review/merge disposition, run the scoped change-impact reconciliation and update linked Current Work.

## Authorization and safety

The requester authorized implementation in Persona-Library for issue #195. This authorizes the scoped branch and pull request. It does not authorize spending on a metered API request, storing provider prompts/traces, changing production services, adding credentials, or merging the pull request.

## Deliverables

- Issue: https://github.com/rickvang/Persona-Library/issues/195
- Branch: codex/cw-40-token-usage-reporting
- Usage contract: eval/usage-telemetry.md
- Estimator/report: eval/context-usage.mjs
- Focused validation: scripts/validation/token-usage.test.mjs
- Normalized contract: eval/contract.mjs
- Adapter: eval/adapters/openai-responses.mjs
- Baseline: eval/results/token-usage/routing-baseline-d93a4c7.json

## Current state and next action

The implementation, focused tests, pinned baseline, docs, and Work Order are included in one reviewable branch update. Review the configured PR checks and resolve findings. The independently missing measured runtime sample remains outstanding for issue #195; do not infer it from subscription allowance or the static baseline.


## Scope correction and terminal disposition — 2026-09-23

This Work Order is complete and archived as the historical delivery record for PR #202. It correctly implemented the token/context telemetry scope that issue #195 contained at the time.

A later intent-to-implementation audit of CW-40, #195, PR #202, this Work Order, and VQ-1 found that the issue itself had drifted from the requester's original primary objective. The intended metric is task-level consumption of included Work/Codex subscription allowance, not paid API token telemetry. The corrective implementation is tracked separately in CW-50 and the updated #195.

Accordingly:

- the PR #202 token/context subsystem remains valid secondary diagnostic infrastructure;
- the former metered-API runtime proof is no longer an acceptance gate for #195;
- VQ-1 is cancelled as a superseded verification and must not be run or requeued;
- no API authorization or spend is required by this historical Work Order;
- this package is terminal historical evidence and should not be treated as active work.
