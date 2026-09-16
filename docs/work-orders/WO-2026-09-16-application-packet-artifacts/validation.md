# Validation — application packet artifact separation and Template sourcing

## Contract checks

- [x] `docs/job-search/application-work-order-template.md` defines a full application packet as a role-specific foldered artifact set rather than one combined document.
- [x] Default folder naming is explicit: `<Company> — <Role> — <YYYY-MM-DD>`.
- [x] Default full-packet artifacts are separate ATS resume, standalone cover letter, and Application Notes & Answers files.
- [x] The notes/answers artifact is explicitly barred from being the only copy of the resume or cover letter.
- [x] A standalone cover letter is default for a full packet and may be skipped only with an employer or requester reason.
- [x] `ready-for-review` requires the folder and separate artifacts to be independently openable and correctly named.
- [x] `ready-for-review` also requires each reusable artifact to have a verified `rickvang/template-library` Template source and revision, unless the requester explicitly authorizes a one-off non-reusable exception.
- [x] A missing or unverifiable Template routes to Template research/composition instead of silently using a private Drive master as the reusable source.
- [x] Private Drive IDs and candidate-specific workspace identifiers remain outside Persona-Library.
- [x] `content/orientation/docs.json` makes the application Work Order template and Template-source verification first reads for `resume-application-work`.
- [x] The application route rejects treating a full application packet as one combined document.
- [x] The application route rejects bypassing `template-library` by treating a private Drive master as the canonical reusable Template.

## External Template checks

- [x] `rickvang/template-library` README and architecture identify that repository as the canonical owner of reusable starter artifacts.
- [x] Existing resume Template resolves on current `template-library` main: `templates/resumes/classic-single-column/README.md` with non-empty `starter/` content.
- [x] Missing cover-letter and application-notes starters were identified as real gaps rather than inferred to exist.
- [x] `rickvang/template-library` issue #2 / PR #3 adds candidate Templates at `templates/cover-letters/evidence-led/` and `templates/job-applications/application-notes/`.
- [ ] The two new Template paths resolve on `template-library` **main** after PR #3 is merged. Until then, they are proposed sources and must not be represented as verified canonical main-branch Templates in Persona-Library catalog metadata.

## Boundary checks

- [x] ATS-first resume behavior is unchanged.
- [x] Human-facing resume remains conditional.
- [x] Evidence-integrity and claim-source rules are unchanged.
- [x] Riley remains the default router and Priya remains the full-outcome job-search operator.
- [x] No specialist ownership changed.
- [x] No new Playbook, Skill, Persona, Operating Pack, application tracker, or private runtime was added.
- [x] Persona-Library does not duplicate the new starter files; it only defines routing/source requirements.
- [x] External submission still requires separate explicit authorization.

## Change-impact reconciliation

Required impacts:

- Docs application Work Order contract: updated with Template-source and artifact-packaging gates.
- Docs `resume-application-work` route: updated so the application contract and Template source evidence are read during application-packet work.
- Templates boundary: confirmed `rickvang/template-library` as canonical starter owner; two missing starters are being created there rather than inside Persona-Library.
- Active Work Order: updated for issue #120.

Deferred until template-library PR #3 is merged:

- Add/verify Persona-Library Template catalog identities for `template-cover-letter-evidence-led` and `template-job-application-notes` against the merged `template-library` revision.
- Re-run Template-specific reconciliation if those new catalog records are added.

Unchanged:

- Evidence-led Job Search Playbook identity and actor/process ownership.
- Riley/Priya routing architecture.
- Job-search specialist Personas and Skills.
- Seen-job deduplication contract.
- Decision history.
- Private candidate storage contents and identifiers.

No generated Site artifact is expected from the Docs-only changes currently on PR #121. Catalog additions, if made after external Template merge, may require the normal library build.

## Repository validation

Pending or current pull-request checks:

- `node scripts/build-library.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node scripts/validate-content.mjs`
- `git diff --check`

Also verify:

- PR #121 remains mergeable after the Template-source additions;
- Vercel/status checks remain green;
- template-library PR #3 is reviewed independently and merged only with explicit authorization;
- no Persona-Library catalog record claims the new Template paths are verified on main before that merge.

If CI exposes a route-text or generated-output dependency, correct only the smallest affected surface and record it here.
