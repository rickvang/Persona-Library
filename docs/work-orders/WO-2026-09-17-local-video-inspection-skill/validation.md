# Validation: Local Video Inspection Skill

Date: 2026-09-17

## Package structure and metadata

| Check | Result | Evidence |
| --- | --- | --- |
| Required files | Pass | `SKILL.md`, `agents/openai.yaml`, `scripts/extract-video-frames.ps1`, and `scripts/extract-video-transcript.ps1` are present. |
| Frontmatter shape | Pass | Frontmatter was found; top-level keys are `name`, `description`, and `metadata`. |
| Skill name | Pass | `local-video-inspection` is lowercase hyphen-case and under 64 characters. |
| Description | Pass | Present, 327 characters, under 1,024 characters, and contains no angle brackets. |
| TODO placeholders | Pass | No unfinished standalone TODO marker was found. |
| Interface metadata | Pass | Display name, short description, and default prompt are present; the prompt names `$local-video-inspection`. |
| PowerShell syntax | Pass | The Windows PowerShell parser returned zero errors for both helper scripts. |
| Official quick validator | Blocked | `quick_validate.py` was invoked, but the bundled Python runtime lacks the required `yaml` module (`ModuleNotFoundError`). No package was installed. The equivalent structural assertions above were run directly. |

## Real-file execution

The fixture was a user-provided local MP4 with a decoded duration of 76.648 seconds and source dimensions of 720×1280. The media remained local and was not copied into the repository.

| Scenario | Result | Evidence |
| --- | --- | --- |
| Uniform sampling | Pass | Six frames were emitted at 1.000, 15.930, 30.859, 45.789, 60.718, and 75.648 seconds. |
| Targeted sampling | Pass | Three frames were emitted at 2.000, 18.000, and 55.000 seconds using a comma-separated timestamp argument. |
| Image integrity | Pass | Frames at 18 and 55 seconds opened successfully and showed legible frames from the expected data-table UX video. |
| Dimensions | Pass | The helper reported 720×1280 source and output dimensions within the configured 1280×1280 maximum. |
| Source preservation | Pass | Source SHA-256 was identical before and after extraction. |
| Overwrite protection | Pass | Re-running the uniform sample into the populated directory exited with code 1 and named the existing frame; `-Force` was not supplied. |
| Output contract | Pass | JSON reported the source path, duration, dimensions, sampling mode, frame count, timestamps, paths, and content types. |

## Transcript execution

| Scenario | Result | Evidence |
| --- | --- | --- |
| Explicit SRT sidecar | Pass | The helper selected the supplied sidecar and emitted a normalized UTF-8 transcript with timestamps and markup removed. |
| Automatic sidecar discovery | Pass | A same-basename SRT beside an isolated video fixture was found without `-SidecarPath`. |
| Transcript provenance | Pass | JSON identified `sidecar`, the source transcript path, normalized transcript path, line count, and local capability flags. |
| Unavailable fallback | Pass | With no sidecar, FFmpeg, or requested speech-to-text, the helper returned `status: unavailable` and a specific reason without failing visual inspection. |
| Speech-to-text permission gate | Pass | Local speech-to-text is attempted only with `-AllowSpeechToText`; it also requires existing FFmpeg, Whisper, and model-file capabilities. The helper will not trigger Whisper's model download behavior. |
| Transcript overwrite protection | Pass | Re-running into a populated transcript output directory failed without `-Force`. |
| Source preservation | Pass | The video and sidecar SHA-256 values were unchanged after transcript normalization. |

## Trigger evaluation

| Prompt | Expected routing | Result |
| --- | --- | --- |
| “What is this local MP4 about?” | Invoke | Pass: directly matches local-video inspection and summary. |
| “Sample frames from this video at 5, 10, and 20 seconds.” | Invoke | Pass: directly matches targeted local frame extraction. |
| “I cannot play this local clip; can you inspect it?” | Invoke | Pass: matches the playback-unavailable trigger. |
| “Edit this video and add captions.” | Do not invoke | Pass: editing is explicitly excluded. |
| “Summarize this YouTube URL.” | Do not invoke | Pass: remote-video research is explicitly excluded. |
| “Use the captions or locally transcribe this MP4 too.” | Invoke | Pass: transcript coverage is now part of the Skill, with local capability and permission gates. |
| “Send this MP4 to a transcription website.” | Do not perform implicitly | Pass: external upload remains separately authorized and outside the bundled helpers. |

## Limitations

- The deterministic fallback was validated only on Windows 11 with Windows PowerShell 5.1 and Media Foundation.
- FFmpeg is preferred when already present, but this change does not install it or add a separate FFmpeg wrapper.
- Embedded-subtitle extraction and Whisper execution could not be exercised in the current runtime because FFmpeg, Whisper, and a local model file are unavailable; their detection and unavailable paths were verified.
- Sparse frame sampling does not establish complete scene coverage, and captions or model-generated transcripts do not guarantee verbatim speech coverage.
- Repository-wide validation was not run against a local checkout because the project contract requires GitHub-connected repository work and forbids a local-checkout fallback. This package does not alter the content or generated-output surfaces covered by `scripts/validate-content.mjs`.

