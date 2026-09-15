# Bounded parallel implementation Playbook Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-implementation
- Title: Add a bounded parallel implementation Playbook for usage-conscious agent orchestration
- Status: complete
- Created: 2026-09-14
- Last updated: 2026-09-15
- Requester: repository user
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#82 — Add a bounded parallel implementation Playbook for usage-conscious agent orchestration](https://github.com/rickvang/Persona-Library/issues/82)
- GitHub pull request: [#83 — Add bounded parallel implementation Playbook](https://github.com/rickvang/Persona-Library/pull/83)
- Artifact home: `docs/work-orders/WO-2026-09-14-bounded-parallel-implementation/`
- Concrete deliverable: [`docs/bounded-parallel-implementation-playbook.md`](../../bounded-parallel-implementation-playbook.md)
- Specialized evidence: [`proof.md`](proof.md), [`validation.md`](validation.md), and [`reconciliation.md`](reconciliation.md)

## Goal

Give a fresh agent a reusable, runtime-neutral contract for running a small number of implementation agents in parallel without duplicated repository inspection, nested delegation, polling, or transcript synthesis, while preserving repository freshness, authorization, validation, and review quality.

## Scope

- Catalog `playbook-bounded-parallel-implementation` as a distinct Playbook.
- Add orientation route `bounded-parallel-implementation`.
- Present the Playbook on the Site Playbooks and Docs surfaces.
- Record the placement decision as DEC-010.
- Add a concise root `AGENTS.md` activation rule.
- Prove the architecture with one real two-lane case before generalizing further.

## Non-goals and constraints

- Do not implement a multi-agent runtime, scheduler, token meter, model-selection engine, or automatic merge.
- Do not create an Agent, Coordinator, Runtime, Budget, Scheduler, or Orchestration entity.
- Do not create a Work/Codex-specific Tool package.
- Do not rewrite Multi-Persona Collaboration or close #71.
- Do not encode product pricing or fixed token budgets.
- Do not treat ChatGPT Work, Codex, or Chat as canonical Playbook meaning.

## Authorization and boundary

The repository user authorized implementation of #82 with “please build #82.” Authorized mutation targets are this repository’s Playbook contract, catalog identity, orientation route, Site Playbooks/Docs/Decisions surfaces, root activation rule, focused validators, and this Work Order. Merge of the resulting pull request is not authorized by that request.

## Mara placement and boundary review

Placement follows Mara Okoye’s knowledge-systems boundary:

- Durable reusable contract: `docs/bounded-parallel-implementation-playbook.md` beside other Playbook docs, not under `docs/collaboration/` and not a new `docs/playbooks/` folder for one file.
- Catalog identity: `content/library-data.js` `playbookCatalog`.
- Agent route: `content/orientation/playbooks.json` with bootstrap `route_count` 3.
- Site presentation: authored `dist/playbooks.html` and current-truth `dist/guide.html`.
- Durable rationale: `dist/decisions.html` DEC-010.
- Activation: one `AGENTS.md` bullet, not a giant prompt.
- Run evidence: this Work Order.

Rejected alternatives:

- Extend Multi-Persona Collaboration: mixes Persona synthesis and `problem-context` with repository mutation gates.
- Wait for #71 before adding identity: #82’s outcome/stage/gate structure is already distinct; collaboration remains referenced, not duplicated.
- Encode ChatGPT Work as the Playbook: the owner amendment is an example adapter with an explicit fallback.

## Current phase and gate

Phase: complete. The original Playbook implementation and correction PRs are merged, and the later integrated run supplies the real two-lane proof.

## Success criteria and stopping condition

- One clear reusable contract exists as a justified distinct Playbook.
- Delegation depth, coordinator responsibility, implementer scope, compact handoff, independent review, and merge gates are explicit.
- Usage containment is expressed as orchestration behavior, not prices or token constants.
- Runtime mappings are examples only.
- One real two-lane case is recorded, including gaps.
- Existing validation and bounded reconciliation pass.

Stopping condition: the Playbook, its correction loop, and the integrated live proof are merged and recorded; this Work Order is complete.

## Completion reconciliation

- Original implementation: PR [#83](https://github.com/rickvang/Persona-Library/pull/83), merged as `1d48730bc1f31da899e4c3b63bba401d7af878ec`.
- Correction pass: PR [#85](https://github.com/rickvang/Persona-Library/pull/85), merged as `e4894dfd47f70e3d9bec17a922dd6ef2f669d6b5`.
- Integrated proof: PR [#98](https://github.com/rickvang/Persona-Library/pull/98), merged as `73c9f6fbbf0b1aa70895a6e39434d335498de6ce`, demonstrated two bounded lanes, compact handoffs, independent review, scoped correction/re-review, and separately authorized merges.
- Repository validation for the original contract and correction pass passed; the integrated run added build/content validation and 6 focused tests. No new architecture was introduced.

## Next action

No further action for this Work Order. Issue #82 is closed after the integrated proof is recorded.
