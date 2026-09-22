# Validation — Issue #187

## Required

- Index stays small and routing-only.
- Scenario source files are one-per-record.
- Index/source paths are one-to-one.
- Full scenario records normalize exactly once.
- Current five scenario IDs remain present.
- Existing matcher examples still work.
- Generated library bundle is source-derived.
- Full Repository validation passes.

## Status

Pass at the final implementation head; archive-only closeout requires one final validation refresh.

## Evidence

- `index.json`: ~4 KB and limited to id/title/owner/status/path/match routing metadata.
- Five scenario bodies remain individually loadable at ~5–6.5 KB each.
- Direct preflight reconstructed the same five scenario IDs in index order.
- Build/validation source discovery is index-driven and checks directory/index one-to-one integrity.
- Repository validation run `35680800549`: completed / success.
- PR #188: Cursor approval present; no review threads at the validated head.
- Generated browser/runtime bundle remains combined by design and is not the repository-agent retrieval surface.
