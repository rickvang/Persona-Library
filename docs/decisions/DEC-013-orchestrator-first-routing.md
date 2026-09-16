# DEC-013 — Riley is the default routing front door

- Decision ID: `DEC-013`
- Status: Applied
- Date: 2026-09-15
- Scope: default interaction and routing for unqualified requests
- Related issue: [#111](https://github.com/rickvang/Persona-Library/issues/111)
- Supersedes: the front-door portion of DEC-011 only; DEC-011's historical rationale remains intact

## Question

How should an unqualified request enter the Persona Library when the work may be narrow specialist work or a larger reusable outcome?

## Decision

Riley Morgan is the default interaction and routing front door for unqualified requests. Riley interprets intent and selects the smallest useful route:

- narrow work may go to the appropriate specialist or Skill;
- outcome-scale work may go to the appropriate Playbook;
- a bounded consultation, Tool path, or other focused route may be selected when that is the smallest useful fit.

Playbooks own reusable outcome procedures, stages, shared state, handoffs, decision rights, quality gates, recovery, and learning loops. Specialists own professional judgment and artifact-specific expertise. Riley coordinates those contributions without absorbing their domain ownership.

Explicit direct invocation remains valid: a request naming a specialist, Skill, or Playbook may route directly without an artificial Riley hop.

## Keep / change / exception

### Keep

- Riley remains the AI orchestrator and is not the job-search domain owner.
- Playbooks remain the procedural owner for reusable multi-stage outcomes.
- Specialists remain the owners of domain judgment.

### Change

The Playbook is not the default system front door. Riley is the default entry and routing point for unqualified requests, including the choice between a narrow specialist/Skill route and a full-outcome Playbook.

### Exception

Explicit direct invocation of a named specialist, Skill, or Playbook may bypass Riley as an interaction hop while preserving the selected object's ownership boundary.

## Rationale and alternatives

Issue #90 correctly removed job-search domain ownership from Riley, but its front-door wording also made the Evidence-led Job Search Playbook appear to be the default entry. Separating entry/routing ownership from procedural and domain ownership restores the intended interaction model without adding a runtime router or moving expertise.

Considered alternatives:

1. Keep the Playbook as the universal front door — rejected because it makes users understand system taxonomy before receiving routing help.
2. Make Riley own the complete job-search method — rejected because it transfers specialist judgment and contradicts the #90 boundary.
3. Add a routing service or registry — rejected because a repository routing contract is sufficient for this correction.

## Affected surfaces

- `docs/job-search/implementation.md`
- `content/orientation/docs.json`
- Riley's authored record in `content/library-data/personas-core.js`
- Riley's maintenance history in `content/library-model.js`
- focused routing validators and tests under `scripts/validation/`
- generated data rebuilt by `scripts/build-library.mjs`
- issue #111 and its focused pull request

## Compatibility and revisit condition

This decision changes default interaction routing only. It does not create a generic Job Search Persona, change private job-ledger ownership, alter Playbook methodology, or require a browser/runtime loader. Revisit it if observed requests show that Riley's route selection consistently chooses a larger or less capable path than the smallest useful route, or if a later Decision establishes a different universal entry contract.
