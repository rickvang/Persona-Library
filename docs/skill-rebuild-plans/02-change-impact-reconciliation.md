# Rebuild plan: $change-impact-reconciliation

## Status and recovery basis

- Historical status: not confirmed as an explicit skill in the referenced branch.
- Current evidence: AGENTS.md, content/site-orientation.json, ARCHITECTURE.md, Guide content, validation rules, and reconciliation prototypes require a universal post-change protocol.
- Exact package status: missing. This is a current repository contract candidate, not an exact historical recovery.

## Build target

Create .agents/skills/change-impact-reconciliation/SKILL.md as a read-only universal protocol.

Proposed frontmatter contract:

~~~yaml
name: change-impact-reconciliation
description: Review the downstream effects of a source, record, decision, prototype promotion, generated artifact, or durable execution change without silently applying unrelated updates.
metadata:
  change_mode: reconciliation_adapter
  change_domain: cross-space
  reconciliation: skip
~~~

This skill must never recursively invoke itself.

## Scope and routing

Activate after a material change to a source, Persona, Skill, Tool, Playbook, Doc, Decision, prototype promotion, generated artifact, or durable usage record.

Skip ordinary read-only work and isolated prototype exploration unless an impact review is explicitly requested.

This skill checks consequences. It does not perform the domain research, rewrite records, grant permission, execute tools, or decide whether a proposed change is authorized.

## Operating procedure

1. Read the initiating skill’s change_mode, change_domain, and reconciliation metadata.
2. Identify the changed source, record, decision, prototype, or artifact.
3. Load declared relationships and provenance from the canonical repository data.
4. Enumerate direct and known indirect dependents.
5. Classify each relationship as confirms, extends, qualifies, contradicts, invalidates, or unrelated.
6. Check affected fields for stale placeholders, unsupported assumptions, duplicate sections, contradictions, invalid statuses, and broken links.
7. Check generated outputs when source or client files changed.
8. Separate required updates from optional follow-up work.
9. Report incomplete dependency visibility rather than claiming exhaustive coverage.
10. Return the reconciliation report without applying durable changes unless the request separately authorizes them.

## Context contract

Inputs:

- Initiating change and evidence.
- Skill contract metadata.
- Canonical records and relationship declarations.
- Generated artifact provenance.
- Requested authorization and target scope.

Outputs:

- Impacted records and artifacts.
- Classification for each impact.
- Required, optional, and unchanged items.
- Stale or contradictory content.
- Validation checks performed.
- Blockers, confidence, and next action.

## Safety and authority

- Read-only by default.
- Never treat declared relationships as proof that an update is required.
- Never hide incomplete dependency visibility.
- Do not overwrite historical Decision rationale.
- Do not reconcile prototype content as live truth.
- Do not call the universal pass recursively.

## Dependencies and resources

Required resources:

- content/site-orientation.json
- content/library-model.js
- ARCHITECTURE.md
- scripts/validate-content.mjs

Potential focused references:

- references/impact-classification.md
- references/dependency-sources.md

Do not add those references until their rules are stable and maintained in one place.

## Build steps with $skill-creator

1. Confirm no existing package or plugin already provides this protocol.
2. Initialize the package with $skill-creator.
3. Write the read-only protocol and impact classifications.
4. Add only the references needed to keep the entrypoint concise.
5. Add agents/openai.yaml only if an explicit UI entry is useful.
6. Validate the package independently.
7. Connect domain adapters only after this package passes its own tests.

## Validation cases

1. Source update that confirms an existing claim. Expected: confirms classification and no unnecessary rewrite.
2. Source update that qualifies a claim. Expected: affected claim and confidence flagged.
3. Contradictory source. Expected: contradiction, open question, and no invented compromise.
4. Generated artifact update. Expected: source/output freshness and affected pages checked.
5. Prototype promotion. Expected: isolation, explicit Decision, and live dependency checks.
6. Missing metadata. Expected: read-only fallback and explicit contract gap.
7. Domain adapter already ran. Expected: one universal pass with no recursion.

## Acceptance criteria

- Every maintained package can declare a clear handoff to this protocol.
- The protocol distinguishes direct evidence from inferred dependency.
- It reports unchanged records and incomplete visibility.
- It never changes durable content by implication.
- It validates generated output when applicable.
- It passes quick validation and all cases above.

## Migration notes

Keep this package separate from persona-reconciliation. The latter is the Persona-specific domain adapter; this package is the universal cross-space check. The adapter runs first, followed by one universal pass.

