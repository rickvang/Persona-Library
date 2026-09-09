---
name: persona-skill-conformance
description: Run isolated conformance tests for Persona–Skill pairs in fresh low-reasoning Codex tasks, evaluate the responses, and archive the temporary tasks.
metadata:
  skill_layer: orchestration
  change_mode: external_execution
  change_domain: conformance-evaluation
  reconciliation: change-impact-reconciliation
---

# Persona–Skill Conformance

## Purpose

Run a repeatable test matrix in which one canonical Persona and one of its Skills are loaded into a fresh task, the Skill receives one bounded question, and the response is checked against the Skill profile and quality signals. Keep each test isolated so a result does not depend on another Persona, a previous conversation, or an unrelated shared context.

This Skill coordinates test execution and evidence capture. It does not change Persona, Skill, Tool, Playbook, or production workflow records.

## Use this Skill when

- the user wants to test every Skill belonging to one Persona;
- the user wants to test every live Persona–Skill pair;
- a prompt, model, or runtime change needs a repeatable Persona-specific regression pass;
- a response should be evaluated in a clean task and the temporary task archived afterward.

Do not use it for a general multi-Persona consultation, a live Persona update, provider comparison without comparable conditions, or production telemetry.

## Required preflight

1. Read `content/site-orientation.json`, `AGENTS.md`, `ARCHITECTURE.md`, `eval/skill-cases.json`, and `eval/isolated-persona-skill.mjs`.
2. Resolve the scope explicitly. The default is all live Personas and all Skills in their canonical `skillLibrary`; prototype records are excluded.
3. Confirm the requested model and reasoning level. The default reasoning level is `low`; keep the model at the requester’s configured default unless the user specifies one.
4. Prepare the matrix with:

   ```text
   node eval/isolated-persona-skill.mjs matrix --personas all --skills all
   ```

5. Treat each generated matrix entry as one isolated test case. Do not combine multiple Persona records in the same test task.

## Isolated task contract

For each matrix entry, create a fresh Codex task using the currently exposed Codex task tools:

- `mcp__codex_app__create_thread` with `thinking: "low"`;
- use a projectless target when the injected fixture is self-contained, so the test cannot read unrelated repository state;
- use a repository worktree only when the fixture explicitly tests repository context;
- inject only the selected Persona summary, selected Skill profile, quality signals, and one test prompt;
- state that no other Persona, Skill, Playbook, Tool, previous task, or shared context may be loaded;
- do not allow the test task to edit, publish, send external messages, or claim unavailable Tool use.

The task prompt must ask for an answer that makes the Skill observable. It should request the relevant approach, assumptions, evidence or checks, limitations, and next action rather than hidden reasoning.

## Run and archive procedure

1. Generate the matrix and assign a unique `run_id`.
2. Create one fresh task per selected case. The task title should include the run ID, Persona ID, and Skill ID.
3. Run independent tasks in bounded batches. `mcp__codex_app__wait_threads` supports waiting on up to eight task IDs at once; keep enough metadata to map every completion back to its case.
4. Read each completed task with `mcp__codex_app__read_thread` and capture only the final response and the evidence needed for the normalized result.
5. Check the result with:

   ```text
   node eval/isolated-persona-skill.mjs evaluate <result.json>
   ```

   The check covers Persona–Skill identity, low reasoning, clean isolation, response-contract completeness, every expected quality signal, unavailable-access honesty, and unauthorized mutation claims.
6. After capture, archive the task with `mcp__codex_app__set_thread_archived` using `archived: true`. The current Codex tool surface supports archiving; it does not expose reliable deletion of individual messages or tasks.
7. Write one sanitized bundle under `eval/results/isolated/`. Do not commit raw transcripts, private prompts, credentials, or sensitive traces.
8. If the observer is the same runtime or unavailable, preserve that status and set the run-level conformance verdict to `UNKNOWN` or `REVIEW`. A structurally valid response is not independent conformance evidence.

## Result contract

Each result must preserve:

- `run_id`, `case_id`, `persona_id`, and `skill_id`;
- model, model version, surface, repository reference, and `reasoning_effort: "low"`;
- task ID and lifecycle state for created, completed, and archived;
- isolation conditions, including exactly one loaded Persona and Skill;
- the six response-contract fields from the library orientation contract;
- one `quality_checks` entry for every expected quality signal, with a boolean result and evidence;
- claims about Tool execution or mutation, if any;
- observer availability and independence;
- evidence references and limitations.

Use `eval/isolated-persona-skill.mjs` for deterministic shape and contract checks. Keep semantic judgments attributable to the runner or an explicitly independent observer.

## Failure and fallback

- If task creation is unavailable, stop live execution and return the generated matrix plus an access-gap record. Do not fabricate a response.
- If a task does not complete, record the task ID, status, case, and recovery action; archive it when the tool permits.
- If the response loads another Persona or Skill, classify the case as a failed isolation check.
- If a Tool, credential, repository, or permission is unavailable, record the access condition and evaluate the response’s honesty separately from its usefulness.
- If evaluation fails, preserve the result as `REVIEW` and identify the smallest correction. Do not silently rerun until a pass appears.
- If archiving fails, retain the task ID and report the cleanup failure; do not claim it was deleted.

## Boundaries and reconciliation

This Skill performs controlled external task execution and creates sanitized evaluation artifacts. It may archive temporary tasks created by its own run, but it may not mutate canonical library records, grant permissions, configure credentials, publish, or close issues.

After a run creates or updates a durable result bundle, hand the change to `$change-impact-reconciliation` once. Check the result path, Work Order observation record, generated or canonical sources that supplied the matrix, and unchanged Persona, Skill, Tool, Playbook, and private-data boundaries. Do not recursively invoke reconciliation.

## Output contract

Return:

- outcome and effective mode;
- selected Persona and Skill scope, case count, and exclusions;
- run ID, model, reasoning level, surface, and task lifecycle summary;
- result and quality-check summary by case;
- observer status and conformance verdict;
- archived task IDs and any cleanup failures;
- result bundle path and validation evidence;
- assumptions, access gaps, limitations, and the smallest next action.

Do not claim that a Persona or Skill passed merely because a task completed. Report contract validity, quality evidence, and independent observation as separate signals.
