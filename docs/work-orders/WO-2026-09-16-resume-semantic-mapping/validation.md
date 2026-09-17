# Validation — Resume Semantic Mapping

## Contract checks

| Check | Status | Evidence / result |
| --- | --- | --- |
| Placement boundary | pass | [`ia.md`](ia.md) keeps candidate data private, semantic contract/Skill in Persona-Library, and Template slots in `template-library`. |
| Resume Content Model contract | pass | `docs/job-search/resume-content-model.md` defines presentation-neutral semantics, evidence traceability, employer/period/engagement structure, and role-specific selection boundaries. |
| Machine-readable schema | pass by direct review | `docs/job-search/resume-content-model.schema.json` is present as JSON Schema draft 2020-12, declares contract version `1.0`, and its current PR patch was directly inspected. No dedicated repository JSON-schema test is exposed, so this is not a claim of runtime schema-validation execution. |
| Mapping contract | pass | `docs/job-search/resume-template-mapping.md` defines legitimate source→slot mapping, semantic-loss checks, and explicit result states. |
| Callable Skill package | pass | `.agents/skills/resume-template-semantic-mapping/SKILL.md` includes `skill_layer`, `change_mode`, `change_domain`, and `reconciliation` metadata and preserves evidence/Template boundaries. |
| Candidate Context integration | pass | `candidate-context-contract.md` and `candidate-context-integration.md` own private normalized candidate instances without making them evidence or Template content. |
| Template slot manifest | pass for review | `rickvang/template-library` PR #5 is open and mergeable at reviewed head `39a89b7ebf2d73dd11ca7a724907d9a255447a1e`; its three-file patch was inspected and has no unresolved review threads. The external change is not canonical on `main` until merged. |
| Operating Pack integration | pass for review | `rickvang/operating-packs` PR #4 is open and mergeable at reviewed head `6a69ff3fd0ef446aec3922fd7545d08ddeb0dad8`; its two-file patch was inspected and has no unresolved review threads. The external change is not canonical on `main` until merged. |
| Persona-Library repository check | pass | PR #123 is open and mergeable; Vercel reports `success` at current head `92522172ec3e82d4104f50f0bafa3f0fc59f2351`. |
| Review threads | pass | Persona-Library #123, template-library #5, and operating-packs #4 have no unresolved inline review threads at the time checked. |
| No private candidate data | pass | New reusable files contain schemas, contracts, synthetic field names, and placeholders only. No candidate instance is committed. |
| No generator/runtime | pass | Slot manifest and Skill are descriptive/operational contracts; no renderer, generator platform, registry, or synchronization service is introduced. |
| Change-impact reconciliation | pass | [`reconciliation.md`](reconciliation.md) records affected, confirmed, qualified, and unchanged surfaces. |

## Semantic edge cases inspected in the contracts

- **Direct employer / one role:** represented by one employment object with one period; maps to employment + role slots.
- **Repeated employer / separate periods:** `periods[]` remains distinct and the mapping contract prohibits merging for visual convenience when evidence/decisions require separation.
- **Employer-of-record + client engagements:** nested `engagements[]` remains under the employer period; Template slot rules prohibit replacing the employer with the client.
- **Achievement + metric/source refs:** achievement nodes retain traceability and optional metric references; mapping preserves contribution/scope/metric meaning.
- **Role-scoped versus global skills:** role/engagement skills and global categorized skills are modeled separately.
- **No summary selected:** summary is optional; selection belongs to the role-specific application instance.
- **Template without portfolio/project section:** Classic Single-Column marks selected work conditional rather than silently discarding it.
- **Valid content with no destination:** mapping state is `unmapped` or an explicit `omitted_with_reason`, not silent loss.
- **Conflicted/unknown normalized node:** blocks only affected mapping until reconciled.
- **Cross-candidate contamination:** normalized content is included in the candidate-isolation gate.

Expected behavior is to preserve structure and meaning or return `blocked`, `unmapped`, or `omitted_with_reason`; never invent, silently flatten, or silently discard material content.

## Repository checks completed

- [x] Re-fetched/inspected current changed-file sets and key contract patches.
- [x] Inspected the Resume Content Model JSON Schema patch and Classic Single-Column slot-manifest JSON patch for structure/syntax; no dedicated JSON/schema CI is exposed in those repositories.
- [x] Confirmed callable Skill frontmatter includes required repository metadata.
- [x] Inspected current PR diffs for Persona-Library, template-library, and operating-packs.
- [x] Checked CI/status where exposed: Persona-Library Vercel is green at current head; the two external repos expose no commit-status checks.
- [x] Checked unresolved review threads: none on all three PRs at the time checked.
- [x] Ran one bounded change-impact reconciliation and recorded affected/unchanged surfaces.

## Limits

- No real candidate Resume Content Model instance was created or schema-validated in this public Work Order; private candidate instantiation is a separate step.
- No rendered resume was produced from the new semantic mapping path in this Work Order, so ATS/parser, PDF/DOCX fidelity, live accessibility, and employer-channel behavior are not proven by this architecture change.
- External PR #5 and #4 remain pending until explicitly merged; Persona-Library must re-verify their final merge revisions before treating those external changes as canonical `main` dependencies.
