# Reconciliation — Issue #159 agent/tool efficiency

## Placement result

Mara’s placement review selected an existing-record extension rather than a new system concept:

- shared efficiency behavior extends `tool-discovery-and-safe-execution`;
- GitHub and Vercel procedures are separate Tool-use recipes;
- Riley receives Tool requirements so the recipes are discoverable through existing orchestration;
- no new Persona, Skill identity, Playbook, Tool space, registry, or runtime is introduced.

## Impact map

| Surface | Impact | Disposition |
| --- | --- | --- |
| Tool execution Skill | extends | Adds evidence reuse, batching, cheapest-sufficient validation, escalation, and visible-checkpoint rules. |
| Tool-use recipes | extends | Adds GitHub repository-change and Vercel review-checkpoint procedures. |
| Riley Tool requirements | extends | Makes the two procedures discoverable without copying them into every Persona. |
| GitHub repository workflow | extends | Adds read-only PR/main validation as the default remote repository-validation layer. |
| Vercel configuration | extends | Routine branches are disabled at the Git-deployment boundary before deployment creation; `main` remains automatic and `preview-*` is the explicit automatic Preview path. |
| AGENTS / Work Order guidance | extends | References the reusable Tool-use behavior and preserves pre-mutation freshness requirements. |
| Decisions | extends | DEC-018 records the durable tool/validation/deployment boundary. |
| Generated Site/data | extends | Library data and Decisions output are rebuilt from canonical authored sources. |
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
