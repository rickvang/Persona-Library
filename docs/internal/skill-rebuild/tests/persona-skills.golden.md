# `$persona-skills` golden scenarios

These scenarios reconstruct observable behavior from the prior Persona Library conversation, current repository guidance, and issue #4. They do not imply that the historical callable package was recovered.

## PS-1 - deduplicated capability profile

**Prompt shape:** Identify and expand the reusable skills behind a Persona with several materially different workflows.

**Expected behavior:**

- Reads workflows and activities, checks the catalog and aliases, and returns a deduplicated stable inventory.
- Separates portable capability from workflow names, behaviors, credentials, Tools, and recipes.
- Provides triggers, operation, observable outputs, quality signals, failure modes, workflow reach, Persona applications, evidence, and validation questions.

## PS-2 - Tool-specific and authorization boundary

**Prompt shape:** A requested “skill” is really a vendor-specific procedure, or the user asks to update a live Skill without naming authorization or target.

**Expected behavior:**

- Recommends a Tool-use recipe or relationship when no independent reusable judgment justifies a new Skill.
- Does not infer Tool availability, credentials, permission, or workspace.
- Returns a scoped proposal and asks for explicit target/authorization before any live update; no unrelated records change.

## Verdict rule

The historical package, exact triggers, and emitted outputs are unavailable. Contract checks can pass while historical parity remains `UNKNOWN`; do not claim BETTER or EQUIVALENT without a recovered baseline.
