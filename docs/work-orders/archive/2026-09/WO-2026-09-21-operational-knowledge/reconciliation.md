# Reconciliation — Issue #185

## Initial cross-space review

- **Personas:** unchanged; routes reference existing Riley, Evan, and Nadia.
- **Skills:** remain authoritative; scenarios add examples without replacing operation/quality guidance.
- **Tools / recipes:** GitHub/Vercel procedures remain in recipes; scenarios add trace/freshness/stop/recovery detail.
- **Operating Packs:** unchanged and retain project/domain context ownership.
- **Playbooks:** unchanged and retain multi-stage coordination.
- **Docs / Decisions:** operational knowledge contract + DEC-023 add the boundary.
- **Golden test fixtures:** unchanged as test-only evidence.
- **Generated data:** pending source-derived refresh.

## Final reconciliation

Pass.

| Surface | Result |
| --- | --- |
| Personas | Unchanged. Riley remains orchestration owner; Evan/Nadia only receive existing Skill-owned scenarios. |
| Skills | Existing Skill identities remain the portable judgment source; scenario examples do not replace Skill operation/quality guidance. |
| Tool-use recipes | GitHub and Vercel recipes remain canonical Tool procedure; scenario examples add concrete traces, freshness, stopping, and recovery. |
| Tools | No Tool identity, permission, credential, or runtime-availability claim changed. |
| Operating Packs | Unchanged. Their IDs are now validated when referenced by scenario routes, preserving project/domain-context integrity. |
| Playbooks | Unchanged; multi-stage orchestration remains separate. |
| Golden Skill fixtures | Unchanged as callable-Skill tests, not runtime knowledge source. |
| Docs / Decisions | `docs/operational-knowledge.md` and DEC-023 define ownership, retrieval, evidence lifecycle, precedence, and revisit rules. |
| Orientation / AGENTS | Skills/Tools routing exposes matching scenarios; root contract requires smallest-relevant retrieval without changing authority. |
| Generated data | Source-derived and current after the builder-freshness correction. |
| Validation | Every scenario is validated for owner/route/evidence integrity; active scenarios require concrete execution fields. Five initial seed IDs remain explicit regression assertions. |
| New top-level space | None. |

No duplicate Persona, Skill, Tool, Operating Pack, Playbook, or competing source of truth was introduced. A dedicated Operational Knowledge space remains only a future revisit condition.
