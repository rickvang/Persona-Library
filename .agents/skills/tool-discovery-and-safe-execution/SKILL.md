---
name: tool-discovery-and-safe-execution
description: Resolve a required capability to the safest currently available Tool or MCP, prepare a bounded probe, verify the result, and record learnings without silently granting access or changing shared state.
metadata:
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

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Express the required capability, goal, artifact, scope, risk, and success criteria before selecting a vendor or connector.
3. Inspect the Tools, connectors, MCPs, workspaces, and permissions actually exposed by the current requester runtime. Do not infer availability, credentials, or approval from repository documentation.
4. Identify the intended mode: catalog/planning (read-only), bounded read-only probe, authorized side-effecting action, or durable usage/lesson/artifact recording.
5. Record the requested workspace, authorization, approval status, fallback, and verification method. If any material value is unknown, report it before execution.

## Availability states

Use one explicit state for each candidate:

- **Available:** the current runtime exposes the capability and its required scope; approval and target are still checked separately.
- **Referenced but unavailable:** documentation or a record names the capability, but the current runtime does not expose it or its scope cannot be verified.
- **No Tool needed:** the task can be completed safely without a Tool.
- **Blocked or insufficiently verified:** a candidate exists but workspace, permission, target, approval, or verification is missing.

Never turn `referenced but unavailable` into an execution attempt. A connector record does not establish that a credential, workspace, or permission is configured.

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

## Probe and execution contract

A bounded probe must name its purpose, target, inputs, expected result, scope limit, approval, rollback or recovery path, and verification. Prefer no-write probes. If a probe can alter shared state, publish, merge, send a message, change access, incur material cost, or expose sensitive data, treat it as a side effect and wait for explicit authorization.

If execution is blocked, return the availability state, exact missing requirement, safe fallback, and the smallest next action. Do not keep trying different Tools or workspaces to bypass a permission or scope boundary.

## Learning and record boundary

- **Usage note:** one observed attempt with Tool, action, target/workspace, result, evidence, and limitations.
- **Candidate lesson:** a possible reusable learning that still needs review or repetition.
- **Reviewed lesson:** a learning accepted through the repository's review process with evidence and scope.
- **Tool-use recipe:** a reviewed capability-to-Tool procedure with prerequisites, mode, fallback, and verification.
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
- Catalog and reconciliation handoffs are named only when required and actually available.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/tool-discovery-and-safe-execution.golden.md).
