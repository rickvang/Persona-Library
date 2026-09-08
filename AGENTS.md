# Personas system orientation

Before modifying this project, read `content/site-orientation.json` and follow its routing, scope, and mutation rules.

Use the shortest relevant path:

1. Classify the request as answer, research, plan, prototype, update, or consult.
2. Read only the relevant space and linked records.
3. Treat the default mode as read-only.
4. Keep prototype records isolated from live Personas, Skills, Tools, Playbooks, and production workflows.
5. Append durable rationale to Decisions instead of silently rewriting history.
6. Read the selected skill’s `change_mode`, `change_domain`, and `reconciliation` metadata. After a source, record, Decision, prototype promotion, or generated artifact changes, follow that contract and run `$change-impact-reconciliation` when required; keep it read-only unless the requested scope authorizes updates.
7. For a multi-Persona build, create or load a named `problem-context` and use the collaboration Playbook; keep contributions attributable and require a concrete solution-quality gate before completion.\n8. Validate the result and report outcome, assumptions, evidence, limitations, and next action.
