# Bounded parallel P1 target-repo wording Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-p1-target-repo-wording
- Title: Narrow the post-selection Persona-Library sentence on the Bounded Parallel Implementation route to external target repositories
- Status: complete
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: Rick Vang
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#86 — Make bounded parallel implementation target-repository-first and source-grounded](https://github.com/rickvang/Persona-Library/issues/86) — completed after PR #88 merged
- Source: [PR #87](https://github.com/rickvang/Persona-Library/pull/87) post-merge comment (P1) from Rick Vang, the matching pre-merge Codex review thread on `content/orientation/playbooks.json`, and a second Codex P1 on [PR #88](https://github.com/rickvang/Persona-Library/pull/88#discussion_r4008290375) about the Playbook body
- Predecessor: [`WO-2026-09-14-bounded-parallel-source-grounding`](../WO-2026-09-14-bounded-parallel-source-grounding/work-order.md) / merged [PR #87](https://github.com/rickvang/Persona-Library/pull/87)
- Pull request: [#88 — Narrow bounded-parallel next_handoff to external target repos (P1 from #87)](https://github.com/rickvang/Persona-Library/pull/88) — merged as `eb574fad93014aa452ed79eb03f55eb0bb8099b7`
- Artifact home: `docs/work-orders/archive/2026-09/WO-2026-09-14-bounded-parallel-p1-target-repo-wording/`
- Concrete deliverable: amended `next_handoff` string for route `bounded-parallel-implementation` in [`content/orientation/playbooks.json`](../../../../../content/orientation/playbooks.json), plus the matching narrowing of two unconditional statements in [`docs/playbooks/bounded-parallel-implementation.md`](../../../../playbooks/bounded-parallel-implementation.md) (lines 12 and 204) once PR #88 review found they still contradicted the new exception
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

PR #87 merged a `next_handoff` sentence on the Playbooks route `bounded-parallel-implementation` that unconditionally said: "Do not load Persona-Library records as an execution dependency after selection." Rick flagged (post-merge, P1) that this is correct for external target repositories but wrong when Persona-Library itself is the target repository, since root `AGENTS.md` already requires reading the bootstrap, route group, and linked records before modifying this project's own records. The same substance was flagged pre-merge by a Codex review thread on the same line. This Work Order narrows that one sentence to Rick's exact wording without reversing #86's target-repository-first intent.

## Scope

- Replace the closing sentence of the `bounded-parallel-implementation` route's `next_handoff` in `content/orientation/playbooks.json` with Rick's exact wording (three sentences: target-repository grounding, external-repo scoping, and a Persona-Library-as-target / local-instructions exception).
- Rebuild `dist/data/orientation/playbooks.json` from the updated source.
- **Round 2 (Codex P1 on PR #88):** narrow two remaining unconditional statements in `docs/playbooks/bounded-parallel-implementation.md` — line 12 ("Execution does not require loading Persona-Library records.") and line 204 ("Persona-Library records are not required after Playbook selection.") — the same way as the route sentence, since both stated the rule with no external-repo qualifier and so contradicted the new `next_handoff` exception.
- Run repository content validation after each round.

## Non-goals and constraints

These were the implementation-time constraints for the Work Order:

- Do not reverse #86's target-repository-first intent; external-repo runs still do not depend on Persona-Library records after Playbook selection.
- Do not reopen PR #87; implement the follow-up in a new PR against `main`.
- Round 1 assumed `docs/playbooks/bounded-parallel-implementation.md` body did not need edits because line 49 ("Do not treat it as an execution hub for work in another repository") and line 330 ("An agent that starts inside the target repository skips Persona-Library loading after Playbook selection") already scope to external/other-repository work. That assumption held for those two lines but not for lines 12 and 204, which Codex correctly flagged on PR #88 as still unconditional; those two lines were narrowed in round 2. Lines 49, 330, and the historical case at line ~385 were re-checked and left unchanged — they already scope correctly or describe a specific past external case.
- Do not implement the optional isolated-agent evidence rerun for #86 — Rick labeled it optional and it was out of scope for this Work Order.
- The implementation agent was not authorized to merge PR #88; merge remained a separate authorization and occurred after review.
- Do not reply on PR #87 beyond an optional short "follow-up in new PR" pointer, if repo convention requires acknowledging the comment. Do not reply on PR #88 unless resolving the review thread after a real fix.

## Authorization and boundary

Rick Vang authorized implementing this P1 as a new PR against `main`, and authorized the round-2 fix to the same PR branch after Codex's follow-up P1. Authorized mutation targets were the Playbooks route group (`content/orientation/playbooks.json`), its generated mirror (`dist/data/orientation/playbooks.json`), `docs/playbooks/bounded-parallel-implementation.md` (lines 12 and 204 only), and this Work Order. Merge was separately authorized after review and PR #88 merged as `eb574fad93014aa452ed79eb03f55eb0bb8099b7`.

## Mara placement and boundary review

This is a scoped correction to an existing route field and two existing Playbook-body statements, not a new record, space, or file type.

- Durable contract: existing `docs/playbooks/bounded-parallel-implementation.md` — two unconditional statements narrowed to match the route's external-repo exception; the rest of the body (including the already-scoped lines 49 and 330) is unchanged.
- Route activation: existing `content/orientation/playbooks.json` route `bounded-parallel-implementation`.
- Progress packet: this Work Order, linked to #86, PR #87's post-merge comment, and PR #88's Codex review thread.

Rejected alternative (round 1): rewriting the Playbook body to add a parallel exception clause — initially deferred because lines 49 and 330 already limited their own statements to "work in another repository" / "starts inside the target repository." Codex's PR #88 review correctly identified that this deferral did not extend to lines 12 and 204, which stated the same rule without that qualifier; round 2 fixes only those two lines rather than rewriting the whole intro/inputs sections.

## Current phase and gate

Phase: complete. PR #88 passed independent review and was separately merged. Issue #86 is closed as completed.

## Success criteria and completion boundary

- The unconditional sentence "Do not load Persona-Library records as an execution dependency after selection." no longer appears in `content/orientation/playbooks.json` or its generated mirror.
- The replacement text matches Rick's requested wording.
- `#86`'s target-repository-first intent is preserved: external repos still do not depend on Persona-Library after selection, while Persona-Library-as-target and local-instruction exceptions are explicit.
- `docs/playbooks/bounded-parallel-implementation.md` lines 12 and 204 no longer state the no-Persona-Library-records rule unconditionally; both carry the same external-repo scoping and Persona-Library-as-target exception as the route sentence.
- Content validation passed.
- PR #87 remains merged and was not reopened.
- PR #88 merged as `eb574fad93014aa452ed79eb03f55eb0bb8099b7`.
- Issue #86 was closed as completed after the correction merged.
- The optional isolated-agent evidence rerun remains intentionally unimplemented and non-blocking; any practical failure found during use should be tracked as a new focused issue.

## Next action

None for this Work Order. Use the Playbook in practice; open a new focused issue if runtime use reveals a concrete problem.
