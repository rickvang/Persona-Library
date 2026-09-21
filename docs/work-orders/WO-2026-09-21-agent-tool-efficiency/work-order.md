# Work Order — Reduce agent tool-call and deployment churn

- Work Order ID: `WO-2026-09-21-agent-tool-efficiency`
- Status: active
- Created: 2026-09-21
- Last updated: 2026-09-21
- Issue: https://github.com/rickvang/Persona-Library/issues/159
- Repository: `rickvang/Persona-Library`
- Base: `main` at `64bbc8b7b189c8504154546bfff17a26a5bd75fb`
- Branch: `feat/issue-159-vercel-tool-record`
- Requester: `rickvang`
- Owner: ChatGPT implementation agent
- Explicit collaborator: Mara Okoye · knowledge systems architect (placement/boundary review)
- Request mode: update
- Authorized target: implementation for issue #159 in one focused pull request; merge is not authorized by this Work Order

## Objective

Reduce unnecessary agent iteration, remote tool calls, GitHub churn, and Vercel deployments while preserving validation quality and making materially useful progress visible to the requester.

## Mara placement and boundary review

Mara Okoye’s creation gate was applied from `content/site-orientation.json`, the Tools route, the current Tool-use model, and the Work Order contract.

| Candidate | Result | Boundary reason |
| --- | --- | --- |
| Extend `tool-discovery-and-safe-execution` with a shared remote-tool efficiency contract | Select | This is reusable execution behavior across remote Tools, not a new Persona or Skill identity. |
| Add separate GitHub and Vercel Tool-use recipes to `content/library-data/tool-integration.js` | Select | Vendor-specific procedures belong in Tool-use recipes and can attach to the existing Tool and context design Skill. |
| Add Riley Tool requirements for the two recipes | Select | Riley is the default routing/orchestration front door and already owns Tool/context preflight; the requirements make the recipes discoverable without copying them into every Persona. |
| Add a new Tool space, registry, Persona, Skill, or Playbook | Qualify | No new space, Persona, Skill, Playbook, or runtime is needed. A canonical Vercel Tool identity is now justified because the existing Tool-use recipe, live deployment evidence, and permission/availability boundary need a stable record relationship rather than a static page-only label. |
| Put all behavior only in this Work Order or issue | Reject | That would not make the behavior reusable for future agents. |
| Put GitHub/Vercel-specific rules directly into every Work Order | Reject | Work Orders should reference reusable Tool-use procedures rather than duplicate vendor-specific execution details. |

The durable architecture rationale is recorded in `DEC-018`.

## Scope

- shared remote-tool efficiency contract in the Tool execution skill;
- GitHub and Vercel Tool-use recipes plus Riley requirements;
- GitHub-native repository validation;
- Vercel Git branch gating that prevents routine non-main commits from creating deployment records;
- focused tests for preview gating;
- concise repository and Work Order guidance;
- generated output refresh and reconciliation evidence;
- canonical `tool-vercel` record plus stable recipe/Persona requirement relationships.

## Non-goals

- replacing GitHub or Vercel;
- removing previews or user review checkpoints;
- changing unrelated Vercel projects;
- treating implementation authorization as merge authorization;
- adding a new runtime registry or CI/CD platform;
- changing production Functions without evidence of a runtime problem.

## Success criteria

- repository validation runs in GitHub without requiring Vercel;
- routine non-main branches create no automatic Vercel deployment records; `main` remains automatic and `preview-*` branches are the explicit automatic Preview path;
- `main` continues to build for Production;
- future agents can discover the efficiency behavior through the Tool-use route;
- requester-visible Preview checkpoints remain available and agent-owned;
- generated `dist/**` output remains current;
- Tool and cross-space reconciliation finds no broken relationships.

## Validation plan

Run or obtain current CI evidence for:

```bash
node scripts/build-library.mjs
node scripts/validate-content.mjs
node --test scripts/validation/validation.test.mjs scripts/validation/vercel-git-deployment.test.mjs
git diff --check
git diff --exit-code -- dist
```

Also verify routine branch commits create no Vercel deployment records, `preview-*` remains explicitly deployment-enabled for intentional Previews, and `main` remains production-build eligible.

## Current phase and next action

Phase: canonical Tool-record follow-up. PR #167 merged the deployment-record quota correction as `64bbc8b7b189c8504154546bfff17a26a5bd75fb`; Vercel reports that exact `main` production deployment READY. The current branch promotes the already-proven Vercel capability and boundaries into canonical `toolCatalog` data, attaches the existing Vercel recipe and Riley requirement by stable Tool ID, updates the Tools surface, and adds relationship/regression validation. Routine branch commits continue to create no Vercel deployment records.

Next action: open the focused Tool-record PR, run GitHub repository validation, verify the branch still creates no Vercel deployment record, and merge after a clean preflight.
## Completion boundary

Ready-for-review requires the focused PR, passing repository validation, current generated output, a successful explicit Preview checkpoint, and recorded Tool/cross-space reconciliation. Completion and merge remain separately authorized.


## 2026-09-21 quota follow-up

The original ignored-build mechanism reduced completed builds but did not reduce deployment-object creation. Vercel created a deployment record for each Git push and only then returned the ignored build as `CANCELED`; those records contributed to the daily deployment limit.

The correction uses Vercel's Git `deploymentEnabled` branch rules instead:

- `**: false` blocks automatic Git deployments by default;
- `main: true` preserves automatic Production deployment;
- `preview-*: true` provides an explicit automatic Preview branch convention;
- the obsolete `ignoreCommand`, marker script, and marker regression test are removed.

This changes the mechanism, not DEC-018's architectural boundary: GitHub CI remains repository truth, Vercel remains deployed-state evidence, and Previews are reserved for materially useful checkpoints.

## 2026-09-21 Vercel Tool-record follow-up

The Tool-use recipe and Riley requirement existed before a canonical Vercel Tool identity. That left a catalog inconsistency: the Tools surface described Tool records, but Vercel existed only as recipe/requirement strings.

This follow-up adds a first-class `toolCatalog` data model and promotes Vercel as `tool-vercel` with explicit capability, connector description, scope, risk, permission, approval, verification, fallback, runtime-dependent availability, evidence, relationships, revision history, and lifecycle status. The existing recipe and Riley requirement now reference that stable Tool ID. This does not claim that Vercel is available in every runtime or that account permissions are configured.
