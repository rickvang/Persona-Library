# Template catalog and viewer states validation

- Status: complete
- Checked: 2026-09-13
- Target: issue #68 implementation in the Templates catalog and focused viewer

| Check | Result | Evidence |
| --- | --- | --- |
| Canonical Template metadata | pass | All four records retain lifecycle, source revision, availability, and relationships; derived runtime and viewer fields are absent from the canonical records. |
| Normalized catalog model | pass | `buildTemplateCatalog` exposes lifecycle, source, runtime-access, and preview state objects with human-readable labels and details. Runtime state derives from source availability. |
| Derived display states | pass | Documentation-only sources display `Capability-dependent`, planned sources display `Unknown`, and the Site-local preview configuration determines illustrative versus no-view state. |
| Catalog decision surface | pass | Cards show best-for fit, lifecycle, source state, viewer state, a revision-pinned source link, and `Inspect Template →` before expanded metadata. |
| Catalog filtering | pass | The source-state filter reduced the live catalog from four records to the one planned record; category, lifecycle, source, and viewer controls are labeled. |
| Planned record recovery | pass | The planned Multi-Product Design System viewer shows `No local view`, the source limitation, four decision states, and a return path to the catalog. |
| Illustrative preview registry | pass | The Web App Design System viewer shows `Illustrative concept available`, renders its local composition through `previewRenderers`, and preserves the external source boundary. |
| Missing-query recovery | pass | `template.html` without a known query shows the recovery message and `Browse Templates` link. |
| Revision-pinned source links | pass | Catalog and viewer links use the recorded revision and encoded source path; the planned record links to the recorded repository revision root. |
| Generated data | pass | `node scripts/build-library.mjs` refreshed generated data and copied the Site-local `template-preview.js` configuration. |
| Content validation | pass | `node scripts/validate-content.mjs` passed: 20 Personas, 2 Operators, 2 Leaders, 16 Specialists, and 20 workflow maps. |
| JavaScript syntax | pass | Inline scripts in both affected pages parsed with `new Function`. |
| Superseded rendering paths | pass | The catalog contains one `card` and one `render` implementation; the viewer contains one `renderTemplate` implementation. |
| Browser smoke check | pass | A loopback static server served the pages; source filtering, planned and illustrative viewers, missing-query recovery, decision-state counts, pinned links, and console warnings were checked in the browser. |
| Responsive and accessibility contract | pass | Narrow-layout CSS stacks the catalog, viewer decision grid, mockups, and metadata; semantic headings, labeled controls, live regions, links, and recovery actions remain present in the inspected DOM. |
| Whitespace | pass | `git diff --check` passed. Git emitted only its normal LF-to-CRLF normalization notices for edited files. |

## Limits

The external Template artifacts were not fetched, cloned, rendered, executed, or modified. Runtime display is therefore derived from source availability: documentation-only sources are capability-dependent and planned sources are unknown. The browser smoke check used a desktop viewport; a full device matrix, assistive-technology audit, exported output review, and external artifact execution remain outside this issue.
