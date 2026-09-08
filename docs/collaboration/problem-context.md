# Shared problem context

`problem-context` is the per-request working document for a multi-Persona collaboration. It is the shared source of truth for one bounded problem, not a replacement for canonical Persona, Skill, Tool, Playbook, or Decision records.

The first implementation is deliberately file-based. The coordinator creates one JSON document in the approved task workspace, gives it a stable `context_id`, and is the single writer. Personas and other contributors return scoped contribution records to the coordinator; they do not edit the context file directly. This makes the handoff inspectable and prevents an informal panel transcript from being mistaken for a solution.

Use the companion schema at [`problem-context.schema.json`](problem-context.schema.json) and the dependency-free helper at [`../../scripts/problem-context.mjs`](../../scripts/problem-context.mjs). The helper refuses to overwrite an existing context during `init`, rejects unknown participants, records an append-only revision entry for every mutation, and blocks completion when the quality gate or contribution dispositions are missing.

## Required context

Every context should make these fields inspectable:

- `context_id` and lifecycle `status` (`active`, `blocked`, or `completed`);
- the requester's problem, desired outcome, scope, non-goals, constraints, success criteria, and stopping condition;
- explicitly selected participants, each participant's responsibility, availability, loaded records, and write scope;
- the Playbook name, current stage, stage owner, decision rights, and next handoff;
- an evidence ledger that separates source/evidence status from interpretation or proposal;
- attributable contributions with finding, evidence, tradeoff/risk, recommended action, confidence, and disposition;
- decisions with rationale and decision owner;
- artifacts with status, provenance, and location or inline deliverable;
- quality gates, open questions, blockers, fallback, next action, and learning;
- authorization scope and revision history.

## Operating contract

1. Frame the request before selecting participants. Do not invent a panel or fill an unavailable record.
2. Select only the Personas, Skills, workflows, Tools, and Playbook stages actually needed. Record missing dependencies instead of simulating them.
3. Have each participant contribute independently and within its stated responsibility. The coordinator records the contribution and its evidence status.
4. Synthesize only after contributions are attributable. Preserve consequential disagreement and record whether each contribution was adopted, modified, rejected, or left unresolved, with a reason.
5. Build or propose one concrete solution deliverable tied to the success criteria. A context containing only summaries, generic advice, or an unresolved transcript is not complete.
6. Pass the solution-quality gate before handoff or completion. The gate checks usefulness, traceability from problem to evidence to decision to deliverable, coverage of success criteria, and disposition of every contribution. A multi-Persona completion also records at least two stage handoffs.
7. On interruption, use `resume` to return the current stage, pending work, blockers, decisions, artifacts, and next action. Resume from the last recorded revision; do not replay completed work as if it were new.
8. Close only after the solution is complete or an explicit blocked outcome explains why it cannot be completed. Durable publication, repository mutation, or Tool execution remains a separate authorized action.

## Noise-control rules

The number of Personas is not a quality metric. A contribution is useful only when it adds a distinct finding, evidence-backed implication, tradeoff or risk, or actionable next step. Generic agreement, duplicated summaries, unsupported certainty, and role-play without an attributable record are noise. The final context must show the disposition of every contribution and the reason for any rejection or modification.

## Runtime and mutation boundary

This MVP provides a serialized context artifact and a coordination procedure; it is not a concurrent agent scheduler, authentication system, message broker, or permission grant. The caller/coordinator is responsible for choosing an approved path, ensuring the selected records are available, and obtaining authorization before any durable write. The helper does not execute Tools, publish artifacts, install Skills, change canonical library records, or infer credentials.

## Minimal handoff packet

When handing work to another stage or contributor, include:

```text
context_id: <stable id>
from_stage: <completed stage>
to_stage: <next stage>
owner: <named owner>
goal: <the bounded outcome>
accepted_facts: <evidence and decisions with record ids>
open_questions: <only unresolved items>
blockers_or_fallback: <what prevents progress, if anything>
required_output: <one concrete deliverable or decision>
next_action: <single actionable next step>
```

The receiving stage acknowledges the handoff by recording its own revision. If the receiving dependency is unavailable, leave the context active or blocked with the exact limitation; never mark the stage complete by implication.

