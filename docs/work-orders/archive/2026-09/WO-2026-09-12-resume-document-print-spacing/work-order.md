# Resume Document Print Spacing Work Order

- Work Order ID: `WO-2026-09-12-resume-document-print-spacing`
- Title: Tighten Resume Document Design System spacing for printed output
- Status: complete
- Created: 2026-09-12
- Last updated: 2026-09-12
- Requester: repository user
- Current owner: Codex
- Request mode: update
- Change mode and domain: `artifact_generation` / `templates`
- Initiating Skill: [`template-composer`](../../../.agents/skills/template-composer/SKILL.md)
- Reconciliation: [`template-reconciliation`](../../../.agents/skills/template-reconciliation/SKILL.md), then [`change-impact-reconciliation`](../../../.agents/skills/change-impact-reconciliation/SKILL.md)
- External source: [`template-library/templates/design-systems/resume-document`](https://github.com/rickvang/template-library/tree/0a5c3fc143b5e1fcda3a5868f4c73482ad74d629/templates/design-systems/resume-document)
- Published revision: `0a5c3fc143b5e1fcda3a5868f4c73482ad74d629`
- Local viewer: [`dist/template.html`](../../../dist/template.html)

## Request and outcome

Tighten the Resume Document Design System so its starter is better suited to an eventual printed document. The published starter now declares a compact print-first baseline, preserves the existing body text sizes, and reserves a practical print boundary. The Persona-Library mockup uses the same tighter visual rhythm.

## Scope

- Update the external starter’s page margins, layout gaps, body and heading leading, and bullet spacing.
- Update the external README to describe the compact print-first baseline.
- Update Persona-Library’s catalog source metadata to the exact published revision.
- Align the local illustrative viewer mockup with the tighter spacing.
- Record validation and downstream reconciliation.

## Non-goals and constraints

- Do not shrink body text as the primary density mechanism.
- Do not claim that the spacing is physically printer-safe, export-ready, parser-compatible, or accessibility-conformant without output-specific review.
- Do not add candidate content, employer claims, or project-specific resume facts to the reusable Template.
- Keep the local mockup illustrative and keep the external starter as the reusable source of truth.

## Placement review

The spacing change belongs in the external Template starter because it changes the reusable document system itself. The README records the intent and boundary, while Persona-Library records source metadata and shows a local conceptual output. No new catalog identity or separate design system is needed.

## Evidence and assumptions

- **Sourced:** the existing Template already defines page, type, spacing, density, page-flow, print-export, and accessibility review fields.
- **Requested:** the intended eventual delivery is a printed document, so compactness should come from measured spacing and page budget while preserving body text size.
- **Recommendation:** use `0.55in` inline margins, `0.50in` block margins, `0.12in` section gaps, `0.07in` role gaps, `1.18–1.28` body leading, `1.05–1.12` heading leading, and `0.01–0.03in` bullet gaps as starting tokens.
- **Observed:** the local mockup uses a larger web display scale than a real PDF, so its spacing alignment is directional rather than a physical print proof.
- **Unknown:** chosen page size, printer safe area, font metrics, export renderer, actual resume density, reader behavior, and accessibility results.

## Success criteria

- The external starter clearly declares the compact print-first spacing baseline.
- The body font-size range remains unchanged.
- The local viewer mockup visibly follows the tighter rhythm.
- Persona-Library points to the published source revision `0a5c3fc143b5e1fcda3a5868f4c73482ad74d629`.
- Validation, generated-data refresh, and reconciliation checks pass.

## Validation and reconciliation

Results are recorded in [validation.md](validation.md) and [reconciliation.md](reconciliation.md). The external source was committed and pushed, the catalog was updated, the generated data was refreshed, the viewer script parsed, and repository checks passed.

## Current phase and next action

Phase: print-first source update, viewer alignment, catalog update, validation, and reconciliation complete.

Next action: apply the starter to representative resume content and review the exported pages on the selected paper size before treating these tokens as final.
