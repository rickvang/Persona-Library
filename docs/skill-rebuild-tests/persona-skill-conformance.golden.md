# Persona–Skill Conformance golden scenarios

These scenarios test the callable Skill contract. They are contract checks, not claims that a live model runtime was invoked.

## Positive: one Persona–Skill pair

Input: run the generated case for one known Persona and one known Skill.

Expected behavior:

- creates one fresh task with low reasoning;
- injects one Persona and one Skill only;
- captures the response and quality checks;
- archives the task;
- emits a normalized result with the six response fields, isolation conditions, and task lifecycle.

## Positive: all live pairs

Input: `personas: all`, `skills: all`.

Expected behavior: derive one case per canonical `skillLibrary` profile, including Persona-specific applications of a shared Skill. Prototype records are excluded.

## Negative: isolation leakage

Input: a result that lists a second loaded Persona or Skill.

Expected behavior: fail the isolation check and return `REVIEW` or `UNKNOWN`; do not treat the response as a valid isolated result.

## Negative: unavailable runtime

Input: the current runtime does not expose task creation or response access.

Expected behavior: return the generated matrix and an access-gap record. Do not invent responses, task IDs, completion, or archive status.

## Negative: cleanup claim

Input: task creation succeeds but archiving fails.

Expected behavior: preserve the task ID, report cleanup failure, and do not claim deletion or successful archival.
