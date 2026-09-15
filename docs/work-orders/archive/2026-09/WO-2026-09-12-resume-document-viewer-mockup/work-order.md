# Resume Document Viewer Mockup Work Order

- Work Order ID: `WO-2026-09-12-resume-document-viewer-mockup`
- Title: Make the Resume Document Design System output visible in the Template viewer
- Status: complete
- Created: 2026-09-12
- Last updated: 2026-09-12
- Requester: repository user
- Current owner: Codex
- Request mode: update
- Change mode and domain: `artifact_generation` / `templates`
- Initiating Skill: [`template-composer`](../../../.agents/skills/template-composer/SKILL.md)
- Reconciliation: [`template-reconciliation`](../../../.agents/skills/template-reconciliation/SKILL.md), then [`change-impact-reconciliation`](../../../.agents/skills/change-impact-reconciliation/SKILL.md)
- Artifact home: [`dist/template.html`](../../../dist/template.html)
- Template identity: `template-design-system-resume-document`

## Request and outcome

Make the expected output of the Resume Document Design System visible through Persona-Library’s focused Template viewer. The viewer now renders a local, illustrative one-page resume composition for the resume Template, with synthetic sample content and a visible boundary separating the mockup from the external reusable source.

## Scope

- Add a conditional illustrative mockup to `dist/template.html` for the resume Template ID.
- Show a one-page, text-first, single-column resume with the starter’s header, profile, experience, selected work, skills, and education components.
- Show the mockup’s design choices and review requirements beside the resume sheet.
- Keep the catalog record and external Template source unchanged.
- Keep the viewer usable for every other Template without a mockup-only link or section.

## Non-goals and constraints

- Do not fetch, execute, or claim to render the external Template repository artifact.
- Do not use candidate facts, private resume content, employer-specific claims, or real contact information.
- Do not claim fixed page count, parser compatibility, accessibility conformance, or export fidelity from this conceptual preview.
- Keep the mockup local to the viewer because it demonstrates presentation rather than becoming a second canonical Template source.

## Placement review

The local viewer is the smallest useful home for a visual output mockup: it makes the Template understandable at the point of inspection while keeping reusable source ownership in `template-library`. Adding the sample to canonical library data would mix display content with Template metadata; adding it to the external starter would turn an illustrative preview into part of the reusable source contract. The mockup uses clearly synthetic content and remains isolated from live Personas, Skills, workflows, and project resume outputs.

## Evidence and assumptions

- **Sourced:** the published Template defines page and type tokens, document components, page patterns, output states, and handoff fields for resume documents.
- **Sourced:** the viewer is the focused record surface at `dist/template.html?template=<id>` and already exposes an explicit artifact-preview availability state.
- **Observed:** the resume Template is cataloged at `template-design-system-resume-document` with a documentation-only external source, so the viewer must label the local composition as illustrative.
- **Recommendation:** a single-column, text-first sample is the clearest first output because it demonstrates reading order, hierarchy, spacing, and reusable document components without implying an export format.
- **Unknown:** final page size, renderer, font licensing, real content density, parser behavior, and accessibility results.

## Success criteria

- Opening the focused viewer for the resume Template exposes an “Illustrative output” section.
- The sample visibly demonstrates the declared document component structure and hierarchy.
- The sample is responsive and remains readable at narrow widths.
- The viewer explicitly identifies the content as synthetic and local.
- Other Template viewer records retain their existing preview behavior.
- Inline JavaScript parsing, HTTP serving, whitespace, and repository validation checks pass.

## Validation and reconciliation

Results are recorded in [validation.md](validation.md) and [reconciliation.md](reconciliation.md). The viewer’s inline script parsed successfully, the local page served with HTTP 200, the mockup markers were present, and `git diff --check` passed.

## Current phase and next action

Phase: viewer composition, local smoke validation, and reconciliation complete.

Next action: review the illustrative output against real resume content in a separate application Work Order before adding variants or claiming export quality.
