# Issue 115 reconciliation report

## Status

Complete for the read-only reconstruction and recovery decision; ready for review. No source recovery implementation is proposed.

## Change observed and initiating contract

- **Change observed:** two historical Git stashes containing uncommitted Skill, routing, documentation, validator, generated-output, and temporary-plan changes.
- **Initiating authority:** explicit issue #115 instructions and the user request to do issue 115.
- **Scope:** local reconstruction against the recorded historical parents, bounded comparison with current `main`, and a durable report.
- **Initiating route:** Docs → `work-order-start`.
- **Contract:** `change_mode=authorized_update`, `change_domain=docs`, `reconciliation=change-impact-reconciliation`; the universal reconciliation adapter is read-only and reports consequences rather than applying changes.
- **Remote baseline:** `origin/main` and GitHub `main` both resolve to `8f77c24ec63f063a801943fc6d5d4f3009b666c7` at review time.

## Original bases and reconstruction

| Stash | Stash commit | Original parent / base | Base parent | Reconstruction result |
| --- | --- | --- | --- | --- |
| `stash@{0}` | `af5e7eafc854548a7f604c3e3d504113ed29d45f` | `fc59265cb4a8fe00d42e6c21088aa57e76881bf1` | `8c0a1123c361c6f215b824529dbc9a894cdbbe7c` | Applied cleanly on `inspect/stash-0` |
| `stash@{1}` | `535eb489b9120c2989e4531af75b5520656ab6f4` | `3e8ba9096dc9d5b2c023623515e699b43a4d38b5` | `16b79db22a6927da0cc8c57d71acd748336e1ad9` | Applied cleanly on `inspect/stash-1` |

Both applications were performed with `git stash apply`, not `git stash branch`; neither stash was dropped or rewritten. Each reconstruction exposed the same two untracked historical payload areas: `.agents/skills/pl-skill-creator/` and `.codex-tmp/`. The latter was inspected and removed from the temporary checkout as an issue non-goal; neither was restored into this branch.

## Relationship between the stashes

The stashes are one evolving workstream, not independent features, but they are not a simple subset relationship.

- They were created from different branches at the same timestamped implementation point. Their common merge base is `8c0a112...`.
- `stash@{0}` is the broader earlier uncommitted routing/metadata change set on `fc59265...`, before the unified onboarding commit was in that branch history.
- `stash@{1}` is a narrower follow-up on `3e8ba90...`, whose parent already includes the unified onboarding commit `16b79db...`.
- The direct snapshot comparison is only six paths (`ARCHITECTURE.md`, `README.md`, the conformance context and records, and the onboarding Work Order deletion), with 10 insertions and 82 deletions. That small direct diff is caused by the divergent bases and must not be read as proof that stash 1 is a complete subset of stash 0.
- Logical overlap is substantial: stash 0 contains the initial routing/metadata implementation, while stash 1 contains the later `pl-skill-creator` naming correction and related Guide/validator updates.

Therefore, stash 1 is historical predecessor/follow-up evidence within the same workstream, and neither stash is an independent implementation candidate.

## Logical change classification

| Logical change | Evidence | Classification | Recovery decision |
| --- | --- | --- | --- |
| Add `skill_layer` frontmatter to the existing repository-local Skill packages | Stash 0 changes 11 `SKILL.md` files; current `main` requires and carries `skill_layer` across the package set | **Already absorbed** | Do not port package metadata |
| Establish the five-layer routing taxonomy and package-to-route checks | Stash 0 adds the schema-1.1 inline `routing` map and validator checks; current `main` retains the taxonomy and validates it through schema 2.0 route groups and focused validators | **Already absorbed** | Current route-group structure wins; do not restore inline routes |
| Rename the package-authoring handoff from generic `skill-creator` to local `pl-skill-creator` | Stash 0/1 update the orientation handoff, route target, AGENTS map, and multi-perspective wording; current `main` has `.agents/skills/pl-skill-creator/`, the `skills` route group, and the Guide section | **Already absorbed** | No source or documentation port |
| Add or recover the `pl-skill-creator` package | Stash 0 carries it as an untracked package; current `main` has the package and a newer route-group-aware instruction | **Already absorbed** | Do not transplant the historical package |
| Add a Quick routing map to `AGENTS.md` | Stash 0 adds a duplicated human-readable table; current `AGENTS.md` is intentionally the compact bootstrap while current route groups and the Guide own routing detail | **Already absorbed** / historical file shape superseded | Keep current compact contract |
| Add inline route and package metadata validation to `scripts/validate-content.mjs` | Stash 0/1 add checks to the monolithic entrypoint; current `main` delegates to `scripts/validation/orientation.mjs` and related modules with the same or broader coverage | **Already absorbed** | Do not port monolithic checks |
| Transplant `dist/data/site-orientation.json` and `dist/guide.html` | Both stashes include generated snapshots | **Obsolete/conflicting** | Generated files are outputs; current `main` wins and no historical bytes are copied |
| Change the historical skill-rebuild plan to defer multi-perspective and playbook-composer packages | Stash 0/1 edit the old plan path and remove its collaboration-layer note; current `main` later contains both reconstructed packages and moved plan/archive paths | **Obsolete/conflicting** | Do not port a plan-era conclusion that current repository history superseded |
| Recover `.codex-tmp/skill-rebuild-plans-before-rebase/` | Stash 0/1 include a temporary 12-file plan snapshot | **Obsolete/conflicting** | Explicit non-goal; removed only from temporary inspection checkouts |
| Remove `docs/work-orders/WO-2026-09-08-onboarding-routing/work-order.md` | Direct stash comparison shows the deletion; current `main` archives this Work Order to preserve history and its lifecycle contract forbids deleting terminal evidence | **Obsolete/conflicting** | Keep the archived Work Order |
| Adjust conformance observations/context/work-order wording about validator status | Direct stash comparison contains an alternate historical explanation of a validator blockage; current `main` has the completed archived Work Order and current modular validator/source state | **Already absorbed** | Do not rewrite completed historical records |

## Direct snapshot differences that are not unique recovery work

The direct `git diff --name-status stash@{1} stash@{0}` reports:

```text
M  ARCHITECTURE.md
M  README.md
M  docs/collaboration/problem-context-conformance-observability.json
M  docs/work-orders/WO-2026-09-08-conformance-observability/observations.md
M  docs/work-orders/WO-2026-09-08-conformance-observability/work-order.md
D  docs/work-orders/WO-2026-09-08-onboarding-routing/work-order.md
```

The architecture and README differences primarily reflect the branch-base divergence: current `main` retains the modern `skill_layer`, Mara placement, source-ownership, and generated-output rules. The conformance record differences are historical status updates that were later superseded by the archived completed record on `main`. The Work Order deletion conflicts with the current history-preserving archive policy. None is a unique, compatible source change to recover.

## Current-source impact pass

Bounded sources checked:

- `content/site-orientation.json` and `content/orientation/skills.json` for bootstrap, route-group ownership, package identity, availability, and mutation boundaries.
- `ARCHITECTURE.md` for source ownership, generated-output, package-layout, Mara placement, and reconciliation boundaries.
- `AGENTS.md`, `README.md`, and `dist/guide.html` for current onboarding behavior.
- `.agents/skills/**/SKILL.md`, including `multi-perspective-skill-synthesis`, `playbook-composer`, and `pl-skill-creator`.
- `scripts/validate-content.mjs` and `scripts/validation/**` for current validator organization.
- `docs/internal/skill-rebuild/plans/`, `docs/work-orders/archive/2026-09/`, and the relevant conformance context for later disposition.

| Dependent | Relationship | Impact class | Evidence and action |
| --- | --- | --- | --- |
| Current orientation bootstrap and `skills` route group | Declared routing/provenance | **Confirms** | Current schema 2.0 delegates routes to `content/orientation/*.json` and names `pl-skill-creator`; no update required |
| Local Skill package metadata | Declared package contract | **Confirms** | Current packages already carry required layer and change metadata; no update required |
| Generated Site orientation and Guide | Generated provenance | **Unrelated** to recovery content | Historical output is stale by definition; do not copy it; current output remains authoritative |
| Validator entrypoint and focused modules | Declared validation dependency | **Confirms** | Current split modules absorb historical route/metadata checks; no update required |
| Archived conformance Work Order and context | Historical execution record | **Qualifies** | Historical stash wording is not current status; preserve the archived record and do not rewrite it |
| Archived onboarding Work Order | Historical evidence/lifecycle | **Contradicts** the stash deletion | Current archive preserves terminal history; retain it |
| Skill rebuild plan | Historical planning reference | **Invalidates** the stash’s defer conclusion | Later main commits created/recovered the packages and moved the plan; no port |

Dependency visibility is bounded to declared route/provenance relationships and repository references found in the paths above. This is not an exhaustive external runtime or GitHub dependency graph.

## Generated outputs and validation

- `dist/data/site-orientation.json` and `dist/guide.html` were inspected as generated stash outputs and intentionally not transplanted.
- No authored source change survived reconciliation, so the current build was not run; running it would be a separate generated-output mutation with no recovery payload to regenerate.
- `node --test scripts/validation/validation.test.mjs` passed: 6 tests, 0 failures.
- `node scripts/validate-content.mjs` was attempted on the clean current baseline and failed before stash-specific checks with `Generated dist/data/library-data.js is stale; run build-library.mjs`. This is a pre-existing current-main baseline condition, not a recovered change. It remains an explicit limitation rather than a reason to alter unrelated generated data.
- `git diff --check` is required after this report is staged/committed.

## Stash disposition and next action

The stashes are intact and remain the source evidence. No stash can be dropped as part of this report. The smallest next action is reviewer acceptance of this no-recovery decision; only a separate explicit cleanup authorization should remove the preserved stashes.
