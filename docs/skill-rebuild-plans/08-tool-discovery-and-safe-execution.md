# Rebuild plan: $tool-discovery-and-safe-execution

## Status and recovery basis

- Historical status: claimed created as the Tools MVP skill for discovery, resolution, safe probes, usage notes, and learning.
- Current evidence: Tools pages, tool-use recipes, execution contracts, Guide prompts, and ARCHITECTURE.md.
- Exact package status: missing. Reconstruct the execution boundary without turning the static Site into a runtime manager.

## Build target

Create .agents/skills/tool-discovery-and-safe-execution/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: tool-discovery-and-safe-execution
description: Resolve a required capability to the safest currently available tool or MCP, prepare a bounded probe, verify the result, and record learnings without silently granting access or changing shared state.
metadata:
  change_mode: external_execution
  change_domain: tools
  reconciliation: change-impact-reconciliation
~~~

When used only for catalog comparison or planning, the effective mode is read-only.

## Scope and routing

Activate when work needs a new Tool, connector, MCP, repository, document space, design file, local workspace, or capability resolution.

Do not activate for Tool catalog maintenance, credentials, access grants, arbitrary autonomous execution, or a Tool record update by itself.

## Operating procedure

1. Express the required capability rather than assuming a vendor.
2. Inspect the tools and connectors actually exposed by the requester’s runtime.
3. Compare candidate Tools by capability, scope, risk, permissions, workspace, fallback, and evidence.
4. State the availability state: available, referenced but unavailable, or no Tool needed.
5. Propose the smallest safe action and identify read/write mode, workspace, approval, and verification.
6. Prefer read-only or sandboxed probing.
7. Request approval before edits, publishing, merging, new access, or other side effects.
8. Execute only an exposed and authorized Tool.
9. Verify the result against the requested outcome and quality signals.
10. Record the Tool, action, workspace, result, evidence, failure/friction, and lesson candidate.
11. Hand reviewed catalog changes to tool-record-maintenance.

## Context contract

Inputs:

- Required capability.
- Goal and artifact.
- Requester-exposed Tools and permissions.
- Workspace or scope.
- Risk and approval constraints.
- Fallback options.

Outputs:

- Availability state.
- Selected Tool or reason none is suitable.
- Proposed action and permission boundary.
- Workspace, fallback, and verification method.
- Usage record and lesson candidate.

## Safety and authority

- A Tool record is not proof of current availability.
- Never grant permissions, handle credentials, select an arbitrary workspace, or modify shared state without authorization.
- Do not publish, merge, or create external side effects from a read-only request.
- A single attempt becomes a usage note, not permanent learning.
- Do not update Persona or Skill records automatically.

## Dependencies and resources

Required:

- persona-library-orientation
- Tool records and tool-use recipe model
- requester-provided runtime capability inventory

Handoffs:

- tool-record-maintenance for catalog changes
- change-impact-reconciliation when durable usage records, lessons, recipes, or artifacts are created

Potential references:

- references/execution-contract.md
- references/usage-record-and-lesson-status.md

## Build steps with $skill-creator

1. Initialize after checking for an existing package or connector-specific equivalent.
2. Keep capability resolution, availability states, safety gates, and evidence capture in SKILL.md.
3. Put detailed Tool record fields and lesson status in references if needed.
4. Do not add connector code or credentials to the package.
5. Test assessment, unavailable-tool, safe-probe, and authorized-execution paths independently.

## Validation cases

1. Resolve visual-reference lookup with Figma and a manual fallback.
2. Resolve a capability when the documented Tool is not exposed; expected: limitation before dependent work.
3. GitHub change request; expected: approval before branch or repository side effects.
4. Local workspace request; expected: explicit approved path and reversible action.
5. Successful probe; expected: usage note with evidence, not automatic shared guidance.
6. Failed probe; expected: failure record and bounded fallback.

## Acceptance criteria

- Capability is resolved before vendor selection.
- Actual availability is checked from the runtime, not inferred from documentation.
- Side effects and approval boundaries are explicit.
- Probes are bounded, reversible, and verified.
- Learnings are separated into usage notes, reviewed lessons, recipes, and validated guidance.
- Tool catalog changes use the maintenance skill.

## Migration notes

The Site’s Figma page demonstrates the execution contract but is not a connector. The rebuilt skill should preserve that separation and remain useful when no runtime or MCP is exposed.


