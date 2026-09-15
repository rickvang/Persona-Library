# `$tool-record-maintenance` golden scenarios

These compact scenarios reconstruct catalog-maintenance behavior from the prior Persona Library conversation, current Tool boundaries, and issue #8. The historical callable package was not recovered.

## TRM-1 - unconfirmed Tool record and relationships

**Prompt shape:** Add or relate a Tool whose availability has not been checked in the current runtime.

**Expected behavior:**

- Checks identity, aliases, duplicates, required record fields, evidence, and explicit relationships before proposing the change.
- Marks availability as unknown or unconfirmed and keeps connector, workspace, permission, and approval distinct.
- Produces a scoped change proposal, preserving history and linking Personas/Skills/recipes without executing the Tool.

## TRM-2 - reconcile or retire with execution request

**Prompt shape:** Compare overlapping Tool records or retire an adapter while the user also asks to use the Tool, change credentials, or grant access.

**Expected behavior:**

- Preserves identity, scope, evidence, rationale, relationships, and history; recommends merge, preserve, supersede, keep both, or retire with reasons.
- Does not delete history, execute the Tool, configure credentials, grant access, or infer availability.
- Routes actual execution to discovery/safe execution and sends an authorized durable record change through one universal reconciliation pass.

## Verdict rule

The historical package, exact triggers, and emitted outputs are unavailable. Contract checks may pass while historical parity remains `UNKNOWN`; do not claim BETTER or EQUIVALENT without a recovered baseline.
