# Token-usage evidence and context-cost reporting

Status: evaluation evidence contract for measured runtime usage, static context estimates, and unavailable usage.

## Measurement boundary

Keep three evidence classes distinct:

- measured: exact counts returned directly by a named runtime/provider response;
- estimated: a reproducible estimate of named repository-owned text at a pinned commit;
- unavailable: the runtime did not expose a token ledger, or the relevant context could not be reconstructed.

A plan allowance, usage-limit percentage, response latency, character count, or inferred count is not measured per-turn token usage. Never combine measured and estimated values into one unlabeled statistic. The estimator reports repository-owned text only; it does not represent hidden instructions, prior conversation, tool schemas/results, provider wrappers, compaction, reasoning, delegated work, or prompt construction outside the named artifacts.

## Normalized usage object

The optional usage object is accepted at run level or at an individual result/turn level. Existing schema 1.0 bundles without usage remain valid.

Required distinctions:

- measurement: measured, estimated, or unavailable;
- scope: run, turn, or context;
- measured turn records include a stable turn_id and named source;
- estimated records use context scope, include input_tokens, name the estimator, list artifact paths, and pin the full repository commit SHA;
- unavailable records include source and reason and leave all token counts null or omitted.

Run-level totals and result-level turn observations are different samples. Preserve both if the runtime returns both, but reports keep their scopes separate; do not copy a run total onto every fixture result. Static estimates use context scope. No value should be inferred from the other scopes.

Cached input is a subset of input, and reasoning tokens may be included within output when the provider defines them that way. When both a subcategory and its parent count are present, the common contract rejects a subcategory larger than its parent. It reconciles total_tokens only when input_tokens, output_tokens, and total_tokens are all present; provider adapters may enforce additional documented semantics.

input_tokens is the canonical normalized estimate field. The estimate example using estimated_input_tokens is not a second field or parallel schema.

## Static estimator and report

The command is implemented in eval/context-usage.mjs and has no dependency or provider credential requirement:

    node eval/context-usage.mjs measure AGENTS.md content/site-orientation.json
    node eval/context-usage.mjs measure docs/work-orders/WO-example/work-order.md --ref <full-commit-sha>
    node eval/context-usage.mjs routing-baseline --ref <full-commit-sha>
    node eval/context-usage.mjs report eval/results/token-usage/

Each estimate computes ceil(total UTF-8 bytes of the named file text / 4). This is a clearly labeled character/byte approximation, not a tokenizer. It is suitable for consistent structural comparisons of the same named files and should not be read as a provider token count. The command requires a full Git commit SHA, using HEAD when ref is omitted. It resolves both the file set and file contents from that commit's Git tree, so uncommitted working-tree edits cannot be mixed into a pinned estimate. Paths outside the repository, symlinks, and unsupported Git objects are rejected. The reporter reads only explicitly supplied local JSON evidence files.

The routing baseline measures AGENTS.md, content/site-orientation.json, the selected route-group file, and the selected Skill package for each representative route: Docs/system orientation, Persona research, Skill maintenance, Tool discovery/execution, Playbook work, Template work, and prototype/layout work. It does not include task evidence, issue text, Work Orders, tools, hidden prompts, or outputs. Re-run against a pinned revision to compare changes over time.

The script writes machine-readable JSON to stdout and a concise human summary to stderr. Reports separate measurement class and scope, then report mean, median, and nearest-rank p90 where numeric observations exist. They include breakdowns by surface/model, request mode, primary space, route, and Skill. Unavailable observations are counted but have no token statistics.

Calibration pairs are stored without prompts or raw traces. Each pair pins the repository revision and carries one context estimate and one directly measured turn with the same route attribution. The reporter calculates signed error as estimate minus measured input; positive values mean the estimate is higher. It reports median signed error, median absolute percentage error, and nearest-rank p90 absolute percentage error overall and by surface/model, route, task class, and estimated context-size band. Samples with measured input_tokens equal to zero are excluded from percentage-error metrics and counted separately.

A calibration follow-up review becomes eligible only after at least 20 pairs, at least 3 task classes, no class above half the samples, and pinned revision plus named surface/model for every pair. This is a review trigger, not a statistical-significance claim. The reporter does not create issues, correction multipliers, or hard validation budgets.

## Surface observability matrix

| Surface class | Exact per-turn tokens | Aggregate/allowance usage | Static context estimate | Treatment |
| --- | --- | --- | --- | --- |
| Ordinary ChatGPT conversation | Only when the product/runtime explicitly returns it to the execution workflow | Plan or limit information may be available without a per-turn ledger | Yes, for named Persona-Library files | Mark runtime tokens unavailable unless directly exposed |
| Work, Codex, and delegated tasks | Surface-dependent; capture only fields actually returned | Surface-dependent | Yes | Preserve provenance and omissions; do not infer hidden sub-agent, tool, or background usage |
| OpenAI API Responses | The response object can expose input_tokens, output_tokens, total_tokens, cached input details, and reasoning output details | API usage is a separate aggregate surface | Yes | Normalize only the returned response.usage metadata; do not retain prompt or full trace |
| Unknown or external runtime | Unknown until inspected | Unknown | Sometimes | Record unavailable rather than guess |

The OpenAI Responses API documents the response usage object and its input/output details in the [official API reference](https://platform.openai.com/docs/api-reference/responses-streaming/response/output_item?lang=node.js). Subscription allowance and API request usage describe different scopes and must not be presented as comparable per-turn values.

Verify the observability matrix against current product behavior when a new adapter is implemented or materially revised. The current Codex task execution does not expose exact per-turn token metadata to this implementation, and no metered API request was made for this change. The OpenAI adapter normalizes a supplied API response object, but the first recorded measured sample remains outstanding.

## Calibration and confidentiality

For paired calibration, pin one commit and the exact context artifact list, then run the same bounded task on a surface that returns exact usage. Record model/runtime, route, Skill, task class, static estimate, direct measured counts, and only necessary metadata. Do not attribute the estimate/runtime gap solely to tokenizer error; hidden instructions, conversation state, provider wrappers, tools, and execution history may contribute.

Never commit raw provider traces, private prompts, credentials, conversation histories, or sensitive execution logs. A sanitized usage record does not need full prompt capture. Store only evidence authorized for Git under eval/results/. Token count is one observational dimension; it is never sufficient by itself to judge quality or rank Tools.

The normalized usage object may be included in recipe comparisons as optional evidence. It does not alter canonical Skills, Tool records, or execution guidance without separate review and authorization.
