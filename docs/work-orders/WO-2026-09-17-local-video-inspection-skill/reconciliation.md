# Reconciliation: Local Video Inspection Skill

- Status: complete
- Date: 2026-09-17
- Change observed: durable repository-local Skill package extended with transcript ingestion and capability-gated local speech-to-text
- Initiating contract: `change_mode: external_execution`; `change_domain: local-media-inspection`; `reconciliation: change-impact-reconciliation`

## Scope checked

- Current `main` and work branch heads.
- `content/site-orientation.json` and the Skills route in `content/orientation/skills.json`.
- The repository-local Skill package convention and `pl-skill-creator` contract.
- `ARCHITECTURE.md`, `content/library-model.js`, and `scripts/validate-content.mjs`.
- Authored placement evidence for Mara Okoye.
- Repository code search for the Skill ID and related local-video, Media Foundation, FFmpeg, Whisper, subtitle, transcript, and frame-inspection terms.
- Canonical Skill catalog, Persona, Tool, Playbook, Operating Pack, client, and generated-output boundaries.

The review was bounded to declared repository relationships, source/provenance contracts, and default-branch code search. Search cannot prove an exhaustive dependency graph.

## Impacts

| Dependent or surface | Relationship | Class | Evidence | Confidence | Action |
| --- | --- | --- | --- | --- | --- |
| Repository-local Skill namespace | Direct package placement | Extends | The new flat package adds a discoverable execution capability under the existing `.agents/skills/` convention. | High | Add the package on the review branch. |
| Work Order index convention | Direct active-work record | Extends | The existing `docs/work-orders/` convention owns scope, authorization, evidence, and handoff for this non-trivial change. | High | Add the Work Order directory. |
| Canonical Persona Library Skill catalog | No declared relationship | Unrelated | The package is an execution Skill, not a new authored `skillLibrary` capability record; `content/library-model.js` derives the catalog from authored data. | High | No catalog mutation. |
| Personas and Persona maintenance | No declared relationship | Unrelated | No Persona owns or requires this generic local-media inspection procedure. | High | No Persona mutation. |
| Tool records and tool-use recipes | No declared relationship | Unrelated | Media Foundation is used inside the deterministic helper; the change does not claim a separately discoverable or connected Tool. | Medium | No Tool record. Revisit only if reusable tool availability must be tracked independently. |
| Playbooks and Operating Packs | No explicit application or reference found | Unrelated | Code search and the selected Skills route found no declared dependent workflow or pack. | Medium | No update. |
| Client modules and generated `dist/` outputs | Source/provenance boundary | Unrelated | No `content/`, client, template, or generated source changes are proposed. | High | Do not build or edit generated output. |
| Local media safety contract | Direct execution behavior | Extends | The Skill makes local-only sampling, source preservation, overwrite refusal, untrusted-content handling, and audio separation explicit. | High | Keep these boundaries in `SKILL.md` and the helper. |
| Transcript evidence contract | Direct execution behavior | Extends | The update adds sidecar normalization, embedded-subtitle extraction when FFmpeg exists, and explicit opt-in local Whisper routing while preserving provenance. | High | Add the transcript helper and update Skill routing. |
| Tool availability boundary | Conditional runtime dependency | Qualifies | FFmpeg and Whisper documentation does not prove either command or a local model file is installed; runtime detection found none on the validation host. | High | Report capability-dependent paths and do not install dependencies or download models. |

## Required updates

Only the Skill package and this Work Order are required for the authorized scope. No downstream repair is required.

## Optional follow-ups

- Exercise embedded-subtitle and Whisper success paths on a runtime where those commands are already installed.
- Install the Skill into a user-level catalog only after separate authorization.
- Open a pull request if the repository owner wants normal review and CI surfaces.

## Unchanged checked

Canonical Skill records, Personas, Tool records, Playbooks, Operating Packs, site content, client code, Decision history, and generated outputs were checked and remain unchanged.

## Generated outputs and validation

No generated output is stale because no source feeding `dist/` changed. The repository content validator was inspected and is aimed at authored content/model/output consistency; it was not run through a prohibited local-checkout fallback. Package-specific validation is recorded in [validation.md](validation.md).

## Blockers and incomplete visibility

There is no merge blocker. The official quick validator could not import PyYAML in the available bundled runtime; equivalent assertions passed, but that limitation remains visible. Repository search is bounded and cannot establish undeclared dependencies.

## Next action

Owner: repository owner. Target: `codex/local-video-inspection-133`. Approval needed: review the branch and separately authorize a pull request, merge, or user-level installation if desired.

