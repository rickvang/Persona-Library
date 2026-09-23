# Test Queue Test-Case Resolution Contract Work Order

- Work Order ID: WO-2026-09-23-test-queue-resolution-contract
- Status: active
- Created: 2026-09-23
- Last updated: 2026-09-23
- Request mode: update
- Requester: Rick Vang
- Owner: Riley Morgan / ai-orchestrator
- Repository: `rickvang/Persona-Library`
- Plan issue: [#205](https://github.com/rickvang/Persona-Library/issues/205)
- Supporting implementation: [#195](https://github.com/rickvang/Persona-Library/issues/195)
- Artifact home: `docs/work-orders/WO-2026-09-23-test-queue-resolution-contract/`

## Objective

Make every Test Queue row self-contained and decision-complete. A future agent must be able to run a bounded test, evaluate its evidence, and determine whether the related work is resolved, needs additional implementation, must be requeued, or was cancelled without reconstructing a chat.

## Canonical placement

The implementation plan and progress record live in this Work Order. Notion Current Work remains the cross-thread index. The Notion Test Queue remains the operational queue for executable test records and their evidence; it is not the source of the implementation plan.

## Authorized mutation scope

- This Work Order package in Persona-Library.
- The linked Test Queue schema and TQ-40-001 record in the connected Notion workspace.
- The linked Current Work row only for a compact pointer and next action.
- No production telemetry, provider credentials, raw prompts, private traces, or issue closure is authorized by this Work Order.
- A real metered provider run requires separate explicit authorization and is not part of the schema migration.

## Scope

1. Extend the Test Queue schema with Preconditions, Procedure, Environment / Version, Resolution Rule, Decision, and Reviewer.
2. Migrate TQ-40-001 to the new contract.
3. Define deterministic lifecycle rules for Queued, Ready, Running, Review, Passed, Failed, Unavailable, and Cancelled.
4. Run a cold-reader handoff review without relying on prior chat context.
5. Record validation and remaining unknowns.

## Non-goals

- Closing issue #195 before measured-runtime evidence passes.
- Treating unavailable evidence as a failure or as a pass.
- Capturing private prompts, credentials, account identifiers, or raw requests.
- Creating a second Current Work index.
- Claiming a metered runtime sample without direct provider usage evidence.

## Resolution contract

| Test outcome | Work decision | Required follow-up |
| --- | --- | --- |
| Passed | Close Issue | Only when implementation work is complete and realtime review accepts the evidence. |
| Failed | Additional Work | Create or reopen linked implementation work, assign an owner, and record the next test. |
| Unavailable | Requeue | Record the missing prerequisite and the condition that makes retry valid. |
| Cancelled | Cancelled | Record why execution stopped without claiming resolution. |

Test Queue Status describes execution state. Decision describes what happens to the related work. A queued or unavailable test is not automatically a Current Work blocker.

## Implementation phases

### Phase 1 — Extend the queue contract

- [ ] Add the six fields to the Test Queue database.
- [ ] Define the Decision options: Pending, Close Issue, Additional Work, Requeue, Cancelled.
- [ ] Document the distinction between execution Status and work Decision.
- [ ] Preserve the distinction between Unavailable and Failed.

### Phase 2 — Migrate TQ-40-001

- [ ] Add preconditions for metered OpenAI access, authorization, supported runtime path, and repository state.
- [ ] Add the bounded procedure for capture, redaction, storage, validation, and review.
- [ ] Add environment and implementation version metadata.
- [ ] Add the resolution rule and set Decision to Pending.
- [ ] Add reviewer and preserve existing pass/fail/requeue criteria.

### Phase 3 — Lifecycle and handoff

- [ ] Define the state transition rules in the queue record guidance.
- [ ] Require a linked owner and next action for Failed and Unavailable outcomes.
- [ ] Keep Current Work to a compact queue pointer and status.

### Phase 4 — Pilot review

- [ ] Have a cold reader determine how to run TQ-40-001 and what each outcome means.
- [ ] Record ambiguity as a schema or row correction.
- [ ] Close issue #195 only after the measured-runtime row passes realtime review.

## Dependencies

- Notion edit access to the Test Queue.
- Persona-Library PR #202 merged at `a1c2977daf2d08542057b1604e766470d47da07e`.
- Explicit metered-call authorization for the eventual evidence run.
- A supported runtime that returns provider usage metadata.
- A reviewer for realtime evidence.

## Evidence and uncertainty

Current implementation evidence is sourced from the merged PR and repository checks. The measured-runtime sample is unknown and remains queued. No provider claim may be inferred from static estimates or unavailable subscription telemetry.

## Stopping condition

Stop after the queue schema and TQ-40-001 are self-contained, the cold-reader review is recorded, and the Work Order links the validation evidence. Leave issue #195 open until the measured-runtime acceptance criteria pass.

## Next action

Apply Phase 1 to the Notion Test Queue schema, then migrate TQ-40-001 before requesting authorization for its metered run.
