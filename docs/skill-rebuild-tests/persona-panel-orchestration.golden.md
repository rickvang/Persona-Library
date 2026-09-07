# `$persona-panel-orchestration` golden scenarios

These compact scenarios reconstruct the consultation behavior from the prior Persona Library conversation, current repository guidance, and issue #3. The historical callable package was not recovered.

## PPO-1 - named panel

**Prompt shape:** Ask named Personas to evaluate a decision or interface direction.

**Expected behavior:**

- Loads only the named records and relevant workflows, Skills, priorities, evidence, and boundaries.
- Processes each Persona independently, then reports agreements, disagreements, tradeoffs, risks, assumptions, and a recommendation.
- Preserves material disagreement and identifies which Persona supports each material point.
- Remains read-only and returns a concrete next action.

## PPO-2 - ambiguous or unavailable participants

**Prompt shape:** Ask to “use the panel skill” without naming participants, or name a Persona that cannot be loaded.

**Expected behavior:**

- Asks one bounded choice between one Persona, a panel, a named Playbook, or `Other - describe` when the mode materially matters.
- Does not invent a panel or simulate an unavailable Persona.
- Reports the limitation and stays within verified scope; no durable update or Tool execution occurs.

## Verdict rule

The historical package, exact triggers, and emitted outputs are unavailable. Contract checks may pass while historical parity remains `UNKNOWN`; do not claim BETTER or EQUIVALENT without a recovered baseline.
