# Application packet artifact separation Work Order

## Header

- Work Order ID: WO-2026-09-16-application-packet-artifacts
- Title: Separate, folder, and source application-packet artifacts canonically
- Status: active
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository owner
- Current owner: job-search process update
- Request mode: update
- Primary space: Docs
- Secondary space: Templates
- Issue: #120
- Artifact home: `docs/work-orders/WO-2026-09-16-application-packet-artifacts/`
- Explicit authorization and target: update the Persona-Library application-packet process so full packets use separate artifacts in one role-specific private folder and every reusable starter resolves through `rickvang/template-library`
- Stopping condition: PR is review-ready with storage/artifact and Template-source contracts routed into application work and validation limits recorded

## Outcome

Make a full application packet a role-specific foldered set of separate artifacts rather than one combined document, and require the canonical reusable starter for each artifact to come from `rickvang/template-library`.

Default full-packet outputs:

1. ATS resume
2. standalone cover letter
3. Application Notes & Answers

Use the candidate-configured private application root and a human-findable folder name such as `<Company> — <Role> — <YYYY-MM-DD>`. Do not publish private Drive IDs or candidate-specific workspace links in Persona-Library.

## Placement and boundary review

Mara placement result:

- Application process owner: `docs/job-search/application-work-order-template.md` owns application-packet output, storage, Template-source, and review requirements.
- Routing surface: `content/orientation/docs.json` / `resume-application-work` should explicitly read that template and the Template catalog/source evidence for full packet runs.
- Canonical reusable artifact owner: `rickvang/template-library`; Persona-Library catalogs identity/applicability but does not own starter files.
- Existing resume Template: `template-resume-classic-single-column` → `templates/resumes/classic-single-column`.
- Missing reusable starters: cover letter and Application Notes & Answers. These are being created in `rickvang/template-library` issue #2 / PR #3 before they may be treated as canonical application starters.
- No new Playbook, Persona, Skill, Operating Pack, or runtime is warranted.
- No Decision record is required for this scoped operational clarification; issue #120 and this Work Order preserve the rationale and change history.
- Private application storage remains outside Persona-Library; the public repository stores only the reusable contract and external Template references.

## Scope

Required:

- Define the role-specific folder naming convention.
- Require separate ATS resume, cover letter, and notes/answers artifacts for a full application packet by default.
- Make the standalone cover letter default for a full packet, with explicit skip reasons.
- Require every reusable application artifact to resolve to a verified `rickvang/template-library` path, entrypoint, and revision before use.
- If a required Template is missing, route to Template research/composition and create it in `template-library` rather than silently using a private Drive master as the reusable source.
- Add Template-source and artifact-packaging gates before `ready-for-review`.
- Route `resume-application-work` through the application Work Order template and Template catalog/source evidence.

Non-goals:

- No job application tracker.
- No new private-state runtime.
- No change to seen-job deduplication.
- No change to Riley/Priya/specialist ownership.
- No submission authorization.
- No copying reusable Template starter content into Persona-Library.

## Success criteria

- The application Work Order template states that a full packet is a foldered artifact set, not one combined document.
- The template defines one role-specific folder and separate ATS resume, cover letter, and notes/answers files.
- The cover letter cannot exist only as embedded text in notes.
- The application workflow verifies the canonical Template source for every reusable artifact before drafting.
- Missing Templates trigger creation/repair in `rickvang/template-library`; private Drive masters are not silently treated as canonical reusable Templates.
- The Docs application route requires the application template and Template-source check as first reads and rejects combined-document/private-master bypass behavior.
- Private workspace identifiers remain outside the repository.
- Existing ATS-first, evidence-integrity, and external-submission boundaries remain intact.

## Progress

| Phase | Status | Evidence / result | Next action |
| --- | --- | --- | --- |
| Inspect current application process | complete | Existing application template owns output contract; prior ngrok run bypassed canonical Template resolution and embedded the cover letter in notes | Correct both gaps |
| Inspect canonical Template source | complete | `rickvang/template-library` architecture states it owns reusable starter files; classic single-column resume exists; cover-letter and notes starters were missing | Create missing Templates |
| Create missing reusable Templates | active | `rickvang/template-library` issue #2 and PR #3 add evidence-led cover-letter and Application Notes & Answers starters | Review and merge separately when authorized |
| Placement / boundary review | complete | Existing application template + Docs route own process; `template-library` owns starter artifacts | Implement scoped Persona-Library change |
| Update application packet contract | complete | Folder naming, separate artifacts, Template source gate, standalone cover letter, notes artifact, and ready-for-review gates added | Reconcile route |
| Update application route | complete | `resume-application-work` reads the application template and Template source evidence; rejects combined-document/private-master bypass behavior | Validate |
| Change-impact reconciliation | active | Required impacts are Docs/application workflow and Templates relationship; Persona, Playbook identity, Skills, decisions, and private runtime remain unchanged | Review diff and CI |
| Validation | pending | See `validation.md` | Inspect PR checks and external Template dependency |

## Evidence and limitations

- Sourced: Persona-Library orientation/application Work Order; `rickvang/template-library` README and architecture; verified classic single-column resume path.
- User-confirmed requirement: all reusable Templates used by the system belong in `template-library`; if one is missing, create it there.
- User-confirmed requirement: full application packets should separate resume, cover letter, and notes and place them together under the configured private application workspace.
- Observed implementation correction in private workspace: the ngrok packet was reorganized into a role-specific folder with three separate documents; private identifiers are intentionally not copied here.
- Current dependency: the new cover-letter and notes Templates are proposed in template-library PR #3 and are not canonical on `main` until that PR is merged.
- Unknown until CI/review: whether generated validation has an unstated dependency on exact route text.

## Next action

Validate Persona-Library PR #121, review template-library PR #3, and do not treat the two new Template paths as canonical until their source PR is merged and the paths/entrypoints are verified on `template-library` main.
