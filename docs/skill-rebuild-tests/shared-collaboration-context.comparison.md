# Shared collaboration context implementation comparison

## Recovery basis

Issue #22, the current Persona/Skill/Tool/Playbook contracts, the previous Persona Library conversation, and the user clarification that Personas must help produce a solution rather than add noise. No exact historical shared-runtime package was recovered, so this is a careful current-use reconstruction.

## Implemented surface

- `docs/collaboration/problem-context.md` defines the per-request context, coordinator/single-writer boundary, contribution contract, lifecycle, handoff packet, noise controls, and durable-mutation boundary.
- `docs/collaboration/problem-context.schema.json` makes the required context shape machine-readable.
- `docs/collaboration/multi-persona-collaboration-playbook.md` defines frame/select/contribute/synthesize/build/review/handoff/close stages, gates, decision rights, failure recovery, and a solution-quality gate.
- `scripts/problem-context.mjs` provides dependency-free `init`, participant/contribution/decision/artifact recording, dispositions, gates, handoffs, authorization, completion, validation, summary, and resume commands. It refuses `init` overwrite, rejects unknown/unavailable contributors, records revisions, blocks completion without two handoffs, and rejects incomplete completion.
- `persona-panel-orchestration`, `playbook-composer`, and `multi-perspective-skill-synthesis` now route live multi-Persona work through the context contract without claiming a concurrent runtime or silently creating a new Skill.

## Observable comparison

| Scenario | Result | Evidence |
| --- | --- | --- |
| SCC-1 useful multi-Persona build | PASS for current-use contract; historical parity `UNKNOWN` | The helper creates a named context, records attributable contributions and dispositions, requires a concrete solution and passing solution-quality gate, and emits a resumable packet. |
| SCC-2 noise, missing dependency, or unsafe mutation boundary | PASS for current-use contract; historical parity `UNKNOWN` | Unknown or unavailable participants are rejected/visible; completion rejects pending dispositions or missing gate/deliverable; docs preserve coordinator-only writes and explicit authorization. |

## Validation run

- `problem-context.mjs` success path: PASS.
- `problem-context.mjs` unknown-participant boundary: PASS (non-zero exit and unchanged context).
- `quick_validate.py` for the three updated coordination packages: PASS.
- Site content validator: PASS at the current repository snapshot.

## Known limitations and follow-up

- This is a serialized file-based MVP, not a concurrent agent scheduler, authenticated permission system, message broker, or external publication runtime.
- Participant selection and returned contribution capture still rely on the coordinator; the helper does not discover Personas or Tools or infer availability.
- Tool execution, GitHub mutation, publishing, user-level Skill installation, and canonical record updates remain explicitly out of scope.
- A future runtime issue may add locking/concurrency, identity/authorization enforcement, or adapters only if the chosen host and permissions are specified. These are not historical parity claims.

## Gate

Current-use behavior is validated and ready for merge when the concise helper tests and repository validators pass. Historical parity remains `UNKNOWN` where the source does not establish a callable baseline; that verdict does not block future use of the reconstructed contract.

