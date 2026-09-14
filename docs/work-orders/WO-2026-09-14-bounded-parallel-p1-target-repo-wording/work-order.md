# Bounded parallel P1 target-repo wording Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-p1-target-repo-wording
- Title: Narrow the post-selection Persona-Library sentence on the Bounded Parallel Implementation route to external target repositories
- Status: ready for review
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: Rick Vang
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#86 — Make bounded parallel implementation target-repository-first and source-grounded](https://github.com/rickvang/Persona-Library/issues/86) (stays open)
- Source: [PR #87](https://github.com/rickvang/Persona-Library/pull/87) post-merge comment (P1) from Rick Vang, and the matching pre-merge Codex review thread on `content/orientation/playbooks.json`
- Predecessor: [`WO-2026-09-14-bounded-parallel-source-grounding`](../WO-2026-09-14-bounded-parallel-source-grounding/work-order.md) / merged [PR #87](https://github.com/rickvang/Persona-Library/pull/87)
- Artifact home: `docs/work-orders/WO-2026-09-14-bounded-parallel-p1-target-repo-wording/`
- Concrete deliverable: amended `next_handoff` string for route `bounded-parallel-implementation` in [`content/orientation/playbooks.json`](../../../content/orientation/playbooks.json)
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

PR #87 merged a `next_handoff` sentence on the Playbooks route `bounded-parallel-implementation` that unconditionally said: "Do not load Persona-Library records as an execution dependency after selection." Rick flagged (post-merge, P1) that this is correct for external target repositories but wrong when Persona-Library itself is the target repository, since root `AGENTS.md` already requires reading the bootstrap, route group, and linked records before modifying this project's own records. The same substance was flagged pre-merge by a Codex review thread on the same line. This Work Order narrows that one sentence to Rick's exact wording without reversing #86's target-repository-first intent.

## Scope

- Replace the closing sentence of the `bounded-parallel-implementation` route's `next_handoff` in `content/orientation/playbooks.json` with Rick's exact wording (three sentences: target-repository grounding, external-repo scoping, and a Persona-Library-as-target / local-instructions exception).
- Rebuild `dist/data/orientation/playbooks.json` from the updated source.
- Run repository content validation.

## Non-goals and constraints

- Do not reverse #86's target-repository-first intent; external-repo runs still do not depend on Persona-Library records after Playbook selection.
- Do not reopen PR #87 (merged) or close issue #86 (still open; this is a partial follow-up, not full closure).
- Do not edit `docs/bounded-parallel-implementation-playbook.md` body: it already scopes the same idea ("Do not treat it as an execution hub for work in another repository", "An agent that starts inside the target repository skips Persona-Library loading after Playbook selection"), so only the route-group sentence needed the fix.
- Do not implement the optional isolated-agent evidence rerun for #86 — Rick labeled it optional and it is out of scope for this Work Order.
- Do not merge the resulting pull request.
- Do not reply on PR #87 beyond an optional short "follow-up in new PR" pointer, if repo convention requires acknowledging the comment.

## Authorization and boundary

Rick Vang authorized implementing this P1 as a new PR against `main`. Authorized mutation targets are the Playbooks route group (`content/orientation/playbooks.json`), its generated mirror (`dist/data/orientation/playbooks.json`), and this Work Order. Merge is not authorized.

## Mara placement and boundary review

This is a scoped correction to an existing route field, not a new record, space, or file type.

- Durable contract: existing `docs/bounded-parallel-implementation-playbook.md` (unchanged; already scoped).
- Route activation: existing `content/orientation/playbooks.json` route `bounded-parallel-implementation`.
- Progress packet: this Work Order, linked to #86 and to PR #87's post-merge comment.

Rejected alternative: rewriting the Playbook body to add a parallel exception clause — rejected because the body already limits the prohibition to "work in another repository" and to agents starting inside the target repository, so only the route-group sentence carried the unconditional wording.

## Current phase and gate

Phase: reviewable draft PR. Gate: independent review, then separately authorized merge. Do not merge from this Work Order.

## Success criteria and stopping condition

- The unconditional sentence "Do not load Persona-Library records as an execution dependency after selection." no longer appears in `content/orientation/playbooks.json` or its generated mirror.
- The replacement text matches Rick's exact wording.
- `#86`'s target-repository-first intent is preserved (external repos still do not depend on Persona-Library after selection).
- `docs/bounded-parallel-implementation-playbook.md` is unchanged (already consistent).
- Content validation passes.
- Issue #86 remains open. PR #87 remains merged and is not reopened.

Stopping condition: reviewable draft PR, or a bounded blocker. Do not merge.

## Next action

Independent review of the new pull request. Merge only after separate authorization.
