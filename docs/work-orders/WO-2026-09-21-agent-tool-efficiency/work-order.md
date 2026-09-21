# Work Order — Reduce agent tool-call and deployment churn

- Work Order ID: `WO-2026-09-21-agent-tool-efficiency`
- Status: active
- Created: 2026-09-21
- Last updated: 2026-09-21
- Issue: https://github.com/rickvang/Persona-Library/issues/159
- Repository: `rickvang/Persona-Library`
- Base: `main` at `e428cd87e0b8655e08da825569d603052a79162a`
- Branch: `feat/issue-159-agent-tool-efficiency`
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
| Add a new Tool space, registry, Persona, Skill, or Playbook | Reject | Existing Tool-use, Skill, and Work Order layers already own the required responsibilities. |
| Put all behavior only in this Work Order or issue | Reject | That would not make the behavior reusable for future agents. |
| Put GitHub/Vercel-specific rules directly into every Work Order | Reject | Work Orders should reference reusable Tool-use procedures rather than duplicate vendor-specific execution details. |

The durable architecture rationale is recorded in `DEC-018`.

## Scope

- shared remote-tool efficiency contract in the Tool execution skill;
- GitHub and Vercel Tool-use recipes plus Riley requirements;
- GitHub-native repository validation;
- Vercel ignored-build gating for non-main commits;
- focused tests for preview gating;
- concise repository and Work Order guidance;
- generated output refresh and reconciliation evidence.

## Non-goals

- replacing GitHub or Vercel;
- removing previews or user review checkpoints;
- changing unrelated Vercel projects;
- treating implementation authorization as merge authorization;
- adding a new runtime registry or CI/CD platform;
- changing production Functions without evidence of a runtime problem.

## Success criteria

- repository validation runs in GitHub without requiring Vercel;
- non-main commits skip Vercel unless the agent marks a materially reviewable checkpoint;
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
node --test scripts/validation/validation.test.mjs scripts/validation/vercel-ignore-build.test.mjs
git diff --check
git diff --exit-code -- dist
```

Also verify one branch commit without the marker is ignored by Vercel, one `[vercel-preview]` checkpoint reaches Preview, and `main` remains production-build eligible.

## Current phase and next action

Phase: implementation batch prepared.

Next action: publish the implementation checkpoint, open the PR, inspect GitHub CI and the explicit Vercel Preview, refresh generated outputs if required, then record validation and reconciliation evidence.

## Completion boundary

Ready-for-review requires the focused PR, passing repository validation, current generated output, a successful explicit Preview checkpoint, and recorded Tool/cross-space reconciliation. Completion and merge remain separately authorized.
