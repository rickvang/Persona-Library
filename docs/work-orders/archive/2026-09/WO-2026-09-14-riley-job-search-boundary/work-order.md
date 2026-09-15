# Separate Riley orchestration from job-search domain ownership

- Work Order ID: WO-2026-09-14-riley-job-search-boundary
- Title: Separate Riley orchestration from job-search domain ownership
- Status: complete
- Created: 2026-09-14
- Last updated: 2026-09-15
- Requester: Rick Vang
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#90 — Separate Riley orchestration from job-search domain ownership](https://github.com/rickvang/Persona-Library/issues/90)
- Artifact home: `docs/work-orders/WO-2026-09-14-riley-job-search-boundary/`
- Concrete deliverable: Playbook-first ownership wording, DEC-011, job ledger contract, and bounded Site/docs reconciliation
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

Correct the job-search role boundary so the Evidence-led Job Search Playbook owns the outcome, Riley Morgan remains a reusable AI orchestrator, specialists retain domain judgment, and opportunity deduplication lives in a private job ledger contract rather than Riley’s Persona.

## Scope

- Audit and correct ambiguous or incorrect “Job-search orchestrator / Job Search Persona” wording.
- Make the Playbook the front door; keep Riley as coordinator.
- Preserve Elena, Marcus, Leah, Samira, Camille, and Sofia specialist boundaries.
- Add the reusable job opportunity ledger contract for private workspace state.
- Record DEC-011 and update the Docs orientation `resume-application-work` route.
- Lock the corrected wording with focused validator checks.

## Non-goals and constraints

- No new generic Job Search Persona.
- No new orchestration framework or runtime.
- No private candidate job history stored in Persona-Library.
- No collapse of specialist Personas into Riley.
- No redesign of the entire Evidence-led Job Search methodology.
- Do not merge unless separately authorized.

## Authorization and boundary

Rick Vang authorized building issue #90 and pushing to GitHub. Authorized mutation targets are Persona-Library job-search guidance, Playbook/Site/Docs/Decisions surfaces, Elena’s search workflow/skill wording, Riley revision note, Docs orientation route, focused validators, the job ledger contract, and this Work Order. Merge is not assumed authorized beyond push/PR.

## Mara placement and boundary review

Performed from Mara’s knowledge-systems placement gate and existing Docs/Playbooks/Decisions homes.

- Finding: this is an ownership correction and contract addition for an existing Playbook outcome, not a new Persona, Skill package, space, or runtime.
- Selected placement: extend `JOB_SEARCH_IMPLEMENTATION.md`, Playbooks/job-search Site surfaces, Docs orientation route, Decisions (`DEC-011`), and `docs/job-search/job-ledger-contract.md`.
- Rejected alternative: create a Job Search Persona. No uncovered responsibility justified one.
- Rejected alternative: rename Riley to Job Search Orchestrator. That would harden identity drift.
- Rejected alternative: host private opportunity history in Persona-Library. Privacy and architecture require a contract-only boundary.
- Boundary result: placement is clear; Riley identity remains AI orchestrator.

## Source-grounding and bounded handoff

- Base: `main` at `4be9eae`; PR #92 was inspected at `eff423b` before dispatch.
- Preserve the implemented three-layer architecture — **confirmed** by the issue, current PR diff, and canonical job-search surfaces.
- Append the search-sequencing maintenance revision — **confirmed**; `content/library-model.js` owns `buildMaintenance`, and the existing record is now the mutation target.
- Reconcile the applied-decision summary — **confirmed**; DEC-011 is present and the current branch summary must be 7.
- Track durable private runtime proof separately — **qualified**; Persona-Library has the reusable contract only, so issue [#96](https://github.com/rickvang/Persona-Library/issues/96) owns the private-workspace implementation and evidence.
- Rebase — **qualified**; the branch already targets the current `main` head, so no synthetic rebase is warranted while `main` remains unchanged.
- Editability — **qualified and serialized**; Lane A owns the maintenance model, generated mirror, decision summary, and this Work Order. Lane B remains isolated; the shared decision-summary surface is reconciled once per lane rather than treated as concurrent ownership.
- Contradicted candidates: none. No private runtime storage is dispatched to Persona-Library.

## Source audit summary

| Surface | Classification | Action |
| --- | --- | --- |
| Riley canonical `roleLabel: AI orchestrator` | correct | preserve |
| Playbooks catalog “Coordinator · Riley Morgan · AI orchestrator” | correct | preserve; strengthen Playbook-front-door copy |
| `JOB_SEARCH_IMPLEMENTATION.md` “Riley is the job-search orchestrator” | ambiguous / incorrect | replace with Playbook-first / AI orchestrator wording |
| `dist/job-search.html` “Job-search orchestrator” card and “Job-search orchestration” link | incorrect identity drift | rename to Riley Morgan · AI orchestrator / Playbook coordinator |
| Guide Evidence-led job search Playbook example | correct | preserve |
| Resume Work Order routing notes | mostly correct orchestration | leave historical packets; update live templates/contracts |
| Opportunity persistence | missing | add job ledger contract + Playbook shared-state card |

## Current phase and gate

Phase: complete. PR #92 and the dependent private-workspace PR #1 are merged, and the acceptance criteria are confirmed.

## Completion evidence

- Persona-Library implementation: PR [#92](https://github.com/rickvang/Persona-Library/pull/92), merged as `b3b51abd8e70cfb67e2e3870c8ff6e9ad991111e`.
- Deferred runtime dependency: `rickvang/ai-job-search` PR [#1](https://github.com/rickvang/ai-job-search/pull/1), merged as `f12b1df3e1d5471c1c896e2b052165452d329314`.
- Runtime evidence: 142 tests passed, 3 expected skips, and 10 focused ledger tests passed; syntax, security, framework, diff, and private-data boundary checks passed.
- Acceptance evidence: the Playbook owns the job-search outcome, Riley remains the AI orchestrator, specialist ownership is preserved, the private ledger contract remains outside Persona-Library, and durable runtime proof is now supplied by the consuming repository.

## Success criteria and stopping condition

- Playbook owns the outcome; Riley owns orchestration; specialists own domain judgment.
- Riley remains reusable outside job search.
- Narrow requests can route to Elena/Marcus/Leah/Samira/Camille/Sofia without defaulting to Riley.
- Job ledger contract exists; private history stays out of Persona-Library.
- No new Job Search Persona.
- Validation and bounded reconciliation pass.

Stopping condition: PR #92 and its #96 runtime dependency are merged with acceptance evidence; this Work Order is complete.

## Scope decision on the job ledger

In scope for #90 / this PR: the reusable private ledger **contract**, ownership boundary (search specialist / Playbook shared state; not Riley; not Persona-Library storage), Site/docs alignment, and explicit tracking of the runtime proof dependency.

Out of scope / follow-up: implement and prove durable private-workspace ledger persistence across repeated searches. This is now tracked in [#96 — Implement and prove durable private job-ledger persistence](https://github.com/rickvang/Persona-Library/issues/96). Keep #90 open until #96 supplies the runtime evidence; do not implement private runtime storage in Persona-Library.

## Next action

No further action for this Work Order. Issue closure is handled by the post-merge backlog reconciliation.

## Repository-boundary correction — 2026-09-15

PR [#92](https://github.com/rickvang/Persona-Library/pull/92) still satisfies this Work Order’s ownership correction: the Evidence-led Job Search Playbook owns the outcome, Riley remains the AI orchestrator, and specialists retain domain judgment. The later `ai-job-search` PR [#1](https://github.com/rickvang/ai-job-search/pull/1) was an invalid implementation target for the separately deferred runtime proof and was reverted by [#2](https://github.com/rickvang/ai-job-search/pull/2), merged as `dfd04ba95f073fce77fd93de699bca488c5963e6`.

The reusable contract in `docs/job-search/job-ledger-contract.md` remains valid, while #96 is again the open owner of valid private-workspace persistence evidence. This correction does not reopen #90’s completed ownership architecture or move private history into Persona-Library.

