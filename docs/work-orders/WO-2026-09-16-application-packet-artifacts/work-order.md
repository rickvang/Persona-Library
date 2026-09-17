# Application packet artifact separation Work Order

## Header

- Work Order ID: WO-2026-09-16-application-packet-artifacts
- Title: Separate, folder, source, and candidate-bind application-packet artifacts
- Status: active
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository owner
- Current owner: job-search process update
- Request mode: update
- Primary space: Docs
- Secondary spaces: Templates, Operating Packs
- Issue: #120
- Artifact home: `docs/work-orders/WO-2026-09-16-application-packet-artifacts/`
- Explicit authorization and target: update the Persona-Library application-packet process so full packets use separate artifacts in one role-specific private folder, every reusable starter resolves through `rickvang/template-library`, and candidate-specific facts/decisions/preferences are loaded through one isolated Candidate Application Context boundary
- Stopping condition: PR is review-ready with storage/artifact, Template-source, candidate-context, and layered-validation contracts routed into application work and validation limits recorded

## Outcome

Make a full application packet a role-specific foldered set of separate artifacts rather than one combined document; require the canonical reusable starter for each artifact to come from `rickvang/template-library`; and make application composition explicitly consume one active private Candidate Application Context so multiple candidates can use the same reusable system without context bleed.

Default full-packet outputs:

1. ATS resume
2. standalone cover letter
3. Application Notes & Answers

Use the candidate-configured private application root and a human-findable folder name such as `<Company> — <Role> — <YYYY-MM-DD>`. Do not publish private Drive IDs, candidate-specific values, or candidate-specific workspace links in Persona-Library or reusable libraries.

## Placement and boundary review

Mara placement result, updated after the multi-candidate requirement was clarified:

- Application process owner: `docs/job-search/application-work-order-template.md` owns application-packet output, storage, Template-source, and review requirements.
- Candidate-context integration owner: `docs/job-search/candidate-context-integration.md` describes how Persona-Library consumes the reusable context contract without storing candidate instances.
- Reusable candidate-context rules belong in an Operating Pack because they are contextual operating knowledge: source precedence, candidate isolation, Template binding, and candidate-specific validation overlays. A new Candidate Application Context Operating Pack is being added in `rickvang/operating-packs` issue #1 / PR #2.
- Routing surface: `content/orientation/docs.json` / `resume-application-work` should explicitly load the candidate-context integration, active private candidate context, application template, and Template source evidence before composition.
- Canonical reusable artifact owner: `rickvang/template-library`; Persona-Library catalogs identity/applicability but does not own starter files.
- Existing resume Template: `template-resume-classic-single-column` → `templates/resumes/classic-single-column`.
- Missing reusable starters: cover letter and Application Notes & Answers. These are being created in `rickvang/template-library` issue #2 / PR #3 before they may be treated as canonical application starters.
- No new Persona, Skill, Playbook, candidate registry, application tracker, or runtime is warranted.
- No Decision record is required for this scoped operational clarification; issue #120 and this Work Order preserve the rationale and change history.
- Private application storage and private candidate context remain outside Persona-Library; public repositories store only reusable contracts and external source references.

## Scope

Required:

- Define the role-specific folder naming convention.
- Require separate ATS resume, cover letter, and notes/answers artifacts for a full application packet by default.
- Make the standalone cover letter default for a full packet, with explicit skip reasons.
- Require every reusable application artifact to resolve to a verified `rickvang/template-library` path, entrypoint, and revision before use.
- If a required Template is missing, route to Template research/composition and create it in `template-library` rather than silently using a private Drive master as the reusable source.
- Define a reusable Candidate Application Context contract that groups candidate identity/contact, goals/constraints, evidence sources, standing decisions, voice/preferences, Template preferences, candidate-specific validation overlays, and unresolved questions without storing the private values in a public/shared library.
- Require one active candidate context per candidate-specific application run and a cross-candidate isolation check before `ready-for-review`.
- Layer validation so Template structure, Persona-Library generic composition/integrity, candidate-specific overlays, role/application requirements, and candidate isolation remain distinct.
- Add Template-source, candidate-context, isolation, and artifact-packaging gates before `ready-for-review`.
- Route `resume-application-work` through candidate context, the application Work Order template, and Template catalog/source evidence.

Non-goals:

- No job application tracker.
- No candidate database or registry.
- No new private-state runtime.
- No change to seen-job deduplication.
- No change to Riley/Priya/specialist ownership.
- No submission authorization.
- No copying reusable Template starter content into Persona-Library.
- No candidate-specific facts or standing decisions in `operating-packs`.

## Success criteria

- The application process states that a full packet is a foldered artifact set, not one combined document.
- The process defines one role-specific folder and separate ATS resume, cover letter, and notes/answers files.
- The cover letter cannot exist only as embedded text in notes.
- The application workflow verifies the canonical Template source for every reusable artifact before drafting.
- Missing Templates trigger creation/repair in `rickvang/template-library`; private Drive masters are not silently treated as canonical reusable Templates.
- Candidate-specific application work identifies one active Candidate Application Context before composition.
- Candidate standing decisions, evidence, voice/preferences, Template preferences, and validation overlays are treated as one private candidate-bound context without forcing them into one monolithic file.
- Generic validation and candidate-specific overlays remain separate; an overlay cannot create evidence or weaken an integrity rule.
- A final isolation gate rejects another candidate's names, contact details, evidence, standing decisions, links, or assumptions.
- The Docs application route requires candidate context, the application template, and Template-source checks as first reads and rejects combined-document/private-master/cross-candidate bypass behavior.
- Private workspace identifiers and candidate values remain outside reusable repositories.
- Existing ATS-first, evidence-integrity, and external-submission boundaries remain intact.

## Progress

| Phase | Status | Evidence / result | Next action |
| --- | --- | --- | --- |
| Inspect current application process | complete | Existing application template owns output contract; prior ngrok run bypassed canonical Template resolution and embedded the cover letter in notes | Correct both gaps |
| Inspect canonical Template source | complete | `rickvang/template-library` architecture states it owns reusable starter files; classic single-column resume exists; cover-letter and notes starters were missing | Create missing Templates |
| Create missing reusable Templates | active | `rickvang/template-library` issue #2 and PR #3 add evidence-led cover-letter and Application Notes & Answers starters | Review and merge separately when authorized |
| Clarify multi-candidate boundary | complete | Existing standing decisions, evidence ledger, voice/preferences, and validators need one candidate-bound context contract so shared Templates/processes can serve multiple people safely | Add reusable context contract |
| Create Candidate Application Context Operating Pack | active | `rickvang/operating-packs` issue #1 / PR #2 defines context categories, source precedence, Template binding, layered validation, and isolation without storing candidate instances | Validate and merge separately when authorized |
| Add Persona-Library candidate-context integration | complete | `docs/job-search/candidate-context-integration.md` binds the external pack to existing private standing decisions/evidence concepts and defines the composition sequence | Route application work through it |
| Placement / boundary review | complete | Application docs own integration/process; `template-library` owns starters; `operating-packs` owns reusable candidate-context operating rules | Preserve boundaries in validation |
| Update application packet contract | complete | Folder naming, separate artifacts, Template source gate, standalone cover letter, notes artifact, and ready-for-review gates added | Reconcile candidate-context gate |
| Update application route | complete | `resume-application-work` now loads candidate context, Template source evidence, and application packet rules; rejects combined-document/private-master/cross-candidate bypass behavior | Validate |
| Change-impact reconciliation | active | Required impacts are Docs/application workflow, Templates relationship, and Operating Pack relationship; Persona identity, Playbook identity, Skills, decisions, and private runtime remain unchanged | Review diffs and CI |
| Validation | pending | See `validation.md` | Inspect PR checks and external dependencies |

## Evidence and limitations

- Sourced: Persona-Library orientation/application Work Order; `rickvang/template-library` README and architecture; verified classic single-column resume path; `rickvang/operating-packs` architecture/instructions.
- User-confirmed requirement: all reusable Templates used by the system belong in `template-library`; if one is missing, create it there.
- User-confirmed requirement: candidate-specific standing decisions, resume evidence/content, voice, and validators must remain tied to the candidate so another person can use the same library/process without inheriting those private rules.
- User-confirmed requirement: full application packets should separate resume, cover letter, and notes and place them together under the configured private application workspace.
- Observed implementation correction in private workspace: the ngrok packet was reorganized into a role-specific folder with three separate documents; private identifiers are intentionally not copied here.
- Current Template dependency: the new cover-letter and notes Templates are proposed in template-library PR #3 and are not canonical on `main` until that PR is merged.
- Current Operating Pack dependency: Candidate Application Context is proposed in operating-packs PR #2 and is not a canonical external Operating Pack on `main` until that PR is merged and re-verified.
- Unknown until CI/review: whether generated validation has an unstated dependency on exact route text.

## Next action

Validate Persona-Library PR #121, template-library PR #3, and operating-packs PR #2. Do not claim the two new Templates or Candidate Application Context Operating Pack as canonical external sources until their source PRs are merged and their paths/entrypoints are re-verified on each repository's `main` branch.
