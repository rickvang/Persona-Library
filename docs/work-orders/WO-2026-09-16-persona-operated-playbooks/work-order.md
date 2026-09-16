# Persona-operated Playbooks and Job Search Orchestrator Work Order

## Header

- Work Order ID: WO-2026-09-16-persona-operated-playbooks
- Title: Establish Persona-operated Playbooks and add a Job Search Orchestrator
- Status: ready-for-merge
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: user
- Current owner: ChatGPT / connected GitHub implementation
- Request mode: update
- GitHub issue: [#113](https://github.com/rickvang/Persona-Library/issues/113)
- Authorized repository target: rickvang/Persona-Library
- Authorized branch: issue-113-persona-operated-playbooks
- Current phase: merge handoff
- Current gate: validation passed; merge explicitly authorized
- Blocker: none known
- Stopping condition: PR #114 is merged after a fresh head/check review.

## Outcome

Correct the ontology so Personas are actors and Playbooks are operating surfaces/process contracts, then apply that model to job search by adding Priya Desai / `job-search-orchestrator` as the operating Persona for the Evidence-led Job Search Playbook. Preserve Riley Morgan as the default routing front door for unqualified requests and the general AI orchestrator, while preserving existing job-search specialist ownership.

## Scope

- Add the canonical Job Search Orchestrator Persona and a Persona-specific Skill application set that reuses existing capabilities.
- Add the Job Search Orchestrator workflow map, including campaign-health, learning, and recovery flows.
- Codify the Persona-operated Playbook invariant in architecture and Playbook composition guidance.
- Preserve Riley-first routing from #112; route full-outcome job-search work from Riley to Priya while keeping explicit direct invocation and narrow specialist routes valid.
- Update job-search implementation, ledger orchestration wording, and application Work Order fields.
- Append DEC-014 while preserving DEC-013 as the default-routing decision and DEC-011 as historical rationale.
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
- DEC-014 belongs on the existing durable Decisions surface and qualifies only the actor-like ownership portion of DEC-011; DEC-013 remains the routing decision.
- Job-search private state remains external; only reusable contracts and relationships live here.

## Current phase / next action

Repository build and validation passed after reconciliation with merged #112. PR #114 is mergeable, and the requester explicitly authorized merge. Refresh the final head/check state and merge if unchanged and green.
