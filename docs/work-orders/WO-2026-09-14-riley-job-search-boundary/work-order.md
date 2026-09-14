# Separate Riley orchestration from job-search domain ownership

- Work Order ID: WO-2026-09-14-riley-job-search-boundary
- Title: Separate Riley orchestration from job-search domain ownership
- Status: ready for review
- Created: 2026-09-14
- Last updated: 2026-09-14
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

Phase: reviewable implementation. Gate: independent review, then separately authorized merge. Issue #90 may close when acceptance criteria are confirmed on merge.

## Success criteria and stopping condition

- Playbook owns the outcome; Riley owns orchestration; specialists own domain judgment.
- Riley remains reusable outside job search.
- Narrow requests can route to Elena/Marcus/Leah/Samira/Camille/Sofia without defaulting to Riley.
- Job ledger contract exists; private history stays out of Persona-Library.
- No new Job Search Persona.
- Validation and bounded reconciliation pass.

Stopping condition: reviewable PR pushed for #90, or a bounded blocker.

## Next action

Independent review of the PR for #90. Merge only after separate authorization if required by repository practice.
