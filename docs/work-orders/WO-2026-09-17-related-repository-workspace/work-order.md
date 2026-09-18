# WO-2026-09-17-related-repository-workspace

## Status

- Status: active
- Created: 2026-09-17
- Last updated: 2026-09-17
- Requester: repository owner
- Current owner: ChatGPT
- Request mode: update
- Repository: `rickvang/Persona-Library`
- Working branch: `codex/persona-workspace-139`
- Parent issue: #138
- Current implementation issue: #139

## Objective

Establish a separate parent workspace repository, working name `rickvang/Persona-Workspace`, that gives Codex durable cross-repository discovery and coordination context while the five child repositories remain independent Git repositories with their own history, ownership, instructions, validation, and mutation boundaries.

This Work Order is the progress and handoff record for the broader Persona Workspace migration. The original recommendation to make `Persona-Library` the filesystem parent is superseded by #138 and #139: the target is a separate parent workspace repository.

## Canonical repository set

Live GitHub state was re-verified on 2026-09-17.

| Repository | Default branch | Parent-workspace role | Repository-local entrypoint |
| --- | --- | --- | --- |
| `rickvang/Persona-Library` | `main` | Persona system, catalog, routing, docs, decisions, playbooks, and generated Site contract | `AGENTS.md` |
| `rickvang/operating-packs` | `main` | Canonical Markdown Operating Pack files and pack-local validation | `AGENTS.md` |
| `rickvang/SkillRepo` | `main` | Skill packages and model-specific Skill variations | `README.md` currently; no root `AGENTS.md` |
| `rickvang/tool-repo` | `main` | Reusable Tool implementation and instruction artifacts | `README.md` currently; package entrypoints live under `tools/<tool-id>/AGENTS.md` |
| `rickvang/template-library` | `main` | Canonical reusable Template starter artifacts and scaffolds | `README.md` currently; no root `AGENTS.md` |

The missing child root `AGENTS.md` files are #140 concerns. They do not block creation of the parent shell.

## Architecture and boundaries

The parent workspace owns coordination and discovery only. It must not become the canonical owner of Persona, Skill, Tool, Operating Pack, Playbook, or Template content.

Instruction precedence:

1. task-specific instructions;
2. child repository-local instructions for work inside that repository;
3. shared parent workspace context for cross-repository discovery and coordination;
4. reusable domain or general guidance.

Workspace membership does not authorize mutation in a child repository. Cross-repository reads and navigation do not imply cross-repository write permission.

The parent and all children remain separate Git repositories. Do not use submodules, subtrees, history rewrites, copied source-of-truth content, or monorepo conversion.

## Placement and boundary review

Mara Okoye placement result: treat the proposed `Persona-Workspace` as an external project/repository coordination shell, not as a new Persona-Library taxonomy, record type, or source-of-truth layer.

The smallest correct parent surface is:

- root `README.md` for workspace orientation;
- root `AGENTS.md` for Codex-facing discovery, precedence, and mutation boundaries;
- `REPOSITORIES.md` for canonical repository map and ownership;
- `Persona-Workspace.code-workspace` for the named editor workspace;
- `.gitignore` that excludes `repositories/` so nested child repositories can never enter parent history;
- optional compatibility adapters such as `CLAUDE.md` only when useful and never as a completion blocker.

No canonical child artifact is duplicated in the parent.

## Authorization

The requester explicitly asked to start issue #139 and authorized creation of a private `rickvang/Persona-Workspace` repository. The requester then directed execution to use the connected GitHub plugin rather than browser fallback.

The connected GitHub plugin is authorized for repository work but its exposed actions currently do not include repository creation or an authenticated raw GitHub/gh command. No unauthenticated browser fallback will be used while the plugin-only direction is in force.

## Current phase

### Completed

- Loaded the repository orientation and pinned GitHub operating instructions.
- Re-fetched #138 and #139 and confirmed #139 is open.
- Verified that `rickvang/Persona-Workspace` does not currently exist.
- Re-verified all five canonical repositories and default branches.
- Verified current child entrypoint state.
- Established the separate-parent placement decision and parent contract.
- Created branch `codex/persona-workspace-139` from current `main` at `7959f23c7fbf7cedf6e283becacab7fe276c3213`.

### Blocker

The current GitHub plugin does not expose repository creation. Because #139 requires a new independent repository, the parent files cannot be published to their correct canonical destination until `rickvang/Persona-Workspace` exists.

This is a tooling blocker, not an architecture or Git-integrity blocker.

## Success criteria

- `rickvang/Persona-Workspace` exists as an independent repository.
- Its parent contract names all five child repositories and intended local paths.
- Codex can identify child ownership and instruction precedence from the parent.
- `repositories/` is excluded from parent history.
- No child source of truth is duplicated.
- Any non-blocking Claude/Cursor/editor gaps are recorded separately.
- #138 receives the completion handoff before #139 closes.

## Next action

Create the empty private `rickvang/Persona-Workspace` repository through an authenticated GitHub path that supports repository creation. Once it exists, use the connected GitHub plugin to add the parent shell files defined in `ia.md`, verify them from the canonical repository, then update #138 and close #139 only after the completion criteria are met.
