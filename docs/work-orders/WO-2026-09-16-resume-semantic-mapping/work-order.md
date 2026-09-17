# Resume Semantic Mapping Work Order

## Header

- Work Order ID: `WO-2026-09-16-resume-semantic-mapping`
- Status: active
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository user
- Current owner: ChatGPT
- Request mode: update
- GitHub issue: [#122 — Add presentation-neutral resume content model and semantic Template mapping Skill](https://github.com/rickvang/Persona-Library/issues/122)
- External Template issue: [rickvang/template-library#4](https://github.com/rickvang/template-library/issues/4)
- External Operating Pack issue: [rickvang/operating-packs#3](https://github.com/rickvang/operating-packs/issues/3)
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

The implementation must preserve these owners:

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
- [ ] Integrate focused discoverability/quality metadata only where it does not duplicate the callable Skill contract.
- [ ] Validate schema, links, boundaries, and affected repository surfaces.
- [ ] Run change-impact reconciliation before handoff.

### `rickvang/template-library`

- [x] Create issue #4 and implementation branch.
- [x] Add `templates/resumes/classic-single-column/slot-map.json`.
- [x] Document the semantic slot manifest in the Template README.
- [x] Extend Template architecture with an optional descriptive `slot-map.json` contract.
- [ ] Validate JSON, local links, and Template boundary.
- [ ] Open PR and record its head revision.

### `rickvang/operating-packs`

- [x] Create issue #3 and implementation branch.
- [x] Extend Candidate Application Context with optional private normalized resume content.
- [x] Extend validation for model traceability and mapping loss states.
- [ ] Open PR and record its head revision.

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

Implementation is in progress across three branches. No private candidate Resume Content Model instance is created by this Work Order; that is a separate candidate-context migration/use step after the reusable contracts are reviewed.
