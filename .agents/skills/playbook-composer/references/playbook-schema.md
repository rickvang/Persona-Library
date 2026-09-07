# Playbook schema guide

Use the repository's existing Playbook records and validator as the exact schema authority. This guide is a reasoning contract for proposals and reviews, not permission to add fields or mutate records.

## Minimum inspectable structure

1. **Identity and outcome** — stable name, intended result, users, scope, constraints, success measure, and stopping condition.
2. **Participants and rights** — named Personas or roles actually loaded; recommend/review/approve/stop/exception rights; unavailable participants remain visible.
3. **Stages** — ordered stages, purpose, owner, entry conditions, inputs, decisions, actions, outputs, evidence, exit criteria, and handoff.
4. **Shared state and artifacts** — source of truth, artifact owner, provenance, revision/status, permitted transitions, dependencies, and retention expectation.
5. **Capabilities and Tools** — linked Skills, applications, workflow methods, Tool requirements, recipes, prerequisites, availability status, safest path, fallback, and verification.
6. **Gates and learning** — evidence required, reviewer, pass/fail/defer condition, unresolved questions, failure/escalation/recovery, and revision trigger.
7. **Provenance** — source trail, evidence status, confidence, assumptions, decisions, limitations, and change context.

Prefer references to canonical records. A Playbook coordinates components; it does not become a second copy of the library.
