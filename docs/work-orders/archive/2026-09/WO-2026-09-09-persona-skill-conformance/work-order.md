# Isolated Persona–Skill conformance runner Work Order

## Header

- Work Order ID: `WO-2026-09-09-persona-skill-conformance`
- Title: Build an isolated Persona–Skill test runner
- Status: complete
- Created: 2026-09-09
- Requester: rickvang
- Implementation owner: Codex
- Request mode: update
- Change mode: external execution plus artifact generation
- Change domain: conformance evaluation and repository-local Skill packaging
- Artifact home: `docs/work-orders/WO-2026-09-09-persona-skill-conformance/`
- Authorized repository target: `C:\_Projects\Persona-Library`
- Related issue: GitHub issue creation is pending because the current environment does not expose the `gh` CLI or a GitHub connector.
- Stopping condition: the callable Skill, generated Persona–Skill matrix, result contract, task lifecycle instructions, validation evidence, and boundaries are reviewable.

## Request and scope

Build a reusable Skill that tests each selected Persona’s Skills in isolation. Each test should use a fresh low-reasoning Codex task, inject one Persona–Skill pair, ask one bounded question, check the response, capture a sanitized result, and archive the temporary task.

## Placement and boundary review

Mara’s placement gate resolves the proposal as an extension of the existing conformance workflow plus one callable orchestration package:

- `eval/` remains the source for generated matrix logic, skill test defaults, result validation, and sanitized isolated-run evidence.
- `.agents/skills/persona-skill-conformance/` is the callable orchestration package because the capability creates and observes temporary Codex tasks.
- `content/library-data.js` remains canonical for live Personas and Persona-specific Skill applications; no new Persona or canonical Skill record is added.
- `eval/results/isolated/` is the evidence boundary for sanitized run results; raw transcripts and private traces remain outside the repository.
- No new top-level library space, Tool record, Playbook, database, credential, or production runtime is created.

The package reuses the existing `Evaluation and observability` catalog capability and the conformance observer boundary. The new package supplies the repeated isolated-run method that the prior Work Order left as future work.

## Implementation progress

- [x] Read orientation, architecture, Work Order, package-authoring, tool-safety, and reconciliation guidance.
- [x] Define the Persona–Skill matrix as one generated case per canonical `skillLibrary` profile.
- [x] Add default and overrideable isolated test-case configuration.
- [x] Add deterministic matrix, prompt, result-shape, quality-signal, and task-lifecycle evaluation logic.
- [x] Add the callable orchestration Skill and UI metadata.
- [x] Add isolated-result storage guidance and golden contract scenarios.
- [x] Run one Codex task smoke test and verify archive behavior.
- [x] Run repository validation and the required read-only change-impact reconciliation.

## Evidence and uncertainty

| Item | Status | Boundary |
| --- | --- | --- |
| User request | `authorized` | User authorized building the runner and described fresh low-reasoning task execution with cleanup. |
| Persona and Skill matrix | `repository_observed` | Derived from the current canonical `content/library-data.js`; prototype records are outside the matrix. |
| Task-tool lifecycle | `observed` | A fresh projectless low-reasoning task completed, was read, and was archived; an earlier prompt edge case was also archived safely. |
| Independent conformance | `unknown` | The runner records observer status separately and does not infer independent observation from its own checks. |
| GitHub issue tracking | `access-gap` | `gh` and a GitHub connector are unavailable in this environment. |

## Reconciliation report

### Persona-specific adapter

- Status: `complete for repository scope`.
- Change observed: a new orchestration Skill package and isolated evaluation method were added; canonical Persona and Skill records remain unchanged.
- Classification: `extends` the existing conformance workflow with repeatable Persona–Skill execution; `reuses` the existing `Evaluation and observability` capability; `qualifies` conformance claims through explicit observer status; no live Persona was replaced.
- Checked: generated matrix source, Persona and Skill identifiers, quality-signal sourcing, result storage boundary, task lifecycle fields, and existing conformance route.
- Unchanged: canonical Persona records, canonical Skill catalog, Tool records, Playbooks, private task content, credentials, and provider integrations.

### Universal change-impact pass

- Status: `complete for bounded repository scope`.
- Checked: `content/site-orientation.json`, generated `dist/data/site-orientation.json`, `.agents/skills/persona-skill-conformance/`, `eval/skill-cases.json`, `eval/isolated-persona-skill.mjs`, `eval/results/isolated/`, README, ARCHITECTURE, Work Order, and collaboration context.
- Required follow-up: none for the implemented scope.
- Optional follow-up: create provider-specific adapters only after their runtime, permissions, retention, and observer boundaries are authorized.
- Unknown or incomplete visibility: semantic quality remains dependent on the recorded quality checks; independent Noor observation is unavailable for the smoke run; GitHub issue creation was unavailable because no CLI or connector is exposed.
- Handoff count: placement review, implementation, Persona-specific review, and one universal pass; no recursive reconciliation.

## Completion gate

Passed. The package is discoverable, the generated matrix and evaluator pass local checks, one isolated task was created and archived successfully, and the result evidence preserves isolation, quality checks, access conditions, and observer uncertainty. Detailed evidence is in [`validation.md`](validation.md).

## Next action

Invoke `$persona-skill-conformance` with a selected Persona and Skill scope. Use `personas: all` and `skills: all` for the full 94-case matrix, or select a bounded subset for faster regression checks.
