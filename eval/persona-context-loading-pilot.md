# Persona context loading pilot

This one-case experiment asks whether focused Persona files improve retrieval without adding selection overhead or weakening the answer. It does not change live Persona records, generation guidance, routing, or confidence labels.

The fixture is [a hypothetical frontend review](fixtures/persona-context-loading-pilot.json). It requires a building perspective and task-specific review, with UX and data ownership preserved. It must not turn the expert Persona into an observed end-user segment or a repository steward.

## Fair comparison

- **Current:** derive a compact index from the existing generated library, then selectively extract the chosen Persona and its existing workflows, Skill applications, Tool requirements, and handoffs. Do not send the entire library to the model.
- **Focused:** read an identical prepared index, then the identical selected profile from one derived JSON file.
- Both paths allow one selection followed by one profile-loading call. Read extra references only if the task needs them; record those calls. For an explicitly named Persona, skip the index in both paths.
- Temporary derived profiles carry the source-bundle hash. Reject stale or mismatched input before comparing results. They remain experimental projections, not authored sources or live capability evidence.

Run `node eval/persona-context-loading-pilot.mjs benchmark` for 30 alternating filesystem pairs after five warmups. The command checks exact content parity and reports local timing, filesystem bytes, and model-visible context bytes separately. Preparation is outside repeated timing and reported separately. Filesystem caches are not flushed.

## Agent trial

Run one fresh temporary worker per path with the identical fixture task, requested model/reasoning effort, output limit, and read-only permissions. Give neither worker the other answer or expected Persona ID. Run sequentially to reduce cross-trial contention. Workers may read only the fixture data for their assigned path; no web research, repository edits, additional agents, or unrelated routing loops.

Each worker records UTC start/end around context loading and construction of its answer, selected Persona ID, assigned work mode, context-loading tool calls, extra reads, and at most 200 words of recommendation. Shared standing policy and startup are outside this timer. Report settings as requested unless independently confirmed. Retain raw worker output privately; persist only sanitized observations.

The coordinator checks all six fixture acceptance criteria against the actual answers. A content-preservation assertion is not a substitute for this review. Report the recorded worker interval separately from file-read timing; it ends before delivery and does not measure user-observed time to the answer. A single pair is a smoke test, not a statistically reliable speed claim or cross-runtime proof.

## Adoption rule

Keep the existing loading path unless the focused approach preserves the answer, avoids extra selection/reference loops, and offers a useful measured benefit. Reduced filesystem bytes alone do not establish reduced allowance use or faster agent work. Test unknown-Persona discovery, stale input, richer purpose-specific profiles, and other Persona purposes before any broader migration.

## Observed trial

Run on 2026-10-03, using source revision `2d206aa48e5668e38c9ec54d3bda55ad4d341c7a` and generated-bundle SHA-256 `0c853dddaa6707bd2cee7e0078a2bb53e68cbd74b05089bd3276c9de265c5c0c`. Node was v24.19.0 on Windows. Derived files were prepared in the host's temporary directory, outside canonical content.

### Local retrieval

Thirty measured pairs followed five warmup pairs, with alternating order and filesystem caches left intact. Preparing the index and all derived profiles took 46.458 ms, excluded from the repeated timings. Exact serialized index/profile parity passed in every pair.

| Measurement | Current selective extraction | Focused derived files |
| --- | ---: | ---: |
| Median retrieval | 9.780 ms | 0.871 ms |
| p95 retrieval | 12.057 ms | 1.245 ms |
| File reads per task | 2 | 2 |
| Filesystem bytes read | 919,192 | 35,419 |
| Serialized context bytes supplied | 35,419 | 35,419 |

The focused path saved 8.909 ms at the median. Both paths supplied identical context. The byte count measures the two JSON payloads, not prompt overhead, token counts, or account allowance use.

### One paired worker trial

Two fresh temporary workers were created sequentially with GPT-6.1 Sol and medium reasoning requested. Those settings were not independently confirmed. The current worker recorded 19:37:02-19:37:20 UTC; the focused worker recorded 19:38:38-19:38:52 UTC. Clock resolution was one second; startup, shared-policy preparation, and final delivery were outside the interval. Each worker reported matching source hashes.

| Observation | Current | Focused |
| --- | ---: | ---: |
| Recorded loading/answer-construction interval | 18 s | 14 s |
| Context-loading tool calls | 2 | 2 |
| Additional context calls | 0 | 0 |
| Recommendation words (whitespace-delimited) | 185 | 179 |
| Fixture acceptance checks passed by coordinator review | 6/6 | 6/6 |

Review of the actual answers found that both selected Evan Reyes (`frontend-systems-engineer`), assigned review despite execute being his first preference, proposed summary-first reads and selected-project detail loading, preserved UX/data decision ownership, and named focused payload, failure, and keyboard validation. Both kept the scenario hypothetical, excluded offline synchronization, and claimed no implementation or runtime evidence. Neither changed Persona confidence metadata or initiated additional delegation. Raw answers remain in private worker history; this report stores only observations.

The four-second difference is an observation from one pair with current always run first. It cannot separate loading effects from model variability, tool latency, or order effects. The repeated filesystem measurements are not repeated worker trials. Quality review covers this task only; the scenario's implementation tests were proposed, not executed.

### Decision

Keep the current selective extraction approach for now. This pilot preserved the answer without extra selection calls, but demonstrated no context reduction and only a small local retrieval saving. It does not justify a library-wide file migration or additional orchestration machinery. Unknown-Persona discovery, stale snapshots, richer profiles, and end-user/repository purposes remain untested. Revisit only if those concrete needs or measured runtime costs justify another bounded comparison.
