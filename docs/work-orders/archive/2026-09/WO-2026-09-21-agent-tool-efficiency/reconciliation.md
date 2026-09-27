# Reconciliation — Issue #159 agent/tool efficiency

## Placement result

Mara’s placement review selected an existing-record extension rather than a new system concept:

- shared efficiency behavior extends `tool-discovery-and-safe-execution`;
- GitHub and Vercel procedures are separate Tool-use recipes;
- Riley receives Tool requirements so the recipes are discoverable through existing orchestration;
- no new Persona, Skill identity, Playbook, Tool space, or runtime is introduced; a canonical Vercel Tool record is added inside the existing Tools space because the previously recipe-only identity is now evidence-backed.

## Impact map

| Surface | Impact | Disposition |
| --- | --- | --- |
| Tool execution Skill | extends | Adds evidence reuse, batching, cheapest-sufficient validation, escalation, and visible-checkpoint rules. |
| Tool catalog | extends | Adds canonical `tool-vercel` identity and stable Tool relationships without implying runtime availability. |
| Tool-use recipes | extends | Adds GitHub repository-change and Vercel review-checkpoint procedures; the Vercel recipe now points to `tool-vercel`. |
| Riley Tool requirements | extends | Makes the two procedures discoverable without copying them into every Persona; the Vercel requirement now points to `tool-vercel`. |
| GitHub repository workflow | extends | Adds read-only PR/main validation as the default remote repository-validation layer. |
| Vercel configuration | extends | Routine branches are disabled at the Git-deployment boundary before deployment creation; `main` remains automatic and `preview-*` is the explicit automatic Preview path. |
| AGENTS / Work Order guidance | extends | References the reusable Tool-use behavior and preserves pre-mutation freshness requirements. |
| Decisions | extends | DEC-018 records the durable tool/validation/deployment boundary. |
| Generated Site/data | extends | Library data is rebuilt with `toolCatalog`; the Tools surface exposes the canonical Vercel record and linked recipe. |
| Skills onboarding | repairs pre-existing baseline | Routes the existing `local-video-inspection` package so full repository validation can become actionable. |
| Personas beyond Riley | unchanged | No duplicated vendor-specific guidance is added. |
| Existing Skills / Playbooks / Operating Packs / Templates | unchanged | No identity, ownership, or relationship transfer is required. |
| Private Applications data | unchanged | No private opportunity rows or credentials are introduced. |

## Boundary checks

- GitHub inspection, mutation, review, and merge authorization remain separate.
- Vercel Preview is deployed-state evidence, not a replacement for repository CI.
- User-visible review checkpoints are preserved through explicit `preview-*` branches or another deliberate Vercel deployment path; ordinary branches do not auto-deploy.
- The pre-existing Skill-route repair is explicitly separated from the #159 root cause.
- Final pre-merge status: reconciled. GitHub CI run `35625619378` passed all repository gates, one explicit Preview reached READY, and unmarked follow-up commits were canceled by the Vercel ignored-build gate. Actual Production behavior remains a post-merge verification.


## 2026-09-21 mechanism correction

Live quota behavior qualified the original implementation evidence: Vercel's Ignored Build Step still created a deployment record before canceling the build. The durable DEC-018 boundary remains unchanged, but the implementation now moves the decision to Git branch deployment eligibility.

The follow-up removes the marker/ignored-build runtime and uses `git.deploymentEnabled` so ordinary branches do not reach deployment creation. Five consecutive fix-branch commits were absent from the Vercel deployment list, directly addressing the quota failure mode. No Persona, Skill, Playbook, Tool identity, private application data, or Production runtime behavior changes in this correction.

## 2026-09-21 canonical Tool-record reconciliation

The earlier reconciliation treated Vercel as recipe-only because the repository had no standalone canonical Tool-record array. Subsequent live use established enough evidence to qualify that assumption:

- Vercel is repeatedly used for named-project deployment inspection and Production/Preview verification.
- Runtime availability, account permission, and deployment authorization are distinct and now documented as record fields.
- The existing Riley recipe and requirement already depend on the Vercel identity.
- PR #167 proved the resource-aware Git deployment boundary in production while preserving `main` deployment.

Placement result: extend the existing Tools domain with `toolCatalog` and add `tool-vercel`; do not create a new Tool space or runtime. Static legacy cards may coexist temporarily, but canonical relationships must use stable Tool IDs. The relationship validator now enforces the Vercel record → recipe → Persona requirement chain.
