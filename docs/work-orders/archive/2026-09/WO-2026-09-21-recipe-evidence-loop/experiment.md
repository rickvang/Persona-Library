# Experiment — Issue #171

## Stable task

Query: `implement github issue`

Repository revision: `20f40b2a98ec04200e837e216d4f33ce2cf8d089`

Shared gate:

1. resolve `scenario-github-issue-implementation`;
2. resolve owner `recipe-riley-github-efficient-change`;
3. observe at least one freshness trigger;
4. observe at least one stop condition.

## Strategy A — manifest-first

- Remote calls: 2
- Discovery payload: 4,037 bytes
- Scenario body: 6,494 bytes
- Candidates: 1 declared path
- Gate: pass
- Friction: low

## Strategy B — code-search-first

- Remote calls: 2
- Discovery payload: 19,816 bytes
- Scenario body: 6,494 bytes
- Candidates: 4
- Gate: pass
- Friction: moderate candidate filtering

## Reviewed conclusion

**Conditional.**

Prefer manifest-first when the routing index exists and is current. Keep code-search-first as fallback when the index is unavailable, stale, or cannot represent the task.

The proof does not establish universal GitHub-search or Tool superiority. It establishes one scoped execution-strategy preference under controlled conditions.

## Persistence

Keep this evidence as sanitized Git-backed review evidence. Current volume and query needs do not justify Supabase.
