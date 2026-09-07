---
name: tool-record-maintenance
description: Add, update, relate, reconcile, audit, retire, and supersede canonical Tool records while preserving evidence, scope, permissions, fallbacks, and revision history without executing the Tool.
metadata:
  change_mode: record_update
  change_domain: tools
  reconciliation: change-impact-reconciliation
---

# Tool Record Maintenance

## Recovery status

This is a repository-local reconstruction. The prior Persona Library conversation described Tool record maintenance as separate from Tool execution, but the exact historical callable package was not recovered. The current Tools catalog, Tool-use recipes, and architecture boundaries are evidence for the contract.

## Use this skill when

Activate for canonical Tool or MCP catalog records, capability fields, identity and aliases, relationships, evidence, revision history, audits, retirement, or supersession.

Do not activate for connector execution, credential configuration, access grants, workspace selection, safe probing, or a request to determine actual runtime availability. Route those operations to `tool-discovery-and-safe-execution`. A catalog record can describe a capability without proving that it is available or configured.

## Required preflight

1. Read [the orientation manifest](../../../content/site-orientation.json) and [the repository contract](../../../AGENTS.md).
2. Identify the Tool or MCP identity, requested operation, target record, evidence, authorization, output destination, and success criteria.
3. Load the current Tool catalog, related Tool-use recipes, Persona requirements, Skill relationships, Playbooks, resources, and revision history that are in scope. Read [the current data](../../../content/library-data.js) and [normalizer](../../../content/library-model.js) when relationship resolution is involved.
4. Establish whether the request is a proposal/audit or an explicitly authorized live record update. Missing target, authorization, or metadata means read-only reporting, not a guessed write.

## Operating modes

### Add

Create a canonical Tool record only after identity, duplicate, scope, evidence, required fields, and authorization checks. Mark availability as unknown or unconfirmed when it has not been checked by the runtime skill.

### Update

Change named fields while preserving the previous revision, rationale, evidence status, and affected relationships. Do not rewrite unrelated fields.

### Relate

Connect a Tool to Personas, Skills, Playbooks, recipes, capabilities, resources, or replacements using explicit relationships. A relationship expresses a documented need or use; it does not prove availability or execution.

### Reconcile

Compare overlapping or conflicting records and recommend merge, preserve, supersede, or keep both. Do not delete history or silently collapse distinct scopes.

### Audit

Identify missing or inconsistent identity, capability, scope, workspace, risk, permission, approval, verification, fallback, availability, evidence, relationships, or revision fields. Report gaps without filling them.

### Retire or supersede

Mark a record retired or superseded with rationale, date/revision context, replacement when known, affected relationships, and preserved history. Do not delete the historical record.

## Operating procedure

1. Define the requested catalog operation, Tool identity, target, scope, authorization, and evidence.
2. Load the existing record and related records. Check canonical identity, aliases, category, capability, and overlapping records before creating anything.
3. Capture the descriptive execution contract when known: connector path, workspace, scope, risk, permission, approval rule, verification method, fallback, and availability status. Keep these facts separate; do not claim any are configured unless evidence establishes it.
4. Prepare a proposed change set listing field additions, changes, removals, relationship changes, history, rationale, and unresolved gaps.
5. Preserve evidence distinctions: observed usage, reported capability, proposed metadata, reviewed lesson, and validated guidance. A single usage attempt is not shared guidance.
6. Update explicit relationships to Personas, Skills, Playbooks, recipes, capabilities, resources, replacements, and affected workflows. Report broken or ambiguous links.
7. For reconcile or retire operations, preserve all relevant prior identity and rationale and state whether the outcome is merge, preserve, supersede, keep both, or retire.
8. Validate required fields, stable identity, relationship targets, URLs/resources, status, history, and no-execution boundary.
9. Apply only the explicitly authorized and scoped record update. If authorization is absent, return the proposal and do not write.
10. For an authorized durable change, run `$change-impact-reconciliation` once after the catalog work. Do not execute a Tool or recursively invoke the execution or maintenance skill.

## Tool record contract

Use the current repository record and validator as the exact schema authority. A complete record should distinguish, when known:

- identity, stable ID, aliases, category, and capability;
- connector or access path as a description, not proof of configuration;
- workspace, scope, data sensitivity, risk, permission, approval, verification, and fallback;
- availability state and evidence source;
- Tool-use recipes and relationships to Personas, Skills, Playbooks, resources, and replacements;
- usage notes, reviewed lessons, validated guidance, failure modes, and limitations;
- revision history, rationale, affected fields, confidence, and retirement/supersession status.

Do not add fields merely to satisfy this list. Do not copy the current Figma or other Tool records into the package; the Site catalog remains the content source of truth.

## Evidence and availability rules

- **Observed:** directly supported by an execution record or named source within scope.
- **Reported:** supplied by a user or source but not independently verified in the current runtime.
- **Proposed:** intended record content awaiting review or authorization.
- **Reviewed or validated:** accepted by the repository review process with evidence and scope.
- **Unknown:** not established by the available material.

Never infer a connector, credential, workspace, permission, approval, or availability from documentation, a recipe, a Persona requirement, or a catalog record. Send actual runtime checks to the discovery/execution skill.

## Output contract

Return:

- Outcome and mode, Tool identity, target, scope, authorization, and assumptions.
- Current record and related records inspected, duplicate/overlap result, and visibility limits.
- Proposed or applied field changes and relationship changes.
- Capability, scope, permission, approval, verification, fallback, availability, and evidence status.
- Revision history, rationale, retirement/supersession status, and preserved conflicts.
- Validation checks, broken links, blockers, optional follow-ups, reconciliation handoff, and next action.

When a field or status cannot be established, say unknown or unconfirmed. When a requested operation is execution, return the handoff rather than executing it.

## Safety, permissions, and handoffs

- A catalog record never proves that a connector is available or configured.
- Do not execute a Tool, probe a workspace, configure credentials, grant permissions, or change access.
- Do not delete historical records. Retire or supersede them with explicit rationale and replacement information when known.
- Do not promote one usage note to validated guidance without review or repeated evidence.
- Do not update Persona, Skill, Playbook, Doc, Decision, or recipe content beyond the explicitly authorized Tool-record scope.
- Do not silently merge records with different identity, scope, risk, or evidence.
- If target, authorization, required metadata, or relationship visibility is missing, stay read-only and report the gap.

Route actual execution or safe probing to `tool-discovery-and-safe-execution`. After an authorized durable record change, run one `$change-impact-reconciliation` pass. These handoffs do not grant authority and must not recurse.

## Focused validation

Before handoff, confirm:

- Identity and duplicates were checked before adding a record.
- Required Tool fields are explicit and evidence-aware.
- Record, connector, workspace, permission, approval, and availability remain distinct.
- Relationships resolve or are reported as broken/ambiguous.
- History is preserved through update, reconcile, retire, and supersede.
- No Tool, credential, or permission operation was executed.
- The proposed/applied scope, authorization, validation, limitations, and reconciliation handoff are clear.

See the [concise golden scenarios and comparison](../../../docs/skill-rebuild-tests/tool-record-maintenance.golden.md).
