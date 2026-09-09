# Isolated Persona–Skill results

This directory stores sanitized result bundles produced by `persona-skill-conformance`. Each case represents one Persona and one Skill in a fresh temporary task. The task is archived after the response is captured.

Generate the current matrix with:

```text
node eval/isolated-persona-skill.mjs matrix --personas all --skills all
```

Validate a result or scan the directory with:

```text
node eval/isolated-persona-skill.mjs evaluate <result.json>
node eval/isolated-persona-skill.mjs scan-results eval/results/isolated
```

The evaluator’s `PASS` is a structural and recorded quality result. Independent observer status and cross-surface parity remain separate fields. Keep raw transcripts, private prompts, credentials, and sensitive traces outside the repository.
