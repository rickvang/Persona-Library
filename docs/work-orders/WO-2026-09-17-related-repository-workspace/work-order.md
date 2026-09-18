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
- Current implementation issue: #140
- Completed implementation issue: #139

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

The requester has since authorized cleanup of the migration tracking state so #140 and #141 can proceed from a clean baseline.

## Current phase

### Completed

- Loaded the repository orientation and pinned GitHub operating instructions.
- Re-fetched #138 and #139 and confirmed #139 is complete.
- Re-verified all five canonical repositories and default branches.
- Verified current child entrypoint state.
- Established the separate-parent placement decision and parent contract.
- Created branch `codex/persona-workspace-139` from current `main` at `7959f23c7fbf7cedf6e283becacab7fe276c3213`.
- Created and verified the private `rickvang/persona-workspace` parent repository.
- Published and verified the parent shell on `main`.
- Recorded the #139 completion handoff in #138.

### Implementation outcome

The requester created the private `rickvang/persona-workspace` repository. The connected GitHub plugin then initialized and verified the parent shell on `main`.

Published parent files:

- `README.md`
- `AGENTS.md`
- `REPOSITORIES.md`
- `.gitignore`
- `Persona-Workspace.code-workspace`
- `CLAUDE.md` as a thin optional compatibility adapter

Verification confirmed:

- all five canonical child repositories are named in the parent map;
- all five intended local paths use `repositories/<name>`;
- all current default branches are `main`;
- child repository-local instructions are authoritative for child-local changes;
- workspace membership explicitly does not grant sibling mutation authority;
- `repositories/` is ignored by the parent;
- the editor workspace uses only relative paths;
- no `.gitmodules` file exists;
- no submodule, subtree, combined-history, or copied canonical-content mechanism was introduced.

## Migration tracking

Implementation order is owned by #138:

1. #139 — parent workspace shell — **complete**
2. #140 — child repository membership adapters — **next / may proceed**
3. #141 — repository relocation and path reconciliation — **may proceed alongside #140 with checkout coordination**
4. #142 — lightweight Codex confirmation — **after the relocated workspace is usable**

Forward-progress posture:

- fix small/local issues immediately;
- log focused follow-up issues for non-critical problems;
- continue unless there is concrete risk of data loss, Git corruption, destination overwrite, or the workspace is unusable for Codex.

## Success criteria

- `rickvang/Persona-Workspace` exists as an independent repository.
- Its parent contract names all five child repositories and intended local paths.
- Codex can identify child ownership and instruction precedence from the parent.
- `repositories/` is excluded from parent history.
- No child source of truth is duplicated.
- Any non-blocking Claude/Cursor/editor gaps are recorded separately.
- #138 remains the umbrella progress record until #140, #141, and #142 are complete.

## Next action

Proceed with #140 and #141 under the ordering and coordination rules in #138. Keep this Work Order active as the broader migration progress/handoff record. #142 remains the final lightweight Codex baseline check after the relocated parent layout is usable.
