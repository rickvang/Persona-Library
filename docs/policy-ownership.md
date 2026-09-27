# Repository policy ownership

Status: canonical validation-owner map for repository-wide operating policy.

Root `AGENTS.md` is the activation surface. It should point to the smallest canonical contract needed for the selected work; it is not required to duplicate every delegated policy sentence.

| Policy | Canonical validated owner | Root responsibility |
| --- | --- | --- |
| Repository-plumbing vs library-semantic routing | `content/site-orientation.json` | Activate the two-path distinction and semantic bootstrap when needed. |
| Placement / Mara escalation | `content/site-orientation.json` with human-readable placement guidance in `docs/README.md` | Point to the placement gate; do not duplicate the full escalation list. |
| Work Order lifecycle, Current Work continuity, and small-change lane | `docs/work-orders.md` | Activate the recovery contract when substantial continuity or Work Order decisions matter. |
| Work Graph dispatch, authority, and read-before-retry recovery | `.agents/skills/work-graph-orchestration/SKILL.md` | Route multi-node supervision to the Work Graph capability when applicable. |
| Operational Scenario targeted retrieval | `docs/operational-knowledge.md` + `content/library-data/operational-scenarios/index.json` | Activate scenario routing when a matching Skill or Tool-use recipe needs concrete execution guidance. |
| Reusable GitHub mutation, freshness, review, merge, and linked-issue semantics | pinned `rickvang/tool-repo/.../tools/github/AGENTS.md` contract | Pin and activate the external contract. Persona-Library root remains the owner only of its repository-specific standing-completion authorization and requester overrides. |
| Generated Site provenance / cleanliness | `scripts/build-library.mjs` + `scripts/check-generated-output.mjs` | Point repository work to the build/validation gates rather than restating generated-file rules. |

## Validation rule

Validators should assert behavior at the canonical owner and only verify that root activation still points to the owner plus the minimal safety boundary. Wording-only edits to root instructions must not fail when the owned contract and activation pointer remain intact.

Delegation never weakens authorization. A pointer to a canonical owner does not grant permission, replace live-state freshness checks, or bypass validation.
