# Reconciliation — WO-2026-09-18-job-application-tracker

> **Current-state note (2026-09-21):** This document preserves the original browser-local reconciliation as historical evidence. DEC-017 and issue #156 later changed the current persistence model to Supabase-backed primary storage when configured, with browser-local state retained for explicit fallback, migration, and recovery. The historical findings below are intentionally unchanged.

## Change

Add a top-level Applications tracker as a companion product surface while keeping real application data browser-local and extractable.

## Dependent review

| Dependent | Classification | Result |
| --- | --- | --- |
| Evidence-led Job Search Playbook | Extends | Tracker provides lifecycle state; Playbook ownership and Priya operation remain unchanged. |
| Riley Morgan routing | Confirms | No routing/domain ownership moves into the tracker. |
| Priya Desai · Job search orchestrator | Confirms | May operate against tracker state in an authorized run; tracker is storage/UI, not an actor. |
| Seen-job deduplication contract | Qualifies | Remains lightweight duplicate suppression only; application lifecycle is a separate contract. |
| Candidate Application Context | Qualifies | Candidate evidence/baseline remain separate; tracker may store links/status but does not become the candidate evidence source. |
| Persona / Skill canonical data | Unrelated | Tracker records do not use Persona or Skill IDs as primary keys and are not normalized library records. |
| Public repository boundary | Confirms | Real opportunity/application rows are not committed; code/schema only. |
| Future standalone tracker app | Extends | Versioned JSON plus isolated runtime/storage boundary provides a migration seam. |
| Application submission authorization | Confirms | Tracker changes status only when a person/authorized workflow does so; it does not submit applications. |

## Privacy review

No candidate-specific application rows, contact details, employer targets, packet contents, or application answers are seeded into repository source. The browser-local store is explicitly non-canonical and can be cleared independently of Persona Library.

## Extraction review

A future extraction should be able to move:

- `content/job-tracker-page.html`
- `client/job-tracker.js`
- the record/lifecycle contract in `docs/job-search/application-tracker-contract.md`

without migrating Persona, Skill, Tool, or Playbook records. A server-backed app may replace only the storage adapter and authentication boundary.

## Residual risk

Browser-local storage is single-device and vulnerable to browser-data clearing. Export/import is the current recovery mechanism. Cross-device sync or collaborative tracking would require a later authenticated storage decision.
