# Reconciliation — Issue #187

## Initial review

- Persona identities: unchanged.
- Skill identities/guidance: unchanged.
- Tool-use recipes: unchanged.
- Operational Scenario content: unchanged; only authored storage and discovery changed.
- Operating Packs and Playbooks: unchanged.
- Runtime model semantics: unchanged.
- Generated browser bundle remains combined.
- Agent retrieval path becomes manifest-first and body-selective.

## Final

Pass.

| Surface | Result |
| --- | --- |
| Operational Scenario identity/content | Unchanged. Five records retain the same IDs and full bodies. |
| Source layout | Improved: one compact routing index plus one authored file per scenario. |
| Agent retrieval | Improved: route → index → one selected body. |
| Build | Reads scenario paths from the index and still produces one generated runtime bundle. |
| Validation | Enforces unique/safe paths, directory/index parity, routing-only index keys, one-to-one index/body/model identity, and metadata freshness. |
| Skills / Tool-use recipes / Operating Packs / Playbooks | Ownership and precedence unchanged. |
| Generated runtime | Semantics unchanged; combined bundle remains browser/runtime composition only. |
| New top-level space | None. |

No competing source of truth was introduced. If the compact index itself becomes large, the documented revisit path is to shard indexes by owner/domain behind a tiny root manifest.
