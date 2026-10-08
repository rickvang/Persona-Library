# CW-92 WP14 independent verification packet

**Purpose:** temporary review transport only. Do not merge this file to production. The implementation owner is Notion Runtime, not Persona-Library.

## Exact A09 requirement

Native audit: https://app.notion.com/p/3f3cd82535ff812b8601fed5c1facfb9

- ID: A09
- Content: **Keep attempt identity and read live state before retry**
- Evidence: Retry/idempotency contract
- Placement: Runtime
- Disposition: Extract
- Acceptance: **A lost callback cannot create a second active attempt; unclear stop authority blocks replacement.**

## Current Runtime contract

Canonical Runtime: https://app.notion.com/p/3efcd82535ff81d29670c9eeeff4346e

The current **Safe retry / attempt recovery** contract says:

1. A retry is a new attempt under the **same logical operation identity**. Runtime/host retains logical operation ID and distinct attempt IDs.
2. A lost callback, missing receipt, or uncertain outcome must **not create a second active attempt**.
3. Before retrying a mutating or externally consequential step, re-read current target/live state and relevant precondition/last-known state.
4. Inspect prior attempt result, receipt, artifact, or execution evidence.
5. Determine whether intended post-state already exists.
6. Reconcile completed-but-unreceipted state instead of repeating the action.
7. Stop as `blocked` on conflicting or ambiguous partial state. If prior attempt stop/completion authority is unclear, **do not start a replacement attempt until it is confirmed stopped, completed, or safely reconciled**.
8. Reuse the logical operation/idempotency key when the executor/tool supports one.
9. Keep original authorization, target, and write scope; retry never expands authority.
10. Read-only/demonstrably idempotent operations may use lighter preflight, but attempt limits/current-state checks still apply when stale state could change the result.
11. This is a **Runtime contract, not proof every executor/tool adapter implements it**.

## Architecture boundary

Stewardship: https://app.notion.com/p/3f0cd82535ff81caa1a3cb4176574fa1

The rule must remain Runtime-owned and must not:
- redefine Policy authorization;
- redefine Plan/Capability semantics;
- create a retry subsystem/store;
- depend on Persona identity or activation.

## Supporting evidence

- Older Retry/Idempotency contract: https://app.notion.com/p/3c7cd82535ff8170ae6be80669aefc69
- Implement → Verify v0.1: https://app.notion.com/p/3efcd82535ff81c39822ff6a35ada5d2
- Validation Case 01: https://app.notion.com/p/3efcd82535ff8142aaf3db8421d1c0ab

Evidence limit: the prototype validates bounded local repair/scope protection in an isolated worktree. It does **not** prove external side-effect adapters implement read-before-retry/idempotency.

## Independent pass criteria

PASS only if the current Runtime contract:
- covers all exact A09 semantics;
- is one non-competing Runtime-owned rule;
- preserves Policy/Plan/Capability boundaries;
- adds no new subsystem/store/Persona dependency;
- does not overclaim external adapter implementation;
- leaves no substantive ambiguity that could permit a second active attempt after a lost callback or unclear stop authority.

Reviewer: independently inspect this packet and the linked authoritative sources. Return **PASS / no major issues** or concrete findings. Do not implement changes.
