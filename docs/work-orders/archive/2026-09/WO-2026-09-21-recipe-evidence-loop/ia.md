# IA / placement — Issue #171

## Selected placement

- `eval/contract.mjs` owns the normalized comparison validation contract.
- `eval/recipe-comparison.md` explains the human-readable experimentation/review loop.
- `eval/results/recipe-comparisons/` stores low-volume sanitized comparison proofs.
- `.agents/skills/tool-discovery-and-safe-execution/SKILL.md` tells agents when/how to use the loop.

## Rejected alternatives

- New top-level Experiments/Knowledge space — duplicates eval and Tool-use ownership.
- New Skill identity — the reusable judgment already belongs to Tool discovery/safe execution.
- Tool-use recipe mutation from each run — confuses observation with canonical guidance.
- Generic Supabase observations table — no proven writer/consumer/query need.

## Boundary

Comparison evidence is not canonical preference by itself. A reviewed conclusion can support a later authorized recipe/requirement/scenario change; it never performs that mutation automatically.
