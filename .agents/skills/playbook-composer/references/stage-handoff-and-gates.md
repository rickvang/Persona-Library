# Stage, handoff, and gate contract

Use this contract when decomposing or reviewing a Playbook. A stage is not complete because an action was attempted; it is complete when its exit evidence and gate condition are satisfied.

## Stage fields

- purpose and intended decision;
- owner and supporting participants, with decision rights;
- entry conditions, inputs, constraints, and prerequisites;
- observable actions and decisions;
- outputs, evidence, artifact/status change, and source trail;
- exit criteria and quality gate;
- handoff recipient, packet contents, accepted state, and fallback;
- failure, interruption, escalation, recovery, and learning note.

## Handoff rules

1. Pass only the state and artifacts the next stage is allowed to rely on.
2. Name what is verified, proposed, missing, stale, or contradictory.
3. Do not let a missing participant, Tool, approval, or artifact silently become a successful handoff.
4. Preserve revision and provenance so the next stage can distinguish current truth from an earlier draft.
5. If the handoff is rejected, return to the named recovery or escalation path rather than skipping the gate.

## Gate rules

A gate should state the evidence or observation required, the decision owner, pass/fail/defer conditions, unresolved risk, and next action. Gates may defer a transition; they do not authorize publication, access changes, Tool execution, or unrelated edits.
