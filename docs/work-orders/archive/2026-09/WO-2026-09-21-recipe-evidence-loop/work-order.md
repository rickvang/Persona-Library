# Work Order — Issue #171 Tool-use recipe evidence learning loop

- Work Order ID: `WO-2026-09-21-recipe-evidence-loop`
- Status: Complete
- Created: 2026-09-21
- Requester: repository owner
- Owner: Riley Morgan / ChatGPT implementation agent
- Explicit collaborator: Mara Okoye · knowledge systems architect (placement review)
- Request mode: update + bounded external execution
- GitHub issue: https://github.com/rickvang/Persona-Library/issues/171
- Current Work: https://app.notion.com/p/3e3cd82535ff813ba5b4c191f8b0086e
- Branch: `feat/issue-171-recipe-evidence-loop`
- Base: `main` at `20f40b2a98ec04200e837e216d4f33ce2cf8d089`

## Objective

Define and prove a reusable evidence loop for comparing Tool-use recipes or execution strategies while keeping the stable Skill/workflow separate from execution choice.

## Scope

1. Extend existing eval contracts instead of creating a parallel taxonomy.
2. Define comparability, observation, review/promotion, freshness, contradiction, and persistence rules.
3. Run one real two-strategy bounded comparison.
4. Store only sanitized evidence.
5. Decide whether Git evidence is sufficient or Supabase is justified.
6. Reconcile accepted guidance into the existing Tool-discovery Skill.
7. Validate, review, and merge through the repository's normal completion path.

## Placement

Mara classification: **existing eval contract extension + existing Tool Skill extension + sanitized result artifact**.

No new Persona, Skill, Tool, Playbook, top-level knowledge space, or generic observation database is warranted.

## Stable proof task

For a Persona-Library GitHub issue implementation task, resolve the applicable Operational Scenario and prove:

- scenario ID;
- owner recipe;
- presence of freshness guidance;
- presence of stop guidance.

Two read-only strategies execute against the same immutable repository revision and runtime:

- manifest-first Operational Scenario routing;
- GitHub code-search-first discovery.

## Completion boundary

Complete only when the comparison schema is validated, the proof is recorded and reviewed, the persistence decision is explicit, repository validation passes, reconciliation is archived, and issue #171 closes through the merged PR.


## Closeout checkpoint

- PR: https://github.com/rickvang/Persona-Library/pull/189
- Validated implementation head: `f1fb85cdd7ab15a460fae9f2d73bbbe22160361e`
- Repository validation run `35682858750`: completed / success.
- Comparison proof: both strategies passed; reviewed disposition is conditional.
- Persistence: Git-backed sanitized evidence; no Supabase follow-up.
- Review state at closeout preparation: no unresolved review threads or blocking review submissions.
- Final step: validate this archive/reconciliation commit, refresh merge state, merge if clean.
