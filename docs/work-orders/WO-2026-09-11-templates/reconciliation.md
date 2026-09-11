# Template reconciliation report

- Status: complete
- Change observed: source, record, generated artifact, and documentation change introducing the Templates space
- Initiating contract: `template-research` / `template-composer` use `source_update` or `artifact_generation` in `templates` and hand off to `template-reconciliation`; the adapter uses `reconciliation_adapter` and hands off once to universal `change-impact-reconciliation`.
- Scope checked: `content/library-data.js`, `content/library-model.js`, `content/site-orientation.json`, the three Template Skills, all canonical seed relationships, the Design System Operating Pack, current Playbook identities, Tool-use recipes derived from related Skills, Docs, Decisions, static Site navigation, `dist/templates.html`, generated data, and prototype identity boundaries.

## Impacts

| Dependent | Relationship | Class | Evidence | Confidence | Action |
| --- | --- | --- | --- | --- | --- |
| `operating-pack-design-system` | Template records reference the Operating Pack as commonly used context | extends | Three canonical seed records include the resolved Operating Pack ID; the Template page explains that the pack guides work and does not contain the artifact | high | none required |
| Camille Ortiz / `skill-component-and-design-system-thinking` / `Extend and govern the design system` | Scoped Template application | extends | Persona, Skill profile, Persona workflow, and Skill workflow reach all resolve in the normalizer | high | none required |
| Jordan Lee / `skill-design-system-stewardship` / `Steward the experience system` | Scoped Template application | extends | Persona, Skill profile, Persona workflow, and Skill workflow reach all resolve in the normalizer | high | none required |
| Related Skills and derived Tool-use recipes | Template catalog references reusable expertise and displays separate tool-use context | confirms | Normalized Skill records resolve and `relatedToolRecipes` remain derived from Skill recipes; no Tool permission is copied | high | none required |
| Playbook catalog | Template model accepts Playbook IDs and validates them, while seeds currently have no Playbook relationship | qualifies | Current Playbook identity index has no proven design-system launch record; no unsupported relationship was invented | high | optional future relationship when a real Playbook is cataloged |
| Docs, Decisions, navigation, and generated data | Current architecture and discovery surfaces describe the new space | extends | `guide.html`, `decisions.html`, all visible primary navigation, generated data, and orientation routes include Templates | high | none required |
| Prototyping | Live Template catalog rejects `proto-` identities and does not depend on prototypes | confirms | Validator negative fixture and explicit catalog checks | high | none required |
| `rickvang/template-library` | External artifact source | qualifies | Main revision exists, but tree contains only `README.md`; all three proposed artifact paths are absent | high | keep all seeds planned and reverify on a future source update |

## Required updates

None identified after implementation. The external artifacts must remain planned until a later authorized verification finds each exact path and entrypoint.

## Optional follow-ups

- Create and link the required GitHub issue when the environment exposes a GitHub CLI or connector.
- Add Playbook references only when a real design-system outcome Playbook exists.
- Reverify the three external Template paths after `rickvang/template-library` gains artifact content.

## Unchanged checked

Persona identities, existing Skill definitions, Operating Pack source metadata, Tool records and permissions, Playbook orchestration rules, prototype records, and external artifact transport boundaries remain unchanged.

## Generated outputs and checks

`node scripts/build-library.mjs` refreshed `dist/data/library-data.js`, `dist/data/library-model.js`, and `dist/data/site-orientation.json` plus the existing generated client/prototype copies. `node scripts/validate-content.mjs`, both required `node --check` commands, and `git diff --check` passed after the final page correction.

## Incomplete visibility

The review is bounded by explicit canonical relationships and declared generated provenance. There is no generalized dependency graph, no current design-system launch Playbook identity, and no runtime evidence that the external repository can be fetched by every environment. GitHub issue creation remains unavailable because neither `gh` nor a GitHub connector is exposed.

## Next action

Repository owner: link the Work Order to a GitHub issue when issue creation becomes available, then reverify external Template artifacts before changing any seed from planned.
