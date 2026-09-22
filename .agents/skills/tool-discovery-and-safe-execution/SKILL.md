---
name: tool-discovery-and-safe-execution
description: Resolve a required capability to the safest currently available Tool or MCP, prepare a bounded probe, verify the result, and record learnings without silently granting access or changing shared state.
metadata:
  skill_layer: tool_safety
  change_mode: external_execution
  change_domain: tools
  reconciliation: change-impact-reconciliation
---

# Tool Discovery And Safe Execution

## Recovery status

This is a repository-local reconstruction. The previous Persona Library conversation described this as the Tools MVP capability for discovery, safe probes, usage notes, and learning, but the exact historical callable package was not recovered. Preserve the distinction between a Site Tool record and an actually exposed runtime capability.

## Use this skill when

Activate when work needs capability resolution for a Tool, connector, MCP, repository, document space, design file, local workspace, or external action; when the user asks whether a Tool is available; or when a bounded probe must be planned or run.

Do not activate for canonical Tool catalog maintenance, credential configuration, access grants, arbitrary autonomous execution, or a Tool-record-only update. Route catalog changes to `tool-record-maintenance`. A documented Tool, URL, Skill, or recipe is not proof that the current runtime exposes it.

## Required preflight

1. Read [the orientation bootstrap](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md), then load the `tools` route group.
2. Express the required capability, goal, artifact, scope, risk, and success criteria before selecting a vendor or connector.
3. Inspect the Tools, connectors, MCPs, workspaces, and permissions actually exposed by the current requester runtime. Do not infer availability, credentials, or approval from repository documentation.
4. Identify the intended mode: catalog/planning (read-only), bounded read-only probe, authorized side-effecting action, or durable usage/lesson/artifact recording.
5. Record the requested workspace, authorization, approval status, fallback, and verification method. If any material value is unknown, report it before execution.
6. If the selected Tool-use recipe has an active Operational Scenario, load only the smallest matching scenario and apply its concrete do/don't, sequence, freshness, stop, escalation, and recovery guidance. Scenario guidance never grants permission or replaces current Tool/runtime evidence.

## Availability states

Use one explicit state for each candidate:

- **Available:** the current runtime exposes the capability and its required scope; approval and target are still checked separately.
- **Referenced but unavailable:** documentation or a record names the capability, but the current runtime does not expose it or its scope cannot be verified.
- **No Tool needed:** the task can be completed safely without a Tool.
- **Blocked or insufficiently verified:** a candidate exists but workspace, permission, target, approval, or verification is missing.

Never turn `referenced but unavailable` into an execution attempt. A connector record does not establish that a credential, workspace, or permission is configured.

## Remote-tool efficiency contract

When a task needs repeated repository, deployment, document, browser, or other remote-tool interaction:

1. Gather the minimum sufficient state in one bounded evidence pass before acting.
2. Record what would invalidate that evidence. Reuse it until a named freshness trigger occurs instead of polling unchanged state.
3. Batch related reads and writes into coherent units. Do not use remote calls, commits, deployments, or previews as a scratchpad for every internal thought or edit.
4. Validate at the cheapest layer that can answer the question: source/static checks before repository CI, repository CI before deployed Preview, and Preview before Production observation.
5. Escalate to another remote call when it adds new evidence, responds to a failed gate, satisfies a required freshness check, answers a deployed-state question, or produces a materially new user-reviewable state.
6. Preserve visibility while reducing calls. For visual, interaction, or deployed integration work, surface a meaningful review checkpoint early enough for the requester to steer the result; skip previews that add no new reviewable state.

Vendor-specific details belong in Tool-use recipes. This contract does not weaken permission, approval, verification, or pre-mutation freshness requirements.

## Operating procedure

1. Define the capability rather than assuming a vendor.
2. Enumerate only actually exposed candidates and compare capability, scope, risk, permissions, workspace, fallback, and evidence.
3. State the availability state and the reason. If no candidate is safe, stop at a limitation and fallback.
4. Propose the smallest action with explicit read/write mode, exact target/workspace, side effects, approval owner, fallback, and verification.
5. Prefer a read-only, sandboxed, reversible probe. Keep scope, input, time, data, and output bounded.
6. Before edits, publishing, merging, new access, credential use, or other side effects, obtain explicit authorization and confirm the target. Do not infer approval from a general request to "handle it."
7. Execute only an exposed Tool in the authorized scope. Do not substitute a different connector or workspace without saying so and obtaining approval when material.
8. Verify the result against the requested outcome and quality signals. Report partial success, side effects, and unverified portions.
9. Record the Tool, action, target/workspace, mode, approval, result, evidence, failure or friction, and lesson candidate. A single attempt is a usage note, not shared guidance.
10. Hand reviewed catalog changes to `tool-record-maintenance`. If execution creates a durable usage record, lesson, recipe, artifact, or other persistent change, run `$change-impact-reconciliation` once after the domain work.

## Candidate comparison contract

For each candidate, capture when known:

- capability match and limitations;
- actual runtime exposure and evidence source;
- scope, workspace, data sensitivity, and risk;
- permission and approval requirement;
- read/write or side-effect mode;
- fallback if unavailable or failed;
- verification method and stopping condition.

Separate these facts from a Tool record, a Skill requirement, a Tool-use recipe, a usage note, or a hypothesis. Never claim a candidate is available merely because it appears in the Site catalog or current documentation.

## Recipe experimentation and evidence loop

When the question is which Tool-use recipe or execution strategy works better for a stable Skill/workflow, use the comparison contract in [`eval/recipe-comparison.md`](../../../eval/recipe-comparison.md) instead of turning one execution into preference guidance.

1. Hold the stable unit explicit: Skill, workflow/activity, task or fixture, expected gate, repository/source revision, model/runtime, Tool availability, and permission conditions.
2. Change only the intended recipe/strategy dimension when practical. Record every material uncontrolled difference; classify the pair as comparable, qualified, or not comparable instead of hiding confounds.
3. Run at least two bounded candidates against the same named validation gate. Record success/failure, validation evidence, recovery/friction, and only resource metrics the runtime can observe reliably.
4. Keep every strategy result as an observation. Do not average away contradictory evidence and do not invent a composite score.
5. Review the evidence explicitly. The conclusion must be `preferred`, `conditional`, `fallback`, or `insufficient-evidence`, with scope and conditions visible.
6. Treat the reviewed conclusion as evidence for a separately authorized canonical update. It does not mutate Tool-use recipes, Persona Tool requirements, Operational Scenarios, or Skills by itself.
7. Mark evidence stale when a material Tool/runtime capability, recipe procedure, permissions model, source revision, validation gate, or task class changes.
8. Keep low-volume sanitized comparison evidence in Git by default. Propose a Supabase operational store only after a real writer, consumer, and query demonstrate that review files are insufficient.

A reviewed comparison can prefer one strategy in one context and keep another as fallback elsewhere. Never convert contextual evidence into a universal Tool ranking.

## Probe and execution contract

A bounded probe must name its purpose, target, inputs, expected result, scope limit, approval, rollback or recovery path, and verification. Prefer no-write probes. If a probe can alter shared state, publish, merge, send a message, change access, incur material cost, or expose sensitive data, treat it as a side effect and wait for explicit authorization.

If execution is blocked, return the availability state, exact missing requirement, safe fallback, and the smallest next action. Do not keep trying different Tools or workspaces to bypass a permission or scope boundary.

## Learning and record boundary

- **Usage note:** one observed attempt with Tool, action, target/workspace, result, evidence, and limitations.
- **Candidate lesson:** a possible reusable learning that still needs review or repetition.
- **Reviewed lesson:** a learning accepted through the repository's review process with evidence and scope.
- **Tool-use recipe:** a reviewed capability-to-Tool procedure with prerequisites, mode, fallback, and verification.
- **Operational / Golden Scenario:** a reviewed concrete execution example attached to an existing Skill or Tool-use recipe, with routing cues, good/bad traces, freshness and stopping rules, recovery, and evidence state.
- **Validated guidance:** repeated or otherwise explicitly reviewed evidence suitable for shared guidance.

Do not promote a usage note to a reviewed lesson, recipe, or validated guidance automatically. Do not update Persona or Skill records as a side effect of execution.

## Output contract

Return:

- Outcome and effective mode.
- Required capability, goal, artifact, target, scope, risk, and success criteria.
- Candidates considered, actual availability state, evidence, and reason for selection or rejection.
- Proposed or executed action, workspace, permission, approval, side effects, fallback, and verification.
- Result, partial success/failure, friction, usage note, and lesson status.
- Tool-record or reconciliation handoff status, blockers, unknowns, and next action.

When no Tool is exposed, say so plainly and provide the safest fallback. When execution did not occur, do not fabricate a result or lesson.

## Safety, permissions, and handoffs

- A Tool record is not proof of current availability, credentials, workspace, permission, or approval.
- Never grant access, configure credentials, select an arbitrary workspace, or modify shared state without explicit authorization.
- Do not publish, merge, send external messages, create durable records, or incur material cost from a read-only request.
- Use only exposed and authorized Tools; stop when the target or scope cannot be verified.
- Keep probes bounded, reversible where possible, and verified.
- Do not update Persona, Skill, Tool, Playbook, Doc, Decision, or prototype records automatically.
- Do not present one attempt as permanent learning. Preserve failures and limitations.
- If a named handoff is unavailable, report the exact blocked handoff rather than pretending it ran.

Catalog maintenance goes to `tool-record-maintenance`; durable execution evidence goes through one `$change-impact-reconciliation` pass after the execution workflow. These handoffs do not grant authority and must not recurse.

## Focused validation

Before handoff, confirm:

- Capability was defined before vendor selection and actual runtime exposure was checked.
- Availability, scope, permission, approval, workspace, fallback, and verification are explicit.
- The action was read-only, sandboxed, or explicitly authorized; no boundary was bypassed.
- Result, partial failure, friction, and evidence are recorded accurately.
- Usage note, lesson, recipe, and validated guidance are not conflated.
- Recipe/strategy comparisons preserve the stable unit, comparable conditions, explicit review, freshness triggers, and no automatic canonical mutation.
- Catalog and reconciliation handoffs are named only when required and actually available.
- Repeated remote calls were justified by new evidence, a failed gate, a material freshness trigger, a deployed-state question, or a meaningful review checkpoint rather than routine polling.
- When an active Operational Scenario matched the selected recipe, only the relevant scenario was loaded and its stop/recovery guidance was respected.

See the [concise golden scenarios and comparison](../../../docs/internal/skill-rebuild/tests/tool-discovery-and-safe-execution.golden.md).
