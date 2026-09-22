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

## Current evidence

The live comparison passed both candidate validation gates and produced a conditional manifest-first/fallback conclusion. Repository CI pending.
