# Reconciliation — Persona-operated Playbooks / Job Search Orchestrator

- Status: pass for branch scope
- Initiating issue: #113
- Change class: new Persona + Persona workflows/applications + architecture/route/Decision/docs/current-Site correction

## Findings

| Source / surface | Relationship | Finding | Disposition |
| --- | --- | --- | --- |
| Priya Desai / `job-search-orchestrator` | New canonical Persona | Fills the full-outcome operating role without absorbing specialist judgment | Add |
| Career workflow map | Persona workflows | Seven flows cover framing, pipeline operation, application readiness, conversations, campaign health, learning, and recovery | Add |
| Existing portable Skills | Reused capability core | Persona-specific applications reuse existing orchestration capabilities; no portable Skill formation required | Retain / reuse |
| Evidence-led Job Search Playbook | Process surface | Identity remains; actor-like outcome ownership wording removed | Qualify |
| Riley Morgan / `ai-orchestrator` | General orchestrator | Canonical identity unchanged; no longer default job-search operator | Retain |
| Elena / Marcus / Leah / Samira / Camille / Sofia | Specialist ownership | Domain boundaries preserved | Retain |
| Job ledger contract | Shared private-state contract | Elena/search capability keeps discovery/disposition; Priya consumes state for progression only | Qualify |
| DEC-011 | Historical rationale | Original body preserved; status marks partial supersession | Retain historical |
| DEC-013 | Current architecture decision | Records Persona-operated Playbook invariant and job-search operator boundary | Add |
| Site / generated data / routes | Current-facing dependents | Rebuilt and validated against authored source | Reconcile |

## Validation

`node scripts/build-library.mjs` and `node scripts/validate-content.mjs` passed after the durable changes. Historical #90 Work Order content remains unchanged. No JobAgent integration, external runtime, or private candidate data was introduced.
