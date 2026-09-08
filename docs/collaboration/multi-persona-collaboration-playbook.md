# Multi-Persona Collaboration Playbook

## Purpose

Produce one useful, inspectable solution for a bounded user problem by coordinating explicitly selected Personas through a shared `problem-context` document. The context is an instrument for traceability and handoff; it is not the user-facing outcome.

## Entry and exit

Entry requires a named problem, desired outcome, scope, constraints, success criteria, stopping condition, coordinator, and an approved context path. Participants are explicit and their records are either loaded or marked unavailable.

Exit requires one concrete deliverable, decision, prototype, implementation, or action plan that addresses the original problem; evidence and uncertainty are distinguished; every contribution has a disposition; at least two stage handoffs are recorded; the final quality gate passes; and the next action or completion boundary is explicit. If these conditions cannot be met, leave the context active or blocked and explain the missing input.

## Shared state

The coordinator owns the serialized JSON context described in [`problem-context.md`](problem-context.md). The context is the run-level source of truth for request framing, selected participants, contributions, evidence, decisions, artifacts, gates, blockers, handoffs, authorization, and revisions. Canonical library records remain authoritative for Personas, Skills, Tools, Playbooks, workflows, and Decisions; link them by identity instead of copying them into the context.

## Stages

| Stage | Owner and purpose | Required output | Exit gate and handoff |
| --- | --- | --- | --- |
| Frame | Coordinator bounds the problem and success measure. | Initialized named context. | Request, scope, non-goals, constraints, success, and stopping condition are present; hand off to select. |
| Select | Coordinator chooses only justified participants and capabilities. | Participant and dependency map. | Every participant is explicit and available or visibly unavailable; hand off to contribute. |
| Contribute | Each selected Persona works independently within its responsibility. | Attributable contribution records. | Each useful contribution contains a distinct finding, evidence status, tradeoff/risk, and action; duplicate or unsupported material is marked. |
| Synthesize | Coordinator compares contributions without erasing disagreement. | Decision-ready synthesis and open questions. | Evidence, interpretations, proposals, and unknowns are separate; each contribution is adopted, modified, rejected, or unresolved with a reason; hand off to build. |
| Build | Authorized builder turns the synthesis into one concrete deliverable. | Artifact, decision, prototype, implementation, or action plan. | Deliverable maps to the request and success criteria; mutation remains within explicit authorization; hand off to review. |
| Review | Named reviewer checks usefulness and traceability. | Gate result and correction list. | The solution-quality gate passes, or context records failure and the smallest correction; hand off to handoff/close. |
| Handoff / recover | New owner receives a compact packet or resumes after interruption. | Accepted handoff or recovery state. | Context ID, accepted facts, open questions, blockers/fallback, required output, and next action are recorded; no work is replayed silently. |
| Close | Coordinator records outcome and learning. | Completed context and final deliverable link. | Concrete outcome, dispositions, gate, limitations, and next action are inspectable. |

## Decision rights and mutation boundaries

- The coordinator may initialize the context, record returned contributions, maintain stage state, and make the proposed synthesis visible.
- A Persona may provide a scoped contribution but may not claim another Persona's evidence, change canonical records, or publish an artifact.
- A reviewer may pass, fail, or defer a gate and must name the evidence or correction.
- Durable repository, Site, Tool, publication, installation, or registry changes require explicit user authorization and a named target. The Playbook does not infer that authorization from participation.
- The context helper is a record-management aid. It does not authenticate callers, provide concurrency control, grant permissions, execute Tools, or guarantee external delivery.

## Solution-quality gate

Pass only when all of the following are true:

1. The output contains one concrete deliverable or decision that addresses the stated problem and at least one success criterion.
2. The deliverable is traceable to recorded evidence and decisions; assumptions and unknowns are labeled.
3. Each selected contribution adds distinct value or has a documented disposition and reason.
4. Consequential disagreement, risks, blockers, and tradeoffs are visible rather than averaged into generic consensus.
5. The user can tell what to use, what remains incomplete, and the next action.

Participant count, length, confidence language, and agreement alone are not evidence of quality. If the output is only a transcript, a collection of summaries, or generic advice, fail the gate.

## Failure and recovery

- Missing or unavailable participant: mark unavailable, use the documented fallback, and lower confidence; do not simulate the record.
- Missing evidence or contradiction: record an open question or blocker, preserve both claims, and choose a reversible next action.
- Tool or connector failure: record the requirement, failure, permission boundary, and safe manual fallback; do not claim execution.
- Interrupted stage: resume from the last context revision and the recorded next action.
- Failed solution-quality gate: keep the context active, record the correction, and return to the smallest responsible stage.
- Unauthorized mutation request: stop at proposal or draft and request the missing authorization and target.

## Handoff packet

Every stage handoff uses the context ID and records `from_stage`, `to_stage`, owner, accepted evidence/decisions, open questions, blockers or fallback, required output, and one next action. The receiving owner acknowledges the handoff before acting. This keeps the shared document useful across turns without turning it into an unbounded transcript.

