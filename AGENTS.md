# Personas system orientation

Before modifying this project, read `content/site-orientation.json` as the small bootstrap. Classify the request, select the smallest relevant primary space, then read only that space's declared route group and linked records.

Use the shortest relevant path:

1. Classify the request as answer, research, plan, prototype, update, or consult.
2. Read the selected primary space's `route_file` from `content/orientation/`, then read only the relevant route and linked records.
3. Treat the default mode as read-only.
4. Keep prototype records isolated from live Personas, Skills, Tools, Playbooks, and production workflows.
5. Before creating a durable record, space, file, or generated artifact, route placement and boundary questions through Mara Okoye’s knowledge-systems review.
6. Append durable rationale to Decisions instead of silently rewriting history.
7. Read the selected skill’s `change_mode`, `change_domain`, and `reconciliation` metadata. After a source, record, Decision, prototype promotion, or generated artifact changes, follow that contract and run `$change-impact-reconciliation` when required; keep it read-only unless the requested scope authorizes updates.
8. For a multi-Persona build, create or load a named `problem-context` and use the collaboration Playbook; keep contributions attributable and require a concrete solution-quality gate before completion.
9. Validate the result and report outcome, assumptions, evidence, limitations, and next action.
10. Use a Work Order as the generic active-work packet and progress record for non-trivial in-progress work. Link specialized artifacts instead of duplicating them; a Work Order records authorization constraints but never grants mutation permission.
11. Create a GitHub issue for each non-trivial plan and keep the plan, scope, status, and next actions tracked there; link the issue from the related Work Order when one exists.

## Bootstrap handoff

`content/site-orientation.json` is the canonical bootstrap and route-group index. It contains the universal contract, request modes, primary-space choices, and each space's `route_file`; the route groups contain route IDs, first reads, boundaries, availability distinctions, and reconciliation handoffs. Read the bootstrap first, select one primary space, load that group's file, and then load the smallest relevant route and linked records. Do not load unrelated route groups.

The selected route group owns the route-specific handoff, including the callable Skill or artifact target, layer, first reads, boundaries, and reconciliation contract. Verify that a named package is actually available before invoking it; the bootstrap and route groups are the canonical routing inventory.

Verify that a named package is available in the current repository or runtime before invoking it. A Persona `skillLibrary` entry, plan, issue, URL, or documentation mention describes a capability or route; it does not prove a callable package exists. Not every request needs a Skill: a direct Doc, relationship, template, Work Order, or Playbook may be the correct destination.
