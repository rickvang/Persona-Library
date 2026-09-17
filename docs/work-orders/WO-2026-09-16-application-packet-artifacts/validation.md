# Validation — application packet artifact separation, Template sourcing, and candidate context

## Contract checks

- [x] `docs/job-search/application-work-order-template.md` defines a full application packet as a role-specific foldered artifact set rather than one combined document.
- [x] Default folder naming is explicit: `<Company> — <Role> — <YYYY-MM-DD>`.
- [x] Default full-packet artifacts are separate ATS resume, standalone cover letter, and Application Notes & Answers files.
- [x] The notes/answers artifact is explicitly barred from being the only copy of the resume or cover letter.
- [x] A standalone cover letter is default for a full packet and may be skipped only with an employer or requester reason.
- [x] `ready-for-review` requires the folder and separate artifacts to be independently openable and correctly named.
- [x] `ready-for-review` also requires each reusable artifact to have a verified `rickvang/template-library` Template source and revision, unless the requester explicitly authorizes a one-off non-reusable exception.
- [x] A missing or unverifiable Template routes to Template research/composition instead of silently using a private Drive master as the reusable source.
- [x] `docs/job-search/candidate-context-integration.md` defines one active private Candidate Application Context as the boundary for candidate identity/contact, goals/constraints, evidence sources, standing decisions, voice/preferences, Template preferences, candidate-specific validation overlays, and unresolved questions.
- [x] Candidate context may reference several private files; the contract does not require a new candidate database or monolithic record.
- [x] Application composition is ordered as candidate context → verified Templates → semantic mapping → generic validation → candidate overlays → role/application checks → cross-candidate isolation.
- [x] Candidate-specific validation overlays cannot create evidence or weaken material-truth/integrity rules.
- [x] A cross-candidate isolation gate rejects names, contact details, evidence, decisions, links, or assumptions from another candidate context.
- [x] Private Drive IDs, candidate-specific values, and candidate workspace identifiers remain outside Persona-Library.
- [x] `content/orientation/docs.json` makes candidate context, the application Work Order template, and Template-source verification first reads for `resume-application-work`.
- [x] The application route rejects combined-document, private-master-as-template, and cross-candidate-context bypass behavior.

## External Template checks

- [x] `rickvang/template-library` README and architecture identify that repository as the canonical owner of reusable starter artifacts.
- [x] Existing resume Template resolves on current `template-library` main: `templates/resumes/classic-single-column/README.md` with non-empty `starter/` content.
- [x] Missing cover-letter and application-notes starters were identified as real gaps rather than inferred to exist.
- [x] `rickvang/template-library` issue #2 / PR #3 adds candidate Templates at `templates/cover-letters/evidence-led/` and `templates/job-applications/application-notes/`.
- [ ] The two new Template paths resolve on `template-library` **main** after PR #3 is merged. Until then, they are proposed sources and must not be represented as verified canonical main-branch Templates in Persona-Library catalog metadata.

## External Operating Pack checks

- [x] `rickvang/operating-packs` repository instructions define Operating Packs as reusable contextual operating knowledge and keep candidate/project values outside reusable packs.
- [x] `rickvang/operating-packs` issue #1 / PR #2 adds `packs/candidate-application-context/` with `AGENTS.md` as the stable entrypoint.
- [x] The proposed pack defines candidate-context categories, source precedence, candidate isolation, Template binding, layered validation, and explicit non-goals without storing candidate instances.
- [ ] `packs/candidate-application-context/AGENTS.md` resolves on `operating-packs` **main** after PR #2 is merged. Until then, Persona-Library must treat the pack as a pending external dependency rather than a verified canonical Operating Pack record.

## Boundary checks

- [x] ATS-first resume behavior is unchanged.
- [x] Human-facing resume remains conditional.
- [x] Evidence-integrity and claim-source rules are unchanged.
- [x] Riley remains the default router and Priya remains the full-outcome job-search operator.
- [x] Avery Brooks remains a reusable synthetic candidate-role Persona rather than the actual candidate context.
- [x] No specialist ownership changed.
- [x] A new Operating Pack is warranted only for reusable candidate-context rules; it does not create a candidate registry, runtime, Persona, Skill, Playbook, or tracker.
- [x] Persona-Library does not duplicate Template starters or candidate-specific values; it only defines integration/routing requirements.
- [x] External submission still requires separate explicit authorization.

## Change-impact reconciliation

Required impacts:

- Docs application Work Order contract: already updated with Template-source and artifact-packaging gates.
- Docs candidate-context integration: added to bind existing private standing-decision/evidence concepts into one candidate boundary.
- Docs `resume-application-work` route: updated so candidate context, the application contract, and Template source evidence are read during candidate-specific application work.
- Templates boundary: confirmed `rickvang/template-library` as canonical starter owner; two missing starters are being created there rather than inside Persona-Library.
- Operating Packs boundary: reusable candidate-context rules are being created in `rickvang/operating-packs`, not embedded as candidate data in Persona-Library.
- Active Work Order: updated for issue #120.

Deferred until external PRs are merged:

- Add/verify Persona-Library Template catalog identities for `template-cover-letter-evidence-led` and `template-job-application-notes` against the merged `template-library` revision.
- Add/verify the Candidate Application Context Operating Pack catalog identity against the merged `operating-packs` revision.
- Re-run Template- and Operating-Pack-specific reconciliation when those external source records become canonical.

Unchanged:

- Evidence-led Job Search Playbook identity and actor/process ownership.
- Riley/Priya routing architecture.
- Job-search specialist Personas and Skills.
- Seen-job deduplication contract.
- Decision history.
- Private candidate storage contents and identifiers.

No generated Site artifact is expected from the Docs/orientation changes currently on PR #121. Catalog additions after external merges may require the normal library build.

## Repository validation

Pending or current pull-request checks:

- `node scripts/build-library.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node scripts/validate-content.mjs`
- `git diff --check`

Also verify:

- PR #121 remains mergeable after the candidate-context additions;
- Vercel/status checks remain green;
- template-library PR #3 is reviewed independently and merged only with explicit authorization;
- operating-packs PR #2 is reviewed independently and merged only with explicit authorization;
- no Persona-Library catalog record claims the new Template paths or Candidate Application Context pack are verified on main before those source merges.

If CI exposes a route-text or generated-output dependency, correct only the smallest affected surface and record it here.
