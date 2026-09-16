# Persona-operated Playbooks and Job Search Orchestrator Work Order

## Header

- Work Order ID: WO-2026-09-16-persona-operated-playbooks
- Title: Establish Persona-operated Playbooks and add a Job Search Orchestrator
- Status: ready-for-review
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: user
- Current owner: ChatGPT / connected GitHub implementation
- Request mode: update
- GitHub issue: [#113](https://github.com/rickvang/Persona-Library/issues/113)
- Authorized repository target: rickvang/Persona-Library
- Authorized branch: issue-113-persona-operated-playbooks
- Current phase: PR handoff
- Current gate: repository validation passed
- Blocker: none known
- Stopping condition: current-source architecture, Persona, workflows, routing, Decision, job-search contracts, Site surfaces, generated outputs, and focused validation are reconciled and a reviewable PR is opened.

## Outcome

Correct the ontology so Personas are actors and Playbooks are operating surfaces/process contracts, then apply that model to job search by adding Priya Desai / `job-search-orchestrator` as the operating Persona for the Evidence-led Job Search Playbook. Preserve Riley Morgan as the general AI orchestrator and preserve existing job-search specialist ownership.

## Scope

- Add the canonical Job Search Orchestrator Persona and a Persona-specific Skill application set that reuses existing capabilities.
- Add the Job Search Orchestrator workflow map, including campaign-health, learning, and recovery flows.
- Codify the Persona-operated Playbook invariant in architecture and Playbook composition guidance.
- Re-route full-outcome job-search work to the new Persona while keeping narrow specialist routes direct.
- Update job-search implementation, ledger orchestration wording, and application Work Order fields.
- Append DEC-013 and mark DEC-011 partially superseded without rewriting DEC-011 rationale.
- Update current Site surfaces and focused validators.
- Rebuild generated data and run repository validation.

## Non-goals

- No JobAgent integration, dependency, data import, or runtime relationship.
- No new generic orchestration framework.
- No new portable Skill unless separately justified by the Skill formation process.
- No transfer of Elena, Marcus, Leah, Samira, Camille, or Sofia domain ownership.
- No private candidate history in Persona-Library.
- No employer submission, outreach, or external job-search action.
- No rewriting archived #90 Work Order history.

## Mara placement and boundary review

- New Persona identity and workflows belong in the existing career Persona/workflow authored modules.
- Persona-specific Skill applications reuse existing capability names in the existing Skill application catalog; no new portable Skill is formed.
- The Playbook identity remains unchanged; this update corrects the actor/surface relationship.
- DEC-013 belongs on the existing durable Decisions surface and supersedes only the actor-like ownership portion of DEC-011.
- Job-search private state remains external; only reusable contracts and relationships live here.

## Current phase / next action

Repository build and validation passed. Remove temporary build helpers and open the implementation PR; merge remains separately authorized.
