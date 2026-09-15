# Issue #103 information-architecture and lifecycle audit

- Status: ready-for-review
- Issue: https://github.com/rickvang/Persona-Library/issues/103
- Base: 09ded617e7fbec4ae15f5aa45d468e07314fc4d3
- Branch: reconcile/issue-103-ia-lifecycle
- PR: [#105 — Reorganize repository docs and Work Order lifecycle](https://github.com/rickvang/Persona-Library/pull/105)
- Current PR head: refresh PR #105 before review; the live PR is authoritative and a self-referential head SHA is intentionally not duplicated here.
- Request mode: update
- Authorized target: rickvang/Persona-Library GitHub repository
- Scope: PR 1 repository IA, Work Order lifecycle hygiene, current Docs placement, generated-output cues, and future-agent placement rules.
- Non-goals: authored data redesign, nested Skill loader changes, hosting changes, deletion of historical evidence, or the separate library-data.js modularization workstream.

## Preflight evidence

- Current main and issue #103 were refreshed from GitHub before editing.
- Orientation path followed: AGENTS.md -> content/site-orientation.json -> content/orientation/docs.json -> work-order-start route -> docs/work-orders.md and docs/work-orders/README.md.
- Main combined status at the refreshed base was successful for Vercel. The repository has no `.github/workflows/` directory on this branch, so no GitHub Actions workflow is available here for the required Node command checks. Local checkout/Git commands were not used because the repository contract makes GitHub the canonical work surface.

## Move matrix

| Current path / classification | Proposed path | Action | Reason |
| --- | --- | --- | --- |
| JOB_SEARCH_IMPLEMENTATION.md / current job-search guidance | docs/job-search/implementation.md | move | Domain guidance belongs with existing job-search docs. |
| docs/bounded-parallel-implementation-playbook.md / current Playbook | docs/playbooks/bounded-parallel-implementation.md | move | Reusable Playbook guidance is grouped by subject. |
| docs/template-lifecycle-playbook.md / current Playbook | docs/playbooks/template-lifecycle.md | move | Reusable Playbook guidance is grouped by subject. |
| docs/design-system-starter.md / project-local UX artifact | docs/ux/design-system-starter.md | move | UX starter belongs with current UX guidance. |
| docs/skill-rebuild-plans/ / internal migration evidence | docs/internal/skill-rebuild/plans/ | move | Separate rebuild planning from current guidance. |
| docs/skill-rebuild-tests/ / internal migration evidence | docs/internal/skill-rebuild/tests/ | move | Separate comparison/golden evidence from current guidance. |
| Terminal Work Order packages | docs/work-orders/archive/2026-09/<id>/ | archive | Preserve history while keeping the root actionable. Archived package bytes remain historical evidence. |
| Review or blocked Work Order packages | unchanged under docs/work-orders/<id>/ | keep | Non-terminal work is not archived. |
| content/, .agents/skills/, client/, scripts/, eval/ | unchanged | keep | Existing ownership boundaries are clear. |
| dist/ | unchanged | keep | Generated publishable output remains in place. |
| content/library-data.js | unchanged | separate follow-up | Modularization is a separate behavior-preserving workstream. |

## Terminal package inventory

- WO-2026-09-08-conformance-observability
- WO-2026-09-08-mira-creative-orchestration
- WO-2026-09-08-onboarding-routing
- WO-2026-09-09-persona-skill-conformance
- WO-2026-09-10-operating-packs-corrections
- WO-2026-09-10-operating-packs
- WO-2026-09-11-design-system-starter
- WO-2026-09-11-operating-pack-source-verification
- WO-2026-09-11-template-librarian
- WO-2026-09-11-templates
- WO-2026-09-12-classic-single-column-resume-template
- WO-2026-09-12-resume-document-design-system
- WO-2026-09-12-resume-document-print-spacing
- WO-2026-09-12-resume-document-viewer-mockup
- WO-2026-09-12-web-app-design-system-view
- WO-2026-09-13-orientation-selective-loading
- WO-2026-09-13-template-catalog-viewer-states
- WO-2026-09-14-bounded-parallel-implementation
- WO-2026-09-14-bounded-parallel-p1-target-repo-wording
- WO-2026-09-14-bounded-parallel-p2-corrections
- WO-2026-09-14-bounded-parallel-source-grounding
- WO-2026-09-14-completed-work-order-status
- WO-2026-09-14-external-artifact-boundary-audit
- WO-2026-09-14-github-default-workflow
- WO-2026-09-14-maintenance-coupling
- WO-2026-09-14-multi-persona-collaboration-playbook-catalog
- WO-2026-09-14-restore-validator-checks
- WO-2026-09-14-riley-job-search-boundary
- WO-2026-09-14-template-lifecycle-playbook

## Active packages retained

- WO-2026-09-08-resume-writing (ready-for-review)
- WO-2026-09-09-ecolab-ux-lead (ready-for-review)
- WO-2026-09-09-uhg-senior-ux-engineer (ready-for-review)
- WO-2026-09-11-template-viewer (ready-for-review)
- WO-2026-09-14-bounded-parallel-orientation-callback-live-proof (blocked; #96 and #97 reopened)

## Reconciliation result

Required current path, route, validator, generated-copy, and Work Order references are aligned in one branch. Archived Work Order packages now preserve their original execution-era contents rather than rewriting historical commands or displayed paths to today's locations. The reopened bounded-parallel live-proof package is restored to the active namespace. The flat .agents/skills/ namespace, canonical content/model boundaries, static hosting architecture, and generated-output contract remain unchanged. library-data.js modularization is intentionally deferred to a separate behavior-preserving follow-up after this cleanup is independently reviewed.

## Validation boundary

The remote baseline and PR preview expose Vercel status, but this GitHub surface exposes no repository command runner and the repository has no `.github/workflows/` directory to run the listed Node checks. `node scripts/build-library.mjs`, `node scripts/validate-content.mjs`, `node --test scripts/validation/validation.test.mjs`, and `git diff --check` therefore remain explicit pre-merge requirements in an environment that can execute repository commands.

## Completion boundary

This Work Order is complete for the PR 1 IA/lifecycle cleanup when the focused PR is merged after review and the required executable validation has passed. The separate library-data.js modularization remains outside this Work Order's implementation scope.

## PR handoff — 2026-09-15

- PR [#105](https://github.com/rickvang/Persona-Library/pull/105) remains the live source for current head, commit count, mergeability, checks, and review state; this Work Order intentionally does not duplicate volatile PR-head metadata.
- Independent review found and corrected two lifecycle/evidence problems: one reopened Work Order had been archived as terminal, and archived package contents had been rewritten to today's paths rather than preserved as historical evidence.
- Vercel is the exposed deployment check. Node build, content validator, focused tests, and `git diff --check` remain an explicit validation limitation of this GitHub-only session and must pass before merge.

## Follow-up

The separate authored-data modularization boundary is tracked in [issue #106](https://github.com/rickvang/Persona-Library/issues/106). It starts only after this PR is established on the current base and preserves the compatibility entrypoint and normalized data contract.
