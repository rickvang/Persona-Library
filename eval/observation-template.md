# Conformance observation

Copy this compact record into the active Work Order’s `observations.md` for each reviewed run.

```yaml
observation_id: OBS-YYYY-MM-DD-###
fixture_id: <case id>
target: <Persona, Skill, Tool, workflow, or route>
model: <provider and model>
model_version: <version or unknown>
surface: <assistant surface or runtime>
repository_ref: <commit, branch, or unknown>
context:
  supplied: []
  missing: []
tools:
  available: []
  attempted: []
  unavailable: []
permissions:
  granted: []
  denied: []
  unknown: []
expected: <observable contract from the fixture>
observed: <what happened>
result_class: success | failure | unclear | friction | access-gap | safety-concern | untested
evidence: []
confidence: high | medium | low | unknown
severity: none | low | medium | high | critical
repeatability: first-run | repeated | unknown
owner: <follow-up owner or unknown>
next_test: <smallest useful follow-up>
follow_up: <issue, Work Order, Decision, or none>
```

Keep private prompts, credentials, resume content, and sensitive traces in the authorized private run location. Commit only sanitized evidence and system-level conclusions.
