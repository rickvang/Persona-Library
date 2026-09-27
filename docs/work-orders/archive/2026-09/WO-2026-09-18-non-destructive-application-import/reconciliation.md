# Reconciliation — WO-2026-09-18-non-destructive-application-import

## Change

Extend the existing Applications tracker import behavior from destructive replacement to non-destructive merge/upsert while preserving the private browser-local boundary.

## Dependent review

| Dependent | Classification | Result |
| --- | --- | --- |
| Applications tracker contract | Extends | Adds identity, lifecycle-protection, conflict, and explicit replacement rules without changing the record schema or version 1 export envelope. |
| Existing Applications surface | Extends | Import review is added to the current page; add/edit/delete/search/filter remain unchanged. |
| Seen-job deduplication contract | Confirms separation | Seen-job suppression remains distinct from application lifecycle and is not used as an overwrite identity. |
| Candidate Application Context | Confirms separation | Candidate evidence, baseline, packet content, and answers remain outside the tracker import schema. |
| Persona / Skill canonical data | Unrelated | No private opportunity rows or candidate-specific records are added to canonical library data. |
| Future standalone tracker app | Extends | Pure merge logic remains isolated from page rendering and localStorage, preserving extraction. |
| Application submission authorization | Confirms | Import only updates local tracker state; it never submits, sends, or syncs applications. |

## Privacy review

The repository contains only schema, lifecycle, UI, and merge behavior. The four requested opportunities are intentionally not represented in source, fixtures, Work Order text, or generated data.

## Residual risk

Browser-local storage remains single-device and can be cleared. Export JSON remains the recovery path. A source URL correction that is matched by stable id can replace the stored posting URL; lifecycle state and user-owned working fields remain protected. Ambiguous identity matches require review and are not auto-applied.
