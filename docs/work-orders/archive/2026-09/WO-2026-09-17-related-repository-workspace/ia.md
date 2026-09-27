# Persona Workspace parent shell contract

## Placement decision

The parent is a separate coordination repository named `Persona-Workspace`. It is not a new Persona-Library space or taxonomy and must not contain canonical Persona, Skill, Tool, Operating Pack, Playbook, or Template source content.

## Intended local layout

```text
C:\\_Projects\\Persona-Workspace\\
├─ README.md
├─ AGENTS.md
├─ REPOSITORIES.md
├─ Persona-Workspace.code-workspace
├─ .gitignore
└─ repositories\\
   ├─ Persona-Library\\
   ├─ operating-packs\\
   ├─ SkillRepo\\
   ├─ tool-repo\\
   └─ template-library\\
```

The parent repository tracks only the coordination files above. The contents of `repositories/` are independent child Git repositories and must be ignored by the parent.

## Required parent files

### README.md

Purpose:
- explain that the repository is the coordination shell for the Persona ecosystem;
- identify Codex as the baseline shared-workspace use case;
- state that children remain independent Git repositories;
- point to `AGENTS.md` for agent rules and `REPOSITORIES.md` for the canonical map;
- state the intended local `repositories/<name>` layout;
- state that child repository instructions remain authoritative inside each child.

### AGENTS.md

Minimum contract:
- this parent is for cross-repository discovery and coordination;
- discover repositories through `REPOSITORIES.md`;
- before repository-local work, enter the target child and read its local instructions/entrypoint;
- repository-local instructions win for changes inside that repository;
- cross-repository awareness never implies cross-repository mutation authorization;
- keep Git commands and writes scoped to the intended Git root;
- do not copy canonical child content into the parent;
- do not add submodules, subtrees, or combine histories;
- treat Claude/Cursor/editor parity as non-blocking unless a gap creates a concrete Git/data-integrity risk.

### REPOSITORIES.md

Each row should include:
- canonical GitHub repository;
- intended local path;
- default branch;
- repository-local entrypoint;
- canonical ownership boundary;
- mutation boundary.

Canonical entries:

| Repository | Intended local path | Branch | Entrypoint | Owns | Mutation boundary |
| --- | --- | --- | --- | --- | --- |
| `rickvang/Persona-Library` | `repositories/Persona-Library` | `main` | `AGENTS.md` | Persona system records, catalog/routing, docs, decisions, playbooks, and generated Site contract | Follow Persona-Library local contract; workspace membership grants no write permission |
| `rickvang/operating-packs` | `repositories/operating-packs` | `main` | `AGENTS.md` | Canonical Operating Pack Markdown files, authoring conventions, pack-local validation | Follow pack/repository instructions; workspace membership grants no write permission |
| `rickvang/SkillRepo` | `repositories/SkillRepo` | `main` | `README.md` until #140 adds any needed local adapter | Skill packages and model-specific variations | Follow repository-local guidance; workspace membership grants no write permission |
| `rickvang/tool-repo` | `repositories/tool-repo` | `main` | `README.md`; package-specific `tools/<tool-id>/AGENTS.md` | Reusable Tool implementation/instruction artifacts | Follow repository/package-local guidance; workspace membership grants no write permission |
| `rickvang/template-library` | `repositories/template-library` | `main` | `README.md` until #140 adds any needed local adapter | Reusable Template starters and scaffolds | Follow repository-local guidance; workspace membership grants no write permission |

### .gitignore

Required intent:

```gitignore
# Child repositories are independent Git roots and must never be absorbed
# into Persona-Workspace history.
repositories/
```

Do not add negation rules that permit child contents back into the parent history.

### Persona-Workspace.code-workspace

The manifest should open:
- the parent root; and
- each of the five child repositories under `repositories/`.

It should not encode machine-specific absolute paths.

Recommended structure:

```json
{
  "folders": [
    { "name": "Persona Workspace", "path": "." },
    { "name": "Persona-Library", "path": "repositories/Persona-Library" },
    { "name": "operating-packs", "path": "repositories/operating-packs" },
    { "name": "SkillRepo", "path": "repositories/SkillRepo" },
    { "name": "tool-repo", "path": "repositories/tool-repo" },
    { "name": "template-library", "path": "repositories/template-library" }
  ],
  "settings": {}
}
```

### CLAUDE.md

Optional only. If added, keep it as a thin compatibility adapter pointing to `AGENTS.md` and `REPOSITORIES.md`; do not duplicate the contract. Absence of a Claude adapter does not block #139.

## Verification checklist

After the parent repository exists:

1. Fetch every parent file back from GitHub.
2. Confirm all five repository names, local paths, and default branches are present.
3. Confirm the precedence rule explicitly makes child-local instructions authoritative for child changes.
4. Confirm mutation boundaries explicitly deny implied cross-repository write authorization.
5. Confirm `.gitignore` excludes `repositories/`.
6. Confirm the workspace manifest uses relative paths only.
7. Confirm no submodule configuration or copied canonical child content exists.
8. Record non-blocking editor/agent gaps as focused follow-up issues if warranted.
9. Update #138 with outcome, deviations, issues, follow-ups, and whether #140/#141 can proceed.
