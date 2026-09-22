# Validation — Issue #171

## Required checks

- Comparison schema requires stable Skill/workflow/task/environment identity.
- At least two strategies and one shared validation gate are required.
- Material controlled/uncontrolled differences remain explicit.
- Optional metrics are recorded only when observed.
- Hidden composite scores are rejected.
- Unreviewed comparisons surface only `insufficient-evidence`.
- Reviewed conclusions support preferred/conditional/fallback/insufficient-evidence.
- Non-comparable runs cannot produce a conclusive disposition.
- Canonical guidance mutation remains a separate authorized update.
- Supabase requires a proven writer, consumer, query, and follow-up issue.
- Proof fixture validates and documentation preserves evidence boundaries.
- Full Repository validation passes.

## Final evidence

- Live comparison passed both candidate validation gates.
- Manifest-first: 2 calls, 4,037-byte discovery payload, 1 candidate.
- Code-search-first: 2 calls, 19,816-byte discovery payload, 4 candidates.
- Reviewed conclusion: conditional manifest-first preference with code-search fallback.
- Source-level schema preflight: pass.
- Repository validation run `35682858750`: pass.
- Focused comparison test is part of the Repository validation workflow.
- No Supabase writer/consumer/query need was demonstrated.
