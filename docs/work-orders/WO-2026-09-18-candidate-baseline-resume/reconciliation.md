# Reconciliation — Candidate Baseline Resume workflow repair

Status: ready-for-review.

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

Because the companion Operating Pack PR is still draft and unmerged, Persona-Library's current-main provenance reference remains pinned to the last verified Operating Pack main revision. If #6 is later merged, re-verify and update that external revision before merging #149 if the consuming docs require the new main SHA.

## Review boundary

Source-level and generated-parity checks are complete. Canonical Node build/validation commands remain a pre-merge requirement because this GitHub runtime exposes no command runner and no PR Actions workflow executed them. Neither draft PR is merge-authorized.
