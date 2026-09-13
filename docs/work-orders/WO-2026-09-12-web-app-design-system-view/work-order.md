# Web App Design System Viewer Work Order

- Work Order ID: `WO-2026-09-12-web-app-design-system-view`
- Title: Make the Web App Design System output visible in the Template viewer
- Status: complete
- Created: 2026-09-12
- Last updated: 2026-09-12
- Requester: repository user
- Current owner: Codex
- Request mode: update
- Change mode and domain: `artifact_generation` / `templates`
- Initiating Skill: [`template-composer`](../../../.agents/skills/template-composer/SKILL.md)
- Visual-quality guidance: Impeccable frontend quality route; its detector engine was unavailable in this environment.
- Reconciliation: [`template-reconciliation`](../../../.agents/skills/template-reconciliation/SKILL.md), then [`change-impact-reconciliation`](../../../.agents/skills/change-impact-reconciliation/SKILL.md)
- Artifact home: [`dist/template.html`](../../../dist/template.html)
- Template identity: `template-design-system-web-app`

## Request and outcome

Make a concrete view of the original Web App Design System Template available through Persona-Library’s focused Template viewer.

The viewer now renders a local synthetic design-system workspace with a dark navigation rail, foundation token swatches, type and spacing samples, component examples with visible states, and an empty-plus-recovery pattern. The view demonstrates the starter’s structure without fetching or executing the external Template artifact.

## Scope

- Add a conditional mockup branch for `template-design-system-web-app`.
- Use the Template starter’s declared foundations, components, patterns, layouts, and state contract as the content model.
- Add responsive rules so the navigation rail and component examples stack at narrow widths.
- Keep the existing resume mockups and generic Template fallback intact.
- Record validation and downstream reconciliation.

## Boundary and placement review

This is an extension of the existing focused Template viewer surface. The mockup belongs in `dist/template.html` because it explains the cataloged Template at inspection time while keeping the reusable design-system source in `template-library`. It is local presentation content, not a second canonical Template source, live product UI, or prototype record.

## Evidence and assumptions

- **Sourced:** the Web App Design System starter defines semantic color, typography, spacing, shape, and elevation tokens; component layers; shared patterns; content-driven layout conventions; and a state contract.
- **Observed:** the focused viewer already supports conditional local mockups for resume Templates and a generic metadata fallback.
- **Recommendation:** show one coherent foundation page that makes the system’s structure tangible through representative UI states instead of rendering a generic marketing dashboard.
- **Unknown:** the consuming product’s brand, framework, production component owner, browser support, localization, dark mode, and implementation decisions.

## Success criteria

- Opening `dist/template.html?template=template-design-system-web-app` shows an illustrative design-system view.
- The view demonstrates foundations, components, patterns, and states from the starter.
- The view remains responsive at narrower widths.
- The content is explicitly synthetic and the reusable source boundary remains visible.
- Existing Template viewer records retain their prior behavior.
- Viewer syntax, repository validation, whitespace, and generated-output checks pass.

## Validation and reconciliation

Results are recorded in [validation.md](validation.md) and [reconciliation.md](reconciliation.md).

## Current phase and next action

Phase: composition, bounded validation, and reconciliation complete.
Next action: review the illustrative view against the consuming product’s actual brand, framework, viewport, and accessibility constraints before treating it as production UI.
