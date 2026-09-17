---
name: template-composer
description: Compose the smallest useful reusable or project-specific starting artifact from an accepted Template research result while preserving ownership and provenance.
metadata:
  skill_layer: library_management
  change_mode: artifact_generation
  change_domain: templates
  reconciliation: template-reconciliation
---

# Template Composer

## Role

Compose a reusable or project-specific starting artifact supported by evidence. Reuse an existing Template when it fits; create only the files that make the starting structure useful. A Template is a scaffold or starting artifact, not a generic application generator.

## Procedure

1. Confirm the task, target location, authorization, accepted research result, source boundary, and whether the result is local, reusable, planned, or canonical.
2. Search the Template catalog and reuse a suitable source before creating a duplicate. If no suitable Template exists, distinguish a local project starter from a candidate for later promotion.
3. Establish the artifact boundary: required structure, intentional placeholders, examples, and project-specific content. Document placeholders when they are part of the starting contract.
4. Create only useful starter files and preserve source/provenance. Do not copy an external artifact into Persona-Library merely to catalog it.
5. Keep generic methodology in Skills or Operating Packs, execution and permission in Tools, and coordination in Playbooks.
6. Validate the artifact’s links, boundary, representative content, source metadata, and intended next use before handoff.
7. When the accepted outcome is reusable or canonical publication, do not treat external source creation as completion. Require the publication handoff to: add or refresh the Persona-Library Template catalog record; add or refresh a Persona-Library-local illustrative viewer representation that uses synthetic content and clearly preserves the external source boundary; run the repository build that refreshes generated Site data; verify the Template is visible in the Persona-Library Templates tab with the intended identity, source, lifecycle, availability state, and `Illustrative concept available` viewer state; then run `template-reconciliation` and the required universal reconciliation pass. Planned Templates may remain without a local viewer representation until they are published.

## Output

Return the target, file manifest, reused or created source, boundary decisions, provenance, validation evidence, promotion recommendation, publication status, Persona-Library catalog status, local viewer representation status, generated Site / Templates-tab visibility status when reusable publication is in scope, unresolved gaps, and reconciliation handoff. A proposal remains a proposal; do not silently promote a project starter into the reusable catalog.

## Boundaries

- Do not fetch, install, sync, vendor, execute, render, publish, or upgrade an external Template as a side effect.
- Do not claim a verified path, entrypoint, revision, or runtime availability without evidence.
- Do not embed Skill judgment, Operating Pack guidance, Tool permissions, or Playbook orchestration into the Template artifact.
- A canonical starter that exists in an external source but is missing from the Persona-Library catalog, Templates tab, or required local illustrative viewer representation is not a complete reusable publication.
- The local viewer representation belongs to Persona-Library, must use synthetic content, and must not be presented as the canonical external starter.
- Templates-tab visibility and an illustrative viewer prove catalog/Site integration only; they do not prove runtime access, fetch/install capability, or renderability of the external artifact.
- After a durable Template artifact or record change, hand off to `template-reconciliation`, then one universal `$change-impact-reconciliation` pass.
