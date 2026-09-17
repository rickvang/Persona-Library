# Work Order: Local Video Inspection Skill

- ID: `WO-2026-09-17-local-video-inspection-skill`
- Status: ready for review
- Created: 2026-09-17
- Updated: 2026-09-17
- Requester: repository owner
- Owner: Codex
- Collaborator: Mara Okoye (placement and boundary review)
- Mode: update
- GitHub issue: [#133](https://github.com/rickvang/Persona-Library/issues/133)
- Branch: `codex/local-video-inspection-133`
- Base: `main` at `5a3ab736e8df7f5c6de2036a0675839409256381`

## Requested outcome

Create a reusable Skill from the proven local-video frame-extraction workflow so Codex can inspect a local video without uploading it or relying on browser playback, then extend it to incorporate existing captions and explicitly requested local speech-to-text.

## Authorization and constraints

The requester explicitly authorized creating the Skill. This Work Order authorizes a reviewable repository branch containing the Skill package and supporting records. It does not authorize merging, installing the Skill into the user-level catalog, publishing outside this repository, uploading source media, installing dependencies, or transcribing audio through an external service.

## Placement decision

Mara Okoye's knowledge-systems gate places the capability in the existing flat repository-local Skill namespace at `.agents/skills/local-video-inspection/`. The durable object is a procedural, reusable execution contract with a deterministic helper, so it belongs to Skills rather than Personas, Tools, Playbooks, or the canonical Skill catalog. The Work Order uses the existing `docs/work-orders/` convention. No new top-level space or production workflow is needed.

## Scope

### Included

- A discoverable `SKILL.md` with trigger, visual/transcript workflow, evidence, safety, and audio boundaries.
- `agents/openai.yaml` interface metadata.
- A Windows PowerShell 5.1 Media Foundation helper for uniform or targeted frame extraction.
- A local transcript helper that prioritizes supplied or nearby sidecars, then embedded subtitles through existing FFmpeg, then explicitly requested speech-to-text through an existing local Whisper CLI.
- Deterministic output metadata and overwrite protection.
- Real-file validation, trigger checks, and read-only downstream reconciliation.

### Excluded

- Video editing or transcoding.
- Bundling a speech model or guaranteeing automatic speech recognition when no compatible local engine is installed.
- Uploading local media to remote services.
- Browser security workarounds.
- Installing FFmpeg, codecs, Python packages, or other dependencies.
- Canonical Persona Library Skill records, Persona changes, Tool records, Playbooks, Operating Packs, generated site output, merge, or user-level installation.

## Acceptance criteria

- The package is correctly structured and its metadata names the Skill consistently.
- The helper samples a real local MP4 uniformly and at requested timestamps.
- Generated frames are readable and representative.
- The source file remains byte-for-byte unchanged.
- Existing outputs are not overwritten without explicit `-Force`.
- Existing transcripts can be normalized locally, unavailable transcript paths return an explicit status, and speech-to-text never runs without `-AllowSpeechToText`.
- Positive and negative trigger cases preserve the intended boundary.
- Reconciliation identifies any affected downstream surfaces without silently changing them.

## Evidence and status

- The helper produced six uniform interior frames from a 76.648-second, 720×1280 MP4.
- The helper produced targeted frames at 2, 18, and 55 seconds.
- Two targeted images were visually inspected and contained valid, legible video frames.
- The source SHA-256 matched before and after extraction.
- Re-running into the populated output directory failed safely without `-Force`.
- PowerShell parser validation reported zero syntax errors.
- Structural checks equivalent to the repository Skill quick validator passed.
- The official `quick_validate.py` entrypoint was attempted but could not start because PyYAML is absent from the bundled Python runtime; no dependency was installed.
- Read-only reconciliation found no required catalog, Persona, Operating Pack, client, or generated-output update.
- Transcript enhancement: an SRT sidecar was normalized locally with timestamps and markup removed; automatic sidecar discovery, unavailable fallback, source preservation, and overwrite refusal passed. The current runtime has no FFmpeg, Whisper CLI, or local model file, so embedded-subtitle and speech-to-text execution remain capability-dependent.

See [validation.md](validation.md) and [reconciliation.md](reconciliation.md) for details.

## Handoff

The branch is ready for repository-owner review. The smallest next action is to review the Skill package and decide whether to open a pull request and, separately, whether to install the Skill into a user-level catalog.

