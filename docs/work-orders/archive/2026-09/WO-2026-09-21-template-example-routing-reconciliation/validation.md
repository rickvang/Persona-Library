# Validation — Issue #137 Template provenance refresh

## Pre-PR checks

| Check | State | Evidence |
| --- | --- | --- |
| External merge exists | pass | template-library PR #10 merged as `560e0e5bdf3a56bcc8983a421b3112a070734023`. |
| External starter boundary unchanged | pass | `templates/design-systems/web-app/README.md` still declares `starter/` as the copy boundary. |
| External lifecycle unchanged | pass | External README still describes the Template as candidate / first reusable publication. |
| Examples index verified | pass | `examples/README.md` lists the existing data-table candidate and defines component/pattern/layout/new-Template/project-local routing. |
| Repository example-routing guide verified | pass | root README now routes contributors to `CONTRIBUTING.md` for example discovery and placement. |
| Canonical record revision refreshed | pass | `content/library-data/catalogs.js` points to `560e0e5bdf3a56bcc8983a421b3112a070734023`. |
| Lifecycle/status preserved | pass | `candidate` and `Candidate external reference` remain unchanged. |
| Runtime boundary preserved | pass | availability remains `documentation_only`; evidence explicitly avoids runtime-access claims. |
| Project-local provenance refreshed | pass | `docs/ux/design-system-starter.md` now points to the merged external revision. |
| Generated data synchronized | pass | `dist/data/library-data.js` contains the updated authored catalog fragment. |
| Template reconciliation | pass | See `reconciliation.md`; no Persona/Skill/Operating Pack/lifecycle/viewer changes are required. |
| Repository CI | pending | GitHub Repository validation will be the authoritative repository check. |

## Validation plan

The repository workflow should confirm:

- generated output rebuilds without diff;
- authored/generated content validation passes;
- repository validation tests pass;
- committed whitespace is clean;
- generated output is committed.

## Completion proof

After merge, verify:

- issue #137 is closed;
- `main` contains revision `560e0e5bdf3a56bcc8983a421b3112a070734023` in the Web App Design System Template record;
- generated data is present on `main`;
- CW-6 is updated to Done / Reference.
