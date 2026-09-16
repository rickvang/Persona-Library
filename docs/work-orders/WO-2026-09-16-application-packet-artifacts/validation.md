# Validation — application packet artifact separation

## Contract checks

- [x] `docs/job-search/application-work-order-template.md` defines a full application packet as a role-specific foldered artifact set rather than one combined document.
- [x] Default folder naming is explicit: `<Company> — <Role> — <YYYY-MM-DD>`.
- [x] Default full-packet artifacts are separate ATS resume, standalone cover letter, and Application Notes & Answers files.
- [x] The notes/answers artifact is explicitly barred from being the only copy of the resume or cover letter.
- [x] A standalone cover letter is default for a full packet and may be skipped only with an employer or requester reason.
- [x] `ready-for-review` requires the folder and separate artifacts to be independently openable and correctly named.
- [x] Private Drive IDs and candidate-specific workspace identifiers remain outside Persona-Library.
- [x] `content/orientation/docs.json` makes the application Work Order template a first read for `resume-application-work`.
- [x] The application route rejects treating a full application packet as one combined document.

## Boundary checks

- [x] ATS-first resume behavior is unchanged.
- [x] Human-facing resume remains conditional.
- [x] Evidence-integrity and claim-source rules are unchanged.
- [x] Riley remains the default router and Priya remains the full-outcome job-search operator.
- [x] No specialist ownership changed.
- [x] No new Playbook, Skill, Persona, Operating Pack, application tracker, or private runtime was added.
- [x] External submission still requires separate explicit authorization.

## Change-impact reconciliation

Required impacts:

- Docs application Work Order contract: updated.
- Docs `resume-application-work` route: updated so the contract is read during application-packet work.
- Active Work Order: added for issue #120.

Unchanged:

- Evidence-led Job Search Playbook identity and actor/process ownership.
- Riley/Priya routing architecture.
- Job-search specialist Personas and Skills.
- Seen-job deduplication contract.
- Decision history.
- Private candidate storage contents and identifiers.

No additional generated artifact is expected from these source changes.

## Repository validation

Pending pull-request checks:

- `node scripts/build-library.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node scripts/validate-content.mjs`
- `git diff --check`

If CI exposes a route-text or generated-output dependency, correct only the smallest affected surface and record it here.
