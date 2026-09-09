# Isolated Persona–Skill runner validation

## Local checks

| Check | Result | Evidence |
| --- | --- | --- |
| Module syntax | pass | `node --check eval/isolated-persona-skill.mjs` |
| Matrix generation | pass | 94 cases across 13 Personas with Skill applications and 75 unique Skill identities |
| Existing conformance fixtures | pass | `node eval/run.mjs validate` reports 10 validated cases |
| Repository content | pass | `node scripts/validate-content.mjs` reports 19 Personas and 19 workflow maps |
| Isolated result evaluation | pass | `riley-agent-workflow-architecture-smoke.json` evaluates with `PASS` |
| Isolated result scan | pass | One sanitized result scans with `PASS`; observer conformance remains `UNKNOWN` |
| Isolation leakage rejection | pass | A synthetic result loading `ui-expert` alongside Riley is rejected with `UNKNOWN` and an isolation error |

## Live Codex task smoke test

The clean smoke test used a fresh projectless Codex task with `thinking: low` and one Persona–Skill packet:

- Persona: `ai-orchestrator` / Riley Morgan;
- Skill: `skill-agent-workflow-architecture`;
- task ID: `01a086ab-38a7-74c3-a7b1-9603b3721e6f`;
- response: six required fields with `mode: answer`;
- lifecycle: created, completed, read, and archived;
- result: structural `PASS`, observer conformance `UNKNOWN` because no independent Noor observer was available.

An earlier smoke prompt allowed the child task to interpret the delegation context as an orchestration request and wait on its parent. That task was archived without a final result. The retry prompt now says to answer directly, never call task tools, and stop; the clean smoke test completed under that contract.

## Limitations

The runner does not delete task history because the current Codex tool surface exposes archiving but no reliable deletion operation. It also cannot establish independent conformance from the same runtime that created and evaluated the task. Provider parity, trace export, and semantic quality beyond the declared signals remain separate review concerns.
