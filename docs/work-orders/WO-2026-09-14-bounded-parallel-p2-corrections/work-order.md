# Bounded parallel Playbook P2 corrections Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-p2-corrections
- Title: Fix three P2s on the merged bounded parallel implementation Playbook
- Status: ready for review
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: Rick Vang
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#82 — Add a bounded parallel implementation Playbook for usage-conscious agent orchestration](https://github.com/rickvang/Persona-Library/issues/82)
- GitHub pull request: [#85 — Fix bounded-parallel Playbook P2s from PR #83](https://github.com/rickvang/Persona-Library/pull/85)
- Predecessor: [`WO-2026-09-14-bounded-parallel-implementation`](../WO-2026-09-14-bounded-parallel-implementation/work-order.md) / merged [PR #83](https://github.com/rickvang/Persona-Library/pull/83)
- Artifact home: `docs/work-orders/WO-2026-09-14-bounded-parallel-p2-corrections/`
- Concrete deliverable: corrected stop condition, four-role catalog metadata, and Playbooks-route activation
- Specialized evidence: [`validation.md`](validation.md) and [`reconciliation.md`](reconciliation.md)

## Goal

Apply the three remaining P2s from the post-merge review of PR #83 so the Playbook cannot stop on a recorded-but-unapplied correction list, the Site and DEC-010 name all four roles including Authorizer, and bounded-parallel activation lives on the Playbooks route group instead of always-on root `AGENTS.md`.

## Scope

- Tighten the Playbook run-stop so each workstream must be accepted after review or explicitly blocked/deferred; stages 4–5 require apply + re-review.
- Change catalog metadata `3 roles` → `4 roles` and keep Authorizer as a role, including the Playbooks catalog card and DEC-010.
- Remove root `AGENTS.md` rule 13 and keep bounded-parallel activation on the Playbooks route group.
- Record this follow-up in a Work Order linked to issue #82.

## Non-goals and constraints

- Do not close issue #82.
- Do not invent a live parallel-run proof.
- Do not work the PR #81 Work Order packet.
- Do not implement issue #71.
- Do not merge the resulting pull request.
- Do not create an Agent, Coordinator, Runtime, Budget, Scheduler, or Orchestration entity.
- Do not rewrite Multi-Persona Collaboration.

## Authorization and boundary

Rick Vang authorized fixing the three P2s on already-merged PR #83. Authorized mutation targets are this repository’s Playbook contract, Playbooks route group, authored Site Playbooks/Decisions surfaces, root `AGENTS.md` (removal of rule 13 only), focused validator coverage for the role count, and this Work Order. Merge is not authorized. Issue #82 stays open.

## Mara placement and boundary review

This is an existing-record extension, not a new Playbook, space, or file type.

- Durable contract: existing `docs/bounded-parallel-implementation-playbook.md`.
- Activation: existing `content/orientation/playbooks.json` route `bounded-parallel-implementation`, not a new always-on root rule.
- Current-facing Site metadata: existing `dist/playbooks.html` catalog card.
- Durable rationale: append a correction on DEC-010 rather than superseding the distinct-Playbook conclusion.
- Progress packet: this Work Order, linked to #82.

Rejected alternatives:

- Stop modeling Authorizer as a role to make `3 roles` true: rejected; keep Authorizer.
- Leave rule 13 as a short pointer: rejected; route-specific activation belongs on the Playbooks route group.
- Close #82 after these copy/contract fixes: rejected; the distinctive live-run proof remains open.

## Current phase and gate

Phase: reviewable PR. Gate: independent review, then separately authorized merge. Do not merge from this Work Order. Do not close #82.

## Success criteria and stopping condition

- Run-stop requires accepted-after-review or explicit blocked/deferred; recorded corrections are not terminal.
- Catalog card and DEC-010 name four roles, including Authorizer.
- Root `AGENTS.md` no longer carries a bounded-parallel always-on rule; the Playbooks route group does.
- Validation and bounded reconciliation pass.
- Issue #82 remains open.

Stopping condition: reviewable PR for these three P2s, or a bounded blocker. Do not merge. Do not close #82.

## Next action

Independent review of [#85](https://github.com/rickvang/Persona-Library/pull/85), including the Codex P2 that scoped the role-count assertion to the bounded-parallel catalog card. Merge only after separate authorization. Leave issue #82 open.
