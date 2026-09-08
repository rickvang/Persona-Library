# Personas system orientation

Before modifying this project, read `content/site-orientation.json` and follow its routing, scope, and mutation rules.

Use the shortest relevant path:

1. Classify the request as answer, research, plan, prototype, update, or consult.
2. Read only the relevant space and linked records.
3. Treat the default mode as read-only.
4. Keep prototype records isolated from live Personas, Skills, Tools, Playbooks, and production workflows.
5. Before creating a durable record, space, file, or generated artifact, route placement and boundary questions through Mara Okoye’s knowledge-systems review.
6. Append durable rationale to Decisions instead of silently rewriting history.
7. Read the selected skill’s `change_mode`, `change_domain`, and `reconciliation` metadata. After a source, record, Decision, prototype promotion, or generated artifact changes, follow that contract and run `$change-impact-reconciliation` when required; keep it read-only unless the requested scope authorizes updates.
8. For a multi-Persona build, create or load a named `problem-context` and use the collaboration Playbook; keep contributions attributable and require a concrete solution-quality gate before completion.
9. Validate the result and report outcome, assumptions, evidence, limitations, and next action.
10. Use a Work Order as the generic active-work packet and progress record for non-trivial in-progress work. Link specialized artifacts instead of duplicating them; a Work Order records authorization constraints but never grants mutation permission.

## Quick routing map

Use `content/site-orientation.json` as the canonical request-to-system map. The map distinguishes the layer of a callable repository Skill from the kind of workflow or artifact being used:

| Need | Start with | Layer or artifact |
| --- | --- | --- |
| Orient to this library | `$persona-library-orientation` | library management |
| Research a Persona | `$persona-research` | library management |
| Define or maintain Persona capabilities | `$persona-skills` | library management |
| Consult multiple Personas | `$persona-panel-orchestration` | orchestration |
| Form a reusable capability | `$multi-perspective-skill-synthesis` | orchestration |
| Create or update a callable Skill | `$skill-creator` | package authoring |
| Compose a reusable multi-stage process | `$playbook-composer` | orchestration |
| Resolve a Tool or permission | `$tool-discovery-and-safe-execution` | tool safety |
| Maintain a Tool record | `$tool-record-maintenance` | library management |
| Compare layouts in isolation | `$layout-lab` | Persona-applied prototype |
| Review downstream effects | `$change-impact-reconciliation` | governance |
| Run resume or application work | Job-search Docs and the active Work Order | workflow |

Verify that a named package is available in the current repository or runtime before invoking it. A Persona `skillLibrary` entry, plan, issue, URL, or documentation mention describes a capability or route; it does not prove a callable package exists. Not every request needs a Skill: a direct Doc, relationship, template, Work Order, or Playbook may be the correct destination.
