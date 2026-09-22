# Validation — Issue #185

## Required checks

- Build the new `operationalScenarios` fragment.
- Normalize owner relationships and targeted retrieval.
- Resolve all five seed owners/routes.
- Attach Skill scenarios only to their Skills and recipe scenarios only to their recipes.
- Match “implement GitHub issue”, “verify deployed preview”, and database/CMS prompts correctly.
- Require concrete do/don't, sequence, stop, good/bad trace, recovery, and evidence status.
- Preserve no-new-top-level-space and `.golden.md` test-only boundaries.
- Keep generated data/model/orientation/Decisions current.
- Run full repository validation through GitHub Actions.

## Status

Pass at the final implementation head; the archive-only closeout commit still requires the final freshness check before merge.

## Evidence

- Model preflight at `05c4b09a40b19723566015311d61018bfcdade5b`: five seed scenarios resolved with no owner/route failures; representative GitHub, Vercel, and database/CMS retrieval worked.
- Repository validation `35676727821`: failed only generated bundle whitespace freshness; all substantive validation tests passed.
- Generated bundle correction `a3d669e47950638f32d16835fcd0a6740ae63378`: matched builder output; Repository validation `35676816006` passed.
- Review then identified two P2 integrity gaps:
  1. validate every scenario rather than only the five seeds;
  2. resolve Operating Pack IDs in scenario routes.
- Correction `68209a109d581d341e40165b62c11d90054d4a02` addressed both findings.
- Repository validation `35678274016`: completed / success.
- Both review threads were replied to with correction evidence and resolved.
- No Vercel Preview was used because repository/model CI fully answers this change's correctness question.
