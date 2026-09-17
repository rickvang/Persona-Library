# Reconciliation — Template Viewer Previews

## Change observed

Issue #131 adds missing Persona-Library-local illustrative viewer representations for the published Evidence-Led Cover Letter and Application Notes & Answers Templates and makes that representation part of the reusable/canonical Template publication gate.

## Placement conclusion

This is an extension of existing Template publication/viewer behavior, not a new artifact owner or runtime concept:

- `rickvang/template-library` remains canonical for reusable starter files;
- Persona-Library owns catalog identity, publication metadata, generated Site presentation, and local illustrative viewer representations;
- local previews are synthetic demonstrations and are never evidence that the external starter was fetched or executed.

No new Decision is required because the change applies the existing Template ownership and publication boundaries to an already-existing viewer representation mechanism.

## Impact review

| Surface | Impact | Reconciliation |
| --- | --- | --- |
| `template-cover-letter-evidence-led` | extends | Gains a Persona-Library-local synthetic focused-viewer concept; canonical starter/source metadata remain unchanged. |
| `template-job-application-notes` | extends | Gains a Persona-Library-local synthetic focused-viewer concept; canonical starter/source metadata remain unchanged. |
| Existing three illustrative Template viewers | confirms | Existing registrations/renderers remain unchanged. |
| `template-design-system-multi-product` | confirms planned exception | Lifecycle is `planned`; it may remain without a local view until publication. |
| Template catalog model | confirms | Preview state remains derived from `client/template-preview.js` registration. |
| Template validation | extends | Non-planned Template publication now requires a local preview registration. |
| `$template-composer` | extends | Reusable/canonical publication now explicitly includes local illustrative viewer completion. |
| `$template-reconciliation` | extends | Publication reconciliation now checks the local viewer and source-honesty boundary. |
| Template lifecycle Playbook | extends | Validation, lifecycle, recovery, and reconciliation stages now include local viewer representation. |
| Generated `dist/js/template-preview.js` | build-derived | Source remains `client/template-preview.js`; the repository build refreshes generated output. |
| `dist/template.html` | confirms existing viewer | Existing focused viewer is retained; #131 uses its established extension/configuration path rather than vendoring external starters. |
| `rickvang/template-library` | unchanged | No starter or source files are copied or modified by this issue. |
| Candidate Application Context / job-search evidence | unchanged | Synthetic viewer content is illustrative only and does not become candidate evidence or application state. |
| Resume semantic mapping #122/#123 | unrelated | No semantic mapping contract is changed. |

## Required validation before handoff

- Vercel must build the final PR head successfully.
- The branch focused-viewer route for `template-cover-letter-evidence-led` must show `Illustrative concept available` and the local cover-letter concept.
- The branch focused-viewer route for `template-job-application-notes` must show `Illustrative concept available` and the local application-notes concept.
- The final PR diff/check/review state must be re-fetched after all validation evidence is recorded.

## Universal change-impact conclusion

The bounded downstream effects are the Template publication lifecycle, validation, and generated viewer configuration described above. No Persona identity, Skill ownership, Operating Pack content, external Template source, submission authorization, or runtime-access claim needs modification. The smallest remaining action is deployment verification followed by a reviewable PR handoff.
