# Application packet artifact separation Work Order

## Header

- Work Order ID: WO-2026-09-16-application-packet-artifacts
- Title: Separate and folder full application-packet artifacts
- Status: active
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository owner
- Current owner: job-search process update
- Request mode: update
- Primary space: Docs
- Issue: #120
- Artifact home: `docs/work-orders/WO-2026-09-16-application-packet-artifacts/`
- Explicit authorization and target: update the Persona-Library application-packet process so full packets use separate artifacts in one role-specific private folder
- Stopping condition: PR is review-ready with the storage/artifact contract routed into application work and validation limits recorded

## Outcome

Make a full application packet a role-specific foldered set of separate artifacts rather than one combined document.

Default full-packet outputs:

1. ATS resume
2. standalone cover letter
3. Application Notes & Answers

Use the candidate-configured private application root and a human-findable folder name such as `<Company> — <Role> — <YYYY-MM-DD>`. Do not publish private Drive IDs or candidate-specific workspace links in Persona-Library.

## Placement and boundary review

Mara placement result:

- Existing owner: `docs/job-search/application-work-order-template.md` already owns application-packet output and review requirements.
- Routing surface: `content/orientation/docs.json` / `resume-application-work` should explicitly read that template for full packet runs.
- No new Playbook, Persona, Skill, Operating Pack, Template identity, or runtime is warranted.
- No Decision record is required for this scoped operational clarification; issue #120 and this Work Order preserve the rationale and change history.
- Private application storage remains outside Persona-Library; the public repository stores only the reusable contract.

## Scope

Required:

- Define the role-specific folder naming convention.
- Require separate ATS resume, cover letter, and notes/answers artifacts for a full application packet by default.
- Make the standalone cover letter default for a full packet, with explicit skip reasons.
- Add an artifact-packaging gate before `ready-for-review`.
- Route `resume-application-work` through the application Work Order template.

Non-goals:

- No job application tracker.
- No new private-state runtime.
- No change to seen-job deduplication.
- No change to Riley/Priya/specialist ownership.
- No submission authorization.

## Success criteria

- The application Work Order template states that a full packet is a foldered artifact set, not one combined document.
- The template defines one role-specific folder and separate ATS resume, cover letter, and notes/answers files.
- The cover letter cannot exist only as embedded text in notes.
- The Docs application route requires the template as a first read and rejects combined-document packet behavior.
- Private workspace identifiers remain outside the repository.
- Existing ATS-first, evidence-integrity, and external-submission boundaries remain intact.

## Progress

| Phase | Status | Evidence / result | Next action |
| --- | --- | --- | --- |
| Inspect current application process | complete | Existing template already owns output contract; route did not require it as a first read | Update canonical owner and route |
| Placement / boundary review | complete | Existing template + Docs route are sufficient; no new domain record warranted | Implement scoped change |
| Update application packet contract | complete | Folder naming, separate artifacts, standalone cover letter, notes artifact, and ready-for-review packaging gate added | Reconcile route |
| Update application route | complete | `resume-application-work` now reads the application template and rejects combined-document full packets | Validate |
| Change-impact reconciliation | active | Expected impact is Docs/application workflow only; Persona, Playbook identity, Skills, decisions, and private runtime should remain unchanged | Review diff and CI |
| Validation | pending | See `validation.md` | Open PR and inspect checks |

## Evidence and limitations

- Sourced: current repository orientation and application Work Order template.
- User-confirmed requirement: full application packets should separate resume, cover letter, and notes and place them together under the configured private application workspace.
- Observed implementation correction in private workspace: current packet was reorganized into a role-specific folder with three separate documents; private identifiers are intentionally not copied here.
- Unknown until CI/review: whether generated validation has an unstated dependency on exact route text.

## Next action

Run repository validation through the pull request, perform scoped change-impact reconciliation, and move this Work Order to ready-for-review when checks are green.
