# Validation — Issue #159 agent/tool efficiency

## Current evidence

| Check | State | Evidence |
| --- | --- | --- |
| Initial implementation checkpoint | pass | Commit `7a5876ad75777887a2034f939d4533d4baa0882b` contains one coherent implementation batch. |
| Explicit Vercel review checkpoint | pass | Deployment `dpl_DjYovzQTVVnLJ4BHC3SKwx6KPPNG` reached READY for the `[vercel-preview]` commit on `feat/issue-159-agent-tool-efficiency`. |
| GitHub-native CI activation | pass | Repository validation workflow run `35624423820` started automatically on PR #163. |
| Build step in first CI run | pass | `node scripts/build-library.mjs` completed and built 15 library sources plus 19 Decision records. |
| Full content validation in first CI run | blocked by pre-existing baseline gap | `local-video-inspection` existed on `main` without an onboarding route; `scripts/validation/orientation.mjs` rejected that existing inconsistency. |
| #159 focused tests | pass | Repository validation run `35625619378` passed the standard validation suite plus `scripts/validation/vercel-ignore-build.test.mjs`. |
| Generated output freshness | pass | Run `35625619378` passed `git diff --exit-code -- dist` after rebuilding the tracked generated baseline. |
| Committed-range whitespace | pass | Run `35625619378` passed the PR base-to-head `git diff --check` gate. |
| Unmarked follow-up commits skip Vercel build work | pass | Unmarked commits produced Vercel deployment records that ended `CANCELED`; latest proof: commit `e37b43cfcc99c8ea1fad6596ac791f7d87d3aad4`, deployment `dpl_5FRvwfrsyJeB6pq2sQcAVijAu3pv`. They did not reach READY. |
| Production-branch eligibility | pass by focused test; live Production pending merge | The gating test proves `main` returns “build”; the actual Production deployment cannot be verified until a separately authorized merge updates `main`. |

## Baseline repair

The enabling correction adds the already-present `.agents/skills/local-video-inspection` package to the Skills onboarding route, updates the declared route count and validator expected-route set, and copies the route/bootstrap into generated output. This is not attributed to #159 as a newly introduced defect.

## Final pre-merge gate

The implementation is ready for review. GitHub CI run `35625619378` is green end to end, the explicit review Preview reached READY, and unmarked follow-up commits are stopped as CANCELED by the Vercel gate.

Vercel still creates a deployment record before the ignored-build decision is reflected as CANCELED. The improvement is therefore **avoided completed Preview builds**, not zero Vercel deployment records.

The remaining unverified boundary is the real Production deployment from `main`, which requires a separately authorized merge.


## 2026-09-21 deployment-record quota correction

The earlier ignored-build proof was insufficient for quota control: ignored commits still created Vercel deployment records before ending `CANCELED`.

Follow-up evidence:

| Check | State | Evidence |
| --- | --- | --- |
| Branch-level Git gate configured | pass | `vercel.json` sets `git.deploymentEnabled["**"] = false`, `main = true`, and `preview-* = true`; `ignoreCommand` is removed. |
| First fix commit creates no deployment record | pass | Commit `5d0e43a3a4853b1208ab2deb27e0e4600463d269` is absent from the project's Vercel deployment list. |
| Follow-up implementation commits create no deployment records | pass | Commits `b46914ebb51c4de533c9cb98278b15b95def9203`, `a2cde86da809abd4af9daa747f077c81bcfb5189`, `60e493edac8439c47102b554c2e7902f62a9e21f`, and `5668752cdf3b57b58cb3f3114b0e99e3026d99a5` are also absent from Vercel's recent deployment list. |
| Obsolete ignored-build implementation removed | pass | `scripts/vercel-ignore-build.mjs` and `scripts/validation/vercel-ignore-build.test.mjs` are removed. |
| Focused regression replacement | pending PR CI | `scripts/validation/vercel-git-deployment.test.mjs` asserts the branch policy and absence of `ignoreCommand`. |
| Production deployment behavior | pending merge | Static policy preserves `main: true`; live Production proof requires the merged main commit. |
| Explicit Preview branch behavior | configuration-proven; live proof deferred | `preview-*` is enabled by Vercel configuration. A live Preview is intentionally not triggered while the account is at its daily deployment limit. |

This follow-up changes the claim from “ignored commits avoid completed builds” to “routine branches do not create automatic Vercel deployment records.”
