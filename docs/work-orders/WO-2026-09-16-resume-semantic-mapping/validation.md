# Validation — Resume Semantic Mapping

## Contract checks

| Check | Status | Evidence / result |
| --- | --- | --- |
| Placement boundary | pass | [`ia.md`](ia.md) keeps candidate data private, semantic contract/Skill in Persona-Library, and Template slots in `template-library`. |
| Resume Content Model contract | pass | `docs/job-search/resume-content-model.md` defines presentation-neutral semantics, evidence traceability, employer/period/engagement structure, and role-specific selection boundaries. |
| Machine-readable schema | pass by direct review | `docs/job-search/resume-content-model.schema.json` is JSON Schema draft 2020-12 and declares contract version `1.0`. No claim is made here that a dedicated runtime schema validator executed. |
| Mapping contract | pass | `docs/job-search/resume-template-mapping.md` defines legitimate source→slot mapping, semantic-loss checks, and explicit result states. |
| Callable Skill package | pass | `.agents/skills/resume-template-semantic-mapping/SKILL.md` includes required repository metadata and preserves evidence/Template boundaries. |
| Leah Okafor Persona application | pass | The callable Skill explicitly identifies Leah Okafor / `application-editor` as the primary Persona application and adds focused checks for semantic fit, evidence fidelity, structural fidelity, loss visibility, role-instance isolation, candidate isolation, and downstream-validation boundaries. |
| Candidate Context integration | pass | `candidate-context-contract.md` and `candidate-context-integration.md` own private normalized candidate instances without making them evidence or Template content, and preserve the current Candidate Application Context precedence/validation order. |
| Application Work Order binding | pass | `application-work-order-template.md` records Resume Content Model reference/revision/schema, Template slot-map path/revision, material `unmapped` / `blocked` / `omitted_with_reason` content, semantic-mapping validation, and downstream validation separately. |
| Template slot manifest dependency | external review | `rickvang/template-library` PR #5 is open at reviewed head `39a89b7ebf2d73dd11ca7a724907d9a255447a1e`; the external change is not canonical on `main` until separately merged. |
| Operating Pack integration dependency | external review | `rickvang/operating-packs` PR #4 is open at reviewed head `6a69ff3fd0ef446aec3922fd7545d08ddeb0dad8`; the external change is not canonical on `main` until separately merged. |
| No private candidate data | pass | Reusable files contain schemas, contracts, field names, and placeholders only. No candidate instance is committed. |
| No generator/runtime | pass | Slot manifest and Skill remain descriptive/operational contracts; no renderer, generator platform, registry, or synchronization service is introduced. |
| Change-impact reconciliation | pass | [`reconciliation.md`](reconciliation.md) records affected, confirmed, qualified, and unchanged surfaces. |
| PR #123 reconciliation | pass | Branch head `fe2da3e306064fbec0683114a1ecd2e5a40d79a5` reconciles current `main` `734024f1858f33fc608d4f818fd5bfc5c18a595e`; GitHub reports PR #123 mergeable. |
| Current deployment check | pass | Vercel reports `success` for reconciled head `fe2da3e306064fbec0683114a1ecd2e5a40d79a5`. |
| Diff scope | pass | PR #123 contains 11 changed files: the original semantic model/mapping/Work Order package plus the reusable `docs/job-search/application-work-order-template.md` update required by #122. |

## Semantic edge cases represented in the contracts

- **Direct employer / one role:** represented by one employment object with one period; maps to employment + role slots.
- **Repeated employer / separate periods:** `periods[]` remains distinct and the mapping contract prohibits merging for visual convenience when evidence/decisions require separation.
- **Employer-of-record + client engagements:** nested `engagements[]` remains under the employer period; Template slot rules prohibit replacing the employer with the client.
- **Achievement + metric/source refs:** achievement nodes retain traceability; mapping preserves contribution/scope/metric meaning.
- **Role-scoped versus global skills:** role/engagement skills and global categorized skills are modeled separately.
- **No summary selected:** summary is optional; selection belongs to the role-specific application instance.
- **Template without portfolio/project section:** valid content must be `unmapped` or `omitted_with_reason`, not silently discarded.
- **Conflicted/unknown normalized node:** blocks only affected mapping until reconciled.
- **Cross-candidate contamination:** normalized content is included in the candidate-isolation gate.
- **Downstream quality:** successful semantic mapping does not imply ATS, parser, accessibility, visual, or export success.

Expected behavior is to preserve structure and meaning or return `blocked`, `unmapped`, or `omitted_with_reason`; never invent, silently flatten, or silently discard material content.

## Repository checks completed

- [x] Re-read current `main`, issue #122, PR #123, and the repository orientation/mutation contract.
- [x] Re-read external PR #5 and PR #4 state before relying on their interfaces.
- [x] Reviewed the existing #123 changed-file set and identified the missing Work Order and Leah Persona-application acceptance items.
- [x] Reconciled Candidate Context wording against the current merged precedence and validation order rather than preserving stale branch ordering.
- [x] Added the missing application Work Order fields and focused Leah mapping-quality guidance.
- [x] Recorded bounded change-impact reconciliation.
- [x] Reconciled the branch with current `main` and re-fetched PR #123.
- [x] Confirmed PR #123 is mergeable at reconciled head.
- [x] Confirmed Vercel reports success at reconciled head.
- [x] Confirmed changed-file scope is the intended 11 files.

## Limits

- No real candidate Resume Content Model instance was created or schema-validated in this public Work Order; private candidate instantiation is a separate step.
- No rendered resume was produced from the new semantic mapping path in this Work Order, so ATS/parser, PDF/DOCX fidelity, live accessibility, and employer-channel behavior are not proven by this architecture change.
- External PR #5 and PR #4 remain pending until separately merged; Persona-Library must re-verify their final merge revisions before treating those external changes as canonical dependencies.
- PR #123 has not been merged and issue #122 has not been closed because those actions require separate authorization.
