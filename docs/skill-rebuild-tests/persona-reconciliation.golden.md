# `$persona-reconciliation` golden scenarios

These compact scenarios reconstruct the Persona-specific adapter from the prior Persona Library conversation, current repository guidance, and issue #5. The historical callable package was not recovered.

## PRC-1 - shared capability change

**Prompt shape:** A reusable Skill changes and is applied by two named Personas with different workflows and protections.

**Expected behavior:**

- Loads each named Persona independently and maps the changed Skill to affected applications, workflows, activities, Tools/recipes, needs, implications, evidence, confidence, and revision context.
- Preserves Persona-specific differences and reports required, optional, and unchanged updates.
- Classifies each impact with evidence and does not flatten the shared Skill into the Persona applications.
- Returns a bounded update set and runs the universal reconciliation pass at most once when required.

## PRC-2 - contradiction and scope boundary

**Prompt shape:** A new source contradicts one Persona claim, while authorization or the target for a broader update is missing.

**Expected behavior:**

- Classifies the affected claim as `contradicts`, preserves the existing claim and open question, and records the source limitation.
- Falls back to a partial or blocked read-only report when target, authority, or metadata is missing.
- Does not rewrite unrelated fields, update other Personas, promote hypotheses, or invoke the adapter/universal pass recursively.

## Verdict rule

The historical package, exact triggers, and emitted outputs are unavailable. Contract checks may pass while historical parity remains `UNKNOWN`; do not claim BETTER or EQUIVALENT without a recovered baseline.
