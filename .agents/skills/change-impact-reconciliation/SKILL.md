---
name: change-impact-reconciliation
description: Review downstream effects of a material source, record, decision, prototype promotion, generated artifact, or durable execution change without silently applying unrelated updates.
metadata:
  skill_layer: governance
  change_mode: reconciliation_adapter
  change_domain: cross-space
  reconciliation: skip
---

# Change Impact Reconciliation

## Recovery status

This is a repository-local reconstruction. The historical callable package was not recovered from the previous Persona Library conversation or the current skill registries. The current repository contract, architecture, guide, and reconciliation prototypes justify this universal protocol. Do not describe it as an exact historical restoration.

## Use this skill when

Activate after a material change to a source, Persona, Skill, Tool, Playbook, Doc, Decision, prototype promotion, generated artifact, or durable execution record. Activate when the user explicitly requests an impact or reconciliation review, even if no write is authorized.

Skip ordinary read-only questions and isolated prototype exploration when no impact review is requested. The initiating domain workflow owns the research or mutation; this skill checks consequences. It does not perform domain research, rewrite records, execute tools, grant permissions, decide whether a change is authorized, or publish anything.

This universal pass must never invoke itself recursively.

## Contract preflight

1. Read the initiating skill or workflow contract, including change_mode, change_domain, and reconciliation. If any required metadata is missing, use the safest read-only behavior and report the contract gap.
2. Identify the actual change event, source authority, changed fields, revision, and requested scope. Do not infer a change from a URL, a record mention, or a historical claim alone.
3. Record authorization and target information as constraints. Do not decide that incomplete authorization is sufficient; report it as a blocker.
4. Read the smallest relevant current sources: [the orientation manifest](../../../content/site-orientation.json), [the canonical model](../../../content/library-model.js), [the architecture contract](../../../ARCHITECTURE.md), and [the content validator](../../../scripts/validate-content.mjs) when the change touches them.

## Dependency sources and visibility

Use declared, inspectable sources of dependency:

- Explicit typed relationships and canonical records in content/library-data.js.
- Normalized relationships and workflow reach produced by content/library-model.js.
- Decision records and their affected surfaces, source prototypes, and revisit conditions.
- Declared source-to-output provenance for generated modules and pages.
- Named references in the initiating change and relevant repository guidance.

Repository search can discover candidates but does not prove an exhaustive graph. Bound the review by the identified scope, state what was searched, report known direct and indirect dependents, and disclose incomplete dependency visibility. Never manufacture an edge because two records use similar words.

## Impact classification

Classify each checked relationship or dependent as exactly one of these when evidence allows:

- **Confirms:** the change supports an existing claim or contract without changing its scope.
- **Extends:** the change adds supported scope, behavior, evidence, or a new affected surface.
- **Qualifies:** the change narrows, conditions, dates, or lowers confidence in an existing claim.
- **Contradicts:** the change conflicts with an existing claim or rule; preserve the conflict and open the decision.
- **Invalidates:** the source, relationship, status, or output no longer supports the dependent claim.
- **Unrelated:** the item was checked and has no material downstream consequence.

If evidence cannot distinguish the classes, say so and mark the classification uncertain. Do not invent a compromise between contradictory sources.

## Operating procedure

1. Capture the change event, initiating contract, authority, scope, and evidence.
2. Load explicit relationships and declared provenance from the canonical data and relevant records.
3. Enumerate direct dependents, then known indirect dependents within the bounded scope.
4. For each dependent, record its relationship, impact class, evidence, confidence, and whether an action is required.
5. Inspect affected fields for stale placeholders, unsupported assumptions, duplicate sections, contradictions, invalid statuses, broken links, and mismatched revision notes.
6. When source or client files changed, check generated output freshness and the affected pages or modules. A build command that writes generated files is a separate authorized step; do not run it from this read-only skill.
7. Separate required updates from optional follow-up work and from checked-but-unchanged items.
8. Return a reconciliation report with limitations and a smallest next action. Do not apply durable changes by implication.

## Report contract

Return a compact report with these fields:

- Status: complete, partial, or blocked.
- Change observed: source, record, decision, prototype, artifact, or execution record.
- Initiating contract: change_mode, change_domain, reconciliation, and any gaps.
- Scope checked: sources, relationship types, records, outputs, and search boundary.
- Impacts: dependent, direct or indirect, relationship, class, evidence, confidence, and action.
- Required updates: only changes needed to restore a supported contract.
- Optional follow-ups: useful but non-blocking work.
- Unchanged checked: relevant items with no material consequence.
- Generated outputs: freshness and validation checks, or the exact check not run.
- Blockers and incomplete visibility: missing data, access, metadata, or unresolved conflict.
- Next action: owner, target, and approval needed.

## Special boundaries

- **Read-only default:** this skill may inspect files and run read-only checks, but it does not edit live content, create records, publish, merge, or install anything.
- **Relationships are evidence, not orders:** a declared relationship identifies where to look; it does not prove that an update is required.
- **Decisions are append-only:** do not overwrite historical rationale. A changed conclusion needs an authorized new decision record that supersedes the old one.
- **Prototypes are not live truth:** a prototype may reference live records, but live records must not depend on it. Promotion requires an explicit decision, a deliberate change set, and a reconciliation pass.
- **Missing metadata:** fall back to read-only, report the gap, and do not treat metadata as permission.
- **Tool boundaries:** do not execute tools, change access, grant permissions, or treat a tool record as proof of availability.
- **No recursion:** when a domain adapter already ran, perform one universal pass and record that fact. Do not call this protocol again.

## Adapter order and handoffs

Persona-specific reconciliation is a domain adapter, not a replacement for this universal pass. When the initiating workflow requires an adapter, the adapter runs first and this protocol runs once afterward. If the adapter has already run, consume its report and do not invoke it again.

Return the report to the initiating workflow or the explicitly named owner. Typical owners are persona research or persona skills for their domain work, tool discovery or tool record maintenance for tool concerns, panel or layout workflows for their artifacts, and the repository owner for generated outputs. Verify that a named handoff is actually available before claiming it was invoked.

## Repository dependencies

The required current sources are:

- content/site-orientation.json for routing and mutation policy.
- content/library-model.js for normalized skill and relationship behavior.
- content/library-data.js for authored relationships, provenance, and maintenance records.
- ARCHITECTURE.md for source-of-truth, prototype, decision, tool, and generated-output boundaries.
- scripts/validate-content.mjs for read-only content and generated-output validation when applicable.

Do not add a references directory until impact classifications or dependency sources need maintained detail that cannot remain concise in this entrypoint.

## Validation checklist

Before handoff, confirm:

- The actual change, authority, scope, and initiating contract were identified.
- Dependents came from explicit relationships or declared provenance, with search limits stated.
- Every reported impact has a class, evidence, and confidence or an explicit uncertainty.
- Required, optional, and unchanged items are separated.
- Generated outputs were checked when applicable, without running an unauthorized write step.
- Prototype, decision-history, tool-availability, permission, and recursion boundaries were preserved.
- The report names blockers, incomplete visibility, and the smallest next action.

See the concise golden scenarios and checkpoint comparison at ../../../docs/skill-rebuild-tests/change-impact-reconciliation.golden.md.

