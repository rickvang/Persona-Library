# IA — Issue #187 Operational Scenario source split

## Mara result

This is a storage/retrieval refinement of the existing Operational Scenario relationship model.

The compact index is an **entrypoint**, not a new canonical knowledge layer. Each full scenario remains the canonical execution example; the index contains only enough metadata to select the body.

## Boundary

- `index.json`: routing metadata only.
- scenario `.js` files: full authored scenario bodies.
- normalized model: owner relationships and runtime matching.
- generated bundle: browser/runtime composition only.
- Operating Packs / Skills / Tool-use recipes: unchanged ownership and precedence.

## Revisit

If the routing manifest itself grows large enough to become a context problem, split the index by owner/domain while preserving a tiny root manifest.
