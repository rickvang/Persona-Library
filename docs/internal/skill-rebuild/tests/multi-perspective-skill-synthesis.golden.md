# `$multi-perspective-skill-synthesis` golden scenarios

These compact scenarios reconstruct observable behavior from the historical Persona Library conversation, issue #11, current repository guidance, and the embedded method in `$persona-skills` and `$persona-panel-orchestration`. The exact historical callable package was not recovered.

## MPSS-1 - distinct perspectives form a reusable core

**Prompt shape:** Compare several materially distinct evidence sources or applications whose triggers, decisions, outputs, or quality signals expose a possible shared capability; no Persona records are required.

**Expected behavior:**

- Loads only the selected sources/applications and relevant evidence, then processes each independently.
- Compares triggers, decisions, actions, outputs, quality signals, constraints, and Tool/recipe needs.
- Separates portable shared judgment from context-specific applications and preserves meaningful disagreement.
- Checks existing Skills, aliases, primitives, relationships, and recipes before proposing a new identity.
- Returns a concrete core profile, evidence/uncertainty, validation plan, and a bounded `pl-skill-creator` handoff for standalone Skill work; Persona-specific handoff is conditional on an actual Persona application; no live record changes occur without authorization.

## MPSS-2 - reuse or no-new-Skill boundary

**Prompt shape:** The proposed capability is vague, already covered by an existing Skill, or supported by only one materially useful evidence source.

**Expected behavior:**

- Narrows the proposal or recommends reuse, a relationship, a contextual application, a workflow method, a recipe, or the existing single-source Skill authoring path instead of forcing a new Skill.
- Reports the evidence gap and does not invent additional sources, participants, or consensus.
- Does not execute Tools, change records, install packages, or imply that a draft was published.

## Verdict rule

The historical package, exact triggers, and emitted outputs are unavailable. Contract checks can pass while historical parity remains `UNKNOWN`; do not claim BETTER or EQUIVALENT without a recovered baseline.
