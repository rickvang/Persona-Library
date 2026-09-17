# Validation — Template Viewer Previews

## Contract checks

| Check | Status | Evidence / result |
| --- | --- | --- |
| Placement boundary | pass | Existing Persona-Library viewer/configuration and Template lifecycle surfaces are extended; external starter ownership remains in `rickvang/template-library`. |
| Cover-letter preview registration | pass by source review | `client/template-preview.js` maps `template-cover-letter-evidence-led` to `coverLetterMockup`. |
| Application-notes preview registration | pass by source review | `client/template-preview.js` maps `template-job-application-notes` to `applicationNotesMockup`. |
| Synthetic content | pass by source review | Both local compositions use invented candidate/employer/application data and explicitly state that they are synthetic. |
| External-source boundary | pass by source review | Both mockup footnotes say the viewer is Persona-Library-local and the reusable Template remains in the declared external source. |
| Published Template gate | pass by source review | `scripts/validation/templates.mjs` requires a preview registration for every Template whose lifecycle is not `planned`. |
| Planned Template exception | pass by source review | `template-design-system-multi-product` remains `planned` and may retain `No local view`. |
| Composer publication gate | pass by source review | `$template-composer` requires a local synthetic viewer representation for reusable/canonical publication. |
| Reconciliation publication gate | pass by source review | `$template-reconciliation` treats a missing required viewer representation as incomplete publication. |
| Lifecycle publication gate | pass by source review | `playbook-template-lifecycle` includes viewer representation in lifecycle, validation, recovery, and reconciliation stages. |
| Generated publication path | pass | Vercel build logs for deployment `dpl_CC8KBti1JnoGnKHfimi8Y9N8oDqq` show `client/template-preview.js` copied to `dist/js/template-preview.js`. |
| Vercel branch build | pass | PR #132 head `976b56328ad2317fcfc42989f1512cb570116d45` reached Vercel `READY`; GitHub commit status context `Vercel` is `success`. |
| Cover-letter viewer route | not directly observed | Source/configuration defines the illustrative state and composition, but the protected Vercel preview redirects the available authenticated fetch surface to Vercel login rather than exposing rendered DOM. |
| Application-notes viewer route | not directly observed | Same protected-preview limitation as the cover-letter route. |
| PR scope | pass | PR #132 changes eight intended files: viewer source, Template validator, two Template lifecycle Skills, lifecycle Playbook, and three Work Order records. |
| Review threads | pass | No inline review threads were present at the review check. |
| Mergeability before evidence update | pass | GitHub reported PR #132 mergeable at head `976b56328ad2317fcfc42989f1512cb570116d45`. Final-head refresh is required after evidence commits. |

## Publication inventory

At the base revision, the catalog contains five non-planned (`candidate`) Templates and one `planned` Template. Three candidate Templates already had local preview registrations. #131 adds the two missing job-application registrations, leaving the planned multi-product record intentionally without a local viewer.

## Focused-viewer behavior

The focused viewer already reads `js/template-preview.js` before the inline viewer render. The #131 preview module:

- exposes the two new IDs in the same preview registry used by the normalized Template model;
- renders synthetic local concepts with existing viewer presentation classes;
- after the existing inline viewer has rendered, upgrades the two new records from the legacy inline `No local view` presentation to the registered illustrative state and inserts the local composition;
- does not modify the existing three preview implementations;
- does not fetch external Template files.

The timing is deterministic for the current page: `template-preview.js` registers its `DOMContentLoaded` handler before `data/library-model.js` and the viewer's inline render execute; the handler runs after those synchronous scripts have completed, so the generated catalog and viewer DOM exist before the patch is applied.

## Deployment evidence

Vercel build logs for the exact PR deployment show:

- branch `feat/template-viewer-previews-131` and commit `976b563` were cloned;
- 15 authored library data sources were built;
- `client/template-preview.js` was copied into the deployed `dist/js/template-preview.js` path;
- deployment completed successfully.

A temporary protected preview URL was generated and fetched through both the Vercel connector and an independent scrape attempt. Both flows were redirected to Vercel Authentication, so neither provided the post-JavaScript DOM. This is an access-observation limitation, not evidence of a route failure.

## Limits

- Direct browser observation of the two protected branch routes remains unproven in this runtime and should be checked by an authenticated browser before treating every #131 acceptance item as independently observed.
- A local illustrative composition proves only Persona-Library viewer integration. It does not prove the external starter can be fetched, executed, installed, or rendered by the current runtime.
- No external Template source content is copied into this repository.
