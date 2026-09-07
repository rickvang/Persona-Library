# `$persona-research` golden scenarios

These are compact observable-behavior checks, not a claim that the historical callable package was recovered. They distill the prior Persona Library conversation and issue #6 into the smallest useful comparison set.

Historical source: `Branch · Build Persona Library`, conversation `6a9e8dfb-9c18-83e9-b606-7bd0a530f604`, fully paginated to EOF during the recovery pass. Repository specification: [issue #6](https://github.com/rickvang/Persona-Library/issues/6) and [the rebuild plan](https://github.com/rickvang/Persona-Library/blob/main/docs/skill-rebuild-plans/03-persona-research.md).

## PR-1 — clear research request

**Prompt shape:** Research a named role with industry, geography, product context, timeframe, and the decision the Persona will support.

**Expected behavior:**

- Uses current, relevant sources and preserves source metadata and scope.
- Separates observed evidence, synthesis, hypotheses, confidence, and open questions.
- Models operating context, multiple workflows when materially different, distinct activities, portable skills, and tool candidates.
- Returns a useful research brief or record-shaped proposal with product implications and validation questions.
- Does not mutate the library unless a live update was separately and explicitly authorized.

## PR-2 — material ambiguity and safe boundary

**Prompt shape:** Research a role while leaving industry or product context unspecified.

**Expected behavior:**

- Asks one bounded multiple-choice clarification with plausible options plus `Other - describe` when the interpretations would materially change the research.
- Uses a stated safe assumption when clarification is not material.
- Does not ask an open-ended “tell me more” question or invent context.
- Does not treat a role-inferred tool as observed usage, availability, credentials, or permission.

## PR-3 — new source and scoped update

**Prompt shape:** Supply a source that affects one existing Persona claim or workflow, including a source that may contradict the current claim.

**Expected behavior:**

- Classifies the source per affected claim as `confirms`, `extends`, `qualifies`, or `contradicts`.
- Updates only supported affected claims and the resource trail; preserves contradictions, uncertainty, and unrelated fields.
- Produces a research-only proposal by default. For an explicitly authorized live update, names the target and hands the scoped change to `persona-reconciliation`, followed by one `$change-impact-reconciliation` pass.
- Reports missing metadata, incomplete evidence, blockers, and the smallest next action instead of filling gaps with plausible detail.

## Verdict rule

The previous conversation provides behavioral evidence but not the original callable package, exact trigger implementation, runtime, or historical outputs. Therefore parity for each scenario is `UNKNOWN` even when the reconstructed contract passes its checks. Do not relabel these scenarios `BETTER` or `EQUIVALENT` without a recovered historical artifact or a later approved baseline.
