# Bounded parallel orientation + callback live proof Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-orientation-callback-live-proof
- Title: Implement orientation preflight + completion callback and prove them in a two-repository bounded-parallel run
- Status: ready for review
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: repository user
- Current owner: Lane A implementer
- Request mode: update
- Primary issues: #89 and #94
- Proof/reconciliation issues: #82 and #86
- External runtime issue: #96
- Persona-Library branch: `bounded/orientation-callback-89-94`
- Pull request: [#98 — Add orientation preflight and bounded completion callback contract](https://github.com/rickvang/Persona-Library/pull/98)
- Review baseline head: `94354e2858a9eaac2c786dc911859969274569f6`
- External target: `rickvang/ai-job-search` branch `bounded/job-ledger-96`

## Placement review

This is the existing Work Order mechanism under `docs/work-orders/`. It does not create a new durable domain concept, runtime, registry, or Playbook. The existing `playbook-bounded-parallel-implementation` remains the single canonical Playbook.

## Goal

Complete one real bounded-parallel run that implements the outstanding orientation and callback contract while supplying live evidence for bounded implementation handoffs.

The run has two independent repository workstreams:

```text
Lane A — Persona-Library
#89 + #94
→ orientation preflight + callback contract
→ one branch / one PR

Lane B — ai-job-search
#96
→ extend/prove durable private job ledger
→ one branch / one PR
```

The originating Chat performs independent GitHub review after the coordinator returns a compact completion callback. Merge is separately authorized.

## Authorization constraints

Authorized by the requester for this run:

- inspect current repository state;
- create the two named work branches;
- implement the scoped issue work;
- create one PR per workstream;
- run required validation;
- return compact handoffs.

Not authorized by this Work Order alone:

- merge either PR;
- broaden either workstream beyond the named issues;
- create nested implementer agents;
- copy child transcripts into coordinator state;
- add a new runtime, scheduler, queue, registry, DB service, or Playbook identity.

## Current bases and grounding

### Lane A — Persona-Library

- Repository: `rickvang/Persona-Library`
- Base: `main @ 7f7babbe8fca189a9e06e5355c56165d8cc2092f`
- Prepared branch: `bounded/orientation-callback-89-94` at `ee2727c8a66d4e3ccd837410f68956e27d7654ad`
- Issues: #89, #94
- Agent context at dispatch: `unknown`; this Implementer treated that conservatively as `fresh` for the orientation gate
- Orientation entrypoint followed: `AGENTS.md` → `content/site-orientation.json` → `content/orientation/playbooks.json` → bounded-parallel route → `docs/bounded-parallel-implementation-playbook.md` → active Work Order and issues #89/#94
- Source-grounding result: `confirmed`
- Reason combined: #89 and #94 modify the same bounded-parallel Playbook/route surfaces; separate sibling PRs would create avoidable overlap and reconciliation risk.

### Lane B — ai-job-search

- Repository: `rickvang/ai-job-search`
- Base: `master @ aa7c7073990492c9111fbdda48f6adde24a1d91b`
- Branch: `bounded/job-ledger-96`
- Scoped owner: Persona-Library #96 because GitHub Issues are disabled in the target repository
- Agent context at dispatch: `unknown`
- Orientation entrypoint: target `AGENTS.md`; `.claude/` is the canonical workflow source
- Source-grounding result: `qualified`
- Qualification: the target already persists private `job_scraper/seen_jobs.json`, deduplicates across runs, checks `job_search_tracker.csv`, and gitignores the state. Extend and prove that mechanism; do not replace it with a new database.

## Lane A implementation evidence

- Implementer context state before work: `unknown` from the bounded dispatch packet; effective orientation path: `fresh` because the target repository was re-opened and its local contract was read before implementation.
- Orientation gate: passed. The local `AGENTS.md`, bootstrap, selected Playbooks route, canonical Playbook, collaboration reference, active Work Order, and live issues #89/#94 were inspected before source-grounding.
- Source-grounding gate: `confirmed`. Current `main` at the named base and the prepared branch’s single Work Order commit were compared; the requested owner is the existing Playbook and route, and the two issues are intentionally serialized into this one Lane A workstream.
- Orientation and grounding states were kept separate: `unknown → fresh` context handling; `confirmed` workstream grounding. No contradicted work was dispatched.
- Changed canonical surfaces: `docs/bounded-parallel-implementation-playbook.md`, `content/orientation/playbooks.json`, the authored bounded-parallel Site/Docs/Decision summaries, focused generated-output validation, and this Work Order. `AGENTS.md`, the Playbook catalog identity, and the collaboration Playbook remain unchanged.
- Callback contract: terminal states are bounded to `review_ready`, `blocked`, and `deferred`; callback payloads are reference-based and non-authoritative; unsupported transport uses the same compact coordinator fallback. The implementer returned a compact terminal handoff to the coordinator context.
- Callback limitation: parent/originating-Chat callback delivery was not independently observable from this implementer context. The contract records the supported adapter and honest fallback; the originating coordinator/reviewer must record whether its runtime delivered the callback and independently refresh GitHub afterward.
- Nested delegation: none.
- Merge: not performed and not authorized by this Work Order.

## Dispatch packet contract

Each implementer receives references, not copied repository history:

```text
repository
base revision
issue/workstream
agent context: fresh | previously_oriented | unknown
orientation entrypoint / references
source-grounding result: confirmed | qualified
canonical owner / relevant paths
branch
required validation
non-goals
stop condition
```

## Validation and reconciliation evidence

- `node scripts/build-library.mjs` — refreshed generated orientation route copies.
- `node scripts/validation/validation.test.mjs` — focused regression tests, including bounded-parallel card isolation and the eight-stage contract fixture.
- `node scripts/validate-content.mjs` — full content, route, generated-output, Site, relationship, and maintenance validation.
- `git diff --check` — whitespace validation.
- Bounded reconciliation: checked the bootstrap, Playbooks route, canonical model/data boundaries, architecture, validator, generated route output, Site Playbooks/Docs/Decisions surfaces, root activation boundary, predecessor Work Orders, and the unchanged collaboration contract. Direct dependents are extended where the new stage and callback are presented; catalog identity, root `AGENTS.md`, Persona/Skill/Tool records, and external repositories are unchanged.

## Stop conditions

The Lane A implementer stops at one of:

- `review_ready` — one reviewable PR exists and required validation is recorded;
- `blocked` — a concrete permission/input/source conflict prevents completion;
- `deferred` — an explicit scoped dependency makes continued implementation inappropriate.

No implementer merges. No implementer spawns sub-agents.

## Compact handoff

Return only:

```text
run status
repository
issue/workstream
branch
PR
validation performed
blockers / unresolved questions
```

## Next action

Independent reviewer: review [PR #98](https://github.com/rickvang/Persona-Library/pull/98) from fresh `main`, branch, diff, review threads, checks, and authoritative Playbook source. Review #89/#94 against the current source, request only scoped corrections if needed, and keep merge separately authorized. The coordinator should record callback delivery or the compact fallback in the integrated run evidence.

