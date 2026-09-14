# Bounded parallel implementation Playbook Work Order

- Work Order ID: WO-2026-09-14-bounded-parallel-implementation
- Title: Add a bounded parallel implementation Playbook for usage-conscious agent orchestration
- Status: in progress
- Created: 2026-09-14
- Last updated: 2026-09-14
- Requester: repository user
- Current owner: Cursor cloud agent
- Request mode: update
- GitHub issue: [#82 — Add a bounded parallel implementation Playbook for usage-conscious agent orchestration](https://github.com/rickvang/Persona-Library/issues/82)
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

Phase: authorized implementation. Gate: reviewable PR after validation and bounded reconciliation. Merge remains a later authorized step.

## Success criteria and stopping condition

- One clear reusable contract exists as a justified distinct Playbook.
- Delegation depth, coordinator responsibility, implementer scope, compact handoff, independent review, and merge gates are explicit.
- Usage containment is expressed as orchestration behavior, not prices or token constants.
- Runtime mappings are examples only.
- One real two-lane case is recorded, including gaps.
- Existing validation and bounded reconciliation pass.

Stopping condition: reviewable PR for #82, or a bounded blocker. Do not merge from this Work Order.
