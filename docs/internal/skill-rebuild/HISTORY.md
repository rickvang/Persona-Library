# Skill rebuild history

This directory preserves the evidence needed to understand the September 2026 reconstruction of Persona-Library's repository-local callable Skills without keeping completed implementation plans on the current operating path.

## Why reconstruction was needed

A historical ChatGPT conversation described several callable Skills as created or validated, but the original package files were not recoverable from the repository or available registries. The rebuild therefore treated the conversation as evidence, not as byte-for-byte source.

Current packages under `.agents/skills/` are the canonical maintained implementations. They must not be described as exact historical restorations unless original source artifacts are later recovered.

## Resulting maintained packages

The rebuild established or reconstructed the current packages for:

- `persona-library-orientation`
- `change-impact-reconciliation`
- `persona-research`
- `persona-skills`
- `persona-reconciliation`
- `persona-panel-orchestration`
- `layout-lab`
- `tool-discovery-and-safe-execution`
- `tool-record-maintenance`
- `multi-perspective-skill-synthesis`
- `playbook-composer`

The package itself, its frontmatter, current repository contracts, and repository validation are now authoritative. The completed step-by-step rebuild plans were removed from the live docs tree because they no longer own current behavior.

## Preserved evidence

Keep the comparison and golden fixtures under `tests/`. They preserve observable behavioral expectations and reconstruction limitations used by current validation/review.

Historical implementation detail remains recoverable from Git history and the linked GitHub issues/PRs. The original long-form plan set is intentionally not a current routing dependency.

## Current canonical owners

- repository activation and shortest path: `AGENTS.md`
- semantic routing: `content/site-orientation.json` + `content/orientation/*.json`
- policy owner map: `docs/policy-ownership.md`
- callable Skill behavior: `.agents/skills/<skill>/SKILL.md`
- architecture/source-of-truth boundaries: `ARCHITECTURE.md`
- executable repository validation: `scripts/validate-content.mjs` and `.github/workflows/repository-validation.yml`
- reconstruction/golden behavior evidence: `docs/internal/skill-rebuild/tests/`

## Historical source

The rebuild used the historical conversation `chatgpt-conversation://6a9e8dfb-9c18-83e9-b606-7bd0a530f604` plus repository contracts and GitHub implementation evidence. That source is provenance only; current repository files own present behavior.
