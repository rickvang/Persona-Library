# IA / placement review — Issue #185

## Mara placement result

**Selected:** structured Operational Scenarios attached to existing Skills and Tool-use recipes.

| Candidate | Result | Reason |
| --- | --- | --- |
| New top-level Knowledge Base | Reject for now | Duplicates ownership already expressed by Skills, recipes, Operating Packs, and Playbooks. |
| Existing `.golden.md` fixtures | Reject as canonical store | They test callable Skills; they are not normalized runtime knowledge. |
| Skill practice only | Partial | Owns judgment, but vendor call order belongs to recipes/concrete scenarios. |
| Tool-use recipes only | Partial | Cannot own architecture/frontend/data Skill examples. |
| Operating Packs only | Reject as universal home | Packs are project/domain context. |
| Playbooks only | Reject as universal home | Playbooks coordinate stages/participants. |

Operational Scenario is a structured relationship/example record with one primary Skill or Tool-use-recipe owner. It never grants permission or replaces the owner’s canonical contract. Resolve the owner first, then load the smallest matching active scenario.

Revisit a dedicated space only if scenario volume, independent lifecycle, cross-owner reuse, navigation, or retrieval requirements outgrow relationships.
