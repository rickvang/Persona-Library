# Template Viewer Previews Work Order

## Header

- Work Order ID: `WO-2026-09-17-template-viewer-previews`
- Status: ready-for-review
- Created: 2026-09-17
- Last updated: 2026-09-17
- Requester: repository user
- Current owner: ChatGPT
- Request mode: update
- GitHub issue: [#131 — Add local viewer previews for published Templates](https://github.com/rickvang/Persona-Library/issues/131)
- Pull request: [#132 — Add local viewer previews for published Templates (#131)](https://github.com/rickvang/Persona-Library/pull/132)
- Branch: `feat/template-viewer-previews-131`
- Base `main`: `ccba35344ed574acc9e51aae33fdd6b3a5cc128d`
- Verified deployment head before this evidence update: `976b56328ad2317fcfc42989f1512cb570116d45`
- Explicit authorization: implement #131 and leave a reviewable PR; no merge or issue-closure authorization is implied

## Outcome

Complete the Persona-Library publication representation for the two currently published job-application Templates that still lack a local focused-viewer concept, while preserving `rickvang/template-library` as the canonical owner of reusable starter artifacts.

## Placement review

Mara Okoye placement result: **extend existing Template viewer/publication surfaces; do not create a new Template type, runtime, source repository, or artifact-copy mechanism.**

The change belongs in existing surfaces:

- `client/template-preview.js` owns Persona-Library-local preview identity and synthetic compositions used by the focused viewer;
- `scripts/validation/templates.mjs` owns catalog/publication validation for Template records;
- `$template-composer`, `$template-reconciliation`, and `playbook-template-lifecycle` own the publication lifecycle gates;
- `rickvang/template-library` continues to own the actual reusable starter files.

The local viewer is an illustrative publication representation only. It must not be treated as a fetched, vendored, executed, or canonical copy of an external Template.

## Scope

- [x] Register `template-cover-letter-evidence-led` with a local illustrative viewer representation.
- [x] Register `template-job-application-notes` with a local illustrative viewer representation.
- [x] Use synthetic candidate/employer/application content and state the external-source boundary in each preview.
- [x] Require every non-`planned` Template record to have a local illustrative viewer representation.
- [x] Keep `planned` Templates eligible for `No local view` until publication.
- [x] Extend Template composition guidance so reusable/canonical publication requires the local viewer representation.
- [x] Extend Template reconciliation guidance with the same publication gate.
- [x] Extend the Template lifecycle Playbook publication/recovery gates.
- [x] Open PR #132 and verify the Vercel branch build.
- [x] Confirm the generated publication build copies `client/template-preview.js` to `dist/js/template-preview.js` on the exact PR deployment.
- [ ] Directly observe both focused viewer routes in a browser-capable preview session; the available authenticated fetch surface redirects to Vercel login and does not expose the rendered DOM.
- [ ] Reinspect final PR diff, mergeability, review state, and checks after this evidence update deploys.

## Deployment evidence

Vercel deployment `dpl_CC8KBti1JnoGnKHfimi8Y9N8oDqq` built PR #132 head `976b56328ad2317fcfc42989f1512cb570116d45` successfully and reached `READY`. GitHub reports the Vercel commit status as `success`. Build logs confirm:

- 15 authored library data sources were built;
- `client/template-preview.js` was copied to `dist/js/template-preview.js`;
- deployment completed successfully.

The protected preview URL is available, but this runtime's Vercel fetch follows it to Vercel Authentication instead of returning the rendered page DOM. Therefore the route-render acceptance item is recorded as **not directly observed**, not falsely marked pass.

## Boundaries

- Do not copy or vendor `rickvang/template-library` starter files into Persona-Library.
- Do not fetch or execute external Templates at runtime.
- Do not change resume semantic mapping work from #122/#123.
- Do not imply runtime access from catalog or viewer presence.
- Do not merge the PR or close #131 without separate authorization.

## Acceptance

- `template-cover-letter-evidence-led` is registered to show `Illustrative concept available` and render a synthetic Evidence-Led Cover Letter concept.
- `template-job-application-notes` is registered to show `Illustrative concept available` and render synthetic Application Notes & Answers.
- Both previews explicitly preserve the external-source boundary.
- Template publication validation fails for any non-planned Template lacking a local preview registration.
- Composer/reconciliation/lifecycle guidance requires a local viewer representation before reusable/canonical publication is complete.
- Vercel preview is green.
- Direct browser observation of both protected focused-viewer routes remains the one unproven acceptance item.

## Current state

The implementation is reviewable in PR #132. Source/configuration, publication enforcement, reconciliation, and Vercel build acceptance are complete. The only validation limitation is direct DOM observation of the two access-protected preview routes from this runtime; merge and issue closure remain separately authorized actions.
