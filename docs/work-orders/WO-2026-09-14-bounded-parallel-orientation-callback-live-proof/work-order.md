# Bounded parallel orientation + callback live proof Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-orientation-callback-live-proof
- Title: Implement orientation preflight + completion callback and prove them in a two-repository bounded-parallel run
- Status: in progress — dispatched
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: repository user
- Current owner: bounded-parallel coordinator
- Request mode: update
- Primary issues: #89 and #94
- Proof/reconciliation issues: #82 and #86
- External runtime issue: #96
- Persona-Library branch: `bounded/orientation-callback-89-94`
- External target: `rickvang/ai-job-search` branch `bounded/job-ledger-96`

## Placement review

This is an instance of the existing Work Order mechanism under `docs/work-orders/`. It does not create a new durable domain concept, runtime, registry, or Playbook. The existing `playbook-bounded-parallel-implementation` remains the single canonical Playbook.

## Goal

Complete one real bounded-parallel run that both implements useful outstanding work and supplies the missing live evidence for agent orientation and originating-Chat callback behavior.

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

## Current bases

### Lane A — Persona-Library

- Repository: `rickvang/Persona-Library`
- Base: `main @ 7f7babbe8fca189a9e06e5355c56165d8cc2092f`
- Branch: `bounded/orientation-callback-89-94`
- Issues: #89, #94
- Agent context at dispatch: `unknown` until the runtime explicitly records otherwise
- Orientation entrypoint: `AGENTS.md` → `content/site-orientation.json` → `content/orientation/playbooks.json` → `docs/bounded-parallel-implementation-playbook.md` + active issues/Work Order
- Source-grounding result: `confirmed`
- Reason combined: #89 and #94 modify the same bounded-parallel Playbook/route contract; separate sibling PRs would create avoidable overlap and reconciliation risk.

### Lane B — ai-job-search

- Repository: `rickvang/ai-job-search`
- Base: `master @ aa7c7073990492c9111fbdda48f6adde24a1d91b`
- Branch: `bounded/job-ledger-96`
- Scoped owner: Persona-Library #96 because GitHub Issues are disabled in the target repository
- Agent context at dispatch: `unknown` until the runtime explicitly records otherwise
- Orientation entrypoint: target `AGENTS.md`; `.claude/` is the canonical workflow source
- Relevant source: `.claude/skills/job-scraper/SKILL.md`, `.gitignore`, current tracker/ledger conventions
- Source-grounding result: `qualified`
- Qualification: the target already persists private `job_scraper/seen_jobs.json`, deduplicates across runs, checks `job_search_tracker.csv`, and gitignores the state. Extend and prove that mechanism; do not replace it with a new database.

## Lane A scope

Implement the smallest durable changes satisfying #89 and #94:

1. Record implementer context state as `fresh | previously_oriented | unknown` before implementation dispatch.
2. Add an Orientation gate before Source-grounding.
3. Require fresh/unknown agents to follow the target repository's documented orientation path.
4. Require previously-oriented agents to refresh current base and relevant scoped instructions/source.
5. Keep orientation state distinct from `confirmed | qualified | contradicted`.
6. Carry compact orientation references/status in dispatch packets rather than copied instructions.
7. Define asynchronous completion callback behavior for runtimes that support parent/originating-conversation return.
8. Keep terminal callback states bounded to `review_ready | blocked | deferred` unless current source proves a smaller/better representation.
9. Keep callback payload reference-based and explicitly non-authoritative; GitHub remains review truth.
10. Preserve independent review, scoped correction/re-review, and separate merge authorization.
11. Define fallback when callback transport is unavailable without simulating success or polling indefinitely.
12. Update route/Docs/Site/Decision/validators only where current repository authority requires it.

## Lane B scope

Extend the existing private JSON ledger and prove repeated-search behavior:

1. Add additive identity semantics using strongest available key:
   - source/portal + stable source job ID;
   - normalized canonical URL;
   - conservative company + title + location fallback.
2. Update `last_seen` for known jobs instead of creating duplicates.
3. Preserve/extend compatible statuses for evaluated/ranked/rejected/applied/expired/reposted or equivalent current terms.
4. Surface material repost/refresh deliberately without treating tracking-only URL changes as a new job.
5. Preserve existing ranking metadata and old ledger entries.
6. Keep actual ledger/tracker files private and gitignored.
7. Add the smallest reproducible synthetic proof/tests supported by current repository patterns.
8. Do not add a remote DB, sync service, queue, daemon, or unrelated portal rewrite.

## Dispatch packet contract

Each implementer receives references, not copied repository history:

```text
repository
base revision
issue/workstream
agent context: fresh | previously_oriented | unknown
orientation entrypoint
source-grounding result: confirmed | qualified
canonical owner / relevant paths
branch
required validation
non-goals
stop condition
```

Each implementer must re-open current repository state itself.

## Stop conditions

Each lane stops when one of these is true:

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

Do not return full child transcripts or copied diffs.

## Live proof requirements

This run is successful evidence only if it records all of the following:

1. implementer context state before work begins;
2. fresh/unknown target-repository orientation before source-grounding;
3. two independent repository workstreams with one branch/PR each;
4. no nested implementer agents;
5. no continuous originating-Chat polling;
6. compact completion callback to the originating Chat when supported, including failure/defer state if applicable;
7. originating Chat independently refreshes GitHub after callback;
8. review relies on current PR/diff/check/source state rather than handoff narrative;
9. correction, if any, is scoped and re-reviewed;
10. merge is separately authorized;
11. external Lane B does not require Persona-Library records as execution context after the workstream is selected.

## Validation and reconciliation

Lane A must run Persona-Library's relevant build/content/focused validation. Lane B must run the smallest current target-repository validation plus focused synthetic ledger proof.

After both lanes return, the reviewer should determine whether the evidence is sufficient to close or update #82, #86, #89, #94, #96, and then #90. Do not close an issue merely because a PR exists; compare its acceptance criteria against the recorded run evidence.

## Next action

Dispatch one fresh/unknown implementer to each named branch in parallel. The coordinator should remain thin, collect compact terminal handoffs, and return one completion callback to the originating Chat. The originating Chat then performs independent GitHub review before any merge decision.
