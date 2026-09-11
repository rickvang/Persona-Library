# Operating Packs placement and boundary review

## Review owner

Mara Okoye — Knowledge systems architect. This is a repository-defined placement review based on the canonical Persona record, orientation manifest, architecture contract, and current source model; it is not a claim of a live consultation.

## Placement decision

Create `Operating Packs` as a first-class library space beside Personas, Skills, Tools, and Playbooks. The concept owns persistent domain or project operating context: rules, standards, conventions, procedures, references, and validation guidance. Its canonical record is a small catalog entry with a source/location pointer and explicit availability state.

## Boundary checks

| Candidate home | Result | Reason |
| --- | --- | --- |
| Skill | Keep separate | Skills own portable expertise, judgment, observable practice, outputs, quality signals, and failure modes. Context such as package manager rules belongs to the pack. |
| Playbook | Keep separate | Playbooks coordinate an outcome through stages, handoffs, state, decision rights, and gates. They reference pack context instead of copying it. |
| Tool or Tool-use recipe | Keep separate | Tools act within scope and permission; recipes bind a capability to a tool. A pack may be consumed while validating work but does not execute anything. |
| Docs | Keep separate | Docs explain the current Persona Library system. A pack is reusable context for another domain or project and may live outside this repository. |
| Work Order | Keep separate | A Work Order tracks active project work and authorization; it is not a reusable operating context package. |
| New first-class space | Selected | The concept has distinct ownership, source/status lifecycle, scoped application relationships, and reconciliation needs. |

## Relationship shape

Use scoped pack applications with `personaId`, `skillId`, and `workflow` so a Persona can use a pack for a real activity without globally attaching the pack to that Persona. Keep Playbook references as stable IDs in the minimal Playbook identity index. Derive display names and related Tool-use recipes from normalized canonical records rather than copying their definitions into the pack.

## Source boundary

Support repository-local, project-local, external GitHub, planned, and unavailable source states through a compact `source` object. Local sources require a repository-relative path and entrypoint that the validator can resolve. External planned sources require repository identity, entrypoint intent, and an explicit availability state; a URL or repository name never proves that files are present.

## Example placement

The Design System pack is a planned external reference to `rickvang/TemplateRepo` with an unverified path and `AGENTS.md` as the intended entrypoint. It is scoped to Camille Ortiz’s `Component and design-system thinking` Skill in the `Extend and govern the design system` workflow. It may be referenced by the reusable Skill-formation Playbook, while the Figma Tool-use recipe remains a separate Tool relationship reached through related Skill context.

## Revisit conditions

Revisit the taxonomy if repeated pack research shows that the record needs to own reusable professional judgment, becomes an executable runtime, duplicates full Playbook orchestration, or requires a different source transport contract. Reconcile affected Skills, Personas, Playbooks, Tool-use recipes, Docs, and generated Site output before changing the boundary.
