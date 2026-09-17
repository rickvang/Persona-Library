# Validation — application packet artifact separation, Template sourcing, and candidate context

## Contract checks

- [x] Full application packet is one role-specific foldered artifact set, not one combined document.
- [x] Default folder naming is `<Company> — <Role> — <YYYY-MM-DD>`.
- [x] Default full-packet artifacts are separate ATS resume, standalone cover letter, and Application Notes & Answers files.
- [x] Notes/answers cannot be the only copy of the resume or cover letter.
- [x] A standalone cover letter is default for a full packet and may be skipped only with an employer/requester reason.
- [x] Every reusable artifact requires a verified `rickvang/template-library` Template source and revision unless the requester explicitly authorizes a one-off non-reusable exception.
- [x] Missing or unverifiable Templates route to Template research/composition instead of silently using a private master as the reusable source.
- [x] Candidate-specific work binds exactly one active private Candidate Application Context before composition.
- [x] Candidate context may reference multiple private files; no public candidate registry or monolithic record is required.
- [x] Source precedence matches the Candidate Application Context Operating Pack.
- [x] Validation order matches the Operating Pack: Template structure → reusable composition/integrity → candidate-specific overlays → role/application requirements → cross-candidate isolation.
- [x] Candidate overlays cannot create evidence or weaken material-truth/integrity rules; mandatory role/application requirements govern conflicting deliverable constraints.
- [x] Cross-candidate isolation rejects values, evidence, decisions, links, or assumptions from another candidate context.
- [x] Private candidate values and workspace identifiers remain outside reusable repositories.
- [x] `content/orientation/docs.json` requires candidate context, the application Work Order template, and Template-source verification for `resume-application-work` and rejects combined-document/private-master/cross-candidate bypass behavior.

## External Template checks

- [x] `rickvang/template-library` is the canonical owner of reusable starter artifacts.
- [x] `template-resume-classic-single-column` resolves at `templates/resumes/classic-single-column`.
- [x] `template-cover-letter-evidence-led` resolves at `templates/cover-letters/evidence-led/README.md` with `starter/cover-letter.md` at merge revision `362710ea7a4b26f1f8f5669acba0f12483af5b41`.
- [x] `template-job-application-notes` resolves at `templates/job-applications/application-notes/README.md` with `starter/application-notes.md` at merge revision `362710ea7a4b26f1f8f5669acba0f12483af5b41`.
- [x] Persona-Library catalog records for the two new Templates are included in the #124 reconciliation patch with the verified revision and documentation-only runtime availability.

## External Operating Pack checks

- [x] `rickvang/operating-packs` owns reusable contextual operating knowledge rather than candidate-private values.
- [x] `packs/candidate-application-context/AGENTS.md`, `CONTEXT.md`, `VALIDATION.md`, and `README.md` resolve at merge revision `c216052321c683830333bda4c1928bb98e12b3f7`.
- [x] The pack defines candidate isolation, source precedence, Template binding, layered validation, conflict handling, and non-goals without storing candidate instances.
- [x] Persona-Library catalog registration for `operating-pack-candidate-application-context` is included in the #124 reconciliation patch with the verified revision and documentation-only runtime availability.

## Boundary checks

- [x] ATS-first resume behavior is unchanged.
- [x] Human-facing resume remains conditional.
- [x] Evidence-integrity and claim-source rules are unchanged.
- [x] Riley remains the default router and Priya remains the full-outcome job-search operator.
- [x] Avery Brooks remains a reusable synthetic candidate-role Persona rather than the actual candidate context.
- [x] No specialist ownership changed.
- [x] No candidate registry, application tracker, new runtime, new Persona, new Skill, or new Playbook was introduced.
- [x] Persona-Library does not duplicate external Template starters or candidate-specific values.
- [x] External submission still requires separate explicit authorization.
- [x] #122/#123 Resume Content Model and semantic mapping work is outside this reconciliation.

## Change-impact reconciliation

Required and addressed:

- **Docs application contract — qualifies:** duplicated precedence and validation wording is aligned to the merged Candidate Application Context Operating Pack.
- **Candidate-context docs — qualifies:** validation order now matches the pack while preserving the existing evidence and isolation boundaries.
- **Template catalog — extends:** verified records are added for `template-cover-letter-evidence-led` and `template-job-application-notes`.
- **Operating Pack catalog — extends:** a verified record is added for `operating-pack-candidate-application-context`.
- **Historical Work Order — qualifies:** pre-merge/pending dependency language is replaced with final merged revisions and the terminal Work Order is archived.

Checked and unchanged:

- Evidence-led Job Search Playbook identity and Persona-operated ownership.
- Riley/Priya routing architecture.
- Job-search specialist Personas and Skills.
- Seen-job deduplication contract.
- Decision history.
- Private candidate storage contents and identifiers.

## Repository validation status

Verified through current GitHub state:

- [x] Persona-Library PR #121 is merged as `a5c2f4cd215e6ef03804aeeb7bb02bead5f78963`; issue #120 is closed as completed.
- [x] External Template and Operating Pack paths/entrypoints resolve at the exact merged revisions cited above.
- [x] #124 branch changes are isolated from open PR #123.

Not claimed as run/passed in this reconciliation session:

- [ ] `node scripts/build-library.mjs`
- [ ] `node --test scripts/validation/validation.test.mjs`
- [ ] `node scripts/validate-content.mjs`
- [ ] `git diff --check`

`content/library-data/catalogs.js` feeds the committed generated mirror `dist/data/library-data.js`. The repository validator checks that mirror for freshness. Current `main` already has documented pre-existing generated-data staleness, and this connector-only workflow intentionally does not use a local checkout or local Git fallback. The #124 review PR must therefore expose this as a validation limitation unless an authorized repository-supported build refreshes the generated bundle.

## Result

The PR #121 contract, external dependency state, catalog identities, and historical Work Order are reconciled on the #124 branch. The remaining review limitation is generated-output/test execution; no unrun check is represented as passing.
