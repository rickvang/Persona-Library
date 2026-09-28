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

## Preflight

1. Treat root `AGENTS.md` as already activated; do not reread it merely to run this Skill.
2. Prefer `dist/data/agent-context/template-composition.json` when the request is an explicit Template composition/adaptation request and the accepted research result plus artifact/target boundary are already clear.
3. Use the bundle only when:
   - `schema_version` is `persona-library.agent-context/v0.1`;
   - `route_id` is `template-composition`;
   - `primary_space` is `templates`;
   - `package_path` is `.agents/skills/template-composer`;
   - its space index contains exactly the Templates space and canonical route file;
   - the graph fragment contains the explicit `template-composition → template-composer` route edge;
   - every included graph node/edge has provenance;
   - retained exception fields are present.
4. When valid, use the bundle's route exceptions and graph-declared change contract instead of rereading the full semantic bootstrap and complete Templates route group solely to reconstruct `template-composition`.
5. If the bundle is missing, unreadable, malformed, route/package mismatched, provenance-incomplete, or lacks the Templates-space entry, fall back to the canonical path: read `content/site-orientation.json`, select Templates, read `content/orientation/templates.json`, then select `template-composition`.
6. A bundle or route contract never supplies missing Template research, source evidence, provenance, target authorization, or external availability. If the accepted research result, candidate/source evidence, artifact boundary, target location, or authorization is missing or materially ambiguous, do not invent it; route to `template-research` or the placement gate as appropriate.
7. `change_mode: artifact_generation` describes the kind of downstream work; it does not grant permission to create, adapt, publish, fetch, install, render, or mutate any target.
8. After a durable Template artifact or record change, preserve the existing handoff to `template-reconciliation`, followed by exactly one required universal `$change-impact-reconciliation` pass.

The generated bundle is derived routing context, not Template truth. Canonical Template records, accepted research, source/provenance evidence, the Template Composer contract, reconciliation Skills, repository validation, and live external state remain authoritative.

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
