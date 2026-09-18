# WO-2026-09-18 — Candidate Baseline Resume workflow repair

- Status: merge-authorized
- Created: 2026-09-18
- Last updated: 2026-09-18
- Requester: Rick Vang
- Current owner: ChatGPT / implementation agent
- Request mode: update
- Tracking issue: [#148 — Repair application workflow around candidate baseline resumes](https://github.com/rickvang/Persona-Library/issues/148)
- Persona-Library draft PR: [#149](https://github.com/rickvang/Persona-Library/pull/149)
- Operating Pack companion draft PR: [rickvang/operating-packs#6](https://github.com/rickvang/operating-packs/pull/6)
- Authorized repository targets: `rickvang/Persona-Library` and `rickvang/operating-packs`
- Authorized change: repair the job-application workflow after the Tessera Labs regression
- Stopping condition: merge the two reviewed branches after explicit requester authorization, while preserving the known validation gap

## Problem

The Tessera Labs application packet bypassed the candidate's active Google Docs standing decisions and designated master resume, then reconstructed the resume from stale/secondary material. The result dropped recent employers, changed chronology/contact data, weakened evidence, and diverged from the approved ATS baseline.

The September 16–17 Candidate Context, Resume Content Model, and Template semantic-mapping work correctly separates reusable Templates from candidate evidence, but does not make an explicitly designated private master a first-class composition baseline. That gap permits a compliant-looking workflow to reconstruct the candidate's career spine from secondary sources.

## Placement review

The repair extends existing surfaces rather than creating a new top-level concept space:

- Candidate Application Context owns the private Candidate Baseline Resume reference and source precedence.
- Persona-Library job-search Docs own application composition, Work Order fields, semantic-mapping boundaries, routing, and regression validation.
- `rickvang/template-library` remains the owner of reusable presentation starters and is not modified.
- Evidence remains the authority for factual claims.
- The Candidate Baseline Resume is a private composed artifact, not evidence and not a reusable Template.
- No new Persona, Playbook, Template, application tracker, or public candidate record is created.

## Success criteria

1. A standing-decision-designated baseline/master cannot be skipped silently.
2. The exact baseline source/revision is resolved before resume composition.
3. Secondary profile stores cannot substitute for an unresolved authoritative baseline.
4. Template verification remains separate from baseline verification.
5. The protected career spine is compared from baseline to role-specific output before ready-for-review.
6. Material deviations require evidence/decision support; omissions use `omitted_with_reason`.
7. Semantic mapping remains available for alternate Templates without forcing reconstruction of a designated baseline.
8. Candidate Context Operating Pack and Persona-Library contracts agree.
9. Focused regression validation prevents removal of the baseline gate.
10. No merge occurs without separate authorization.

## Current phase

Implementation and reconciliation are complete. Rick Vang explicitly authorized merge in chat on 2026-09-18 at 10:51 AM CT despite the documented command-runner validation gap. The Operating Pack dependency merged first as PR #6 at `36b1336d5a8edf4c91b5016ed66d7e5e64a5e9d6`; Persona-Library is authorized to merge after pinning that revision.

## Current evidence

- Private standing-decision record explicitly designates `Rick Vang Resume — Master Template` as the active baseline.
- The designated master preserves Quva BrightStream, CBRE, two separate STG periods, Adobe and Idaho National Lab as direct employers, approved contact details, 13 years of experience, certifications, and grouped historical experience.
- The failed Tessera packet omitted or altered several of those protected elements.
- Current reusable Template and normalized-content contracts did not contain a first-class Candidate Baseline Resume layer.

## Result

- Candidate Baseline Resume is now explicit in the Candidate Context, composition, Work Order, semantic-mapping, routing, and validation contracts.
- The reusable Template contract remains intact and `rickvang/template-library` is unchanged.
- DEC-015 records the durable baseline-vs-Template boundary.
- Focused route and generated-output parity checks pass through the connected GitHub source.
- Persona-Library Vercel status is green on the current branch head.
- No GitHub Actions workflow is attached to the PR head; the canonical Node build/validation commands remain unexecuted and are a pre-merge requirement.

## Next action

Merge Persona-Library PR #149 after pinning the merged Operating Pack revision. The canonical Node checks remain unexecuted and must stay recorded as a known validation limitation rather than being reported as passed.
