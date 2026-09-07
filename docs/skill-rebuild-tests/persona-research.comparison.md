# `$persona-research` checkpoint comparison

## Recovery basis

This package is a careful reconstruction from the fully paginated historical conversation, the current repository contract, and issue #6. No exact historical callable package was found in the repository or current skill registries.

## Focused checks

| Check | Result | Evidence |
| --- | --- | --- |
| Package structure | PASS | `SKILL.md`, `agents/openai.yaml`, and three focused references are present. |
| Required metadata | PASS | `change_mode: source_update`, `change_domain: personas`, and `reconciliation: persona-reconciliation` are declared. |
| PR-1 clear research contract | PASS (contract review) | Source/evidence separation, context, workflows, activities, skills, tools, resources, confidence, and validation are required in `SKILL.md`. |
| PR-2 ambiguity/safety contract | PASS (contract review) | Bounded clarification, safe defaults, no invented context, and no inferred tool availability are explicit. |
| PR-3 scoped source/update contract | PASS (contract review) | Four source classifications, affected-scope edits, contradiction preservation, explicit authorization, adapter order, and one universal pass are explicit. |
| Historical parity | UNKNOWN | Historical behavior is described, but the original package and exact outputs are unavailable. |

## Executed validation

- `skill-creator/scripts/quick_validate.py` on the staged package: PASS (`Skill is valid!`).
- Focused contract checks for frontmatter, change metadata, routing, evidence distinctions, workflow/activity separation, tool boundaries, write boundaries, concise golden scenarios, and absence of TODO placeholders: PASS.
- Existing `node scripts/validate-content.mjs` in the current repository: PASS (`Validated 17 personas, 2 operators, 2 leaders, 13 specialists, 17 workflow maps.`).

## Observable coverage

- Trigger and non-trigger routing: reconstructed and explicit; exact historical trigger behavior remains unknown.
- Output usefulness: covers the historical role/workflow/activity/skill/tool/resource model and current repository contract.
- Evidence and uncertainty: explicitly preserved across sources, claims, hypotheses, and contradictions.
- Tool and permission awareness: tool candidates are separated from availability and permissions.
- Mutation and safety: research-only is read-only; live updates require authorization, target, scoped review, validation, and reconciliation.
- Handoffs and dependencies: orientation, current content/model, persona skills, persona reconciliation, and universal impact review are named without claiming unavailable packages were invoked.
- Failure/ambiguity handling: bounded clarification and explicit unknown/blocker reporting are required.
- Reproducibility: focused golden scenarios, quick validation, and repository validation are recorded.

## Regressions and unknowns

- No known contract regression against the historical behaviors that were visible in the conversation or issue plan.
- Parity remains `UNKNOWN` because the original callable package, exact automatic triggers, historical tool availability, and historical emitted outputs were not recovered.
- The exact current Persona property names remain owned by `content/library-data.js` and the validator; this skill intentionally does not duplicate them.
- Runtime invocation testing requires a callable skill registry/agent harness that is not part of this repository checkpoint.

## Review decision

Eligible for the repository checkpoint after quick validation and the existing content validator pass. Keep issue #6 open for review; do not close it or install the package into a user-level registry.
