# Validation evidence

## Baseline and source checks

- Persona-Library `main` refreshed to merged #70 commit `fc3af861ec5fd9b20e605e713f647d3249580e26` before editing.
- Live issue [#75](https://github.com/rickvang/Persona-Library/issues/75) re-read through the GitHub plugin; it remains open with no comments.
- `rickvang/tool-repo` PR #2 re-read as merged; commit `94acc6082e941439d2ee532f1b1b091cd42eb923` contains `tools/github/AGENTS.md` and `README.md`.
- Current local branch started clean from `origin/main`; unrelated changes were absent.

## Checks to record

- `node scripts/validate-content.mjs` — pass: 20 Personas, 2 operators, 2 leaders, 16 specialists, and 20 workflow maps.
- `node --test scripts/validation/validation.test.mjs` — pass: 3 focused validation tests.
- `git diff --cached --check` — pass for the complete staged change, including the Work Order files.
- Focused contract check — pass: root `AGENTS.md` contains the canonical remote, direct-integration preference, refresh/fallback boundary, pinned external entrypoint, and read-versus-mutation boundary.

## Coverage and limits

The root contract is documentation and activation guidance. It does not provision GitHub access, credentials, permissions, connector connections, or merge authority. External provider behavior remains outside repository-local validation.
