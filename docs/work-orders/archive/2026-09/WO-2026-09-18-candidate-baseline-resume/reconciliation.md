# Reconciliation — Candidate Baseline Resume workflow repair

Status: complete.

## Impact map

| Surface | Relationship | Classification | Required action |
| --- | --- | --- | --- |
| Candidate Application Context Operating Pack | private source precedence | extends | Add baseline/master resolution and validation |
| Job-search implementation guidance | application composition | extends | Add private-source and baseline integrity gates |
| Candidate Context contract/integration | candidate-bound context | extends | Make baseline first-class but private |
| Resume semantic mapping | transformation boundary | qualifies | Mapping may not supersede/reconstruct designated baseline |
| Application Work Order | execution evidence | extends | Record baseline source/revision and divergence dispositions |
| Docs orientation route | runtime discovery | extends | Baseline resolution must be a first read/gate |
| Validators/tests | regression guard | extends | Fail closed when baseline route/integrity contract disappears |
| Decisions | durable rationale | extends | Append baseline-vs-Template boundary decision |
| Template library | reusable starter ownership | confirms | No source change required |
| Personas / Playbook ownership | domain judgment/orchestration | confirms | No identity or ownership transfer |
| Private candidate files | candidate truth and composed baseline | confirms | Read-only for this workflow repair; no content copied into repo |

## Unchanged boundaries

- Evidence remains authoritative for candidate facts.
- Reusable Templates remain candidate-neutral.
- Resume Content Model remains a private evidence-traceable projection, not evidence.
- Submission, employer contact, and external sharing remain separately authorized actions.
- No candidate-specific private values are stored in Persona-Library or operating-packs.


## Cross-repository dependency

The repair spans two independently owned contracts:

1. `rickvang/operating-packs#6` establishes Candidate Baseline Resume source precedence and validation in the Candidate Application Context Operating Pack.
2. `rickvang/Persona-Library#149` consumes that boundary in job-search composition, semantic mapping, Work Orders, routing, Decisions, and regression validation.

The reusable Template repository is intentionally not part of the mutation set. The existing Template contract remains valid: reusable Templates own portable presentation structure; they do not own a candidate's private composed career spine.

The companion Operating Pack PR #6 merged first as `36b1336d5a8edf4c91b5016ed66d7e5e64a5e9d6`. Persona-Library's consuming documentation is pinned to that merged revision before PR #149 is merged.

## Review boundary

Source-level and generated-parity checks are complete. Canonical Node build/validation commands remain unexecuted because this GitHub runtime exposes no command runner and no PR Actions workflow executed them. Rick Vang explicitly authorized merge on 2026-09-18 at 10:51 AM CT with that limitation visible; authorization does not change the validation result.


## Completion

The cross-repository repair is merged. The Operating Pack dependency merged first and Persona-Library was pinned to its merged revision before PR #149 merged. `rickvang/template-library` remained unchanged. The Work Order is archived because the terminal state is complete.
