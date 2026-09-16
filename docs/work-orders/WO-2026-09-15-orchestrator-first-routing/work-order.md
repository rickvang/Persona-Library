# Work Order — Restore orchestrator-first default routing

- Work Order ID: `WO-2026-09-15-orchestrator-first-routing`
- Status: ready-for-review
- Created: 2026-09-15
- Last updated: 2026-09-15
- Issue: https://github.com/rickvang/Persona-Library/issues/111
- Repository: `rickvang/Persona-Library`
- Base: `main` at `8f77c24ec63f063a801943fc6d5d4f3009b666c7`
- Branch: `fix/issue-111-orchestrator-first-routing`
- Requester: `rickvang`
- Owner: repository maintainer / implementation agent
- Request mode: update
- Authorized target: one focused pull request against `main`; merge is not authorized by this Work Order

## Outcome and invariant

Restore the current interaction contract so that:

```text
unqualified request → Riley Morgan · AI orchestrator → smallest useful route
                                                ├─ specialist / Skill for narrow work
                                                └─ Playbook for outcome-scale work
explicitly named specialist / Skill / Playbook → direct invocation remains valid
```

Riley owns default entry, intent interpretation, routing, contributor selection, coordination, and synthesis. Playbooks own reusable outcome procedures, stages, shared state, handoffs, decision rights, quality gates, recovery, and learning. Specialists retain domain judgment and artifact expertise. Riley remains an AI orchestrator and does not become the job-search domain owner.

## Source-grounded scope

Canonical sources in scope after the library-data refactor:

- `content/site-orientation.json` — universal bootstrap and creation boundary; change only if contradicted.
- `content/orientation/docs.json` — job-search routing contract.
- `content/orientation/playbooks.json` — Playbook procedure ownership, checked for front-door conflation.
- `content/library-data/personas-core.js` — Riley authored record, changed only if the current wording omits the invariant.
- `content/library-data/workflows-core.js` — Riley workflow routing language.
- `content/library-data/catalogs.js` — Playbook identities and ownership boundary.
- `content/library-model.js` — append-only Riley semantic maintenance revision.
- `docs/decisions/records.json` — single authored Decision collection, including preserved DEC-011/012 records and applied DEC-013.
- `content/decisions-page.html` — authored Decisions presentation template.
- `scripts/build-decisions.mjs` — deterministic Decision collection-to-page renderer invoked by the library build.
- `docs/job-search/implementation.md` — current job-search operating guidance.
- `scripts/validation/generated.mjs` and `scripts/validation/validation.test.mjs` — behavior-level routing invariants.
- `dist/decisions.html` and `dist/data/**` — generated outputs only, refreshed by `node scripts/build-library.mjs`.

## Mara placement and boundary review

Mara Okoye’s placement review classifies Decisions as an existing repository layer, not a new top-level library space or a Persona/Skill record. The selected canonical owner is the single `docs/decisions/records.json` collection because it can preserve the full Decision history and append new records without duplicating rationale. The selected generated consumer is `dist/decisions.html`, rendered from the authored `content/decisions-page.html` template by `scripts/build-decisions.mjs`.

| Candidate | Result | Boundary reason |
| --- | --- | --- |
| `docs/decisions/records.json` → `content/decisions-page.html` → `dist/decisions.html` | Select | Extends the existing Decisions layer with one inspectable authored collection and one deterministic generated consumer. |
| Standalone `docs/decisions/DEC-013-*.md` alongside a separate page copy | Reject | Creates a second record path and leaves DEC-011/012 without the same source contract. |
| `dist/decisions.html` as authoring source | Reject | Generated output must not become canonical truth. |
| `content/library-data/*.js` | Reject | Decisions are not Persona, Skill, workflow, catalog, or Tool-integration records. |
| New top-level `data/`, `decisions/`, or runtime registry | Reject | Introduces a new product/source boundary for a responsibility already owned by the Decisions layer. |

## Decision and history boundary

Preserve DEC-011 and its historical rationale. The repository's canonical authored Decision collection is `docs/decisions/records.json`, declared by the Decisions route. DEC-011 and DEC-012 are represented in that same source, and DEC-013 records the KEEP / CHANGE / EXCEPTION routing conclusion. The generated Decisions page is rebuilt from the collection; archived #90 Work Order content is not rewritten.

## Owners and non-goals

- Riley: default interaction and routing ownership; not job-search domain ownership.
- Evidence-led Job Search Playbook: reusable full-outcome procedure and coordination structure.
- Elena, Marcus, Leah, Samira, Camille, and Sofia: existing bounded job-search domain responsibilities.
- Skills: reusable capabilities; Tools: action capability.

Non-goals: new runtime router, registry, queue, scheduler, state machine, generic Job Search Persona, Riley domain-method transfer, Playbook demotion, job-ledger storage changes, `.agents/skills/` topology changes, library-data ownership reversal, archive rewrites, or merge.

## Validation and reconciliation gate

Run the repository-required build, content validation, focused validation tests, isolated conformance validation, syntax checks for changed JavaScript, route/source parity checks, and `git diff --check`. Rebuild generated data; never hand-edit `dist/`.

Run one Persona-specific reconciliation review for Riley and one universal `$change-impact-reconciliation` pass. Check Riley identity/revisions, the Evidence-led Playbook, job-search specialists, Docs and Playbooks routes, Decision history, generated outputs, validators, and active Work Orders. Classify impacts as confirms, extends, qualifies, contradicts, invalidates, or unrelated; preserve incomplete visibility.

## Current phase and next action

Phase: source ownership review, source-to-generated reconciliation, and validation complete; ready for fresh review.

Next action: fresh review of PR #112's current head. Do not merge without separate authorization.

## Completion boundary

This Work Order becomes `ready-for-review` when the focused PR contains the source-grounded routing correction, the append-only Decision, refreshed generated outputs, passing validation, and the reconciliation report. It becomes `complete` only after separate review/merge authorization and a verified merged PR reference are recorded.
