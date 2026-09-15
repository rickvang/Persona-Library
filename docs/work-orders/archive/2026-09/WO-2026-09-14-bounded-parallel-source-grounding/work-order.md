# Bounded parallel source-grounding Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-source-grounding
- Title: Make bounded parallel implementation target-repository-first and source-grounded
- Status: complete
- Created: 2026-09-14
- Last updated: 2026-09-15
- Requester: Rick Vang
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#86 — Make bounded parallel implementation target-repository-first and source-grounded](https://github.com/rickvang/Persona-Library/issues/86)
- GitHub pull request: [#87 — Make bounded parallel implementation source-grounded](https://github.com/rickvang/Persona-Library/pull/87)
- Predecessor: [`WO-2026-09-14-bounded-parallel-p2-corrections`](../WO-2026-09-14-bounded-parallel-p2-corrections/work-order.md) / merged [PR #85](https://github.com/rickvang/Persona-Library/pull/85)
- Artifact home: `docs/work-orders/archive/2026-09/WO-2026-09-14-bounded-parallel-source-grounding/`
- Concrete deliverable: amended [`docs/playbooks/bounded-parallel-implementation.md`](../../../../playbooks/bounded-parallel-implementation.md)
- Specialized evidence: [`proof.md`](proof.md), [`validation.md`](validation.md), and [`reconciliation.md`](reconciliation.md)

## Goal

Strengthen `playbook-bounded-parallel-implementation` so every workstream is source-grounded in the repository being changed before dispatch, and so Persona-Library is optional discovery rather than an execution dependency.

## Scope

- Add a pre-dispatch source-grounding stage and gate to the existing Playbook.
- Add confirmed / qualified / contradicted comparison semantics.
- Make target-repository implementation-truth precedence explicit.
- Refine the dispatch packet to carry references and qualifications, not copied repository history.
- Update Playbooks-route `next_handoff` and Site/Docs summaries only where they would otherwise remain dispatch-first.
- Record one external-repository source-grounding case.
- Keep one Playbook identity. Do not create `playbook-library`.

## Non-goals and constraints

- Do not add a second bounded-parallel Playbook.
- Do not create a Playbook repository for this change.
- Do not restore a bounded-parallel always-on rule on root `AGENTS.md`.
- Do not duplicate GitHub Tool instructions; reuse the #75 freshness and authorization boundary.
- Do not mutate `template-library`, `tool-repo`, or `operating-packs`.
- Do not invent a live two-lane parallel-run proof for #82.
- Do not merge the resulting pull request.

## Authorization and boundary

Rick Vang authorized implementation of #86. Authorized mutation targets are this repository’s existing Bounded Parallel Implementation Playbook, Playbooks route group, authored Site Playbooks/Docs/Decisions summaries needed to keep current truth accurate, focused validator coverage for the new stage count, and this Work Order. Merge is not authorized. This Work Order does not grant mutation permission.

## Mara placement and boundary review

This is an existing-record extension, not a new Playbook, space, or file type.

- Durable contract: existing `docs/playbooks/bounded-parallel-implementation.md`.
- Catalog identity: keep `playbook-bounded-parallel-implementation`. No second identity.
- Activation: existing `content/orientation/playbooks.json` route `bounded-parallel-implementation`, not root `AGENTS.md`.
- Current-facing Site summaries: existing `dist/playbooks.html` and `dist/guide.html` only where the prior dispatch-first wording would mislead.
- Durable rationale: append a Correction on DEC-010 rather than superseding the distinct-Playbook conclusion.
- External artifacts: remain in the target repository. No `playbook-library` host.
- Progress packet: this Work Order, linked to #86.

Rejected alternatives:

- A separate “Source-Grounded Parallel Implementation” Playbook: rejected; source grounding is a stage of the existing outcome.
- Externalizing the Playbook into a new repository: rejected; #60 does not justify a library for one amendment.
- Putting the procedure on root `AGENTS.md`: rejected; route-specific activation stays on the Playbooks route group.
- Copying full source-grounding procedure onto every Docs surface: rejected; summaries point to the contract.

## Current phase and gate

Phase: complete. PR #87 and its scoped PR #88 follow-up are merged; the later ai-job-search lane provides a live external-repository proof of the contract.

## Success criteria and stopping condition

- The Playbook has a pre-dispatch source-grounding stage and gate.
- Contradicted work cannot proceed to dispatch.
- Qualified scope is carried in the dispatch packet.
- Target-repository instructions/source/tests outrank remembered or catalog context for implementation truth.
- Persona-Library is not required during an external-repo implementation run after Playbook selection.
- The Playbook remains one canonical identity.
- Root `AGENTS.md` does not regain route-specific bounded-parallel procedure.
- Compact handoff, independent review, correction loop, and separately authorized merge remain intact.
- One external-repository case is recorded.
- Validation and bounded reconciliation pass.

Stopping condition: PRs #87 and #88 merged, with the target-repository-first contract and external proof preserved; this Work Order is complete.

## Completion reconciliation

- Source-grounding implementation: PR [#87](https://github.com/rickvang/Persona-Library/pull/87), merged as `281f73631e6db2eeadce3171d8bfba82aaf308e3`.
- Scoped target-repository wording correction: PR [#88](https://github.com/rickvang/Persona-Library/pull/88), merged as `eb574fad93014aa452ed79eb03f55eb0bb8099b7`.
- Live external proof: the ai-job-search lane in integrated PR [#98](https://github.com/rickvang/Persona-Library/pull/98) recorded fresh target-repository orientation, source-grounding, implementation truth, compact handoff, independent review, and merge after authorization.
- Validation: build, content validation, focused tests, diff check, and root-instruction inspection passed for the source-grounding contract; the integrated lane added the external runtime evidence.

## Next action

No further action for this Work Order. Issue #86 is closed after the final GitHub state refresh.

## Repository-boundary correction — 2026-09-15

The target-repository-first/source-grounding implementation remains complete. The integrated `ai-job-search` lane later cited as external implementation evidence was a wrong-repository assignment for #96 and was reverted by [ai-job-search PR #2](https://github.com/rickvang/ai-job-search/pull/2), merged as `dfd04ba95f073fce77fd93de699bca488c5963e6`.

This does not invalidate #86’s independent external source-grounding proof: [`proof.md`](proof.md) records the `template-library` case being classified as contradicted and stopped before mutation, which directly demonstrates the acceptance gate. #86 remains complete on that evidence; the invalid ai-job-search claim is removed from the current evidence basis.

