# Rebuild plan: $tool-record-maintenance

## Status and recovery basis

- Historical status: explicitly planned, then claimed built, validated, and version-controlled.
- Current evidence: Tools catalog, Figma detail record, tool-use recipes, Guide prompts, and Tool boundaries in ARCHITECTURE.md.
- Exact package status: missing. Reconstruct the catalog-maintenance behavior separately from Tool execution.

## Build target

Create .agents/skills/tool-record-maintenance/SKILL.md.

Proposed frontmatter contract:

~~~yaml
name: tool-record-maintenance
description: Add, update, relate, reconcile, audit, retire, and supersede canonical Tool records while preserving evidence, scope, permissions, fallbacks, and revision history without executing the Tool.
metadata:
  change_mode: record_update
  change_domain: tools
  reconciliation: change-impact-reconciliation
~~~

## Scope and routing

Activate for Tool or MCP catalog records, capability fields, relationships, evidence, revision history, audits, retirement, or supersession.

Do not activate for connector execution, credential configuration, access grants, workspace selection, or safe probing.

## Operating modes

- Add: create a record after checking identity and duplicates.
- Update: change specific fields and preserve the previous revision.
- Relate: connect a Tool to Personas, Skills, Playbooks, recipes, or capabilities.
- Reconcile: compare overlapping or conflicting records and recommend merge, preserve, supersede, or keep both.
- Audit: identify missing scope, risk, permission, fallback, evidence, or relationships.
- Retire: mark a record retired or superseded without deleting its history.

## Operating procedure

1. Load the existing Tool catalog and any related Tool-use recipes.
2. Establish identity, category, capability, connector path, scope, workspace, risk, permissions, and availability status.
3. Check for duplicate or overlapping records.
4. Make a proposed change set before applying it.
5. Preserve observed, reported, proposed, and validated evidence distinctions.
6. Update relationships to Personas, Skills, Playbooks, recipes, and supporting resources.
7. Record revision history, rationale, date, affected fields, and confidence.
8. Validate all references and required Tool contract fields.
9. Invoke the universal impact review for an authorized durable update.

## Context contract

Inputs:

- Tool or MCP identity.
- Requested operation.
- Existing record and related records.
- Evidence or usage notes.
- Scope, risk, permission, and fallback information.
- Explicit authorization.

Outputs:

- Proposed or applied record change.
- Duplicate/reconciliation result.
- Relationship changes.
- Evidence and availability status.
- Revision history.
- Validation and impact report.

## Safety and authority

- A catalog record never proves a connector is available.
- Do not configure credentials or grant permissions.
- Do not execute the Tool.
- Do not delete historical records; retire or supersede them.
- Do not promote one successful usage note to validated guidance without review.

## Dependencies and resources

Required:

- persona-library-orientation
- current Tool and recipe model
- tool-discovery-and-safe-execution for observed execution evidence
- change-impact-reconciliation for durable changes

Potential references:

- references/tool-record-contract.md
- references/tool-status-and-evidence.md
- references/tool-relationship-rules.md

## Build steps with $skill-creator

1. Initialize only after checking for an existing package.
2. Put operation routing, field boundaries, evidence status, and no-execution rules in SKILL.md.
3. Add schema references only where they prevent repeated rediscovery.
4. Keep automatic discovery enabled and require authorization at the write boundary.
5. Validate catalog-only behavior separately from execution behavior.

## Validation cases

1. Add a new Tool with availability unconfirmed; expected: record clearly marked unconfirmed.
2. Update GitHub approval rules; expected: history and affected relationships preserved.
3. Link Figma to a Persona, Skill, recipe, and Playbook.
4. Compare duplicate Figma or local-workspace records.
5. Retire an MCP adapter; expected: history remains and replacement is explicit.
6. Request actual Tool use; expected: handoff to safe execution, not execution by maintenance.

## Acceptance criteria

- All required Tool fields are explicit and evidence-aware.
- Record, connector, workspace, permission, and availability remain distinct.
- Relationships resolve or are reported as broken.
- History is preserved through update, merge, and retirement.
- No Tool, credential, or permission operation is executed.
- The package and catalog tests pass.

## Migration notes

The current Figma record and Tool-use recipes can seed the record contract. They should remain Site content; the package should teach maintenance rather than duplicate every Tool record.


