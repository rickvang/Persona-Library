# Validation — Resume Semantic Mapping

## Contract checks

| Check | Status | Evidence / expected result |
| --- | --- | --- |
| Placement boundary | pass | [`ia.md`](ia.md) keeps candidate data private, semantic contract/Skill in Persona-Library, and Template slots in `template-library`. |
| Resume Content Model contract | pass | `docs/job-search/resume-content-model.md` defines presentation-neutral semantics and evidence traceability. |
| Machine-readable schema | pending check | `docs/job-search/resume-content-model.schema.json` must parse as JSON and declare schema version `1.0`. |
| Mapping contract | pass | `docs/job-search/resume-template-mapping.md` defines legitimate source→slot mapping and explicit loss states. |
| Callable Skill package | pass | `.agents/skills/resume-template-semantic-mapping/SKILL.md` has required metadata and preserves evidence/Template boundaries. |
| Candidate Context integration | pass | `docs/job-search/candidate-context-contract.md` owns private normalized candidate instances without making them evidence. |
| Template slot manifest | pending external PR | `rickvang/template-library#4` adds `slot-map.json` to Classic Single-Column Resume. |
| Operating Pack integration | pending external PR | `rickvang/operating-packs#3` adds normalized resume-content guidance and validation. |
| No private candidate data | pass | New reusable files contain schemas, contracts, and placeholders only. |
| No generator/runtime | pass | Slot manifest and Skill are descriptive/operational contracts; no renderer or synchronization service is introduced. |

## Semantic edge cases to inspect

- direct employer with one role and no client engagements;
- one employer with multiple distinct employment periods;
- employer-of-record with one or more nested client engagements;
- achievement with a metric and source references;
- role-scoped skills versus global skill categories;
- no summary selected for a target role;
- Template without a dedicated portfolio/project section;
- valid candidate content with no legitimate Template destination;
- conflicted or unknown normalized node;
- another candidate's content accidentally introduced into the model or artifact.

Expected behavior: preserve structure and meaning, or return `blocked`, `unmapped`, or `omitted_with_reason`; never invent, silently flatten, or silently discard material content.

## Repository checks before review

- [ ] Re-fetch all changed files from the branch.
- [ ] Confirm JSON syntax for the Resume Content Model schema.
- [ ] Confirm callable Skill frontmatter includes `skill_layer`, `change_mode`, `change_domain`, and `reconciliation`.
- [ ] Inspect current PR diff after creation.
- [ ] Check CI / Vercel status where exposed.
- [ ] Check unresolved review threads.
- [ ] Run one bounded change-impact reconciliation and record affected/unchanged surfaces.

Do not claim a repository test or generated build passed unless current check evidence exists.
