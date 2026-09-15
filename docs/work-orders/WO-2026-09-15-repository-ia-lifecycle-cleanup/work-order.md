# Issue #103 information-architecture and lifecycle audit

- Status: ready-for-review
- Issue: https://github.com/rickvang/Persona-Library/issues/103
- Base: 09ded617e7fbec4ae15f5aa45d468e07314fc4d3
- Branch: reconcile/issue-103-ia-lifecycle
- Request mode: update
- Authorized target: rickvang/Persona-Library GitHub repository
- Scope: PR 1 repository IA, Work Order lifecycle hygiene, current Docs placement, generated-output cues, and future-agent placement rules.
- Non-goals: authored data redesign, nested Skill loader changes, hosting changes, deletion of historical evidence, or the separate library-data.js modularization workstream.

## Preflight evidence

- Current main and issue #103 were refreshed from GitHub before editing.
- Orientation path followed: AGENTS.md -> content/site-orientation.json -> content/orientation/docs.json -> work-order-start route -> docs/work-orders.md and docs/work-orders/README.md.
- Main combined status at the refreshed base was successful for Vercel; no GitHub Actions workflow run was exposed for that commit. Local checkout/Git commands were not used because the repository contract makes GitHub the canonical work surface.

## Move matrix

| Current path / classification | Proposed path | Action | Reason |
| --- | --- | --- | --- |
| JOB_SEARCH_IMPLEMENTATION.md / current job-search guidance | docs/job-search/implementation.md | move | Domain guidance belongs with existing job-search docs. |
| docs/bounded-parallel-implementation-playbook.md / current Playbook | docs/playbooks/bounded-parallel-implementation.md | move | Reusable Playbook guidance is grouped by subject. |
| docs/template-lifecycle-playbook.md / current Playbook | docs/playbooks/template-lifecycle.md | move | Reusable Playbook guidance is grouped by subject. |
| docs/design-system-starter.md / project-local UX artifact | docs/ux/design-system-starter.md | move | UX starter belongs with current UX guidance. |
| docs/skill-rebuild-plans/ / internal migration evidence | docs/internal/skill-rebuild/plans/ | move | Separate rebuild planning from current guidance. |
| docs/skill-rebuild-tests/ / internal migration evidence | docs/internal/skill-rebuild/tests/ | move | Separate comparison/golden evidence from current guidance. |
| Terminal Work Order packages | docs/work-orders/archive/2026-09/<id>/ | archive | Preserve history while keeping the root actionable. |
| Review Work Order packages | unchanged under docs/work-orders/<id>/ | keep | Review work is not terminal. |
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
- WO-2026-09-14-bounded-parallel-orientation-callback-live-proof
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

## Reconciliation result

Required path, route, validator, generated-copy, and Work Order references are updated in one branch. The flat .agents/skills/ namespace, canonical content/model boundaries, static hosting architecture, and generated-output contract remain unchanged. library-data.js modularization is intentionally deferred to a separate behavior-preserving follow-up after this cleanup is independently reviewed.

## Validation boundary

The remote baseline was observed as Vercel-successful, but this connector exposes no repository command runner or Actions workflow for executing the listed Node checks before branch creation. The PR is review-ready only after its current GitHub checks and fresh diff review confirm the generated-copy and path invariants.

## Completion boundary

This Work Order is complete for the PR 1 IA/lifecycle cleanup when the focused PR is merged after review. The separate library-data.js modularization remains outside this Work Order's implementation scope.