# Validation — Template Viewer Previews

## Contract checks

| Check | Status | Evidence / expected result |
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
| Generated publication path | pass by source review | `scripts/build-library.mjs` copies `client/template-preview.js` to `dist/js/template-preview.js`; Vercel runs the build command from `vercel.json`. |
| Vercel branch build | pending PR | Must report green for the final PR head. |
| Cover-letter viewer route | pending PR | Branch preview route must show `Illustrative concept available` and the synthetic cover-letter composition. |
| Application-notes viewer route | pending PR | Branch preview route must show `Illustrative concept available` and the synthetic application-notes composition. |
| Final PR review | pending PR | Re-fetch changed files/diff, mergeability, review threads, and checks after final branch update. |

## Publication inventory

At the base revision, the catalog contains five non-planned (`candidate`) Templates and one `planned` Template. Three candidate Templates already had local preview registrations. #131 adds the two missing job-application registrations, leaving the planned multi-product record intentionally without a local viewer.

## Focused-viewer behavior

The focused viewer already reads `js/template-preview.js` before the inline viewer render. The #131 preview module:

- exposes the two new IDs in the same preview registry used by the normalized Template model;
- renders synthetic local concepts with existing viewer presentation classes;
- after the existing inline viewer has rendered, upgrades the two new records from the legacy inline `No local view` presentation to the registered illustrative state and inserts the local composition;
- does not modify the existing three preview implementations;
- does not fetch external Template files.

## Limits

- Source review does not prove browser execution; branch-preview route verification is required before this Work Order can become `ready-for-review`.
- A local illustrative composition proves only Persona-Library viewer integration. It does not prove the external starter can be fetched, executed, installed, or rendered by the current runtime.
- No external Template source content is copied into this repository.
