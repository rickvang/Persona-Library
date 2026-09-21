# Work Order — Refresh Web App Design System Template provenance after example-routing merge

- Work Order ID: `WO-2026-09-21-template-example-routing-reconciliation`
- Status: active
- Created: 2026-09-21
- Last updated: 2026-09-21
- Issue: https://github.com/rickvang/Persona-Library/issues/137
- Repository: `rickvang/Persona-Library`
- Base: `main`
- Branch: `fix/issue-137-template-example-routing-reconciliation`
- Requester: `rickvang`
- Owner: ChatGPT implementation agent
- Request mode: update
- Authorized target: implement issue #137, open and merge the focused pull request, allow the existing in-scope issue closing linkage to close #137, and then reconcile CW-6.

## Objective

Refresh the Persona-Library Web App Design System Template record after template-library PR #10 merged as `560e0e5bdf3a56bcc8983a421b3112a070734023`.

## Placement and boundary review

This is an existing-record provenance and evidence update in the Templates space.

| Candidate | Result | Boundary reason |
| --- | --- | --- |
| Update `template-design-system-web-app` source revision, verification, evidence, and revision history | Select | The external artifact changed only in discoverability/process documentation and examples indexing. |
| Update the project-local starter provenance pointer | Select | It currently presents the older template-library revision as current-facing provenance. |
| Change Template identity, starter copy boundary, lifecycle, status, Persona/Skill relationships, or runtime availability | Reject | PR #10 does not provide evidence for those changes. |
| Create a new Template or Decision | Reject | No new reusable starting artifact or durable architectural choice was introduced. |

The Work Order package is the existing repository convention for non-trivial active work; no new record type or space is introduced.

## External source evidence

template-library PR #10 merged to `main` as `560e0e5bdf3a56bcc8983a421b3112a070734023` and changed:

- `CONTRIBUTING.md`;
- repository `README.md`;
- `templates/design-systems/web-app/README.md`;
- `templates/design-systems/web-app/examples/README.md`.

The Web App Template still declares `starter/` as the copy boundary and remains a candidate Template. The examples index describes source-neutral candidate references outside the starter boundary and routes new examples to components, patterns, layouts, a new Template, or project-local work.

## Scope

- refresh the Web App Design System Template source revision and verification text;
- refresh evidence and add a new Template revision-history entry;
- update the current-facing project-local starter provenance pointer;
- synchronize generated library data;
- run Template-specific and universal reconciliation;
- validate repository output;
- merge the focused PR and close issue #137;
- mark CW-6 complete after the repository handoff lands.

## Non-goals

- no Template identity change;
- no lifecycle/status promotion;
- no runtime-access claim;
- no new example content;
- no changes to the current data-table example;
- no Persona, Skill, Operating Pack, Playbook, or Tool relationship changes.

## Success criteria

- `template-design-system-web-app` points to `560e0e5bdf3a56bcc8983a421b3112a070734023`;
- verification/evidence accurately describes example-routing guidance and the examples index;
- lifecycle remains `candidate`;
- status remains `Candidate external reference`;
- starter copy boundary remains `starter/`;
- generated data matches authored data;
- repository validation passes;
- issue #137 closes through the authorized merge;
- CW-6 is moved to Done / Reference after the merge.

## Current phase and next action

Phase: implementation.

Next action: update authored Template metadata and provenance, synchronize generated output, record reconciliation, and open the focused PR.

## Completion boundary

Complete when the focused PR is merged to current `main`, issue #137 is closed, the landed Template record is verified, and CW-6 reflects the completed cross-repository handoff.
