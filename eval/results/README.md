# Recorded results

This directory accepts sanitized normalized result records for local evaluation. Files here are examples or reviewed evidence only; they are not a claim that an external model or provider was executed.

Each single-record file should identify the fixture, model and version, assistant surface, repository reference, supplied context, available and attempted Tools, permission results, response-contract fields, claims, evidence, and review status.

For a multi-fixture run, use a compact schema-1.0 bundle with run-level conditions and a `results` array. `node eval/run.mjs scan-results <directory>` expands bundles in memory and evaluates every fixture result. Each entry must preserve both `result_class` (what happened in the fixture) and `observation.observer` / `observation.conformance_verdict` (whether independent observation and conformance were established). A `PASS` from the evaluator means the normalized response contract and safety checks passed; it does not prove cross-LLM parity.
