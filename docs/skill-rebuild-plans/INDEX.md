# Persona Library skill rebuild plans

This directory contains implementation plans for the custom Codex skills described in the historical conversation **Branch · Build Persona Library Site**.

These are planning artifacts only. They do not claim that the historical skill packages were recovered, and they do not create or install `.agents/skills/**/SKILL.md` packages.

## Recovery finding

The historical conversation contains several assistant claims that a skill was “created,” “version-controlled,” or “validated.” The current repository contains the Site source, generated pages, onboarding documentation, and references to those skills, but it does not contain the callable package files. The current user-level registry also contains only system skills.

Therefore:

- An exact restoration requires the original `SKILL.md`, optional `agents/openai.yaml`, and any supporting resources.
- When those files are unavailable, the plans below define a careful reconstruction from conversation evidence and current repository contracts.
- Reconstructed skills must be labeled as reconstructed or working draft; they must not be presented as byte-for-byte historical recovery.
- The old `.codex/skills` location mentioned in the conversation is treated as historical evidence. New repository-local packages should use `.agents/skills` unless the target environment explicitly requires another discoverable location.

## Package contract for the build phase

Use the system `$skill-creator` skill when implementing any plan. For each package:

```text
.agents/skills/<skill-name>/
├── SKILL.md                 required
├── agents/openai.yaml       optional UI metadata
├── references/              only for substantial conditional guidance
├── scripts/                 only for repeatable deterministic operations
└── assets/                  only for files used in generated output
```

Every `SKILL.md` must include concise YAML frontmatter with `name` and a discriminating `description`. Maintained Persona Library skills must also declare the repository contract fields:

```yaml
metadata:
  change_mode: <read_only|prototype|source_update|record_update|artifact_generation|external_execution|reconciliation_adapter>
  change_domain: <domain>
  reconciliation: <skip|persona-reconciliation|change-impact-reconciliation>
```

The exact accepted values should be checked against the current implementation contract before the first package is created. Metadata routes behavior; it never authorizes a write.

Build each skill with progressive disclosure:

1. Keep purpose, routing, boundaries, and the essential workflow in `SKILL.md`.
2. Put mode-specific schemas or long procedures in focused references only when they materially improve the skill.
3. Add scripts only when deterministic execution is safer or more reliable than repeated prose.
4. Keep automatic discovery enabled unless a deliberate explicit-only decision is recorded.
5. Run the system skill validator and the relevant behavioral tests before installation.

## Historical and repository status

| Candidate | Historical status | Repository status | Planned package |
|---|---|---|---|
| `$persona-library-orientation` | Claimed created and deployed, later reported missing | `site-orientation.json`, `AGENTS.md`, and Guide references exist | `.agents/skills/persona-library-orientation/` |
| `$change-impact-reconciliation` | Not confirmed in the referenced branch | Required by the current repository contract | `.agents/skills/change-impact-reconciliation/` |
| `$persona-research` | Claimed created and repeatedly updated | Guide and Persona data references exist | `.agents/skills/persona-research/` |
| `$persona-skills` | Claimed created and updated | Skills data, guidance, practice, and relationships exist | `.agents/skills/persona-skills/` |
| `$persona-reconciliation` | Claimed created and validated | Current architecture calls it the Persona-specific adapter | `.agents/skills/persona-reconciliation/` |
| `$persona-panel-orchestration` | Claimed created and tested | Guide prompts and architecture description exist | `.agents/skills/persona-panel-orchestration/` |
| `$layout-lab` | Claimed created and version-controlled | Prototype pages and Guide references exist | `.agents/skills/layout-lab/` |
| `$tool-discovery-and-safe-execution` | Claimed created for the Tools MVP | Tool pages and Guide references exist | `.agents/skills/tool-discovery-and-safe-execution/` |
| `$tool-record-maintenance` | Claimed built and validated | Tool catalog guidance exists | `.agents/skills/tool-record-maintenance/` |
| `Multi-perspective skill synthesis` | Claimed as a supporting Skill, without an exact historical `$` invocation | Site-level capability record and reconstructed standalone package exist | `.agents/skills/multi-perspective-skill-synthesis/` |
| `playbook-composer` | Explicitly proposed but not created | Playbooks exist, but no package is referenced | Defer until a reusable need is demonstrated |

## Dependency order

```text
persona-library-orientation
        |
        +--> persona-research ------+
        |                           |
        +--> persona-skills --------+--> persona-reconciliation
        |                                           |
        +--> persona-panel-orchestration             v
        |              |                    change-impact-reconciliation
        |              +--> multi-perspective-skill-synthesis (formation gate)
        |
        +--> layout-lab
        |
        +--> tool-discovery-and-safe-execution
                         |
                         v
                  tool-record-maintenance

playbook-composer (deferred)
  depends on orientation, panel orchestration, persona skills,
  tool resolution, and reconciliation
```

The Persona adapter should run before the universal reconciliation pass. The universal pass must not recursively invoke itself.

## Phased rebuild sequence

### Phase 0 — source recovery and naming resolution

Attempt exact recovery from any readable historical skill directory. Compare recovered files against the plans, preserving original names, metadata, policies, scripts, references, and assets where evidence supports them. If the old directory remains inaccessible, proceed as reconstruction and record that limitation.

### Phase 1 — foundation

Build and validate `$persona-library-orientation`, then `$change-impact-reconciliation`. These establish routing, mutation boundaries, and the shared post-change contract.

### Phase 2 — Persona domain

Build `$persona-research`, `$persona-skills`, and `$persona-reconciliation` in that order. Validate the domain adapter before connecting it to the universal pass.

### Phase 3 — consultation and prototyping

Build `$persona-panel-orchestration` and `$layout-lab`. Keep the multi-perspective method inside those skills initially unless an independent package is justified.

### Phase 4 — Tools

Build `$tool-discovery-and-safe-execution` first, then `$tool-record-maintenance`. Keep execution, catalog maintenance, credentials, and permissions separate.

### Phase 5 — optional composition

Reassess `Multi-perspective skill synthesis` and `playbook-composer` only after the foundational skills have real repeated usage and test evidence.

## Build-and-validate checklist

- [ ] Confirm exact historical files or record reconstruction status.
- [ ] Check for an existing package before initializing a new one.
- [ ] Create only the package directories justified by the approved plan.
- [ ] Use `$skill-creator` and preserve required frontmatter and metadata.
- [ ] Keep `SKILL.md` concise and move conditional detail to focused references.
- [ ] Validate descriptions for correct routing and non-trigger behavior.
- [ ] Run `quick_validate.py` for every package.
- [ ] Run realistic behavioral tests from the corresponding plan.
- [ ] Verify no skill assumes unavailable tools, credentials, permissions, or runtime.
- [ ] Run `node scripts/build-library.mjs` and `node scripts/validate-content.mjs` when repository content or generated output changes.
- [ ] Review the complete diff and the reconciliation report.
- [ ] Install or copy packages to a user-level registry only after explicit approval.
- [ ] Restart Codex if a restored package does not appear in discovery.

## Source evidence

- Historical source: `chatgpt-conversation://6a9e8dfb-9c18-83e9-b606-7bd0a530f604`
- Current orientation: [`content/site-orientation.json`](../../content/site-orientation.json)
- Repository activation: [`AGENTS.md`](../../AGENTS.md)
- Architecture and invariants: [`ARCHITECTURE.md`](../../ARCHITECTURE.md)
- Authored content and skill relationships: [`content/library-data.js`](../../content/library-data.js)
- Content validation: [`scripts/validate-content.mjs`](../../scripts/validate-content.mjs)

