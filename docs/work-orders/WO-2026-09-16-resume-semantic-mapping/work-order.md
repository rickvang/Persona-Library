# Resume Semantic Mapping Work Order

## Header

- Work Order ID: `WO-2026-09-16-resume-semantic-mapping`
- Status: ready-for-review
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository user
- Current owner: ChatGPT
- Request mode: update
- GitHub issue: [#122 — Add presentation-neutral resume content model and semantic Template mapping Skill](https://github.com/rickvang/Persona-Library/issues/122)
- Persona-Library PR: [#123](https://github.com/rickvang/Persona-Library/pull/123)
- External Template issue: [rickvang/template-library#4](https://github.com/rickvang/template-library/issues/4)
- External Template PR: [rickvang/template-library#5](https://github.com/rickvang/template-library/pull/5), head reviewed at `39a89b7ebf2d73dd11ca7a724907d9a255447a1e`
- External Operating Pack issue: [rickvang/operating-packs#3](https://github.com/rickvang/operating-packs/issues/3)
- External Operating Pack PR: [rickvang/operating-packs#4](https://github.com/rickvang/operating-packs/pull/4), head reviewed at `6a69ff3fd0ef446aec3922fd7545d08ddeb0dad8`
- Explicit authorization: implement the agreed architecture; no merge authorization implied by this Work Order
- Stopping condition: open reviewable PRs with the semantic contract, Skill, Template slot manifest, Candidate Context integration, and validation evidence

## Outcome

Create a reusable, presentation-neutral resume semantic layer so one candidate's approved content can be mapped into multiple verified resume Templates without rewriting the candidate's factual history or embedding candidate data in reusable repositories.

## Architecture contract

```text
candidate evidence + standing decisions
        ↓
private normalized Resume Content Model instance
        ↓
resume-template-semantic-mapping Skill
        +
verified resume Template slot-map.json
        ↓
role-specific selection + composition
        ↓
rendered resume + layered validation
```

## Placement

See [`ia.md`](ia.md).

The implementation preserves these owners:

- Persona-Library: semantic model contract, mapping Skill, reusable validation semantics;
- template-library: Template-specific semantic slots and starter structure;
- private Candidate Application Context: candidate-specific normalized model instance and provenance references;
- private application instance: target-role selection/emphasis and rendered artifact;
- evidence sources: factual authority for material claims.

## Scope

### Persona-Library

- [x] Add `docs/job-search/resume-content-model.md`.
- [x] Add `docs/job-search/resume-content-model.schema.json`.
- [x] Add `docs/job-search/resume-template-mapping.md`.
- [x] Add `.agents/skills/resume-template-semantic-mapping/SKILL.md`.
- [x] Extend `docs/job-search/candidate-context-contract.md` for private normalized resume content and slot manifests.
- [x] Extend `docs/job-search/candidate-context-integration.md` so the callable Skill and normalized-content route are discoverable without duplicating Leah Okafor's existing skill profiles.
- [x] Validate current changed-file set, semantic boundaries, schema/manifest structure by direct patch inspection, and exposed repository checks; Persona-Library Vercel is green at current head.
- [x] Run one bounded change-impact reconciliation in [`reconciliation.md`](reconciliation.md).

### `rickvang/template-library`

- [x] Create issue #4 and implementation branch.
- [x] Add `templates/resumes/classic-single-column/slot-map.json`.
- [x] Document the semantic slot manifest in the Template README.
- [x] Extend Template architecture with an optional descriptive `slot-map.json` contract.
- [x] Inspect the current three-file PR diff and JSON manifest structure; no CI status checks are exposed for the current head.
- [x] Open PR #5 at head `39a89b7ebf2d73dd11ca7a724907d9a255447a1e`.

### `rickvang/operating-packs`

- [x] Create issue #3 and implementation branch.
- [x] Extend Candidate Application Context with optional private normalized resume content.
- [x] Extend validation for model traceability and mapping loss states.
- [x] Inspect the current two-file PR diff; no CI status checks are exposed for the current head.
- [x] Open PR #4 at head `6a69ff3fd0ef446aec3922fd7545d08ddeb0dad8`.

## Review state

At the time of this update:

- Persona-Library PR #123 is open and mergeable; Vercel reports success at current head and there are no unresolved review threads.
- template-library PR #5 is open and mergeable with an automated approval and no unresolved review threads; no commit-status checks are exposed.
- operating-packs PR #4 is open and mergeable with an automated approval and no unresolved review threads; no commit-status checks are exposed.

Merge remains a separate explicit action. If the external PRs merge before Persona-Library #123, refresh their final merge revisions in the Persona-Library integration/reconciliation evidence before merging #123.

## Non-goals

- No candidate registry.
- No public candidate content.
- No generator/runtime or synchronization service.
- No executable mapping DSL.
- No new Persona or Playbook.
- No submission or employer-contact capability.

## Success criteria

- The normalized model is presentation-neutral and candidate-neutral at the contract level.
- Private candidate instances remain outside reusable repositories.
- Material normalized nodes can retain evidence and standing-decision references.
- Employer-of-record, repeated employment periods, and nested client engagements can be represented without flattening.
- A resume Template can describe semantic destinations without owning the mapping algorithm.
- The mapping Skill reports `mapped`, `omitted_with_reason`, `blocked`, `unmapped`, or `not_applicable` for material content rather than silently dropping it.
- Role-specific selection/emphasis remains application-instance state.
- Existing evidence-integrity, ATS, document/accessibility, candidate-isolation, and submission-authorization boundaries remain intact.

## Current state

The reusable architecture is implemented and ready for review across three open PRs. No private candidate Resume Content Model instance is created by this Work Order; creating or migrating a real candidate instance is a separate private Candidate Context step after the reusable contracts are accepted.
