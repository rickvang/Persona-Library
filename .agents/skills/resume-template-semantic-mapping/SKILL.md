---
name: resume-template-semantic-mapping
description: Map a private candidate Resume Content Model into a verified resume Template semantic slot manifest while preserving evidence, candidate-specific structure, and material meaning.
metadata:
  skill_layer: persona_applied
  change_mode: artifact_generation
  change_domain: job-search-application
  reconciliation: change-impact-reconciliation
---

# Resume Template Semantic Mapping

## Role

Map presentation-neutral candidate resume content into a verified resume Template without treating layout as truth, losing material content, flattening employer/client structure, or inventing unsupported claims.

Use this Skill when a candidate's normalized Resume Content Model must be rendered through a reusable resume Template, especially when switching between materially different resume layouts or testing a new Template against an existing candidate content set.

Do not use it to discover candidate evidence, decide whether a claim is true, design a new Template from scratch, create candidate facts, or replace ATS/document/accessibility review.

## Required inputs

1. One active private Candidate Application Context.
2. One Resume Content Model instance conforming to the expected model version in `docs/job-search/resume-content-model.md` and `resume-content-model.schema.json`.
3. One verified resume Template in `rickvang/template-library`, including path, entrypoint, revision, starter boundary, and `slot-map.json`.
4. Role/application requirements when mapping for a specific opportunity.
5. Applicable candidate standing decisions and validation overlays.

If the candidate boundary, content-model version, Template revision, or slot manifest is unresolved, return `blocked` for the affected mapping instead of guessing.

## Operating procedure

1. **Verify candidate and model.** Confirm the normalized model belongs to the active candidate, matches the expected schema version, and keeps material nodes traceable to current evidence/decisions.
2. **Verify Template and slots.** Resolve the Template's current source path, entrypoint, starter boundary, revision, and semantic slot manifest. Confirm the manifest targets a compatible Resume Content Model version.
3. **Select role-relevant content.** Use the current requirement-to-evidence map to choose supported descriptors, profile statements, skills, achievements, projects, and portfolio content. Keep this selection in application-instance state rather than rewriting canonical candidate data.
4. **Map by semantic purpose.** Match each selected content node to a legitimate Template slot. Preserve the owning employment relationship, employment period, client engagement, dates, locations, achievements, and skills.
5. **Preserve candidate structure.** Keep employer-of-record distinct from clients; keep separate employment periods separate when evidence/standing decisions require it; preserve metric, scope, contribution, and outcome meaning.
6. **Classify material results.** Mark each material source as `mapped`, `omitted_with_reason`, `blocked`, `unmapped`, or `not_applicable`. Never silently drop material content because the Template lacks a destination.
7. **Compose the private artifact.** Copy/adapt the verified Template starter into the authorized role-specific workspace and fill it from the mapping. Prose may be compressed or synthesized only when the factual meaning remains supported.
8. **Run layered validation.** Check candidate/model conformance, Template slot conformance, evidence integrity, role/channel requirements, candidate overlays, cross-candidate isolation, and the applicable ATS/document/accessibility/export gates on the actual output.
9. **Surface Template mismatch.** When valid semantic content repeatedly remains `unmapped`, route the pattern to Template research rather than mutating the Template by implication.

## Mapping quality signals

A strong mapping has these observable properties:

- every material rendered claim traces to the active candidate model and evidence;
- the Template slot matches the content's semantic purpose rather than just available space;
- employer/client hierarchy and separate periods survive the mapping;
- role-specific selection is visible as an application decision, not rewritten candidate truth;
- omissions are explicit and justified;
- unsupported or conflicted content is blocked rather than polished into plausibility;
- a different Template can consume the same candidate model without requiring the candidate's factual history to be rewritten.

## Failure watch

Watch for:

- using a previous resume's section placement as the semantic model;
- treating Template placeholders as candidate data fields;
- replacing employer-of-record with a client because the Template has one employer line;
- merging repeated employment periods for visual convenience;
- promoting a role-specific descriptor, keyword, or summary into canonical candidate data;
- silently discarding projects, certifications, engagements, or achievements that do not fit the chosen Template;
- treating a successful mapping as proof of ATS compatibility or document accessibility;
- copying content from another candidate context.

## Output contract

Return or record:

- active candidate-context reference and Resume Content Model revision;
- Template ID, source path, slot-manifest path, and verified Git revision;
- target role/application reference when applicable;
- material mapping table with source node, destination slot, result state, and reason;
- unmapped, blocked, or omitted-with-reason content;
- candidate-specific overlays applied;
- validation results and what was not checked;
- resulting private artifact reference when one was created;
- smallest next action.

## Boundaries

- Evidence remains authoritative for material facts; this Skill does not upgrade normalized content into source evidence.
- `rickvang/template-library` owns Template-specific slot manifests and starter structure.
- Candidate-specific normalized data stays private and must not be committed to Persona-Library or `template-library`.
- This Skill does not create a renderer, generator platform, synchronization service, schema registry, or submission capability.
- External submission or sharing remains a separately authorized action.

See `docs/job-search/resume-template-mapping.md` for the canonical mapping contract.
