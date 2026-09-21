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
12. For work that depends on current repository state, treat `rickvang/Persona-Library` as this project's canonical GitHub repository and online work surface unless the requester explicitly names another repository. Prefer an exposed connected/native GitHub plugin or connector for supported operations; use browser or computer interaction for unsupported operations or explicitly requested UI workflows. Do not use a local checkout, Codex worktree, remote-local checkout, local file edits, or local Git commands as a fallback for repository work. Refresh current `main` and relevant issue, pull request, branch, commit, review, and check state before planning or review, and again before consequential mutations. If the direct integration is available but not connected, ask the requester to connect or authorize it; if GitHub is unavailable, report that limitation instead of falling back locally or inferring remote state. Follow the pinned [GitHub operating instructions](https://github.com/rickvang/tool-repo/blob/94acc6082e941439d2ee532f1b1b091cd42eb923/tools/github/AGENTS.md). Reading GitHub state does not authorize comments, edits, branch or file writes, pull request changes, merges, closes, labels, assignments, settings, or access changes.
13. For tool-heavy work, gather the minimum sufficient evidence in a bounded pass, reuse still-valid state, batch related actions, and validate at the cheapest sufficient layer. Refresh remote state when a material freshness trigger exists and always before a consequential mutation. Route vendor-specific execution through the applicable Tool-use recipe; do not poll, recommit, or redeploy merely because an intermediate step exists.


## Shared Persona Workspace

Persona-Library may be opened from the parent [Persona Workspace](https://github.com/rickvang/persona-workspace). Use the parent workspace only for cross-repository discovery and coordination. For sibling discovery, follow the parent workspace's [repository map](https://github.com/rickvang/persona-workspace/blob/main/REPOSITORIES.md) rather than hard-coding sibling paths or behavior.

For work inside Persona-Library, this repository's local instructions remain authoritative. Workspace membership or visibility of sibling repositories does not grant permission to mutate them; keep reads, writes, commits, branches, pull requests, and other mutations scoped to the explicitly authorized repository.


## Bootstrap handoff


`content/site-orientation.json` is the canonical bootstrap and route-group index. It contains the universal contract, request modes, primary-space choices, and each space's `route_file`; the route groups contain route IDs, first reads, boundaries, availability distinctions, and reconciliation handoffs. Read the bootstrap first, select one primary space, load that group's file, and then load the smallest relevant route and linked records. Do not load unrelated route groups.
