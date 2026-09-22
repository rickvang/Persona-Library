# Work Order — Issue #187 targeted Operational Scenario retrieval

- Work Order ID: `WO-2026-09-21-operational-scenario-files`
- Updated: 2026-09-21
- Requester: repository owner
- Owner: Riley Morgan / ChatGPT implementation agent
- Explicit collaborator: Mara Okoye · knowledge systems architect (placement review)
- Request mode: update
- GitHub issue: https://github.com/rickvang/Persona-Library/issues/187
- Current Work: https://app.notion.com/p/3e3cd82535ff818ea455c709890baeec
- Branch: `refactor/issue-187-operational-scenario-files`
- Base: `main` at `4d49ba3cb3565bdea8d08fbc75d7810ce8cb4a5e`

## Outcome

Prevent Operational Scenario source retrieval from consuming unnecessary agent context.

Replace the ~29 KB monolithic authored scenario file with:

- a ~4 KB routing-only `index.json`;
- one authored file per scenario body;
- build/validation discovery driven by the index;
- the same normalized runtime scenario catalog and generated browser bundle behavior.

## Placement review

Mara classification: **existing-record storage refactor + new files**, not a new library space or knowledge identity.

Selected:
- `content/library-data/operational-scenarios/index.json` — compact routing manifest;
- one scenario body per `.js` file in the same directory;
- generated `dist/data/library-data.js` may remain combined.

Rejected:
- keeping the 29 KB monolith as the agent entrypoint;
- a new top-level Operational Knowledge space;
- making the generated browser bundle the source retrieval surface.

## Retrieval contract

Repository agent path:

`task → owner/route → index.json → one scenario body → work`

Do not load every body to decide which scenario applies.

## Validation

- Index paths are unique and constrained to the scenario directory.
- Every authored scenario `.js` file appears in the index and every indexed path exists.
- Index entries remain routing-only.
- Index identity/owner/status/match metadata agrees with the full scenario body.
- Index maps one-to-one to normalized scenarios.
- Existing five scenario IDs and matcher behavior remain intact.
- Generated runtime data remains current.

## Current checkpoint

Core source split committed in `ebeaa1eeee395316b968a54d3a7076842fda5b18`.

Next: repository validation, review corrections if any, reconciliation/archive, final merge preflight.
