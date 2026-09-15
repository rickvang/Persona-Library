# Bounded parallel orientation + callback live proof Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-orientation-callback-live-proof
- Title: Implement orientation preflight + completion callback and prove them in a two-repository bounded-parallel run
- Status: blocked
- Created: 2026-09-14
- Last updated: 2026-09-15
- Requester: repository user
- Current owner: Lane A implementer
- Request mode: update
- Primary issues: #89 and #94
- Proof/reconciliation issues: #82 and #86
- External runtime issue: #96
- Integrated proof issue: #97
- Persona-Library branch: `bounded/orientation-callback-89-94`
- Pull request: [#98 — Add orientation preflight and bounded completion callback contract](https://github.com/rickvang/Persona-Library/pull/98)
- Review baseline head: `2b46677c6f975c1128016871125925f1e7dc845a`
- External target: `rickvang/ai-job-search` branch `bounded/job-ledger-96`

## Current state correction — 2026-09-15

This Work Order was previously marked complete, but current GitHub truth reopened #96 and #97 after the Lane B runtime implementation was invalidated and reverted. The package is therefore active again with status `blocked`. Historical execution evidence below is preserved as originally recorded; it is not treated as current acceptance evidence for #96 or #97.

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
- Callback evidence: the originating Chat received one compact completion callback for the integrated two-lane run and resumed independent review. The callback carried GitHub references and terminal statuses only; GitHub remained the source of current PR, diff, review, and check truth.
- Nested delegation: none.
- Merge: not performed and not authorized by this Work Order.

## Lane B implementation evidence

- Repository: `rickvang/ai-job-search`
- Workstream: Persona-Library #96, branch `bounded/job-ledger-96`
- Pull request: [#1 — feat(job-ledger): add durable identity and observation tracking](https://github.com/rickvang/ai-job-search/pull/1)
- Terminal status at coordinator handoff: `review_ready`
- Validation: `python -m unittest discover -s tests -t .` — 142 tests passed, 3 expected skips; `python -m unittest tests.test_job_ledger -v` — 10 focused ledger tests passed; helper/test syntax compilation passed; security guards, framework-version check, and `git diff --check` passed; private ledger/tracker files remained Gitignored and untracked.
- Validation limitation: `tools/lint_skills.py` was not run locally because PyYAML was unavailable; the PR records that CI installs PyYAML before this check.
- Evidence remains reference-based: current branch, PR, issue #96, and the validation commands above are the review entry points; no child transcript or copied diff is included.

## Integrated callback evidence

- Per-workstream terminal statuses: Lane A `review_ready` → [PR #98](https://github.com/rickvang/Persona-Library/pull/98); Lane B `review_ready` → [PR #1](https://github.com/rickvang/ai-job-search/pull/1).
- Aggregate run status: `review_ready`, because every dispatched workstream reached `review_ready`.
- Callback delivery: the originating Chat received the compact callback and returned to independent GitHub review. The callback did not imply review approval or merge authorization.

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
- `node scripts/validation/validation.test.mjs` — 6 passing focused regression tests, including bounded-parallel card isolation, the eight-stage contract fixture, per-workstream callback statuses, the aggregate rule, and the deferred transition.
- `node scripts/validate-content.mjs` — full content, route, generated-output, Site, relationship, and maintenance validation.
- `git diff --check` — whitespace validation.
- Lane B validation is recorded above from PR #1; the only local limitation is the missing PyYAML dependency for `tools/lint_skills.py`.
- Bounded reconciliation: rechecked the bootstrap, Playbooks route, canonical model/data boundaries, architecture, validator, generated route output, Site Playbooks/Docs/Decisions surfaces, root activation boundary, predecessor Work Orders, and the unchanged collaboration contract. The per-workstream callback status, aggregate rule, and deferred stop gate remain within the existing Playbook and route; catalog identity, root `AGENTS.md`, Persona/Skill/Tool records, and external repositories are unchanged.

## Post-merge completion

- Lane A: Persona-Library PR [#98](https://github.com/rickvang/Persona-Library/pull/98), merged as `73c9f6fbbf0b1aa70895a6e39434d335498de6ce`.
- Lane B: ai-job-search PR [#1](https://github.com/rickvang/ai-job-search/pull/1), merged as `f12b1df3e1d5471c1c896e2b052165452d329314`; final validation recorded 142 tests passed, 3 expected skips, and 10 focused ledger tests.
- Live proof: two bounded implementation lanes executed after target-repository orientation and source-grounding; each used one branch and one PR; handoffs stayed compact; the completion callback reached the originating Chat; the Chat independently refreshed/reviewed GitHub; scoped corrections were applied and re-reviewed; and both PRs later merged after explicit authorization.
- Completion boundary: the implementation Work Order’s merge prohibition was respected during execution, and merge authorization remained a separate later decision.

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

Keep this Work Order active and blocked. Resume the integrated proof in #97 only after #96 has valid acceptance evidence from an explicitly authorized private runtime/workspace; then refresh GitHub state and record a replacement proof without treating the reverted Lane B implementation as acceptance evidence.

## Repository-boundary correction — 2026-09-15

The historical Lane B selection was invalid. Persona-Library #96 was sent to `rickvang/ai-job-search`, although this repository owns the reusable ledger contract and real durable job-search history belongs only in an explicitly authorized private runtime/workspace.

- The original `ai-job-search` PR [#1](https://github.com/rickvang/ai-job-search/pull/1), merged as `f12b1df3e1d5471c1c896e2b052165452d329314`, was reverted by corrective PR [#2](https://github.com/rickvang/ai-job-search/pull/2), merged as `dfd04ba95f073fce77fd93de699bca488c5963e6`.
- The revert was safe because current `master` had no later commits depending on the two ledger commits; it restored the pre-PR tree and removed the helper, focused tests, and related documentation changes.
- The former Lane B implementation and its `142 tests`, `3 expected skips`, and `10 focused ledger tests` are retained as historical execution facts, but they are invalid as Persona-Library #96 runtime acceptance evidence.
- Lane A’s orientation/callback implementation and the actual completion callback to the originating Chat remain valid. The review/correction loop and separately authorized merge sequence remain historical facts, but the integrated run no longer proves #82, #86, or #96.

Current follow-up: #96 remains open for valid private-runtime implementation and evidence; #82 remains open for the invalidated two-lane implementation proof; #86 remains complete from its independent `template-library` source-grounding case; and #97 is reopened as an incomplete integrated proof. No replacement runtime is introduced here.
